import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './CartSheet.module.css';

export default function CartSheet({ items, restaurant }) {
    const { cart, changeQty, totalQty, tableNumber } = useCart();
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);

    const keys = Object.keys(cart);
    const subTotal = keys.reduce((s, id) => {
        const item = items.find(i => i.id === id);
        return item ? s + item.price * cart[id] : s;
    }, 0);
    const service = subTotal * 0.1;
    const total = subTotal + service;

    const sendWhatsApp = () => {
        if (!tableNumber) { alert(t('select_table_first')); return; }
        const lines = keys.map(id => {
            const item = items.find(i => i.id === id);
            return item ? `• ${item.name} x${cart[id]} = ${(item.price * cart[id]).toFixed(2)} ₼` : '';
        }).filter(Boolean);
        const msg = encodeURIComponent(`🍽️ ${t('order_table')} #${tableNumber}\n\n${lines.join('\n')}\n\n${t('total_label')}: ${total.toFixed(2)} ₼`);
        window.open(`https://wa.me/${restaurant?.whatsapp || '994554772779'}?text=${msg}`, '_blank');
    };

    return (
        <>
            {/* Floating Button */}
            {totalQty > 0 && (
                <div className={styles.floating} onClick={() => setOpen(true)}>
                    <div className={styles.fleft}>
                        <span className={styles.fbadge}>{totalQty}</span>
                        <span className={styles.flabel}>{t('view_cart')}</span>
                    </div>
                    <span className={styles.ftotal}>{total.toFixed(2)} ₼</span>
                    <i className="fa-solid fa-chevron-right" />
                </div>
            )}

            {/* Overlay */}
            {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

            {/* Sheet */}
            <div className={`${styles.sheet} ${open ? styles.open : ''}`}>
                <div className={styles.dragBar} />
                <div className={styles.header}>
                    <div>
                        <h3>{t('my_order')}</h3>
                        <p className={styles.tableInfo}>{t('table')}: {tableNumber ? `#${tableNumber}` : t('not_selected')}</p>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setOpen(false)}><i className="fa-solid fa-xmark" /></button>
                </div>

                <div className={styles.body}>
                    {keys.length === 0 ? (
                        <div className={styles.empty}><i className="fa-solid fa-basket-shopping" /><p>{t('cart_empty')}</p></div>
                    ) : keys.map(id => {
                        const item = items.find(i => i.id === id);
                        if (!item) return null;
                        return (
                            <div key={id} className={styles.row}>
                                <img src={item.imgUrl} alt={item.name} className={styles.rowImg} onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} />
                                <div className={styles.rowInfo}>
                                    <div className={styles.rowName}>{item.name}</div>
                                    <div className={styles.rowPrice}>{item.price.toFixed(2)} ₼ {t('per_piece')}</div>
                                </div>
                                <div className={styles.qty}>
                                    <button onClick={() => changeQty(id, -1)}><i className="fa-solid fa-minus" /></button>
                                    <span>{cart[id]}</span>
                                    <button onClick={() => changeQty(id, 1)}><i className="fa-solid fa-plus" /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.footer}>
                    <div className={styles.summaryRows}>
                        <div className={styles.summaryRow}><span>{t('subtotal')}</span><span>{subTotal.toFixed(2)} ₼</span></div>
                        <div className={styles.summaryRow}><span>{t('service_fee_title')} (10%)</span><span>{service.toFixed(2)} ₼</span></div>
                        <div className={`${styles.summaryRow} ${styles.total}`}><span>{t('total_label')}</span><span>{total.toFixed(2)} ₼</span></div>
                    </div>
                    <div className={styles.btns}>
                        <button className={styles.waBtn} onClick={sendWhatsApp}><i className="fa-brands fa-whatsapp" /> {t('send_whatsapp')}</button>
                        <button className={styles.bellBtn}><i className="fa-solid fa-bell" /></button>
                    </div>
                </div>
            </div>
        </>
    );
}
