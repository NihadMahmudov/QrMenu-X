import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loadDB, saveDB as saveToDisk, getActiveOwner } from '../utils/storage';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const [ownerEmail, setOwnerEmail] = useState(() => getActiveOwner());
    const [db, setDb] = useState(() => {
        const email = getActiveOwner();
        return email ? (loadDB(email) || null) : null;
    });

    // Listen for storage changes (for live preview in iframe)
    useEffect(() => {
        const handleStorage = () => {
            const email = getActiveOwner();
            if (email) {
                setOwnerEmail(email);
                setDb(loadDB(email));
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const loadOwner = useCallback((email) => {
        setOwnerEmail(email);
        const data = loadDB(email);
        setDb(data);
        return data;
    }, []);

    const update = useCallback((updater) => {
        setDb(prev => {
            const next = updater(structuredClone(prev));
            if (ownerEmail) saveToDisk(ownerEmail, next);
            return next;
        });
    }, [ownerEmail]);

    const setFullDB = useCallback((email, data) => {
        setOwnerEmail(email);
        setDb(data);
        saveToDisk(email, data);
    }, []);

    const clearOwner = useCallback(() => {
        setOwnerEmail(null);
        setDb(null);
    }, []);

    return (
        <DataContext.Provider value={{ db, update, ownerEmail, loadOwner, setFullDB, clearOwner }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);
