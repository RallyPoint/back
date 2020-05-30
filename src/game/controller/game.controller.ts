import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Put,
  Delete,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { GameService } from '../service/game.service';
import { GameEntity } from '../entity/game.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../../share/tools/file-uploading.utils';
import { GameImageService } from '../service/game-image.service';

@Controller('game')
export class GameController {

  constructor(private gameService: GameService,
              private gameImageService: GameImageService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<GameEntity[]> {
    return this.gameService.getGames();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  get(@Param() params): Promise<GameEntity> {
      return this.gameService.getGame(params.id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() user: GameEntity): Promise<GameEntity> {
      return this.gameService.createGame(user);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param() params, @Body() user: GameEntity): Promise<GameEntity> {
      return this.gameService.updateGame(params.id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteGame(@Param() params) {
      return this.gameService.deleteGame(params.id);
  }

  @Post(':id/gallery')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadGalleryGame(@UploadedFiles() files, @Param() params) {
    const game: GameEntity = await this.gameService.getGame(params.id);
    await Promise.all(files.map(({filename, originalname}) =>
      this.gameImageService.createGameImage({
      fileName: filename,
      originalName: originalname,
      game
      })
    ));
  }
}




