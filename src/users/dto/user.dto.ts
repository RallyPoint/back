import {IsNotEmpty, IsEmail, Matches, IsString, IsOptional, MaxLength, MinLength} from 'class-validator';
import {Exclude, Expose, Type} from "class-transformer";
import {SSO_TYPE, USER_ROLE} from "../../auth/constants";
import {LiveFullResponseDto, LiveResponseDto} from "./live.dto";
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

export class VerifiedEmailDto {
  @IsNotEmpty()
  code : string
}

export class VerifiedEmailResponseDto {
  status: boolean
}

export class ChangePasswordDto {
  password: string;
  code: string;
}
export class UserFollowDto {
  @IsNotEmpty()
  @IsString()
  liveUserId: string;
}


export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  email?: string;
  @MaxLength(500)
  desc: string;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  pseudo?: string;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  passwordConf: string;
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
  @Expose()
  @Type(()=>LiveResponseDto)
  live?: LiveResponseDto
}
@Exclude()
export class UserFullResponseDto extends UserResponseDto{

  constructor(data: UserResponseDto) {
    super(data);
  }


  @Expose()
  email: string;

  @Expose()
  @Type(()=>LiveFullResponseDto)
  live?: LiveFullResponseDto

}
