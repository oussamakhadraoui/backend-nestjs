import { IsNotEmpty } from 'class-validator';

export class resetPasswordDto {
  @IsNotEmpty()
  Resetpassword: string;
  @IsNotEmpty()
  confirmPass: string;
}
