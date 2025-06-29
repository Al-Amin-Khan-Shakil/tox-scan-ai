import { StrictMode } from 'react';
import { Workbox } from 'workbox-window';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  wb.register()
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });

  // Optional: Listen for install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Install prompt available:', e);
    // e.preventDefault(); // Uncomment to defer prompt
    // Store e for later use if you want to trigger the prompt manually
  });
}