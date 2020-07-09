
import {Controller, Post, Body, UnauthorizedException} from '@nestjs/common';
import {NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {LiveService} from "../service/live.service";

/**
 * @todo: ADD IP RESTRICTION !!!
 */
@Controller('rtmp')
export class LiveController {
  constructor(protected readonly liveService: LiveService) {}

  @Post('publish')
  public async publish(@Body() body: NginxRtmpExternal) {
    return await this.liveService.setStatus(body.name,true).then((success)=>{
      if(success){
        return {};
      }else{
        throw new UnauthorizedException();
      }
    });
  }

  @Post('done')
  public async done(@Body() body: NginxRtmpExternal) {
    return await this.liveService.setStatus(body.name,false).then((success)=>{
      if(success){
        return {};
      }else{
        throw new UnauthorizedException();
      }
    });
  }


}
