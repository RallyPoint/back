import {IsNotEmpty, IsEmail, Matches, IsString} from 'class-validator';
import {Exclude, Expose, Type} from "class-transformer";
import {SSO_TYPE, USER_ROLE} from "../../auth/constants";
import {LiveResponseDto} from "./live.dto";

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


@Exclude()
export class UserResponseDto {

  constructor(data: UserResponseDto) {
    Object.assign(this, data);
  }

  @Expose()
  id: string;
  @Expose()
  pseudo: string;
  @Expose()
  sso: SSO_TYPE;
  @Expose()
  roles: USER_ROLE[];
  @Expose()
  @Type(()=>LiveResponseDto)
  live?: LiveResponseDto
}
