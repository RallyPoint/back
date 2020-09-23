import {IsNotEmpty, IsEmail, Matches, IsString, IsOptional, MaxLength} from 'class-validator';
import {Exclude, Expose, Type} from "class-transformer";
import {SSO_TYPE, USER_ROLE} from "../constants";
import * as showdown from 'showdown';
import * as escapeHTML from 'escape-html';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  pseudo: string;
}

export class CreateUserDto extends UserDto {
  @IsNotEmpty()
  @Matches(/^(?=.*[A-z])(?=.*[0-9])\S{6,99}$/)
  password: string;
}


@Exclude()
export class UserResponseDto {

  constructor(data: UserResponseDto) {
    Object.assign(this, data);
    this.descHtml = !data.desc ? "" : (new showdown.Converter()).makeHtml(escapeHTML(data.desc));
    if(this.desc){this.desc = "";}
  }

  @Expose()
  id: string;
  @Expose()
  descHtml?: string;
  @Expose()
  desc: string;
  @Expose()
  pseudo: string;
  @Expose()
  avatar: string;
  @Expose()
  sso: SSO_TYPE;
  @Expose()
  roles: USER_ROLE[];
}
