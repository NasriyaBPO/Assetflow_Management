import { EmployeeStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class EmployeeQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit: number = 20;

  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @IsOptional() @IsString()
  department?: string;

  @IsOptional() @IsIn(['createdAt', 'firstName', 'lastName', 'employeeCode'])
  sortBy: 'createdAt' | 'firstName' | 'lastName' | 'employeeCode' = 'createdAt';

  @IsOptional() @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';
}