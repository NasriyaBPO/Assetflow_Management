import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findAll() {
    return this.prisma.assetCategory.findMany({
      orderBy: {
        name: 'asc',
      },

      include: {
        _count: {
          select: {
            assets: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const category =
      await this.prisma.assetCategory.findUnique({
        where: {
          id,
        },

        include: {
          _count: {
            select: {
              assets: true,
            },
          },
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
  const name = dto.name.trim();

  const prefix = this.generatePrefix(name);

  try {
    return await this.prisma.assetCategory.create({
      data: {
        name,
        description: dto.description,
        codePrefix: prefix,
      },
    });
  } catch (e) {
    this.rethrowIfDuplicate(e, name);
    throw e;
  }
}

private generatePrefix(name: string): string {
  const words = name
    .trim()
    .toUpperCase()
    .split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 3);
  }

  return words
    .map((word) => word[0])
    .join('')
    .slice(0, 3);
}

  async update(
    id: string,
    dto: UpdateCategoryDto,
  ) {
    await this.findOne(id);

    try {
      return await this.prisma.assetCategory.update({
        where: {
          id,
        },

        data: dto,
      });
    } catch (e) {
      this.rethrowIfDuplicate(
        e,
        dto.name,
      );

      throw e;
    }
  }

  async remove(id: string) {
    const category =
      await this.prisma.assetCategory.findUnique({
        where: {
          id,
        },

        include: {
          _count: {
            select: {
              assets: true,
            },
          },
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    if (category._count.assets > 0) {
      throw new ConflictException(
        `Cannot delete "${category.name}" because it contains ${category._count.assets} asset(s). Deactivate the category instead.`,
      );
    }

    await this.prisma.assetCategory.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Category deleted successfully',
    };
  }

  private rethrowIfDuplicate(
    e: unknown,
    name?: string,
  ) {
    if (
      e instanceof
        Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      throw new ConflictException(
        `Category "${name}" already exists`,
      );
    }
  }
}