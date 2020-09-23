import {Body, Controller, Delete, Get, Param, Post, UnauthorizedException} from '@nestjs/common';
import {UserFollowDto, UserResponseDto} from "../dto/user.dto";
import {UserService} from "../service/user.service";
import {FollowService} from "../service/follow.service";
import {JwtPayload} from "../../auth/decorator/jwt-payload.decorator";
import {AccessTokenModel} from "../../auth/model/access-token.model";
import {USER_ROLE} from "../../auth/constants";
import {UserEntity} from "../entity/user.entity";
import {Roles} from "../../auth/decorator/roles.decorator";

@Controller('user/:userId/follow')
export class FollowController {

  constructor(private readonly followService: FollowService,
              private readonly userService: UserService) {}

  @Post('/')
  @Roles([USER_ROLE.USER])
  public async add(@Body() body: UserFollowDto,
                   @Param('userId') userId: string,
                   @JwtPayload() jwtPayload: AccessTokenModel): Promise<UserResponseDto>{
    if(userId != jwtPayload.id && jwtPayload.roles.indexOf(USER_ROLE.ADMIN)===-1){
      throw new UnauthorizedException();
    }
    return new UserResponseDto(await this.followService.follow(userId,body.liveUserId));
  }

  @Delete('/:liveUserId')
  @Roles([USER_ROLE.USER])
  public async remove(@Param('liveUserId') liveUserId: string,
                   @Param('userId') userId: string,
                      @JwtPayload() jwtPayload: AccessTokenModel): Promise<boolean>{
    if(userId != jwtPayload.id && jwtPayload.roles.indexOf(USER_ROLE.ADMIN)===-1){
      throw new UnauthorizedException();
    }
    return this.followService.unFollow(userId,liveUserId);
  }

  @Get('/')
  @Roles([USER_ROLE.USER])
  public async list(
      @Param('userId') userId: string,
      @JwtPayload() jwtPayload: AccessTokenModel): Promise<UserResponseDto[]>{
    if(userId != jwtPayload.id && jwtPayload.roles.indexOf(USER_ROLE.ADMIN)===-1){
      throw new UnauthorizedException(userId+"==="+jwtPayload.id);
    }
    return this.followService.getFollowedOf(userId).then((users: UserEntity[])=>{
      return  users.map((user: UserEntity)=>new UserResponseDto(user))
    });
  }
}
