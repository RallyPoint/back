
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
import { UserDto } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import {StringTools} from "../../share/tools/string-tools";

@Injectable()
export class UsersService {

  public static readonly LIVE_KEY_LENGTH = 32;

  constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) { }


  public async findOneByEmail(email: string): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: [{email}]
    });
    if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
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

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.usersRepository.save({
      ...createUserDto,
      liveKey : StringTools.generateKey(UsersService.LIVE_KEY_LENGTH)
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


}

