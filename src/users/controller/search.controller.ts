
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put, Query,
  UnauthorizedException, UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import {LiveService} from "../service/live.service";
import {UserService} from "../service/user.service";
import {UserEntity} from "../entity/user.entity";
import {UserFullResponseDto, UserResponseDto} from "../dto/user.dto";
import {livePutDto, LiveResponseDto} from "../dto/live.dto";
import {LiveEntity} from "../entity/live.entity";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";
import * as config from 'config';
import {ReplayEntity} from "../entity/replay.entity";
import {ReplayService} from "../service/replay.service";
import {ReplayResponseDto} from "../dto/replay.dto";

@Controller('search')
export class SearchController {
  constructor(protected readonly liveService: LiveService,
              protected readonly replayService: ReplayService,
              protected readonly userService: UserService) {}

  @Get("/")
  public async list(@Query('title') title: string,
                    @Query('language') language: string,
                    @Query('level') level: string): Promise<any>{
    const lives : Promise<LiveResponseDto[]> = this.liveService.getLiveOn(language,level,title).then((lives: LiveEntity[])=>{
      return lives.map((live)=>new LiveResponseDto(live));
    });
    const replay: Promise<ReplayResponseDto[]> = this.replayService.getReplay(language,level,title).then((replays: ReplayEntity[])=>{
      console.log(replays);
      return replays.map((replay)=>new ReplayResponseDto(replay));
    });
    return {
      lives : await lives,
      replay: await replay
    }
  }

  @Get("/replays")
  public async replays(@Query('title') title: string,
                    @Query('language') language: string,
                       @Query('level') level: string,
                       @Query('pageIndex') pageIndex: number = 0,
                       @Query('pageSize') pageSize: number = 10): Promise<any>{
    if(pageSize > 50 ){ pageSize = 50; }
    return {
      index: pageIndex,
      count: await this.replayService.countReplay(language,level,title,pageIndex*pageSize,pageSize),
      items : await this.replayService.getReplay(language,level,title,pageIndex*pageSize,pageSize).then((replays: ReplayEntity[])=>{
        return replays.map((replay)=>new ReplayResponseDto(replay));
      })
    };
  }

  @Get("/lives")
  public async lives(@Query('title') title: string,
                     @Query('language') language: string,
                     @Query('level') level: string,
                     @Query('pageIndex') pageIndex: number = 0,
                     @Query('pageSize') pageSize: number = 10): Promise<any>{
    if(pageSize > 50 ){ pageSize = 50; }
    return {
      index : pageIndex,
      count : await this.liveService.countLiveOn(language,level,title,pageIndex*pageSize,pageSize),
      items : await this.liveService.getLiveOn(language,level,title,pageIndex*pageSize,pageSize).then((lives: LiveEntity[])=>{
        return lives.map((live)=>new LiveResponseDto(live));
      })
    };
  }
}
