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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { forgetDto } from './dto/forget.dto';
import { resetPassDto } from './dto/resetToken.dto';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { changePassDto } from './dto/changePass.dto';
import { getUser } from './decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(ValidationPipe)
  @Post('signup')
  signin(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.singin(CreateUserDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: loginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(loginDto);
    const secretData = {
      access_token: token.access_token,
      refreshToken: '',
    };
    console.log(token);
    res.cookie('auth_cookie', secretData, { httpOnly: true });
    return token;
  }
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('forgetPass')
  forgetPass(@Body() forgetDto: forgetDto) {
    return this.authService.forgetPass(forgetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user);
    return req.user;
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
}
