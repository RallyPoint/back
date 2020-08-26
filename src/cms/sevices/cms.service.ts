import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CmsEntity} from "../entity/cms.entity";

@Injectable()
export class CmsService {

    constructor(
        @InjectRepository(CmsEntity) private cmsRepository: Repository<CmsEntity>
    ){
    }

    public async getBySlug(slug : string, language : string): Promise<CmsEntity> {
        let cmsEntity: CmsEntity = await this.cmsRepository.findOne({slug,language});
        if(!cmsEntity){
            cmsEntity = await this.cmsRepository.findOne({slug,language: 'default'});
        }
        return cmsEntity;
    }
}

