import type { Metadata } from 'next';
import { StoreProvider } from './context/StoreContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'BILLIONX — ร้านที่ให้มากกว่าแฟชั่น',
  description: 'รับประกันของแท้ทุกชิ้น',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-white text-black font-sans antialiased">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}