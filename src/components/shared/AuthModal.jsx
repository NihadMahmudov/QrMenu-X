import { useState } from 'react';
import styles from './AuthModal.module.css';

export default function AuthModal({ onClose, onLogin }) {
    const [tab, setTab] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleLogin = () => {
        if (!form.email || !form.password) { setError('Bütün sahələri doldurun'); return; }
        const user = { name: form.email.split('@')[0], email: form.email };
        localStorage.setItem('qrmenu_customer', JSON.stringify(user));
        onLogin(user);
        onClose();
    };

    const handleRegister = () => {
        if (!form.name || !form.email || !form.password) { setError('Bütün sahələri doldurun'); return; }
        if (form.password.length < 6) { setError('Şifrə ən az 6 simvol olmalıdır'); return; }
        const user = { name: form.name, email: form.email };
        localStorage.setItem('qrmenu_customer', JSON.stringify(user));
        onLogin(user);
        onClose();
    };

    const handleForgot = () => {
        if (!form.email) { setError('E-mail ünvanınızı daxil edin'); return; }
        setTab('forgot_sent');
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.box}>
                <button className={styles.close} onClick={onClose}><i className="fa-solid fa-xmark" /></button>
                <div className={styles.logo}><i className="fa-solid fa-utensils" /></div>

                {tab === 'login' ? (
                    <>
                        <h2 className={styles.title}>Xoş Gəldiniz</h2>
                        <p className={styles.sub}>Hesabınıza daxil olun</p>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.field}>
                            <label>E-mail</label>
                            <div className={styles.inputWrap}><i className="fa-solid fa-envelope" /><input type="email" placeholder="ad@email.com" onChange={e => set('email', e.target.value)} /></div>
                        </div>
                        <div className={styles.field}>
                            <label>Şifrə</label>
                            <div className={styles.inputWrap}>
                                <i className="fa-solid fa-lock" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    onChange={e => set('password', e.target.value)} 
                                />
                                <button 
                                    type="button"
                                    className={styles.showBtn} 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fa-solid fa-eye${showPassword ? '-slash' : ''}`} />
                                </button>
                            </div>
                            <div className={styles.forgotLink} onClick={() => { setTab('forgot'); setError(''); }}>Şifrəmi unutdum?</div>
                        </div>
                        <button className={styles.btn} onClick={handleLogin}>Daxil Ol</button>
                        <p className={styles.switch}>Hesabınız yoxdur? <span onClick={() => { setTab('register'); setError(''); }}>Qeydiyyat</span></p>
                    </>
                ) : tab === 'register' ? (
                    <>
                        <h2 className={styles.title}>Qeydiyyat</h2>
                        <p className={styles.sub}>Yeni hesab yaradın</p>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.field}>
                            <label>Ad Soyad</label>
                            <div className={styles.inputWrap}><i className="fa-solid fa-user" /><input type="text" placeholder="Ad Soyad" onChange={e => set('name', e.target.value)} /></div>
                        </div>
                        <div className={styles.field}>
                            <label>E-mail</label>
                            <div className={styles.inputWrap}><i className="fa-solid fa-envelope" /><input type="email" placeholder="ad@email.com" onChange={e => set('email', e.target.value)} /></div>
                        </div>
                        <div className={styles.field}>
                            <label>Şifrə</label>
                            <div className={styles.inputWrap}>
                                <i className="fa-solid fa-lock" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Min. 6 simvol" 
                                    onChange={e => set('password', e.target.value)} 
                                />
                                <button 
                                    type="button"
                                    className={styles.showBtn} 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fa-solid fa-eye${showPassword ? '-slash' : ''}`} />
                                </button>
                            </div>
                        </div>
                        <button className={styles.btn} onClick={handleRegister}>Qeydiyyatdan Keç</button>
                        <p className={styles.switch}>Hesabınız var? <span onClick={() => { setTab('login'); setError(''); }}>Daxil Ol</span></p>
                    </>
                ) : tab === 'forgot' ? (
                    <>
                        <h2 className={styles.title}>Şifrəni Yenilə</h2>
                        <p className={styles.sub}>E-mail ünvanınızı daxil edin</p>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.field}>
                            <label>E-mail</label>
                            <div className={styles.inputWrap}><i className="fa-solid fa-envelope" /><input type="email" placeholder="ad@email.com" onChange={e => set('email', e.target.value)} /></div>
                        </div>
                        <button className={styles.btn} onClick={handleForgot}>Göndər</button>
                        <p className={styles.switch}><span onClick={() => { setTab('login'); setError(''); }}>Geri Qayıt</span></p>
                    </>
                ) : (
                    <>
                        <div className={styles.logo} style={{ background: '#10b981', margin: '0 auto 20px' }}>
                            <i className="fa-solid fa-check" />
                        </div>
                        <h2 className={styles.title}>Göndərildi!</h2>
                        <p className={styles.sub} style={{ marginBottom: '24px' }}>
                            Şifrə sıfırlama linki <b>{form.email}</b> ünvanına göndərildi.
                        </p>
                        <button className={styles.btn} onClick={() => { setTab('login'); setError(''); }}>Daxil Ol</button>
                    </>
                )}
            </div>
        </div>
    );
}
