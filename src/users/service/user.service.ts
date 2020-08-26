
import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import {getConnection, Repository} from 'typeorm';
import {StringTools} from "../../share/tools/string-tools";
import {SSO_TYPE, USER_ROLE} from "../../auth/constants";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import {LiveEntity} from "../entity/live.entity";
import {EmailUserService} from "../../email/sevices/email-user.service";
import * as config from 'config';
import { LiveService } from "./live.service";
import {EmailService} from "../../email/sevices/email.service";
import {IUserUpdate} from "../interface/user.interface";

@Injectable()
export class UserService {

  constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
              private readonly emailUserService: EmailUserService,
              private readonly emailService: EmailService,
              private readonly liveService: LiveService) { }


  public getById(id: string, withLive: boolean = false): Promise<UserEntity>{
    return this.usersRepository.findOne(id,(withLive?{relations:['live','live.catLanguage','live.catLevel']}:{}));
  }

  public getByName(name: string, withLive: boolean = false): Promise<UserEntity>{
    return this.usersRepository.findOne({pseudo: name},(withLive?{relations:['live','live.catLanguage','live.catLevel']}:{}));
  }
  public getMain(withLive: boolean = false): Promise<UserEntity>{
    return this.usersRepository.findOne({main: true},(withLive?{relations:['live','live.catLanguage','live.catLevel']}:{}));
  }

  public async findOneByEmail(email: string, sso?: SSO_TYPE): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: [{email,...(sso?{sso}:{})}]
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
  public async findOneBySSOId(ssoId: string, sso: SSO_TYPE): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: [{ssoId,sso}]
    });
    if (!user) {
      throw new NotFoundException(`User with ssoId ${ssoId} not found for sso ${sso}`);
    }
    return user;
  }

  public async findOneByGithubUserName(githubUserName: string): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: [{githubUserName}]
    });
    if (!user) {
        throw new NotFoundException(`User with github username ${githubUserName} not found`);
    }
    return user;
  }

  public async create(email: string,pseudo: string,firstName: string,lastName:string,sso: SSO_TYPE, password ?: string, ssoId?: string): Promise<UserEntity> {

    const live: LiveEntity = await this.liveService.create();
    return this.usersRepository.save({
      email,
      pseudo,
      firstName,
      lastName,
      sso,
      password : await this.cryptPassword(password || StringTools.generateKey(32)),
      ssoId,
      live : live,
      roles : [USER_ROLE.USER],
      pendingVerification: StringTools.generateKey(32)
    }).then((user)=>{
      this.emailUserService.sendEmailVerification({
            To:[{
              Email: user.email,
              Name: user.pseudo
            }]
          },
          {emailVerificationLink:config.get('rallypointtech.baseUrl')+"user/verify?code="+user.pendingVerification+"&userId="+user.id}
      );
      this.emailService.addContact(user.email,user.pseudo);
      return new UserEntity(user);
    }).catch((e)=>{
      if(e.code == "ER_DUP_ENTRY") {
        throw new BadRequestException("USER_EXIST");
      }
      throw e;
      return null;
    });
  }

  public async cryptPassword(password: string): Promise<string>{
    password = password.replace(/ /g, '+').toLowerCase();
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  }

  public async comparePassword(password:string, cryptPassword: string): Promise<boolean>{
    password = password.replace(/ /g, '+').toLowerCase();
    return bcrypt.compare(password, cryptPassword);
  }

  public async createResetPassword(email: string): Promise<boolean>{
    const user: UserEntity = await this.usersRepository.findOne({email:email});
    if(!user){throw new NotFoundException();}
    user.pendingPassword = StringTools.generateKey(32);
    await this.emailUserService.changePassword(
        {To:[{
            Email:user.email,
            Name: user.pseudo
          }]},
        {changePasswordLink:config.get('rallypointtech.baseUrl')+"user/change-password?code="+user.pendingPassword+"&userId="+user.id});
    return this.usersRepository.save(user).then(()=>true);
  }

  public async validEmail(userId: string, code: string): Promise<UserEntity>{
    const user: UserEntity = await this.usersRepository.findOne(userId);
    // User notfound
    if(!user){ throw new NotFoundException();}
    // User allready verified
    if(!user.pendingVerification){ return user; }
    // Invalid code
    if(user.pendingVerification !== code){ throw new BadRequestException('CODE_INVALID'); }
    user.pendingVerification = "";
    await this.usersRepository.save(user);
    return user;
  }

  public async changePassword(password: string, code: string): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepository.findOne({pendingPassword: code});
    if(!user){ throw new NotFoundException(); }
    user.pendingPassword = null;
    user.password = await this.cryptPassword(password);
    return this.usersRepository.save(user);
  }

  public async update(userId: string, data: IUserUpdate): Promise<UserEntity> {
    const user: UserEntity = await this.getById(userId);
    if(data.avatar && user.avatar){
      try {
        fs.unlinkSync(config.get('fs.avatar')+"/"+user.avatar);
      }catch (e) {

      }
    }
    this.usersRepository.update(userId,data);
    const userEntity: UserEntity = await this.usersRepository.findOne(userId);
    return Object.assign({}, userEntity, data);
  }

}

