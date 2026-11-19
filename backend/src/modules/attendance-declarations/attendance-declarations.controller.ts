
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

import { CreateAttendanceDeclarationDto } from './dto/create-attendance-declaration.dto';
import { AttendanceDeclarationsService } from './attendance-declarations.service';

@Controller('attendance-declarations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR)
export class AttendanceDeclarationsController {
  constructor(
    private readonly attendanceDeclarationsService: AttendanceDeclarationsService,
  ) {}

  @Post()
  create(
    @Body() data: CreateAttendanceDeclarationDto,
    @Request() req: any,
  ) {
    return this.attendanceDeclarationsService.create(
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
    return this.attendanceDeclarationsService.findByPatient(
      patientId,
      req.user.clinicId,
    );
  }
}
