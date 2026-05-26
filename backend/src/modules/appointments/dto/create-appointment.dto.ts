import {
  IsDateString,
  IsEnum,
  IsUUID,
} from 'class-validator';

import {
  AppointmentType,
} from '@prisma/client';

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsUUID()
  patientId: string;

  @IsUUID()
  userId: string;

  @IsEnum(AppointmentType)
  type: AppointmentType;
}