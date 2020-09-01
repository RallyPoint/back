import {
  Controller,
  Get, Param, Query, Headers, Post, UseGuards
} from '@nestjs/common';
import {ChatService} from "../sevices/chat.service";
import {AuthServerGard} from "../../auth/service/auth-server.gard";


@UseGuards(AuthServerGard)
@Controller('chat-auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}


  @Get('/channel/:channel/user/:user')
  public async get(
      @Param('channel') channel: string,
      @Param('user') userId: string){
    return {
      status: !await this.chatService.isBan(channel,userId)
    }
  }

  @Post('/channel/:channel/user/:user')
  public async post(
      @Param('channel') channel: string,
      @Param('user') userId: string){
    return {
      status: !await this.chatService.ban(channel,userId)
    }
  }
}
