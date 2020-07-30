import {Exclude, Expose, Type} from "class-transformer";
import {IsDate, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength} from "class-validator";
import {UserDto} from "./user.dto";

@Exclude()
export class LiveResponseDto {
  constructor(data: LiveResponseDto) {
    Object.assign(this, data);
  }
  @Expose()
  id: string;
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
  user?: UserDto
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
