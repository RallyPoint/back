import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
  } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import { BaseEntity } from '../../share/entity/base.entity';

  @Entity()
  export class UserEntity extends BaseEntity {
    @Column({ type: 'varchar' }) email: string;
    @Column({ type: 'varchar' }) firstName: string;
    @Column({ type: 'varchar' }) lastName: string;
    @Column({ type: 'varchar' }) password: string;
    @Column({ type: 'varchar', unique: true }) githubUserName: string;

    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
