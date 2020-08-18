import {HttpModule, Module} from '@nestjs/common';
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
import {UserFollowEntity} from "./entity/user-follow.entity";
import {FollowService} from "./service/follow.service";
import {CategorieService} from "./service/categorie.service";
import {CategorieController} from "./controller/categorie.controller";
import {ReplayService} from "./service/replay.service";
import {ReplayEntity} from "./entity/replay.entity";
import {ReplayController} from "./controller/replay.controller";
import {SearchController} from "./controller/search.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, LiveEntity, CategorieLiveEntity, UserFollowEntity,ReplayEntity]), EmailModule,
    HttpModule,],
  controllers: [UserController, LiveController, LivesController, FollowController, CategorieController, ReplayController, SearchController],
  providers: [UserService, LiveService, FollowService, CategorieService, ReplayService],
  exports: [UserService],
})
export class UsersModule {}

