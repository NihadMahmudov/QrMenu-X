import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className={styles.landing}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <i className="fa-solid fa-qrcode" /> QR Menyu
                </div>
                <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
                    <i className={`fa-solid fa-${menuOpen ? 'xmark' : 'bars'}`} />
                </button>
                <div className={`${styles.navLinks} ${menuOpen ? styles.navActive : ''}`}>
                    <a href="#features" onClick={() => setMenuOpen(false)}>Üstünlüklər</a>
                    <a href="#how" onClick={() => setMenuOpen(false)}>Necə İşləyir?</a>
                    <a href="#pricing" onClick={() => setMenuOpen(false)}>Tariflər</a>
                    <Link to="/menu" className={styles.navDemo}>Nümunə Menyu</Link>
                    <Link to="/admin" className={styles.navAdmin}>Daxil Ol</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroGlow}></div>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>🚀 Restoranınız üçün Rəqəmsal Gələcək</div>
                    <h1 className={styles.title}>Rəqəmsal Menyu ilə<br/>Müştəri Təcrübəsini <span className={styles.highlight}>Yeniləyin</span></h1>
                    <p className={styles.subtitle}>
                        Müştəriləriniz mobil telefonlarından saniyələr içində menyunuza daxil olsun. 
                        Kağız menyu xərclərinə son qoyun və restoranınızı bir addım öndə aparın.
                    </p>
                    <div className={styles.heroActions}>
                        <Link to="/admin" className={styles.primaryBtn}>
                            İndi Başlayın <i className="fa-solid fa-bolt" />
                        </Link>
                        <Link to="/menu" className={styles.secondaryBtn}>
                            <i className="fa-solid fa-mobile-screen" /> Demo Menyuya Bax
                        </Link>
                    </div>
                </div>

                {/* Floating Mockup */}
                <div className={styles.heroImageWrap}>
                    <div className={styles.mockup}>
                         <div className={styles.mockupHeader}>
                             <div className={styles.mockupCircle}></div>
                         </div>
                         <div className={styles.mockupBody}>
                             <div className={styles.mockupBar}></div>
                             <div className={styles.mockupItem}></div>
                             <div className={styles.mockupItem}></div>
                             <div className={styles.mockupItem}></div>
                         </div>
                    </div>
                    <div className={styles.floatingCard}>
                        <i className="fa-solid fa-check-circle" />
                        <span>Sürətli Sifariş</span>
                    </div>
                    <div className={`${styles.floatingCard} ${styles.cardLower}`}>
                        <i className="fa-solid fa-shield-halved" />
                        <span>Təhlükəsiz Ödəniş</span>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <div className={styles.statIcon}><i className="fa-solid fa-shop" /></div>
                        <h3>120+</h3>
                        <p>Aktiv Restoran</p>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statIcon}><i className="fa-solid fa-users" /></div>
                        <h3>50K+</h3>
                        <p>Aylıq İstifadəçi</p>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statIcon}><i className="fa-solid fa-star" /></div>
                        <h3>4.9/5</h3>
                        <p>Müştəri Razılığı</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how" className={styles.howItWorks}>
                <h2 className={styles.sectionTitle}>Necə İşləyir?</h2>
                <div className={styles.stepsGrid}>
                    <div className={styles.stepCard}>
                        <div className={styles.stepNum}>1</div>
                        <h3>Menyunuzu Yaradın</h3>
                        <p>Yeməkləri, şəkilləri və qiymətləri asanlıqla panelimizdən əlavə edin.</p>
                    </div>
                    <div className={styles.stepCard}>
                        <div className={styles.stepNum}>2</div>
                        <h3>QR Kodunuzu Alın</h3>
                        <p>Restoranınıza uyğun xüsusi QR kodu dizayn edin və yükləyin.</p>
                    </div>
                    <div className={styles.stepCard}>
                        <div className={styles.stepNum}>3</div>
                        <h3>Müştəriləriniz Skan etsin</h3>
                        <p>Müştərilər kameranı yaxınlaşdıraraq anında menyunu görsünlər.</p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className={styles.features}>
                <div className={styles.featuresHeader}>
                    <h2 className={styles.sectionTitle}>Niyə Bizim Platforma?</h2>
                    <p>Ən müasir funksionallıqları bir yerdə topladıq</p>
                </div>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureItem}>
                        <i className="fa-solid fa-wand-magic-sparkles" />
                        <h4>Fərqli QR Dizaynları</h4>
                        <p>8 fərqli dizayn və limitsiz rəng seçimləri ilə öz QR kodunuzu yaradın.</p>
                    </div>
                    <div className={styles.featureItem}>
                        <i className="fa-solid fa-language" />
                        <h4>Çoxdilli Dəstək</h4>
                        <p>Müştəriləriniz üçün menyunu fərqli dillərdə təqdim etmək imkanı.</p>
                    </div>
                    <div className={styles.featureItem}>
                        <i className="fa-solid fa-clock-rotate-left" />
                        <h4>Real Vaxt Yenilənmə</h4>
                        <p>Qiymət və ya məhsul dəyişikliyi saniyələr içində tətbiq olunur.</p>
                    </div>
                    <div className={styles.featureItem}>
                        <i className="fa-solid fa-mobile-button" />
                        <h4>Mobil Proqram Lazım Deyil</h4>
                        <p>Müştərilər heç bir tətbiq yükləmədən birbaşa brauzerdən istifadə edir.</p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className={styles.pricing}>
                <h2 className={styles.sectionTitle}>Sadə və Şəffaf Qiymətlər</h2>
                <div className={styles.pricingGrid}>
                    <div className={styles.pricingCard}>
                        <div className={styles.priceHeader}>
                            <h3>Pulsuz</h3>
                            <div className={styles.price}>0 ₼ <span>/ay</span></div>
                        </div>
                        <ul className={styles.priceList}>
                            <li><i className="fa-solid fa-check" /> 50 məhsul limiti</li>
                            <li><i className="fa-solid fa-check" /> Standart QR dizayn</li>
                            <li><i className="fa-solid fa-check" /> Limitsiz baxış</li>
                            <li className={styles.disabled}><i className="fa-solid fa-xmark" /> Prioritet dəstək</li>
                        </ul>
                        <Link to="/admin" className={styles.priceBtn}>İndi Başla</Link>
                    </div>
                    <div className={`${styles.pricingCard} ${styles.pricingPro}`}>
                        <div className={styles.proBadge}>Ən Çox Seçilən</div>
                        <div className={styles.priceHeader}>
                            <h3>Aylıq Abunə</h3>
                            <div className={styles.price}>29 ₼ <span>/ay</span></div>
                        </div>
                        <ul className={styles.priceList}>
                            <li><i className="fa-solid fa-check" /> Limitsiz məhsul</li>
                            <li><i className="fa-solid fa-check" /> Premium QR dizaynları</li>
                            <li><i className="fa-solid fa-check" /> Şəkil optimizasiyası</li>
                            <li><i className="fa-solid fa-check" /> 24/7 Prioritet dəstək</li>
                        </ul>
                        <Link to="/admin" className={styles.priceBtnPro}>Premium-a Keç</Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className={styles.ctaContent}>
                    <h2>Bizimlə Başlamağa Hazırsınız?</h2>
                    <p>Bir neçə dəqiqə içində restoranınızı rəqəmsallaşdırın.</p>
                    <div className={styles.ctaActions}>
                        <Link to="/admin" className={styles.primaryBtn}>Qeydiyyatdan Keç</Link>
                        <a href="https://wa.me/994554772779" target="_blank" className={styles.whatsappBtn}>
                            <i className="fa-brands fa-whatsapp" /> WhatsApp ilə əlaqə
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerTop}>
                    <div className={styles.footerBrand}>
                        <div className={styles.logo}><i className="fa-solid fa-qrcode" /> QR Menyu</div>
                        <p>Restoranlar üçün ən yaxşı rəqəmsal həll yolu.</p>
                    </div>
                    <div className={styles.footerLinks}>
                        <div className={styles.linkGroup}>
                            <h5>Platforma</h5>
                            <a href="#features">Üstünlüklər</a>
                            <a href="#how">Necə işləyir?</a>
                            <a href="#pricing">Tariflər</a>
                        </div>
                        <div className={styles.linkGroup}>
                            <h5>Dəstək</h5>
                            <a href="#">Məxfilik siyasəti</a>
                            <a href="#">İstifadə şərtləri</a>
                            <a href="#">Bizimlə əlaqə</a>
                        </div>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>© 2026 QR Menyu AZ. Bütün hüquqlar qorunur.</p>
                    <div className={styles.socials}>
                        <a href="#"><i className="fa-brands fa-instagram" /></a>
                        <a href="#"><i className="fa-brands fa-facebook" /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
