
import {Controller, Post, Body, UnauthorizedException, HttpService, Req, UseGuards} from '@nestjs/common';
import {INginxRtmpRecordNotification, NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {LiveService} from "../service/live.service";
import {LiveEntity} from "../entity/live.entity";
import {ReplayService} from "../service/replay.service";
import {UserService} from "../service/user.service";
import {UserEntity} from "../entity/user.entity";
import {RPTLoggerService} from "../../share/logger/logger.service";
import {AuthServerGard} from "../../auth/service/auth-server.gard";


@UseGuards(AuthServerGard)
@Controller('rtmp')
export class LiveController {
  private static DELAY_MAIL: number = 1000*60*60;// 1h
  constructor(protected readonly liveService: LiveService,
              protected readonly userService: UserService,
              protected readonly replayService: ReplayService) {}
  private DELAY_STATUS: number = 10000;

  @Post('publish')
  public async publish(@Body() body: NginxRtmpExternal, @Req() req: any) {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':').slice('-1')[0];
    const live: LiveEntity = await this.liveService.getByKey(body.param.replace('?',''));
    if(!live || live.user.pseudo != body.stream){ return 1; }
    if(!live.lastSendMail || live.lastSendMail.getTime() + LiveController.DELAY_MAIL < Date.now()){
      this.liveService.sendNotification(live);
    }
    setTimeout(()=>{
      this.liveService.setStatus(live.id,true,ip).then((success)=>{
        if(success){
          return {};
        }else{
          throw new UnauthorizedException();
        }
      }).catch((e)=>{
        throw e;
      });
    }, this.DELAY_STATUS);
    return 0;
  }

  @Post('done')
  public async done(@Body() body: NginxRtmpExternal) {
    const live: LiveEntity = await this.liveService.getByKey(body.param.replace('?',''));
    if(!live){ return 1; }
    setTimeout(()=>{
      return this.liveService.setStatus(live.id,false).then((success)=>{
        if(success){
          return {};
        }else{
          throw new UnauthorizedException();
        }
      }).catch((e) => {throw e;});
    }, this.DELAY_STATUS);
    return 0;
  }

  @Post('record')
  public async record(@Body() body: INginxRtmpRecordNotification) {
    const pseudo: string = body.stream;
    const user: UserEntity = await this.userService.getByName(pseudo, true);
    if(!user){ throw new UnauthorizedException(); }
    this.replayService.create(
        user.live.title,
        user.live.desc,
        user,
        user.live.catLevel,
        user.live.catLanguage,
        body.file.split('/').slice(-1)[0])
        .catch((e) => { throw e; } );
    return 0;
  }


}
