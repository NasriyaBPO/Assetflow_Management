import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  AssignmentStatus,
  EmployeeStatus,
  Prisma,
  UserStatus,
} from '@prisma/client';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE USER
  // =========================================================

  async create(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();

    // Check whether email is already used
    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      throw new ConflictException(
        'User with this email already exists',
      );
    }

    // Check whether selected role exists
    const role =
      await this.prisma.role.findUnique({
        where: {
          id: dto.roleId,
        },
      });

    if (!role) {
      throw new NotFoundException(
        'Role not found',
      );
    }

    let employeeId: string | undefined;

    // EMPLOYEE users must be linked to an Employee
    if (role.name === 'EMPLOYEE') {
      if (!dto.employeeId) {
        throw new BadRequestException(
          'Employee is required for an EMPLOYEE user',
        );
      }

      const employee =
        await this.prisma.employee.findUnique({
          where: {
            id: dto.employeeId,
          },
        });

      if (!employee) {
        throw new NotFoundException(
          'Employee not found',
        );
      }

      if (employee.userId) {
        throw new ConflictException(
          'This employee already has a user account',
        );
      }

      // Employee email and user email must match
      if (
        employee.email.toLowerCase() !== email
      ) {
        throw new BadRequestException(
          'User email must match the employee email',
        );
      }

      employeeId = employee.id;
    } else if (dto.employeeId) {
      throw new BadRequestException(
        'Employee can only be linked when creating an EMPLOYEE user',
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
      dto.password,
      12,
    );

    // Create user and link employee atomically
    const user =
      await this.prisma.$transaction(
        async (tx) => {
          const createdUser =
            await tx.user.create({
              data: {
                email,
                passwordHash,
                roleId: dto.roleId,
              },

              include: {
                role: true,
              },
            });

          if (employeeId) {
            await tx.employee.update({
              where: {
                id: employeeId,
              },

              data: {
                userId: createdUser.id,
              },
            });
          }

          return createdUser;
        },
      );

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // =========================================================
  // GET ALL USERS
  // =========================================================

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,

        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },

        employee: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =========================================================
  // UPDATE USER
  // =========================================================

  async update(
    id: string,
    dto: UpdateUserDto,
    currentUserId: string,
  ) {
    // ---------------------------------------------------------
    // Find target user
    // ---------------------------------------------------------

    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },

        include: {
          role: true,

          employee: {
            select: {
              id: true,
              email: true,
              status: true,
            },
          },
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    // ---------------------------------------------------------
    // Prevent user from deactivating their own account
    // ---------------------------------------------------------

    if (
      id === currentUserId &&
      dto.status === UserStatus.INACTIVE
    ) {
      throw new BadRequestException(
        'You cannot deactivate your own account',
      );
    }

    // ---------------------------------------------------------
    // Protect last active ADMIN from deactivation
    // ---------------------------------------------------------

    if (
      dto.status === UserStatus.INACTIVE &&
      user.status === UserStatus.ACTIVE &&
      user.role.name === 'ADMIN'
    ) {
      const activeAdminCount =
        await this.prisma.user.count({
          where: {
            status: UserStatus.ACTIVE,

            role: {
              name: 'ADMIN',
            },
          },
        });

      if (activeAdminCount <= 1) {
        throw new ConflictException(
          'The last active administrator cannot be deactivated',
        );
      }
    }

    // ---------------------------------------------------------
    // Validate role change
    // ---------------------------------------------------------

    if (
      dto.roleId &&
      dto.roleId !== user.roleId
    ) {
      const requestedRole =
        await this.prisma.role.findUnique({
          where: {
            id: dto.roleId,
          },
        });

      if (!requestedRole) {
        throw new NotFoundException(
          'Role not found',
        );
      }

      // -------------------------------------------------------
      // Prevent an ADMIN from changing their own role
      // -------------------------------------------------------

      if (
        id === currentUserId &&
        user.role.name === 'ADMIN'
      ) {
        throw new BadRequestException(
          'You cannot change your own administrator role',
        );
      }

      // -------------------------------------------------------
      // EMPLOYEE role requires an Employee relationship
      // -------------------------------------------------------

      if (
        requestedRole.name === 'EMPLOYEE' &&
        !user.employee
      ) {
        throw new BadRequestException(
          'An EMPLOYEE user must be linked to an employee record',
        );
      }

      // -------------------------------------------------------
      // Protect the last active ADMIN from demotion
      // -------------------------------------------------------

      if (
        user.role.name === 'ADMIN' &&
        user.status === UserStatus.ACTIVE &&
        requestedRole.name !== 'ADMIN'
      ) {
        const activeAdminCount =
          await this.prisma.user.count({
            where: {
              status: UserStatus.ACTIVE,

              role: {
                name: 'ADMIN',
              },
            },
          });

        if (activeAdminCount <= 1) {
          throw new ConflictException(
            'The last active administrator cannot be demoted',
          );
        }
      }
    }

    // ---------------------------------------------------------
    // Validate email
    // ---------------------------------------------------------

    const email =
      dto.email?.trim().toLowerCase();

    // If the user is linked to an Employee,
    // User email must remain synchronized with Employee email.
    if (
      email &&
      user.employee &&
      email !==
        user.employee.email.toLowerCase()
    ) {
      throw new BadRequestException(
        'User email must match the linked employee email',
      );
    }

    // ---------------------------------------------------------
    // Before deactivating an employee-linked user, check assets
    // ---------------------------------------------------------

    if (
      dto.status === UserStatus.INACTIVE &&
      user.employee
    ) {
      const activeAssignments =
        await this.prisma.assetAssignment.count({
          where: {
            employeeId: user.employee.id,
            status: AssignmentStatus.ACTIVE,
          },
        });

      if (activeAssignments > 0) {
        throw new ConflictException(
          `This employee still holds ${activeAssignments} asset(s). Return them before deactivating the user.`,
        );
      }
    }

    // ---------------------------------------------------------
    // Update user
    // ---------------------------------------------------------

    try {
      const updatedUser =
        await this.prisma.$transaction(
          async (tx) => {
            const updated =
              await tx.user.update({
                where: {
                  id,
                },

                data: {
                  ...(email !== undefined && {
                    email,
                  }),

                  ...(dto.roleId !== undefined && {
                    roleId: dto.roleId,
                  }),

                  ...(dto.status !== undefined && {
                    status: dto.status,
                  }),
                },

                include: {
                  role: true,

                  employee: {
                    select: {
                      id: true,
                      employeeCode: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              });

            // ---------------------------------------------------
            // Keep linked Employee status synchronized
            // ---------------------------------------------------

            if (
              user.employee &&
              dto.status !== undefined
            ) {
              await tx.employee.update({
                where: {
                  id: user.employee.id,
                },

                data: {
                  status:
                    dto.status ===
                    UserStatus.ACTIVE
                      ? EmployeeStatus.ACTIVE
                      : EmployeeStatus.INACTIVE,
                },
              });
            }

            return updated;
          },
        );

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        status: updatedUser.status,
        role: updatedUser.role,
        employee: updatedUser.employee,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error) {
      // Duplicate email
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A user with this email already exists',
        );
      }

      throw error;
    }
  }
}