import { Module } from '@nestjs/common';
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

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, LiveEntity, CategorieLiveEntity, UserFollowEntity]), EmailModule],
  controllers: [UserController, LiveController, LivesController, FollowController],
  providers: [UserService, LiveService, FollowService],
  exports: [UserService],
})
export class UsersModule {}
