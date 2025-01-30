'use client';

import { ReactNode, useState, createContext, useContext } from 'react';

interface HeaderContextType {
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerTitle, setHeaderTitle] = useState('Payment Verification');

  return (
    <HeaderContext.Provider value={{ headerTitle, setHeaderTitle }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeaderContext must be used within a HeaderContextProvider');
  }
  return context;
}