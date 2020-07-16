import {Exclude, Expose, Type} from "class-transformer";
import {IsEmail, IsNotEmpty, Matches, MaxLength, MinLength} from "class-validator";

@Exclude()
export class LiveResponseDto {
  @Expose()
  id: string;
  @Expose()
  status: boolean;
  @Expose()
  catLevel: any;
  @Expose()
  catLanguage: any;
  @Expose()
  title: string;
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
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  language: string;
}
