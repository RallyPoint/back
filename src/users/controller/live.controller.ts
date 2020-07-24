
import {Controller, Post, Body, UnauthorizedException} from '@nestjs/common';
import {NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {LiveService} from "../service/live.service";
import {LiveEntity} from "../entity/live.entity";

/**
 * @todo: ADD IP RESTRICTION !!!
 */
@Controller('rtmp')
export class LiveController {
  constructor(protected readonly liveService: LiveService) {}

  @Post('publish')
  public async publish(@Body() body: NginxRtmpExternal) {
    console.log(body);
    const live: LiveEntity = await this.liveService.getByKey(body.psk);
    if(!live){ throw new UnauthorizedException(); }
    return await this.liveService.setStatus(live.id,true).then((success)=>{
      if(success){
        return {};
      }else{
        throw new UnauthorizedException();
      }
    });
  }

  @Post('done')
  public async done(@Body() body: NginxRtmpExternal) {
    const live: LiveEntity = await this.liveService.getByKey(body.name);
    if(!live){ throw new UnauthorizedException(); }
    return await this.liveService.setStatus(live.id,false).then((success)=>{
      if(success){
        return {};
      }else{
        throw new UnauthorizedException();
      }
    });
  }


}
