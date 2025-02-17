import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/ai_meetup_app_front",
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.1.80:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
      "/minio": {
        target: "http://192.168.1.80:9000",
        changeOrigin: true,
        secure: false, // Позволяет работать без HTTPS
        rewrite: (path) => path.replace(/^\/minio/, ""),
      },
    },
    https:{
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    host: '0.0.0.0', // Чтобы доступ был извне виртуалки
    port: 3000, // Порт на который будет доступно приложение
  },
});