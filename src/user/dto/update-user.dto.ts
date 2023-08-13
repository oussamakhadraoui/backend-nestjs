import { IsEmail, IsOptional } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  @IsOptional()
  name: string;
  @IsEmail()
  @IsOptional()
  email: string;
}
