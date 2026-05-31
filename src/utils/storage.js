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
                // Try WebP first (30% smaller), fallback to JPEG
                const mimeType = canvas.toDataURL('image/webp').startsWith('data:image/webp') 
                    ? 'image/webp' 
                    : 'image/jpeg';
                canvas.toBlob((blob) => {
                    resolve({ blob, mimeType });
                }, mimeType, quality);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

async function uploadToSupabase({ blob, mimeType }, folder = 'items') {
    const ext = mimeType === 'image/webp' ? 'webp' : 'jpg';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, blob, {
            contentType: mimeType,
            cacheControl: '31536000', // 1 il cache — storage egress-i kəskin azaldır
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
    const result = await resizeImageToBlob(file, 1200, 675, 0.85); // 1600→1200, quality azaldıldı
    return uploadToSupabase(result, 'covers');
}

export async function processLogo(file) {
    const result = await resizeImageToBlob(file, 300, 300, 0.82); // 400→300
    return uploadToSupabase(result, 'logos');
}

export async function processItemImage(file) {
    const result = await resizeImageToBlob(file, 500, 500, 0.80); // 600→500, quality azaldıldı
    return uploadToSupabase(result, 'items');
}
