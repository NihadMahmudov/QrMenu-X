import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../shared/LanguageSelector';
import SettingsSelector from '../shared/SettingsSelector';
import styles from './LandingPage.module.css';

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const { t } = useLanguage();

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
                    <img src="/logo.png" alt="Logo" className={styles.logoImg} />
                    <span>{t('brand_name')}</span>
                </div>
                <div className={styles.navLinks}>
                    <a href="#features">{t('features')}</a>
                    <a href="#how">{t('how_it_works')}</a>
                    <a href="#pricing">{t('pricing')}</a>
                    <LanguageSelector />
                    <SettingsSelector />
                    <Link to="/admin" className={styles.navAdmin}>{t('nav_login')}</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroGlow}></div>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>{t('hero_badge')}</div>
                    <h1 className={styles.title}>{t('hero_title_1')}<br />{t('hero_title_2')} <span className={styles.highlight}>{t('hero_title_highlight')}</span></h1>
                    <p className={styles.subtitle}>
                        {t('hero_subtitle')}
                    </p>
                    <div className={styles.heroActions}>
                        <Link to="/admin" className={styles.primaryBtn}>
                            {t('start_now')} <i className="fa-solid fa-bolt" />
                        </Link>
                        <Link to="/menu" className={styles.secondaryBtn}>
                            <i className="fa-solid fa-mobile-screen" /> {t('view_demo')}
                        </Link>
                    </div>
                </div>

                {/* Floating Mockup */}
                <div className={styles.heroImageWrap}>
                    <div className={styles.mockup}>
                        <div className={styles.mockupHeader}>
                            <div className={styles.mockupTitleWrap}>
                                <div className={styles.mockupTitleSmall}>{t('mockup_qr')}</div>
                                <div className={styles.mockupTitleLarge}>{t('welcome_tag')}</div>
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
                        <span>{t('fast_order')}</span>
                    </div>
                    <div className={`${styles.floatingCard} ${styles.cardLower}`}>
                        <i className="fa-solid fa-shield-halved" />
                        <span>{t('safe_payment')}</span>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <div className={styles.statIcon}><i className="fa-solid fa-shop" /></div>
                        <h3>120+</h3>
                        <p>{t('stat_1_label')}</p>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statIcon}><i className="fa-solid fa-users" /></div>
                        <h3>50K+</h3>
                        <p>{t('stat_2_label')}</p>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statIcon}><i className="fa-solid fa-star" /></div>
                        <h3>4.9/5</h3>
                        <p>{t('stat_3_label')}</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how" className={styles.howItWorks}>
                <h2 className={styles.sectionTitle}>{t('how_it_works')}</h2>

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
                                            <div className={styles.mockBtn}>{t('create_account')}</div>
                                            <div className={styles.checkWrap}>
                                                <i className={`fa-solid fa-circle-check ${styles.checkIcon}`} />
                                                <span>{t('success')}</span>
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
                                                <span>{t('dashboard')}</span>
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
                                    <div className={`${styles.stage} ${styles.stageNoHeader} ${activeStep === 3 ? styles.stageActive : ''}`}>
                                        <div className={styles.stageContent}>
                                            <div className={styles.qrBox}>
                                                <i className="fa-solid fa-qrcode" />
                                                <div className={styles.scanLine}></div>
                                            </div>
                                            <div className={styles.scanSuccess}>
                                                <div className={styles.successBadge}>{t('customer_view')}</div>
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
                                    <h3>{t('step_1_title')}</h3>
                                    <p>{t('step_1_desc')}</p>
                                </div>
                            </div>
                            <div className={styles.indicatorWrap}>
                                <div className={`${styles.processStep} ${activeStep === 1 ? styles.stepIconActive : ''}`} onClick={() => setActiveStep(1)}>
                                    <div className={styles.stepIcon}><i className="fa-solid fa-user-plus" /></div>
                                    <div className={styles.stepLabel}>{t('register')}</div>
                                </div>
                                <div className={styles.processLineVertical}></div>
                            </div>
                        </div>

                        {/* Step 2 Row */}
                        <div className={styles.stepRow}>
                            <div className={`${styles.stepCard} ${activeStep === 2 ? styles.stepActive : ''}`} onClick={() => setActiveStep(2)}>
                                <div className={styles.stepNum}>2</div>
                                <div className={styles.stepText}>
                                    <h3>{t('step_2_title')}</h3>
                                    <p>{t('step_2_desc')}</p>
                                </div>
                            </div>
                            <div className={styles.indicatorWrap}>
                                <div className={`${styles.processStep} ${activeStep === 2 ? styles.stepIconActive : ''}`} onClick={() => setActiveStep(2)}>
                                    <div className={styles.stepIcon}><i className="fa-solid fa-utensils" /></div>
                                    <div className={styles.stepLabel}>{t('menu')}</div>
                                </div>
                                <div className={styles.processLineVertical}></div>
                            </div>
                        </div>

                        {/* Step 3 Row */}
                        <div className={styles.stepRow}>
                            <div className={`${styles.stepCard} ${activeStep === 3 ? styles.stepActive : ''}`} onClick={() => setActiveStep(3)}>
                                <div className={styles.stepNum}>3</div>
                                <div className={styles.stepText}>
                                    <h3>{t('step_3_title')}</h3>
                                    <p>{t('step_3_desc')}</p>
                                </div>
                            </div>
                            <div className={styles.indicatorWrap}>
                                <div className={`${styles.processStep} ${activeStep === 3 ? styles.stepIconActive : ''}`} onClick={() => setActiveStep(3)}>
                                    <div className={styles.stepIcon}><i className="fa-solid fa-qrcode" /></div>
                                    <div className={styles.stepLabel}>{t('scan')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className={styles.features}>
                <div className={styles.featuresHeader}>
                    <h2 className={styles.sectionTitle}>{t('why_us')}</h2>
                    <p>{t('why_us_desc')}</p>
                </div>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureItem}>
                        <i className="fa-solid fa-wand-magic-sparkles" />
                        <h4>{t('feature_1_title')}</h4>
                        <p>{t('feature_1_desc')}</p>
                    </div>
                    <div className={styles.featureItem}>
                        <i className="fa-solid fa-language" />
                        <h4>{t('feature_2_title')}</h4>
                        <p>{t('feature_2_desc')}</p>
                    </div>
                    <div className={styles.featureItem}>
                        <i className="fa-solid fa-clock-rotate-left" />
                        <h4>{t('feature_3_title')}</h4>
                        <p>{t('feature_3_desc')}</p>
                    </div>
                    <div className={styles.featureItem}>
                        <i className="fa-solid fa-mobile-button" />
                        <h4>{t('feature_4_title')}</h4>
                        <p>{t('feature_4_desc')}</p>
                    </div>
                </div>
            </section>

            {/* Testimonials / What Owners Say */}
            <section className={styles.testimonials}>
                <div className={styles.testiHeader}>
                    <h2 className={styles.testiTitle}>{t('testi_title')}</h2>
                    <p>{t('testi_desc')}</p>
                </div>
                
                <div className={styles.testiScrollWrap}>
                    <div className={styles.testiGrid}>
                        {/* Card 1 */}
                        <div className={styles.testiCard}>
                            <i className={`fa-solid fa-quote-right ${styles.quoteIcon}`}></i>
                            <div className={styles.testiStars}>
                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                            </div>
                            <p className={styles.testiText}>{t('testi_1')}</p>
                            <div className={styles.testiAuthor}>
                                <div className={styles.testiAvatar} style={{backgroundColor: '#FF6B6B'}}>BC</div>
                                <div className={styles.testiInfo}>
                                    <h4>Baku Central</h4>
                                    <span>{t('testi_type_1')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className={styles.testiCard}>
                            <i className={`fa-solid fa-quote-right ${styles.quoteIcon}`}></i>
                            <div className={styles.testiStars}>
                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                            </div>
                            <p className={styles.testiText}>{t('testi_2')}</p>
                            <div className={styles.testiAuthor}>
                                <div className={styles.testiAvatar} style={{backgroundColor: '#4ECDC4'}}>L9</div>
                                <div className={styles.testiInfo}>
                                    <h4>Lounge 99</h4>
                                    <span>{t('testi_type_2')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className={styles.testiCard}>
                            <i className={`fa-solid fa-quote-right ${styles.quoteIcon}`}></i>
                            <div className={styles.testiStars}>
                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                            </div>
                            <p className={styles.testiText}>{t('testi_3')}</p>
                            <div className={styles.testiAuthor}>
                                <div className={styles.testiAvatar} style={{backgroundColor: '#FFD166', color: '#000'}}>KE</div>
                                <div className={styles.testiInfo}>
                                    <h4>Kabab Evi</h4>
                                    <span>{t('testi_type_3')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className={styles.pricing}>
                <h2 className={styles.sectionTitle}>{t('pricing_title')}</h2>
                <div className={styles.pricingGrid}>
                    <div className={`${styles.pricingCard} ${styles.pricingPro}`}>
                        <div className={styles.proBadge}>{t('free')}</div>
                        <div className={styles.priceHeader}>
                            <h3>{t('free')}</h3>
                            <div className={styles.price}>0 ₼ <span>{t('per_month')}</span></div>
                        </div>
                        <ul className={styles.priceList}>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_1')}</li>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_2')}</li>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_3')}</li>
                            <li className={styles.disabled}><i className="fa-solid fa-xmark" /> {t('pr_f_4')}</li>
                        </ul>
                        <Link to="/admin" className={styles.priceBtnPro}>{t('start_free') || t('start_now')}</Link>
                    </div>
                    <div className={`${styles.pricingCard} ${styles.pricingPro}`}>
                        <div className={styles.proBadge}>{t('most_popular')}</div>
                        <div className={styles.priceHeader}>
                            <h3>{t('monthly_sub')}</h3>
                            <div className={styles.price}>29 ₼ <span>{t('per_month')}</span></div>
                        </div>
                        <ul className={styles.priceList}>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_5')}</li>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_6')}</li>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_7')}</li>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_8')}</li>
                        </ul>
                        <Link to="/admin" className={styles.priceBtnPro}>{t('go_premium')}</Link>
                    </div>
                    <div className={`${styles.pricingCard} ${styles.pricingPro}`}>
                        <div className={styles.proBadge}>{t('best_value')}</div>
                        <div className={styles.priceHeader}>
                            <h3>{t('yearly_sub')}</h3>
                            <div className={styles.price}>290 ₼ <span>{t('per_year')}</span></div>
                        </div>
                        <ul className={styles.priceList}>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_9')}</li>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_10')}</li>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_6')}</li>
                            <li><i className="fa-solid fa-check" /> {t('pr_f_11')}</li>
                        </ul>
                        <Link to="/admin" className={styles.priceBtnPro}>{t('go_yearly')}</Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className={styles.ctaContent}>
                    <h2>{t('cta_title')}</h2>
                    <p>{t('cta_desc')}</p>
                    <div className={styles.ctaActions}>
                        <Link to="/admin" className={styles.primaryBtn}>{t('register')}</Link>
                        <a href="https://wa.me/994554772779" target="_blank" className={styles.whatsappBtn}>
                            <i className="fa-brands fa-whatsapp" /> {t('contact_wa')}
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
                            <span>{t('brand_name')}</span>
                        </div>
                        <p>{t('footer_desc')}</p>
                    </div>
                    <div className={styles.footerLinks}>
                        <div className={styles.linkGroup}>
                            <h5>{t('platform')}</h5>
                            <a href="#features">{t('features')}</a>
                            <a href="#how">{t('how_it_works')}</a>
                            <a href="#pricing">{t('pricing')}</a>
                        </div>
                        <div className={styles.linkGroup}>
                            <h5>{t('support')}</h5>
                            <a href="#">{t('privacy')}</a>
                            <a href="#">{t('terms')}</a>
                            <a href="#">{t('contact_us')}</a>
                        </div>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>{t('copyright')}</p>
                    <div className={styles.socials}>
                        <a href="#"><i className="fa-brands fa-instagram" /></a>
                        <a href="#"><i className="fa-brands fa-facebook" /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
