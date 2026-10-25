
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentDto, clinicId: string) {
    return this.prisma.appointment.create({
      data: {
        ...data,
        clinicId,
      },
      include: {
        patient: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  async findAll(clinicId: string) {
    return this.prisma.appointment.findMany({
      where: { clinicId },
      include: {
        patient: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string, clinicId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, clinicId },
      include: {
        patient: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(
    id: string,
    data: UpdateAppointmentDto,
    clinicId: string,
  ) {
    await this.ensureAppointmentExists(id, clinicId);

    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...data,
        ...(data.date && { date: new Date(data.date) }),
      },
      include: {
        patient: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  async remove(id: string, clinicId: string) {
    await this.ensureAppointmentExists(id, clinicId);

    return this.prisma.appointment.delete({ where: { id } });
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
    clinicId: string,
  ) {
    await this.ensureAppointmentExists(id, clinicId);

    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }

  async updateDate(id: string, date: Date, clinicId: string) {
    await this.ensureAppointmentExists(id, clinicId);

    return this.prisma.appointment.update({
      where: { id },
      data: { date },
    });
  }

  private async ensureAppointmentExists(id: string, clinicId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, clinicId },
      select: { id: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
  }
}
