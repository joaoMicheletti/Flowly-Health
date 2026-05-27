import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  AppointmentStatus,
} from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

import { AppointmentsService } from './appointments.service';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private appointmentsService: AppointmentsService,
  ) {}

  @Post()
  create(@Body() body: CreateAppointmentDto) {
    return this.appointmentsService.create(body);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body() body: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,

    @Body('status')
    status: AppointmentStatus,
  ) {
    return this.appointmentsService.updateStatus(
      id,
      status,
    );
  }

  @Patch(':id')
  updateDate(
    @Param('id') id: string,

    @Body('date')
    date: Date,
  ) {
    return this.appointmentsService.updateDate(
      id,
      date,
    );
  }
}