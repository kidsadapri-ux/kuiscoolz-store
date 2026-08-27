import type { Metadata, Viewport } from 'next';
import { StoreProvider } from './context/StoreContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'KUISCOOLZ — ร้านที่ให้มากกว่าแฟชั่น',
  description: 'รับประกันของแท้ทุกชิ้น',
};

// บังคับขนาดหน้าจอให้เปิดเป็น Desktop Mode (กว้าง 1280px) บนมือถือทุกเครื่อง
export const viewport: Viewport = {
  width: 1280,
  initialScale: 0.3, // ปรับให้ย่อสเกลพอดีกับหน้าจอมือถือ
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-white text-black font-sans antialiased min-w-[1280px]">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}