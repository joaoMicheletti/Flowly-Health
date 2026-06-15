import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

import { api } from '@/services/api';

import {
  Navigate,
} from 'react-router-dom';

import {
  isAdmin,
} from '@/utils/permissions';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function UsersPage() {

  if (!isAdmin()) {
    return (
      <Navigate
        to="/dashboard"
      />
    );
  }

  const [users, setUsers] =
    useState<User[]>([]);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingUserId, setEditingUserId] =
    useState<string | null>(null);

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [role, setRole] =
    useState('RECEPTIONIST');

  async function loadUsers() {
    try {
      const response =
        await api.get('/users');

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function resetForm() {
    setName('');
    setEmail('');
    setPassword('');
    setRole('RECEPTIONIST');

    setEditingUserId(null);
  }

  function openCreateModal() {
    resetForm();

    setIsModalOpen(true);
  }

  function handleEditUser(
    user: User,
  ) {
    setEditingUserId(user.id);

    setName(user.name);

    setEmail(user.email);

    setRole(user.role);

    setPassword('');

    setIsModalOpen(true);
  }

  async function handleCreateUser() {
    try {
      await api.post('/users', {
        name,
        email,
        password,
        role,
      });

      await loadUsers();

      setIsModalOpen(false);

      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateUser() {
    try {
      await api.patch(
        `/users/${editingUserId}`,
        {
          name,
          email,
          role,
        },
      );

      await loadUsers();

      setIsModalOpen(false);

      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteUser(
    id: string,
  ) {
    const confirmDelete =
      window.confirm(
        'Deseja realmente excluir este usuário?',
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/users/${id}`,
      );

      await loadUsers();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-slate-800">
          Usuários
        </h1>

        <Button
          onClick={
            openCreateModal
          }
        >
          Novo usuário
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">
                Nome
              </th>

              <th className="p-4 text-left">
                E-mail
              </th>

              <th className="p-4 text-left">
                Perfil
              </th>

              <th className="p-4 text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t"
              >
                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${
                        user.role === 'ADMIN'
                          ? 'bg-red-100 text-red-700'
                          : user.role === 'DOCTOR'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }
                    `}
                  >
                    {user.role === 'ADMIN'
                      ? 'Administrador'
                      : user.role === 'DOCTOR'
                      ? 'Médico'
                      : 'Recepcionista'}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleEditUser(
                          user,
                        )
                      }
                    >
                      Editar
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDeleteUser(user.id)
                      }
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(
            false,
          );

          resetForm();
        }}
        title={
          editingUserId
            ? 'Editar usuário'
            : 'Novo usuário'
        }
      >
        <div className="space-y-4">
          <Input
            placeholder="Nome"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value,
              )
            }
          />

          <Input
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value,
              )
            }
          />

          {!editingUserId && (
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value,
                )
              }
            />
          )}

          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 p-3"
          >
            <option value="ADMIN">
              Administrador
            </option>

            <option value="DOCTOR">
              Médico
            </option>

            <option value="RECEPTIONIST">
              Recepcionista
            </option>
          </select>

          <Button
            onClick={() =>
              editingUserId
                ? handleUpdateUser()
                : handleCreateUser()
            }
          >
            {editingUserId
              ? 'Atualizar'
              : 'Salvar'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}