import {
    Entity,
    Column,
    ManyToMany, JoinTable, OneToOne, JoinColumn, ManyToOne, Index, OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../share/entity/base.entity';
import {CategorieLiveEntity} from "./categorie-live.entity";
import {UserEntity} from "./user.entity";

@Entity()
export class LiveEntity extends BaseEntity<LiveEntity> {
    @Index()
    @Column({ type: 'varchar', length: 32 })
    key: string;
    @Column({ type: 'varchar', length: 32 })
    ip: string;
    @Column({ type: 'boolean', default: false})
    status: boolean;
    @Column({ type: 'datetime',default:null, nullable: true})
    date: Date;
    @Column({ type: 'text',default:null, nullable: true})
    desc: string;
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
    @OneToOne(type => LiveEntity)
    @JoinColumn()
    live: LiveEntity;
    @OneToOne(type => UserEntity, user => user.live) // specify inverse side as a second parameter
    user: UserEntity;
}
