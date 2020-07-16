
import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {LiveEntity} from "../entity/live.entity";
import {CategorieLiveEntity} from "../entity/categorie-live.entity";
import {StringTools} from "../../share/tools/string-tools";

@Injectable()
export class LiveService {

  constructor(
      @InjectRepository(LiveEntity) private liveRepository: Repository<LiveEntity>,
  @InjectRepository(CategorieLiveEntity) private categorieLiveRepository: Repository<CategorieLiveEntity>,
  ) { }

  public getById(id : string): Promise<LiveEntity> {
    return this.liveRepository.findOne(id);
  }

  public setStatus(id: string,status: boolean): Promise<boolean> {
    return this.liveRepository.update(id,{status}).then(()=>true).catch(()=>false);
  }

  public async getLiveOn(language?: string, level?: string): Promise<LiveEntity[]>{
    return this.liveRepository.find({
      where : {
        status: true,
        ...(language?{catLanguage: language} : {}),
        ...(level?{catLevel: level} : {})
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

  public async update(liveId: string, data : {title: string, level: string, language: string}): Promise<boolean> {
    const level: CategorieLiveEntity = await this.categorieLiveRepository.findOne(data.level);
    const language: CategorieLiveEntity = await this.categorieLiveRepository.findOne(data.language);
    if(!level || !language){
      throw new NotFoundException();
    }
    return this.liveRepository.update(liveId,{
      title: data.title,
      catLevel: level,
      catLanguage: language
    }).then(()=>true);
  }
}

