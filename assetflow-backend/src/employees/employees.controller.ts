import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(
    private readonly employees: EmployeesService,
  ) {}

  // =========================================================
  // EMPLOYEE SELF-SERVICE
  // =========================================================

  // GET /employees/me
  @Get('me')
  @Roles('EMPLOYEE')
  findMe(
    @CurrentUser()
    user: {
      id: string;
      email: string;
      role: string;
    },
  ) {
    return this.employees.findMe(user.id);
  }

  // GET /employees/me/assets
  @Get('me/assets')
  @Roles('EMPLOYEE')
  findMyAssets(
    @CurrentUser()
    user: {
      id: string;
      email: string;
      role: string;
    },
  ) {
    return this.employees.findMyAssets(
      user.id,
    );
  }

  // =========================================================
  // ADMIN / ASSET MANAGER
  // =========================================================

  // GET /employees
  @Get()
  @Roles('ADMIN', 'ASSET_MANAGER')
  findAll(
    @Query() query: EmployeeQueryDto,
  ) {
    return this.employees.findAll(query);
  }

  // GET /employees/:id
  @Get(':id')
  @Roles('ADMIN', 'ASSET_MANAGER')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.employees.findOne(id);
  }

  // POST /employees
  @Post()
  @Roles('ADMIN', 'ASSET_MANAGER')
  create(
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.employees.create(dto);
  }

  // PATCH /employees/:id
  @Patch(':id')
  @Roles('ADMIN', 'ASSET_MANAGER')
  update(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Body()
    dto: UpdateEmployeeDto,
  ) {
    return this.employees.update(
      id,
      dto,
    );
  }
}