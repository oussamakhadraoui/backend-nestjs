import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
  Res,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { forgetDto } from './dto/forget.dto';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { changePassDto } from './dto/changePass.dto';
import { getUser } from './decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Response } from 'express';
import { RefreshJwtGuard } from './guard/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(ValidationPipe)
  @Post('signup')
  async signin(
    @Body() CreateUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const UserData = await this.authService.singin(CreateUserDto);
    const refresh_token = UserData.user.token;
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    delete UserData.user.token;
    const secretData = {
      access_token: UserData.access_token,
      user: UserData.user,
    };
    return secretData;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: loginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const UserData = await this.authService.login(loginDto);
    const refresh_token = UserData.user.token;
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      // sameSite: 'none',
    });
    delete UserData.user.token;
    const secretData = {
      access_token: UserData.access_token,
      user: UserData.user,
    };
    return secretData;
  }
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('forgetPass')
  forgetPass(@Body() forgetDto: forgetDto) {
    return this.authService.forgetPass(forgetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@getUser() user: User) {
    return { user, token: undefined };
  }

  @UsePipes(ValidationPipe)
  @Patch('resetPass/:token')
  resetPass(
    @Body() resetPasswordDto: resetPasswordDto,
    @Param('token') token: string,
  ) {
    return this.authService.resetPass(token, resetPasswordDto);
  }
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Patch('changePass')
  changePass(@Body() changePassDto: changePassDto, @getUser() user: User) {
    return this.authService.changePass(changePassDto, user);
  }
  @Get('signout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', { expires: new Date() });
  }

  @UseGuards(RefreshJwtGuard)
  @Get('ref')
  async refreshToken(@getUser() user: User) {
    return this.authService.refreshToken(user);
  }
}
