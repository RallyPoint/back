import {Exclude, Expose, Type} from "class-transformer";

export class StatusReponseDto {

  constructor(status:boolean){
    this.status = status;
  }

  @Expose()
  status : boolean;
}
