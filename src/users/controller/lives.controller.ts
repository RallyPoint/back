
import {Controller, Get, NotFoundException, Param} from '@nestjs/common';
import {LiveService} from "../service/live.service";
import {UserService} from "../service/user.service";
import {UserEntity} from "../entity/user.entity";
import {UserResponseDto} from "../dto/user.dto";

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

}
