import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { UserStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error(
        'JWT_SECRET environment variable is not configured',
      );
    }

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: string;
  }) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },

        include: {
          role: true,
        },
      });

    if (
      !user ||
      user.status !== UserStatus.ACTIVE
    ) {
      throw new UnauthorizedException(
        'Invalid or inactive user',
      );
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };
  }
}