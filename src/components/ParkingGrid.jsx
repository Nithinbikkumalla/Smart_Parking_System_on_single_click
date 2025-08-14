import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { Link } from 'react-router-dom';
import BookingService from '../services/bookingService';
import ParkingSlot from './ParkingSlot';
import './ParkingGrid.css';

const ParkingGrid = () => {
  const [error, setError] = useState('');
  const { userInfo, logout } = useAuth();
  const { slots, loading } = useRealtime();

  const handleSlotClick = async (slot) => {
    if (!userInfo) return;

    try {
      setError('');
      const result = await BookingService.toggleSlotBooking(slot, userInfo);

      if (!result.success) {
        setError(result.message);
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error toggling slot:', error);
      setError('Failed to update slot. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getOccupiedSlotsCount = () => {
    return BookingService.getOccupiedSlotsCount(slots);
  };

  const getAvailableSlotsCount = () => {
    return BookingService.getAvailableSlotsCount(slots);
  };

  const getUserOccupiedSlots = () => {
    return BookingService.getUserOccupiedSlots(slots, userInfo);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading parking slots...</p>
      </div>
    );
  }

  return (
    <div className="parking-container">
      {/* Header */}
      <header className="header">
        <h1>🚗 Smart Parking</h1>
        <div className="header-actions">
          <div className="user-info">
            <span>Welcome, {userInfo?.username}</span>
            <span className="vehicle-info">({userInfo?.vehicleNumber})</span>
          </div>
          {userInfo?.isAdmin && (
            <Link to="/admin" className="btn btn-secondary">
              Admin Dashboard
            </Link>
          )}
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card available">
          <div className="stat-number">{getAvailableSlotsCount()}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card occupied">
          <div className="stat-number">{getOccupiedSlotsCount()}</div>
          <div className="stat-label">Occupied</div>
        </div>
        <div className="stat-card user-slots">
          <div className="stat-number">{getUserOccupiedSlots().length}</div>
          <div className="stat-label">Your Slots</div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Instructions */}
      <div className="instructions">
        <p>💡 Tap on an available (green) slot to book it, or tap your occupied (red) slot to release it</p>
      </div>

      {/* Parking Grid */}
      <div className="parking-grid">
        {slots.map((slot) => (
          <ParkingSlot
            key={slot.id}
            slot={slot}
            onClick={() => handleSlotClick(slot)}
            isUserSlot={slot.userId === userInfo?.uid}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color occupied"></div>
          <span>Occupied</span>
        </div>
        <div className="legend-item">
          <div className="legend-color user-slot"></div>
          <span>Your Slot</span>
        </div>
      </div>
    </div>
  );
};

export default ParkingGrid;
