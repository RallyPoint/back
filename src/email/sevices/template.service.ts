import {Injectable} from '@nestjs/common';
import * as Mustache from 'mustache';
import * as fs from 'fs';
import {resolve} from "path";

@Injectable()
export class TemplateService {

    constructor(){}

    getHTML(templateName: string, data: {[index:string]:string}): string{
        return Mustache.render(fs.readFileSync(resolve(__dirname, '..','..','..', 'templates', templateName+'.mustache')).toString(), data);
    }

}

