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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

import { PatientsService } from './patients.service';

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(
    private patientsService: PatientsService,
  ) {}

  @Post()
  create(@Body() body: CreatePatientDto) {
    return this.patientsService.create(body);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body() body: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}