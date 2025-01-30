// src/app/layout.tsx
import { nunito } from "@/styles/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable}`}>
      <body className="no-select">{children}</body> 
    </html>
  );
}
