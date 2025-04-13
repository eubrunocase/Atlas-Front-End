
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080, // Usando porta 8080 conforme solicitado
    proxy: {
      // Configuração de proxy para evitar problemas de CORS
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/atlas'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Erro de proxy:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`Proxy request: ${req.method} ${req.url}`);
            // Adicionando headers de CORS
            proxyReq.setHeader('Origin', 'http://localhost:8080');
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
