import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): Socket {
    if (!this.socket || !this.isConnected) {
      const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
      
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Property-specific methods
  viewProperty(propertyId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('view_property', { propertyId });
    }
  }

  leaveProperty(propertyId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_property', { propertyId });
    }
  }

  // Event listeners
  onViewerCountUpdated(callback: (data: { propertyId: string; count: number }) => void): void {
    if (this.socket) {
      this.socket.on('viewer_count_updated', callback);
    }
  }

  onAvailabilityUpdated(callback: (data: { propertyId: string; bedsAvailable: number }) => void): void {
    if (this.socket) {
      this.socket.on('availability_updated', callback);
    }
  }

  onBookingActivity(callback: (data: { propertyId: string; message: string; timestamp: string }) => void): void {
    if (this.socket) {
      this.socket.on('booking_activity', callback);
    }
  }

  // Remove listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners('viewer_count_updated');
      this.socket.removeAllListeners('availability_updated');
      this.socket.removeAllListeners('booking_activity');
    }
  }
}

export const socketService = new SocketService();