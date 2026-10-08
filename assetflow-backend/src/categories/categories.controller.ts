import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'ASSET_MANAGER')
export class CategoriesController {
  constructor(
    private readonly categories: CategoriesService,
  ) {}

  @Get()
  findAll() {
    return this.categories.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.categories.findOne(id);
  }

  @Post()
  create(
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categories.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categories.update(id, dto);
  }
}