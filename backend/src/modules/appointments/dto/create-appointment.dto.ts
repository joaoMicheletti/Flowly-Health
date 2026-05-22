import {
  IsDateString,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  userId: string;

  @IsDateString()
  date: string;
}