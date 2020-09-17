import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserEntity } from './entity/user.entity';
import { EmailModule } from "../email/email.module";
import { UserController } from "./controller/user.controller";
import { LivesController } from "./controller/lives.controller";
import { LiveService } from "./service/live.service";
import { CategorieLiveEntity } from "./entity/categorie-live.entity";
import { LiveController } from "./controller/live.controller";
import { LiveEntity } from "./entity/live.entity";
import { FollowController } from "./controller/follow.controller";
import { FollowService } from "./service/follow.service";
import { CategorieService } from "./service/categorie.service";
import { CategorieController } from "./controller/categorie.controller";
import { ReplayService } from "./service/replay.service";
import { ReplayEntity } from "./entity/replay.entity";
import { ReplayController } from "./controller/replay.controller";
import { SearchController } from "./controller/search.controller";
import { CalendarEntity } from "./entity/calendar.entity";
import {CalendarController} from "./controller/calendar.controller";
import {CalendarService} from "./service/calendar.service";

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEntity,UserEntity, LiveEntity, CategorieLiveEntity, ReplayEntity]), EmailModule,
    HttpModule],
  controllers: [CalendarController, UserController, LiveController, LivesController, FollowController, CategorieController, ReplayController, SearchController],
  providers: [CalendarService,UserService, LiveService, FollowService, CategorieService, ReplayService],
  exports: [UserService],
})
export class UsersModule {}

