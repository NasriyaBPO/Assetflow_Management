import {
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

import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // GET LOGGED-IN EMPLOYEE PROFILE
  // =========================================================

  async findMe(userId: string) {
    const employee =
      await this.prisma.employee.findUnique({
        where: {
          userId,
        },

        select: {
          id: true,
          employeeCode: true,
          firstName: true,
          lastName: true,
          email: true,
          department: true,
          designation: true,
          status: true,
          createdAt: true,
          updatedAt: true,

          _count: {
            select: {
              assignments: {
                where: {
                  status:
                    AssignmentStatus.ACTIVE,
                },
              },
            },
          },
        },
      });

    if (!employee) {
      throw new NotFoundException(
        'Employee profile is not linked to this user account',
      );
    }

    return employee;
  }

  // =========================================================
  // GET LOGGED-IN EMPLOYEE ASSETS
  // =========================================================

  async findMyAssets(userId: string) {
    const employee =
      await this.prisma.employee.findUnique({
        where: {
          userId,
        },

        select: {
          id: true,
          employeeCode: true,
          firstName: true,
          lastName: true,

          assignments: {
            where: {
              status:
                AssignmentStatus.ACTIVE,
            },

            orderBy: {
              assignedAt: 'desc',
            },

            select: {
              id: true,
              assignedAt: true,
              notes: true,
              status: true,

              asset: {
                select: {
                  id: true,
                  assetCode: true,
                  name: true,
                  serialNumber: true,
                  brand: true,
                  model: true,
                  status: true,
                  condition: true,

                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    if (!employee) {
      throw new NotFoundException(
        'Employee profile is not linked to this user account',
      );
    }

    return {
      employee: {
        id: employee.id,
        employeeCode:
          employee.employeeCode,
        firstName:
          employee.firstName,
        lastName:
          employee.lastName,
      },

      assets: employee.assignments,
    };
  }

  // =========================================================
  // GET ALL EMPLOYEES
  // =========================================================

  async findAll(q: EmployeeQueryDto) {
    const {
      page,
      limit,
      search,
      status,
      department,
      sortBy,
      sortOrder,
    } = q;

    const where: Prisma.EmployeeWhereInput =
      {
        ...(status && {
          status,
        }),

        ...(department && {
          department: {
            equals: department,
            mode: 'insensitive',
          },
        }),

        ...(search && {
          OR: [
            {
              employeeCode: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              firstName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              department: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      };

    const [total, data] =
      await this.prisma.$transaction([
        this.prisma.employee.count({
          where,
        }),

        this.prisma.employee.findMany({
          where,

          orderBy: {
            [sortBy]: sortOrder,
          },

          skip:
            (page - 1) * limit,

          take: limit,

          include: {
            _count: {
              select: {
                assignments: {
                  where: {
                    status:
                      AssignmentStatus.ACTIVE,
                  },
                },
              },
            },
          },
        }),
      ]);

    return {
      data,

      meta: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit),
      },
    };
  }

  // =========================================================
  // GET ONE EMPLOYEE
  // =========================================================

  async findOne(id: string) {
    const employee =
      await this.prisma.employee.findUnique({
        where: {
          id,
        },

        include: {
          assignments: {
            where: {
              status:
                AssignmentStatus.ACTIVE,
            },

            orderBy: {
              assignedAt: 'desc',
            },

            include: {
              asset: {
                select: {
                  id: true,
                  assetCode: true,
                  name: true,
                  status: true,
                },
              },
            },
          },
        },
      });

    if (!employee) {
      throw new NotFoundException(
        'Employee not found',
      );
    }

    return employee;
  }

  // =========================================================
  // CREATE EMPLOYEE
  // =========================================================

  async create(dto: CreateEmployeeDto) {
    try {
      return await this.prisma.employee.create({
        data: {
          ...dto,

          // Keep email format consistent
          email:
            dto.email.trim().toLowerCase(),
        },
      });
    } catch (error) {
      this.rethrowIfDuplicate(error);

      throw error;
    }
  }

  // =========================================================
  // UPDATE EMPLOYEE
  // =========================================================

  async update(
    id: string,
    dto: UpdateEmployeeDto,
  ) {
    // Get employee together with linked User
    const employee =
      await this.prisma.employee.findUnique({
        where: {
          id,
        },

        include: {
          user: {
            select: {
              id: true,
              email: true,
              status: true,
            },
          },
        },
      });

    if (!employee) {
      throw new NotFoundException(
        'Employee not found',
      );
    }

    // ---------------------------------------------------------
    // Check active assets before deactivation
    // ---------------------------------------------------------

    if (
      dto.status ===
      EmployeeStatus.INACTIVE
    ) {
      const holding =
        await this.prisma.assetAssignment.count({
          where: {
            employeeId: id,
            status:
              AssignmentStatus.ACTIVE,
          },
        });

      if (holding > 0) {
        throw new ConflictException(
          `Employee still holds ${holding} asset(s). Return them before deactivating.`,
        );
      }
    }

    // Normalize new email if supplied
    const newEmail =
      dto.email?.trim().toLowerCase();

    try {
      // -------------------------------------------------------
      // Update Employee + linked User atomically
      // -------------------------------------------------------

      return await this.prisma.$transaction(
        async (tx) => {
          // Update Employee
          const updatedEmployee =
            await tx.employee.update({
              where: {
                id,
              },

              data: {
                ...dto,

                ...(newEmail !== undefined && {
                  email: newEmail,
                }),
              },
            });

          // If this Employee has a linked User account,
          // keep the User synchronized.
          if (employee.user) {
            const userData:
              Prisma.UserUpdateInput = {};

            // Synchronize email
            if (newEmail !== undefined) {
              userData.email = newEmail;
            }

            // Synchronize active/inactive status
            if (dto.status !== undefined) {
              userData.status =
                dto.status ===
                EmployeeStatus.ACTIVE
                  ? UserStatus.ACTIVE
                  : UserStatus.INACTIVE;
            }

            // Only run update when something
            // actually needs synchronization.
            if (
              newEmail !== undefined ||
              dto.status !== undefined
            ) {
              await tx.user.update({
                where: {
                  id: employee.user.id,
                },

                data: userData,
              });
            }
          }

          return updatedEmployee;
        },
      );
    } catch (error) {
      this.rethrowIfDuplicate(error);

      throw error;
    }
  }

  // =========================================================
  // DUPLICATE ERROR HANDLING
  // =========================================================

  private rethrowIfDuplicate(
    error: unknown,
  ) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const fields =
        (
          error.meta?.target as
            | string[]
            | undefined
        )?.join(', ') ?? 'value';

      throw new ConflictException(
        `An employee or user with this ${fields} already exists`,
      );
    }
  }
}