// Loading utility for consistent loading states
import React from 'react';
import { logger } from './logger';

class LoadingManager {
  constructor() {
    this.loadingStates = new Map();
    this.subscribers = new Set();
  }

  // Set loading state for a specific key
  setLoading(key, isLoading = true) {
    this.loadingStates.set(key, isLoading);
    this.notifySubscribers();
    logger.debug(`Loading state changed for ${key}: ${isLoading}`);
  }

  // Get loading state for a specific key
  isLoading(key) {
    return this.loadingStates.get(key) || false;
  }

  // Check if any loading state is active
  isAnyLoading() {
    return Array.from(this.loadingStates.values()).some(Boolean);
  }

  // Get all loading states
  getAllLoadingStates() {
    return Object.fromEntries(this.loadingStates);
  }

  // Clear loading state for a specific key
  clearLoading(key) {
    this.loadingStates.delete(key);
    this.notifySubscribers();
    logger.debug(`Loading state cleared for ${key}`);
  }

  // Clear all loading states
  clearAll() {
    this.loadingStates.clear();
    this.notifySubscribers();
    logger.debug('All loading states cleared');
  }

  // Subscribe to loading state changes
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Notify all subscribers
  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.getAllLoadingStates());
      } catch (error) {
        logger.error('Error in loading subscriber:', error);
      }
    });
  }
}

// Create singleton instance
const loadingManager = new LoadingManager();

// Loading spinner component
export const LoadingSpinner = ({ size = 'md', color = 'blue', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]} ${className}`} />
  );
};

// Loading overlay component
export const LoadingOverlay = ({ message = 'Loading...', show = false, className = '' }) => {
  if (!show) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Loading button component
export const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false, 
  onClick, 
  className = '',
  loadingText = 'Loading...',
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center space-x-2 ${className}`}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
};

// Loading skeleton component
export const LoadingSkeleton = ({ 
  type = 'text', 
  lines = 1, 
  className = '',
  height = 'h-4',
  width = 'w-full'
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`animate-pulse bg-gray-300 rounded ${height} ${width} ${className}`} />
        );
      case 'card':
        return (
          <div className={`animate-pulse bg-gray-300 rounded-lg ${height} ${width} ${className}`} />
        );
      case 'avatar':
        return (
          <div className={`animate-pulse bg-gray-300 rounded-full ${height} ${width} ${className}`} />
        );
      case 'image':
        return (
          <div className={`animate-pulse bg-gray-300 rounded ${height} ${width} ${className}`} />
        );
      default:
        return (
          <div className={`animate-pulse bg-gray-300 rounded ${height} ${width} ${className}`} />
        );
    }
  };

  if (lines === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={i === lines - 1 ? 'w-3/4' : 'w-full'}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// Hook for loading states
export const useLoading = (key) => {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = loadingManager.subscribe((states) => {
      setIsLoading(states[key] || false);
    });
    return unsubscribe;
  }, [key]);

  const setLoading = React.useCallback((loading) => {
    loadingManager.setLoading(key, loading);
  }, [key]);

  return [isLoading, setLoading];
};

// Export the loading manager
export default loadingManager;

// Convenience functions
export const setLoading = (key, loading = true) => {
  loadingManager.setLoading(key, loading);
};

export const isLoading = (key) => {
  return loadingManager.isLoading(key);
};

export const clearLoading = (key) => {
  loadingManager.clearLoading(key);
};

export const clearAllLoading = () => {
  loadingManager.clearAll();
}; 