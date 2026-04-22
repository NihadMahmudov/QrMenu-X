import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../hooks/useToast';
import { getAccounts, saveAccounts, setActiveOwner, clearActiveOwner, defaultDB } from '../../utils/storage';
import Toast from '../shared/Toast';
import RestaurantForm from './RestaurantForm';
import CategoriesTab from './CategoriesTab';
import ItemsTab from './ItemsTab';
import styles from './AdminPage.module.css';

export default function AdminPage() {
    const { db, loadOwner, setFullDB } = useData();
    const { message, visible, showToast } = useToast();
    const [loggedIn, setLoggedIn] = useState(() => !!db?.owner);
    const [tab, setTab] = useState('restaurant');
    const [authTab, setAuthTab] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleLogin = () => {
        if (!form.email || !form.password) { setError('Bütün sahələri doldurun'); return; }
        const accounts = getAccounts();
        if (!accounts[form.email]) { setError('Bu e-mail ilə hesab tapılmadı'); return; }
        if (accounts[form.email] !== form.password) { setError('Şifrə yanlışdır'); return; }
        setActiveOwner(form.email);
        const data = loadOwner(form.email);
        if (!data) {
            const fresh = defaultDB(form.email.split('@')[0], form.email);
            setFullDB(form.email, fresh);
        }
        setLoggedIn(true);
        setError('');
        showToast(`👋 Xoş gəldiniz!`);
    };

    const handleRegister = () => {
        if (!form.name || !form.email || !form.password) { setError('Bütün sahələri doldurun'); return; }
        if (form.password.length < 6) { setError('Şifrə ən az 6 simvol olmalıdır'); return; }
        const accounts = getAccounts();
        if (accounts[form.email]) { setError('Bu e-mail artıq qeydiyyatdadır'); return; }
        accounts[form.email] = form.password;
        saveAccounts(accounts);
        setActiveOwner(form.email);
        const fresh = defaultDB(form.name, form.email);
        setFullDB(form.email, fresh);
        setLoggedIn(true);
        setError('');
        showToast(`🎉 Hesab yaradıldı, ${form.name}!`);
    };

    const logout = () => {
        clearActiveOwner();
        setLoggedIn(false);
        setForm({ name: '', email: '', password: '' });
        setError('');
        showToast('👋 Çıxış edildi');
    };

    const tabs = [
        { id: 'restaurant', label: 'Restoran', icon: 'fa-store' },
        { id: 'categories', label: 'Kateqoriyalar', icon: 'fa-tags' },
        { id: 'items', label: 'Yeməklər', icon: 'fa-utensils' },
    ];

    // ===== AUTH SCREEN =====
    if (!loggedIn) return (
        <div className={styles.authScreen}>
            <div className={styles.authCard}>
                <div className={styles.brand}>
                    <div className={styles.brandIcon}><i className="fa-solid fa-qrcode" /></div>
                    <h1>QR Menyu</h1>
                    <p>Restoranınız üçün rəqəmsal menyu yaradın</p>
                </div>
                <div className={styles.authTabs}>
                    <button className={`${styles.authTab} ${authTab === 'login' ? styles.activeTab : ''}`} onClick={() => { setAuthTab('login'); setError(''); }}>Daxil Ol</button>
                    <button className={`${styles.authTab} ${authTab === 'register' ? styles.activeTab : ''}`} onClick={() => { setAuthTab('register'); setError(''); }}>Qeydiyyat</button>
                </div>
                {error && <div className={styles.error}>{error}</div>}
                {authTab === 'register' && (
                    <div className={styles.field}>
                        <label>Ad Soyad</label>
                        <div className={styles.inp}><i className="fa-solid fa-user" /><input type="text" placeholder="Ad Soyad" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                    </div>
                )}
                <div className={styles.field}>
                    <label>E-mail</label>
                    <div className={styles.inp}><i className="fa-solid fa-envelope" /><input type="email" placeholder="ad@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                </div>
                <div className={styles.field}>
                    <label>Şifrə</label>
                    <div className={styles.inp}><i className="fa-solid fa-lock" /><input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && (authTab === 'login' ? handleLogin() : handleRegister())} /></div>
                </div>
                <button className={styles.authBtn} onClick={authTab === 'login' ? handleLogin : handleRegister}>
                    {authTab === 'login' ? 'Daxil Ol' : 'Qeydiyyatdan Keç'}
                </button>
            </div>
            <Toast message={message} visible={visible} />
        </div>
    );

    // ===== DASHBOARD =====
    return (
        <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarBrand}><i className="fa-solid fa-qrcode" /><span>QR Menyu</span></div>
                <nav className={styles.sidebarNav}>
                    {tabs.map(t => (
                        <button key={t.id} className={`${styles.navBtn} ${tab === t.id ? styles.navActive : ''}`} onClick={() => setTab(t.id)}>
                            <i className={`fa-solid ${t.icon}`} /><span>{t.label}</span>
                        </button>
                    ))}
                </nav>
                <div className={styles.sidebarFooter}>
                    <a href="/" target="_blank" className={styles.previewBtn}><i className="fa-solid fa-eye" /><span>Menyuya Bax</span></a>
                    <button className={styles.logoutBtn} onClick={logout}>
                        <i className="fa-solid fa-right-from-bracket" />
                        <span>{db?.owner?.name || 'Çıxış'}</span>
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                <div className={styles.mainHeader}>
                    <h2>{tabs.find(t => t.id === tab)?.label}</h2>
                </div>
                <div className={styles.tabContent}>
                    {tab === 'restaurant' && <RestaurantForm showToast={showToast} />}
                    {tab === 'categories' && <CategoriesTab showToast={showToast} />}
                    {tab === 'items' && <ItemsTab showToast={showToast} />}
                </div>
            </main>
            <Toast message={message} visible={visible} />
        </div>
    );
}
