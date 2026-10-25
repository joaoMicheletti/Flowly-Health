
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecordsService } from './medical-records.service';

@Controller('medical-records')
@UseGuards(JwtAuthGuard)
export class MedicalRecordsController {
  constructor(
    private readonly medicalRecordsService: MedicalRecordsService,
  ) {}

  @Post()
  create(
    @Body() data: CreateMedicalRecordDto,
    @Request() req: any,
  ) {
    return this.medicalRecordsService.create(
      data,
      req.user.clinicId,
      req.user.userId,
    );
  }

  @Get('patient/:patientId')
  findByPatient(
    @Param('patientId') patientId: string,
    @Request() req: any,
  ) {
    return this.medicalRecordsService.findByPatient(
      patientId,
      req.user.clinicId,
    );
  }
}
