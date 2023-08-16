import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request as RequestType } from 'express';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromBodyField('refresh'),
      ]),
      ignoreExpiration: false,
      secretOrKey: 'oussama',
    });
  }
  private static extractJWT(req: RequestType): string | null {
    console.log(req.cookies.auth_cookie.access_token);
    if (
      req.cookies &&
      'auth_cookie' in req.cookies &&
      req.cookies.auth_cookie.refresh_token.length > 0
    ) {
      return req.cookies.auth_cookie.refresh_token;
    }
    return null;
  }
  async validate(payload: any) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.sub },
    });
    return user;
  }
}
