import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  async function handleLogin(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      const response =
        await api.post('/auth/login', {
          email,
          password,
        });

      const { access_token } =
        response.data;

      localStorage.setItem(
        'token',
        access_token,
      );

      navigate('/dashboard');
    } catch (error) {
      console.error(error);

      alert('Erro no login');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Flowly Health
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
          />

          <button
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}