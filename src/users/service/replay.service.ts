
import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {LiveEntity} from "../entity/live.entity";
import {CategorieLiveEntity} from "../entity/categorie-live.entity";
import {StringTools} from "../../share/tools/string-tools";
import {ReplayEntity} from "../entity/replay.entity";
import {UserEntity} from "../entity/user.entity";

@Injectable()
export class ReplayService {

  constructor(
      @InjectRepository(ReplayEntity) private replayRepository: Repository<ReplayEntity>,
  @InjectRepository(CategorieLiveEntity) private categorieLiveRepository: Repository<CategorieLiveEntity>,
  ) { }

  public getById(id : string,status:boolean = true): Promise<ReplayEntity> {
    return this.replayRepository.findOne({id,status});
  }

  public changeStatus(id: string,status: boolean): Promise<boolean> {
    return this.replayRepository.update(id,{status}).then(()=>true).catch(()=>false);
  }

  public async create(title: string,user: UserEntity, catLevel: CategorieLiveEntity, catLanguage: CategorieLiveEntity,path:string): Promise<ReplayEntity>{
    return this.replayRepository.save(new ReplayEntity({
      title,
      user,
      catLevel,
      catLanguage,
      path,
      status: false
    }))
  }
}

