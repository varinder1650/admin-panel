class RateLimiter {
    private attempts: Map<string, number[]> = new Map();
    
    canProceed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
      const now = Date.now();
      const attempts = this.attempts.get(key) || [];
      
      const recentAttempts = attempts.filter(time => now - time < windowMs);
      
      if (recentAttempts.length >= maxAttempts) {
        return false;
      }
      
      recentAttempts.push(now);
      this.attempts.set(key, recentAttempts);
      return true;
    }
    
    reset(key: string): void {
      this.attempts.delete(key);
    }
  }
  
  export const rateLimiter = new RateLimiter();