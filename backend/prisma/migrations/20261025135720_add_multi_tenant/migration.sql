/*
  Warnings:

  - A unique constraint covering the columns `[clinicId,id]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clinicId,id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clinicId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'EXPIRED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_userId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "clinicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MedicalRecord" ADD COLUMN     "clinicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "clinicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clinicId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "subscriptionStartedAt" TIMESTAMP(3),
    "subscriptionEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Appointment_clinicId_date_idx" ON "Appointment"("clinicId", "date");

-- CreateIndex
CREATE INDEX "Appointment_clinicId_patientId_idx" ON "Appointment"("clinicId", "patientId");

-- CreateIndex
CREATE INDEX "Appointment_clinicId_userId_date_idx" ON "Appointment"("clinicId", "userId", "date");

-- CreateIndex
CREATE INDEX "MedicalRecord_clinicId_patientId_createdAt_idx" ON "MedicalRecord"("clinicId", "patientId", "createdAt");

-- CreateIndex
CREATE INDEX "MedicalRecord_clinicId_userId_idx" ON "MedicalRecord"("clinicId", "userId");

-- CreateIndex
CREATE INDEX "Patient_clinicId_idx" ON "Patient"("clinicId");

-- CreateIndex
CREATE INDEX "Patient_clinicId_name_idx" ON "Patient"("clinicId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_clinicId_id_key" ON "Patient"("clinicId", "id");

-- CreateIndex
CREATE INDEX "User_clinicId_idx" ON "User"("clinicId");

-- CreateIndex
CREATE INDEX "User_clinicId_role_idx" ON "User"("clinicId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "User_clinicId_id_key" ON "User"("clinicId", "id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_patientId_fkey" FOREIGN KEY ("clinicId", "patientId") REFERENCES "Patient"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_userId_fkey" FOREIGN KEY ("clinicId", "userId") REFERENCES "User"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_clinicId_patientId_fkey" FOREIGN KEY ("clinicId", "patientId") REFERENCES "Patient"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_clinicId_userId_fkey" FOREIGN KEY ("clinicId", "userId") REFERENCES "User"("clinicId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
