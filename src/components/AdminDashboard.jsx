import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { Link } from 'react-router-dom';
import BookingService from '../services/bookingService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { userInfo, logout } = useAuth();
  const { slots, bookingHistory, loading, stats } = useRealtime();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getOccupiedSlots = () => {
    return slots.filter(slot => slot.isOccupied);
  };

  const getRecentBookings = () => {
    return bookingHistory.slice(0, 10);
  };

  const getTotalUsers = () => {
    const uniqueUsers = new Set(bookingHistory.map(record => record.userId));
    return uniqueUsers.size;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <h1>🛠️ Admin Dashboard</h1>
        <div className="header-actions">
          <div className="user-info">
            <span>Admin: {userInfo?.username}</span>
          </div>
          <Link to="/" className="btn btn-secondary">
            Back to Parking
          </Link>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="admin-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          Slot Details
        </button>
        <button 
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Booking History
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🅿️</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalSlots}</div>
                <div className="stat-label">Total Slots</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-number">{stats.availableSlots}</div>
                <div className="stat-label">Available</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-info">
                <div className="stat-number">{stats.occupiedSlots}</div>
                <div className="stat-label">Occupied</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
          </div>

          <div className="dashboard-sections">
            <div className="section">
              <h3>Currently Occupied Slots</h3>
              <div className="occupied-slots">
                {getOccupiedSlots().length === 0 ? (
                  <p className="no-data">No slots currently occupied</p>
                ) : (
                  getOccupiedSlots().map(slot => (
                    <div key={slot.id} className="occupied-slot-card">
                      <div className="slot-header">
                        <span className="slot-number">Slot {slot.number}</span>
                        <span className="slot-time">
                          {BookingService.formatTimestamp(slot.occupiedAt)}
                        </span>
                      </div>
                      <div className="slot-details">
                        <div className="detail">
                          <strong>User:</strong> {slot.occupiedBy}
                        </div>
                        <div className="detail">
                          <strong>Vehicle:</strong> {slot.vehicleNumber}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="section">
              <h3>Recent Activity</h3>
              <div className="recent-activity">
                {getRecentBookings().length === 0 ? (
                  <p className="no-data">No recent activity</p>
                ) : (
                  getRecentBookings().map(record => (
                    <div key={record.id} className="activity-item">
                      <div className="activity-icon">
                        {record.action === 'booked' ? '🟢' : '🔴'}
                      </div>
                      <div className="activity-details">
                        <div className="activity-main">
                          <strong>{record.username}</strong> {record.action} Slot {record.slotNumber}
                        </div>
                        <div className="activity-meta">
                          {record.vehicleNumber} • {BookingService.formatTimestamp(record.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slot Details Tab */}
      {activeTab === 'slots' && (
        <div className="admin-content">
          <div className="slots-table">
            <h3>All Parking Slots</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Slot</th>
                    <th>Status</th>
                    <th>User</th>
                    <th>Vehicle</th>
                    <th>Occupied Since</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map(slot => (
                    <tr key={slot.id} className={slot.isOccupied ? 'occupied' : 'available'}>
                      <td>
                        <span className="slot-badge">{slot.number}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${slot.isOccupied ? 'occupied' : 'available'}`}>
                          {slot.isOccupied ? 'Occupied' : 'Available'}
                        </span>
                      </td>
                      <td>{slot.occupiedBy || '-'}</td>
                      <td>{slot.vehicleNumber || '-'}</td>
                      <td>
                        {slot.occupiedAt ? BookingService.formatTimestamp(slot.occupiedAt) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Booking History Tab */}
      {activeTab === 'history' && (
        <div className="admin-content">
          <div className="history-table">
            <h3>Complete Booking History</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Action</th>
                    <th>Slot</th>
                    <th>User</th>
                    <th>Vehicle</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingHistory.map(record => (
                    <tr key={record.id}>
                      <td>{BookingService.formatTimestamp(record.timestamp)}</td>
                      <td>
                        <span className={`action-badge ${record.action}`}>
                          {record.action === 'booked' ? '🟢 Booked' : '🔴 Released'}
                        </span>
                      </td>
                      <td>
                        <span className="slot-badge">{record.slotNumber}</span>
                      </td>
                      <td>{record.username}</td>
                      <td>{record.vehicleNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
