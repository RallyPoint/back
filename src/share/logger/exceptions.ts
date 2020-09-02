import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
} from '@nestjs/common';
import { RPTLoggerService } from './logger.service';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: RPTLoggerService) {
    }

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (exception instanceof InternalServerErrorException || !(exception instanceof HttpException)) {
            this.logFatal(response, request, exception);
        } else {
            this.logException(response, request, exception);
        }
    }

    private logFatal(response, request, exception: InternalServerErrorException | Error | any): void {

        const exceptionStack = JSON.stringify(exception.stack);
        this.logger.crit(
            'FATAL_ERROR ' + JSON.stringify((exception.message.message || exception.message || '')),
            exception.message.code,
            exceptionStack ? { exceptionStack : exception.stack.toString()} : {});
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }

    private logException(response, request, exception: HttpException): void {
        this.logger.warn('EXCEPTION ' + JSON.stringify(exception.getResponse() || ''), exception.getStatus().toString() || '500', {
            exception : JSON.stringify(exception),
            stack: exception.stack
        });
        response.status(exception.getStatus()).json(exception.getResponse());
    }
}
