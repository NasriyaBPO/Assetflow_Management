import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AssetCondition,
  AssetStatus,
  AssignmentStatus,
  HistoryAction,
  NotificationType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReturnAssetDto } from './dto/return-asset.dto';

@Injectable()
export class ReturnsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: ReturnAssetDto) {
    // 1. Find the assignment
    const assignment = await this.prisma.assetAssignment.findUnique({
      where: {
        id: dto.assignmentId,
      },
      include: {
        asset: true,
        employee: true,
      },
    });

    // 2. Assignment must exist
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // 3. Only ACTIVE assignments can be returned
    if (assignment.status !== AssignmentStatus.ACTIVE) {
      throw new ConflictException(
        'This assignment has already been returned',
      );
    }

    // 4. Determine the asset's next status
    const nextAssetStatus =
      dto.condition === AssetCondition.DAMAGED
        ? AssetStatus.DAMAGED
        : AssetStatus.AVAILABLE;

    // 5. Perform the return in one database transaction
    return this.prisma.$transaction(async (tx) => {
      // Update assignment
      const returnedAssignment = await tx.assetAssignment.update({
        where: {
          id: dto.assignmentId,
        },
        data: {
          returnedAt: dto.returnedAt
            ? new Date(dto.returnedAt)
            : new Date(),
          returnCondition: dto.condition,
          returnNotes: dto.notes,
          status: AssignmentStatus.RETURNED,
        },
      });

      // Update asset
      await tx.asset.update({
        where: {
          id: assignment.assetId,
        },
        data: {
          status: nextAssetStatus,
          condition: dto.condition,
        },
      });

      // Create history record
      await tx.assetHistory.create({
        data: {
          assetId: assignment.assetId,
          action: HistoryAction.RETURNED,
          previousStatus: AssetStatus.ASSIGNED,
          newStatus: nextAssetStatus,
          description:
            `Asset ${assignment.asset.assetCode} returned by ` +
            `employee ${assignment.employee.employeeCode} ` +
            `in ${dto.condition} condition`,
        },
      });

      // Create notification for the employee's login account
      if (assignment.employee.userId) {
        await tx.notification.create({
          data: {
            userId: assignment.employee.userId,
            type: NotificationType.ASSET_RETURNED,
            title: 'Asset Returned',
            message:
              `${assignment.asset.name} (${assignment.asset.assetCode}) ` +
              `has been returned successfully.`,
          },
        });
      }

      // Return fresh data after all updates
      return tx.assetAssignment.findUnique({
        where: {
          id: returnedAssignment.id,
        },
        include: {
          asset: true,
          employee: true,
        },
      });
    });
  }
}