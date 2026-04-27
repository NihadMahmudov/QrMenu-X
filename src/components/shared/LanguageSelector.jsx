import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './LanguageSelector.module.css';

const LANGUAGES = [
    { code: 'az', label: 'Azərbaycan', short: 'AZ', flag: '🇦🇿' },
    { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' }
];

export default function LanguageSelector() {
    const { lang, setLang } = useLanguage();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const activeLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (code) => {
        setLang(code);
        setOpen(false);
    };

    return (
        <div className={styles.container} ref={ref}>
            <button className={styles.toggle} onClick={() => setOpen(!open)}>
                <span className={styles.toggleText}>{activeLang.short}</span>
                <i className={`fa-solid fa-chevron-down ${styles.icon} ${open ? styles.iconOpen : ''}`} />
            </button>

            {open && (
                <div className={styles.dropdown}>
                    {LANGUAGES.map(l => (
                        <button 
                            key={l.code} 
                            className={`${styles.option} ${lang === l.code ? styles.optionActive : ''}`}
                            onClick={() => handleSelect(l.code)}
                        >
                            <div className={styles.optionLeft}>
                                <span className={styles.optionFlag}>{l.flag}</span>
                                <span className={styles.optionLabel}>{l.label}</span>
                            </div>
                            {lang === l.code && <i className="fa-solid fa-check" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
