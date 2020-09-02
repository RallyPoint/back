import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post, UnauthorizedException
} from '@nestjs/common';
import {AuthService} from '../service/auth.service';
import {CreateUserDto, UserResponseDto} from '../../users/dto/user.dto';
import {GithubService} from "../service/github.service";
import {UserService} from "../../users/service/user.service";
import {UserEntity} from "../../users/entity/user.entity";
import {SSO_TYPE, USER_ROLE} from "../constants";
import {LoginDto} from "../dto/loginDto";
import {githubDto} from "../dto/githubDto";
import {ResetPasswordDto} from "../dto/ResetPasswordDto";
import {AuthentificationResponseDto} from "../dto/CreateUserResponseDto";
import {JwtModel} from "../model/jwt.model";
import {JwtPayload} from "../decorator/jwt-payload.decorator";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private readonly githubService: GithubService, private readonly userService: UserService) {}


  @Post('resetPassword')
  public async resetPassword(@Body() body: ResetPasswordDto): Promise<Boolean>{
    return this.userService.createResetPassword(body.email);
  }

  @Post('github-login')
  public async githubLogin(@Body() body: githubDto): Promise<AuthentificationResponseDto>{
    throw new HttpException({
      miss : ["email"]
    },HttpStatus.BAD_REQUEST);

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
    return new AuthentificationResponseDto({
      user: user,
      access_token: this.authService.generateToken(user)
    });
  }


  @Post('login')
  async login(@Body() body: LoginDto): Promise<AuthentificationResponseDto> {
    const user: UserEntity =  await this.authService.validateUser(body.email,body.password);
    return new AuthentificationResponseDto({
      user: user,
      access_token: this.authService.generateToken(user)
    });
  }

  @Post('register')
  async register(@Body() data: CreateUserDto): Promise<AuthentificationResponseDto> {
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
      access_token: this.authService.generateToken(user)
    });

  }
  @Post('refresh')
  async refresh(@JwtPayload() jwtPayload: JwtModel): Promise<AuthentificationResponseDto> {
    const user: UserEntity = await this.userService.getById(jwtPayload.id);
    return new AuthentificationResponseDto({
      user: <UserResponseDto>user,
      access_token: this.authService.generateToken(user)
    });
  }
}
