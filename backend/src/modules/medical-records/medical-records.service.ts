
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  
  async create(
    data: CreateMedicalRecordDto,
    clinicId: string,
    userId: string,
  ) {
    return this.prisma.medicalRecord.create({
      data: {
        ...data,
        clinicId,
        userId,
        returnDate: data.returnDate
          ? new Date(data.returnDate)
          : null,
      },
      include: {
        patient: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }


  async findByPatient(patientId: string, clinicId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id: patientId, clinicId },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.medicalRecord.findMany({
      where: { patientId, clinicId },
      include: {
        patient: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
