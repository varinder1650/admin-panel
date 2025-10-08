class SecureStorage {
    static setItem(key: string, value: string): void {
      const encrypted = btoa(value);
      sessionStorage.setItem(key, encrypted);
    }
    
    static getItem(key: string): string | null {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      try {
        return atob(encrypted);
      } catch {
        return null;
      }
    }
    
    static removeItem(key: string): void {
      sessionStorage.removeItem(key);
    }
    
    static clear(): void {
      sessionStorage.clear();
    }
  }
  
  export default SecureStorage;