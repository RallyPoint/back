import {Exclude, Expose, Type} from "class-transformer";

export class PageResponseDto<T> {

  constructor(items: T[], count:number, index: number){
    this.items = items;
    this.index = index;
    this.count = count;
  }

  @Expose()
  items : T[];
  @Expose()
  index : number;
  @Expose()
  count : number;
}
