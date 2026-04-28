import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext(null);

export function defaultDB(ownerName, ownerEmail) {
    return {
        owner: { name: ownerName, email: ownerEmail },
        restaurant: {
            name: '', tagline: '', coverUrl: '', logoUrl: '',
            phone: '', whatsapp: '', address: '', hours: '', wifi: '', rating: ''
        },
        categories: [
            { id: 'cat_1', name: 'Başlanğıclar', emoji: '🥗' },
            { id: 'cat_2', name: 'Ana Yeməklər', emoji: '🍽️' },
            { id: 'cat_3', name: 'İçkilər', emoji: '🥤' },
            { id: 'cat_4', name: 'Şirniyyatlar', emoji: '🍰' },
        ],
        items: [],
        settings: {}
    };
}

export function DataProvider({ children }) {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [db, setDb] = useState(null);
    const [loading, setLoading] = useState(true);

    // Refs to always have latest values (avoids stale closure bugs)
    const sessionRef = useRef(null);
    const dbRef = useRef(null);
    const saveTimeout = useRef(null);

    useEffect(() => { sessionRef.current = session; }, [session]);
    useEffect(() => { dbRef.current = db; }, [db]);

    // --- Core save function (uses ref to get latest session) ---
    const saveNow = async (data) => {
        const s = sessionRef.current;
        if (!s?.user?.id) return;
        const { error } = await supabase
            .from('menu_data')
            .upsert({
                owner_id: s.user.id,
                owner_email: s.user.email,
                data: data,
            }, { onConflict: 'owner_id' });
        if (error) console.error('saveNow error:', error);
        else console.log('✅ Saved to Supabase');
    };

    // Debounced save (500ms)
    const saveToDB = (newData) => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveNow(newData), 500);
    };

    // Flush any pending save immediately
    const flushSave = async () => {
        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
            saveTimeout.current = null;
        }
        if (dbRef.current) await saveNow(dbRef.current);
    };

    // --- Auth bootstrap ---
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user);
            else setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchProfile(session.user);
            else {
                setProfile(null);
                setDb(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (user) => {
        try {
            const { data: prof } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(prof);
            if (prof?.status === 'approved') {
                await fetchMenuData(user.id, prof.email, prof.name);
            }
        } catch (e) {
            console.error('fetchProfile error', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuData = async (userId, email, name) => {
        const { data: menuRow } = await supabase
            .from('menu_data')
            .select('data')
            .eq('owner_id', userId)
            .single();

        if (!menuRow) {
            const fresh = defaultDB(name || email.split('@')[0], email);
            await supabase.from('menu_data').insert({
                owner_id: userId,
                owner_email: email,
                data: fresh
            });
            setDb(fresh);
        } else {
            setDb(menuRow.data);
        }
    };

    // --- Public API ---
    const update = useCallback((updater) => {
        setDb(prev => {
            if (!prev) return prev; // Don't update if db isn't loaded yet
            const next = updater(structuredClone(prev));
            saveToDB(next);
            return next;
        });
    }, []);

    const logout = useCallback(async () => {
        await flushSave(); // Save pending data BEFORE signing out
        await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
        setDb(null);
    }, []);

    const refreshProfile = useCallback(async () => {
        if (!sessionRef.current?.user) return;
        await fetchProfile(sessionRef.current.user);
    }, []);

    const ownerEmail = profile?.email || session?.user?.email || null;
    const loggedIn = !!session && profile?.status === 'approved';
    const isPending = !!session && profile?.status === 'pending';
    const isRejected = !!session && profile?.status === 'rejected';
    const isSuperAdmin = profile?.status === 'approved' &&
        ownerEmail === import.meta.env.VITE_ADMIN_EMAIL;

    return (
        <DataContext.Provider value={{
            db, update, ownerEmail,
            session, profile, loading,
            loggedIn, isPending, isRejected, isSuperAdmin,
            logout, refreshProfile,
            loadOwner: () => {},
            setFullDB: () => {},
            clearOwner: logout,
        }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);
