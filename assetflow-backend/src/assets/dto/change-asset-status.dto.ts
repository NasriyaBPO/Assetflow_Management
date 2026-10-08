import { AssetStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class ChangeAssetStatusDto {
  @IsEnum(AssetStatus)
  status!: AssetStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}