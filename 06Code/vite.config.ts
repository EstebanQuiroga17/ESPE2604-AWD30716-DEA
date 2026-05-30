import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      // Mantenemos tu alias de la carpeta @/app
      { find: '@', replacement: path.resolve(__dirname, './src/app') },
      
      // REGEX MÁGICO: Resuelve importaciones como "@radix-ui/react-slot@1.1.2" 
      // apuntando simplemente al paquete "@radix-ui/react-slot"
      { 
        find: /^((?:@[^/]+\/)?[^@]+)@[\d.]+$/, 
        replacement: '$1' 
      },
    ],
  },
})