
import {Body, Controller, Get, NotFoundException, Param, Post, Put, UnauthorizedException} from '@nestjs/common';
import {LiveService} from "../service/live.service";
import {UserService} from "../service/user.service";
import {UserEntity} from "../entity/user.entity";
import {UserFullResponseDto, UserResponseDto} from "../dto/user.dto";
import {NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {livePutDto} from "../dto/live.dto";

@Controller('lives')
export class LivesController {
  constructor(protected readonly liveService: LiveService,
              protected readonly userService: UserService) {}

  @Get("/")
  public async list(@Param('language') language: string,
                    @Param('level') level: string): Promise<any>{
    return this.liveService.getLiveOn(language,level);
  }

  @Get('/:liveName')
  public async get(@Param('liveName') liveName: string): Promise<UserResponseDto> {
    const user: UserEntity = await this.userService.getByName(liveName, true);
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
  public async done(@Body() body: livePutDto,
                    @Param('liveName') liveName: string): Promise<UserFullResponseDto> {
    const user: UserEntity = await this.userService.getByName(liveName, true);
    if(!user){ throw new NotFoundException();}
    this.liveService.update(user.live.id,{
      title: body.title,
      level: body.category,
      language: body.language
    });
    return new UserFullResponseDto(user);
  }


}
