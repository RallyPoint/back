
import {Controller, Post, Body, UnauthorizedException, HttpService, Req} from '@nestjs/common';
import {INginxRtmpRecordNotification, NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {LiveService} from "../service/live.service";
import {LiveEntity} from "../entity/live.entity";
import {ReplayService} from "../service/replay.service";
import {UserService} from "../service/user.service";
import {UserEntity} from "../entity/user.entity";


/**
 * @todo: ADD IP RESTRICTION !!!
 */
@Controller('rtmp')
export class LiveController {
  constructor(protected readonly liveService: LiveService,
              protected readonly userService: UserService,
              protected readonly replayService: ReplayService) {}

  @Post('publish')
  public async publish(@Body() body: NginxRtmpExternal, @Req() req: any) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      console.log(body,ip);
    const live: LiveEntity = await this.liveService.getByKey(body.psk);
    if(!live || live.user.pseudo != body.name){ throw new UnauthorizedException(); }
    return await this.liveService.setStatus(live.id,true).then((success)=>{
      if(success){
        console.log("SUCCESS");
        return {};
      }else{
        console.log("FAIL");
        throw new UnauthorizedException();
      }
    }).catch(console.log);
  }

  @Post('done')
  public async done(@Body() body: NginxRtmpExternal) {
    const user: UserEntity = await  this.userService.getByName(body.name,true);
    if(!user){ throw new UnauthorizedException(); }
    return await this.liveService.setStatus(user.live.id,false).then((success)=>{
      if(success){
        console.log("SUCCESS");
        return {};
      }else{
        throw new UnauthorizedException();
      }
    });
  }

  @Post('record')
  public async record(@Body() body: INginxRtmpRecordNotification) {
    const pseudo: string = body.name.split('_').slice(0,-1 ).join('_');
    console.log(pseudo);
    const user: UserEntity = await this.userService.getByName(pseudo, true);
    console.log(pseudo,user);
    if(!user){ throw new UnauthorizedException(); }
    console.log(body);
    this.replayService.create(user.live.title,user.live.desc,user,user.live.catLevel,user.live.catLanguage,body.path)
        .catch(console.log);
  }


}
