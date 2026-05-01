import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './CartSheet.module.css';

export default function CartSheet({ items, restaurant }) {
    const { cart, changeQty, totalQty, tableNumber, setTableNumber } = useCart();
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const [showTableInput, setShowTableInput] = useState(false);
    const [tempTable, setTempTable] = useState('');

    const keys = Object.keys(cart);
    const subTotal = keys.reduce((s, id) => {
        const item = items.find(i => i.id === id);
        return s + (item ? item.price * cart[id] : 0);
    }, 0);
    const total = subTotal;

    // Helper: Format WhatsApp number correctly for the wa.me API
    const getWaLink = (num) => {
        const base = num || '994554772779';
        let clean = base.replace(/\D/g, ''); // Remove all non-numeric characters
        if (clean.length === 10 && clean.startsWith('0')) {
            clean = '994' + clean.substring(1); // Convert 050... to 99450...
        }
        return `https://wa.me/${clean}`;
    };

    const sendWhatsApp = (forcedTable = null) => {
        const finalTable = forcedTable || tableNumber;
        if (!finalTable) {
            setShowTableInput(true);
            return;
        }
        const lines = keys.map(id => {
            const item = items.find(i => i.id === id);
            return item ? `• ${item.name} x${cart[id]} = ${(item.price * cart[id]).toFixed(2)} ₼` : '';
        }).filter(Boolean);
        const msg = encodeURIComponent(`*${t('order_table')} #${finalTable}*\n\n${lines.join('\n')}\n\n*${t('total_label')}: ${total.toFixed(2)} ₼*`);
        window.open(`${getWaLink(restaurant?.whatsapp)}?text=${msg}`, '_blank');
    };

    const handleConfirmTable = () => {
        if (!tempTable) return;
        setTableNumber(tempTable);
        setShowTableInput(false);
        sendWhatsApp(tempTable); // Send immediately after selecting table
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                        <div className={styles.tableCircle} onClick={() => setShowTableInput(true)}>
                            <i className="fa-solid fa-chair" />
                            {tableNumber && <span className={styles.tableBadge}>{tableNumber}</span>}
                        </div>
                        <div>
                            <h3>{t('my_order')}</h3>
                            <p className={styles.tableInfo}>
                                {t('table')}: {tableNumber ? <strong>#{tableNumber}</strong> : t('not_selected')}
                                <button className={styles.selectBtn} onClick={() => setShowTableInput(true)}>
                                    {tableNumber ? `(${t('change') || 'dəyiş'})` : t('select_table')}
                                </button>
                            </p>
                        </div>
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
                        <div className={styles.summaryItem} style={{ borderTop: '2px dashed var(--border)', paddingTop: '15px', marginTop: '10px' }}>
                            <span style={{ fontWeight: '800', fontSize: '18px' }}>{t('total_label')}</span>
                            <span style={{ fontWeight: '900', fontSize: '22px', color: 'var(--primary)' }}>{total.toFixed(2)} ₼</span>
                        </div>
                    <div className={styles.btns}>
                        <button className={styles.waBtn} onClick={sendWhatsApp}><i className="fa-brands fa-whatsapp" /> {t('send_whatsapp')}</button>
                        <button className={styles.bellBtn}><i className="fa-solid fa-bell" /></button>
                    </div>
                </div>
            </div>

            {/* Table Selection Modal */}
            {showTableInput && (
                <div className={styles.tableModalOverlay}>
                    <div className={styles.tableModal}>
                        <div className={styles.tableIcon}><i className="fa-solid fa-chair" /></div>
                        <h2>{t('table_number')}</h2>
                        <p>{t('table_desc')}</p>
                        <div className={styles.tableField}>
                            <input
                                type="number"
                                placeholder="#"
                                value={tempTable}
                                onChange={e => setTempTable(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleConfirmTable()}
                                autoFocus
                            />
                        </div>
                        <button className={styles.confirmBtn} onClick={handleConfirmTable}>{t('confirm')}</button>
                        <button className={styles.cancelBtn} onClick={() => setShowTableInput(false)}>{t('back')}</button>
                    </div>
                </div>
            )}
        </>
    );
}
