import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
  UploadedFiles, UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {LiveService} from "../service/live.service";
import {UserService} from "../service/user.service";
import {UserEntity} from "../entity/user.entity";
import {UserFullResponseDto, UserResponseDto} from "../dto/user.dto";
import {livePutDto} from "../dto/live.dto";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";
import * as config from 'config';
import {Roles} from "../../auth/decorator/roles.decorator";
import {USER_ROLE} from "../../auth/constants";
import {JwtPayload} from "../../auth/decorator/jwt-payload.decorator";
import {JwtModel} from "../../auth/model/jwt.model";

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
  @Roles([USER_ROLE.USER])
  public async newKey(@Param('liveName') liveName: string,
  @JwtPayload() jwtPayload: JwtModel): Promise<UserFullResponseDto> {
    const user: UserEntity = await this.userService.getByName(liveName, true);
    if(!user){ throw new NotFoundException();}
    if(user.id !== jwtPayload.id){ throw  new UnauthorizedException(); }
    user.live.key = await this.liveService.generateNewKey(user.live.id);
    return new UserFullResponseDto(user);
  }

  @Put('/:liveName')
  @Roles([USER_ROLE.USER])
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
                      @JwtPayload() jwtPayload: JwtModel,
                    @Param('liveName') liveName: string): Promise<UserFullResponseDto> {
    const user: UserEntity = await this.userService.getByName(liveName, true);
    if(!user){ throw new NotFoundException();}
    if(user.id !== jwtPayload.id){ throw  new UnauthorizedException(); }
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
