import {
    Entity,
    Column,
    ManyToMany, JoinTable, OneToOne, JoinColumn, ManyToOne, Index, OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../share/entity/base.entity';
import {CategorieLiveEntity} from "./categorie-live.entity";
import {UserEntity} from "../../users/entity/user.entity";

@Entity()
export class ReplayEntity extends BaseEntity<ReplayEntity> {
    @Index()
    @Column({ type: 'varchar', length: 128 })
    path: string;
    @Index()
    @Column({ type: 'varchar', length: 128, default:null, nullable: true })
    convertId: string;
    @Column({ type: 'int',default:null, nullable: true })
    duration: number;
    @Column({ type: 'boolean', default: false})
    status: boolean;
    @ManyToOne(type => CategorieLiveEntity, cat => cat.lives)
    catLevel: CategorieLiveEntity;
    @ManyToOne(type => CategorieLiveEntity, cat => cat.lives)
    catLanguage: CategorieLiveEntity;
    @Column({ type: "varchar", length: 255, default:null, nullable: true})
    title: string;
    @ManyToOne(type => UserEntity, user => user.replay) // specify inverse side as a second parameter
    user: UserEntity;
}
