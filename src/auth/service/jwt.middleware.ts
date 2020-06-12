import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtMiddleware implements NestMiddleware {

    private static readonly EXCLUDE_URL: string[] = [
    ];

    constructor(private readonly jwtService: JwtService){}

    use(req: Request, res: Response, next: NextFunction) {
        if (JwtMiddleware.EXCLUDE_URL.find((url) => url === req.baseUrl)) {
            next();
        } else {
            const authHeaders = req.headers.authorization;
            if (authHeaders) {
                const token = (authHeaders as string).split(' ')[1] || (authHeaders as string);
                if (!this.jwtService.verify(token)) {
                    throw new UnauthorizedException(`Invalid Token: ${token}`);
                }
                req['jwtPayload'] = this.jwtService.decode(token);
            }

            next();
        }
    }
}
