import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { processItemImage } from '../../utils/storage';
import s from './AdminForms.module.css';

const BADGES = ['', 'Yeni', 'Populyar', 'Endirimli', 'Tövsiyə'];

export default function ItemsTab({ showToast }) {
    const { db, update } = useData();
    const [filter, setFilter] = useState('all');
    const [form, setForm] = useState({ catId: '', name: '', desc: '', price: '', imgUrl: '', badge: '' });
    const [editing, setEditing] = useState(null);
    const [confirm, setConfirm] = useState(null);
    const fileRef = useRef(null);
    const editFileRef = useRef(null);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) { showToast('⚠️ Şəkil 8MB-dan böyük olmamalıdır'); return; }
        try {
            const base64 = await processItemImage(file);
            set('imgUrl', base64);
            showToast('✅ Şəkil yükləndi');
        } catch { showToast('❌ Şəkil yüklənə bilmədi'); }
    };

    const handleEditFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) { showToast('⚠️ Max 8MB'); return; }
        try {
            const base64 = await processItemImage(file);
            setEditing(p => ({ ...p, imgUrl: base64 }));
            showToast('✅ Şəkil yükləndi');
        } catch { showToast('❌ Xəta'); }
    };

    const addItem = () => {
        if (!form.catId) { showToast('⚠️ Kateqoriya seçin'); return; }
        if (!form.name.trim()) { showToast('⚠️ Yemək adı yazın'); return; }
        if (!form.price || parseFloat(form.price) <= 0) { showToast('⚠️ Qiymət daxil edin'); return; }
        if (!form.imgUrl) { showToast('⚠️ Şəkil əlavə edin'); return; }
        update(db => {
            db.items.push({ id: 'item_' + Date.now(), ...form, price: parseFloat(form.price) });
            return db;
        });
        setForm({ catId: '', name: '', desc: '', price: '', imgUrl: '', badge: '' });
        if (fileRef.current) fileRef.current.value = '';
        showToast('✅ Yemək əlavə edildi!');
    };

    const startEdit = (item) => setEditing({ ...item });

    const saveEdit = () => {
        update(db => {
            const idx = db.items.findIndex(i => i.id === editing.id);
            if (idx > -1) db.items[idx] = { ...editing, price: parseFloat(editing.price) };
            return db;
        });
        setEditing(null);
        showToast('✅ Yemək yeniləndi');
    };

    const deleteItem = (id) => {
        update(db => { db.items = db.items.filter(i => i.id !== id); return db; });
        showToast('🗑️ Yemək silindi');
        setConfirm(null);
    };

    const displayed = filter === 'all' ? db.items : db.items.filter(i => i.catId === filter);
    const catName = (id) => db.categories.find(c => c.id === id)?.name || '?';

    return (
        <div>
            {/* ADD NEW ITEM */}
            <div className={s.addCard}>
                <h3 className={s.addCardTitle}><i className="fa-solid fa-plus" /> Yeni Yemək Əlavə Et</h3>
                <p className={s.addCardHint}>Bütün sahələri doldurun, şəkil telefonunuzdan yüklənə bilər</p>

                <div className={s.itemFormGrid}>
                    {/* Category */}
                    <div className={s.field}>
                        <label>Kateqoriya *</label>
                        <div className={s.inp}>
                            <select value={form.catId} onChange={e => set('catId', e.target.value)}>
                                <option value="">— Seçin —</option>
                                {db.categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Name */}
                    <div className={s.field}>
                        <label>Yemək Adı *</label>
                        <div className={s.inp}><input placeholder="məs: Qril Can Əti" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                    </div>

                    {/* Price */}
                    <div className={s.field}>
                        <label>Qiymət (₼) *</label>
                        <div className={s.inp}><input type="number" placeholder="0.00" min="0" step="0.5" value={form.price} onChange={e => set('price', e.target.value)} /></div>
                    </div>

                    {/* Badge */}
                    <div className={s.field}>
                        <label>Etiket (istəyə bağlı)</label>
                        <div className={s.inp}><select value={form.badge} onChange={e => set('badge', e.target.value)}>{BADGES.map(b => <option key={b} value={b}>{b || '— Yox —'}</option>)}</select></div>
                    </div>

                    {/* Description */}
                    <div className={`${s.field} ${s.span2}`}>
                        <label>Açıqlama</label>
                        <div className={s.inp}><input placeholder="Qısa açıqlama yazın..." value={form.desc} onChange={e => set('desc', e.target.value)} /></div>
                    </div>

                    {/* Image Upload */}
                    <div className={`${s.field} ${s.span2}`}>
                        <label>Yemək Şəkli *</label>
                        <div className={s.uploadArea} onClick={() => fileRef.current?.click()}>
                            {form.imgUrl ? (
                                <img src={form.imgUrl} alt="Yemək" className={s.previewImg} />
                            ) : (
                                <div className={s.uploadPlaceholder}>
                                    <i className="fa-solid fa-camera" />
                                    <span>Şəkil yüklə</span>
                                    <small>Telefonunuzdan seçin – max 5MB</small>
                                </div>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
                        </div>
                        {form.imgUrl && <button className={s.removeImgBtn} onClick={() => { set('imgUrl', ''); if (fileRef.current) fileRef.current.value = ''; }}>🗑️ Şəkli sil</button>}
                    </div>
                </div>

                <div className={s.saveBar} style={{ marginTop: 16 }}>
                    <button className={s.saveBtn} onClick={addItem}><i className="fa-solid fa-plus" /> Yemək Əlavə Et</button>
                </div>
            </div>

            {/* FILTER */}
            <div className={s.filterBar}>
                <span>Filtr:</span>
                <div className={s.filterPills}>
                    <button className={`${s.pill} ${filter === 'all' ? s.pillActive : ''}`} onClick={() => setFilter('all')}>Hamısı ({db.items.length})</button>
                    {db.categories.map(c => {
                        const count = db.items.filter(i => i.catId === c.id).length;
                        return <button key={c.id} className={`${s.pill} ${filter === c.id ? s.pillActive : ''}`} onClick={() => setFilter(c.id)}>{c.emoji} {c.name} ({count})</button>;
                    })}
                </div>
            </div>

            {/* ITEMS LIST */}
            <div className={s.itemList}>
                {displayed.length === 0 && <div className={s.empty}><i className="fa-solid fa-utensils" /><p>Yemək yoxdur. Yuxarıdan əlavə edin.</p></div>}
                {displayed.map(item => (
                    <div key={item.id} className={s.itemRow}>
                        <img src={item.imgUrl} alt={item.name} className={s.itemImg} onError={e => e.target.style.display = 'none'} />
                        <div className={s.itemInfo}>
                            <div className={s.itemName}>{item.name}</div>
                            <div className={s.itemDesc}>{item.desc || '—'}</div>
                            <div className={s.itemMeta}>
                                <span className={s.itemPrice}>{item.price?.toFixed(2)} ₼</span>
                                {item.badge && <span className={s.itemBadge}>{item.badge}</span>}
                                <span className={s.itemCat}>{catName(item.catId)}</span>
                            </div>
                        </div>
                        <div className={s.rowActions}>
                            <button className={`${s.iconBtn} ${s.editBtn}`} onClick={() => startEdit(item)} title="Düzəlt"><i className="fa-solid fa-pen" /></button>
                            <button className={s.iconBtn} onClick={() => setConfirm(item.id)} title="Sil"><i className="fa-solid fa-trash" /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* EDIT MODAL */}
            {editing && (
                <div className={s.confirmOverlay} onClick={() => setEditing(null)}>
                    <div className={s.editBox} onClick={e => e.stopPropagation()}>
                        <div className={s.editHeader}><h3>Yeməyi Düzəlt</h3><button className={s.closeBtn} onClick={() => setEditing(null)}><i className="fa-solid fa-xmark" /></button></div>
                        <div className={s.itemFormGrid} style={{ padding: 20 }}>
                            <div className={s.field}><label>Kateqoriya</label><div className={s.inp}><select value={editing.catId} onChange={e => setEditing(p => ({ ...p, catId: e.target.value }))}>{db.categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}</select></div></div>
                            <div className={s.field}><label>Ad</label><div className={s.inp}><input value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} /></div></div>
                            <div className={s.field}><label>Qiymət</label><div className={s.inp}><input type="number" step="0.5" value={editing.price} onChange={e => setEditing(p => ({ ...p, price: e.target.value }))} /></div></div>
                            <div className={s.field}><label>Etiket</label><div className={s.inp}><select value={editing.badge || ''} onChange={e => setEditing(p => ({ ...p, badge: e.target.value }))}>{BADGES.map(b => <option key={b} value={b}>{b || 'Yox'}</option>)}</select></div></div>
                            <div className={`${s.field} ${s.span2}`}><label>Açıqlama</label><div className={s.inp}><input value={editing.desc || ''} onChange={e => setEditing(p => ({ ...p, desc: e.target.value }))} /></div></div>
                            <div className={`${s.field} ${s.span2}`}>
                                <label>Şəkil</label>
                                <div className={s.uploadArea} onClick={() => editFileRef.current?.click()}>
                                    {editing.imgUrl ? <img src={editing.imgUrl} alt="Yemək" className={s.previewImg} /> : <div className={s.uploadPlaceholder}><i className="fa-solid fa-camera" /><span>Şəkil yüklə</span></div>}
                                    <input ref={editFileRef} type="file" accept="image/*" hidden onChange={handleEditFile} />
                                </div>
                            </div>
                        </div>
                        <div className={s.saveBar} style={{ padding: '0 20px 20px' }}><button className={s.saveBtn} onClick={saveEdit}><i className="fa-solid fa-floppy-disk" /> Yadda Saxla</button></div>
                    </div>
                </div>
            )}

            {/* CONFIRM DELETE */}
            {confirm && (
                <div className={s.confirmOverlay} onClick={() => setConfirm(null)}>
                    <div className={s.confirmBox} onClick={e => e.stopPropagation()}>
                        <i className={`fa-solid fa-triangle-exclamation ${s.warningIcon}`} />
                        <h3>Silmək istədiyinizə əminsiniz?</h3>
                        <p>Bu əməliyyat geri qaytarıla bilməz.</p>
                        <div className={s.confirmBtns}>
                            <button className={s.cancelBtn} onClick={() => setConfirm(null)}>Ləğv et</button>
                            <button className={s.dangerBtn} onClick={() => deleteItem(confirm)}>Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
