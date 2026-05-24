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
    const [patients, setPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

  async function loadPatients() {
    try {
      const response =
        await api.get('/patients');

      setPatients(response.data);
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

  useEffect(() => {
    loadPatients();
  }, []);

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
    </div>
  );
}