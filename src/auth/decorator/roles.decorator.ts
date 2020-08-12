import {SetMetadata} from "@nestjs/common";
import {USER_ROLE} from "../constants";

export const Roles = (roles: USER_ROLE[]) => SetMetadata('roles', roles);
