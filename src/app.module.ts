import {MiddlewareConsumer, Module} from '@nestjs/common';
import { StatusController } from './status.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './share/config/config.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import {EmailModule} from "./email/email.module";
import {ShareModule} from "./share/share.module";
import {CmsModule} from "./cms/cms.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UsersModule,
    EmailModule,
    ShareModule,
    CmsModule
  ],
  controllers: [AppController, StatusController],
  providers: [AppService],
})
export class AppModule {

}
