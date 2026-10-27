
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateMedicalRecordDto {
  @IsUUID()
  patientId: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  chiefComplaint?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  diagnosis?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  procedurePerformed?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  prescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;
}
