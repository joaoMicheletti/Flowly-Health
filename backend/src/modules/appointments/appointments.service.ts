import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        ...data,

        date: new Date(data.date),
      },

      include: {
        patient: true,
        user: true,
      },
    });
  }

  findAll() {
    return this.prisma.appointment.findMany({
      include: {
        patient: true,
        user: true,
      },

      orderBy: {
        date: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.appointment.findUnique({
      where: {
        id,
      },

      include: {
        patient: true,
        user: true,
      },
    });
  }

  update(
    id: string,

    data: UpdateAppointmentDto,
  ) {
    return this.prisma.appointment.update({
      where: {
        id,
      },

      data: {
        ...data,

        ...(data.date && {
          date: new Date(data.date),
        }),
      },

      include: {
        patient: true,
        user: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.appointment.delete({
      where: {
        id,
      },
    });
  }
}