import { IsEmail, IsOptional } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto implements CreateUserDto {
  @IsOptional()
  name: string;
  @IsEmail()
  @IsOptional()
  email: string;
  password: string;
  confirmPassword: string;
  createdAt: Date;
  salt: string;
  updatedAt: Date;
  id: number;
}
