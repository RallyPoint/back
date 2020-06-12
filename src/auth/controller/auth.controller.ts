import {Body, Controller, Get, HttpException, HttpStatus, Post} from '@nestjs/common';
import {AuthService} from '../service/auth.service';
import {CreateUserDto} from '../../users/dto/user.dto';
import {GithubService} from "../service/github.service";
import {UsersService} from "../../users/service/users.service";
import {UserEntity} from "../../users/entity/user.entity";
import {SSO_TYPE, USER_ROLE} from "../constants";
import {Roles} from "../decorator/roles.decorator";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private readonly githubService: GithubService, private readonly userService: UsersService) {}


  @Post('github-login')
  public async githubLogin(@Body() body: {code:string, email?: string}): Promise<{ access_token: string }>{
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
        return {access_token: this.authService.generateToken(user)};
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
    return {access_token:this.authService.generateToken(user)};
  }


  @Post('login')
  async login(@Body() body: any) {
    const user: UserEntity =  await this.authService.validateUser(body.user,body.password);
    return {
      access_token : this.authService.generateToken(user),
      user
    };
  }

  @Post('register')
  async register(@Body() data: CreateUserDto) {

    return this.userService.create(
        data.email,
        data.pseudo,
        "",
        "",
        SSO_TYPE.LOCAL,
        data.password
    );
  }

  @Roles([USER_ROLE.USER])
  @Get('test')
  public test(){
    return { test: "test"};
  }
}
