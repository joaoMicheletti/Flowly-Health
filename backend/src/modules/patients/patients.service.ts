
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePatientDto, clinicId: string) {
    return this.prisma.patient.create({
      data: {
        ...data,
        clinicId,
      },
    });
  }

  async findAll(page: number, limit: number, search: string, clinicId: string) {
    const skip = (page - 1) * limit;

    const where = {
      clinicId,
      name: {
        contains: search,
        mode: 'insensitive' as const,
      },
    };

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data: patients,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, clinicId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id, clinicId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async update(id: string, data: UpdatePatientDto, clinicId: string) {
    await this.findOne(id, clinicId);

    return this.prisma.patient.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);

    return this.prisma.patient.delete({
      where: { id },
    });
  }

  async getTimeline(patientId: string, clinicId: string) {
    await this.findOne(patientId, clinicId);

    const [appointments, medicalRecords] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { patientId, clinicId },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.medicalRecord.findMany({
        where: { patientId, clinicId },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);

    const timeline = [
      ...appointments.map((appointment) => ({
        type: 'APPOINTMENT',
        date: appointment.date,
        user: appointment.user,
        status: appointment.status,
        appointmentType: appointment.type,
      })),
      ...medicalRecords.map((record) => ({
        type: 'MEDICAL_RECORD',
        date: record.createdAt,
        user: record.user,
        diagnosis: record.diagnosis,
        chiefComplaint: record.chiefComplaint,
        notes: record.notes,
      })),
    ];

    return timeline.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }
}
