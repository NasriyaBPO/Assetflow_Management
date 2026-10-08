import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AssetStatus,
  EmployeeStatus,
  HistoryAction,
  NotificationType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AssignmentQueryDto } from './dto/assignment-query.dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // CREATE ASSIGNMENT
  // =========================================================
  async create(dto: CreateAssignmentDto) {
    // 1. Check employee exists
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // 2. Check employee is ACTIVE
    if (employee.status !== EmployeeStatus.ACTIVE) {
      throw new ConflictException(
        'Asset cannot be assigned to an inactive employee',
      );
    }

    // 3. Check asset exists
    const asset = await this.prisma.asset.findUnique({
      where: { id: dto.assetId },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    // 4. Only AVAILABLE assets can be assigned
    if (asset.status !== AssetStatus.AVAILABLE) {
      throw new ConflictException(
        `Asset ${asset.assetCode} is not available for assignment`,
      );
    }

    // 5. Prevent multiple active assignments for the same asset
    const activeAssignment = await this.prisma.assetAssignment.findFirst({
      where: {
        assetId: dto.assetId,
        status: 'ACTIVE',
      },
    });

    if (activeAssignment) {
      throw new ConflictException(
        `Asset ${asset.assetCode} already has an active assignment`,
      );
    }

    // 6. Perform assignment operations in one transaction
    return this.prisma.$transaction(async (tx) => {
      // Create assignment
      const assignment = await tx.assetAssignment.create({
        data: {
          assetId: dto.assetId,
          employeeId: dto.employeeId,
          assignedAt: dto.assignedAt
            ? new Date(dto.assignedAt)
            : new Date(),
          notes: dto.notes,
          status: 'ACTIVE',
        },
      });

      // Change asset AVAILABLE -> ASSIGNED
      await tx.asset.update({
        where: {
          id: dto.assetId,
        },
        data: {
          status: AssetStatus.ASSIGNED,
        },
      });

      // Create asset history
      await tx.assetHistory.create({
        data: {
          assetId: dto.assetId,
          action: HistoryAction.ASSIGNED,
          previousStatus: AssetStatus.AVAILABLE,
          newStatus: AssetStatus.ASSIGNED,
          description: `Asset ${asset.assetCode} assigned to employee ${employee.employeeCode}`,
        },
      });

      // Create notification for the employee's login account
      if (employee.userId) {
        await tx.notification.create({
          data: {
            userId: employee.userId,
            type: NotificationType.ASSET_ASSIGNED,
            title: 'New Asset Assigned',
            message: `${asset.name} (${asset.assetCode}) has been assigned to you.`,
          },
        });
      }

      // Return fresh assignment data after asset status update
      return tx.assetAssignment.findUnique({
        where: {
          id: assignment.id,
        },
        include: {
          asset: true,
          employee: true,
        },
      });
    });
  }

  // =========================================================
  // GET ASSIGNMENTS
  // =========================================================
  async findAll(query: AssignmentQueryDto) {
    const {
      page = 1,
      limit = 20,
      status,
      employeeId,
      assetId,
    } = query;

    const skip = (page - 1) * limit;

    // Build filters dynamically
    const where = {
      ...(status && { status }),
      ...(employeeId && { employeeId }),
      ...(assetId && { assetId }),
    };

    // Get assignments and total count
    const [assignments, total] = await this.prisma.$transaction([
      this.prisma.assetAssignment.findMany({
        where,
        skip,
        take: limit,

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
              condition: true,
            },
          },

          employee: {
            select: {
              id: true,
              employeeCode: true,
              firstName: true,
              lastName: true,
              department: true,
              designation: true,
              status: true,
            },
          },
        },
      }),

      this.prisma.assetAssignment.count({
        where,
      }),
    ]);

    return {
      data: assignments,

      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}