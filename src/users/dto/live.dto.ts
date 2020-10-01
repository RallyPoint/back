import {Exclude, Expose, Type} from "class-transformer";
import {IsDate, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength} from "class-validator";
import {UserDto, UserResponseDto} from './user.dto';

@Exclude()
export class LiveResponseDto {
  constructor(data: LiveResponseDto) {
    Object.assign(this, data);
    if(data.user){
      this.user = new UserResponseDto(data.user);
    }
  }
  @Expose()
  id: string;
  @Expose()
  ip: string;
  @Expose()
  thumb: string;
  @Expose()
  date: Date;
  @Expose()
  desc: string;
  @Expose()
  status: boolean;
  @Expose()
  catLevel: any;
  @Expose()
  catLanguage: any;
  @Expose()
  title: string;
  @Expose()
  @Type(()=>UserDto)
  user?: UserResponseDto
}
@Exclude()
export class LiveFullResponseDto extends LiveResponseDto {
  @Expose()
  key: string;
}

export class livePutDto {
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(10)
  title: string;
  @MaxLength(500)
  desc: string;
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;
  @IsNotEmpty()
  language: string;
}
