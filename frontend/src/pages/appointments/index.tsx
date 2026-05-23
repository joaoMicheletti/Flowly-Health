import { useEffect, useState } from 'react';

import { api } from '@/services/api';

interface Appointment {
  id: string;

  date: string;

  status: string;

  patient: {
    name: string;
  };

  user: {
    name: string;
  };
}

export function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

    const [isModalOpen, setIsModalOpen] =
  useState(false);

    const [patients, setPatients] =
    useState<any[]>([]);

    const [users, setUsers] =
    useState<any[]>([]);

    const [patientId, setPatientId] =
    useState('');

    const [userId, setUserId] =
    useState('');

    const [date, setDate] =
    useState('');

    const [status, setStatus] =
    useState('SCHEDULED');

  async function loadAppointments() {
    try {
      const response =
        await api.get('/appointments');

      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadAuxiliarData() {
    try {
        const [patientsResponse, usersResponse] =
        await Promise.all([
            api.get('/patients'),
            api.get('/users'),
        ]);

        setPatients(
        patientsResponse.data,
        );

        setUsers(usersResponse.data);
    } catch (error) {
        console.error(error);
    }
    }

    async function handleCreateAppointment() {
    try {
        await api.post('/appointments', {
        patientId,
        userId,
        date,
        status,
        });

        setPatientId('');
        setUserId('');
        setDate('');
        setStatus('SCHEDULED');

        setIsModalOpen(false);

        loadAppointments();
    } catch (error) {
        console.error(error);

        alert(
        'Erro ao criar consulta',
        );
    }
    }

  useEffect(() => {
    loadAppointments();

    loadAuxiliarData();
    }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-slate-800">
          Consultas
        </h1>

        <button
            onClick={() =>
                setIsModalOpen(true)
            }
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Nova consulta
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map(
          (appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between rounded-2xl bg-white p-5 shadow"
            >
              <div>
                <strong className="block text-lg text-slate-800">
                  {
                    appointment.patient
                      .name
                  }
                </strong>

                <span className="text-sm text-slate-500">
                  {
                    appointment.user
                      .name
                  }
                </span>
              </div>

              <div className="text-right">
                <strong className="block text-slate-800">
                  {new Date(
                    appointment.date,
                  ).toLocaleString()}
                </strong>

                <span className="text-sm text-blue-600">
                  {
                    appointment.status
                  }
                </span>
              </div>
            </div>
          ),
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-slate-800">
                Nova consulta
            </h2>

            <div className="space-y-4">
                <select
                value={patientId}
                onChange={(e) =>
                    setPatientId(
                    e.target.value,
                    )
                }
                className="w-full rounded-lg border border-slate-300 p-3"
                >
                <option value="">
                    Selecione paciente
                </option>

                {patients.map((patient) => (
                    <option
                    key={patient.id}
                    value={patient.id}
                    >
                    {patient.name}
                    </option>
                ))}
                </select>

                <select
                value={userId}
                onChange={(e) =>
                    setUserId(
                    e.target.value,
                    )
                }
                className="w-full rounded-lg border border-slate-300 p-3"
                >
                <option value="">
                    Selecione profissional
                </option>

                {users.map((user) => (
                    <option
                    key={user.id}
                    value={user.id}
                    >
                    {user.name}
                    </option>
                ))}
                </select>

                <input
                type="datetime-local"
                value={date}
                onChange={(e) =>
                    setDate(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 p-3"
                />

                <select
                value={status}
                onChange={(e) =>
                    setStatus(
                    e.target.value,
                    )
                }
                className="w-full rounded-lg border border-slate-300 p-3"
                >
                <option value="SCHEDULED">
                    Agendada
                </option>

                <option value="CONFIRMED">
                    Confirmada
                </option>

                <option value="CANCELLED">
                    Cancelada
                </option>
                </select>

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
                    onClick={
                    handleCreateAppointment
                    }
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