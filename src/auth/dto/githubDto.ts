import {IsEmail, IsNotEmpty, IsOptional, Matches} from "class-validator";

export class githubDto {
    @IsNotEmpty()
    code: string;
    @IsEmail()
    @IsOptional()
    email: string;
}
