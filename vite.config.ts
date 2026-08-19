import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],

    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          portfolioedu: path.resolve(__dirname, 'portfolioedu/index.html'),
          portfolioprojetos: path.resolve(__dirname, 'portfolio-projetos/index.html'),
          admin: path.resolve(__dirname, 'admin/index.html'),
          sobre: path.resolve(__dirname, 'sobre/index.html'),
          baseproposta: path.resolve(__dirname, 'baseproposta/index.html'),
          homev3: path.resolve(__dirname, 'home-v3/index.html'),
          home3: path.resolve(__dirname, 'home3/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
