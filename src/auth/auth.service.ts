import { UserService } from './../user/user.service';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { payload } from './interface/payload.interface';
import { JwtService } from '@nestjs/jwt';
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
}
