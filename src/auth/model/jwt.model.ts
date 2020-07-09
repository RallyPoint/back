import {SSO_TYPE, USER_ROLE} from "../constants";


export class JwtModel {

    public pseudo: string;
    public email: string;
    public id: string;
    public sso: SSO_TYPE;
    public roles : USER_ROLE[];

    constructor(model: { id: string; pseudo: string; email: string; sso: SSO_TYPE, roles: USER_ROLE[] }){
        console.log(model);
        Object.assign(<any>this,{roles : [USER_ROLE.USER]},model);
    }

    public toJson(): any{
        return Object.assign({},<any>this);
    }
}
