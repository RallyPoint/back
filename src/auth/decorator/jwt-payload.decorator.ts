import {createParamDecorator} from "@nestjs/common";
import {JwtModel} from "../model/jwt.model";

export const JwtPayload = createParamDecorator((data, ctx) =>  {
    const request = ctx.switchToHttp().getRequest();
    return new JwtModel(request.jwtPayload);
});
