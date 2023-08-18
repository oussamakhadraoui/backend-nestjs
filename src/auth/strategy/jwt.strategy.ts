import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { payload } from 'src/auth/interface/payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request as RequestType } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: 'oussama',
    });
  }
  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      'auth_cookie' in req.cookies &&
      req.cookies.auth_cookie.access_token.length > 0
    ) {
      // return req.cookies.auth_cookie.access_token;
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
