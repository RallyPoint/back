import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import { RPTLoggerService} from './logger.service';


@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    constructor(private readonly logger: RPTLoggerService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        this.logger.log(`Request`, '0000', { method : req.method, body: req.body});
        return next.handle().pipe(tap((data) => {
            const res = context.switchToHttp().getResponse();
            if ((res.statusCode || 200) > 499) {
                this.logger.crit(`Response`, res.statusCode || 200, data);
            } else {
                this.logger.log(`Response`, res.statusCode || 200, data);
            }
        }), catchError((err, caught) => {
            const res = context.switchToHttp().getResponse();
            if ((res.statusCode || 200) > 499) {
                this.logger.crit(`Response`, err.code || 500, err.code);
            } else {
                this.logger.warn(`Response`, err.code || 500, err.code);
            }
            throw err;
            return err;
        }));
    }
}
