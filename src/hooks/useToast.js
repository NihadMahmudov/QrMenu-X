import { useState, useCallback, useEffect, useRef } from 'react';

export function useToast() {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);

    const showToast = useCallback((msg) => {
        setMessage(msg);
        setVisible(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setVisible(false), 2500);
    }, []);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    return { message, visible, showToast };
}
