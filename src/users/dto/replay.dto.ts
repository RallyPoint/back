import {Exclude, Expose, Type} from "class-transformer";
import {UserResponseDto} from "./user.dto";
import {IsDate, IsNotEmpty, MaxLength, MinLength} from "class-validator";

@Exclude()
export class ReplayResponseDto {
  constructor(data: ReplayResponseDto) {
    Object.assign(this, data);
    this.user = new UserResponseDto(this.user);
  }
  @Expose()
  id: string;
  @Expose()
  date: Date;
  @Expose()
  desc: string;
  @Expose()
  catLevel: any;
  @Expose()
  catLanguage: any;
  @Expose()
  title: string;
  @Expose()
  thumb: string;
  @Expose()
  file: string;
  @Expose()
  @Type(()=>UserResponseDto)
  user?: UserResponseDto
}
export class ReplayPutDto {
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(10)
  title: string;
  @MaxLength(500)
  desc: string;
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  language: string;
}
