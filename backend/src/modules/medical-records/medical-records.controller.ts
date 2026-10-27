
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecordsService } from './medical-records.service';

@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR)
export class MedicalRecordsController {
  constructor(
    private readonly medicalRecordsService: MedicalRecordsService,
  ) {}

  @Post()
  create(@Body() data: CreateMedicalRecordDto, @Request() req: any) {
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
