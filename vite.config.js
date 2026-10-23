import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom Vite plugin to run the Vercel serverless function locally during development
const localInstagramApi = () => ({
  name: 'local-instagram-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // Handle the API path
      if (req.url.startsWith('/api/instagram')) {
        try {
          const { default: handler } = await import('./api/instagram.js');
          
          // Mimic Vercel/Express response API surface
          res.status = (statusCode) => {
            res.statusCode = statusCode;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };

          // Setup query object for the Vercel handler
          const urlObj = new URL(req.url, `http://${req.headers.host}`);
          req.query = Object.fromEntries(urlObj.searchParams.entries());

          await handler(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: { message: err.message } }));
        }
        return;
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on current mode
  const env = loadEnv(mode, process.cwd(), '');
  
  // Inject into process.env so the serverless function can access it
  process.env.IG_ACCESS_TOKEN = env.IG_ACCESS_TOKEN || env.VITE_INSTAGRAM_TOKEN;

  return {
    plugins: [react(), tailwindcss(), localInstagramApi()],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // 1. Core runtime & shared helpers FIRST so other chunks never hold shared primitives
              if (
                id.includes('/node_modules/react/') ||
                id.includes('/node_modules/react-dom/') ||
                id.includes('/node_modules/react-router/') ||
                id.includes('/node_modules/react-router-dom/') ||
                id.includes('/node_modules/scheduler/') ||
                id.includes('/node_modules/use-sync-external-store/') ||
                id.includes('/node_modules/shallowequal/') ||
                id.includes('/node_modules/tslib/') ||
                id.includes('/node_modules/@babel/') ||
                id.includes('/node_modules/regenerator-runtime/')
              ) {
                return 'vendor-core';
              }

              // 2. Heavy admin-only libraries
              if (id.includes('@react-pdf') || id.includes('pdfkit') || id.includes('fontkit') || id.includes('png-js') || id.includes('restructure') || id.includes('yoga-layout')) {
                return 'vendor-pdf';
              }
              if (id.includes('@tiptap') || id.includes('prosemirror') || id.includes('easymde') || id.includes('simplemde') || id.includes('react-simplemde-editor') || id.includes('marked')) {
                return 'vendor-editor';
              }

              // 3. Isolated heavy features
              if (id.includes('three')) {
                return 'vendor-three';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
            }
          },
        },
      },
    },
  };
})
