import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.AI_INTEGRATIONS_GEMINI_API_KEY': JSON.stringify(
        process.env.AI_INTEGRATIONS_GEMINI_API_KEY ?? ''
      ),
      'process.env.AI_INTEGRATIONS_GEMINI_BASE_URL': JSON.stringify(
        process.env.AI_INTEGRATIONS_GEMINI_BASE_URL ?? ''
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        // Proxy Gemini AI Integrations endpoint so the browser can reach it
        '/_ai/gemini': {
          target:
            process.env.AI_INTEGRATIONS_GEMINI_BASE_URL ||
            'http://localhost:1106/modelfarm/gemini',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/_ai\/gemini/, ''),
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
    },
  };
});
