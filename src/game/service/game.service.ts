import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from '../entity/game.entity';

@Injectable()
export class GameService {
    constructor(@InjectRepository(GameEntity) private gamesRepository: Repository<GameEntity>) { }

    async getGames(): Promise<GameEntity[]> {
        return await this.gamesRepository.find();
    }

    async getGame(id: number): Promise<GameEntity> {
        const game: GameEntity = await this.gamesRepository.findOne({
            where: [{id}]
        });
        if (!game) {
            throw new NotFoundException(`Game with id ${id} not found`);
        }
        return game;
    }

    async createGame(game: GameEntity): Promise<GameEntity> {
        return await this.gamesRepository.save(game)
    }

    async updateGame(id: number, game: GameEntity): Promise<GameEntity> {
        const gameRepository: GameEntity = await this.gamesRepository.findOne({
            where: [{id}],
            relations: ["images"]
        });
        if (!gameRepository) {
            throw new NotFoundException(`Game with id ${id} not found`);
        }
        return await this.gamesRepository.save(game);
    }

    async deleteGame(id: number) {
        this.gamesRepository.delete(id);
    }

}