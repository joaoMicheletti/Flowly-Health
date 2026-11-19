
import {
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateAttendanceDeclarationDto {
  @IsUUID()
  patientId: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsDateString()
  attendanceStartAt: string;

  @IsDateString()
  attendanceEndAt: string;
}
