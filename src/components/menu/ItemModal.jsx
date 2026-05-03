import { useMemo } from 'react';
import styles from './ItemModal.module.css';

export default function ItemModal({ item, onClose, onAdd }) {
    const ingredients = useMemo(() => {
        if (!item.desc) return [];
        const parts = item.desc.split(/[:;,.]/);
        return parts
            .map(p => p.trim())
            .filter(p => p.length > 2 && !p.toLowerCase().includes('tərkibi'));
    }, [item.desc]);

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.box}>
                <button className={styles.close} onClick={onClose}><i className="fa-solid fa-xmark" /></button>
                
                <div className={styles.imageSection}>
                    <img 
                        src={item.imgUrl} 
                        alt={item.name} 
                        className={styles.mainImg}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} 
                    />
                    <div className={styles.imgGradient}></div>
                </div>

                <div className={styles.body}>
                    <div className={styles.headerRow}>
                        {item.badge && <span className={styles.badge}>{item.badge}</span>}
                    </div>
                    <h2 className={styles.name}>{item.name}</h2>
                    <p className={styles.desc}>{item.desc}</p>
                    <div className={styles.footer}>
                        <div className={styles.price}>{item.price.toFixed(2)} <span>₼</span></div>
                        <button className={styles.addBtn} onClick={() => { onAdd(item); onClose(); }}>
                            <i className="fa-solid fa-basket-shopping" /> Səbətə Əlavə Et
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
