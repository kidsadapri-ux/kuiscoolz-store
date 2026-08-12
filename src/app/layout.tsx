import type { Metadata } from 'next';
import { StoreProvider } from './context/StoreContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'KUISCOOLZ — ร้านที่ให้มากกว่าแฟชั่น',
  description: 'ศูนย์รวมแฟชั่นมือสอง เช็กสัดส่วน & สภาพจริง',
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