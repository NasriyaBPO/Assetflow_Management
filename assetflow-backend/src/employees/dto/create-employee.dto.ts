import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString() @IsNotEmpty() @MaxLength(50)
  employeeCode!: string;

  @IsString() @IsNotEmpty() @MaxLength(100)
  firstName!: string;

  @IsString() @IsNotEmpty() @MaxLength(100)
  lastName!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  email!: string;

  @IsOptional() @IsString() @MaxLength(100)
  department?: string;

  @IsOptional() @IsString() @MaxLength(100)
  designation?: string;
}