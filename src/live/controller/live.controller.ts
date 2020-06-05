
import {Controller, Request, Post, UseGuards, Get, Body, Put} from '@nestjs/common';
import {UsersService} from "../../users/service/users.service";
import {NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {UserEntity} from "../../users/entity/user.entity";

@Controller('hls')
export class LiveController {
  constructor(protected readonly usersService: UsersService) {}

  /**
   * {
  app: 'stream',
  flashver: 'FMLE/3.0 (compatible; FMSc/1.0)',
  swfurl: 'rtmp://192.168.48.1:1935/stream',
  tcurl: 'rtmp://192.168.48.1:1935/stream',
  pageurl: '',
  addr: '192.168.64.1',
  clientid: '3',
  call: 'publish',
  name: 'dfsdsf',
  type: 'live'
}
   =po=> {
  app: 'stream',
  flashver: 'FMLE/3.0 (compatible; FMSc/1.0)',
  swfurl: 'rtmp://192.168.48.1:1935/stream',
  tcurl: 'rtmp://192.168.48.1:1935/stream',
  pageurl: '',
  addr: '192.168.64.1',
  clientid: '3',
  call: 'publish_done',
  name: 'dfsdsf'
}
   */

  @Post('publish')
  async regisater(@Body() body: NginxRtmpExternal) {
    let user: UserEntity = await this.usersService.findOneByLiveKeyUserName(body.name);
    await this.usersService.setLive(user,true);
    return user;
  }

  @Post('done')
  async register(@Body() body: NginxRtmpExternal) {
    let user: UserEntity = await this.usersService.findOneByLiveKeyUserName(body.name);
    await this.usersService.setLive(user,false);
    return user;
  }
}
