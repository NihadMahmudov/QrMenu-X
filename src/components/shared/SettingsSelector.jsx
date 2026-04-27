import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './SettingsSelector.module.css';

export default function SettingsSelector() {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState('light');
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className={styles.container} ref={ref}>
            <button className={styles.toggle} onClick={() => setOpen(!open)} title={t('settings')}>
                <i className="fa-solid fa-gear" />
            </button>

            {open && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <span>{t('settings')}</span>
                    </div>
                    
                    <div className={styles.section}>
                        <div className={styles.option} onClick={toggleTheme}>
                            <div className={styles.optionLeft}>
                                <i className={`fa-solid fa-${theme === 'light' ? 'moon' : 'sun'}`} />
                                <span className={styles.optionLabel}>{t('theme')}</span>
                            </div>
                            <span className={styles.badge}>
                                {theme === 'light' ? t('theme_dark') : t('theme_light')}
                            </span>
                        </div>

                        <div className={styles.option}>
                            <div className={styles.optionLeft}>
                                <i className="fa-solid fa-circle-question" />
                                <span className={styles.optionLabel}>{t('help')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
