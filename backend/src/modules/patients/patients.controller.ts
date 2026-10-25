
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
  ) {}

  @Post()
  create(
    @Body() body: CreatePatientDto,
    @Request() req: any,
  ) {
    return this.patientsService.create(
      body,
      req.user.clinicId,
    );
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '5',
    @Query('search') search = '',
    @Request() req: any,
  ) {
    return this.patientsService.findAll(
      Number(page),
      Number(limit),
      search,
      req.user.clinicId,
    );
  }

  @Get(':id/timeline')
  getTimeline(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.patientsService.getTimeline(
      id,
      req.user.clinicId,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.patientsService.findOne(
      id,
      req.user.clinicId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdatePatientDto,
    @Request() req: any,
  ) {
    return this.patientsService.update(
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
    return this.patientsService.remove(
      id,
      req.user.clinicId,
    );
  }
}
