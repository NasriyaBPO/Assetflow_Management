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

import { AssetsService } from './assets.service';
import { AssetQueryDto } from './dto/asset-query.dto';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ChangeAssetStatusDto } from './dto/change-asset-status.dto';

import { BulkCreateAssetsDto } from './dto/bulk-create-assets.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('assets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssetsController {
  constructor(private readonly assets: AssetsService) {}

  // GET /assets
  @Get()
  @Roles('ADMIN', 'ASSET_MANAGER')
  findAll(@Query() query: AssetQueryDto) {
    return this.assets.findAll(query);
  }

  // GET /assets/:id
  @Get(':id')
  @Roles('ADMIN', 'ASSET_MANAGER')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assets.findOne(id);
  }

  // POST /assets
  @Post()
  @Roles('ADMIN', 'ASSET_MANAGER')
  create(@Body() dto: CreateAssetDto) {
    return this.assets.create(dto);
  }

  // POST /assets/bulk
@Post('bulk')
@Roles('ADMIN', 'ASSET_MANAGER')
createBulk(@Body() dto: BulkCreateAssetsDto) {
  return this.assets.createBulk(dto);
}

  // PATCH /assets/:id
  @Patch(':id')
  @Roles('ADMIN', 'ASSET_MANAGER')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssetDto,
  ) {
    return this.assets.update(id, dto);
  }

  // PATCH /assets/:id/status
  @Patch(':id/status')
  @Roles('ADMIN', 'ASSET_MANAGER')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeAssetStatusDto,
  ) {
    return this.assets.changeStatus(id, dto);
  }

  // GET /assets/:id/history
  @Get(':id/history')
  @Roles('ADMIN', 'ASSET_MANAGER')
  getHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.assets.getHistory(id);
  }
}