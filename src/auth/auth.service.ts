import { UserService } from './../user/user.service';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { payload } from './interface/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { forgetDto } from './dto/forget.dto';
import * as crypto from 'crypto';
import { sendingMail } from './utils/mailer';
import { resetPassDto } from './dto/resetToken.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly PrismaService: PrismaService,
    private UserService: UserService,
    private jwtService: JwtService,
  ) {}
  async singin(CreateUserDto: CreateUserDto) {
    return await this.UserService.create(CreateUserDto);
  }

  async login(loginDto: loginDto) {
    const { email, password } = loginDto;
    const user = await this.PrismaService.users.findFirst({ where: { email } });
    if (!user) {
      throw new BadRequestException(
        'this email does not exist in our database!',
      );
    }
    const correctPassword = await bcrypt.hash(password, user.salt);
    if (correctPassword !== user.password) {
      throw new BadRequestException('this password is incorrect!');
    }
    const payload: payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async forgetPass(forgetDto: forgetDto) {
    const { email } = forgetDto;
    const user = await this.PrismaService.users.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException(
        'there is no user with this email',
        HttpStatus.NOT_FOUND,
      );
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const passResetExpire = Date.now() + 10 * 60 * 1000;
    await this.PrismaService.users.update({
      where: { email },
      data: { passResetExpire: new Date(passResetExpire), passResetToken },
    });
    try {
      await sendingMail({
        from: 'oussama@gmail.com',
        text: resetToken,
        to: 'hello@gmail.com',
      });
    } catch (error) {
      await this.PrismaService.users.update({
        where: { email },
        data: { passResetExpire: undefined, passResetToken: undefined },
      });
      throw new HttpException(
        'there is an error sending the email please try again later',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    return passResetExpire;
  }
  async resetPass(token: string) {
    console.log(token);
    const passResetToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const user = await this.PrismaService.users.findFirst({
      where: { passResetToken },
    });
    return user.email;
  }
}
