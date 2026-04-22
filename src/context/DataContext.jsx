import { createContext, useContext, useState, useCallback } from 'react';
import { loadDB, saveDB as saveToDisk, getActiveOwner } from '../utils/storage';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const [ownerEmail, setOwnerEmail] = useState(() => getActiveOwner());
    const [db, setDb] = useState(() => {
        const email = getActiveOwner();
        return email ? (loadDB(email) || null) : null;
    });

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

    return (
        <DataContext.Provider value={{ db, update, ownerEmail, loadOwner, setFullDB }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);
