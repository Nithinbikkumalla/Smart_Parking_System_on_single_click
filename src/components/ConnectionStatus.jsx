import React from 'react';
import { useRealtime } from '../contexts/RealtimeContext';
import './ConnectionStatus.css';

const ConnectionStatus = () => {
  const { connectionStatus, error } = useRealtime();

  if (connectionStatus === 'connected' && !error) {
    return null; // Don't show anything when connected
  }

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connecting':
        return {
          icon: '🔄',
          text: 'Connecting...',
          className: 'connecting',
          showSpinner: true
        };
      case 'offline':
        return {
          icon: '📡',
          text: 'You are offline',
          className: 'offline',
          showSpinner: false
        };
      case 'error':
        return {
          icon: '⚠️',
          text: error || 'Connection error',
          className: 'error',
          showSpinner: false
        };
      default:
        return {
          icon: '✅',
          text: 'Connected',
          className: 'connected',
          showSpinner: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`connection-status ${config.className}`}>
      <div className="status-content">
        <span className="status-icon">
          {config.showSpinner ? (
            <div className="spinner"></div>
          ) : (
            config.icon
          )}
        </span>
        <span className="status-text">{config.text}</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
