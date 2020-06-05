import { Module } from '@nestjs/common';
import {LiveController} from "./controller/live.controller";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [LiveController],
  providers: [],
  exports: [],
})
export class LiveModule {}
