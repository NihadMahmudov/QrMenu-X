import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './SettingsSelector.module.css';

export default function SettingsSelector() {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
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
