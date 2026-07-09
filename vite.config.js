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
  };
})
