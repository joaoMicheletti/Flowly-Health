import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, PatientsModule, AppointmentsModule, DashboardModule],
  controllers: [],
})
export class AppModule {}