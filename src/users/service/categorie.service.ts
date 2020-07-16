
import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {LiveEntity} from "../entity/live.entity";
import {CategorieLiveEntity} from "../entity/categorie-live.entity";
import {StringTools} from "../../share/tools/string-tools";
import {CATEGORIE_TYPE} from "../../auth/constants";

@Injectable()
export class CategorieService {

  constructor(
      @InjectRepository(CategorieLiveEntity) private categorieRepository: Repository<CategorieLiveEntity>
  ) { }

  public getByType(type: CATEGORIE_TYPE): Promise<CategorieLiveEntity[]> {
    return this.categorieRepository.find({where:{type:type}});
  }
}

