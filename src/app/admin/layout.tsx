'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShieldCheck, 
  FileText, 
  Store,
  Gavel
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'ภาพรวม (Dashboard)', href: '/admin', icon: LayoutDashboard },
    { name: 'จัดการสินค้าทั้งหมด', href: '/admin/products', icon: Package },
    { name: 'จัดการระบบประมูล', href: '/admin/auction', icon: Gavel },
    { name: 'จัดการสลิปเครดิต', href: '/admin/credits', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans flex flex-col md:flex-row antialiased">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black text-white p-5 flex flex-col justify-between border-r-2 border-black">
        <div className="space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <Link href="/admin" className="block">
              <span className="text-2xl font-black italic tracking-tighter uppercase">
                KUISCOOL<span className="text-red-600">Z</span>
              </span>
              <span className="block text-[10px] text-amber-400 font-extrabold tracking-widest uppercase">
                ADMIN CONTROL CENTER
              </span>
            </Link>
          </div>

          <nav className="space-y-1.5 text-xs font-black">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition-all uppercase tracking-wider ${
                    isActive
                      ? 'bg-neutral-800 text-white border-l-4 border-red-600'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-800 space-y-2 text-xs font-black">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>กลับไปหน้าร้านค้า</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b-2 border-gray-200 h-16 px-6 flex items-center justify-between shadow-sm">
          <div className="text-xs font-black text-gray-500 uppercase tracking-wider">
            ระบบจัดการหลังบ้าน • KUISCOOLZ Official
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black px-3 py-1 rounded-xl">
              <ShieldCheck className="w-4 h-4" /> ADMIN VERIFIED
            </div>
            <span className="text-xs font-black text-black">เจ้าของร้าน</span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}