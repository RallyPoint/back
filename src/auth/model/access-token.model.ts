import {SSO_TYPE, USER_ROLE} from "../constants";


export class AccessTokenModel {

    public pseudo: string;
    public email: string;
    public id: string;
    public sso: SSO_TYPE;
    public roles : USER_ROLE[];
    public color: string;

    constructor(model: { id: string; pseudo: string; email: string; sso: SSO_TYPE, roles: USER_ROLE[], color : string}){
        Object.assign(<any>this,{roles : [USER_ROLE.USER]},model);
    }

    public toJson(): any{
        return Object.assign({},<any>this);
    }
}
