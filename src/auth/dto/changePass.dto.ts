import { IsNotEmpty } from 'class-validator';

export class changePassDto {
  @IsNotEmpty()
  newPass: string;
  @IsNotEmpty()
  confirmNewPass: string;
}
