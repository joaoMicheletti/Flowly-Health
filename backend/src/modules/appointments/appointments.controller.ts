
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AppointmentStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Post()
  create(
    @Body() body: CreateAppointmentDto,
    @Request() req: any,
  ) {
    return this.appointmentsService.create(
      body,
      req.user.clinicId,
    );
  }

  @Get()
  findAll(@Request() req: any) {
    return this.appointmentsService.findAll(
      req.user.clinicId,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.appointmentsService.findOne(
      id,
      req.user.clinicId,
    );
  }

  @Patch(':id/date')
  updateDate(
    @Param('id') id: string,
    @Body('date') date: string,
    @Request() req: any,
  ) {
    return this.appointmentsService.updateDate(
      id,
      new Date(date),
      req.user.clinicId,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
    @Request() req: any,
  ) {
    return this.appointmentsService.updateStatus(
      id,
      status,
      req.user.clinicId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateAppointmentDto,
    @Request() req: any,
  ) {
    return this.appointmentsService.update(
      id,
      body,
      req.user.clinicId,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.appointmentsService.remove(
      id,
      req.user.clinicId,
    );
  }
}
