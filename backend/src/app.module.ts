import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { AttendanceDeclarationsModule } from './modules/attendance-declarations/attendance-declarations.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    PatientsModule, 
    AppointmentsModule, 
    DashboardModule, 
    MedicalRecordsModule,
    PrescriptionsModule,
    AttendanceDeclarationsModule,
  ],
  controllers: [],
})
export class AppModule {}