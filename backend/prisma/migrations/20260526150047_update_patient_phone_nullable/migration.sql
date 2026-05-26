/*
  Warnings:

  - You are about to drop the column `notes` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Patient` table. All the data in the column will be lost.
  - Made the column `email` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Patient_cpf_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "birthDate",
DROP COLUMN "cpf",
DROP COLUMN "notes",
DROP COLUMN "updatedAt",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;
