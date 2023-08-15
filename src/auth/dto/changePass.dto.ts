import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class changePassDto {
  @MinLength(8)
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*W+)(?![./n])(?=.*[A-Z])(?=.*[a-z])).*$/, {
    message:
      'password is too weak it must contain at least 1 spacial character 1 uppercase character and 1 number!',
  })
  newPass: string;
  @IsNotEmpty()
  confirmNewPass: string;
}
