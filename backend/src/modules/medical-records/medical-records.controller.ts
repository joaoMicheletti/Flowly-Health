import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecordsService } from './medical-records.service';

@UseGuards(JwtAuthGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(
    private readonly medicalRecordsService: MedicalRecordsService,
  ) {}

  @Post()
  create(
    @Body()
    data: CreateMedicalRecordDto,
  ) {
    return this.medicalRecordsService.create(
      data,
    );
  }

  @Get('patient/:patientId')
  findByPatient(
    @Param('patientId')
    patientId: string,
  ) {
    return this.medicalRecordsService.findByPatient(
      patientId,
    );
  }
}