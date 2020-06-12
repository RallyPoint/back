
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import {StringTools} from "../../share/tools/string-tools";
import {SSO_TYPE, USER_ROLE} from "../../auth/constants";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {

  public static readonly LIVE_KEY_LENGTH = 32;

  constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) { }


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
    return await this.usersRepository.save({
      email,
      pseudo,
      firstName,
      lastName,
      sso,
      password : await this.cryptPassword(password || StringTools.generateKey(UsersService.LIVE_KEY_LENGTH)),
      ssoId,
      liveKey : StringTools.generateKey(UsersService.LIVE_KEY_LENGTH),
      roles : [USER_ROLE.USER]
    });
  }

  public async setLive(user: UserEntity,liveStatus:boolean){
    await this.usersRepository.update(user,{liveStatus})
  }

  public async findOneByLiveKeyUserName(liveKey: string): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: [{liveKey}]
    });
    if (!user) {
      throw new NotFoundException(`User with liveKey ${liveKey} not found`);
    }
    return user;
  }

  public async getUserLiveOn(): Promise<UserEntity[]>{
    return this.usersRepository.find({
      liveStatus: true
    });
  }

  public async cryptPassword(password: string): Promise<string>{
    password = password.replace(/ /g, '+').toLowerCase();
    return new Promise((resolve, reject)=>{
      bcrypt.genSalt(10, function(err, salt) {
        if (err) return reject(err);
        bcrypt.hash(password, salt, function(err, hash) {
          if (err) return reject(err);
          return resolve(hash);
        });
      });
    });
  }

  public async comparePassword(password:string, cryptPassword: string): Promise<boolean>{
    password = password.replace(/ /g, '+').toLowerCase();
    return new Promise((resolve, reject)=>{
      bcrypt.compare(password, cryptPassword, function(err, isPasswordMatch) {
        return err == null ?
            resolve(isPasswordMatch) :
            reject(err);
      });
    });
  }

}

