import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),    
  ],
  server: {
    historyApiFallback: true,  // Redirige vers index.html pour toutes les routes
  },
  build: {
    // Sortie de build dans le répertoire public_html/dist
    outDir: 'public_html/dist',
    rollupOptions: {
      input: '/index.html',  // Fichier d'entrée principal
    },
  },
})