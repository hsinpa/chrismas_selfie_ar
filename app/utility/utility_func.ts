export function base64ToImage(base64: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
            resolve(img);
        };
        
        img.onerror = (error) => {
            reject(new Error('Failed to load image from base64'));
        };
        
        img.src = base64;
    });
}

export function downloadFromBase64(base64: string, filename: string = 'capture.png') {
    // Convert base64 to blob
    const blob = base64ToBlob(base64);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    
    // Clean up after a small delay to ensure download starts
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
}

export function base64ToBlob(base64: string): Blob {
    // Remove data URL prefix if present (data:image/png;base64,)
    const base64Data = base64.split(',')[1] || base64;
    
    // Get mime type from base64 string
    const mimeMatch = base64.match(/data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    
    // Decode base64
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}