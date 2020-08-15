import { Module } from '@nestjs/common';
import {ExceptionsFilter} from "./logger/exceptions";
import {RPTLoggerService} from "./logger/logger.service";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {LoggingInterceptor} from "./logger/logging.interceptor";

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    ExceptionsFilter,
    RPTLoggerService
  ],
  exports: [ExceptionsFilter,RPTLoggerService],
})
export class ShareModule {}
