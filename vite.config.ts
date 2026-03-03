import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        proxy: {
            // Proxy API calls to the local Express backend (server/index.cjs running on port 3001)
            '/api/parse-resume': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
            '/api/generate-resume': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
            // Keep the Threads API proxy
            '/api/threads': {
                target: 'https://graph.threads.net',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/threads/, ''),
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
