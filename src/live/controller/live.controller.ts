
import {Controller, Request, Post, UseGuards, Get, Body, Put} from '@nestjs/common';
import {UsersService} from "../../users/service/users.service";
import {NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {UserEntity} from "../../users/entity/user.entity";

@Controller('rtmp')
export class LiveController {
  constructor(protected readonly usersService: UsersService) {}

  @Post('publish')
  public async publish(@Body() body: NginxRtmpExternal) {
    let user: UserEntity = await this.usersService.findOneByLiveKeyUserName(body.name);
    await this.usersService.setLive(user,true);
    return user;
  }

  @Post('done')
  public async done(@Body() body: NginxRtmpExternal) {
    let user: UserEntity = await this.usersService.findOneByLiveKeyUserName(body.name);
    await this.usersService.setLive(user,false);
    return user;
  }


}
