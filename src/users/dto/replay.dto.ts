import {Exclude, Expose, Type} from "class-transformer";
import {UserResponseDto} from "./user.dto";

@Exclude()
export class ReplayResponseDto {
  constructor(data: ReplayResponseDto) {
    Object.assign(this, data);
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
  file: string;
  @Expose()
  @Type(()=>UserResponseDto)
  user?: UserResponseDto
}
