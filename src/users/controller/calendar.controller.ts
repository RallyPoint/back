import {
  BadRequestException,
  Body,
  Controller, Delete, Get, NotFoundException, Param, Post, Put, UnauthorizedException, UploadedFiles, UseInterceptors
} from '@nestjs/common';

import {UserService} from "../service/user.service";
import {JwtPayload} from "../../auth/decorator/jwt-payload.decorator";
import {AccessTokenModel} from "../../auth/model/access-token.model";
import {UserEntity} from "../entity/user.entity";
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
      @JwtPayload() jwtPayload: AccessTokenModel,
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
      @JwtPayload() jwtPayload: AccessTokenModel,
      @Param('calendarId') calendarId: string
  ): Promise<StatusReponseDto> {
    const calendarEntity : CalendarEntity = await this.calendarService.getById(calendarId,true);
    if(!calendarEntity) { throw new NotFoundException(); }
    if(calendarEntity.user.id !== jwtPayload.id) { throw new UnauthorizedException(); }
    await this.calendarService.delete(calendarEntity.id);
    return new StatusReponseDto(true);
  }

}
