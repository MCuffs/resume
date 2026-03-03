import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        proxy: {
            // Keep the Threads API proxy
            '/api/threads': {
                target: 'https://graph.threads.net',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/threads/, ''),
            },
            // Proxy all other API calls to the local Express backend (server/index.cjs on port 3001)
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
