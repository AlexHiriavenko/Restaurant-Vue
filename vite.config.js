import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  base: '/Restaurant-Vue/',
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf'],
  server: {
    host: 'localhost', // Явно указываем хост
    port: 5173, // Указываем порт явно - связано с cors и настройками доступа Laravel
    strictPort: true // Ошибка, если порт занят, вместо выбора случайного
  }
});
