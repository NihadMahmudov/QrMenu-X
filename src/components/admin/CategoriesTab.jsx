import { useState } from 'react';
import { useData } from '../../context/DataContext';
import s from './AdminForms.module.css';

export default function CategoriesTab({ showToast }) {
    const { db, update } = useData();
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('');
    const [confirm, setConfirm] = useState(null);
    const [editing, setEditing] = useState(null); // { id, name, emoji }

    const add = () => {
        if (!name.trim()) { showToast('⚠️ Kateqoriya adı yazın'); return; }
        update(db => { db.categories.push({ id: 'cat_' + Date.now(), name: name.trim(), emoji: emoji.trim() || '🍽️' }); return db; });
        setName(''); setEmoji('');
        showToast('✅ Kateqoriya əlavə edildi');
    };

    const saveEdit = () => {
        if (!editing.name.trim()) { showToast('⚠️ Ad boş ola bilməz'); return; }
        update(db => {
            const idx = db.categories.findIndex(c => c.id === editing.id);
            if (idx > -1) db.categories[idx] = { ...db.categories[idx], name: editing.name.trim(), emoji: editing.emoji.trim() || '🍽️' };
            return db;
        });
        setEditing(null);
        showToast('✅ Kateqoriya yeniləndi');
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

    const moveUp = (index) => {
        if (index === 0) return;
        update(db => {
            const cats = [...db.categories];
            [cats[index - 1], cats[index]] = [cats[index], cats[index - 1]];
            db.categories = cats;
            return db;
        });
    };

    const moveDown = (index) => {
        if (index === db.categories.length - 1) return;
        update(db => {
            const cats = [...db.categories];
            [cats[index], cats[index + 1]] = [cats[index + 1], cats[index]];
            db.categories = cats;
            return db;
        });
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
                {db.categories.map((cat, index) => {
                    const count = db.items.filter(i => i.catId === cat.id).length;
                    return (
                        <div key={cat.id} className={s.row}>
                            {/* MOVE BUTTONS */}
                            <div className={s.moveButtons}>
                                <button
                                    className={s.moveBtn}
                                    onClick={() => moveUp(index)}
                                    disabled={index === 0}
                                    title="Yuxarı köçür"
                                >
                                    <i className="fa-solid fa-chevron-up" />
                                </button>
                                <button
                                    className={s.moveBtn}
                                    onClick={() => moveDown(index)}
                                    disabled={index === db.categories.length - 1}
                                    title="Aşağı köçür"
                                >
                                    <i className="fa-solid fa-chevron-down" />
                                </button>
                            </div>

                            <span className={s.rowEmoji}>{cat.emoji}</span>
                            <span className={s.rowName}>{cat.name}</span>
                            <span className={s.rowCount}>{count} yemək</span>
                            <div className={s.rowActions}>
                                <button className={`${s.iconBtn} ${s.editBtn}`} onClick={() => setEditing({ id: cat.id, name: cat.name, emoji: cat.emoji })} title="Düzəlt"><i className="fa-solid fa-pen" /></button>
                                <button className={s.delBtn} onClick={() => setConfirm(cat.id)} title="Sil"><i className="fa-solid fa-trash" /></button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* EDIT MODAL */}
            {editing && (
                <div className={s.confirmOverlay} onClick={() => setEditing(null)}>
                    <div className={s.editBox} onClick={e => e.stopPropagation()}>
                        <div className={s.editHeader}>
                            <h3><i className="fa-solid fa-pen" style={{ marginRight: 10 }} />Kateqoriyanı Düzəlt</h3>
                            <button className={s.closeBtn} onClick={() => setEditing(null)}><i className="fa-solid fa-xmark" /></button>
                        </div>
                        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className={s.field}>
                                <label>Kateqoriya Adı *</label>
                                <div className={s.inp}>
                                    <input
                                        placeholder="Kateqoriya adı..."
                                        value={editing.name}
                                        onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                                        onKeyDown={e => e.key === 'Enter' && saveEdit()}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className={s.field}>
                                <label>Emoji</label>
                                <div className={s.inp}>
                                    <input
                                        placeholder="🍽️"
                                        maxLength={4}
                                        value={editing.emoji}
                                        onChange={e => setEditing(p => ({ ...p, emoji: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={s.saveBar} style={{ padding: '0 20px 20px' }}>
                            <button className={s.saveBtn} onClick={saveEdit}><i className="fa-solid fa-floppy-disk" /> Yadda Saxla</button>
                        </div>
                    </div>
                </div>
            )}

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
