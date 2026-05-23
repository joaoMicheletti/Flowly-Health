import { useEffect, useState } from 'react';

import { api } from '@/services/api';

interface DashboardData {
  patients: number;

  appointmentsToday: number;

  confirmedAppointments: number;

  nextAppointments: {
    id: string;

    date: string;

    patient: {
      name: string;
    };
  }[];
}

export function DashboardPage() {
  const [data, setData] =
    useState<DashboardData | null>(
      null,
    );

  async function loadDashboard() {
    try {
      const response =
        await api.get('/dashboard');

      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="mb-8 text-4xl font-bold text-slate-800">
        Dashboard
      </h1>

      <div className="mb-8 grid grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-sm text-slate-500">
            Pacientes
          </h2>

          <strong className="text-3xl text-slate-800">
            {data?.patients ?? 0}
          </strong>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-sm text-slate-500">
            Consultas Hoje
          </h2>

          <strong className="text-3xl text-slate-800">
            {data?.appointmentsToday ??
              0}
          </strong>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-sm text-slate-500">
            Confirmadas
          </h2>

          <strong className="text-3xl text-slate-800">
            {data?.confirmedAppointments ??
              0}
          </strong>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-sm text-slate-500">
            Próximas
          </h2>

          <strong className="text-3xl text-slate-800">
            {data?.nextAppointments
              ?.length ?? 0}
          </strong>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-bold text-slate-800">
          Próximas consultas
        </h2>

        <div className="space-y-4">
          {data?.nextAppointments.map(
            (appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >
                <div>
                  <strong className="block text-slate-800">
                    {
                      appointment
                        .patient.name
                    }
                  </strong>

                  <span className="text-sm text-slate-500">
                    {new Date(
                      appointment.date,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}