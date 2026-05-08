import { supabase } from '../lib/supabase';

// Resize + compress image via canvas, returns a Blob/File object ready for upload
function resizeImageToBlob(file, maxWidth, maxHeight, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                let w = img.width, h = img.height;
                if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
                if (h > maxHeight) { w = Math.round(w * maxHeight / h); h = maxHeight; }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', quality);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

async function uploadToSupabase(blob, folder = 'items') {
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    
    const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, blob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

    return publicUrl;
}

// Public API
export async function processcover(file) {
    const blob = await resizeImageToBlob(file, 1600, 900, 0.9);
    return uploadToSupabase(blob, 'covers');
}

export async function processLogo(file) {
    const blob = await resizeImageToBlob(file, 400, 400, 0.85);
    return uploadToSupabase(blob, 'logos');
}

export async function processItemImage(file) {
    const blob = await resizeImageToBlob(file, 600, 600, 0.82);
    return uploadToSupabase(blob, 'items');
}
