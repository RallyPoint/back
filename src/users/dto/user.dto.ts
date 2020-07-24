import {IsNotEmpty, IsEmail, Matches, IsString, IsOptional, MaxLength, MinLength} from 'class-validator';
import {Exclude, Expose, Type} from "class-transformer";
import {SSO_TYPE, USER_ROLE} from "../../auth/constants";
import {LiveFullResponseDto, LiveResponseDto} from "./live.dto";

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
  @IsNotEmpty()
  @MaxLength(500)
  @MinLength(0)
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
  }

  @Expose()
  id: string;
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
