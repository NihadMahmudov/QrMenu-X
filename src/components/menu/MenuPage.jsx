import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../hooks/useToast';
import { supabase } from '../../lib/supabase';
import CartSheet from '../cart/CartSheet';
import ItemModal from './ItemModal';
import LanguageSelector from '../shared/LanguageSelector';
import Toast from '../shared/Toast';
import styles from './MenuPage.module.css';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=85';
const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80';

export default function MenuPage({ overrideIsPreview, overrideTab, overrideDb }) {
    const navigate = useNavigate();
    const { db: contextDb, ownerEmail: contextEmail } = useData();
    const { addToCart, setTableNumber, tableNumber } = useCart();
    const { t, lang, setLang } = useLanguage();
    const { message, visible, showToast } = useToast();
    const [searchParams] = useSearchParams();
    const isPreviewMode = overrideIsPreview ?? (searchParams.get('preview') === 'true');
    const previewTab = overrideTab ?? searchParams.get('tab');
    const ownerParam = overrideIsPreview ? null : searchParams.get('owner'); // from QR code

    // Load from Supabase if owner param is in URL
    const [remoteDb, setRemoteDb] = useState(null);
    const [loadingRemote, setLoadingRemote] = useState(false);

    const [showTable, setShowTable] = useState(false);
    const [tableInput, setTableInput] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const searchRef = useRef(null);

    useEffect(() => {
        if (!activeCategory) setActiveCategory('all');
        
        // Auto-set table from URL if present (?table=5)
        const tableParam = searchParams.get('table');
        if (tableParam && !tableNumber) {
            setTableNumber(tableParam);
        }
    }, [activeCategory, searchParams, tableNumber, setTableNumber]);

    useEffect(() => {
        if (!ownerParam) return;
        
        // 1. Check cache first for instant load
        const cacheKey = `menu_cache_${ownerParam}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                setRemoteDb(JSON.parse(cached));
            } catch (e) {
                console.error("Cache parse error", e);
            }
        } else {
            setLoadingRemote(true);
        }

        // 2. Fetch fresh data
        supabase
            .from('menu_data')
            .select('data')
            .ilike('owner_email', ownerParam)
            .single()
            .then(({ data: menuRow, error: menuErr }) => {
                if (menuRow) {
                    setRemoteDb(menuRow.data);
                    // Update cache
                    localStorage.setItem(cacheKey, JSON.stringify(menuRow.data));
                }
                if (menuErr) console.error('Menu fetch error:', menuErr);
            })
            .finally(() => {
                setLoadingRemote(false); // ALWAYS stop the spinner
            });
    }, [ownerParam]);

    // Use remote data if owner param exists, else use logged-in user's data
    const db = overrideDb || (ownerParam ? remoteDb : contextDb);

    // Loading state UI
    if (loadingRemote) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.spinner}></div>
                <p>Menyu yüklənir...</p>
            </div>
        );
    }

    // Check if user has actually configured their menu
    const hasUserContent = db && (db.items?.length > 0 || (db.restaurant?.name && db.restaurant.name.trim() !== ''));



    const DEMO_DB = {
        restaurant: {
            name: "Lounge 99",
            tagline: "Premium ləzzət və unudulmaz anlar.",
            coverUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=85",
            logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
            phone: "+994 50 123 45 67",
            address: "Bakı, Nizami küç. 10",
            hours: "10:00 - 23:00",
            wifi: "Lounge99_Free",
            rating: "4.9"
        },
        categories: [
            { id: 'cat_1', name: 'Şorbalar', emoji: '🍲' },
            { id: 'cat_2', name: 'Qəlyanaltılar', emoji: '🥙' },
            { id: 'cat_3', name: 'Salatlar', emoji: '🥗' },
            { id: 'cat_4', name: 'Kabablar və Manqal', emoji: '🔥' },
            { id: 'cat_5', name: 'Ana Yeməklər', emoji: '🍽️' },
            { id: 'cat_6', name: 'Burger & Fast Food', emoji: '🍔' },
            { id: 'cat_7', name: 'Pizzalar', emoji: '🍕' },
            { id: 'cat_8', name: 'Dəniz Məhsulları', emoji: '🦐' },
            { id: 'cat_9', name: 'Şirniyyatlar', emoji: '🍰' },
            { id: 'cat_10', name: 'İsti İçkilər', emoji: '☕' },
            { id: 'cat_11', name: 'Soyuq İçkilər', emoji: '🍹' },
        ],
        items: [
            // Şorbalar

            { id: 'i2', catId: 'cat_1', name: 'Göbələk Kremi', desc: 'Tərkibi: Təzə şampinyon göbələyi, qaymaq, soğan, kərə yağı, qara istiot, kruton', price: 5.00, imgUrl: 'https://images.unsplash.com/photo-1548943487-a2e4b43b485b?w=600&q=80', badge: '' },
            { id: 'i3', catId: 'cat_1', name: 'Düşbərə', desc: 'Tərkibi: Xırda xəmir içərisində mal əti, bulyon, sirkə-sarımsaq və quru nanə', price: 6.00, imgUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&q=80', badge: '' },

            // Qəlyanaltılar
            { id: 'i4', catId: 'cat_2', name: 'Pendir Tabağı', desc: 'Tərkibi: Qauda, ağ pendir, motal pendiri, qoz, bal, quru meyvələr və kreker', price: 18.00, imgUrl: 'https://images.unsplash.com/photo-1561043433-9265f73e685f?w=600&q=80', badge: 'Şərab üçün' },
            { id: 'i5', catId: 'cat_2', name: 'Humus', desc: 'Tərkibi: Əzilmiş noxud, tahini, zeytun yağı, limon şirəsi, sarımsaq, püstə və isti pidelər', price: 8.00, imgUrl: 'https://images.unsplash.com/photo-1576021182211-9ea8dcb365ef?w=600&q=80', badge: 'Vegan' },
            { id: 'i5_1', catId: 'cat_2', name: 'Brusketta', desc: 'Tərkibi: Qızardılmış çörək dilimləri, təzə pomidor, sarımsaq, reyhan, zeytun yağı', price: 6.00, imgUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80', badge: '' },

            // Salatlar
            { id: 'i6', catId: 'cat_3', name: 'Sezar Salatı Toyuq ilə', desc: 'Tərkibi: Aysberq kahı, qril toyuq filesi, parmezan pendiri, xırtıldayan krutonlar, sezar sousu', price: 12.00, imgUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=80', badge: '🔥 Çox satılan' },
            { id: 'i7', catId: 'cat_3', name: 'Çoban Salatı', desc: 'Tərkibi: Pomidor, xiyar, qırmızı soğan, göyərti, narşərab, zeytun yağı, limon', price: 6.00, imgUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', badge: 'Vegan' },
            { id: 'i8', catId: 'cat_3', name: 'Yunan Salatı', desc: 'Tərkibi: Pomidor, xiyar, qara zeytun, feta pendiri, zeytun yağı, oregano', price: 10.00, imgUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80', badge: '' },

            // Kabablar və Manqal
            { id: 'i9', catId: 'cat_4', name: 'Lülə Kabab', desc: 'Tərkibi: Qoyun əti, quyruq, soğan, duz, istiot, sumaq (lavaşda təqdim olunur)', price: 12.00, imgUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', badge: 'Millətin Seçimi' },
            { id: 'i10', catId: 'cat_4', name: 'Tikə Kabab', desc: 'Tərkibi: Xüsusi marinad edilmiş can əti, soğan həlqələri, narşərab', price: 15.00, imgUrl: 'https://images.unsplash.com/photo-1544025162-811114bd2f25?w=600&q=80', badge: '' },
            { id: 'i11', catId: 'cat_4', name: 'Toyuq Kababı', desc: 'Tərkibi: Sümüklü toyuq əti, xüsusi sous, mayonez, limon', price: 9.00, imgUrl: 'https://images.unsplash.com/photo-1603360946369-pt21e25e135e?w=600&q=80', badge: '' },
            { id: 'i12', catId: 'cat_4', name: 'Quzu Qabırğası', desc: 'Tərkibi: Təzə quzu qabırğası, xüsusi ədviyyatlar, manqalda qızardılmış, tərəvəzlərlə', price: 22.00, imgUrl: 'https://images.unsplash.com/photo-1544025162-811114bd2f25?w=600&q=80', badge: '' },
            { id: 'i12_1', catId: 'cat_4', name: 'Dana Basdırması', desc: 'Tərkibi: Xüsusi ədviyyatlarla basdırılmış dana əti tikələri, manqalda', price: 16.00, imgUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', badge: 'Yeni' },
            { id: 'i12_2', catId: 'cat_4', name: 'Ciyər Kababı', desc: 'Tərkibi: Qoyun ciyəri, quyruq tikələri, duz, istiot, soğan', price: 10.00, imgUrl: 'https://images.unsplash.com/photo-1544025162-811114bd2f25?w=600&q=80', badge: '' },

            // Ana Yeməklər
            { id: 'i13', catId: 'cat_5', name: 'Sac Qovurma', desc: 'Tərkibi: Quzu əti, kartof, badımcan, bibər, pomidor, soğan, lavaş (2-3 nəfərlik)', price: 35.00, imgUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', badge: 'Məsləhət' },
            { id: 'i14', catId: 'cat_5', name: 'Monastırsayağı Toyuq', desc: 'Tərkibi: Toyuq filesi, göbələk, pomidor, motsarella pendiri, mayonez və qarnir', price: 16.00, imgUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&q=80', badge: '' },
            { id: 'i15', catId: 'cat_5', name: 'Stoliçni Filesi', desc: 'Tərkibi: Zərif can əti steyki, qaymaq sousu, göbələk, xardal, kartof püresi', price: 28.00, imgUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80', badge: '' },

            // Burger & Fast Food
            { id: 'i16', catId: 'cat_6', name: 'Klassik Burger', desc: 'Tərkibi: 150q mal əti kotleti, çeddar pendiri, pomidor, kahı, turşu xiyar, xüsusi sous, kartof fri', price: 14.00, imgUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', badge: 'Ac olanlara' },
            { id: 'i17', catId: 'cat_6', name: 'Çiken Burger', desc: 'Tərkibi: Qızardılmış xırtıldayan toyuq filesi, kahı, pomidor, mayonez sousu, kartof fri', price: 11.00, imgUrl: 'https://images.unsplash.com/photo-1615719413546-198b25453f85?w=600&q=80', badge: '' },
            { id: 'i18', catId: 'cat_6', name: 'Toyuq Naggetsləri', desc: 'Tərkibi: 8 ədəd xırtıldayan toyuq hissələri, şirin-turş sous, fri kartof', price: 9.00, imgUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80', badge: '' },

            // Pizzalar
            { id: 'i19', catId: 'cat_7', name: 'Margarita Pizza', desc: 'Tərkibi: Nazik xəmir, xüsusi pomidor sousu, motsarella pendiri, təzə reyhan', price: 15.00, imgUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80', badge: 'Klassika' },
            { id: 'i20', catId: 'cat_7', name: 'Pepperoni Pizza', desc: 'Tərkibi: Pomidor sousu, motsarella, italyan pepperoni kolbasası, oreqano', price: 19.00, imgUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80', badge: '🔥 Acılı' },
            { id: 'i21', catId: 'cat_7', name: 'Qarışıq Pizza', desc: 'Tərkibi: Motsarella, sosiska, toyuq, göbələk, bibər, zeytun, qarğıdalı', price: 21.00, imgUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80', badge: '' },

            // Dəniz Məhsulları
            { id: 'i22', catId: 'cat_8', name: 'Qızılbalıq Steyki', desc: 'Tərkibi: Sobada bişmiş norveç qızılbalığı, qulançar, qaymaqlı limon sousu', price: 32.00, imgUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80', badge: 'Sağlam' },
            { id: 'i23', catId: 'cat_8', name: 'Pələng Krevetkaları', desc: 'Tərkibi: Kərə yağında qızardılmış pələng krevetkaları, sarımsaq, cəfəri, ağ şərab sousu', price: 26.00, imgUrl: 'https://images.unsplash.com/photo-1559742811-822873691fc8?w=600&q=80', badge: '' },
            { id: 'i23_1', catId: 'cat_8', name: 'Qızardılmış Kalmar Halqaları', desc: 'Tərkibi: Xırtıldayan kalmar halqaları, tar-tar sousu və limon', price: 14.00, imgUrl: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&q=80', badge: 'Xırtıldayan' },

            // Şirniyyatlar
            { id: 'i24', catId: 'cat_9', name: 'San Sebastian Çizkeki', desc: 'Tərkibi: İspan üsulu yandırılmış keks forması, pendir, qaymaq, moruq sousu ilə', price: 12.00, imgUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80', badge: 'Yeni' },
            { id: 'i25', catId: 'cat_9', name: 'Tiramisu', desc: 'Tərkibi: Mascarpone pendiri, savoyardi peçenyesi, kofe (espresso), kakao', price: 11.00, imgUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80', badge: '' },
            { id: 'i26', catId: 'cat_9', name: 'Bakı Paxlavası', desc: 'Tərkibi: Qoz, bal, kərə yağı, nazik xəmir qatları, hil, zəfəran şərbəti', price: 8.00, imgUrl: 'https://images.unsplash.com/photo-1616422285623-146b2b7ec992?w=600&q=80', badge: '' },

            // İsti İçkilər
            { id: 'i27', catId: 'cat_10', name: 'Espresso', desc: 'Tərkibi: 100% Arabica tünd qovrulmuş qəhvə dənələri', price: 5.00, imgUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80', badge: '' },
            { id: 'i28', catId: 'cat_10', name: 'Kapuçino', desc: 'Tərkibi: Tək şot espresso, isti süd, bol süd köpüyü, istəyə görə darçın', price: 7.00, imgUrl: 'https://images.unsplash.com/photo-1534687941688-60dcb3707d5e?w=600&q=80', badge: '' },
            { id: 'i29', catId: 'cat_10', name: 'Azərbaycan Çayı (Dəmlik)', desc: 'Tərkibi: Qara kəklikotu/mixəkli çay, mürəbbə (gilənar və ya ağ gilas) və limonla', price: 15.00, imgUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80', badge: 'Dostlarla' },

            // Soyuq İçkilər
            { id: 'i30', catId: 'cat_11', name: 'Mojito (Alkoqolsuz)', desc: 'Tərkibi: Təzə nanə yarpaqları, laym dilimləri, şəkər siropu, qazlı su (Sprite), buz', price: 9.00, imgUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80', badge: '🧊 Sərin' },
            { id: 'i31', catId: 'cat_11', name: 'Ev Limonadı', desc: 'Tərkibi: Təzə sıxılmış limon şirəsi, nanə, şəkər siropu, qazsız su', price: 7.00, imgUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80', badge: '' },
            { id: 'i32', catId: 'cat_11', name: 'Şokoladlı Milkşeyk', desc: 'Tərkibi: Şokoladlı dondurma, süd, şokolad siropu, çırpılmış qaymaq (whipped cream)', price: 8.00, imgUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80', badge: '' },
        ]
    };

    // Only show demo if NO owner is specified AND the user has no content (landing page preview)
    const isDemo = !hasUserContent && !ownerParam;
    const finalDb = hasUserContent ? db : (isDemo ? DEMO_DB : { items: [], categories: [], restaurant: {} });

    const R = finalDb?.restaurant || {};
    const CATS = finalDb?.categories || [];
    const ITEMS = finalDb?.items || [];


    // Categories with "All" added at the start
    const allCategory = { id: 'all', name: t('all'), emoji: '🏠' };
    const activeCats = [allCategory, ...(CATS || []).filter(cat => (ITEMS || []).some(i => i.catId === cat.id))];

    // Helper: Format Social Links
    const getSocialLink = (platform, val) => {
        if (!val) return platform === 'instagram' ? "https://instagram.com" : "https://tiktok.com";
        if (val.startsWith('http')) return val;
        if (platform === 'instagram') return `https://instagram.com/${val.replace('@', '')}`;
        if (platform === 'tiktok') return `https://tiktok.com/@${val.replace('@', '')}`;
        return val;
    };

    // Helper: Format WhatsApp number correctly for the wa.me API
    const getWaLink = (num) => {
        if (!num) return "https://wa.me/";
        let clean = num.replace(/\D/g, ''); // Remove all non-numeric characters
        if (clean.length === 10 && clean.startsWith('0')) {
            clean = '994' + clean.substring(1); // Convert 050... to 99450...
        }
        return `https://wa.me/${clean}`;
    };

    // Search
    const searchResults = searchQuery
        ? ITEMS.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || (i.desc || '').toLowerCase().includes(searchQuery.toLowerCase()))
        : null;

    const handleAddToCart = (item) => {
        addToCart(item.id);
        showToast(`✅ ${t('added_to_cart')}`);
    };

    const confirmTable = () => {
        if (!tableInput || tableInput < 1) { showToast(`⚠️ ${t('invalid_number')}`); return; }
        setTableNumber(tableInput);
        setShowTable(false);
        showToast(`✅ ${t('table')} #${tableInput} ${t('table_selected')}`);
    };

    const filteredItems = (activeCategory === 'all'
        ? ITEMS
        : ITEMS.filter(item => item.catId === activeCategory)) || [];

    return (
        <div className={styles.page}>
            {/* TOP BAR */}
            {!isPreviewMode && (
                <div className={styles.topBar}>
                    <div className={styles.topLeft}>
                        <button onClick={() => navigate(-1)} className={styles.iconBtn} title="Geri"><i className="fa-solid fa-arrow-left" /></button>
                    </div>
                    <div className={styles.topRight}>
                        <button className={styles.iconBtn} onClick={() => { setSearchOpen(p => !p); setTimeout(() => searchRef.current?.focus(), 200); }}>
                            <i className={`fa-solid fa-${searchOpen ? 'xmark' : 'magnifying-glass'}`} />
                        </button>
                        <LanguageSelector />
                        <Link to="/admin" className={styles.loginBtn}>
                            <i className="fa-solid fa-right-to-bracket" />
                            <span>{t('login')}</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* SEARCH BAR */}
            {searchOpen && (
                <div className={styles.searchBar}>
                    <div className={styles.searchWrap}>
                        <i className="fa-solid fa-magnifying-glass" />
                        <input ref={searchRef} type="text" placeholder={t('search_food')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        {searchQuery && <button onClick={() => setSearchQuery('')}><i className="fa-solid fa-xmark" /></button>}
                    </div>
                </div>
            )}

            {/* HERO */}
            {(!isPreviewMode || previewTab === 'restaurant') && (
                <header className={styles.hero}>
                    <div className={styles.heroCover}>
                        <img src={R.coverUrl || FALLBACK_COVER} alt="" className={styles.heroBg} aria-hidden="true" onError={e => e.target.src = FALLBACK_COVER} />
                        <img src={R.coverUrl || FALLBACK_COVER} alt="Cover" className={styles.heroImg} onError={e => e.target.src = FALLBACK_COVER} />
                        <div className={styles.heroOverlay} />
                    </div>
                    <div className={styles.heroContent}>
                        <div className={styles.logoWrap}>
                            {R.logoUrl ? (
                                <img src={R.logoUrl} alt="Logo" onError={e => { e.target.style.display = 'none'; e.target.parentElement.classList.add(styles.logoWithIcon); }} />
                            ) : (
                                <div className={styles.logoIconFallback}>
                                    <i className="fa-solid fa-utensils" />
                                </div>
                            )}
                        </div>
                        <div className={styles.heroWelcome}>
                            <div className={styles.welcomeSmall}>{R.name || 'QR Menyu'}</div>
                            <div className={styles.welcomeLarge}>{R.tagline || t('welcome_tag')}</div>
                        </div>
                        {/* Show socials with fallbacks if empty so they remain visible for demo/preview */}
                        <div className={styles.heroSocials}>
                            <a href={getSocialLink('instagram', R.instagram)} target="_blank" rel="noreferrer" className={styles.socialIcon}><i className="fa-brands fa-instagram" /></a>
                            <a href={getSocialLink('tiktok', R.tiktok)} target="_blank" rel="noreferrer" className={styles.socialIcon}><i className="fa-brands fa-tiktok" /></a>
                            <a href={getWaLink(R.whatsapp)} target="_blank" rel="noreferrer" className={styles.socialIcon}><i className="fa-brands fa-whatsapp" /></a>
                        </div>
                        <div className={styles.heroActions}>
                            {R.phone && <a href={`tel:${R.phone}`} className={styles.actionBtn}><i className="fa-solid fa-phone" /> {t('call')}</a>}
                            {R.address && <a href={`https://maps.google.com?q=${encodeURIComponent(R.address)}`} target="_blank" rel="noreferrer" className={styles.actionBtn}><i className="fa-solid fa-location-dot" /> {t('address')}</a>}
                        </div>
                    </div>
                </header>
            )}

            {/* CATEGORY NAV */}
            {!searchResults && activeCats.length > 0 && (
                <nav className={`${styles.catNav} ${isPreviewMode ? styles.catNavPreview : ''}`}>
                    <ul>
                        {activeCats.map(cat => (
                            <li key={cat.id}>
                                <button className={`${styles.catLink} ${activeCategory === cat.id ? styles.catLinkActive : ''}`} onClick={() => setActiveCategory(cat.id)}>
                                    {cat.emoji} {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* PROMO BANNER */}
            {!isPreviewMode && (isDemo ? (
                <div className={styles.promo} style={{ background: 'linear-gradient(135deg, rgba(255,140,66,.15), rgba(255,200,66,.1))', borderColor: 'rgba(255,140,66,.3)' }}>
                    <i className="fa-solid fa-circle-info" style={{ color: '#FF8C42' }} />
                    <div><strong>{t('demo_mode')}</strong><span>{t('demo_desc')}</span></div>
                    <Link to="/admin" className={styles.promoTag} style={{ background: '#FF8C42', textDecoration: 'none' }}>{t('go_admin')}</Link>
                </div>
            ) : (
                <div className={styles.promo}>
                    <i className="fa-solid fa-fire" />
                    <div><strong>{t('special_info')}</strong><span>{t('service_fee')}</span></div>
                    <span className={styles.promoTag}>{t('info')}</span>
                </div>
            ))}

            {/* MENU */}
            <main className={styles.menu}>
                {ITEMS.length === 0 && (
                    <div className={styles.empty}>
                        <i className="fa-solid fa-utensils" />
                        <p>{t('menu_empty')}</p>
                    </div>
                )}
                {searchResults ? (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>🔍 {t('results')} ({searchResults.length})</span>
                            <div className={styles.sectionLine} />
                        </div>
                        <div className={styles.grid}>
                            {searchResults.map(item => (
                                <ItemCard key={item.id} item={item} onAdd={handleAddToCart} onClick={setSelectedItem} />
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>
                                {activeCategory === 'all'
                                    ? `🏠 ${t('all_foods')}`
                                    : `${activeCats.find(c => c.id === activeCategory)?.emoji || '🍴'} ${activeCats.find(c => c.id === activeCategory)?.name || t('foods')}`
                                }
                                <span style={{ fontSize: '14px', opacity: 0.5, marginLeft: '8px' }}>({filteredItems?.length || 0})</span>
                            </span>
                            <div className={styles.sectionLine} />
                        </div>
                        <div className={styles.grid}>
                            {filteredItems.map(item => (
                                <ItemCard key={item.id} item={item} onAdd={handleAddToCart} onClick={setSelectedItem} />
                            ))}
                        </div>
                    </section>
                )}

                {/* FOOTER */}
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerLogo}>
                            {R.logoUrl ? <img src={R.logoUrl} alt="Logo" /> : <i className="fa-solid fa-utensils" />}
                        </div>
                        <h3>{R.name || 'QR Menyu'}</h3>
                        <p>Bizi sosial şəbəkələrdə izləyin</p>
                        
                        <div className={styles.footerSocials}>
                            <a href={getSocialLink('instagram', R.instagram)} target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram" /></a>
                            <a href={getSocialLink('tiktok', R.tiktok)} target="_blank" rel="noreferrer"><i className="fa-brands fa-tiktok" /></a>
                            <a href={getWaLink(R.whatsapp)} target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp" /></a>
                        </div>
                        <div className={styles.footerCopy}>© {new Date().getFullYear()} Bütün hüquqlar qorunur.</div>
                    </div>
                </footer>
            </main>

            {/* CART */}
            {!isPreviewMode && <CartSheet items={ITEMS} restaurant={R} />}

            {/* MODALS */}

            {showTable && (
                <div className={styles.tableOverlay} onClick={e => e.target === e.currentTarget && setShowTable(false)}>
                    <div className={styles.tableBox}>
                        <div className={styles.tableLogo}><i className="fa-solid fa-chair" /></div>
                        <h2>{t('table_number')}</h2>
                        <p>{t('table_desc')}</p>
                        <div className={styles.tableInput}>
                            <i className="fa-solid fa-hashtag" />
                            <input type="number" placeholder={`${t('eg')} 5`} min="1" max="99" value={tableInput} onChange={e => setTableInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && confirmTable()} />
                        </div>
                        <button className={styles.tableBtn} onClick={confirmTable}>{t('confirm')}</button>
                    </div>
                </div>
            )}
            {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={handleAddToCart} />}
            <Toast message={message} visible={visible} />
        </div>
    );
}

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
                    <div className={styles.priceContainer}>
                        <span className={styles.cardPrice}>{Number(item.price || 0).toFixed(2)}</span>
                        <span className={styles.currency}>AZN</span>
                    </div>
                    <button className={styles.addBtn} onClick={e => { e.stopPropagation(); onAdd(item); }}>
                        <i className="fa-solid fa-plus" />
                    </button>
                </div>
            </div>
        </div>
    );
}
