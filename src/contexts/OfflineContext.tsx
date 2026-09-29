import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OfflineContextType {
  isOnline: boolean;
  isOffline: boolean;
  syncQueue: any[];
  addToSyncQueue: (action: any) => Promise<void>;
  clearSyncQueue: () => Promise<void>;
  syncData: () => Promise<void>;
  cacheData: (key: string, data: any) => Promise<void>;
  getCachedData: (key: string) => Promise<any>;
  checkConnection: () => Promise<boolean>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

const SYNC_QUEUE_KEY = '@sync_queue';
const CACHE_PREFIX = '@cache_';

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);

  useEffect(() => {
    // Load sync queue on mount
    loadSyncQueue();

    // Simulate network check (in real app, use NetInfo or fetch)
    const checkNetwork = async () => {
      try {
        // Simple network check
        const response = await fetch('https://www.google.com', { 
          method: 'HEAD',
          cache: 'no-cache',
          timeout: 5000
        });
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkNetwork();
    
    // Check network every 30 seconds
    const interval = setInterval(checkNetwork, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadSyncQueue = async () => {
    try {
      const queue = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      if (queue) {
        setSyncQueue(JSON.parse(queue));
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  };

  const addToSyncQueue = async (action: any) => {
    try {
      const newQueue = [...syncQueue, { ...action, timestamp: Date.now() }];
      setSyncQueue(newQueue);
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(newQueue));
      
      // If online, try to sync immediately
      if (isOnline) {
        await syncData();
      }
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
    }
  };

  const clearSyncQueue = async () => {
    try {
      setSyncQueue([]);
      await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Failed to clear sync queue:', error);
    }
  };

  const syncData = async () => {
    if (!isOnline || syncQueue.length === 0) return;

    try {
      // Process each item in the sync queue
      for (const action of syncQueue) {
        // In a real app, this would make API calls to sync with server
        console.log('Syncing action:', action);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Clear the queue after successful sync
      await clearSyncQueue();
    } catch (error) {
      console.error('Failed to sync data:', error);
    }
  };

  // Manual network check method
  const checkConnection = async () => {
    try {
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      const wasOffline = !isOnline;
      setIsOnline(true);
      
      // If we just came back online, try to sync
      if (wasOffline) {
        await syncData();
      }
      return true;
    } catch (error) {
      setIsOnline(false);
      return false;
    }
  };

  const cacheData = async (key: string, data: any) => {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  };

  const getCachedData = async (key: string) => {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Check if cache is still valid (24 hours)
        const isCacheValid = Date.now() - timestamp < 24 * 60 * 60 * 1000;
        if (isCacheValid) {
          return data;
        } else {
          // Remove expired cache
          await AsyncStorage.removeItem(cacheKey);
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  };

  const value = {
    isOnline,
    isOffline: !isOnline,
    syncQueue,
    addToSyncQueue,
    clearSyncQueue,
    syncData,
    cacheData,
    getCachedData,
    checkConnection,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}