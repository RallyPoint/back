import {
    Entity,
    Column,
    Index
} from 'typeorm';
import { BaseEntity } from '../../share/entity/base.entity';

@Entity()
export class ChatBanEntity extends BaseEntity<ChatBanEntity> {
    @Index()
    @Column({ type: 'varchar', length: 36 })
    userId: string;
    @Index()
    @Column({ type: 'varchar', length: 36 })
    channel: string;
    @Column({ type: 'boolean' })
    status: boolean;
}
