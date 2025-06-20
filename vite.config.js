// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Disable ESLint integration during dev
      eslint: {
        // Vite doesn't expose a severity option, so safest is to disable
        enabled: false,
      },
    }),
  ],
})
