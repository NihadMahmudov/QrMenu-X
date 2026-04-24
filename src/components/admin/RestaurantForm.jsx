import { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { processcover, processLogo } from '../../utils/storage';
import s from './AdminForms.module.css';

export default function RestaurantForm({ showToast, onFormChange }) {
    const { db, update } = useData();
    const emptyRest = { name: '', tagline: '', coverUrl: '', logoUrl: '', phone: '', whatsapp: '', address: '', hours: '', wifi: '', rating: '' };
    const [form, setForm] = useState(db?.restaurant || emptyRest);
    const coverRef = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => { if (db?.restaurant) setForm(db.restaurant); }, [db?.restaurant]);


    // Report form changes to parent so it can auto-save on tab switch
    useEffect(() => {
        if (onFormChange) onFormChange(form);
    }, [form, onFormChange]);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleFile = async (e, key) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) { showToast('⚠️ Şəkil 8MB-dan böyük olmamalıdır'); return; }
        try {
            const processor = key === 'coverUrl' ? processcover : processLogo;
            const base64 = await processor(file);
            set(key, base64);
            showToast('✅ Şəkil yükləndi');
        } catch { showToast('❌ Şəkil yüklənə bilmədi'); }
    };

    const save = () => {
        if (!form.name) { showToast('⚠️ Restoran adı mütləqdir'); return; }
        update(db => { db.restaurant = form; return db; });
        showToast('✅ Yadda saxlanıldı!');
    };

    return (
        <div>
            <div className={s.formGrid}>
                {/* Visual */}
                <div className={`${s.card} ${s.span2}`}>
                    <h3 className={s.cardTitle}><i className="fa-solid fa-image" /> Vizual Məlumatlar</h3>
                    <div className={s.twoCol}>
                        <div className={s.field}>
                            <label>Restoran Adı *</label>
                            <div className={s.inp}><input placeholder="məs: Baku Central" value={form.name || ''} onChange={e => set('name', e.target.value)} /></div>
                        </div>
                        <div className={s.field}>
                            <label>Slogan</label>
                            <div className={s.inp}><input placeholder="məs: Azərbaycan mətbəxi" value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} /></div>
                        </div>

                        {/* Cover Image Upload */}
                        <div className={`${s.field} ${s.span2}`}>
                            <label>Örtük Şəkli (Cover)</label>
                            <div className={s.uploadArea} onClick={() => coverRef.current?.click()}>
                                {form.coverUrl ? (
                                    <img src={form.coverUrl} alt="Cover" className={s.previewImg} />
                                ) : (
                                    <div className={s.uploadPlaceholder}>
                                        <i className="fa-solid fa-cloud-arrow-up" />
                                        <span>Şəkil seçin (Klikləyin)</span>
                                        <small>JPG, PNG – max 5MB</small>
                                    </div>
                                )}
                                <input ref={coverRef} type="file" accept="image/*" hidden onChange={e => handleFile(e, 'coverUrl')} />
                            </div>
                            {form.coverUrl && <button className={s.removeImgBtn} onClick={() => set('coverUrl', '')}>🗑️ Şəkli sil</button>}
                        </div>

                        {/* Logo Upload */}
                        <div className={`${s.field} ${s.span2}`}>
                            <label>Loqo / Profil Şəkli</label>
                            <div className={s.uploadArea} onClick={() => logoRef.current?.click()} style={{ maxWidth: 200 }}>
                                {form.logoUrl ? (
                                    <img src={form.logoUrl} alt="Logo" className={s.previewImgRound} />
                                ) : (
                                    <div className={s.uploadPlaceholder}>
                                        <i className="fa-solid fa-circle-user" />
                                        <span>Loqo seçin</span>
                                    </div>
                                )}
                                <input ref={logoRef} type="file" accept="image/*" hidden onChange={e => handleFile(e, 'logoUrl')} />
                            </div>
                            {form.logoUrl && <button className={s.removeImgBtn} onClick={() => set('logoUrl', '')}>🗑️ Şəkli sil</button>}
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className={s.card}>
                    <h3 className={s.cardTitle}><i className="fa-solid fa-phone" /> Əlaqə</h3>
                    <div className={s.field}><label>Telefon</label><div className={s.inp}><input placeholder="+994 50 123 45 67" value={form.phone || ''} onChange={e => set('phone', e.target.value)} /></div></div>
                    <div className={s.field}><label>WhatsApp</label><div className={s.inp}><input placeholder="994554772779" value={form.whatsapp || ''} onChange={e => set('whatsapp', e.target.value)} /></div></div>
                    <div className={s.field}><label>Ünvan</label><div className={s.inp}><input placeholder="Küçə, Şəhər" value={form.address || ''} onChange={e => set('address', e.target.value)} /></div></div>
                </div>

                {/* Other */}
                <div className={s.card}>
                    <h3 className={s.cardTitle}><i className="fa-solid fa-circle-info" /> Digər</h3>
                    <div className={s.field}><label>İş Saatları</label><div className={s.inp}><input placeholder="10:00 – 23:00" value={form.hours || ''} onChange={e => set('hours', e.target.value)} /></div></div>
                    <div className={s.field}><label>WiFi Şifrəsi</label><div className={s.inp}><input placeholder="guest_wifi" value={form.wifi || ''} onChange={e => set('wifi', e.target.value)} /></div></div>
                    <div className={s.field}><label>Reytinq (1–5)</label><div className={s.inp}><input type="number" min="1" max="5" step="0.1" placeholder="4.8" value={form.rating || ''} onChange={e => set('rating', e.target.value)} /></div></div>
                </div>
            </div>
            <div className={s.saveBar}>
                <button className={s.saveBtn} onClick={save}><i className="fa-solid fa-floppy-disk" /> Yadda Saxla</button>
            </div>
        </div>
    );
}
