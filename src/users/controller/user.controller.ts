import {
  BadRequestException,
  Body,
  Controller, Get, Param, Put, UnauthorizedException, UploadedFiles, UseInterceptors
} from '@nestjs/common';
import {
  ChangePasswordDto,
  UserFullResponseDto, UserResponseDto,
  UserUpdateDto,
  VerifiedEmailDto,
  VerifiedEmailResponseDto
} from "../dto/user.dto";
import {UserService} from "../service/user.service";
import {JwtPayload} from "../../auth/decorator/jwt-payload.decorator";
import {JwtModel} from "../../auth/model/jwt.model";
import {UserEntity} from "../entity/user.entity";
import {USER_ROLE} from "../../auth/constants";
import {IUserUpdate} from "../interface/user.interface";
import {FilesInterceptor} from "@nestjs/platform-express";
import * as config from 'config';
import { extname } from "path";
import { diskStorage } from 'multer'



@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}


  @Put(':userId/verify')
  public async verified(
      @Body() body: VerifiedEmailDto,
      @Param('userId')userId: string): Promise<VerifiedEmailResponseDto>{
    return this.userService.validEmail(userId,body.code).then(()=>{
      return { status: true};
    });
  }

  @Put(':userId/change-password')
  public async changePassword(
      @Body() body: ChangePasswordDto,
      @Param('userId')userId: string): Promise<boolean>{
    return !!await this.userService.changePassword(body.password,body.code);
  }

  @Get(':userId')
  public async get(
      @JwtPayload() jwtPayload: JwtModel,
      @Param('userId')userId: string): Promise<UserFullResponseDto | UserResponseDto>{
    const user: UserEntity = await this.userService.getById(userId,true);
    if(userId != jwtPayload.id && jwtPayload.roles.indexOf(USER_ROLE.ADMIN)===-1){
      return new UserResponseDto(user);
    }
    return new UserFullResponseDto(user);
  }

  @Put(':userId')
  @UseInterceptors(<any>FilesInterceptor('avatar',1,
      {
        limits:{
          fileSize: 500000
        },
        fileFilter: (req, file, cb)=> {
          const MIME_TYPES = ['image/jpeg','image/png'];
          if(MIME_TYPES.includes(file.mimetype)){
            return cb(null,true);
          }
          cb(new Error('BAD FILE TYPE'),false);
        },
        storage: diskStorage({
          destination: config.get('fs.avatar'),
          filename: (req, file, cb) => {
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
            return cb(null, `${randomName}${extname(file.originalname)}`)
          }
        })
      }
      ))
  public async changeUser(
      @Body() body: UserUpdateDto,
      @Param('userId')userId: string,
      @JwtPayload() jwtPayload: JwtModel,
      @UploadedFiles() files): Promise<any>{
    if(userId != jwtPayload.id && jwtPayload.roles.indexOf(USER_ROLE.ADMIN)===-1){
      throw new UnauthorizedException();
    }
    if((body.password || body.passwordConf) && body.password !== body.passwordConf){
      throw new BadRequestException();
    }
    const user: IUserUpdate = {};
    if(body.password){
      user.password = await this.userService.cryptPassword(body.password);
    }
    if(body.pseudo) {
      user.pseudo = body.pseudo;
    }
    if(body.desc) {
      user.desc = body.desc;
    }
    if(files && files[0]) {
      user.avatar = files[0].filename;
    }
    if(body.email) {
      user.email = body.email;
    }
    return !!await this.userService.update(userId, user);
  }
}
