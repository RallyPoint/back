import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  firstName: string;

  lastName: string;

  githubUserName: string;
}

export class CreateUserDto extends UserDto {
  password: string;
}
