import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false, // Позволяет работать без HTTPS
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
      "/minio": {
        target: process.env.VITE_MINIO_URL,
        changeOrigin: true,
        secure: false, // Позволяет работать без HTTPS
        rewrite: (path) => path.replace(/^\/minio/, ""),
      },
    },
    host: '0.0.0.0', // Чтобы доступ был извне виртуалки
    port: 3000, // Порт на который будет доступно приложение
  },
});