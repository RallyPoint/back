import {
    Entity,
    Column,
    ManyToMany, JoinTable, OneToOne, JoinColumn, ManyToOne, Index, OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../share/entity/base.entity';
import {CategorieLiveEntity} from "./categorie-live.entity";
import {UserEntity} from "./user.entity";

@Entity()
export class CalendarEntity extends BaseEntity<CalendarEntity> {
    @Column({ type: 'datetime'})
    start: Date;
    @Column({ type: 'datetime'})
    end: Date;
    @Column({ type: 'varchar', length: 255})
    title: string;
    @Column({ type: 'text'})
    desc: string;
    @ManyToOne(type => CategorieLiveEntity, cat => cat.lives)
    catLevel: CategorieLiveEntity;
    @ManyToOne(type => CategorieLiveEntity, cat => cat.lives)
    catLanguage: CategorieLiveEntity;
    @ManyToOne(type => UserEntity, user => user.calendar)
    user: UserEntity;
}
