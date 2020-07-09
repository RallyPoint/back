import {
  Body,
  Controller, Delete, Get, NotFoundException, Param, Post, Put, UnauthorizedException
} from '@nestjs/common';
import { UserFollowDto } from "../dto/user.dto";
import {UserService} from "../service/user.service";
import {async} from "rxjs/internal/scheduler/async";
import {FollowService} from "../service/follow.service";
import {JwtPayload} from "../../auth/decorator/jwt-payload.decorator";
import {JwtModel} from "../../auth/model/jwt.model";
import {USER_ROLE} from "../../auth/constants";
import {UserEntity} from "../entity/user.entity";

@Controller('user/:userId/follow')
export class FollowController {

  constructor(private readonly followService: FollowService,
              private readonly userService: UserService) {}

  @Post('/')
  public async add(@Body() body: UserFollowDto,
                   @Param('userId') userId: string,
                   @JwtPayload() jwtPayload: JwtModel): Promise<UserEntity>{
    if(userId != jwtPayload.id && jwtPayload.roles.indexOf(USER_ROLE.ADMIN)===-1){
      throw new UnauthorizedException();
    }
    return this.followService.follow(userId,body.liveUserId);
  }

  @Delete('/:liveUserId')
  public async remove(@Param('liveUserId') liveUserId: string,
                   @Param('userId') userId: string,
                      @JwtPayload() jwtPayload: JwtModel): Promise<boolean>{
    if(userId != jwtPayload.id && jwtPayload.roles.indexOf(USER_ROLE.ADMIN)===-1){
      throw new UnauthorizedException();
    }
    return this.followService.unFollow(userId,liveUserId);
  }

  @Get('/')
  public async list(
      @Param('userId') userId: string,
      @JwtPayload() jwtPayload: JwtModel){
    if(userId != jwtPayload.id && jwtPayload.roles.indexOf(USER_ROLE.ADMIN)===-1){
      throw new UnauthorizedException(userId+"==="+jwtPayload.id);
    }
    return this.followService.getFollowedOf(userId);
  }
}
