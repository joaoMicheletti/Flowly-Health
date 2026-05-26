import { useEffect, useState } from 'react';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import {
  appointmentStatusLabels,
  appointmentTypeLabels,
} from '@/utils/appointment-labels';
import { StatusBadge } from '@/components/ui/status-badge';

interface Appointment {
  id: string;

  date: string;

  type: string;

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

    const [type, setType] =
      useState('CONSULTATION');

  async function loadAppointments() {
    try {
      const response =
        await api.get('/appointments');

      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    }
  }


  async function handleCreateAppointment() {
    try {
      await api.post(
        '/appointments',
        {
          patientId,

          userId,

          date: new Date(
            date,
          ).toISOString(),

          type,
        },
      );

      loadAppointments();

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadFormData() {
    try {
      const [
        patientsResponse,
        usersResponse,
      ] = await Promise.all([
        api.get('/patients'),

        api.get('/users'),
      ]);

      setPatients(
        patientsResponse.data.data,
      );

      setUsers(usersResponse.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateStatus(
    id: string,
    status: string,
  ) {
    try {
      await api.patch(
        `/appointments/${id}/status`,
        {
          status,
        },
      );

      loadAppointments();
    } catch (error) {
      console.error(error);
    }
  }

  function renderActions(
    appointment: Appointment,
  ) {
    if (
      appointment.status ===
      'SCHEDULED'
    ) {
      return (
        <>
          <button
            onClick={() =>
              handleUpdateStatus(
                appointment.id,
                'CONFIRMED',
              )
            }
            className="rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700"
          >
            Confirmar
          </button>

          <button
            onClick={() =>
              handleUpdateStatus(
                appointment.id,
                'CANCELLED',
              )
            }
            className="rounded-lg bg-red-100 px-3 py-1 text-sm text-red-700"
          >
            Cancelar
          </button>
        </>
      );
    }

    if (
      appointment.status ===
      'CONFIRMED'
    ) {
      return (
        <>
          <button
            onClick={() =>
              handleUpdateStatus(
                appointment.id,
                'COMPLETED',
              )
            }
            className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700"
          >
            Concluir
          </button>

          <button
            onClick={() =>
              handleUpdateStatus(
                appointment.id,
                'CANCELLED',
              )
            }
            className="rounded-lg bg-red-100 px-3 py-1 text-sm text-red-700"
          >
            Cancelar
          </button>
        </>
      );
    }

    return (
      <span className="text-sm text-slate-400">
        Sem ações
      </span>
    );
  }

  useEffect(() => {
    loadAppointments();

    loadFormData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-slate-800">
          Consultas
        </h1>

        <Button
          onClick={() =>
            setIsModalOpen(true)
          }
        >
          Nova consulta
        </Button>
      </div>

      <Table
        headers={[
          'Paciente',
          'Responsável',
          'Tipo',
          'Status',
          'Data',
        ]}
      >
        {appointments.map(
          (appointment) => (
            <tr
              key={appointment.id}
              className="border-t"
            >
              <td className="p-4">
                {
                  appointment.patient
                    .name
                }
              </td>

              <td className="p-4">
                {
                  appointment.user.name
                }
              </td>

              <td className="p-4">
                {
                  appointmentTypeLabels[
                    appointment.type as keyof typeof appointmentTypeLabels
                  ]
                }
              </td>

              <td className="p-4">
                <StatusBadge
                  status={appointment.status}
                />
              </td>

              <td className="p-4">
                {new Date(
                  appointment.date,
                ).toLocaleString(
                  'pt-BR',
                )}
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  {renderActions(
                    appointment,
                  )}
                </div>
              </td>
            </tr>
          ),
        )}
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        title="Nova consulta"
      >
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
              Selecione usuário
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

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 p-3"
          >
            <option value="CONSULTATION">
              Consulta
            </option>

            <option value="RETURN">
              Retorno
            </option>

            <option value="EVALUATION">
              Avaliação
            </option>
          </select>

          <Input
            type="datetime-local"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <Button
            onClick={
              handleCreateAppointment
            }
          >
            Salvar
          </Button>
        </div>
      </Modal>
    </div>
  );
}