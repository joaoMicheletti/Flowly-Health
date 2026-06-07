import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    data: CreateMedicalRecordDto,
  ) {
    return this.prisma.medicalRecord.create({
      data,
      include: {
        patient: true,
        user: true,
      },
    });
  }

  async findByPatient(
    patientId: string,
  ) {
    return this.prisma.medicalRecord.findMany({
      where: {
        patientId,
      },

      include: {
        patient: true,
        user: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}