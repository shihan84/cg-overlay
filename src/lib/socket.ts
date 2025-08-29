import { Server } from 'socket.io';

interface OverlayData {
  title?: string;
  subtitle?: string;
  text?: string;
  imageUrl?: string;
  color?: string;
  backgroundColor?: string;
  isVisible?: boolean;
  animation?: string;
}

interface TemplateConfig {
  type: string;
  style: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    padding?: string;
    borderRadius?: string;
    backgroundColor?: string;
    color?: string;
    border?: string;
    boxShadow?: string;
  };
  animation?: {
    enter?: string;
    exit?: string;
    duration?: string;
  };
}

// Store overlay data in memory (in production, use a database)
const overlayDataStore = new Map<string, OverlayData>();
const overlayConfigStore = new Map<string, TemplateConfig>();

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle overlay room joining
    socket.on('join-overlay', (overlayId: string) => {
      socket.join(`overlay-${overlayId}`);
      console.log(`Client ${socket.id} joined overlay ${overlayId}`);
      
      // Send current overlay data if exists
      const currentData = overlayDataStore.get(overlayId);
      if (currentData) {
        socket.emit('overlay-update', currentData);
      }
      
      // Send current template config if exists
      const currentConfig = overlayConfigStore.get(overlayId);
      if (currentConfig) {
        socket.emit('template-config', currentConfig);
      }
    });

    // Handle overlay data updates
    socket.on('update-overlay', (data: { overlayId: string; data: OverlayData }) => {
      const { overlayId, data: overlayData } = data;
      
      // Store the overlay data
      overlayDataStore.set(overlayId, overlayData);
      
      // Broadcast to all clients in the overlay room
      io.to(`overlay-${overlayId}`).emit('overlay-update', overlayData);
      console.log(`Overlay ${overlayId} updated:`, overlayData);
    });

    // Handle overlay visibility changes
    socket.on('toggle-visibility', (data: { overlayId: string; visible: boolean }) => {
      const { overlayId, visible } = data;
      
      // Update the stored data
      const currentData = overlayDataStore.get(overlayId) || {};
      currentData.isVisible = visible;
      overlayDataStore.set(overlayId, currentData);
      
      // Broadcast to all clients in the overlay room
      io.to(`overlay-${overlayId}`).emit('overlay-visibility', visible);
      console.log(`Overlay ${overlayId} visibility changed to:`, visible);
    });

    // Handle template config updates
    socket.on('update-template-config', (data: { overlayId: string; config: TemplateConfig }) => {
      const { overlayId, config } = data;
      
      // Store the template config
      overlayConfigStore.set(overlayId, config);
      
      // Broadcast to all clients in the overlay room
      io.to(`overlay-${overlayId}`).emit('template-config', config);
      console.log(`Template config for overlay ${overlayId} updated:`, config);
    });

    // Handle getting overlay data
    socket.on('get-overlay-data', (overlayId: string, callback: (data: OverlayData) => void) => {
      const data = overlayDataStore.get(overlayId) || {};
      callback(data);
    });

    // Handle getting template config
    socket.on('get-template-config', (overlayId: string, callback: (config: TemplateConfig) => void) => {
      const config = overlayConfigStore.get(overlayId) || {
        type: 'LOWER_THIRD',
        style: {
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          padding: '12px 24px',
          borderRadius: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
        },
        animation: {
          enter: 'slideInUp',
          exit: 'slideOutDown',
          duration: '0.5s'
        }
      };
      callback(config);
    });

    // Handle messages (legacy support)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to CG Overlay WebSocket Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};