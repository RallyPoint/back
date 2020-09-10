import { Injectable } from '@nestjs/common';
import { UserService } from '../../users/service/user.service';
import { JwtService } from '@nestjs/jwt';
import {UserEntity} from "../../users/entity/user.entity";
import {JwtModel} from "../model/jwt.model";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user: UserEntity = await this.usersService.findOneByEmail(email);
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
      roles: user.roles,
      color : Math.floor(Math.random()*16777215).toString(16)
    }).toJson());
  }

}
