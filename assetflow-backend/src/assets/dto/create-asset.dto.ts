import { AssetCondition } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  serialNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  model?: string;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsEnum(AssetCondition)
  condition?: AssetCondition;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  purchasePrice?: number;

  @IsOptional()
  @IsDateString()
  warrantyExpiryDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}