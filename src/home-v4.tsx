import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HomeV4 from './pages/HomeV4';
import './home-v4.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <HomeV4 />
    </StrictMode>
  );
}

