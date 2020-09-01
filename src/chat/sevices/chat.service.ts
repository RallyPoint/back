import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ChatBanEntity} from "../entity/chat-ban.entity";

@Injectable()
export class ChatService {

    constructor(
        @InjectRepository(ChatBanEntity) private chatBanRepository: Repository<ChatBanEntity>
    ){
    }

    public async isBan(channel : string, userId : string): Promise<boolean> {
        let chatBanEntity: ChatBanEntity = await this.chatBanRepository.findOne({where:{userId,channel}});
        if(!chatBanEntity){
            return false;
        }
        return chatBanEntity.status;
    }

    public async ban(channel : string, userId : string): Promise<boolean> {
        return await this.chatBanRepository.save({channel,userId,status:true})
            .then(()=>true)
            .catch((e)=>{
                console.error(e);
                return false;
            });
    }
}

