import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';

import { api } from '@/services/api';

interface DashboardData {
  patients: number;

  appointments: number;

  appointmentsToday: number;

  confirmedAppointments: number;

  nextAppointments: {
    id: string;

    date: string;

    patient: {
      name: string;
    };

    user: {
      name: string;
    };
  }[];
}

export function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(
      null,
    );

  async function loadDashboard() {
    try {
      const response =
        await api.get('/dashboard');

      setDashboard(
        response.data,
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!dashboard) {
    return (
      <p>Carregando...</p>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Pacientes"
          value={
            dashboard.patients
          }
        />

        <Card
          title="Consultas"
          value={
            dashboard.appointments
          }
        />

        <Card
          title="Hoje"
          value={
            dashboard.appointmentsToday
          }
        />

        <Card
          title="Confirmadas"
          value={
            dashboard.confirmedAppointments
          }
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          Próximas consultas
        </h2>

        {dashboard
          .nextAppointments
          .length === 0 ? (
          <p className="text-slate-500">
            Nenhuma consulta agendada.
          </p>
        ) : (
          <div className="space-y-3">
            {dashboard.nextAppointments.map(
              (
                appointment,
              ) => (
                <div
                  key={
                    appointment.id
                  }
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">
                      {
                        appointment
                          .patient
                          .name
                      }
                    </p>

                    <p className="text-sm text-slate-500">
                      {
                        appointment
                          .user
                          .name
                      }
                    </p>
                  </div>

                  <p>
                    {new Date(
                      appointment.date,
                    ).toLocaleString(
                      'pt-BR',
                    )}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}