import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '..', '')
  const frontendPort = Number(env.FRONTEND_PORT || process.env.FRONTEND_PORT || 5173)
  const backendPort = env.BACKEND_PORT || process.env.BACKEND_PORT || '8000'
  const backendTarget = env.VITE_API_BASE_URL || `http://localhost:${backendPort}`

  return {
    envDir: '..',
    plugins: [react(), tailwindcss()],
    server: {
      port: frontendPort,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
