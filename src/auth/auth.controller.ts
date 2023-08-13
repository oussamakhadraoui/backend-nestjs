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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { forgetDto } from './dto/forget.dto';
import { resetPassDto } from './dto/resetToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(ValidationPipe)
  @Post('signup')
  signin(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.singin(CreateUserDto);
  }

  @Post('login')
  login(@Body() loginDto: loginDto) {
    return this.authService.login(loginDto);
  }
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
  resetPass(@Param('token') token: string) {
    return this.authService.resetPass(token);
  }
}
