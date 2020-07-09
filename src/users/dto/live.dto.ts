import {Exclude, Expose, Type} from "class-transformer";

@Exclude()
export class LiveResponseDto {
  @Expose()
  id: string;
  @Expose()
  status: boolean;
  @Expose()
  catLevel: string;
  @Expose()
  catLanguage: string;
  @Expose()
  title: string;
}
