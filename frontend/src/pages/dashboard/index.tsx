import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';

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
  const [patientsCount, setPatientsCount] =
  useState(0);

  const [
    appointmentsCount,
    setAppointmentsCount,
  ] = useState(0);

  async function loadDashboard() {
    try {
      const patientsResponse =
        await api.get('/patients');

      const appointmentsResponse =
        await api.get(
          '/appointments',
        );

      setPatientsCount(
        patientsResponse.data.length,
      );

      setAppointmentsCount(
        appointmentsResponse.data.length,
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);





  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-slate-800">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <Card
          title="Pacientes"
          value={patientsCount}
        />

        <Card
          title="Consultas"
          value={appointmentsCount}
        />

        <Card
          title="Hoje"
          value="0"
        />
      </div>
    </div>
  );
}