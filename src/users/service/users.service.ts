
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
import { UserDto } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) { }


  async findOneByEmail(email: string): Promise<any | undefined> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: [{email}]
    });
    if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findOneByGithubUserName(githubUserName: string): Promise<any | undefined> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: [{githubUserName}]
    });
    if (!user) {
        throw new NotFoundException(`User with github username ${githubUserName} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    return await this.usersRepository.save(createUserDto);
  }

  toUserDto(user: any): UserDto {
    return {
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastName,
      githubUserName: user.githubUserName,
    };
  }
}

