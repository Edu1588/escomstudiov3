import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'mpa-router-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url?.split('?')[0];
            const routeMap: Record<string, string> = {
              '/home-v2': 'home-v2/index.html',
              '/home-v2/': 'home-v2/index.html',
              '/home2': 'home-v2/index.html',
              '/home2/': 'home-v2/index.html',
              '/home-v4': 'home-v4/index.html',
              '/home-v4/': 'home-v4/index.html',
              '/home4': 'home-v4/index.html',
              '/home4/': 'home-v4/index.html',
              '/home-v3': 'home-v3/index.html',
              '/home-v3/': 'home-v3/index.html',
              '/home3': 'home3/index.html',
              '/home3/': 'home3/index.html',
              '/portfolioedu': 'portfolioedu/index.html',
              '/portfolioedu/': 'portfolioedu/index.html',
              '/portfolio-projetos': 'portfolio-projetos/index.html',
              '/portfolio-projetos/': 'portfolio-projetos/index.html',
              '/sobre': 'sobre/index.html',
              '/sobre/': 'sobre/index.html',
              '/baseproposta': 'baseproposta/index.html',
              '/baseproposta/': 'baseproposta/index.html',
              '/home-v5': 'home-v5/index.html',
              '/home-v5/': 'home-v5/index.html',
              '/home5': 'home-v5/index.html',
              '/home5/': 'home-v5/index.html',
            };

            if (url && routeMap[url]) {
              try {
                const fs = await import('fs');
                const filePath = path.resolve(__dirname, routeMap[url]);
                if (fs.existsSync(filePath)) {
                  let html = fs.readFileSync(filePath, 'utf-8');
                  html = await server.transformIndexHtml('/' + routeMap[url], html);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'text/html; charset=utf-8');
                  res.end(html);
                  return;
                }
              } catch (e) {
                return next(e);
              }
            }
            next();
          });
        }
      }
    ],

    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          portfolioedu: path.resolve(__dirname, 'portfolioedu/index.html'),
          portfolioprojetos: path.resolve(__dirname, 'portfolio-projetos/index.html'),
          admin: path.resolve(__dirname, 'admin/index.html'),
          sobre: path.resolve(__dirname, 'sobre/index.html'),
          baseproposta: path.resolve(__dirname, 'baseproposta/index.html'),
          homev2: path.resolve(__dirname, 'home-v2/index.html'),
          homev3: path.resolve(__dirname, 'home-v3/index.html'),
          home3: path.resolve(__dirname, 'home3/index.html'),
          homev4: path.resolve(__dirname, 'home-v4/index.html'),
          homev5: path.resolve(__dirname, 'home-v5/index.html'),
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
