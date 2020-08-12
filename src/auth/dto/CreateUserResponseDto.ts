import {Exclude, Expose, Type} from "class-transformer";
import {UserResponseDto} from "../../users/dto/user.dto";


@Exclude()
export class AuthentificationResponseDto {

    constructor(data: AuthentificationResponseDto) {
        Object.assign(this, data);
    }

    @Expose()
    @Type(()=>UserResponseDto)
    user : UserResponseDto;
    @Expose()
    access_token: string;
}

