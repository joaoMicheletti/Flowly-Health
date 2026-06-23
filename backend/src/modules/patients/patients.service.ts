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
  
  async getTimeline(
    patientId: string,
  ) {
    const appointments =
      await this.prisma.appointment.findMany({
        where: {
          patientId,
        },

        include: {
          user: true,
        },
      });

    const medicalRecords =
      await this.prisma.medicalRecord.findMany({
        where: {
          patientId,
        },

        include: {
          user: true,
        },
      });

    const timeline = [
      ...appointments.map(
        (appointment) => ({
          type: 'APPOINTMENT',

          date: appointment.date,

          user: {
            id: appointment.user.id,
            name: appointment.user.name,
          },

          status: appointment.status,

          appointmentType:
            appointment.type,
        }),
      ),

      ...medicalRecords.map(
        (record) => ({
          type: 'MEDICAL_RECORD',

          date: record.createdAt,

          user: record.user.name,

          diagnosis:
            record.diagnosis,

          chiefComplaint:
            record.chiefComplaint,

          notes:
            record.notes,
        }),
      ),
    ];

    return timeline.sort(
      (a, b) =>
        new Date(
          b.date,
        ).getTime() -
        new Date(
          a.date,
        ).getTime(),
    );
  }
}