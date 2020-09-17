import {IsNotEmpty, IsEmail, Matches, IsString, IsOptional, MaxLength, MinLength, IsDate} from 'class-validator';
import {Exclude, Expose, Type} from "class-transformer";

export class CalendarCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  desc: string;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start: Date;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end: Date;
  @IsString()
  @IsNotEmpty()
  category: string;
  @IsString()
  @IsNotEmpty()
  language: string;
}
