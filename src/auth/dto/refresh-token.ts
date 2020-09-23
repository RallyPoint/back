import { IsNotEmpty,  IsString} from "class-validator";


export class RefreshTokenPostDTO {

    @IsNotEmpty()
    @IsString()
    refreshToken: string;

}

