class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 3000;
  private url: string;
  private isAuthenticated = false;
  private isWsAuthenticated = false;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private connectionHandlers: Array<(connected: boolean) => void> = [];
  private messageQueue: any[] = [];
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(url: string) {
    this.url = url;
  }

  // ✅ Add public getter for WebSocket instance
  get websocket(): WebSocket | null {
    return this.ws;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log("Connecting to WebSocket...");
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.notifyConnectionHandlers(true);
          this.flushQueue();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected', event.code);
          this.isWsAuthenticated = false;
          this.notifyConnectionHandlers(false);

          if (event.code !== 1000 && event.code !== 1001 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect()
        .then(() => {
          const token = localStorage.getItem('admin_token');
          if (token) {
            this.send({ type: 'authenticate', payload: { token } });
          }
        })
        .catch((error) => {
          console.error('Reconnection failed:', error);
        });
    }, this.reconnectDelay);
  }

  private flushQueue() {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const msg = this.messageQueue.shift();
      this.ws?.send(JSON.stringify(msg));
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not ready, queuing message:', message.type);
      this.messageQueue.push(message);
    }
  }

  private handleMessage(message: any) {
    const { type, ...data } = message;
    
    if (type === 'auth_success') {
      this.isAuthenticated = true;
      this.isWsAuthenticated = true;
      if (data.user?.token) {
        localStorage.setItem('admin_token', data.user.token);
      }
    }

    if (type === 'error' && data.message?.includes('authentication')) {
      this.isAuthenticated = false;
      this.isWsAuthenticated = false;
    }

    const handler = this.messageHandlers.get(type);
    if (handler) {
      handler(data);
    }

    const allHandler = this.messageHandlers.get('*');
    if (allHandler) {
      allHandler(message);
    }
  }

  private notifyConnectionHandlers(connected: boolean) {
    this.connectionHandlers.forEach(handler => handler(connected));
  }

  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  onConnection(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler);
  }

  authenticate(email: string, password: string) {
    this.send({
      type: 'authenticate',
      payload: { email, password }
    });
  }

  authenticateWithToken(token: string) {
    this.send({
      type: 'authenticate',
      payload: { token }
    });
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }

  subscribe(channel: string) {
    this.send({
      type: 'subscribe',
      channel: channel
    });
  }

  disconnect() {
    console.log('Disconnecting WebSocket');
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
      this.isWsAuthenticated = false;
    }
  }
}

// Create and export the instance
const wsUrl = import.meta.env.DEV
  ? "ws://localhost:8001/admin/ws"
  : "wss://195.35.6.222/admin-api/admin/ws";

export const wsService = new WebSocketService(wsUrl);

// Default export as well for compatibility
export default wsService;