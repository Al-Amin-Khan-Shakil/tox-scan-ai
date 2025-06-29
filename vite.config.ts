import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      devOptions: {
        enabled: true // Enables service worker in development
      },
      includeAssets: ['m-logo.png'],
      manifest: {
        name: 'ToxScan AI',
        short_name: 'ToxScan AI',
        description: 'Analyze ingredients with AI to detect harmful substances in food, cosmetics, and household products',
        theme_color: '#14B8A6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/m-logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/m-logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/m-logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,jsx,ts,tsx,css,html,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'google-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  server: {
    proxy: {
      '/api': {
        target:'https://toxscan-ai.onrender.com',
        changeOrigin: true
      }
    }
  }
});