
import {Injectable} from '@nestjs/common';
import * as MailJet from "node-mailjet";
import {IEmailInfo} from "../interface/email.interface";
import * as config from "config";
@Injectable()
export class EmailService {

    private static readonly API_KEY: string = config.get("mailJet.apiKey");
    private static readonly API_SECRET: string = config.get("mailJet.apiSecret");

    private static readonly  DEFAULT_EMAIL_OPTION : IEmailInfo = {
        From : {
            Email: "info@rallypoint.tech",
            Name: "RallyPoint.Tech"
        }
    };

    constructor(){
    }

    sendMail(emailInfo: IEmailInfo, content:string): Promise<MailJet.Email.Response>{
        return this.getConnection()
            .post("send", {'version': 'v3.1'})
            .request({
                "Messages":[Object.assign({},EmailService.DEFAULT_EMAIL_OPTION,emailInfo,{ HTMLPart: content })]
            })
    }

    addContact(email: string, name: string, isExcludedFromCampaigns: boolean = false): Promise<MailJet.Email.Response>{
        return this.getConnection()
            .post('contact')
            .request({
                Email : email,
                Name: name,
                IsExcludedFromCampaigns: isExcludedFromCampaigns
            });
    }

    private getConnection(): MailJet.Email.Client {
        return MailJet.connect(EmailService.API_KEY, EmailService.API_SECRET);
    }
}

