
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import {UserEntity} from "../../users/entity/user.entity";
import {JwtModel} from "../model/jwt.model";
import {USER_ROLE} from "../constants";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const user: UserEntity = await this.usersService.findOneByEmail(username);
    if (user && this.usersService.comparePassword(password,user.password)) {
      return user;
    }
    return null;
  }

  public valideToken(token: string): JwtModel {
    return new JwtModel(this.jwtService.verify(token));
  }

  public generateToken(user: UserEntity): string {
    return this.jwtService.sign(new JwtModel({
      pseudo : user.pseudo,
      email: user.email,
      id: user.id,
      sso: user.sso,
      roles: user.roles
    }).toJson());
  }

}
