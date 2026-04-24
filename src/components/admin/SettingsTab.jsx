import { useState } from 'react';
import { useData } from '../../context/DataContext';
import s from './AdminForms.module.css';

export default function SettingsTab({ showToast }) {
    const { db, update, ownerEmail } = useData();
    const [currency, setCurrency] = useState(db?.settings?.currency || '₼');
    const [serviceFee, setServiceFee] = useState(db?.settings?.serviceFee || '10');
    const [showWifi, setShowWifi] = useState(db?.settings?.showWifi !== false);
    const [showRating, setShowRating] = useState(db?.settings?.showRating !== false);
    const [showPhone, setShowPhone] = useState(db?.settings?.showPhone !== false);
    const [showAddress, setShowAddress] = useState(db?.settings?.showAddress !== false);

    const save = () => {
        update(db => {
            db.settings = { currency, serviceFee, showWifi, showRating, showPhone, showAddress };
            return db;
        });
        showToast('✅ Tənzimləmələr yadda saxlanıldı!');
    };

    return (
        <div>
            <div className={s.formGrid}>
                <div className={s.card}>
                    <h3 className={s.cardTitle}><i className="fa-solid fa-coins" /> Valyuta & Xidmət</h3>
                    <div className={s.field}>
                        <label>Valyuta simvolu</label>
                        <div className={s.inp}>
                            <select value={currency} onChange={e => setCurrency(e.target.value)} style={{flex:1,background:'none',border:'none',color:'var(--text)',fontFamily:'inherit',fontSize:14,outline:'none'}}>
                                <option value="₼">₼ (AZN)</option>
                                <option value="$">$ (USD)</option>
                                <option value="€">€ (EUR)</option>
                                <option value="₺">₺ (TRY)</option>
                                <option value="₽">₽ (RUB)</option>
                            </select>
                        </div>
                    </div>
                    <div className={s.field}>
                        <label>Servis haqqı (%)</label>
                        <div className={s.inp}><input type="number" min="0" max="30" value={serviceFee} onChange={e => setServiceFee(e.target.value)} /></div>
                    </div>
                </div>

                <div className={s.card}>
                    <h3 className={s.cardTitle}><i className="fa-solid fa-eye" /> Görünüş</h3>
                    <ToggleRow label="WiFi məlumatı göstər" checked={showWifi} onChange={setShowWifi} />
                    <ToggleRow label="Reytinq göstər" checked={showRating} onChange={setShowRating} />
                    <ToggleRow label="Telefon göstər" checked={showPhone} onChange={setShowPhone} />
                    <ToggleRow label="Ünvan göstər" checked={showAddress} onChange={setShowAddress} />
                </div>

                <div className={`${s.card} ${s.span2}`}>
                    <h3 className={s.cardTitle}><i className="fa-solid fa-circle-info" /> Hesab Məlumatları</h3>
                    <div className={s.field}>
                        <label>E-mail</label>
                        <div className={s.inp} style={{opacity:.6}}><i className="fa-solid fa-envelope" style={{color:'var(--muted)',fontSize:14,width:16}} /><input value={ownerEmail || ''} disabled style={{flex:1,background:'none',border:'none',color:'var(--text)',fontFamily:'inherit',fontSize:14}} /></div>
                    </div>
                    <div className={s.field}>
                        <label>Sahibi</label>
                        <div className={s.inp} style={{opacity:.6}}><i className="fa-solid fa-user" style={{color:'var(--muted)',fontSize:14,width:16}} /><input value={db?.owner?.name || ''} disabled style={{flex:1,background:'none',border:'none',color:'var(--text)',fontFamily:'inherit',fontSize:14}} /></div>
                    </div>
                </div>
            </div>
            <div className={s.saveBar}>
                <button className={s.saveBtn} onClick={save}><i className="fa-solid fa-floppy-disk" /> Yadda Saxla</button>
            </div>
        </div>
    );
}

function ToggleRow({ label, checked, onChange }) {
    return (
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
            <span style={{fontSize:14,color:'var(--text)',fontWeight:500}}>{label}</span>
            <button onClick={() => onChange(!checked)} style={{
                width:48,height:26,borderRadius:13,border:'none',cursor:'pointer',position:'relative',
                background: checked ? 'var(--accent)' : 'var(--border)',
                transition:'all .3s ease'
            }}>
                <span style={{
                    position:'absolute',top:3,width:20,height:20,borderRadius:'50%',background:'#fff',
                    left: checked ? 25 : 3, transition:'left .3s cubic-bezier(0.4, 0, 0.2, 1)',boxShadow:'0 2px 5px rgba(0,0,0,0.15)'
                }} />
            </button>
        </div>
    );
}
