import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto implements User {
  id: number;
  @IsNotEmpty()
  @IsString()
  email: string;
  @MinLength(8)
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*W+)(?![./n])(?=.*[A-Z])(?=.*[a-z])).*$/, {
    message:
      'password is too weak it must contain at least 1 spacial character 1 uppercase character and 1 number!',
  })
  password: string;
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  createdAt: Date;
  updatedAt: Date;
  salt: string;
}
