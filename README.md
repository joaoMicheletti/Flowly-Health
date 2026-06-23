# 🩺 Flowly Health

Sistema de gestão para clínicas e consultórios médicos desenvolvido com NestJS, React, TypeScript, Prisma ORM e PostgreSQL.

---

# 🚀 Objetivo

O Flowly Health foi desenvolvido para simplificar a gestão de clínicas e consultórios, oferecendo:

- Gestão de pacientes
- Agenda médica
- Controle de usuários
- Controle de permissões
- Prontuário eletrônico
- Histórico clínico completo
- Dashboard gerencial

---

# 🏗️ Tecnologias Utilizadas

## Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt
- Passport

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- Axios
- React Router DOM
- Lucide React
- Sonner

---

# 🔐 Controle de Acesso

O sistema possui autenticação baseada em JWT.

## Perfis de Usuário

| Perfil | Permissões |
|----------|----------|
| ADMIN | Controle total do sistema |
| DOCTOR | Atendimento e prontuários |
| RECEPTIONIST | Agenda e pacientes |

---

# 🔑 Autenticação

## Login

### Endpoint

http POST /auth/login 

### Parâmetros

json {   "email": "usuario@email.com",   "password": "123456" } 

### Retorno

json {   "token": "jwt_token" } 

---

## Dados do Usuário Logado

### Endpoint

http GET /auth/me 

### Headers

http Authorization: Bearer TOKEN 

### Retorno

json {   "id": "uuid",   "name": "João",   "email": "joao@email.com",   "role": "ADMIN" } 

---

## Cadastro

### Endpoint

http POST /auth/register 

### Parâmetros

json {   "name": "João",   "email": "joao@email.com",   "password": "123456" } 

### Observação

Usuários cadastrados por esta rota recebem automaticamente a função:

text RECEPTIONIST 

---

# 👥 Usuários

## Listar Usuários

http GET /users 

---

## Buscar Usuário

http GET /users/:id 

---

## Criar Usuário

http POST /users 

### Exemplo

json {   "name": "Administrador",   "email": "admin@email.com",   "password": "123456",   "role": "ADMIN" } 

---

## Atualizar Usuário

http PATCH /users/:id 

---

## Excluir Usuário

http DELETE /users/:id 

---

# 🧑‍🤝‍🧑 Pacientes

## Listar Pacientes

http GET /patients 

---

## Buscar Paciente

http GET /patients/:id 

---

## Criar Paciente

http POST /patients 

### Exemplo

json {   "name": "Maria Silva",   "email": "maria@email.com",   "phone": "11999999999" } 

---

## Atualizar Paciente

http PATCH /patients/:id 

---

## Excluir Paciente

http DELETE /patients/:id 

---

# 📅 Agenda

O sistema possui:

- Calendário mensal
- Agenda semanal
- Horários livres
- Horários ocupados
- Filtro por médico
- Controle de status

---

## Tipos de Consulta

text CONSULTATION RETURN EVALUATION 

---

## Status

text SCHEDULED COMPLETED CANCELLED 

---

## Criar Agendamento

http POST /appointments 

### Exemplo

json {   "patientId": "uuid",   "userId": "uuid",   "date": "2026-06-20T14:00:00",   "type": "CONSULTATION" } 

---

## Listar Agendamentos

http GET /appointments 

---

## Atualizar Agendamento

http PATCH /appointments/:id 

---

## Excluir Agendamento

http DELETE /appointments/:id 

---

# 📋 Prontuário Eletrônico

O prontuário foi desenvolvido para registrar informações clínicas do paciente.

---

## Criar Registro Médico

### Endpoint

http POST /medical-records 

### Exemplo

json {   "patientId": "uuid",   "userId": "uuid",   "chiefComplaint": "Dor de cabeça",   "diagnosis": "Enxaqueca",   "procedurePerformed": "Avaliação clínica",   "prescription": "Paracetamol",   "returnDate": "2026-07-01",   "notes": "Paciente relata melhora significativa." } 

---

## Histórico do Paciente

### Endpoint

http GET /medical-records/patient/:patientId 

Retorna todos os registros do paciente ordenados do mais recente para o mais antigo.

---

# 🕒 Timeline Clínica

Ao abrir o prontuário do paciente, o sistema apresenta uma timeline unificada contendo:

- Consultas realizadas
- Consultas futuras
- Retornos
- Avaliações
- Registros clínicos

Tudo organizado em ordem cronológica.

---

# 📊 Dashboard

O dashboard exibe:

- Total de pacientes
- Total de consultas
- Consultas do dia
- Próximos atendimentos
- Indicadores operacionais

---

# 🎯 MVP Atual

Funcionalidades concluídas:

✅ Autenticação JWT

✅ Controle de permissões

✅ Gestão de usuários

✅ Gestão de pacientes

✅ Agenda médica

✅ Calendário mensal

✅ Agenda semanal

✅ Controle de status

✅ Prontuário eletrônico

✅ Histórico clínico

✅ Timeline do paciente

✅ Dashboard

---

# 🚧 Próximos Passos

- Cobrança por assinatura
- Controle financeiro
- Gestão de procedimentos
- Upload de documentos
- Assinatura digital
- Notificações automáticas
- Integração com WhatsApp
- Multi-clínicas
- Área do paciente

---

# 💰 Modelo Comercial

## Plano Mensal

R$ 149,90/mês

- Sistema completo
- Suporte
- Atualizações

Treinamento vendido separadamente.

---

## Plano Anual

R$ 99,90/mês

Cobrança anual:

text R$ 1.198,80 por ano 

Inclui:

- Sistema completo
- Suporte
- Atualizações
- Curso de treinamento gratuito

---

# 👨‍💻 Desenvolvido por

VM Software

Fundador: João Mich