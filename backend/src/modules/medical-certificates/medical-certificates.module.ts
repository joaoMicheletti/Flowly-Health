
import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { MedicalCertificatesController } from './medical-certificates.controller';
import { MedicalCertificatesService } from './medical-certificates.service';

@Module({
  imports: [PrismaModule],
  controllers: [MedicalCertificatesController],
  providers: [MedicalCertificatesService],
})
export class MedicalCertificatesModule {}
