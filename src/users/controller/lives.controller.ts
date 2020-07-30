
import {Body, Controller, Get, NotFoundException, Param, Post, Put, UnauthorizedException} from '@nestjs/common';
import {LiveService} from "../service/live.service";
import {UserService} from "../service/user.service";
import {UserEntity} from "../entity/user.entity";
import {UserFullResponseDto, UserResponseDto} from "../dto/user.dto";
import {NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {livePutDto, LiveResponseDto} from "../dto/live.dto";
import {LiveEntity} from "../entity/live.entity";

@Controller('lives')
export class LivesController {
  constructor(protected readonly liveService: LiveService,
              protected readonly userService: UserService) {}

  @Get("/")
  public async list(@Param('language') language: string,
                    @Param('level') level: string): Promise<LiveResponseDto[]>{
    return this.liveService.getLiveOn(language,level).then((lives: LiveEntity[])=>{
      return lives.map((live)=>new LiveResponseDto(live));
    });
  }

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
  public async update(@Body() body: livePutDto,
                    @Param('liveName') liveName: string): Promise<UserFullResponseDto> {
    const user: UserEntity = await this.userService.getByName(liveName, true);
    if(!user){ throw new NotFoundException();}
    this.liveService.update(user.live.id,{
      title: body.title,
      level: body.category,
      date: body.date,
      desc: body.desc,
      language: body.language
    });
    return new UserFullResponseDto(user);
  }


}
