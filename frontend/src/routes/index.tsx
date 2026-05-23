import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { AppLayout } from '@/layouts/app-layout';

import { AppointmentsPage } from '@/pages/appointments';

import { DashboardPage } from '@/pages/dashboard';

import { LoginPage } from '@/pages/login';

import { PatientsPage } from '@/pages/patients';

import { ProtectedRoute } from './protected-route';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          element={<ProtectedRoute />}
        >
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/patients"
              element={<PatientsPage />}
            />

            <Route
              path="/appointments"
              element={<AppointmentsPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}