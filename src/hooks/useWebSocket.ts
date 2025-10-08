import { useEffect, useCallback, useRef, useState } from 'react';
import { wsService } from '@/services/websocket';
import { useToast } from '@/hooks/use-toast';

interface UseWebSocketOptions {
  onMessage?: Record<string, (data: any) => void>;
  onError?: (error: any) => void;
  autoConnect?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { toast } = useToast();
  const { onMessage = {}, onError, autoConnect = true } = options;
  const handlersRef = useRef(onMessage);

  useEffect(() => {
    handlersRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!autoConnect) return;

    const handlers = handlersRef.current;
    
    Object.entries(handlers).forEach(([type, handler]) => {
      wsService.onMessage(type, handler);
    });

    const errorHandler = (data: any) => {
      console.error('WebSocket error:', data);
      if (onError) {
        onError(data);
      } else if (!data.message?.includes('Unknown message type')) {
        toast({
          title: "Error",
          description: data.message || "An error occurred",
          variant: "destructive",
        });
      }
    };
    
    wsService.onMessage('error', errorHandler);

    return () => {
      Object.keys(handlers).forEach(type => {
        wsService.onMessage(type, () => {});
      });
      wsService.onMessage('error', () => {});
    };
  }, [autoConnect, onError, toast]);

  const send = useCallback((message: any) => {
    wsService.send(message);
  }, []);

  const isConnected = useCallback(() => {
    return wsService.isConnected();
  }, []);

  return { send, isConnected };
};