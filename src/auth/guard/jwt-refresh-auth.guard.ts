import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefAuthGuard extends AuthGuard('jwt-refresh') {}
