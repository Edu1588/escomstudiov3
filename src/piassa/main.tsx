import React from 'react';
import ReactDOM from 'react-dom/client';
import { logPageView } from "../lib/analytics";
import Piassa from './Piassa';
import '../index.css';

logPageView("piassa");   // contador de visitas do painel (Resumo Geral e Gestão de Páginas)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Piassa />
  </React.StrictMode>,
);
