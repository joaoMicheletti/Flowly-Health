import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePatientDto) {
    return this.prisma.patient.create({
      data,
    });
  }

  findAll() {
    return this.prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.patient.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, data: UpdatePatientDto) {
    return this.prisma.patient.update({
      where: {
        id,
      },

      data,
    });
  }

  remove(id: string) {
    return this.prisma.patient.delete({
      where: {
        id,
      },
    });
  }
}