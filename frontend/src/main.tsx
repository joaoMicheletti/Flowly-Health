import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import './styles/global.css';
import { App } from './App';
import { AuthProvider } from '@/contexts/auth-context';

ReactDOM.createRoot(
  document.getElementById('root')!,
).render(
  <AuthProvider>
    <App />
    <Toaster richColors />
  </AuthProvider>
);