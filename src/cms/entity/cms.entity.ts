import {
    Entity,
    Column,
    Index
} from 'typeorm';
import { BaseEntity } from '../../share/entity/base.entity';

@Entity()
export class CmsEntity extends BaseEntity<CmsEntity> {
    @Index()
    @Column({ type: 'varchar', length: 10 })
    language: string;
    @Index()
    @Column({ type: 'varchar', length: 32 })
    slug: string;
    @Column({ type: 'text'})
    content: string;
}
