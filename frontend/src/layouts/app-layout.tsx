import {
  LayoutDashboard,
  Users,
  CalendarDays,
  LogOut,
  UserCog,
} from 'lucide-react';

import {
  Link,
  Outlet,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '@/contexts/auth-context';


export function AppLayout() {
  const navigate = useNavigate();

  const { user, signOut } = useAuth();

  console.log('USER SIDEBAR:', user);
  console.log('ROLE SIDEBAR:', user?.role);

  function handleLogout() {
    signOut();

    navigate('/');
  }

  if (!user) {
    return (
      <div>
        Carregando usuário...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 bg-slate-900 p-6 text-white">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Flowly
          </h1>

          <span className="text-sm text-slate-400">
            {user?.name}
          </span>
        </div>

        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-800"
          >
            <LayoutDashboard size={20} />

            Dashboard
          </Link>

          <Link
            to="/patients"
            className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-800"
          >
            <Users size={20} />

            Pacientes
          </Link>

          <Link
            to="/appointments"
            className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-800"
          >
            <CalendarDays size={20} />

            Consultas
          </Link>

          {user && user.role === 'ADMIN' && (
            <Link
              to="/users"
              className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-800"
            >
              <Users size={20} />
              Usuários
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl p-3 transition hover:bg-slate-800"
          >
            <LogOut size={20} />

            Sair
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}