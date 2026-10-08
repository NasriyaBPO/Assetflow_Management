import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { CreateAssetDto } from './create-asset.dto';

export class BulkCreateAssetsDto {
  @ValidateNested()
  @Type(() => CreateAssetDto)
  asset!: CreateAssetDto;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  quantity!: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  serialNumbers?: string[];
}