import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // =========================================================
  // LOGIN
  // =========================================================

  async login(dto: LoginDto) {
    // ---------------------------------------------------------
    // 1. Find user
    // ---------------------------------------------------------

    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email
            .trim()
            .toLowerCase(),
        },

        include: {
          role: true,

          employee: {
            select: {
              id: true,
              employeeCode: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
            },
          },
        },
      });

    // ---------------------------------------------------------
    // 2. User must exist
    // ---------------------------------------------------------

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // ---------------------------------------------------------
    // 3. User must be ACTIVE
    // ---------------------------------------------------------

    if (
      user.status !== UserStatus.ACTIVE
    ) {
      throw new UnauthorizedException(
        'User account is inactive',
      );
    }

    // ---------------------------------------------------------
    // 4. Verify password
    // ---------------------------------------------------------

    const passwordMatches =
      await bcrypt.compare(
        dto.password,
        user.passwordHash,
      );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // ---------------------------------------------------------
    // 5. JWT payload
    // ---------------------------------------------------------

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    // ---------------------------------------------------------
    // 6. Generate access token
    // ---------------------------------------------------------

    const accessToken =
      await this.jwtService.signAsync(
        payload,
      );

    // ---------------------------------------------------------
    // 7. Return safe user information
    // ---------------------------------------------------------

    return {
      accessToken,
      tokenType: 'Bearer',

      user: {
        id: user.id,
        email: user.email,
        status: user.status,

        role: {
          id: user.role.id,
          name: user.role.name,
        },

        employee: user.employee,
      },
    };
  }

  // =========================================================
  // GET CURRENT USER PROFILE
  // =========================================================

  async getProfile(userId: string) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },

        include: {
          role: true,

          employee: {
            select: {
              id: true,
              employeeCode: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
            },
          },
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'User account not found',
      );
    }

    if (
      user.status !== UserStatus.ACTIVE
    ) {
      throw new UnauthorizedException(
        'User account is inactive',
      );
    }

    return {
      id: user.id,
      email: user.email,
      status: user.status,

      role: {
        id: user.role.id,
        name: user.role.name,
      },

      employee: user.employee,
    };
  }
}