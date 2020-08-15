import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLE } from '../constants';
import {JwtModel} from "../model/jwt.model";

@Injectable()
export class GuardService implements CanActivate {

    private static readonly SUBS_ROLES: { [index: string]: USER_ROLE[] } = {
        [USER_ROLE.SI]: [USER_ROLE.SI, USER_ROLE.ADMIN, USER_ROLE.USER],
        [USER_ROLE.ADMIN]: [USER_ROLE.ADMIN, USER_ROLE.USER],
        [USER_ROLE.USER]: [USER_ROLE.USER]
    };

    constructor(private readonly reflector: Reflector
    ) {
    }

    canActivate(context: ExecutionContext): boolean {
        const roles: USER_ROLE[] = this.reflector.get<string[]>('roles', context.getHandler()) as USER_ROLE[];
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        if(!request.jwtPayload){return false;}
        const jwtPayload: JwtModel = new JwtModel(request.jwtPayload);
        if (!jwtPayload || !jwtPayload.roles) {}
        const jwtRoles = [].concat(...jwtPayload.roles.map((role) => GuardService.SUBS_ROLES[role]));
        const hasRole = () => jwtRoles.some((role) => roles.includes(role));
        const status = jwtPayload && jwtRoles && hasRole();
        return status;
    }

}
