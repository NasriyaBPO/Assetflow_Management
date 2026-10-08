import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const existingRole = await this.prisma.role.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (existingRole) {
      throw new ConflictException(
        `Role ${dto.name} already exists`,
      );
    }

    return this.prisma.role.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}