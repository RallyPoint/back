
import {Controller, Post, Body, UnauthorizedException, HttpService, Req} from '@nestjs/common';
import {INginxRtmpRecordNotification, NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {LiveService} from "../service/live.service";
import {LiveEntity} from "../entity/live.entity";
import {ReplayService} from "../service/replay.service";
import {UserService} from "../service/user.service";
import {UserEntity} from "../entity/user.entity";
import {RPTLoggerService} from "../../share/logger/logger.service";


/**
 * @todo: ADD IP RESTRICTION !!!
 */
@Controller('rtmp')
export class LiveController {
  constructor(protected readonly liveService: LiveService,
              protected readonly userService: UserService,
              protected readonly replayService: ReplayService) {}
  private DELAY_STATUS: number = 10000;
  @Post('publish')
  public async publish(@Body() body: NginxRtmpExternal, @Req() req: any) {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':').slice('-1')[0];
    const live: LiveEntity = await this.liveService.getByKey(body.psk);
    if(!live || live.user.pseudo != body.name){ throw new UnauthorizedException(); }
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
    return ;
  }

  @Post('done')
  public async done(@Body() body: NginxRtmpExternal) {
    const user: UserEntity = await  this.userService.getByName(body.name,true);
    if(!user){ throw new UnauthorizedException(); }
    setTimeout(()=>{
      return this.liveService.setStatus(user.live.id,false).then((success)=>{
        if(success){
          return {};
        }else{
          throw new UnauthorizedException();
        }
      }).catch((e) => {throw e;});
    }, this.DELAY_STATUS);
  }

  @Post('record')
  public async record(@Body() body: INginxRtmpRecordNotification) {
    const pseudo: string = body.name.split('_').slice(0,-1 ).join('_');
    const user: UserEntity = await this.userService.getByName(pseudo, true);
    if(!user){ throw new UnauthorizedException(); }
    this.replayService.create(user.live.title,user.live.desc,user,user.live.catLevel,user.live.catLanguage,body.path)
        .catch((e) => { throw e; } );
  }


}
