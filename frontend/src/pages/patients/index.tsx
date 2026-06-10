import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import {Button} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Table } from '@/components/ui/table';

interface Patient {
  id: string;

  name: string;

  email: string;

  phone: string;
}

export function PatientsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [patients, setPatients] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMedicalRecordModalOpen, setIsMedicalRecordModalOpen] =
      useState(false);

    const [selectedPatientId, setSelectedPatientId] =
      useState('');

    const [selectedPatientName, setSelectedPatientName] =
      useState('');

    const [notes, setNotes] =
      useState('');

    const [medicalRecords, setMedicalRecords] =
      useState<any[]>([]);

    const [currentPage, setCurrentPage] =
    useState(1);
    const [lastPage, setLastPage] =
    useState(1);

    const [
      debouncedSearch,
      setDebouncedSearch,
    ] = useState('');

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(search);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }, [search]);

  const itemsPerPage = 5;

  async function loadPatients() {
    try {
      console.log(`/patients?page=${currentPage}&limit=5&search=${debouncedSearch}`)
      const response =
        await api.get(
          `/patients?page=${currentPage}&limit=5&search=${debouncedSearch}`,
        );

      setPatients(
        response.data.data,
      );

      setLastPage(
        response.data.lastPage,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreatePatient() {
    try {
      setIsLoading(true);

      await api.post('/patients', {
        name,
        email,
        phone,
      });

      toast.success(
        'Paciente criado com sucesso',
      );

      loadPatients();

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);

      toast.error(
        'Erro ao criar paciente',
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeletePatient(
    id: string,
  ) {
    try {
      await api.delete(
        `/patients/${id}`,
      );
      toast.success(
        'Paciente Deletado com sucesso',
      );
      loadPatients();
    } catch (error) {
      console.error(error);

      toast.error(
        'Erro ao Deletar paciente.',
      );
    }
  }

  function handleOpenEdit(
    patient: Patient,
  ) {
    setEditingPatientId(
      patient.id,
    );

    setName(patient.name);

    setEmail(patient.email);

    setPhone(patient.phone);

    setIsModalOpen(true);
  }

  async function handleUpdatePatient() {
    try {
      await api.patch(
        `/patients/${editingPatientId}`,
        {
          name,
          email,
          phone,
        },
      );

      setEditingPatientId(null);

      setName('');
      setEmail('');
      setPhone('');

      setIsModalOpen(false);
      toast.success(
        'Paciente atualizado com sucesso',
      );

      loadPatients();
    } catch (error) {
      console.error(error);

      toast.error(
        'Erro ao atualizar.',
      );
    }
  }
  
  const filteredPatients =
  patients.filter((patient) =>
    patient.name
      .toLowerCase()
      .includes(
        search.toLowerCase(),
      ),
  );

  async function loadMedicalRecords(patientId: string,) {
    try {
      const response =
        await api.get(
          `/medical-records/patient/${patientId}`,
        );

      setMedicalRecords(
        response.data,
      );
    } catch (error) {
      console.error(error);
    }
  }

  function openMedicalRecordModal(patient: Patient,) {
    setSelectedPatientId(
      patient.id,
    );

    setSelectedPatientName(
      patient.name,
    ); 

    loadMedicalRecords(
      patient.id,
    );

    setIsMedicalRecordModalOpen(
      true,
    );
  }

  async function handleCreateMedicalRecord() {
    console.log(
      'patientId:',
      selectedPatientId,
    );

    const user = JSON.parse(
      localStorage.getItem(
        '@flowly:user',
      ) || '{}',
    );

    console.log('user:', user);

    console.log('userId:', user.id);
    try {
      const user =
        JSON.parse(
          localStorage.getItem(
            '@flowly:user',
          ) || '{}',
        );

      await api.post(
        '/medical-records',
        {
          patientId:
            selectedPatientId,

          userId:
            user.id,

          notes,
        },
      );

      setNotes('');

      await loadMedicalRecords(
        selectedPatientId,
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadPatients();
  }, [currentPage, debouncedSearch]);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Pacientes
        </h1>

        <div className="flex gap-3">
          <Input
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-64"
          />

          <Button
            onClick={() => {
              setEditingPatientId(null);

              setName('');

              setEmail('');

              setPhone('');

              setIsModalOpen(true);
            }}
          >
            Novo paciente
          </Button>
        </div>
      </div>

      <Table
        headers={[
          'Nome',
          'Email',
          'Telefone',
          'Ações',
        ]}
      >
        {filteredPatients
          .filter((patient) =>
            patient.name
              .toLowerCase()
              .includes(
                search.toLowerCase(),
              ),
          )
          .map((patient) => (
            <tr
              key={patient.id}
              className="border-t"
            >
              <td className="p-4">
                {patient.name}
              </td>

              <td className="p-4">
                {patient.email}
              </td>

              <td className="p-4">
                {patient.phone}
              </td>

              <td className="flex gap-2 p-4">
                <Button
                  onClick={() =>
                    handleOpenEdit(
                      patient
                    )
                  }
                >
                  Editar
                </Button>

                <Button
                  onClick={() =>
                    openMedicalRecordModal(
                      patient,
                    )
                  }
                >
                  Prontuário
                </Button>

                <Button
                  onClick={() =>
                    handleDeletePatient(
                      patient.id,
                    )
                  }
                  className="bg-red-500 hover:bg-red-600"
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}

          {filteredPatients.length ===
            0 && (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-slate-500"
              >
                Nenhum paciente encontrado
              </td>
            </tr>
          )}
      </Table>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              currentPage - 1,
            )
          }
        >
          Anterior
        </Button>

        <span className="text-sm text-slate-600">
          Página {currentPage} de{' '}
          {lastPage}
        </span>

        <Button
          disabled={
            currentPage === lastPage
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1,
            )
          }
        >
          Próxima
        </Button>
      </div>

      <Modal
        title={
          editingPatientId
            ? 'Editar paciente'
            : 'Novo paciente'
        }
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
      >
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <Input
            type="text"
            placeholder="Telefone"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <div className="flex justify-end gap-3">
            <Button
              onClick={() =>
                setIsModalOpen(false)
              }
              className="bg-slate-300 text-slate-800 hover:bg-slate-400"
            >
              Cancelar
            </Button>

            <Button
              disabled={isLoading}
              onClick={() => {
                if (editingPatientId) {
                  handleUpdatePatient();

                  return;
                }

                handleCreatePatient();
              }}
            >
              {isLoading
                ? 'Salvando...'
                : 'Salvar'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={
          isMedicalRecordModalOpen
        }
        onClose={() =>
          setIsMedicalRecordModalOpen(
            false,
          )
        }
        title={`Prontuário - ${selectedPatientName}`}
      >
        <div className="space-y-4">

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value,
              )
            }
            rows={5}
            className="w-full rounded-lg border border-slate-300 p-3"
            placeholder="Digite uma observação..."
          />

          <Button
            onClick={
              handleCreateMedicalRecord
            }
          >
            Salvar observação
          </Button>

          <hr />

          <div className="max-h-80 overflow-y-auto space-y-4">
            {medicalRecords.map(
              (record) => (
                <div
                  key={record.id}
                  className="rounded-lg border p-3"
                >
                  <div className="mb-2 flex justify-between text-sm text-slate-500">
                    <span>
                      {
                        record.user
                          ?.name
                      }
                    </span>

                    <span>
                      {new Date(
                        record.createdAt,
                      ).toLocaleString(
                        'pt-BR',
                      )}
                    </span>
                  </div>

                  <p>
                    {
                      record.notes
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}