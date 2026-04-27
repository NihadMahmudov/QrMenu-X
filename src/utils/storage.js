// Each owner gets their own data keyed by email
const ACCOUNTS_KEY = 'qrmenu_accounts'; // { email: password, ... }
const ACTIVE_KEY = 'qrmenu_active_owner'; // email string

export function getAccounts() {
    try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {}; } catch { return {}; }
}

export function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getActiveOwner() {
    return localStorage.getItem(ACTIVE_KEY) || null;
}

export function setActiveOwner(email) {
    localStorage.setItem(ACTIVE_KEY, email);
}

export function clearActiveOwner() {
    localStorage.removeItem(ACTIVE_KEY);
}

function ownerKey(email) {
    return `qrmenu_data_${email}`;
}

export function loadDB(email) {
    if (!email) return null;
    try { return JSON.parse(localStorage.getItem(ownerKey(email))); } catch { return null; }
}

export function saveDB(email, data) {
    localStorage.setItem(ownerKey(email), JSON.stringify(data));
}

// Load the currently active owner's data (for customer menu view)
export function loadActiveDB() {
    const email = getActiveOwner();
    if (!email) return null;
    return loadDB(email);
}

export function defaultDB(ownerName, ownerEmail) {
    return {
        owner: { name: ownerName, email: ownerEmail },
        restaurant: {
            name: ownerName, tagline: '', coverUrl: '', logoUrl: '',
            phone: '', whatsapp: '', address: '', hours: '', wifi: '', rating: ''
        },
        categories: [
            { id: 'cat_1', name: 'Başlanğıclar', emoji: '🥗' },
            { id: 'cat_2', name: 'Ana Yeməklər', emoji: '🍽️' },
            { id: 'cat_3', name: 'İçkilər', emoji: '🥤' },
            { id: 'cat_4', name: 'Şirniyyatlar', emoji: '🍰' },
        ],
        items: []
    };
}

// Resize + compress image via canvas, returns base64 data URL
function resizeImage(file, maxWidth, maxHeight, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                let w = img.width, h = img.height;
                // Scale down proportionally
                if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
                if (h > maxHeight) { w = Math.round(w * maxHeight / h); h = maxHeight; }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

// Cover: high quality banner → max 1600px wide, keep aspect ratio, high quality
export function processcover(file) {
    return resizeImage(file, 1600, 900, 0.92);
}

// Logo: square-ish → max 400x400
export function processLogo(file) {
    return resizeImage(file, 400, 400, 0.85);
}

// Item image → max 600x600
export function processItemImage(file) {
    return resizeImage(file, 600, 600, 0.82);
}

// Generic fallback
export function fileToBase64(file) {
    return resizeImage(file, 800, 800, 0.8);
}
