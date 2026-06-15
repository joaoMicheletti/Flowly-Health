import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    const today = new Date();

    const startOfDay = new Date(
      today.setHours(0, 0, 0, 0),
    );

    const endOfDay = new Date(
      today.setHours(23, 59, 59, 999),
    );

    const patients =
      await this.prisma.patient.count();
    
    const appointments =
      await this.prisma.appointment.count();

    const appointmentsToday =
      await this.prisma.appointment.count({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

    const doctors = await this.prisma.user.count({
      where: {
        role: 'DOCTOR',
      },
    });

    const confirmedAppointments =
      await this.prisma.appointment.count({
        where: {
          status: 'CONFIRMED',
        },
      });

    const nextAppointments =
      await this.prisma.appointment.findMany({
        where: {
          date: {
            gte: new Date(),
          },
        },

        include: {
          patient: true,
          user: true,
        },

        take: 5,

        orderBy: {
          date: 'asc',
        },
      });
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 6,
    );

    const appointmentsLast7Days = await this.prisma.appointment.groupBy({
        by: ['date'],

        _count: {
          id: true,
        },

        where: {
          date: {
            gte: sevenDaysAgo,
          },
        },
    });

    return {
      patients,
      appointments,
      appointmentsToday,
      confirmedAppointments,
      doctors,
      nextAppointments,
      appointmentsLast7Days,
    };
  }
}