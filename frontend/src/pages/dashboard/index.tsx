import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';

import { api } from '@/services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface DashboardData {
  patients: number;

  appointmentsToday: number;

  appointmentsLast7Days: {
    date: string;
    _count: {
      id: number;
    };
  }[];

  confirmedAppointments: number;

  doctors: number;

  nextAppointments: {
    id: string;

    date: string;

    patient: {
      name: string;
    };

    user: {
      name: string;
    };

    status: string;
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
        await api.get(
          '/dashboard',
        );

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

  const chartData =
    dashboard?.appointmentsLast7Days.map(
      (item) => ({
        day: new Date(
          item.date,
        ).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: '2-digit',
          },
        ),

        consultas:
          item._count.id,
      }),
    ) || [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-4 xl:grid-cols-4">
        <Card
          title="Pacientes"
          value={
            dashboard?.patients || 0
          }
        />

        <Card
          title="Hoje"
          value={
            dashboard?.appointmentsToday ||
            0
          }
        />

        <Card
          title="Confirmadas"
          value={
            dashboard?.confirmedAppointments ||
            0
          }
        />

        <Card
          title="Médicos"
          value={
            dashboard?.doctors || 0
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

      <div className="mt-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Consultas dos Últimos 7 Dias
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart
            data={chartData}
          >
            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="consultas"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}