import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AssignmentQueryDto } from './dto/assignment-query.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
  ) {}

  // ADMIN and ASSET_MANAGER can view assignments
  @Get()
  @Roles('ADMIN', 'ASSET_MANAGER')
  findAll(@Query() query: AssignmentQueryDto) {
    return this.assignmentsService.findAll(query);
  }

  // ADMIN and ASSET_MANAGER can assign assets
  @Post()
  @Roles('ADMIN', 'ASSET_MANAGER')
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }
}