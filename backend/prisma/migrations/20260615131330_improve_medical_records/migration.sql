-- AlterTable
ALTER TABLE "MedicalRecord" ADD COLUMN     "chiefComplaint" TEXT,
ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "prescription" TEXT,
ADD COLUMN     "procedurePerformed" TEXT,
ADD COLUMN     "returnDate" TIMESTAMP(3),
ALTER COLUMN "notes" DROP NOT NULL;
