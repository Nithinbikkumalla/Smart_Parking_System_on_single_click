import React from 'react';
import './ParkingSlot.css';

const ParkingSlot = ({ slot, onClick, isUserSlot }) => {
  const getSlotClass = () => {
    let baseClass = 'parking-slot';
    
    if (slot.isOccupied) {
      if (isUserSlot) {
        baseClass += ' user-slot';
      } else {
        baseClass += ' occupied';
      }
    } else {
      baseClass += ' available';
    }
    
    return baseClass;
  };

  const getSlotIcon = () => {
    if (slot.isOccupied) {
      return isUserSlot ? '🚗' : '🔒';
    }
    return '🅿️';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div 
      className={getSlotClass()}
      onClick={onClick}
      title={slot.isOccupied 
        ? `Occupied by ${slot.occupiedBy} (${slot.vehicleNumber}) at ${formatTime(slot.occupiedAt)}`
        : `Slot ${slot.number} - Available`
      }
    >
      <div className="slot-icon">
        {getSlotIcon()}
      </div>
      <div className="slot-number">
        {slot.number}
      </div>
      {slot.isOccupied && (
        <div className="slot-info">
          <div className="slot-user">{slot.occupiedBy}</div>
          <div className="slot-vehicle">{slot.vehicleNumber}</div>
          <div className="slot-time">{formatTime(slot.occupiedAt)}</div>
        </div>
      )}
      {!slot.isOccupied && (
        <div className="slot-status">
          Available
        </div>
      )}
    </div>
  );
};

export default ParkingSlot;
