import { Module } from '@nestjs/common';
import {EmailService} from "./sevices/email.service";
import {EmailController} from "./controller/email.controller";
import {TemplateService} from "./sevices/template.service";
import {EmailUserService} from "./sevices/email-user.service";

@Module({
  controllers: [EmailController],
  providers: [EmailService, TemplateService, EmailUserService],
  exports: [EmailService,EmailUserService],
})
export class EmailModule {}
