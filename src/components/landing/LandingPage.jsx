import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        const getDelay = (step) => {
            if (step === 3) return 8000;
            return 5000;
        };

        const timer = setTimeout(() => {
            setActiveStep(current => (current % 3) + 1);
        }, getDelay(activeStep));

        return () => clearTimeout(timer);
    }, [activeStep]);

    return (
        <div className={styles.landing}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <img src="/logo.png" alt="QR Menyu Logo" className={styles.logoImg} />
                    <span>QR Menyu</span>
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
                    <h1 className={styles.title}>Rəqəmsal Menyu ilə<br />Müştəri Təcrübəsini <span className={styles.highlight}>Yeniləyin</span></h1>
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
                            <div className={styles.mockupTitleWrap}>
                                <div className={styles.mockupTitleSmall}>QR Menyu'ya</div>
                                <div className={styles.mockupTitleLarge}>Xoş Gəldiniz!</div>
                            </div>
                            <div className={styles.mockupCircle}>
                                <img src="/logo.png" alt="Logo" />
                            </div>
                        </div>
                        <div className={styles.mockupBody}>

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

                <div className={styles.howContent}>
                    <div className={styles.processVisual}>
                        <div className={styles.processAnimationContainer}>
                            <div className={styles.animMockup}>
                                <div className={styles.mockupNotch}></div>
                                <div className={styles.animMockupScreen}>
                                    {/* Registration Stage */}
                                    <div className={`${styles.stage} ${activeStep === 1 ? styles.stageActive : ''}`}>
                                        <div className={styles.mockupHeaderLogo}>
                                            <i className="fa-solid fa-qrcode" /> QR Menyu
                                        </div>
                                        <div className={styles.stageContent}>
                                            <div className={styles.mockInp}>
                                                <span className={styles.typingText1}>Baku Steak House</span>
                                                <div className={styles.cursor}></div>
                                            </div>
                                            <div className={styles.mockInp}>
                                                <span className={styles.typingText2}>info@bakusteak.az</span>
                                                <div className={styles.cursor}></div>
                                            </div>
                                            <div className={styles.mockBtn}>Hesab Yarat</div>
                                            <div className={styles.checkWrap}>
                                                <i className={`fa-solid fa-circle-check ${styles.checkIcon}`} />
                                                <span>Uğurlu!</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Menu Creation Stage */}
                                    <div className={`${styles.stage} ${activeStep === 2 ? styles.stageActive : ''}`}>
                                        <div className={styles.mockupHeaderLogo}>
                                            <i className="fa-solid fa-qrcode" /> QR Menyu
                                        </div>
                                        <div className={styles.mockupProfile}>
                                            <div className={styles.mockupAvatar}>🥩</div>
                                            <div className={styles.mockupProfileInfo}>
                                                <b>Baku Steak House</b>
                                                <span>İdarəetmə Paneli</span>
                                            </div>
                                        </div>
                                        <div className={styles.stageContent}>
                                            <div className={styles.mockItemCard}>
                                                <div className={styles.mockItemImg}>🍕</div>
                                                <div className={styles.mockItemText}><b>Margarita Pizza</b><span>12.00 ₼</span></div>
                                            </div>
                                            <div className={styles.mockItemCard}>
                                                <div className={styles.mockItemImg}>🍔</div>
                                                <div className={styles.mockItemText}><b>Classic Burger</b><span>9.50 ₼</span></div>
                                            </div>
                                            <div className={styles.mockItemCard}>
                                                <div className={styles.mockItemImg}>🥗</div>
                                                <div className={styles.mockItemText}><b>Sezar Salatı</b><span>8.00 ₼</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Scanning Stage */}
                                    <div className={`${styles.stage} ${activeStep === 3 ? styles.stageActive : ''}`}>
                                        <div className={styles.stageContent}>
                                            <div className={styles.qrBox}>
                                                <i className="fa-solid fa-qrcode" />
                                                <div className={styles.scanLine}></div>
                                            </div>
                                            <div className={styles.scanSuccess}>
                                                <div className={styles.successBadge}>Müştəri Baxışı</div>
                                                <div className={styles.miniMenu}>
                                                    <div className={styles.miniScrollList}>
                                                        <div className={styles.miniItemCard}><div className={styles.miniImg}>🍔</div><div className={styles.miniInfo}><div className={styles.miniTitle}>Burger</div><div className={styles.miniPrice}>9.50 ₼</div></div></div>
                                                        <div className={styles.miniItemCard}><div className={styles.miniImg}>🍕</div><div className={styles.miniInfo}><div className={styles.miniTitle}>Pizza</div><div className={styles.miniPrice}>12.00 ₼</div></div></div>
                                                        <div className={styles.miniItemCard}><div className={styles.miniImg}>🥗</div><div className={styles.miniInfo}><div className={styles.miniTitle}>Salat</div><div className={styles.miniPrice}>8.00 ₼</div></div></div>
                                                        <div className={styles.miniItemCard}><div className={styles.miniImg}>🍟</div><div className={styles.miniInfo}><div className={styles.miniTitle}>Fri</div><div className={styles.miniPrice}>4.50 ₼</div></div></div>
                                                        <div className={styles.miniItemCard}><div className={styles.miniImg}>🥤</div><div className={styles.miniInfo}><div className={styles.miniTitle}>Cola</div><div className={styles.miniPrice}>3.00 ₼</div></div></div>
                                                        <div className={styles.miniItemCard}><div className={styles.miniImg}>🍰</div><div className={styles.miniInfo}><div className={styles.miniTitle}>Şirniyyat</div><div className={styles.miniPrice}>7.00 ₼</div></div></div>
                                                        <div className={styles.miniItemCard}><div className={styles.miniImg}>☕</div><div className={styles.miniInfo}><div className={styles.miniTitle}>Kofe</div><div className={styles.miniPrice}>5.50 ₼</div></div></div>
                                                        {/* Duplicate for seamless loop */}
                                                        <div className={styles.miniItemCard}><div className={styles.miniImg}>🍔</div><div className={styles.miniInfo}><div className={styles.miniTitle}>Burger</div><div className={styles.miniPrice}>9.50 ₼</div></div></div>
                                                        <div className={styles.miniItemCard}><div className={styles.miniImg}>🍕</div><div className={styles.miniInfo}><div className={styles.miniTitle}>Pizza</div><div className={styles.miniPrice}>12.00 ₼</div></div></div>
                                                    </div>
                                                    <div className={styles.scrollTouch}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.stepProgressContainer}>
                            <div className={`${styles.progressBar} ${activeStep === 1 ? styles.progressActive : ''}`} style={{ '--dur': '5s' }}></div>
                            <div className={`${styles.progressBar} ${activeStep === 2 ? styles.progressActive : ''}`} style={{ '--dur': '5s' }}></div>
                            <div className={`${styles.progressBar} ${activeStep === 3 ? styles.progressActive : ''}`} style={{ '--dur': '8s' }}></div>
                        </div>
                    </div>

                    <div className={styles.stepRows}>
                        {/* Step 1 Row */}
                        <div className={styles.stepRow}>
                            <div className={`${styles.stepCard} ${activeStep === 1 ? styles.stepActive : ''}`} onClick={() => setActiveStep(1)}>
                                <div className={styles.stepNum}>1</div>
                                <div className={styles.stepText}>
                                    <h3>Qeydiyyatdan Keçin</h3>
                                    <p>Saniyələr içində hesabınızı yaradın və restoran məlumatlarını daxil edin.</p>
                                </div>
                            </div>
                            <div className={styles.indicatorWrap}>
                                <div className={`${styles.processStep} ${activeStep === 1 ? styles.stepIconActive : ''}`} onClick={() => setActiveStep(1)}>
                                    <div className={styles.stepIcon}><i className="fa-solid fa-user-plus" /></div>
                                    <div className={styles.stepLabel}>Qeydiyyat</div>
                                </div>
                                <div className={styles.processLineVertical}></div>
                            </div>
                        </div>

                        {/* Step 2 Row */}
                        <div className={styles.stepRow}>
                            <div className={`${styles.stepCard} ${activeStep === 2 ? styles.stepActive : ''}`} onClick={() => setActiveStep(2)}>
                                <div className={styles.stepNum}>2</div>
                                <div className={styles.stepText}>
                                    <h3>Menyunuzu Yaradın</h3>
                                    <p>Yeməkləri, şəkilləri və qiymətləri asanlıqla panelimizdən əlavə edin.</p>
                                </div>
                            </div>
                            <div className={styles.indicatorWrap}>
                                <div className={`${styles.processStep} ${activeStep === 2 ? styles.stepIconActive : ''}`} onClick={() => setActiveStep(2)}>
                                    <div className={styles.stepIcon}><i className="fa-solid fa-utensils" /></div>
                                    <div className={styles.stepLabel}>Menyu</div>
                                </div>
                                <div className={styles.processLineVertical}></div>
                            </div>
                        </div>

                        {/* Step 3 Row */}
                        <div className={styles.stepRow}>
                            <div className={`${styles.stepCard} ${activeStep === 3 ? styles.stepActive : ''}`} onClick={() => setActiveStep(3)}>
                                <div className={styles.stepNum}>3</div>
                                <div className={styles.stepText}>
                                    <h3>QR Kodunuzu Paylaşın</h3>
                                    <p>QR kodunuzu masalara yerləşdirin, müştərilər menyunu anında görsün.</p>
                                </div>
                            </div>
                            <div className={styles.indicatorWrap}>
                                <div className={`${styles.processStep} ${activeStep === 3 ? styles.stepIconActive : ''}`} onClick={() => setActiveStep(3)}>
                                    <div className={styles.stepIcon}><i className="fa-solid fa-qrcode" /></div>
                                    <div className={styles.stepLabel}>Skan</div>
                                </div>
                            </div>
                        </div>
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
                        <div className={styles.logo}>
                            <img src="/logo.png" alt="Logo" className={styles.logoImg} />
                            <span>QR Menyu</span>
                        </div>
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
