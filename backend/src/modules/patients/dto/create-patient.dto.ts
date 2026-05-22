import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  birthDate?: string;
}