import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Raw, Repository} from "typeorm";
import {LiveEntity} from "../entity/live.entity";
import {CategorieLiveEntity} from "../entity/categorie-live.entity";
import {StringTools} from "../../share/tools/string-tools";
import {EmailUserService} from "../../email/sevices/email-user.service";
import {UserEntity} from "../entity/user.entity";

@Injectable()
export class LiveService {

  constructor(
      private readonly emailUserService: EmailUserService,
      @InjectRepository(LiveEntity) private liveRepository: Repository<LiveEntity>,
      @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
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

  public async getLives(language?: string, level?: string, title?: string, status: boolean = null, skip:number = 0, take:number = 20): Promise<LiveEntity[]>{
    return this.liveRepository.find({
      where : {
        ...(status === null ? {}:{status: status}),
        ...(language?{catLanguage: language} : {}),
        ...(level?{catLevel: level} : {}),
        ...(title?{title:Raw( alias => `LOWER(${alias}) Like '%${title.toLowerCase()}%'`)}:{})
      },
      relations : ['user','catLanguage','catLevel'],
      take: take,
      skip: skip
    });
  }

  public async countLives(language?: string, level?: string, title?: string,status: boolean = null, skip:number = 0, take:number = 20): Promise<number>{
    return this.liveRepository.count({
      where : {
        ...(status === null ? {}:{status: status}),
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

  public async sendNotification(live: LiveEntity): Promise<void>{
    this.userRepository.findOne({ id: live.user.id},{relations: ['follower']})
        .then((user)=>{
      user.follower.forEach((follower)=>{
        this.emailUserService.notificationLive({
          To:[{
            Email: follower.email,
            Name: follower.pseudo
          }]
        }, {
          title : live.title,
          pseudo : user.pseudo,
          avatar : user.avatar,
          liveThumb : live.thumb
        });
      });
      this.liveRepository.update(live.id,{lastSendMail:new Date()});
    });
    return;
  }
}

