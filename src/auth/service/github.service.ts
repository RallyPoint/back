import {HttpService, Injectable} from '@nestjs/common';
import * as config from 'config';

@Injectable()
export class GithubService {
  constructor(
      private readonly httpService: HttpService
  ) {
  }

  public getUser(code: string): Promise<any>{
    return this.httpService.post(config.get('OAuth.github.endpoint')+"login/oauth/access_token",{
      client_id : config.get('OAuth.github.clientID'),
      client_secret : config.get('OAuth.github.clientSecret'),
      code
    },{
      headers : {
        Accept: "application/json"
      }
    }).toPromise().then((res)=>{
      return this.httpService.get(config.get("api.github.endpoint")+"user",{headers: {Authorization: "token "+res.data.access_token}})
          .toPromise()
          .then((res)=>res.data);
    });
  }

}
