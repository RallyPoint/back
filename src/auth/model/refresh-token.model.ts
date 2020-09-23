import {SSO_TYPE, USER_ROLE} from "../constants";


export class RefreshTokenModel {

    public userId: string;
    public ipAddress: string;

    constructor(model: { userId: string, ipAddress: string}){
        Object.assign(<any>this,model);
    }

    public toJson(): any{
        return Object.assign({},<any>this);
    }
}
