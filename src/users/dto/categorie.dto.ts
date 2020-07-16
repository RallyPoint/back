import {Exclude, Expose, Type} from "class-transformer";
import {LiveResponseDto} from "./live.dto";

@Exclude()
export class CategoriesResponseDto {

  constructor(data: CategoriesResponseDto) {
    Object.assign(this, data);
  }
  @Expose()
  @Type(()=>CategoryDto)
  languages?: CategoryDto[];
  @Expose()
  @Type(()=>CategoryDto)
  levels?: CategoryDto[];
}

export class CategoryDto{
  @Expose()
  id: string;
  @Expose()
  name: string
}
