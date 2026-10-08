import {
  IsUUID,
  IsOptional,
  IsDateString,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAssignmentDto {
  @IsUUID()
  assetId: string;

  @IsUUID()
  employeeId: string;

  @IsOptional()
  @IsDateString()
  assignedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}