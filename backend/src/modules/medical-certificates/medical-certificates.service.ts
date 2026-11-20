
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicalCertificateDto } from './dto/create-medical-certificate.dto';

@Injectable()
export class MedicalCertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateMedicalCertificateDto,
    clinicId: string,
    userId: string,
  ) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate < startDate) {
      throw new BadRequestException(
        'A data final deve ser igual ou posterior à data inicial.',
      );
    }

    const patient = await this.prisma.patient.findFirst({
      where: {
        id: data.patientId,
        clinicId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    return this.prisma.medicalCertificate.create({
      data: {
        clinicId,
        patientId: data.patientId,
        userId,
        startDate,
        endDate,
      },
      include: {
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
    });
  }

  async findByPatient(patientId: string, clinicId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        clinicId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    return this.prisma.medicalCertificate.findMany({
      where: {
        patientId,
        clinicId,
      },
      include: {
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
