import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameImageEntity } from '../entity/game-image.entity';

@Injectable()
export class GameImageService {
    constructor(@InjectRepository(GameImageEntity) private gameImageRepository: Repository<GameImageEntity>) { }

    async createGameImage(gameImage): Promise<GameImageEntity> {
        return await this.gameImageRepository.save(gameImage);
    }
}