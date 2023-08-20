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
import { resetPasswordDto } from './dto/resetPassword.dto';
import { changePassDto } from './dto/changePass.dto';
import { User } from 'src/user/entities/user.entity';
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
    const RefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.PrismaService.users.update({
      where: { email },
      data: { token: RefreshToken },
    });
    delete user.passResetExpire;
    delete user.passResetToken;
    delete user.salt;
    delete user.password;

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30s' }),
      user,
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
  async resetPass(token: string, resetPasswordDto: resetPasswordDto) {
    const passResetToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const user = await this.PrismaService.users.findUnique({
      where: {
        passResetToken,
        AND: { passResetExpire: { gt: new Date() } },
      },
    });
    if (!user) {
      throw new HttpException(
        'No User is founded or the token is expired',
        HttpStatus.NOT_FOUND,
      );
    }
    const { confirmPass, Resetpassword } = resetPasswordDto;
    if (Resetpassword !== confirmPass) {
      return new HttpException(
        'the confirmation of the password is not match with the password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(Resetpassword, salt);
    await this.PrismaService.users.update({
      where: { id: user.id },
      data: { password, salt },
    });
    return user;
  }
  async changePass(changePassDto: changePassDto, user: User) {
    if (changePassDto.confirmNewPass !== changePassDto.newPass) {
      throw new HttpException(
        'the confirmation of the password is not match with the password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const CurrentUser = await this.PrismaService.users.findUnique({
      where: { id: user.id },
    });
    if (!CurrentUser) {
      throw new HttpException(
        'there is something wrong try to login again',
        HttpStatus.BAD_REQUEST,
      );
    }
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(changePassDto.newPass, salt);
    await this.PrismaService.users.update({
      where: { id: user.id },
      data: { password, salt },
    });
    return CurrentUser;
  }
  async refreshToken(user: User) {
    const payload: payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30s' }),
    };
  }
}
