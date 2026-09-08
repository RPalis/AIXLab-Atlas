import { useState, useEffect } from 'react';

export function useMockStore<T>(key: string, initialData: T[]) {
  const [data, setData] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(`proto_${key}`);
      return stored ? JSON.parse(stored) : initialData;
    } catch {
      return initialData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`proto_${key}`, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [key, data]);

  const addItem = (item: T) => setData(prev => [item, ...prev]);
  
  const updateItem = (predicate: (item: T) => boolean, updater: (item: T) => T) => {
    setData(prev => prev.map(item => predicate(item) ? updater(item) : item));
  };

  const removeItem = (predicate: (item: T) => boolean) => {
    setData(prev => prev.filter(item => !predicate(item)));
  };

  const resetData = () => setData(initialData);

  return {
    data,
    addItem,
    updateItem,
    removeItem,
    resetData,
  };
}
