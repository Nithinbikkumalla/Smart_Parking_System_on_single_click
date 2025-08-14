// Mock Firebase services for local development
// This allows the app to work without a real Firebase project

// Mock data storage
let mockSlots = [];
let mockUsers = {};
let mockBookingHistory = [];
let mockListeners = [];

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock current user
let mockCurrentUser = null;

// Mock Authentication services
export const signInUser = async (username, vehicleNumber) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userId = generateId();
    mockCurrentUser = {
      uid: userId,
      username,
      vehicleNumber,
      isAdmin: username.toLowerCase() === 'admin'
    };

    // Store user info in mock storage
    mockUsers[userId] = {
      username,
      vehicleNumber,
      isAdmin: username.toLowerCase() === 'admin',
      createdAt: new Date()
    };

    console.log('Mock sign in successful:', mockCurrentUser);
    return { user: mockCurrentUser, username, vehicleNumber };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    mockCurrentUser = null;
    console.log('Mock sign out successful');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Mock Parking slot services
export const initializeParkingSlots = async () => {
  try {
    // If no slots exist, create initial slots
    if (mockSlots.length === 0) {
      const totalSlots = 20; // 20 parking slots

      for (let i = 1; i <= totalSlots; i++) {
        mockSlots.push({
          id: `slot-${i}`,
          number: i,
          isOccupied: false,
          occupiedBy: null,
          vehicleNumber: null,
          userId: null,
          occupiedAt: null,
          releasedAt: null,
          createdAt: new Date()
        });
      }

      console.log('Mock parking slots initialized:', mockSlots.length, 'slots');
    }
  } catch (error) {
    console.error('Error initializing parking slots:', error);
    throw error;
  }
};

export const getParkingSlots = (callback) => {
  // Mock real-time listener
  const listenerId = generateId();

  // Initial callback with current data
  setTimeout(() => {
    const sortedSlots = [...mockSlots].sort((a, b) => a.number - b.number);
    callback(sortedSlots);
  }, 100);

  // Store listener for updates
  mockListeners.push({ id: listenerId, callback, type: 'slots' });

  // Return unsubscribe function
  return () => {
    const index = mockListeners.findIndex(l => l.id === listenerId);
    if (index > -1) {
      mockListeners.splice(index, 1);
    }
  };
};

export const toggleSlotOccupancy = async (slotId, user, isCurrentlyOccupied) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const slotIndex = mockSlots.findIndex(slot => slot.id === slotId);
    if (slotIndex === -1) {
      throw new Error('Slot not found');
    }

    if (isCurrentlyOccupied) {
      // Free the slot
      mockSlots[slotIndex] = {
        ...mockSlots[slotIndex],
        isOccupied: false,
        occupiedBy: null,
        vehicleNumber: null,
        userId: null,
        occupiedAt: null,
        releasedAt: new Date()
      };
    } else {
      // Occupy the slot
      mockSlots[slotIndex] = {
        ...mockSlots[slotIndex],
        isOccupied: true,
        occupiedBy: user.username,
        vehicleNumber: user.vehicleNumber,
        userId: user.uid,
        occupiedAt: new Date()
      };
    }

    // Add to booking history
    await addBookingRecord(slotId, user, !isCurrentlyOccupied);

    // Notify all listeners
    notifyListeners();

  } catch (error) {
    console.error('Error toggling slot occupancy:', error);
    throw error;
  }
};

export const addBookingRecord = async (slotId, user, isBooking) => {
  try {
    const record = {
      id: generateId(),
      slotId,
      slotNumber: parseInt(slotId.split('-')[1]),
      username: user.username,
      vehicleNumber: user.vehicleNumber,
      userId: user.uid,
      action: isBooking ? 'booked' : 'released',
      timestamp: new Date()
    };

    mockBookingHistory.unshift(record); // Add to beginning for latest first
    console.log('Mock booking record added:', record);
  } catch (error) {
    console.error('Error adding booking record:', error);
    throw error;
  }
};

export const getBookingHistory = (callback) => {
  // Mock real-time listener
  const listenerId = generateId();

  // Initial callback with current data
  setTimeout(() => {
    const sortedHistory = [...mockBookingHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    callback(sortedHistory);
  }, 100);

  // Store listener for updates
  mockListeners.push({ id: listenerId, callback, type: 'history' });

  // Return unsubscribe function
  return () => {
    const index = mockListeners.findIndex(l => l.id === listenerId);
    if (index > -1) {
      mockListeners.splice(index, 1);
    }
  };
};

export const getUserInfo = async (userId) => {
  try {
    return mockUsers[userId] || null;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

// Helper function to notify all listeners
const notifyListeners = () => {
  mockListeners.forEach(listener => {
    if (listener.type === 'slots') {
      const sortedSlots = [...mockSlots].sort((a, b) => a.number - b.number);
      listener.callback(sortedSlots);
    } else if (listener.type === 'history') {
      const sortedHistory = [...mockBookingHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      listener.callback(sortedHistory);
    }
  });
};
