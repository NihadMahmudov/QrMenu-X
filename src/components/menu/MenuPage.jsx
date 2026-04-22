import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../hooks/useToast';
import { loadActiveDB } from '../../utils/storage';
import CartSheet from '../cart/CartSheet';
import ItemModal from './ItemModal';
import Toast from '../shared/Toast';
import styles from './MenuPage.module.css';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=85';
const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80';

export default function MenuPage() {
    const { db: contextDb } = useData();
    const { addToCart, setTableNumber, tableNumber } = useCart();
    const { message, visible, showToast } = useToast();

    // Load from active owner's data (or context if available)
    const activeDB = loadActiveDB();
    const db = activeDB || contextDb;

    // If no data at all, show empty state
    if (!db) return (
        <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: 40 }}>
            <div>
                <i className="fa-solid fa-utensils" style={{ fontSize: 64, opacity: 0.15, marginBottom: 24, display: 'block' }} />
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Menyu hazır deyil</h2>
                <p style={{ color: '#888', marginBottom: 24 }}>Admin paneldən hesab yaradın və menyunuzu doldurun.</p>
                <Link to="/admin" style={{ background: 'linear-gradient(135deg,#FF4B3E,#FF8C42)', color: '#fff', padding: '12px 28px', borderRadius: 50, fontWeight: 600, textDecoration: 'none' }}>Admin Panelə Keç</Link>
            </div>
        </div>
    );

    const R = db.restaurant;
    const CATS = db.categories;
    const ITEMS = db.items;


    const [showTable, setShowTable] = useState(false);
    const [tableInput, setTableInput] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const searchRef = useRef(null);

    // Active categories (only those with items)
    const activeCats = CATS.filter(cat => ITEMS.some(i => i.catId === cat.id));

    // Search
    const searchResults = searchQuery
        ? ITEMS.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || (i.desc || '').toLowerCase().includes(searchQuery.toLowerCase()))
        : null;

    // Scroll spy
    useEffect(() => {
        const handler = () => {
            const sections = document.querySelectorAll('[data-section]');
            let current = '';
            sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.dataset.section; });
            setActiveCategory(current);
        };
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const scrollToSection = (catId) => {
        const el = document.querySelector(`[data-section="${catId}"]`);
        if (el) window.scrollTo({ top: el.offsetTop - 110, behavior: 'smooth' });
    };

    const handleAddToCart = (item) => {
        addToCart(item.id);
        showToast('✅ Səbətə əlavə edildi');
    };

    const confirmTable = () => {
        if (!tableInput || tableInput < 1) { showToast('⚠️ Düzgün nömrə daxil edin'); return; }
        setTableNumber(tableInput);
        setShowTable(false);
        showToast(`✅ Masa #${tableInput} seçildi`);
    };

    return (
        <div className={styles.page}>
            {/* TOP BAR */}
            <div className={styles.topBar}>
                <div className={styles.topLeft}>
                    <Link to="/admin" className={styles.iconBtn} title="Admin Panel"><i className="fa-solid fa-sliders" /></Link>
                </div>
                <div className={styles.topRight}>
                    <button className={styles.iconBtn} onClick={() => { setSearchOpen(p => !p); setTimeout(() => searchRef.current?.focus(), 200); }}>
                        <i className={`fa-solid fa-${searchOpen ? 'xmark' : 'magnifying-glass'}`} />
                    </button>
                </div>
            </div>

            {/* SEARCH BAR */}
            {searchOpen && (
                <div className={styles.searchBar}>
                    <div className={styles.searchWrap}>
                        <i className="fa-solid fa-magnifying-glass" />
                        <input ref={searchRef} type="text" placeholder="Yemək axtar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        {searchQuery && <button onClick={() => setSearchQuery('')}><i className="fa-solid fa-xmark" /></button>}
                    </div>
                </div>
            )}

            {/* HERO */}
            <header className={styles.hero}>
                <div className={styles.heroCover}>
                    <img src={R.coverUrl || FALLBACK_COVER} alt="" className={styles.heroBg} aria-hidden="true" onError={e => e.target.src = FALLBACK_COVER} />
                    <img src={R.coverUrl || FALLBACK_COVER} alt="Cover" className={styles.heroImg} onError={e => e.target.src = FALLBACK_COVER} />
                    <div className={styles.heroOverlay} />
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.logoWrap}>
                        <img src={R.logoUrl || FALLBACK_LOGO} alt="Logo" onError={e => e.target.src = FALLBACK_LOGO} />
                    </div>
                    <h1 className={styles.heroName}>{R.name || 'Restoran'}</h1>
                    <p className={styles.heroTagline}>{R.tagline || ''}</p>
                    <div className={styles.badges}>
                        {R.rating && <div className={styles.badge}><i className="fa-solid fa-star" /><span>{R.rating}</span></div>}
                        {R.hours && <div className={styles.badge}><i className="fa-solid fa-clock" /><span>{R.hours}</span></div>}
                        {R.wifi && <div className={styles.badge}><i className="fa-solid fa-wifi" /><span>{R.wifi}</span></div>}
                        <div className={`${styles.badge} ${styles.tableBadge}`} onClick={() => setShowTable(true)}>
                            <i className="fa-solid fa-chair" />
                            <span>{tableNumber ? `Masa #${tableNumber}` : 'Masa seç'}</span>
                        </div>
                    </div>
                    <div className={styles.heroActions}>
                        {R.phone && <a href={`tel:${R.phone}`} className={styles.actionBtn}><i className="fa-solid fa-phone" /> Zəng et</a>}
                        {R.address && <a href={`https://maps.google.com?q=${encodeURIComponent(R.address)}`} target="_blank" rel="noreferrer" className={styles.actionBtn}><i className="fa-solid fa-location-dot" /> Ünvan</a>}
                    </div>
                </div>
            </header>

            {/* CATEGORY NAV */}
            {!searchResults && activeCats.length > 0 && (
                <nav className={styles.catNav}>
                    <ul>
                        {activeCats.map(cat => (
                            <li key={cat.id}>
                                <button className={`${styles.catLink} ${activeCategory === cat.id ? styles.catLinkActive : ''}`} onClick={() => scrollToSection(cat.id)}>
                                    {cat.emoji} {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* PROMO BANNER */}
            <div className={styles.promo}>
                <i className="fa-solid fa-fire" />
                <div><strong>Xüsusi Məlumat</strong><span>Sifarişinizə 10% servis haqqı əlavə edilir</span></div>
                <span className={styles.promoTag}>Məlumat</span>
            </div>

            {/* MENU */}
            <main className={styles.menu}>
                {ITEMS.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
                        <i className="fa-solid fa-utensils" style={{ fontSize: 48, opacity: 0.15, marginBottom: 16, display: 'block' }} />
                        <p>Menyu hələ boşdur</p>
                    </div>
                )}
                {searchResults ? (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>🔍 Nəticələr ({searchResults.length})</span>
                            <div className={styles.sectionLine} />
                        </div>
                        <div className={styles.grid}>
                            {searchResults.map(item => (
                                <ItemCard key={item.id} item={item} onAdd={handleAddToCart} onClick={setSelectedItem} />
                            ))}
                        </div>
                    </section>
                ) : activeCats.map(cat => {
                    const catItems = ITEMS.filter(i => i.catId === cat.id);
                    if (!catItems.length) return null;
                    return (
                        <section key={cat.id} className={styles.section} data-section={cat.id}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>{cat.emoji} {cat.name}</span>
                                <div className={styles.sectionLine} />
                            </div>
                            <div className={styles.grid}>
                                {catItems.map(item => (
                                    <ItemCard key={item.id} item={item} onAdd={handleAddToCart} onClick={setSelectedItem} />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </main>

            {/* CART */}
            <CartSheet items={ITEMS} restaurant={R} />

            {/* MODALS */}

            {showTable && (
                <div className={styles.tableOverlay} onClick={e => e.target === e.currentTarget && setShowTable(false)}>
                    <div className={styles.tableBox}>
                        <div className={styles.tableLogo}><i className="fa-solid fa-chair" /></div>
                        <h2>Masa Nömrəniz</h2>
                        <p>Sifarişin doğru yerə çatması üçün</p>
                        <div className={styles.tableInput}>
                            <i className="fa-solid fa-hashtag" />
                            <input type="number" placeholder="məs: 5" min="1" max="99" value={tableInput} onChange={e => setTableInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && confirmTable()} />
                        </div>
                        <button className={styles.tableBtn} onClick={confirmTable}>Təsdiqlə</button>
                    </div>
                </div>
            )}
            {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={handleAddToCart} />}
            <Toast message={message} visible={visible} />
        </div>
    );
}

// Item Card — NO FAVORITE ICON
function ItemCard({ item, onAdd, onClick }) {
    return (
        <div className={styles.card} onClick={() => onClick(item)}>
            {item.badge && <div className={styles.badge2}>{item.badge}</div>}
            <div className={styles.imgWrap}>
                <img src={item.imgUrl} alt={item.name} loading="lazy" onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} />
            </div>
            <div className={styles.cardBody}>
                <div className={styles.cardName}>{item.name}</div>
                <div className={styles.cardDesc}>{item.desc}</div>
                <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>{item.price.toFixed(2)} ₼</span>
                    <button className={styles.addBtn} onClick={e => { e.stopPropagation(); onAdd(item); }}>
                        <i className="fa-solid fa-plus" />
                    </button>
                </div>
            </div>
        </div>
    );
}
