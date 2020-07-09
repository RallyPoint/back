import {
  Controller,
  Get
} from '@nestjs/common';
import {EmailService} from "../sevices/email.service";
import {TemplateService} from "../sevices/template.service";

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService, private readonly tempalteService: TemplateService) {}


  @Get('test')
  public test(){
    const content = this.tempalteService.getHTML('inscription-signin',{emailVerification:"https://google.com"});
    //this.emailService.sendMail('franck.r@rallypoint.tech',content);
    return content;
  }
}
