import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ArticleModule,
    PrismaModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10,
    }),
  ],
  providers: [
    PrismaService,
    {
      useClass: ThrottlerGuard,
      provide: APP_GUARD,
    },
  ],
})
export class AppModule {}
