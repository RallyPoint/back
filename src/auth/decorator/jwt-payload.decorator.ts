import {createParamDecorator} from "@nestjs/common";
import {JwtModel} from "../model/jwt.model";

export const JwtPayload = createParamDecorator((data, req) =>  {
    return new JwtModel(req.jwtPayload);
});
