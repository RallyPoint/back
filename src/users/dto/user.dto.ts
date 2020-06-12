import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  pseudo: string;
}

export class CreateUserDto extends UserDto {
  @IsNotEmpty()
  password: string;
}
