import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ReturnsService } from './returns.service';
import { ReturnAssetDto } from './dto/return-asset.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('returns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReturnsController {
  constructor(
    private readonly returnsService: ReturnsService,
  ) {}

  @Post()
  @Roles('ADMIN', 'ASSET_MANAGER')
  create(@Body() returnAssetDto: ReturnAssetDto) {
    return this.returnsService.create(returnAssetDto);
  }
}