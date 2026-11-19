
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: CreatePrescriptionDto,
    clinicId: string,
    userId: string,
  ) {
    // 1. Verifica se o paciente pertence à clínica
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: data.patientId,
        clinicId,
      },
      select: {
        id: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // 2. Valida o prontuário, caso tenha sido informado
    if (data.medicalRecordId) {
      const medicalRecord = await this.prisma.medicalRecord.findFirst({
        where: {
          id: data.medicalRecordId,
          clinicId,
          patientId: data.patientId,
        },
        select: {
          id: true,
        },
      });

      if (!medicalRecord) {
        throw new NotFoundException('Medical record not found');
      }
    }

    // 3. Cria a prescrição e seus medicamentos
    return this.prisma.prescription.create({
      data: {
        clinicId,
        patientId: data.patientId,
        userId,
        medicalRecordId: data.medicalRecordId ?? null,
        notes: data.notes,

        items: {
          create: data.items.map((item) => ({
            medicationName: item.medicationName,
            presentation: item.presentation,
            concentration: item.concentration,
            dose: item.dose,
            route: item.route,
            frequency: item.frequency,
            duration: item.duration,
            quantity: item.quantity,
            instructions: item.instructions,
          })),
        },
      },

      include: {
        items: true,
        patient: true,
        medicalRecord: true,

        user: {
          select: {
            id: true,
            name: true,
            crm: true,
            crmUf: true,
          },
        },
      },
    });
  }

  // 4. Lista as prescrições de um paciente
  async findByPatient(
    patientId: string,
    clinicId: string,
  ) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        clinicId,
      },
      select: {
        id: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.prescription.findMany({
      where: {
        patientId,
        clinicId,
      },

      include: {
        items: true,
        patient: true,

        user: {
          select: {
            id: true,
            name: true,
            crm: true,
            crmUf: true,
          },
        },
      },

      orderBy: {
        issuedAt: 'desc',
      },
    });
  }
}
