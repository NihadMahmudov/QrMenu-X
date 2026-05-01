import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from './components/landing/LandingPage';
import MenuPage from './components/menu/MenuPage';
import AdminPage from './components/admin/AdminPage';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
    return (
        <LanguageProvider>
            <DataProvider>
                <CartProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/menu" element={<MenuPage />} />
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="*" element={<LandingPage />} />
                        </Routes>
                        <Analytics />
                        <SpeedInsights />
                    </BrowserRouter>
                </CartProvider>
            </DataProvider>
        </LanguageProvider>
    );
}
