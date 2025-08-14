import { toggleSlotOccupancy } from '../firebase/services';

/**
 * Booking Service
 * Handles all parking slot booking logic with validation
 */

export class BookingService {
  /**
   * Validates if a user can book a specific slot
   * @param {Object} slot - The parking slot object
   * @param {Object} user - The user object
   * @returns {Object} - Validation result with success and message
   */
  static validateBooking(slot, user) {
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    if (!slot) {
      return {
        success: false,
        message: 'Invalid slot'
      };
    }

    // If slot is occupied by someone else
    if (slot.isOccupied && slot.userId !== user.uid) {
      return {
        success: false,
        message: `Slot ${slot.number} is occupied by ${slot.occupiedBy} (${slot.vehicleNumber})`
      };
    }

    return {
      success: true,
      message: slot.isOccupied ? 'Ready to release slot' : 'Ready to book slot'
    };
  }

  /**
   * Books or releases a parking slot
   * @param {Object} slot - The parking slot object
   * @param {Object} user - The user object with uid, username, vehicleNumber
   * @returns {Promise<Object>} - Result of the booking operation
   */
  static async toggleSlotBooking(slot, user) {
    try {
      // Validate the booking first
      const validation = this.validateBooking(slot, user);
      if (!validation.success) {
        throw new Error(validation.message);
      }

      // Perform the booking/release operation
      await toggleSlotOccupancy(slot.id, user, slot.isOccupied);

      const action = slot.isOccupied ? 'released' : 'booked';
      return {
        success: true,
        message: `Slot ${slot.number} ${action} successfully`,
        action
      };

    } catch (error) {
      console.error('Booking error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update slot. Please try again.',
        error
      };
    }
  }

  /**
   * Checks if a user can perform a booking action
   * @param {Object} slot - The parking slot object
   * @param {Object} user - The user object
   * @returns {boolean} - Whether the user can perform the action
   */
  static canUserInteractWithSlot(slot, user) {
    if (!user || !slot) return false;
    
    // User can interact if slot is available or if it's their own slot
    return !slot.isOccupied || slot.userId === user.uid;
  }

  /**
   * Gets the action text for a slot
   * @param {Object} slot - The parking slot object
   * @param {Object} user - The user object
   * @returns {string} - Action text
   */
  static getSlotActionText(slot, user) {
    if (!user) return 'Login required';
    
    if (!slot.isOccupied) {
      return 'Tap to book';
    }
    
    if (slot.userId === user.uid) {
      return 'Tap to release';
    }
    
    return 'Occupied';
  }

  /**
   * Gets user's occupied slots
   * @param {Array} slots - Array of all parking slots
   * @param {Object} user - The user object
   * @returns {Array} - Array of slots occupied by the user
   */
  static getUserOccupiedSlots(slots, user) {
    if (!user || !slots) return [];
    
    return slots.filter(slot => 
      slot.isOccupied && slot.userId === user.uid
    );
  }

  /**
   * Gets available slots count
   * @param {Array} slots - Array of all parking slots
   * @returns {number} - Number of available slots
   */
  static getAvailableSlotsCount(slots) {
    if (!slots) return 0;
    return slots.filter(slot => !slot.isOccupied).length;
  }

  /**
   * Gets occupied slots count
   * @param {Array} slots - Array of all parking slots
   * @returns {number} - Number of occupied slots
   */
  static getOccupiedSlotsCount(slots) {
    if (!slots) return 0;
    return slots.filter(slot => slot.isOccupied).length;
  }

  /**
   * Formats timestamp for display
   * @param {*} timestamp - Firebase timestamp or Date object
   * @returns {string} - Formatted time string
   */
  static formatTimestamp(timestamp) {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  }

  /**
   * Gets slot status for display
   * @param {Object} slot - The parking slot object
   * @param {Object} user - The user object
   * @returns {Object} - Status object with color, text, and icon
   */
  static getSlotStatus(slot, user) {
    if (!slot.isOccupied) {
      return {
        status: 'available',
        color: '#4CAF50',
        text: 'Available',
        icon: '🅿️',
        clickable: true
      };
    }

    if (slot.userId === user?.uid) {
      return {
        status: 'user-slot',
        color: '#2196F3',
        text: 'Your Slot',
        icon: '🚗',
        clickable: true
      };
    }

    return {
      status: 'occupied',
      color: '#f44336',
      text: 'Occupied',
      icon: '🔒',
      clickable: false
    };
  }
}

export default BookingService;
