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
import {AccessTokenModel} from "../../auth/model/access-token.model";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage, memoryStorage} from "multer";
import * as config from 'config';
import * as fs from "fs";
import * as sharp from "sharp";

@Controller('replay')
export class ReplayController {
  constructor(protected readonly replayService: ReplayService,
              protected readonly userService: UserService) {}

  @Get('/:replayId')
  public async get(@Param('replayId') replayId: string): Promise<ReplayResponseDto> {
    const replay: ReplayEntity = await this.replayService.getById(replayId, true);
    if(!replay){ throw new NotFoundException();}
    return new ReplayResponseDto(replay);
  }

  @Delete('/:replayId')
  @Roles([USER_ROLE.USER])
  public async delete(@Param('replayId') replayId: string,
                      @JwtPayload() jwtPayload: AccessTokenModel){
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
                      @JwtPayload() jwtPayload: AccessTokenModel,
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
