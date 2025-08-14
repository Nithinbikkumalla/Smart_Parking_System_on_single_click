import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getParkingSlots, 
  getBookingHistory, 
  initializeParkingSlots 
} from '../firebase/services';

const RealtimeContext = createContext();

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider = ({ children }) => {
  const [slots, setSlots] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    let slotsUnsubscribe = null;
    let historyUnsubscribe = null;

    const initializeRealtimeData = async () => {
      try {
        setConnectionStatus('connecting');
        setError(null);

        // Initialize parking slots if they don't exist
        await initializeParkingSlots();

        // Set up real-time listener for parking slots
        slotsUnsubscribe = getParkingSlots((slotsData) => {
          setSlots(slotsData);
          setLoading(false);
          setConnectionStatus('connected');
        });

        // Set up real-time listener for booking history
        historyUnsubscribe = getBookingHistory((historyData) => {
          setBookingHistory(historyData);
        });

      } catch (error) {
        console.error('Error initializing real-time data:', error);
        setError('Failed to connect to real-time updates');
        setConnectionStatus('error');
        setLoading(false);
      }
    };

    initializeRealtimeData();

    // Cleanup function
    return () => {
      if (slotsUnsubscribe && typeof slotsUnsubscribe === 'function') {
        slotsUnsubscribe();
      }
      if (historyUnsubscribe && typeof historyUnsubscribe === 'function') {
        historyUnsubscribe();
      }
    };
  }, []);

  // Connection status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus('connected');
      setError(null);
    };

    const handleOffline = () => {
      setConnectionStatus('offline');
      setError('You are offline. Real-time updates are paused.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper functions
  const getSlotById = (slotId) => {
    return slots.find(slot => slot.id === slotId);
  };

  const getAvailableSlots = () => {
    return slots.filter(slot => !slot.isOccupied);
  };

  const getOccupiedSlots = () => {
    return slots.filter(slot => slot.isOccupied);
  };

  const getUserSlots = (userId) => {
    return slots.filter(slot => slot.isOccupied && slot.userId === userId);
  };

  const getRecentBookings = (limit = 10) => {
    return bookingHistory.slice(0, limit);
  };

  const getTotalUsers = () => {
    const uniqueUsers = new Set(bookingHistory.map(record => record.userId));
    return uniqueUsers.size;
  };

  // Statistics
  const stats = {
    totalSlots: slots.length,
    availableSlots: getAvailableSlots().length,
    occupiedSlots: getOccupiedSlots().length,
    totalUsers: getTotalUsers(),
    totalBookings: bookingHistory.length
  };

  const value = {
    // Data
    slots,
    bookingHistory,
    stats,
    
    // Status
    loading,
    error,
    connectionStatus,
    
    // Helper functions
    getSlotById,
    getAvailableSlots,
    getOccupiedSlots,
    getUserSlots,
    getRecentBookings,
    getTotalUsers,
    
    // Actions
    setError
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};
