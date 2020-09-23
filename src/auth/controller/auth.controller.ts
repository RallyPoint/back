import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post, Req, UnauthorizedException
} from '@nestjs/common';
import {AuthService} from '../service/auth.service';
import {CreateUserDto, UserResponseDto} from '../dto/user.dto';
import {GithubService} from "../service/github.service";
import {UserService} from "../../users/service/user.service";
import {UserEntity} from "../../users/entity/user.entity";
import {SSO_TYPE, USER_ROLE} from "../constants";
import {LoginDto} from "../dto/loginDto";
import {githubDto} from "../dto/githubDto";
import {ResetPasswordDto} from "../dto/ResetPasswordDto";
import {AuthentificationResponseDto} from "../dto/CreateUserResponseDto";
import {AccessTokenModel} from "../model/access-token.model";
import {JwtPayload} from "../decorator/jwt-payload.decorator";
import {RefreshTokenPostDTO} from "../dto/refresh-token";
import {RefreshTokenModel} from "../model/refresh-token.model";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private readonly githubService: GithubService, private readonly userService: UserService) {}


  @Post('resetPassword')
  public async resetPassword(@Body() body: ResetPasswordDto): Promise<Boolean>{
    return this.userService.createResetPassword(body.email);
  }

  @Post('github-login')
  public async githubLogin(@Body() body: githubDto, @Req() req: any): Promise<AuthentificationResponseDto>{
    let data = await this.githubService.getUser(body.code);
    let user: UserEntity;
    try {
      // Authentification
      user = await this.userService.findOneBySSOId(data.id, SSO_TYPE.GITHUB);
    }catch (e) {
      data = Object.assign(data,body);
      if(!data.email){
        throw new HttpException({
          miss : ["email"]
        },HttpStatus.BAD_REQUEST)
      }
      try {
        // Inscription
        user = await this.userService.findOneByEmail(data.email,SSO_TYPE.GITHUB);
      }catch (e) {
        user = await this.userService.create(
            data.email,
            data.login,
            data.name,
            "",
            SSO_TYPE.GITHUB,
            null,
            data.id
        );
      }
    }
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':').slice('-1')[0];
    return new AuthentificationResponseDto({
      user: user,
      accessToken: this.authService.generateAccessToken(user),
      refreshToken: this.authService.generateRefreshToken(user, ip)
    });
  }


  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: any): Promise<AuthentificationResponseDto> {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':').slice('-1')[0];
    const user: UserEntity =  await this.authService.validateUser(body.email,body.password);
    return new AuthentificationResponseDto({
      user: user,
      accessToken: this.authService.generateAccessToken(user),
      refreshToken: this.authService.generateRefreshToken(user, ip)
    });
  }

  @Post('register')
  async register(@Body() data: CreateUserDto, @Req() req: any): Promise<AuthentificationResponseDto> {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':').slice('-1')[0];
    const user: UserEntity = await this.userService.create(
        data.email,
        data.pseudo,
        "",
        "",
        SSO_TYPE.LOCAL,
        data.password
    );
    return new AuthentificationResponseDto({
      user: <UserResponseDto>user,
      accessToken: this.authService.generateAccessToken(user),
      refreshToken: this.authService.generateRefreshToken(user, ip)
    });

  }

  @Post('refresh')
  async refresh( @Body() body : RefreshTokenPostDTO, @Req() req: any): Promise<AuthentificationResponseDto> {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':').slice('-1')[0];

    let payload: RefreshTokenModel;
    try {
      payload = this.authService.valideRefreshToken(body.refreshToken);
    }catch (e) {
      throw new UnauthorizedException();
    }
    const user: UserEntity = await this.userService.getById(payload.userId);
    if (!user) { throw new UnauthorizedException(); }
    return new AuthentificationResponseDto({
      user: <UserResponseDto>user,
      accessToken: this.authService.generateAccessToken(user),
      refreshToken: this.authService.generateRefreshToken(user, ip)
    });
  }
}
