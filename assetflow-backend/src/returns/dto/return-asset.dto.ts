import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { AssetCondition } from '@prisma/client';

export class ReturnAssetDto {
  @IsUUID()
  assignmentId: string;

  @IsOptional()
  @IsDateString()
  returnedAt?: string;

  @IsEnum(AssetCondition)
  condition: AssetCondition;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}