/*
  Warnings:

  - A unique constraint covering the columns `[clinicId,id]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clinicId,id]` on the table `MedicalRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ClinicalDocumentStatus" AS ENUM ('ISSUED', 'CANCELLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "crm" TEXT,
ADD COLUMN     "crmUf" TEXT;

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "medicalRecordId" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ClinicalDocumentStatus" NOT NULL DEFAULT 'ISSUED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionItem" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "presentation" TEXT,
    "concentration" TEXT,
    "dose" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrescriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalCertificate" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "status" "ClinicalDocumentStatus" NOT NULL DEFAULT 'ISSUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceDeclaration" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "attendanceStartAt" TIMESTAMP(3) NOT NULL,
    "attendanceEndAt" TIMESTAMP(3) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ClinicalDocumentStatus" NOT NULL DEFAULT 'ISSUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceDeclaration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prescription_clinicId_patientId_issuedAt_idx" ON "Prescription"("clinicId", "patientId", "issuedAt");

-- CreateIndex
CREATE INDEX "Prescription_clinicId_userId_idx" ON "Prescription"("clinicId", "userId");

-- CreateIndex
CREATE INDEX "Prescription_clinicId_medicalRecordId_idx" ON "Prescription"("clinicId", "medicalRecordId");

-- CreateIndex
CREATE INDEX "PrescriptionItem_prescriptionId_idx" ON "PrescriptionItem"("prescriptionId");

-- CreateIndex
CREATE INDEX "MedicalCertificate_clinicId_patientId_issuedAt_idx" ON "MedicalCertificate"("clinicId", "patientId", "issuedAt");

-- CreateIndex
CREATE INDEX "MedicalCertificate_clinicId_userId_idx" ON "MedicalCertificate"("clinicId", "userId");

-- CreateIndex
CREATE INDEX "AttendanceDeclaration_clinicId_patientId_issuedAt_idx" ON "AttendanceDeclaration"("clinicId", "patientId", "issuedAt");

-- CreateIndex
CREATE INDEX "AttendanceDeclaration_clinicId_appointmentId_idx" ON "AttendanceDeclaration"("clinicId", "appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_clinicId_id_key" ON "Appointment"("clinicId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_clinicId_id_key" ON "MedicalRecord"("clinicId", "id");

-- CreateIndex
CREATE INDEX "User_crm_crmUf_idx" ON "User"("crm", "crmUf");

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_clinicId_patientId_fkey" FOREIGN KEY ("clinicId", "patientId") REFERENCES "Patient"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_clinicId_userId_fkey" FOREIGN KEY ("clinicId", "userId") REFERENCES "User"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_clinicId_medicalRecordId_fkey" FOREIGN KEY ("clinicId", "medicalRecordId") REFERENCES "MedicalRecord"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalCertificate" ADD CONSTRAINT "MedicalCertificate_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalCertificate" ADD CONSTRAINT "MedicalCertificate_clinicId_patientId_fkey" FOREIGN KEY ("clinicId", "patientId") REFERENCES "Patient"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalCertificate" ADD CONSTRAINT "MedicalCertificate_clinicId_userId_fkey" FOREIGN KEY ("clinicId", "userId") REFERENCES "User"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDeclaration" ADD CONSTRAINT "AttendanceDeclaration_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDeclaration" ADD CONSTRAINT "AttendanceDeclaration_clinicId_patientId_fkey" FOREIGN KEY ("clinicId", "patientId") REFERENCES "Patient"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDeclaration" ADD CONSTRAINT "AttendanceDeclaration_clinicId_userId_fkey" FOREIGN KEY ("clinicId", "userId") REFERENCES "User"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDeclaration" ADD CONSTRAINT "AttendanceDeclaration_clinicId_appointmentId_fkey" FOREIGN KEY ("clinicId", "appointmentId") REFERENCES "Appointment"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
