
import {Controller, Post, Body, UnauthorizedException, HttpService, Req, UseGuards, NotFoundException} from '@nestjs/common';
import {INginxRtmpRecordNotification, NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {LiveService} from "../service/live.service";
import {LiveEntity} from "../entity/live.entity";
import {ReplayService} from "../service/replay.service";
import {UserService} from "../service/user.service";
import {UserEntity} from "../entity/user.entity";
import {Request} from 'express';
import {AuthServerGard} from "../../auth/service/auth-server.gard";
import {
  StreamingServerAuthentificationDto,
  StreamingServerAuthExternal, StreamingServerDoneExternal, StreamingServerDoneRecordExternal,
  StreamingServerPublishExternal
} from '../dto/streaming-server.external';


@UseGuards(AuthServerGard)
@Controller('rtmp')
export class LiveController {
  private static DELAY_MAIL: number = 1000*60*60;// 1h
  constructor(protected readonly liveService: LiveService,
              protected readonly userService: UserService,
              protected readonly replayService: ReplayService) {}
  private DELAY_STATUS: number = 10000;

  @Post('authentification')
  public async authentification(@Body() body: StreamingServerAuthExternal): Promise<StreamingServerAuthentificationDto> {
    console.log(body);

    const live: LiveEntity = await this.liveService.getByKey(body.publishStreamName);
    if(!live){ throw  new NotFoundException('Live not found');}
    return {
      publishStreamPath: `/${live.user.pseudo}/`,
      liveKey : body.publishStreamName,
      pseudo: live.user.pseudo
    };
  }

  @Post('publish')
  public async publish(@Body() body: StreamingServerPublishExternal, @Req() req: Request): Promise<void>{
    console.log("====>publish",body);
    const ip = req.connection.remoteAddress.split(':').slice(-1)[0];
    const live: LiveEntity = await this.liveService.getByKey(body.publishMetaData.liveKey);
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
  }

  @Post('done')
  public async done(@Body() body: StreamingServerDoneExternal): Promise<void>{
    const live: LiveEntity = await this.liveService.getByKey(body.publishStreamName);
    if(!live){ return ; }
    setTimeout(()=>{
      return this.liveService.setStatus(live.id,false).then((success)=>{
        if(success){
          return {};
        }else{
          throw new UnauthorizedException();
        }
      }).catch((e) => {throw e;});
    }, this.DELAY_STATUS);
    return ;
  }

  @Post('done-record')
  public async doneRecord(@Body() body: StreamingServerDoneRecordExternal) : Promise<void> {
    const pseudo: string = body.publishMetaData.pseudo;
    const user: UserEntity = await this.userService.getByName(pseudo, true);
    if(!user){ throw new UnauthorizedException(); }
    this.replayService.create(
        user.live.title,
        user.live.desc,
        user,
        user.live.catLevel,
        user.live.catLanguage,
        body.recordFile)
        .catch((e) => { throw e; } );
    return ;
  }


}
