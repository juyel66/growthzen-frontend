'use client';

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import AuthInitializer from '@/components/auth/AuthInitializer';

interface ProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}

export { ReduxProvider };
