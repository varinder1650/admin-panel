import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

export const useSessionTimeout = (timeoutMinutes: number = 30) => {
  const { logout } = useAuthStore();
  const { toast } = useToast();
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
        toast({ 
          title: "Session Expired", 
          description: "Please login again",
          variant: "destructive"
        });
      }, timeoutMinutes * 60 * 1000);
    };
    
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
    
    resetTimer();
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [timeoutMinutes, logout, toast]);
};