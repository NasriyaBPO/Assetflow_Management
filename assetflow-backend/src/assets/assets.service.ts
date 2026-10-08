
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  AssetStatus,
  AssignmentStatus,
  Prisma,
} from '@prisma/client';

import { MANUAL_STATUS_TRANSITIONS } from '../common/constants/asset-status.constant';
import { PrismaService } from '../prisma/prisma.service';

import { AssetQueryDto } from './dto/asset-query.dto';
import { BulkCreateAssetsDto } from './dto/bulk-create-assets.dto';
import { ChangeAssetStatusDto } from './dto/change-asset-status.dto';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

const ASSET_INCLUDE = {
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------- GET ALL ASSETS ----------------

  async findAll(q: AssetQueryDto) {
    const {
      page,
      limit,
      search,
      status,
      categoryId,
      employeeId,
      sortBy,
      sortOrder,
    } = q;

    const where: Prisma.AssetWhereInput = {
      ...(status && { status }),
      ...(categoryId && { categoryId }),

      ...(employeeId && {
        assignments: {
          some: {
            employeeId,
            status: AssignmentStatus.ACTIVE,
          },
        },
      }),

      ...(search && {
        OR: [
          {
            assetCode: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            serialNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            brand: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            model: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.asset.count({ where }),

      this.prisma.asset.findMany({
        where,
        include: ASSET_INCLUDE,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ---------------- GET ONE ASSET ----------------

  async findOne(id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        ...ASSET_INCLUDE,
        assignments: {
          where: {
            status: AssignmentStatus.ACTIVE,
          },
          take: 1,
          include: {
            employee: {
              select: {
                id: true,
                employeeCode: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }

  // ---------------- CREATE SINGLE ASSET ----------------

  async create(dto: CreateAssetDto, userId?: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Validate category
        const category = await tx.assetCategory.findUnique({
          where: { id: dto.categoryId },
        });

        if (!category || !category.active) {
          throw new BadRequestException(
            'Category does not exist or is inactive',
          );
        }

        if (!category.codePrefix) {
          throw new BadRequestException(
            'Category code prefix is not configured',
          );
        }

        // 2. Reserve the next asset number
        const updatedCategory = await tx.assetCategory.update({
          where: { id: dto.categoryId },
          data: {
            nextAssetNumber: {
              increment: 1,
            },
          },
          select: {
            nextAssetNumber: true,
          },
        });

        // 3. Generate asset code
        const assetNumber =
          updatedCategory.nextAssetNumber - 1;

        const assetCode = `${category.codePrefix}-${String(
          assetNumber,
        ).padStart(4, '0')}`;

        // 4. Create asset
        const asset = await tx.asset.create({
          data: {
            ...dto,
            assetCode,
            purchaseDate: this.toDate(dto.purchaseDate),
            warrantyExpiryDate: this.toDate(
              dto.warrantyExpiryDate,
            ),
          },
          include: ASSET_INCLUDE,
        });

        // 5. Save history
        await tx.assetHistory.create({
          data: {
            assetId: asset.id,
            action: 'CREATED',
            newStatus: asset.status,
            performedBy: userId,
            description: `Asset ${asset.assetCode} registered`,
          },
        });

        return asset;
      });
    } catch (error) {
      this.rethrowIfDuplicate(error);
      throw error;
    }
  }

  // ---------------- CREATE BULK ASSETS ----------------

  async createBulk(
    dto: BulkCreateAssetsDto,
    userId?: string,
  ) {
    const {
      asset: details,
      quantity,
      serialNumbers,
    } = dto;

    // 1. Validate quantity
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      throw new BadRequestException(
        'Quantity must be between 1 and 100',
      );
    }

    // 2. Serial number must be provided through the array
    if (details.serialNumber) {
      throw new BadRequestException(
        'Use serialNumbers array for bulk registration',
      );
    }

    // 3. Validate serial number count
    if (
      serialNumbers !== undefined &&
      serialNumbers.length !== quantity
    ) {
      throw new BadRequestException(
        'Serial numbers count must match quantity',
      );
    }

    // 4. Normalize serial numbers
    const normalizedSerials = serialNumbers?.map(
      (serial) => serial.trim(),
    );

    if (
      normalizedSerials?.some(
        (serial) => serial.length === 0,
      )
    ) {
      throw new BadRequestException(
        'Serial numbers cannot be empty',
      );
    }

    // 5. Check duplicates within the request
    if (
      normalizedSerials &&
      new Set(normalizedSerials).size !==
        normalizedSerials.length
    ) {
      throw new BadRequestException(
        'Duplicate serial numbers are not allowed',
      );
    }

    try {
      return await this.prisma.$transaction(
        async (tx) => {
          // 6. Validate category
          const category =
            await tx.assetCategory.findUnique({
              where: {
                id: details.categoryId,
              },
            });

          if (!category || !category.active) {
            throw new BadRequestException(
              'Category does not exist or is inactive',
            );
          }

          if (!category.codePrefix) {
            throw new BadRequestException(
              'Category code prefix is not configured',
            );
          }

          const codePrefix = category.codePrefix;

          // 7. Atomically reserve asset numbers
          const updatedCategory =
            await tx.assetCategory.update({
              where: {
                id: details.categoryId,
              },
              data: {
                nextAssetNumber: {
                  increment: quantity,
                },
              },
              select: {
                nextAssetNumber: true,
              },
            });

          const startingNumber =
            updatedCategory.nextAssetNumber - quantity;

          // 8. Create assets
          const createdAssets = [];

          for (let index = 0; index < quantity; index++) {
            const assetNumber =
              startingNumber + index;

            const assetCode = `${codePrefix}-${String(
              assetNumber,
            ).padStart(4, '0')}`;

            const asset = await tx.asset.create({
              data: {
                name: details.name,
                assetCode,
                categoryId: details.categoryId,
                serialNumber:
                  normalizedSerials?.[index] ?? null,
                brand: details.brand,
                model: details.model,
                condition: details.condition,
                purchaseDate: this.toDate(
                  details.purchaseDate,
                ),
                purchasePrice: details.purchasePrice,
                warrantyExpiryDate: this.toDate(
                  details.warrantyExpiryDate,
                ),
                notes: details.notes,
              },
              include: ASSET_INCLUDE,
            });

            createdAssets.push(asset);
          }

          // 9. Create history for every asset
          await tx.assetHistory.createMany({
            data: createdAssets.map((asset) => ({
              assetId: asset.id,
              action: 'CREATED' as const,
              newStatus: asset.status,
              performedBy: userId,
              description:
                `Asset ${asset.assetCode} registered through bulk creation`,
            })),
          });

          // 10. Return result
          return {
            message:
              `${createdAssets.length} assets registered successfully`,
            count: createdAssets.length,
            assets: createdAssets,
          };
        },
        {
          maxWait: 10000,
          timeout: 30000,
        },
      );
    } catch (error) {
      this.rethrowIfDuplicate(error);
      throw error;
    }
  }

  // ---------------- UPDATE ASSET ----------------

  async update(
    id: string,
    dto: UpdateAssetDto,
    userId?: string,
  ) {
    await this.findOne(id);

    if (dto.categoryId) {
      await this.assertCategoryUsable(dto.categoryId);
    }

    const {
      purchaseDate,
      warrantyExpiryDate,
      ...rest
    } = dto;

    try {
      return await this.prisma.$transaction(async (tx) => {
        const asset = await tx.asset.update({
          where: { id },
          data: {
            ...rest,

            ...(purchaseDate && {
              purchaseDate: this.toDate(purchaseDate),
            }),

            ...(warrantyExpiryDate && {
              warrantyExpiryDate: this.toDate(
                warrantyExpiryDate,
              ),
            }),
          },
          include: ASSET_INCLUDE,
        });

        await tx.assetHistory.create({
          data: {
            assetId: id,
            action: 'UPDATED',
            performedBy: userId,
            description:
              `Updated fields: ${Object.keys(dto).join(', ') || 'none'}`,
          },
        });

        return asset;
      });
    } catch (error) {
      this.rethrowIfDuplicate(error);
      throw error;
    }
  }

  // ---------------- CHANGE ASSET STATUS ----------------

  async changeStatus(
    id: string,
    dto: ChangeAssetStatusDto,
    userId?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const asset = await tx.asset.findUnique({
        where: { id },
      });

      if (!asset) {
        throw new NotFoundException('Asset not found');
      }

      if (
        !MANUAL_STATUS_TRANSITIONS[asset.status].includes(
          dto.status,
        )
      ) {
        throw new ConflictException(
          `Cannot change status from ${asset.status} to ${dto.status}`,
        );
      }

      // Prevent concurrent status update conflicts
      const result = await tx.asset.updateMany({
        where: {
          id,
          status: asset.status,
        },
        data: {
          status: dto.status,
        },
      });

      if (result.count === 0) {
        throw new ConflictException(
          'Asset status changed by another request, please retry',
        );
      }

      // Close active assignment when applicable
      if (asset.status === AssetStatus.ASSIGNED) {
        await tx.assetAssignment.updateMany({
          where: {
            assetId: id,
            status: AssignmentStatus.ACTIVE,
          },
          data: {
            status: AssignmentStatus.RETURNED,
            returnedAt: new Date(),
            returnNotes:
              `Closed automatically: asset marked ${dto.status}`,
          },
        });
      }

      // Record status history
      await tx.assetHistory.create({
        data: {
          assetId: id,
          action: 'STATUS_CHANGED',
          previousStatus: asset.status,
          newStatus: dto.status,
          performedBy: userId,
          description:
            dto.reason ??
            `Status changed from ${asset.status} to ${dto.status}`,
        },
      });

      return tx.asset.findUnique({
        where: { id },
        include: ASSET_INCLUDE,
      });
    });
  }

  // ---------------- GET ASSET HISTORY ----------------

  async getHistory(id: string) {
    await this.findOne(id);

    return this.prisma.assetHistory.findMany({
      where: {
        assetId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // ---------------- HELPERS ----------------

  private toDate(value?: string) {
    return value ? new Date(value) : undefined;
  }

  private async assertCategoryUsable(
    categoryId: string,
  ) {
    const category =
      await this.prisma.assetCategory.findUnique({
        where: {
          id: categoryId,
        },
      });

    if (!category || !category.active) {
      throw new BadRequestException(
        'Category does not exist or is inactive',
      );
    }
  }

  private rethrowIfDuplicate(error: unknown) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = error.meta?.target;

      const fields = Array.isArray(target)
        ? target.join(', ')
        : typeof target === 'string'
          ? target
          : 'value';

      throw new ConflictException(
        `An asset with this ${fields} already exists`,
      );
    }
  }
}
