import { useEffect, useState } from 'react';

import { api } from '@/services/api';

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
        await api.post('/patients', {
        name,
        email,
        phone,
        });

        setName('');
        setEmail('');
        setPhone('');

        setIsModalOpen(false);

        loadPatients();
    } catch (error) {
        console.error(error);

        alert(
        'Erro ao criar paciente',
        );
    }
  }

  async function handleDeletePatient(
    id: string,
  ) {
    try {
      await api.delete(
        `/patients/${id}`,
      );

      loadPatients();
    } catch (error) {
      console.error(error);

      alert(
        'Erro ao deletar paciente',
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

      loadPatients();
    } catch (error) {
      console.error(error);

      alert(
        'Erro ao atualizar paciente',
      );
    }
  }
  

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-slate-800">
          Pacientes
        </h1>

        <button
            onClick={() =>
                setIsModalOpen(true)
            }
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
            Novo paciente
        </button>
      </div>

      <div className="space-y-4">
        {patients.map((patient) => (
          
          <div
            key={patient.id}
            className="flex items-center justify-between rounded-2xl bg-white p-5 shadow"
          >
            <div>
              <strong className="block text-lg text-slate-800">
                {patient.name}
              </strong>

              <span className="text-sm text-slate-500">
                {patient.email}
              </span>
            </div>

            <span className="text-slate-600">
              {patient.phone}
            </span>
            <div className="flex gap-3">
            <button
              onClick={() =>
                handleOpenEdit(patient)
              }
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Editar
            </button>

            <button
              onClick={() =>
                handleDeletePatient(
                  patient.id,
                )
              }
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Excluir
            </button>
          </div>


          </div>
          
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-slate-800">
                {editingPatientId
                  ? 'Editar paciente'
                  : 'Novo paciente'
                }
            </h2>

            <div className="space-y-4">
                <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />

                <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />

                <input
                type="text"
                placeholder="Telefone"
                value={phone}
                onChange={(e) =>
                    setPhone(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />

                <div className="flex justify-end gap-3">
                <button
                    onClick={() =>
                    setIsModalOpen(false)
                    }
                    className="rounded-lg bg-slate-200 px-4 py-2"
                >
                    Cancelar
                </button>

                <button
                    onClick={() => {
                      if (editingPatientId) {
                        handleUpdatePatient();

                        return;
                      }

                      handleCreatePatient();
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                >
                    Salvar
                </button>
                </div>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}