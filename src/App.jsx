import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';

const LandingPage = lazy(() => import('./components/landing/LandingPage'));
const MenuPage = lazy(() => import('./components/menu/MenuPage'));
const AdminPage = lazy(() => import('./components/admin/AdminPage'));

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const PageLoader = () => (
    <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#0f172a',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
    }}>
        <div className="spinner" style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid rgba(255,255,255,0.1)', 
            borderTopColor: '#fb923c', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
        }}></div>
        <p style={{ opacity: 0.7, fontSize: '14px' }}>Yüklənir...</p>
        <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
    </div>
);

export default function App() {
    return (
        <LanguageProvider>
            <DataProvider>
                <CartProvider>
                    <BrowserRouter>
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/menu" element={<MenuPage />} />
                                <Route path="/admin" element={<AdminPage />} />
                                <Route path="*" element={<LandingPage />} />
                            </Routes>
                        </Suspense>
                        <Analytics />
                        <SpeedInsights />
                    </BrowserRouter>
                </CartProvider>
            </DataProvider>
        </LanguageProvider>
    );
}
