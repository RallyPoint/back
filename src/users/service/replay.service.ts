
import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CategorieLiveEntity} from "../entity/categorie-live.entity";
import {ReplayEntity} from "../entity/replay.entity";
import {UserEntity} from "../entity/user.entity";

@Injectable()
export class ReplayService {

  constructor(
      @InjectRepository(ReplayEntity) private replayRepository: Repository<ReplayEntity>,
  @InjectRepository(CategorieLiveEntity) private categorieLiveRepository: Repository<CategorieLiveEntity>,
  ) { }

  public getById(id : string,userRelation:boolean = true): Promise<ReplayEntity> {
    const relations = ['catLanguage','catLevel'];
    if(userRelation) { relations.push('user'); }
    return this.replayRepository.findOne({
      where : {
        id
      },
      relations : relations
    });
  }

  public changeStatus(id: string,status: boolean): Promise<boolean> {
    return this.replayRepository.update(id,{status}).then(()=>true).catch(()=>false);
  }

  public getList(userId?:string, language?: string, level?: string): Promise<ReplayEntity[]>{
    return this.replayRepository.find({
      where : {
        status: true,
        ...(language?{catLanguage: language} : {}),
        ...(level?{catLevel: level} : {}),
        ...(userId?{user: userId} : {})
      },
      take:20,
      relations : ['user','catLanguage','catLevel']
    });
  }

  public async create(title: string,desc: string,user: UserEntity, catLevel: CategorieLiveEntity, catLanguage: CategorieLiveEntity,path:string): Promise<ReplayEntity>{
    return this.replayRepository.save(new ReplayEntity({
      title,
      desc,
      date: new Date(),
      user,
      catLevel,
      catLanguage,
      path,
      status: false
    }))
  }
}

