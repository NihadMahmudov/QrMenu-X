import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../hooks/useToast';
import { getAccounts, saveAccounts, setActiveOwner, clearActiveOwner, defaultDB } from '../../utils/storage';
import LanguageSelector from '../shared/LanguageSelector';
import Toast from '../shared/Toast';
import RestaurantForm from './RestaurantForm';
import CategoriesTab from './CategoriesTab';
import ItemsTab from './ItemsTab';
import SettingsTab from './SettingsTab';
import styles from './AdminPage.module.css';

export default function AdminPage() {
    const { db, loadOwner, setFullDB, update, clearOwner } = useData();
    const { t } = useLanguage();
    const { message, visible, showToast } = useToast();
    const [loggedIn, setLoggedIn] = useState(() => !!db?.owner);
    const [tab, setTab] = useState('restaurant');
    const [authTab, setAuthTab] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [showLivePreview, setShowLivePreview] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const searchInputRef = useRef(null);

    // Keep a ref to the pending restaurant form data so we can auto-save on tab switch
    const pendingRestaurantRef = useRef(null);

    const registerPendingRestaurant = useCallback((data) => {
        pendingRestaurantRef.current = data;
    }, []);

    const flushPendingRestaurant = useCallback(() => {
        if (pendingRestaurantRef.current) {
            update(db => { db.restaurant = pendingRestaurantRef.current; return db; });
            pendingRestaurantRef.current = null;
        }
    }, [update]);

    const handleTabSwitch = (newTab) => {
        // Auto-save restaurant data before switching away
        if (tab === 'restaurant') {
            flushPendingRestaurant();
        }
        setTab(newTab);
    };

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleLogin = () => {
        if (!form.email || !form.password) { setError(t('fill_all_fields')); return; }
        const accounts = getAccounts();
        if (!accounts[form.email]) { setError(t('account_not_found')); return; }
        if (accounts[form.email] !== form.password) { setError(t('wrong_password')); return; }
        setActiveOwner(form.email);
        const data = loadOwner(form.email);
        if (!data) {
            const fresh = defaultDB(form.email.split('@')[0], form.email);
            setFullDB(form.email, fresh);
        }
        setLoggedIn(true);
        setError('');
        showToast(t('welcome_back'));
    };

    const handleRegister = () => {
        if (!form.name || !form.email || !form.password) { setError(t('fill_all_fields')); return; }
        if (form.password.length < 6) { setError(t('password_min_length')); return; }
        const accounts = getAccounts();
        if (accounts[form.email]) { setError(t('email_exists')); return; }
        accounts[form.email] = form.password;
        saveAccounts(accounts);
        setActiveOwner(form.email);
        const fresh = defaultDB(form.name, form.email);
        setFullDB(form.email, fresh);
        setLoggedIn(true);
        setError('');
        showToast(`${t('account_created')} ${form.name}!`);
    };

    const handleForgot = () => {
        if (!form.email) { setError(t('enter_email')); return; }
        setAuthTab('forgot_sent');
    };

    const logout = () => {
        clearActiveOwner();
        clearOwner();
        setLoggedIn(false);
        setForm({ name: '', email: '', password: '' });
        setError('');
        showToast(t('logged_out'));
    };

    const tabs = [
        { id: 'restaurant', label: t('restaurant'), icon: 'fa-store' },
        { id: 'categories', label: t('categories'), icon: 'fa-tags' },
        { id: 'items', label: t('foods'), icon: 'fa-utensils' },
        { id: 'settings', label: t('settings'), icon: 'fa-gear' },
    ];

    // ===== AUTH SCREEN =====
    if (!loggedIn) return (
        <div className={styles.authScreen}>
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <LanguageSelector />
            </div>
            <div className={styles.authCard}>
                <div className={styles.brand}>
                    <div className={styles.brandIcon}><img src="/logo.png" alt="Logo" /></div>
                    <h1>QR Menyu</h1>
                    <p>{t('create_digital_menu')}</p>
                </div>
                <div className={styles.authTabs}>
                    {(authTab === 'login' || authTab === 'register') ? (
                        <>
                            <button className={`${styles.authTab} ${authTab === 'login' ? styles.activeTab : ''}`} onClick={() => { setAuthTab('login'); setError(''); }}>{t('login')}</button>
                            <button className={`${styles.authTab} ${authTab === 'register' ? styles.activeTab : ''}`} onClick={() => { setAuthTab('register'); setError(''); }}>{t('register')}</button>
                        </>
                    ) : (
                        <button className={`${styles.authTab} ${styles.activeTab}`}>{t('reset_password')}</button>
                    )}
                </div>
                {error && <div className={styles.error}>{error}</div>}
                
                {authTab === 'forgot' ? (
                    <>
                        <div className={styles.field}>
                            <label>{t('email')}</label>
                            <div className={styles.inp}><i className="fa-solid fa-envelope" /><input type="email" placeholder="ad@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                        </div>
                        <button className={styles.authBtn} onClick={handleForgot}>{t('send')}</button>
                        <div className={styles.authFooter}>
                            <button className={styles.backToHome} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 auto' }} onClick={() => { setAuthTab('login'); setError(''); }}><i className="fa-solid fa-arrow-left" /> {t('back')}</button>
                        </div>
                    </>
                ) : authTab === 'forgot_sent' ? (
                    <>
                        <div className={styles.brandIcon} style={{ background: '#10b981', color: '#fff', fontSize: '32px' }}><i className="fa-solid fa-check" /></div>
                        <p style={{ textAlign: 'center', marginBottom: '20px' }}>{t('password_reset_sent')} <b>{form.email}</b></p>
                        <button className={styles.authBtn} onClick={() => { setAuthTab('login'); setError(''); }}>{t('login')}</button>
                    </>
                ) : (
                    <>
                        {authTab === 'register' && (
                            <div className={styles.field}>
                                <label>{t('name')}</label>
                                <div className={styles.inp}><i className="fa-solid fa-user" /><input type="text" placeholder={t('name')} value={form.name} onChange={e => set('name', e.target.value)} /></div>
                            </div>
                        )}
                        <div className={styles.field}>
                            <label>{t('email')}</label>
                            <div className={styles.inp}><i className="fa-solid fa-envelope" /><input type="email" placeholder="ad@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                        </div>
                        <div className={styles.field}>
                            <label>{t('password')}</label>
                            <div className={styles.inp}><i className="fa-solid fa-lock" /><input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && (authTab === 'login' ? handleLogin() : handleRegister())} /></div>
                            {authTab === 'login' && <div className={styles.forgotLink} onClick={() => { setAuthTab('forgot'); setError(''); }}>{t('forgot_password')}</div>}
                        </div>
                        <button className={styles.authBtn} onClick={authTab === 'login' ? handleLogin : handleRegister}>
                            {authTab === 'login' ? t('login') : t('register_button')}
                        </button>
                        <div className={styles.authFooter}>
                            <Link to="/" className={styles.backToHome}><i className="fa-solid fa-arrow-left" /> {t('back_to_home')}</Link>
                        </div>
                    </>
                )}
            </div>
            <Toast message={message} visible={visible} />
        </div>
    );

    // ===== DASHBOARD =====
    return (
        <div className={`${styles.dashboard} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
            <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)}></div>
            <aside className={styles.sidebar}>
                <Link to="/" className={styles.sidebarBrand} title="Ana Səhifəyə Qayıt">
                    <img src="/logo.png" alt="Logo" className={styles.sidebarLogo} />
                    <span>QR Menyu</span>
                </Link>
                <nav className={styles.sidebarNav}>
                    {tabs.map(t => (
                        <button key={t.id} className={`${styles.navBtn} ${tab === t.id ? styles.navActive : ''}`} onClick={() => { handleTabSwitch(t.id); setSidebarOpen(false); }}>
                            <i className={`fa-solid ${t.icon}`} /><span>{t.label}</span>
                        </button>
                    ))}
                </nav>
                <div className={styles.sidebarFooter}>
                    <a href="/menu" target="_blank" className={styles.previewBtn}><i className="fa-solid fa-eye" /><span>{t('view_menu')}</span></a>
                    <button className={styles.logoutBtn} onClick={logout}>
                        <i className="fa-solid fa-right-from-bracket" />
                        <span>{db?.owner?.name || t('logout')}</span>
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                <div className={styles.mainHeader}>
                    <div className={styles.headerLeft}>
                        <button className={styles.mobileToggle} onClick={() => setSidebarOpen(true)}>
                            <i className="fa-solid fa-bars" />
                        </button>
                        <h2>{tabs.find(t => t.id === tab)?.label}</h2>
                    </div>
                    <div className={styles.headerActions}>
                        {searchOpen && (
                            <div className={styles.headerSearch}>
                                <i className="fa-solid fa-magnifying-glass" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder={t('search_dot')}
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && <button className={styles.searchClear} onClick={() => setSearchQuery('')}><i className="fa-solid fa-xmark" /></button>}
                            </div>
                        )}
                        <button
                            className={`${styles.headerIconBtn} ${searchOpen ? styles.headerIconBtnActive : ''}`}
                            onClick={() => { setSearchOpen(p => !p); setTimeout(() => searchInputRef.current?.focus(), 100); }}
                            title={t('search_btn')}
                        >
                            <i className={`fa-solid fa-${searchOpen ? 'xmark' : 'magnifying-glass'}`} />
                        </button>
                        <LanguageSelector />
                        <button
                            className={`${styles.headerIconBtn} ${showLivePreview ? styles.headerIconBtnActive : ''}`}
                            onClick={() => setShowLivePreview(p => !p)}
                            title={t('live_preview')}
                        >
                            <i className="fa-solid fa-mobile-screen-button" />
                        </button>
                    </div>
                </div>
                <div className={styles.adminMainLayout}>
                    <div className={styles.tabContent}>
                        {tab === 'restaurant' && <RestaurantForm showToast={showToast} onFormChange={registerPendingRestaurant} />}
                        {tab === 'categories' && <CategoriesTab showToast={showToast} searchQuery={searchQuery} />}
                        {tab === 'items' && <ItemsTab showToast={showToast} searchQuery={searchQuery} />}
                        {tab === 'settings' && <SettingsTab showToast={showToast} />}
                    </div>
                    {showLivePreview && (
                        <div className={styles.livePreview}>
                            <div className={styles.previewPhone}>
                                <iframe src={`/menu?preview=true&tab=${tab}`} className={styles.previewFrame} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Toast message={message} visible={visible} />
        </div>
    );
}
