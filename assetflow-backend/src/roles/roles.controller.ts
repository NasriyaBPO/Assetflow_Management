import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  create(
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.rolesService.create(
      createRoleDto,
    );
  }
}