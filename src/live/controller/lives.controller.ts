
import {Controller, Request, Post, UseGuards, Get, Body, Put} from '@nestjs/common';
import {UsersService} from "../../users/service/users.service";
import {NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {UserEntity} from "../../users/entity/user.entity";

@Controller('lives')
export class LivesController {
  constructor(protected readonly usersService: UsersService) {}

  @Get("/")
  public async list(){
    return this.usersService.getUserLiveOn();
  }

}
