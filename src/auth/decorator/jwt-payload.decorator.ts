import {createParamDecorator} from "@nestjs/common";
import {AccessTokenModel} from "../model/access-token.model";

export const JwtPayload = createParamDecorator((data, ctx) =>  {
    const request = ctx.switchToHttp().getRequest();
    return new AccessTokenModel(request.jwtPayload);
});
