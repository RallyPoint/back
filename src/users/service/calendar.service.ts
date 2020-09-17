
import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import {getConnection, Raw, Repository} from 'typeorm';
import {CalendarEntity} from "../entity/calendar.entity";
import {CategorieService} from "./categorie.service";
import {CategorieLiveEntity} from "../entity/categorie-live.entity";

@Injectable()
export class CalendarService {

  constructor(
      @InjectRepository(CalendarEntity) private calendarRepository: Repository<CalendarEntity>,
      private categorieService: CategorieService
  ) { }

  public getById(id : string, withRelation: boolean): Promise<CalendarEntity>{
    return this.calendarRepository.findOne(id,{
      ...(withRelation?{relations:['user']}:{})
    });
  }

  public getListOfUser(userId: string): Promise<CalendarEntity[]> {
    return this.calendarRepository.find({where : {user: userId}, relations: ['catLanguage','catLevel']});
  }

  public async create(title: string, desc: string, start: Date, end: Date, level: string, language: string, user: UserEntity) : Promise<void> {
    const levelEntity : CategorieLiveEntity = await this.categorieService.getById(level);
    const languageEntity : CategorieLiveEntity = await this.categorieService.getById(language);
    await this.calendarRepository.save({
      title,
      desc,
      start,
      end,
      catLevel: levelEntity,
      catLanguage: languageEntity,
      user
    });
  }

  public async delete(id: string): Promise<void> {
    await this.calendarRepository.delete(id);
  }
}

