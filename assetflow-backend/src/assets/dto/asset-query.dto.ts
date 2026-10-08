import { AssetStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsIn, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class AssetQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit: number = 20;

  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsEnum(AssetStatus)
  status?: AssetStatus;

  @IsOptional() @IsUUID()
  categoryId?: string;

  @IsOptional() @IsUUID()
  employeeId?: string;

  @IsOptional() @IsIn(['createdAt', 'name', 'assetCode', 'status'])
  sortBy: 'createdAt' | 'name' | 'assetCode' | 'status' = 'createdAt';

  @IsOptional() @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';
}