import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState({});       // { itemId: qty }
    const [tableNumber, setTableNumber] = useState(null);

    const addToCart = useCallback((id) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }, []);

    const changeQty = useCallback((id, delta) => {
        setCart(prev => {
            const next = { ...prev, [id]: (prev[id] || 0) + delta };
            if (next[id] <= 0) delete next[id];
            return next;
        });
    }, []);

    const clearCart = useCallback(() => setCart({}), []);

    const totalQty = Object.values(cart).reduce((s, v) => s + v, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, changeQty, clearCart, totalQty, tableNumber, setTableNumber }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
