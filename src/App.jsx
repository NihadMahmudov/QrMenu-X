import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import MenuPage from './components/menu/MenuPage';
import AdminPage from './components/admin/AdminPage';

export default function App() {
    return (
        <DataProvider>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<MenuPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="*" element={<MenuPage />} />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </DataProvider>
    );
}
