
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

import { CreateMedicalCertificateDto } from './dto/create-medical-certificate.dto';
import { MedicalCertificatesService } from './medical-certificates.service';

@Controller('medical-certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR)
export class MedicalCertificatesController {
  constructor(
    private readonly medicalCertificatesService: MedicalCertificatesService,
  ) {}

  @Post()
  create(
    @Body() data: CreateMedicalCertificateDto,
    @Request() req: any,
  ) {
    return this.medicalCertificatesService.create(
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
    return this.medicalCertificatesService.findByPatient(
      patientId,
      req.user.clinicId,
    );
  }
}
