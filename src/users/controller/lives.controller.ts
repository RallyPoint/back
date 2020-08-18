
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

@Controller('lives')
export class LivesController {
  constructor(protected readonly liveService: LiveService,
              protected readonly userService: UserService) {}


  @Get('/:liveName')
  public async get(@Param('liveName') liveName: string): Promise<UserResponseDto> {
    const user: UserEntity = await this.userService.getByName(liveName, true);
    if(!user){ throw new NotFoundException();}
    return new UserResponseDto(user);
  }

  @Get('/home/main')
  public async getMain(@Param('liveName') liveName: string): Promise<UserResponseDto> {
    const user: UserEntity = await this.userService.getMain(true);
    if(!user){ throw new NotFoundException();}
    return new UserResponseDto(user);
  }

  @Put('/:liveName/new-key')
  public async newKey(@Param('liveName') liveName: string): Promise<UserFullResponseDto> {
    const user: UserEntity = await this.userService.getByName(liveName, true);
    if(!user){ throw new NotFoundException();}
    const liveKey = await this.liveService.generateNewKey(user.live.id);
    user.live.key = liveKey;
    return new UserFullResponseDto(user);
  }

  @Put('/:liveName')
  @UseInterceptors(<any>FilesInterceptor('avatar',1,
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
        storage: diskStorage({
          destination: config.get('fs.live'),
          filename: (req, file, cb) => {
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
            return cb(null, `${randomName}${extname(file.originalname)}`)
          }
        })
      }
  ))
  public async update(@Body() body: livePutDto,
                      @UploadedFiles() files,
                    @Param('liveName') liveName: string): Promise<UserFullResponseDto> {
    const user: UserEntity = await this.userService.getByName(liveName, true);
    if(!user){ throw new NotFoundException();}
    const data = {
      title: body.title,
      level: body.category,
      date: body.date,
      desc: body.desc,
      thumb : null,
      language: body.language
    };
    if(files && files[0]){
      data.thumb = files[0].filename;
    }
    this.liveService.update(user.live.id,data);
    return new UserFullResponseDto(user);
  }


}
