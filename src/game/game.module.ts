import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GameController } from './controller/game.controller';
import { GameEntity } from './entity/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameService } from './service/game.service';
import { GameImageService } from './service/game-image.service';
import { GameImageEntity } from './entity/game-image.entity';

@Module({
  imports: [MulterModule.register({
    dest: './uploads',
  }),
  TypeOrmModule.forFeature([
    GameEntity,
    GameImageEntity
  ])],
  providers: [GameService, GameImageService],
  controllers: [GameController],
})
export class GameModule {}