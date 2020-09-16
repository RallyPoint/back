import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException, UploadedFiles, UseInterceptors
} from '@nestjs/common';
import {UserService} from "../service/user.service";
import {ReplayService} from "../service/replay.service";
import {ReplayPutDto, ReplayResponseDto} from "../dto/replay.dto";
import {ReplayEntity} from "../entity/replay.entity";
import {Roles} from "../../auth/decorator/roles.decorator";
import {USER_ROLE} from "../../auth/constants";
import {JwtPayload} from "../../auth/decorator/jwt-payload.decorator";
import {JwtModel} from "../../auth/model/jwt.model";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage, memoryStorage} from "multer";
import {extname} from "path";
import * as config from 'config';
import {livePutDto} from "../dto/live.dto";
import {UserFullResponseDto} from "../dto/user.dto";
import {UserEntity} from "../entity/user.entity";
import * as fs from "fs";
import * as sharp from "sharp";

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

  @Delete('/:replayId')
  @Roles([USER_ROLE.USER])
  public async delete(@Param('replayId') replayId: string,
                      @JwtPayload() jwtPayload: JwtModel){
    const replay: ReplayEntity = await this.replayService.getById(replayId,true);
    if(replay.user.id !== jwtPayload.id){ throw new UnauthorizedException(); }
    return this.replayService.delete(replay);
  }

  @Put('/:replayId')
  @Roles([USER_ROLE.USER])
  @UseInterceptors(<any>FilesInterceptor('thumb',1,
      {
        limits:{
          fileSize: 1000000
        },
        fileFilter: (req, file, cb)=> {
          const MIME_TYPES = ['image/jpeg','image/png'];
          if(MIME_TYPES.includes(file.mimetype)){
            return cb(null,true);
          }
          cb(new Error('BAD FILE TYPE'),false);
        },
        storage: memoryStorage()
      }
  ))
  public async update(@Body() body: ReplayPutDto,
                      @UploadedFiles() files,
                      @JwtPayload() jwtPayload: JwtModel,
                      @Param('replayId') replayId: string): Promise<ReplayResponseDto> {
    const replay: ReplayEntity = await this.replayService.getById(replayId, true);
    if (!replay) {
      throw new NotFoundException();
    }
    if (replay.user.id !== jwtPayload.id) {
      throw  new UnauthorizedException({replay,jwtPayload});
    }
    const data = {
      title: body.title,
      level: body.category,
      desc: body.desc,
      thumb: null,
      language: body.language
    };
    if (files && files[0]) {
      sharp(files[0].buffer).jpeg().toFile(config.get('fs.replayThumb')+'/'+replay.user.pseudo+'/'+replay.id+'.jpg');
      data.thumb = '/media/hls/replay/'+replay.user.pseudo+'/'+replay.id+'.jpg';
    }
    this.replayService.update(replay.id, data);
    return new ReplayResponseDto(Object.assign(replay,data));
  }

}
