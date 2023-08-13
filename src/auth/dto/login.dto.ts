import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
