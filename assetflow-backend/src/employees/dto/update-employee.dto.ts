import { OmitType, PartialType } from '@nestjs/swagger';
import { EmployeeStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['employeeCode'] as const),
) {
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}