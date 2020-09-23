import { Injectable } from '@nestjs/common';
import { UserService } from '../../users/service/user.service';
import { JwtService } from '@nestjs/jwt';
import {UserEntity} from "../../users/entity/user.entity";
import {AccessTokenModel} from "../model/access-token.model";
import {RefreshTokenModel} from "../model/refresh-token.model";

@Injectable()
export class AuthService {

  private static readonly REFRESH_TOKEN_EXPIRES_AT : number = 60*60*72; // 72H
  private static readonly ACCESS_TOKEN_EXPIRES_AT : number = 60*60*24; // 72H

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

  public valideAccessToken(token: string): AccessTokenModel {
    return new AccessTokenModel(this.jwtService.verify(token));
  }
  public valideRefreshToken(token: string): RefreshTokenModel {
    return new RefreshTokenModel(this.jwtService.verify(token));
  }

  public generateAccessToken(user: UserEntity): string {
    return this.jwtService.sign(new AccessTokenModel({
          pseudo : user.pseudo,
          email: user.email,
          id: user.id,
          sso: user.sso,
          roles: user.roles,
          color : Math.floor(Math.random()*16777215).toString(16)
        }).toJson(),
        {expiresIn : AuthService.ACCESS_TOKEN_EXPIRES_AT}
    );
  }

  public generateRefreshToken(user: UserEntity, ipAddress: string): string {
    return this.jwtService.sign(
        new RefreshTokenModel({
          userId : user.id,
          ipAddress: ipAddress
        }).toJson(),
        {expiresIn : AuthService.REFRESH_TOKEN_EXPIRES_AT}
    );
  }

}
