import { IsEmail, IsNotEmpty } from 'class-validator';

export class forgetDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
