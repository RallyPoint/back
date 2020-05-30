import { Entity, Column, ManyToOne} from 'typeorm';
import {BaseEntity} from '../../share/entity/base.entity';
import { GameEntity } from './game.entity';

@Entity()
export class GameImageEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    originalName:String;

    @Column({ type: 'varchar', length: 50 })
    fileName:string;

    @ManyToOne(type => GameEntity, game => game.images, {onDelete: 'CASCADE'})
    public game: GameEntity;
}

