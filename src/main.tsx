import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';

// PWA Service Worker Kaydı (Mobil & Masaüstü Çevrimdışı/Hızlı Başlatma)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker başarıyla kaydedildi:', registration.scope);
      })
      .catch((error) => {
        console.warn('[PWA] Service Worker kaydı başarısız:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
