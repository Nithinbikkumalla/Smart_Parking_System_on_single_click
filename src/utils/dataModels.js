/**
 * Data Models for Smart Parking App
 * 
 * This file defines the structure of data stored in Firestore
 */

// Parking Slot Model
export const ParkingSlotModel = {
  id: 'slot-{number}',           // Document ID: slot-1, slot-2, etc.
  number: 1,                     // Slot number (1-20)
  isOccupied: false,             // Boolean: true if occupied, false if available
  occupiedBy: null,              // String: username of the person who occupied the slot
  vehicleNumber: null,           // String: vehicle number of the occupying vehicle
  userId: null,                  // String: Firebase user ID of the occupant
  occupiedAt: null,              // Timestamp: when the slot was occupied
  releasedAt: null,              // Timestamp: when the slot was released
  createdAt: null                // Timestamp: when the slot was created
};

// User Model
export const UserModel = {
  // Document ID is the Firebase Auth UID
  username: '',                  // String: user's chosen username
  vehicleNumber: '',             // String: user's vehicle number
  isAdmin: false,                // Boolean: true if user is admin
  createdAt: null                // Timestamp: when user account was created
};

// Booking History Model
export const BookingHistoryModel = {
  // Document ID is auto-generated
  slotId: '',                    // String: reference to parking slot (slot-1, slot-2, etc.)
  slotNumber: 1,                 // Number: slot number for easy querying
  username: '',                  // String: username who performed the action
  vehicleNumber: '',             // String: vehicle number
  userId: '',                    // String: Firebase user ID
  action: '',                    // String: 'booked' or 'released'
  timestamp: null                // Timestamp: when the action occurred
};

// Firestore Collections Structure
export const FirestoreCollections = {
  PARKING_SLOTS: 'parkingSlots',
  USERS: 'users',
  BOOKING_HISTORY: 'bookingHistory'
};

// Slot Status Constants
export const SlotStatus = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied'
};

// Action Types for Booking History
export const ActionTypes = {
  BOOKED: 'booked',
  RELEASED: 'released'
};

// App Configuration
export const AppConfig = {
  TOTAL_SLOTS: 20,               // Total number of parking slots
  ADMIN_USERNAME: 'admin'        // Username that grants admin privileges
};

/**
 * Helper function to create a new parking slot object
 * @param {number} slotNumber - The slot number
 * @returns {Object} - Parking slot object
 */
export const createParkingSlot = (slotNumber) => ({
  id: `slot-${slotNumber}`,
  number: slotNumber,
  isOccupied: false,
  occupiedBy: null,
  vehicleNumber: null,
  userId: null,
  occupiedAt: null,
  releasedAt: null,
  createdAt: new Date()
});

/**
 * Helper function to create a booking history entry
 * @param {string} slotId - The slot ID
 * @param {Object} user - User object with username, vehicleNumber, uid
 * @param {string} action - 'booked' or 'released'
 * @returns {Object} - Booking history object
 */
export const createBookingHistory = (slotId, user, action) => ({
  slotId,
  slotNumber: parseInt(slotId.split('-')[1]),
  username: user.username,
  vehicleNumber: user.vehicleNumber,
  userId: user.uid,
  action,
  timestamp: new Date()
});
