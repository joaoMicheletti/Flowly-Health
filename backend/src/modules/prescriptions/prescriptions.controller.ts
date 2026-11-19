
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

import { CreatePrescriptionDto } from './dto/create-prescription.dto';

import { PrescriptionsService } from './prescriptions.service';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR)
export class PrescriptionsController {
  constructor(
    private readonly prescriptionsService: PrescriptionsService,
  ) {}

  @Post()
  create(
    @Body() data: CreatePrescriptionDto,
    @Request() req: any,
  ) {
    return this.prescriptionsService.create(
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
    return this.prescriptionsService.findByPatient(
      patientId,
      req.user.clinicId,
    );
  }
}
