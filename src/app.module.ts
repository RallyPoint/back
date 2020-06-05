import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './share/config/config.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import {LiveModule} from "./live/live.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UsersModule,
      LiveModule
  ],
  controllers: [AppController, StatusController],
  providers: [AppService],
})
export class AppModule {}
