import { LoggerService } from '@nestjs/common';
import * as Winston from 'winston';
import * as os from 'os';
import {RequestContext} from './request-context';
import {format} from 'date-fns';
import {v4} from 'uuid';

export class RPTLoggerService implements LoggerService {

    public winston: Winston.Logger;

    constructor() {
        this.winston = Winston.createLogger({
            levels: {
                crit: 0,
                error: 1,
                warn: 2,
                info: 3,
                http: 4,
                verbose: 5,
                debug: 6,
                silly: 7
            },
            level: (process.env.NODE_ENV === 'aws-prod') ? 'http' : 'silly',
            format: Winston.format.printf(this.format),
            transports: [
                new Winston.transports.Console(),
            ]
        });
    }
    log(message: string, codeError?: string, data?: object) { return this.winston.info(message, {codeError, data }); }
    error(message: string, trace?: string, codeError?: string, data?: object) {
        return this.winston.error(message, {codeError, data, trace });
    }
    crit(message: string, codeError?: string, data?: object) {return this.winston.crit(message, {codeError, data }); }
    warn(message: string, codeError?: string, data?: object) {return this.winston.warn(message, {codeError, data }); }
    debug(message: string, codeError?: string, data?: object) { return this.winston.debug(message, {codeError, data }); }
    verbose(message: string, codeError?: string, data?: object) { return this.winston.verbose(message, {codeError, data }); }

    public format({ level, message, label = '', timestamp = new Date(), codeError = '0000', trace = '', data = {} }): string {
        const currentRequestContext = RequestContext.currentRequestContext();
        const module = currentRequestContext ? currentRequestContext.module : 'SYSTEM';
        const id = currentRequestContext ? currentRequestContext.id : v4();
        const url = currentRequestContext && currentRequestContext.request ? currentRequestContext.request.originalUrl : '/system' ;
        if (!codeError.length) {codeError = '0000'; }
        let dataStr: string;
        try {
            dataStr = JSON.stringify(data);
        } catch (e) {
            dataStr = e.message;
        }
        return (format(new Date(timestamp), 'dd/MMM/yyyy:HH:mm:ss xxxx') + ' ' + // DATE
            level.toUpperCase() + ' ' +                                                 // LEVEL
            id + ' ' +                                                                  // unique ID
            url + ' ' +                                                                 // URL
            codeError.toString() + ' ' +                                                // CODE
            '"' + label + ' ' + message + '" ' +                                        // MESSAGE
            trace + ' ' +                                                               // TRACE
            ((dataStr.length > 15000) ? dataStr.slice(0, 15000) : dataStr)).replace(/\n|\r/g, ' - '); // TRACE
    }
}
