
import {
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateMedicalCertificateDto {
  @IsUUID()
  patientId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
