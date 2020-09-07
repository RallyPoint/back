import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Like, Raw, Repository} from "typeorm";
import {LiveEntity} from "../entity/live.entity";
import {CategorieLiveEntity} from "../entity/categorie-live.entity";
import {StringTools} from "../../share/tools/string-tools";
import {UserEntity} from "../entity/user.entity";

@Injectable()
export class LiveService {

  constructor(
      @InjectRepository(LiveEntity) private liveRepository: Repository<LiveEntity>,
  @InjectRepository(CategorieLiveEntity) private categorieLiveRepository: Repository<CategorieLiveEntity>,
  ) { }

  public getById(id : string): Promise<LiveEntity> {
    return this.liveRepository.findOne(id);
  }

  public setStatus(id: string,status: boolean, ip: string =  null): Promise<boolean> {
    return this.liveRepository.update(id,{status,ip}).then(()=>true).catch(()=>false);
  }

  public getByKey(key: string): Promise<LiveEntity>{
    return this.liveRepository.findOne({
      where:{key},
      relations : ['user']
    });
  }

  public async getLiveOn(language?: string, level?: string, title?: string, skip:number = 0, take:number = 20): Promise<LiveEntity[]>{
    return this.liveRepository.find({
      where : {
        status: true,
        ...(language?{catLanguage: language} : {}),
        ...(level?{catLevel: level} : {}),
        ...(title?{title:Raw( alias => `LOWER(${alias}) Like '%${title.toLowerCase()}%'`)}:{})
      },
      relations : ['user','catLanguage','catLevel'],
      take: take,
      skip: skip
    });
  }

  public async countLiveOn(language?: string, level?: string, title?: string, skip:number = 0, take:number = 20): Promise<number>{
    return this.liveRepository.count({
      where : {
        status: true,
        ...(language?{catLanguage: language} : {}),
        ...(level?{catLevel: level} : {}),
        ...(title?{title:Raw( alias => `LOWER(${alias}) Like '%${title.toLowerCase()}%'`)}:{})
      }
    });
  }

  public async generateNewKey(liveId: string): Promise<string> {
    const liveKey : string = StringTools.generateKey(32);
    this.liveRepository.update(liveId,{key:liveKey});
    return liveKey
  }

  public async create(): Promise<LiveEntity>{
    return this.liveRepository.save(new LiveEntity({key:StringTools.generateKey(32)}))
  }

  public async update(liveId: string, data : {title: string, level: string, desc: string, thumb: string, language: string,date:Date}): Promise<boolean> {
    const level: CategorieLiveEntity = await this.categorieLiveRepository.findOne(data.level);
    const language: CategorieLiveEntity = await this.categorieLiveRepository.findOne(data.language);
    if(!level || !language){
      throw new NotFoundException();
    }
    return this.liveRepository.update(liveId,{
      title: data.title,
      catLevel: level,
      date: data.date,
      thumb: data.thumb,
      desc: data.desc,
      catLanguage: language
    }).then(()=>true);
  }
}

