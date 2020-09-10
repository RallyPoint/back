import {
    Entity,
    Column, OneToMany,
    ManyToMany, OneToOne, JoinColumn, Index, JoinTable, ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../share/entity/base.entity';
import {SSO_TYPE, USER_ROLE} from "../../auth/constants";
import {LiveEntity} from "./live.entity";
import {ReplayEntity} from "./replay.entity";

@Entity()
export class UserEntity extends BaseEntity<UserEntity> {

    @Column({type: 'varchar'})
    email: string;
    @Column({ type: 'boolean', default: false})
    main: boolean;
    @Column({ type: 'text',default:null, nullable: true})
    desc: string;
    @Index()
    @Column({type: 'varchar'})
    pseudo: string;
    @Column({type: 'varchar', default:null, nullable: true})
    avatar: string;
    @Column({type: 'varchar', default:null, nullable: true})
    firstName: string;
    @Column({type: 'varchar', default:null, nullable: true})
    lastName: string;
    @Column({type: 'varchar'})
    password: string;
    @Index()
    @Column({type: 'enum', enum: SSO_TYPE})
    sso: SSO_TYPE;
    @Column({type: 'varchar', length: 32, default:null, nullable: true})
    @Index()
    ssoId: string;
    @Column({type: 'simple-array'})
    roles: USER_ROLE[];
    @Index()
    @Column({type: 'varchar', length: 32, default:null, nullable: true})
    pendingVerification: string;
    @Index()
    @Column({type: 'varchar', length: 32, default:null, nullable: true})
    pendingPassword: string;

    @ManyToMany(type => UserEntity, user => user.follower)
    @JoinTable()
    followed: UserEntity[];

    @ManyToMany(type => UserEntity, user => user.followed)
    follower: UserEntity[];

    @OneToOne(type => LiveEntity)
    @JoinColumn()
    live: LiveEntity;
    @OneToMany(type => ReplayEntity, replay => replay.user)
    @JoinColumn()
    replay: ReplayEntity[];

}
