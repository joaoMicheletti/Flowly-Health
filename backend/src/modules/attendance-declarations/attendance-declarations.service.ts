
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttendanceDeclarationDto } from './dto/create-attendance-declaration.dto';

@Injectable()
export class AttendanceDeclarationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateAttendanceDeclarationDto,
    clinicId: string,
    userId: string,
  ) {
    const attendanceStartAt = new Date(data.attendanceStartAt);
    const attendanceEndAt = new Date(data.attendanceEndAt);

    if (attendanceEndAt <= attendanceStartAt) {
      throw new BadRequestException(
        'O horário de término deve ser posterior ao horário de início.',
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

    if (data.appointmentId) {
      const appointment = await this.prisma.appointment.findFirst({
        where: {
          id: data.appointmentId,
          clinicId,
          patientId: data.patientId,
        },
      });

      if (!appointment) {
        throw new NotFoundException(
          'Agendamento não encontrado para este paciente.',
        );
      }
    }

    return this.prisma.attendanceDeclaration.create({
      data: {
        clinicId,
        patientId: data.patientId,
        userId,
        appointmentId: data.appointmentId ?? null,
        attendanceStartAt,
        attendanceEndAt,
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
        appointment: true,
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

    return this.prisma.attendanceDeclaration.findMany({
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
        appointment: true,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }
}
