
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AttendanceDeclarationsController } from './attendance-declarations.controller';
import { AttendanceDeclarationsService } from './attendance-declarations.service';

@Module({
  imports: [PrismaModule],
  controllers: [AttendanceDeclarationsController],
  providers: [AttendanceDeclarationsService],
})
export class AttendanceDeclarationsModule {}
