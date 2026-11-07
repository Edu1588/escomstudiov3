import React from 'react';
import ReactDOM from 'react-dom/client';
import { logPageView } from "../lib/analytics";
import { Analytics } from '@vercel/analytics/react';
import BaseProposta from './BaseProposta';
import '../index.css';

logPageView("baseproposta");   // contador de visitas do painel (Resumo Geral e Gestão de Páginas)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BaseProposta />
    <Analytics />
  </React.StrictMode>,
);
