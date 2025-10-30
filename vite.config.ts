import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add this for SPA routing
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Ensure proper handling of SPA routes
    }
  },
  // This ensures proper base path for deployment
  base: './'
})