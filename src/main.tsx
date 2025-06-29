// main.js
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
  let deferredPrompt;

  wb.register()
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });

  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Install prompt available:', e);
    deferredPrompt = e; // Store the event
    e.preventDefault(); // Prevent the default prompt
    // You can trigger the prompt later, e.g., with a button: deferredPrompt.prompt()
  });
}