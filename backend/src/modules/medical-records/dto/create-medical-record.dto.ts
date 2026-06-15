export class CreateMedicalRecordDto {
  patientId: string;

  userId: string;

  chiefComplaint?: string;

  diagnosis?: string;

  procedurePerformed?: string;

  prescription?: string;

  notes?: string;

  returnDate?: string;
}