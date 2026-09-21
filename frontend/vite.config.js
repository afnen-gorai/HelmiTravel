import {defineConfig} from 'vite'

export default defineConfig({
  build:{
    target:'es2020',
    rollupOptions:{output:{manualChunks:{react:['react','react-dom','react-router-dom'],query:['@tanstack/react-query','axios'],icons:['lucide-react']}}}
  }
})
