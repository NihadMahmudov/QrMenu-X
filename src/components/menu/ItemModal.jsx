import styles from './ItemModal.module.css';

export default function ItemModal({ item, onClose, onAdd }) {
    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.box}>
                <button className={styles.close} onClick={onClose}><i className="fa-solid fa-xmark" /></button>
                <img src={item.imgUrl} alt={item.name} className={styles.img}
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} />
                <div className={styles.body}>
                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                    <h2 className={styles.name}>{item.name}</h2>
                    <p className={styles.desc}>{item.desc}</p>
                    <div className={styles.price}>{item.price.toFixed(2)} ₼</div>
                    <button className={styles.addBtn} onClick={() => { onAdd(item); onClose(); }}>
                        <i className="fa-solid fa-basket-shopping" /> Səbətə Əlavə Et
                    </button>
                </div>
            </div>
        </div>
    );
}
