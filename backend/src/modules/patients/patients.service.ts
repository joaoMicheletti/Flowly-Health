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

  async findAll(
    page: number,
    limit: number,
    search: string,
  ) {
    const skip =
      (page - 1) * limit;

    const [patients, total] =
      await Promise.all([
        this.prisma.patient.findMany({
          skip,

          take: limit,

          where: {
            name: {
              contains: search,

              mode: 'insensitive',
            },
          },

          orderBy: {
            createdAt: 'desc',
          },
        }),

        this.prisma.patient.count({
          where: {
            name: {
              contains: search,

              mode: 'insensitive',
            },
          },
        }),
      ]);

    return {
      data: patients,

      total,

      page,

      lastPage: Math.ceil(
        total / limit,
      ),
    };
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