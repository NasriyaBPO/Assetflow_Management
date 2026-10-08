import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUUID()
  roleId?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}