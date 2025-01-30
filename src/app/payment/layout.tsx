'use client';

import { ReactNode } from 'react';
import { HeaderProvider } from './context/header-context';

interface LayoutProps {
  children: ReactNode;
}

export default function PaymentLayout({ children }: LayoutProps) {
  return (
    <HeaderProvider>
      <div className="min-h-screen bg-[#f6f6f6]">
        {children}
      </div>
    </HeaderProvider>
  );
}
