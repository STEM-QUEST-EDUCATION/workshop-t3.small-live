'use client';

import { useHeaderContext } from '../context/header-context';

export default function Header() {
  const { headerTitle } = useHeaderContext();
  
  return (
    <header>
      <h1>{headerTitle}</h1>
    </header>
  );
}