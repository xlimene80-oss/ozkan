import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header.js';
import { Footer } from './components/layout/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ClaimGuidePage } from './pages/ClaimGuidePage.js';
import { ContactPage } from './pages/ContactPage.js';
import { LegalPage } from './pages/LegalPage.js';
import { AdminPage } from './pages/admin/AdminPage.js';
import { ConsultantWidget } from './components/widget/ConsultantWidget.js';
import { CookiePreferences } from './components/privacy/CookiePreferences.js';

import { API_BASE_URL } from './config/api.js';

export const App: React.FC = () => {
  // Netlify Serverless API sağlık kontrolü
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`, { method: 'GET' }).catch(() => {
      // Sessiz kontrol
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 relative">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teklif/:slug" element={<ProductDetailPage />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/hasar-bildirimi" element={<ClaimGuidePage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/kvkk" element={<LegalPage />} />
            <Route path="/gizlilik" element={<LegalPage />} />
            <Route path="/cerez-politikasi" element={<LegalPage />} />
            <Route path="/kullanim-sartlari" element={<LegalPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/talepler" element={<AdminPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />

        {/* Aşama 3: Danışman Widget'ı (Sağ Alt) ve Çerez Tercihleri (Sol Alt) */}
        <ConsultantWidget />
        <CookiePreferences />
      </div>
    </BrowserRouter>
  );
};

export default App;
