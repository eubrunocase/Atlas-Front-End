
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000, // Usando porta 3000 para o frontend para evitar conflito com o backend
    proxy: {
      // Configuração de proxy para evitar problemas de CORS
      '/atlas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Erro de proxy:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`Proxy request: ${req.method} ${req.url}`);
            // Adicionando headers de CORS
            proxyReq.setHeader('Origin', 'http://localhost:3000');
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(`Proxy response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
          });
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
