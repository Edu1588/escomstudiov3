import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import BaseProposta from './BaseProposta';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BaseProposta />
    <Analytics />
  </React.StrictMode>,
);
