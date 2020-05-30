import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './share/config/config.service';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    GameModule,
    UserModule
  ],
  controllers: [StatusController],
  providers: [AppService],
})
export class AppModule {}
