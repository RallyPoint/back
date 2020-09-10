import {Injectable, NotFoundException} from "@nestjs/common";
import {UserEntity} from "../entity/user.entity";
import {LiveEntity} from "../entity/live.entity";
import {UserService} from "./user.service";
import {InjectRepository} from "@nestjs/typeorm";
import {LiveService} from "./live.service";
import {Repository} from "typeorm";

@Injectable()
export class FollowService {

    constructor(private readonly userService: UserService,
                private readonly liveService: LiveService,
                @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>){}

    public async follow(followed: string, follower: string):Promise<UserEntity>{
        const userFollowed : UserEntity = await this.userService.getById(followed,true);
        this.userRepository.createQueryBuilder()
            .relation(UserEntity,'followed')
            .of(followed)
            .add(follower);
        return userFollowed;
    }
    public async unFollow(followed: string, follower: string):Promise<boolean>{
        return this.userRepository.createQueryBuilder()
            .relation(UserEntity,'followed')
            .of(followed)
            .remove(follower).then(()=>true);
    }

    public async getFollowedOf(user: string): Promise<UserEntity[]> {
        return this.userRepository.findOne({where: {id: user}, relations : ['followed','followed.live']})
            .then((user)=>{
                return user.followed;
            });
    }

}
