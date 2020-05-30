import { Entity, Column, OneToMany} from 'typeorm';
import {BaseEntity} from '../../share/entity/base.entity';
import { GameImageEntity } from './game-image.entity';

@Entity()
export class GameEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name:String;

    @Column({ type: 'varchar', length: 50 })
    developer:string;

    @Column({ type: 'varchar', length: 50 })
    editor:string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    releaseDate:Date;

    @OneToMany(type => GameImageEntity, gameImage => gameImage.game)
    public images: GameImageEntity[];
}

