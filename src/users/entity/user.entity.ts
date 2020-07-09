import {
    Entity,
    Column,
    ManyToMany, OneToOne, JoinColumn, Index, JoinTable,
} from 'typeorm';
import { BaseEntity } from '../../share/entity/base.entity';
import {SSO_TYPE, USER_ROLE} from "../../auth/constants";
import {LiveEntity} from "./live.entity";

@Entity()
export class UserEntity extends BaseEntity<UserEntity> {

    @Column({type: 'varchar'})
    email: string;
    @Index()
    @Column({type: 'varchar'})
    pseudo: string;
    @Column({type: 'varchar'})
    firstName: string;
    @Column({type: 'varchar'})
    lastName: string;
    @Column({type: 'varchar'})
    password: string;
    @Index()
    @Column({type: 'enum', enum: SSO_TYPE})
    sso: SSO_TYPE;
    @Column({type: 'varchar', length: 32})
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
    @ManyToMany(type => UserEntity)
    @JoinTable()
    followeds: UserEntity[];
    @ManyToMany(type => UserEntity)
    @JoinTable()
    followers: UserEntity[];
    @OneToOne(type => LiveEntity)
    @JoinColumn()
    live: LiveEntity;

}
