import {
  BadRequestException,
  Body,
  Controller, Delete, Get, NotFoundException, Param, Post, Put, UnauthorizedException, UploadedFiles, UseInterceptors
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
import {Roles} from "../../auth/decorator/roles.decorator";
import {CalendarService} from "../service/calendar.service";
import {CalendarCreateDto} from "../dto/calendar.dto";
import {CalendarEntity} from "../entity/calendar.entity";
import {StatusReponseDto} from "../../share/dto/status.dto";


@Controller('calendar')
export class CalendarController {

  constructor(private readonly userService: UserService,
              private readonly calendarService: CalendarService) {}


  @Post()
  public async post(
      @JwtPayload() jwtPayload: JwtModel,
      @Body() body: CalendarCreateDto
      ) : Promise<StatusReponseDto>{
    const userEntity: UserEntity = await this.userService.getById(jwtPayload.id);
    await this.calendarService.create(
        body.title,
        body.desc,
        body.start,
        body.end,
        body.category,
        body.language,
        userEntity
    );
    return new StatusReponseDto(true);
  }

  @Delete(':calendarId')
  public async delete(
      @JwtPayload() jwtPayload: JwtModel,
      @Param('calendarId') calendarId: string
  ): Promise<StatusReponseDto> {
    const calendarEntity : CalendarEntity = await this.calendarService.getById(calendarId,true);
    if(!calendarEntity) { throw new NotFoundException(); }
    if(calendarEntity.user.id !== jwtPayload.id) { throw new UnauthorizedException(); }
    await this.calendarService.delete(calendarEntity.id);
    return new StatusReponseDto(true);
  }

}
