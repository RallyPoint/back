import {
    Entity,
    Column,
    ManyToMany, JoinTable, OneToOne, JoinColumn, ManyToOne, Index, OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../share/entity/base.entity';
import {CategorieLiveEntity} from "./categorie-live.entity";
import {UserEntity} from "../../users/entity/user.entity";

@Entity()
export class LiveEntity extends BaseEntity<LiveEntity> {
    @Index()
    @Column({ type: 'varchar', length: 32 })
    key: string;
    @Column({ type: 'boolean', default: false})
    status: boolean;
    @ManyToOne(type => CategorieLiveEntity, cat => cat.lives)
    catLevel: CategorieLiveEntity;
    @ManyToOne(type => CategorieLiveEntity, cat => cat.lives)
    catLanguage: CategorieLiveEntity;
    @ManyToMany(type => UserEntity)
    subscriber: UserEntity[];
    @Index()
    @Column({ type: "varchar", length: 64, default:null, nullable: true})
    pspKey: string;
    @Column({ type: "varchar", length: 255, default:null, nullable: true})
    title: string;
}
