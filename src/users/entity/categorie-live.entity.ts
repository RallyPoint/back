import {
    Entity,
    Column,
    Unique, ManyToOne, OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../share/entity/base.entity';
import { CATEGORIE_TYPE } from "../../auth/constants";
import {LiveEntity} from "./live.entity";

@Entity()
@Unique(['type','name'])
export class CategorieLiveEntity extends BaseEntity<CategorieLiveEntity> {
    @Column({ type: 'varchar', length: 32 })
    name: string;
    @Column({ type: 'enum',enum: CATEGORIE_TYPE})
    type: string;
    @OneToMany(type => LiveEntity, (live: LiveEntity) => {
        return this.type === CATEGORIE_TYPE.LANGUAGE ? live.catLanguage : live.catLevel;
    })
    lives: LiveEntity[]
}
