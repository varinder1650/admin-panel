export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  export const filesToBase64 = async (files: File[]): Promise<string[]> => {
    return Promise.all(files.map(file => fileToBase64(file)));
  };
  
  export const getImageUrls = (images: any): string[] => {
    if (!images) return [];
    
    if (Array.isArray(images)) {
      return images.map(img => {
        if (typeof img === 'string') return img;
        if (typeof img === 'object' && img !== null) {
          return img.url || img.secure_url || img.original || img.thumbnail || '';
        }
        return '';
      }).filter(Boolean);
    }
    
    if (typeof images === 'string') {
      return [images];
    }
    
    return [];
  };
  
  export const getPrimaryImageUrl = (images: any): string => {
    const urls = getImageUrls(images);
    return urls[0] || '';
  };