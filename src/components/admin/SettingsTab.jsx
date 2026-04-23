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
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
            <span style={{fontSize:14,color:'var(--text)'}}>{label}</span>
            <button onClick={() => onChange(!checked)} style={{
                width:44,height:24,borderRadius:12,border:'none',cursor:'pointer',position:'relative',
                background: checked ? 'linear-gradient(135deg,#7c5cfc,#9b7bff)' : 'var(--card2)',
                transition:'all .2s ease'
            }}>
                <span style={{
                    position:'absolute',top:3,width:18,height:18,borderRadius:'50%',background:'#fff',
                    left: checked ? 23 : 3, transition:'left .2s ease',boxShadow:'0 1px 4px rgba(0,0,0,.3)'
                }} />
            </button>
        </div>
    );
}
