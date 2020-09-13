
import {Body, Controller, Get, NotFoundException, Param, Post, Put, Query, UnauthorizedException} from '@nestjs/common';
import {LiveService} from "../service/live.service";
import {UserService} from "../service/user.service";
import {UserEntity} from "../entity/user.entity";
import {UserFullResponseDto, UserResponseDto} from "../dto/user.dto";
import {NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {livePutDto, LiveResponseDto} from "../dto/live.dto";
import {ReplayService} from "../service/replay.service";
import {ReplayResponseDto} from "../dto/replay.dto";
import {LiveEntity} from "../entity/live.entity";
import {ReplayEntity} from "../entity/replay.entity";

@Controller('replay')
export class ReplayController {
  constructor(protected readonly replayService: ReplayService,
              protected readonly userService: UserService) {}

  @Get("/")
  public async list(@Query('language') language: string,
                    @Query('level') level: string,
                    @Query('userId') userId: string): Promise<ReplayResponseDto[]>{
    return this.replayService.getList(userId,language,level).then((replays: ReplayEntity[])=>{
      return replays.map((replay)=>new ReplayResponseDto(replay));
    });
  }

  @Get('/:replayId')
  public async get(@Param('replayId') replayId: string): Promise<ReplayResponseDto> {
    const replay: ReplayEntity = await this.replayService.getById(replayId, true);
    if(!replay){ throw new NotFoundException();}
    return new ReplayResponseDto(replay);
  }


}
