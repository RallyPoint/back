import {
    Entity,
    ManyToOne
} from 'typeorm';
import {UserEntity} from "./user.entity";

@Entity()
export class UserFollowEntity {
    @ManyToOne(type => UserEntity, user => user.followeds, { primary: true })
    follower: UserEntity;
    @ManyToOne(type => UserEntity, user => user.followers, { primary: true })
    followed: UserEntity;
}
