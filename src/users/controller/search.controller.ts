
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
import {CalendarService} from "../service/calendar.service";
import {PageResponseDto} from "../../share/dto/page.dto";

@Controller('search')
export class SearchController {
  constructor(protected readonly liveService: LiveService,
              protected readonly calendarService: CalendarService,
              protected readonly replayService: ReplayService,
              protected readonly userService: UserService) {}

  @Get("/")
  public async list(@Query('title') title: string,
                    @Query('language') language: string,
                    @Query('level') level: string): Promise<any>{
    const lives : Promise<LiveResponseDto[]> = this.liveService.getLives(language,level,title).then((lives: LiveEntity[])=>{
      return lives.map((live)=>new LiveResponseDto(live));
    });
    const replay: Promise<ReplayResponseDto[]> = this.replayService.getReplay(language,level,title).then((replays: ReplayEntity[])=>{
      return replays.map((replay)=>new ReplayResponseDto(replay));
    });
    return {
      lives : await lives,
      replay: await replay
    }
  }

  @Get("/users")
  public async users(@Query('pseudo') pseudo: string,
                     @Query('title') title: string,
                     @Query('language') language: string,
                     @Query('level') level: string,
                     @Query('pageIndex') pageIndex: number = 0,
                     @Query('pageSize') pageSize: number = 10): Promise<any>{
    if(pageSize > 50 ){ pageSize = 50; }
    const count: number = await this.userService.countUsers(language,level,title, pseudo, null,pageIndex*pageSize,pageSize);
    const items: UserEntity[] = count ? await this.userService.getUsers(language,level,title, pseudo, null,pageIndex*pageSize,pageSize) : [];
    return new PageResponseDto(
        items.map((user)=>new UserResponseDto(user)),
        count,
        pageIndex
    );
  }

  @Get("/replays")
  public async replays(@Query('title') title: string,
                       @Query('user') userPseudo: string,
                       @Query('language') language: string,
                       @Query('level') level: string,
                       @Query('pageIndex') pageIndex: number = 0,
                       @Query('pageSize') pageSize: number = 10): Promise<PageResponseDto<ReplayResponseDto>>{
    if(pageSize > 50 ){ pageSize = 50; }
    let user: UserEntity;
    if(userPseudo) {
      user = await this.userService.getByName(userPseudo);
      if(!user){ return new PageResponseDto([],0,0); }
    }
    const count: number = await this.replayService.countReplay(language,level,title, user ? user.id : null,pageIndex*pageSize,pageSize);
    const items : ReplayEntity[] = count ? await this.replayService.getReplay(language,level,title, user ? user.id : null,pageIndex*pageSize,pageSize) : [];
    return new PageResponseDto(
        items.map((replay)=>new ReplayResponseDto(replay)),
        count,
        pageIndex
    );

  }

  @Get("/lives")
  public async lives(@Query('title') title: string,
                     @Query('language') language: string,
                     @Query('level') level: string,
                     @Query('status') status: number,
                     @Query('pageIndex') pageIndex: number = 0,
                     @Query('pageSize') pageSize: number = 10): Promise<PageResponseDto<LiveResponseDto>>{
    const statusBool = status === undefined? null:status==1;
    if(pageSize > 50 ){ pageSize = 50; }
    const count: number = await this.liveService.countLives(language,level,title,statusBool,pageIndex*pageSize,pageSize);
    const live: LiveEntity[] = count ? await this.liveService.getLives(language,level,title, statusBool,pageIndex*pageSize,pageSize) : [];
    return new PageResponseDto(
        live.map((live)=>new LiveResponseDto(live)),
        count,
        pageIndex
    );
  }

  @Get("/calendar")
  public async calendar(@Query('userId') userId: string): Promise<any>{
    return this.calendarService.getListOfUser(userId);
  }
}
