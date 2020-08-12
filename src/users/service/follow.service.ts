import {Injectable, NotFoundException} from "@nestjs/common";
import {UserEntity} from "../entity/user.entity";
import {LiveEntity} from "../entity/live.entity";
import {UserService} from "./user.service";
import {InjectRepository} from "@nestjs/typeorm";
import {UserFollowEntity} from "../entity/user-follow.entity";
import {LiveService} from "./live.service";
import {Repository} from "typeorm";

@Injectable()
export class FollowService {

    constructor(private readonly userService: UserService,
                private readonly liveService: LiveService,
                @InjectRepository(UserFollowEntity) private userFollowRepository: Repository<UserFollowEntity>){}

    public async follow(followed: string, follower: string):Promise<UserEntity>{
        const userFollowed : UserEntity = await this.userService.getById(followed,true);
        return this.userFollowRepository.save({
            follower: new UserEntity({id:follower}),
            followed: userFollowed
        }).then(()=>userFollowed);
    }
    public async unFollow(followed: string, follower: string):Promise<boolean>{
        return this.userFollowRepository.delete({
            follower: new UserEntity({id:follower}),
            followed: new UserEntity({id:followed})
        }).then(()=>true);
    }

    public async getFollowedOf(user: string): Promise<UserEntity[]> {
        return this.userFollowRepository.find({where: {follower: user}, relations : ['followed','followed.live']})
            .then((usersFollow)=>{
                return usersFollow.map((userFollow)=>userFollow.followed);
            });
    }
}

