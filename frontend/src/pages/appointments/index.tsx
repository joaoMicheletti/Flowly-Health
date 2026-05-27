import { useEffect, useState } from 'react';

import moment from 'moment';

import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar';


import 'react-big-calendar/lib/css/react-big-calendar.css';


import { Button } from '@/components/ui/button';

import { Modal } from '@/components/ui/modal';

import { Input } from '@/components/ui/input';

import { api } from '@/services/api';

import { appointmentTypeLabels } from '@/utils/appointment-labels';

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

interface CalendarEvent {
  title: string;

  start: Date;

  end: Date;

  resource: Appointment;
}

const localizer =
  momentLocalizer(moment);



export function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

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

  async function handleCreateAppointment() {
    try {
      await api.post(
        '/appointments',
        {
          patientId,
          userId,

          date:
            new Date(date).toISOString(),

          type,
        },
      );

      await loadAppointments();

      setIsModalOpen(false);

      setPatientId('');

      setUserId('');

      setDate('');

      setType('CONSULTATION');
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

      await loadAppointments();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStatusAction(
    status: string,
  ) {
    if (!selectedAppointment) {
      return;
    }

    await handleUpdateStatus(
      selectedAppointment.id,
      status,
    );

    setSelectedAppointment(null);
  }

  async function moveAppointment({
    event,
    start,
  }: any) {
    try {
      await api.patch(
        `/appointments/${event.resource.id}`,
        {
          date:
            start.toISOString(),
        },
      );

      await loadAppointments();
    } catch (error) {
      console.error(error);
    }
  }

  function eventStyleGetter(
    event: CalendarEvent,
  ) {
    const status =
      event.resource.status;

    const styles = {
      SCHEDULED: {
        backgroundColor: '#facc15',
        color: '#000',
        borderRadius: '8px',
        border: 'none',
      },

      CONFIRMED: {
        backgroundColor: '#22c55e',
        color: '#fff',
        borderRadius: '8px',
        border: 'none',
      },

      CANCELLED: {
        backgroundColor: '#ef4444',
        color: '#fff',
        borderRadius: '8px',
        border: 'none',
      },

      COMPLETED: {
        backgroundColor: '#3b82f6',
        color: '#fff',
        borderRadius: '8px',
        border: 'none',
      },
    };

    return {
      style:
        styles[
          status as keyof typeof styles
        ],
    };
  }

  const calendarEvents: CalendarEvent[] =
    appointments.map(
      (appointment) => ({
        title: `${appointment.patient.name} - ${
          appointmentTypeLabels[
            appointment.type as keyof typeof appointmentTypeLabels
          ]
        }`,

        start: new Date(
          appointment.date,
        ),

        end: new Date(
          new Date(
            appointment.date,
          ).getTime() +
            60 * 60 * 1000,
        ),

        resource: appointment,
      }),
    );

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

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          popup
          onSelectEvent={(event: any) =>
            setSelectedAppointment(
              event.resource,
            )
          }
          eventPropGetter={
            eventStyleGetter
          }
          views={[
            'month',
            'week',
            'day',
            'agenda',
          ]}
          style={{
            height: 700,
          }}
          messages={{
            next: 'Próximo',
            previous: 'Anterior',
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            agenda: 'Agenda',
          }}
        />
      </div>

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

      <Modal
        isOpen={
          !!selectedAppointment
        }
        onClose={() =>
          setSelectedAppointment(null)
        }
        title="Detalhes da consulta"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div>
              <strong>
                Paciente:
              </strong>

              <p>
                {
                  selectedAppointment
                    .patient.name
                }
              </p>
            </div>

            <div>
              <strong>
                Responsável:
              </strong>

              <p>
                {
                  selectedAppointment
                    .user.name
                }
              </p>
            </div>

            <div>
              <strong>Tipo:</strong>

              <p>
                {
                  appointmentTypeLabels[
                    selectedAppointment.type as keyof typeof appointmentTypeLabels
                  ]
                }
              </p>
            </div>

            <div>
              <strong>Status:</strong>

              <p>
                {
                  selectedAppointment.status
                }
              </p>
            </div>

            <div>
              <strong>Data:</strong>

              <p>
                {new Date(
                  selectedAppointment.date,
                ).toLocaleString(
                  'pt-BR',
                )}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              {selectedAppointment.status ===
                'SCHEDULED' && (
                <>
                  <Button
                    onClick={() =>
                      handleStatusAction(
                        'CONFIRMED',
                      )
                    }
                  >
                    Confirmar
                  </Button>

                  <Button
                    onClick={() =>
                      handleStatusAction(
                        'CANCELLED',
                      )
                    }
                  >
                    Cancelar
                  </Button>
                </>
              )}

              {selectedAppointment.status ===
                'CONFIRMED' && (
                <>
                  <Button
                    onClick={() =>
                      handleStatusAction(
                        'COMPLETED',
                      )
                    }
                  >
                    Concluir
                  </Button>

                  <Button
                    onClick={() =>
                      handleStatusAction(
                        'CANCELLED',
                      )
                    }
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}