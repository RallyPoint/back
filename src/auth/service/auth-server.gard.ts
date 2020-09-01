import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as IP from 'ip';

@Injectable()
export class AuthServerGard implements CanActivate {

    constructor(private readonly reflector: Reflector
    ) {
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        return IP.isPrivate(request.ip);
    }

}
