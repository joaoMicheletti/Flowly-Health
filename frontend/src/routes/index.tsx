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

import {UsersPage} from '@/pages/users';

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

            <Route
              path="/users"
              element={<UsersPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}