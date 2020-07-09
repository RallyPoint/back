
import {Injectable} from '@nestjs/common';
import {EmailService} from "./email.service";
import {IEmailInfo} from "../interface/email.interface";
import {TemplateService} from "./template.service";

@Injectable()
export class EmailUserService {

    constructor(private readonly emailService: EmailService, private readonly tempalteService: TemplateService){}

    sendEmailVerification(emailInfo: IEmailInfo, data : { emailVerificationLink : string}): Promise<boolean> {
        return this.emailService.sendMail(
            { Subject: "Confirmation de votre inscription chez RallyPoint.Tech", ...emailInfo},
            this.tempalteService.getHTML('inscription-signin',data)
        ).then(()=>true);
    }

    changePassword(emailInfo: IEmailInfo, data : { changePasswordLink : string}): Promise<boolean> {
        return this.emailService.sendMail(
            { Subject: "Demande de changement de mot de passe", ...emailInfo},
            this.tempalteService.getHTML('reset-password',data)
        ).then(()=>true);
    }
}

