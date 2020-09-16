
import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Like, Raw, Repository} from "typeorm";
import {CategorieLiveEntity} from "../entity/categorie-live.entity";
import {ReplayEntity} from "../entity/replay.entity";
import {UserEntity} from "../entity/user.entity";
import * as fs from "fs";
import * as config from 'config';


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
  public async delete(replay: ReplayEntity): Promise<void>{
    await this.replayRepository.delete(replay.id);
    fs.unlinkSync(config.get('fs.replay')+"/"+replay.user.pseudo+"/"+replay.file);
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
  public countReplay(language?: string, level?: string, title?: string, userId?: string, skip:number = 0, take:number = 20): Promise<number>{
    return this.replayRepository.count({
      where : {
        status: true,
        ...(userId?{user: userId} : {}),
        ...(language?{catLanguage: language} : {}),
        ...(level?{catLevel: level} : {}),
        ...(title?{title:Raw( alias => `LOWER(${alias}) Like '%${title.toLowerCase()}%'`)}:{})
      }
    });
  }
  public getReplay(language?: string, level?: string, title?: string, userId?: string, skip:number = 0, take:number = 20): Promise<ReplayEntity[]>{
    return this.replayRepository.find({
      where : {
        status: true,
        ...(userId?{user: userId} : {}),
        ...(language?{catLanguage: language} : {}),
        ...(level?{catLevel: level} : {}),
        ...(title?{title:Raw( alias => `LOWER(${alias}) Like '%${title.toLowerCase()}%'`)}:{})
      },
      take: take,
      skip: skip,
      relations : ['user','catLanguage','catLevel']
    });
  }

  public async create(title: string,desc: string,user: UserEntity, catLevel: CategorieLiveEntity, catLanguage: CategorieLiveEntity,file:string): Promise<ReplayEntity>{
    return this.replayRepository.save(new ReplayEntity({
      title,
      desc,
      date: new Date(),
      user,
      catLevel,
      catLanguage,
      path: file,
      file,
      status: true
    }))
  }

  public async update(liveId: string, data : {title: string, level: string, desc: string, thumb: string, language: string}): Promise<boolean> {
    const level: CategorieLiveEntity = await this.categorieLiveRepository.findOne(data.level);
    const language: CategorieLiveEntity = await this.categorieLiveRepository.findOne(data.language);
    if(!level || !language){
      throw new NotFoundException();
    }
    return this.replayRepository.update(liveId,{
      title: data.title,
      catLevel: level,
      thumb: data.thumb,
      desc: data.desc,
      catLanguage: language
    }).then(()=>true);
  }

}

