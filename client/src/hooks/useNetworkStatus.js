// src/hooks/useNetworkStatus.js

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for monitoring network connectivity status
 * Provides online status, connection type, and data-saving mode functionality
 * Especially useful for users in areas with limited connectivity
 */
const useNetworkStatus = () => {
  // Track basic online/offline status
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Track connection type (4G, 3G, 2G, etc.) if available
  const [connectionType, setConnectionType] = useState(null);
  
  // Track connection quality
  const [connectionQuality, setConnectionQuality] = useState('unknown');
  
  // Data-saving mode toggle (persisted in localStorage)
  const [isSavingData, setIsSavingData] = useState(
    localStorage.getItem('data-saving-mode') === 'true'
  );

  // Last time we were online (useful for showing "last updated" info)
  const [lastOnlineTime, setLastOnlineTime] = useState(
    isOnline ? new Date() : null
  );

  // Update online status
  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setLastOnlineTime(new Date());
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  // Toggle data-saving mode
  const toggleDataSavingMode = useCallback(() => {
    const newValue = !isSavingData;
    setIsSavingData(newValue);
    localStorage.setItem('data-saving-mode', newValue.toString());
  }, [isSavingData]);

  // Detect connection type change
  const handleConnectionChange = useCallback(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      // Get connection type
      setConnectionType(connection.effectiveType);
      
      // Determine connection quality based on effective type
      switch (connection.effectiveType) {
        case '4g':
          setConnectionQuality('excellent');
          break;
        case '3g':
          setConnectionQuality('good');
          break;
        case '2g':
          setConnectionQuality('poor');
          break;
        case 'slow-2g':
          setConnectionQuality('very-poor');
          break;
        default:
          setConnectionQuality('unknown');
      }
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    // Add online/offline event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check network information if available
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      // Set initial values
      setConnectionType(connection.effectiveType);
      
      // Add connection change listener
      connection.addEventListener('change', handleConnectionChange);
      
      // Initial connection quality check
      handleConnectionChange();
    }

    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [handleOnline, handleOffline, handleConnectionChange]);

  // Periodically check connection status (as events may not always fire reliably)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (navigator.onLine !== isOnline) {
        setIsOnline(navigator.onLine);
        if (navigator.onLine) {
          setLastOnlineTime(new Date());
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [isOnline]);

  /**
   * Get recommended image quality based on connection and data saving preferences
   * @returns {'high'|'medium'|'low'} Recommended image quality
   */
  const getRecommendedImageQuality = useCallback(() => {
    if (isSavingData) return 'low';
    if (!isOnline) return 'low';
    
    switch (connectionQuality) {
      case 'excellent':
        return 'high';
      case 'good':
        return 'medium';
      case 'poor':
      case 'very-poor':
        return 'low';
      default:
        return 'medium';
    }
  }, [isOnline, connectionQuality, isSavingData]);

  /**
   * Check if we should enable complex UI animations based on connection
   */
  const shouldEnableAnimations = useCallback(() => {
    if (isSavingData) return false;
    return connectionQuality === 'excellent' || connectionQuality === 'good';
  }, [connectionQuality, isSavingData]);

  /**
   * Format the last online time in a human-readable way
   */
  const getLastOnlineFormatted = useCallback(() => {
    if (!lastOnlineTime) return 'Unknown';
    
    // For recent times, show relative time
    const now = new Date();
    const diffMs = now - lastOnlineTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    // For older times, show the actual date/time
    return lastOnlineTime.toLocaleString();
  }, [lastOnlineTime]);

  return {
    // Basic network status
    isOnline,
    connectionType,
    connectionQuality,
    lastOnlineTime,
    getLastOnlineFormatted,
    
    // Data saving features
    isSavingData,
    toggleDataSavingMode,
    
    // Helper functions for optimizing UI based on connection
    getRecommendedImageQuality,
    shouldEnableAnimations,
    
    // Derived helpers
    isLowBandwidth: connectionType === '2g' || connectionType === 'slow-2g',
    isHighLatency: connectionQuality === 'poor' || connectionQuality === 'very-poor',
    shouldUseLiteMode: isSavingData || connectionQuality === 'poor' || connectionQuality === 'very-poor'
  };
};

export default useNetworkStatus;