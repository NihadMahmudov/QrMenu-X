import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useData } from '../../context/DataContext';
import s from './QRTab.module.css';

export default function QRTab({ showToast }) {
    const { ownerEmail, db } = useData();
    const [copied, setCopied] = useState(false);

    const restaurantName = db?.restaurant?.name || 'Restoranım';
    
    // Always force the live Vercel URL if accessed locally, otherwise use the live origin
    const base = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'https://qr-menu-wine-iota.vercel.app'
        : window.location.origin;
        
    // Do not encode the @ symbol to prevent mobile QR scanners from misinterpreting %40.
    // Also, add a cache-busting timestamp (&t=...) so mobile browsers NEVER load a cached 404 page!
    const cacheBuster = Date.now();
    const menuUrl = ownerEmail
        ? `${base}/menu?owner=${ownerEmail}&t=${cacheBuster}`
        : `${base}/menu?t=${cacheBuster}`;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(menuUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            showToast('✅ Link kopyalandı!');
        } catch {
            showToast('❌ Kopyalanmadı');
        }
    };

    const downloadQR = () => {
        const canvas = document.getElementById('main-qr-canvas');
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${restaurantName}-qr-menu.png`;
        a.click();
        showToast('⬇️ QR kod yükləndi!');
    };

    const printQR = () => {
        const canvas = document.getElementById('main-qr-canvas');
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        const win = window.open('', '_blank');
        win.document.write(`
            <!DOCTYPE html><html><head>
            <title>${restaurantName} - QR Menyu</title>
            <style>
                *{margin:0;padding:0;box-sizing:border-box}
                body{font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fff}
                .card{text-align:center;padding:48px;border:3px solid #000;border-radius:24px;width:400px}
                .name{font-size:28px;font-weight:900;color:#0F172A;margin-bottom:6px}
                .sub{font-size:14px;color:#64748B;margin-bottom:32px}
                img{width:260px;height:260px}
                .cta{margin-top:24px;font-size:16px;font-weight:800;color:#f15a24}
                .url{margin-top:10px;font-size:11px;color:#94a3b8;word-break:break-all}
            </style></head><body>
            <div class="card">
                <div class="name">🍽️ ${restaurantName}</div>
                <div class="sub">Menyu üçün kameradan skan edin</div>
                <img src="${dataUrl}" />
                <div class="cta">📱 Skan et → Menyu açılır</div>
                <div class="url">${menuUrl}</div>
            </div>
            <script>window.onload=()=>{window.print();window.close()}<\/script>
            </body></html>
        `);
        win.document.close();
    };

    return (
        <div className={s.wrap}>
            <div className={s.hero}>
                <div className={s.qrBox}>
                    <div className={s.qrFrame}>
                        <QRCodeCanvas
                            id="main-qr-canvas"
                            value={menuUrl}
                            size={220}
                            bgColor="#ffffff"
                            fgColor="#0F172A"
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <div className={s.qrLabel}>
                        <i className="fa-solid fa-mobile-screen-button" />
                        Skan et → Menyu açılır
                    </div>
                </div>

                <div className={s.info}>
                    <div className={s.dynamicBadge}>
                        <i className="fa-solid fa-circle-check" />
                        Dinamik QR — Menyunu dəyiş, QR eyni qalır
                    </div>

                    <h2 className={s.title}>{restaurantName}</h2>

                    <p className={s.desc}>
                        Bu QR kodu çap edib masaların üzərinə yapışdırın.
                        Admin panelindən menyunu nə qədər dəyişsəniz dəyişin —
                        QR kod eyni qalır, müştərilər həmişə son menyunuzu görür.
                    </p>

                    <div className={s.urlBox}>
                        <i className="fa-solid fa-link" />
                        <span className={s.urlText}>{menuUrl}</span>
                        <button className={s.copyBtn} onClick={copyLink}>
                            <i className={`fa-solid fa-${copied ? 'check' : 'copy'}`} />
                            {copied ? 'Kopyalandı!' : 'Kopyala'}
                        </button>
                    </div>

                    <div className={s.actions}>
                        <button className={s.downloadBtn} onClick={downloadQR}>
                            <i className="fa-solid fa-download" />
                            PNG Yüklə
                        </button>
                        <button className={s.printBtn} onClick={printQR}>
                            <i className="fa-solid fa-print" />
                            Çap Et
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
