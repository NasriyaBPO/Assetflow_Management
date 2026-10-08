import { Injectable } from '@nestjs/common';
import { AssetStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    // Run dashboard queries together
    const [
      totalAssets,
      statusCounts,
      categoryCounts,
      recentAssignments,
      recentActivity,
    ] = await this.prisma.$transaction([
      // 1. Total number of assets
      this.prisma.asset.count(),

      // 2. Count assets grouped by status
      this.prisma.asset.groupBy({
        by: ['status'],
        _count: {
          _all: true,
        },
      }),

      // 3. Count assets grouped by category
      this.prisma.assetCategory.findMany({
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              assets: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),

      // 4. Recent assignments
      this.prisma.assetAssignment.findMany({
        take: 5,
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
          employee: {
            select: {
              id: true,
              employeeCode: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),

      // 5. Recent asset activity/history
      this.prisma.assetHistory.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          asset: {
            select: {
              id: true,
              assetCode: true,
              name: true,
            },
          },
        },
      }),
    ]);

    // Start all possible statuses at 0
    const assetsByStatus: Record<AssetStatus, number> = {
      AVAILABLE: 0,
      ASSIGNED: 0,
      DAMAGED: 0,
      UNDER_REPAIR: 0,
      LOST: 0,
      RETIRED: 0,
    };

    // Fill actual database counts
    for (const item of statusCounts) {
      assetsByStatus[item.status] = item._count._all;
    }

    // Format category counts
    const assetsByCategory = categoryCounts.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      count: category._count.assets,
    }));

    return {
      totalAssets,
      assetsByStatus,
      assetsByCategory,
      recentAssignments,
      recentActivity,
    };
  }
}