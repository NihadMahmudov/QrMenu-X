import { useState } from 'react';
import { useData } from '../../context/DataContext';
import s from './AdminForms.module.css';

export default function CategoriesTab({ showToast }) {
    const { db, update } = useData();
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('');
    const [confirm, setConfirm] = useState(null);

    const add = () => {
        if (!name.trim()) { showToast('⚠️ Kateqoriya adı yazın'); return; }
        update(db => { db.categories.push({ id: 'cat_' + Date.now(), name: name.trim(), emoji: emoji.trim() || '🍽️' }); return db; });
        setName(''); setEmoji('');
        showToast('✅ Kateqoriya əlavə edildi');
    };

    const remove = (id) => {
        update(db => {
            db.categories = db.categories.filter(c => c.id !== id);
            db.items = db.items.filter(i => i.catId !== id);
            return db;
        });
        showToast('🗑️ Kateqoriya silindi');
        setConfirm(null);
    };

    return (
        <div>
            <div className={s.addCard}>
                <h3><i className="fa-solid fa-plus" /> Yeni Kateqoriya</h3>
                <div className={s.inlineForm}>
                    <div className={`${s.inp} ${s.flex1}`}><input placeholder="Kateqoriya adı..." value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} /></div>
                    <div className={`${s.inp} ${s.w90}`}><input placeholder="🍽️" maxLength={4} value={emoji} onChange={e => setEmoji(e.target.value)} /></div>
                    <button className={s.addBtn} onClick={add}><i className="fa-solid fa-plus" /> Əlavə Et</button>
                </div>
            </div>

            <div className={s.list}>
                {db.categories.length === 0 && <div className={s.empty}><i className="fa-solid fa-tags" /><p>Kateqoriya yoxdur</p></div>}
                {db.categories.map(cat => {
                    const count = db.items.filter(i => i.catId === cat.id).length;
                    return (
                        <div key={cat.id} className={s.row}>
                            <span className={s.rowEmoji}>{cat.emoji}</span>
                            <span className={s.rowName}>{cat.name}</span>
                            <span className={s.rowCount}>{count} yemək</span>
                            <button className={s.delBtn} onClick={() => setConfirm(cat.id)}><i className="fa-solid fa-trash" /></button>
                        </div>
                    );
                })}
            </div>

            {confirm && (
                <div className={s.confirmOverlay} onClick={() => setConfirm(null)}>
                    <div className={s.confirmBox} onClick={e => e.stopPropagation()}>
                        <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444', fontSize: 36, display: 'block', marginBottom: 12 }} />
                        <h3>Silmək istədiyinizə əminsiniz?</h3>
                        <p>Bu kateqoriyanın bütün yeməkləri də silinəcək.</p>
                        <div className={s.confirmBtns}>
                            <button className={s.cancelBtn} onClick={() => setConfirm(null)}>Ləğv et</button>
                            <button className={s.dangerBtn} onClick={() => remove(confirm)}>Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
