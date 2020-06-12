import {
    Entity,
    Column,
    BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../share/entity/base.entity';
import {classToPlain, Exclude} from "class-transformer";
import {SSO_TYPE, USER_ROLE} from "../../auth/constants";

@Entity()
export class UserEntity extends BaseEntity {
    @Column({ type: 'varchar' })
    email: string;
    @Exclude({ toPlainOnly: true })
    @Column({ type: 'varchar' })
    pseudo: string;
    @Exclude({ toPlainOnly: true })
    @Column({ type: 'varchar' })
    firstName: string;
    @Column({ type: 'varchar' })
    lastName: string;
    @Exclude({ toPlainOnly: true })
    @Column({ type: 'varchar' })
    password: string;
    @Exclude({ toPlainOnly: true })
    @Column({ type: 'varchar', length: 32 })
    liveKey: string;
    @Column({ type: 'boolean', default: false})
    liveStatus: boolean;
    @Column({ type: 'enum',enum: SSO_TYPE}) // @todo : MIGRATE TO ENUM SSO_TYPE
    sso: SSO_TYPE;
    @Column({ type: 'varchar', length: 32 })
    ssoId: string;
    @Column({ type: 'simple-array'})
    roles: USER_ROLE[];

    public toJSON(){
        return classToPlain(this);
    }
}
