import {
  Body,
  Controller, HttpCode,
  Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {AuthService} from '../service/auth.service';
import {GithubService} from "../service/github.service";
import {UserService} from "../../users/service/user.service";
import {AuthServerGard} from '../service/auth-server.gard';
import * as IP from 'ip';

@UseGuards(AuthServerGard)
@Controller('auth/mqtt')
export class AuthMqttController {
  constructor(private authService: AuthService, private readonly githubService: GithubService, private readonly userService: UserService) {}

  @HttpCode(200)
  @Post('user')
  public async user(@Body() body: any): Promise<any>{
    // Access for private IP
    if(IP.isPrivate(body.ipaddr)){
      return ;
    }
    return ;
  }

  @HttpCode(200)
  @Post('super-user')
  public async superUser(@Body() body: any): Promise<any>{
    // Super user for Private ip Only
    if(!IP.isPrivate(body.ipaddr)){
      throw new UnauthorizedException();
    }
    return ;
  }

  @HttpCode(200)
  @Post('acl')
  public async acl(@Body() body: any): Promise<any>{
    // R/W for private IP
    if(IP.isPrivate(body.ipaddr)){
      return ;
    }
    const regExpRule = /\/channel\/(.*)\//g;
    const regExpResult = regExpRule.exec(body.topic);
    // R for owner of channel
    if(body.access === '1' &&
        regExpResult.length === 2 &&
        regExpResult[1] === body.username){
      return ;
    }
    throw new UnauthorizedException();
  }

}

