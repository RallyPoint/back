import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatBanEntity} from "./entity/chat-ban.entity";
import {ChatController} from "./controller/chat.controller";
import {ChatService} from "./sevices/chat.service";

@Module({
  imports : [TypeOrmModule.forFeature([ChatBanEntity])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
