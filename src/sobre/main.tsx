import React from 'react';
import ReactDOM from 'react-dom/client';
import { logPageView } from "../lib/analytics";
import Sobre from './Sobre';
import '../index.css';

logPageView("sobre");   // contador de visitas do painel (Resumo Geral e Gestão de Páginas)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sobre />
  </React.StrictMode>,
);
