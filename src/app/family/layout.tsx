'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔑 รหัสผ่านเข้าหลังบ้าน
  const ADMIN_PASSWORD = 'idieforfamily';

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-500">กำลังโหลด...</p>
      </div>
    );
  }

  // 🔒 หน้ากรอกรหัสผ่าน
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-sm w-full space-y-5 shadow-2xl"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black tracking-wider text-red-500">
              KUISCOOLZ
            </h1>
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Admin Access Lock
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="กรอกรหัสผ่านหลังบ้าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-center tracking-widest outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs text-center font-medium">
                รหัสผ่านไม่ถูกต้อง!
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 font-bold py-3 rounded-xl text-white transition-all shadow-lg shadow-red-600/30"
          >
            ปลดล็อกเข้าระบบ
          </button>
        </form>
      </div>
    );
  }

  // ✅ โครงสร้าง Layout เดิม (Sidebar ซ้าย + Header บน + เนื้อหาตรงกลาง)
  return (
    <div className="min-h-screen bg-zinc-100 flex text-zinc-900">
      {/* 🟢 แถบ Sidebar ด้านซ้ายสีดำ */}
      <aside className="w-64 bg-black text-white flex flex-col justify-between p-6 shrink-0 min-h-screen">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-black italic tracking-wider text-white">
              KUISCOOLZ
            </h1>
            <p className="text-[10px] text-zinc-400 tracking-widest font-bold mt-0.5">
              ADMIN CONTROL CENTER
            </p>
          </div>

          {/* รายการเมนู */}
          <nav className="space-y-2 text-sm font-medium">
            <Link
              href="/family"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-white font-bold border border-zinc-800 hover:bg-zinc-800 transition-all"
            >
              <span>📊</span> ภาพรวม (DASHBOARD)
            </Link>
            <Link
              href="/family/products"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            >
              <span>📦</span> จัดการสินค้าทั้งหมด
            </Link>
            <Link
              href="/family/auction"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            >
              <span>🔨</span> จัดการระบบประมูล
            </Link>
            <Link
              href="/family/credits"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            >
              <span>💳</span> จัดการสลิปเครดิต
            </Link>
          </nav>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
          >
            🏠 กลับไปหน้าร้านค้า
          </Link>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 rounded-xl bg-red-950/40 border border-red-900/50 text-xs text-red-400 hover:bg-red-900/60 transition-all"
          >
            🔒 ล็อกหน้าจอ (Logout)
          </button>
        </div>
      </aside>

      {/* ⚪ พื้นที่เนื้อหาหลักด้านขวา */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header แถบด้านบน */}
        <header className="h-16 border-b border-zinc-200 px-8 flex items-center justify-between bg-white shrink-0">
          <div className="text-xs text-zinc-500 font-medium">
            ระบบจัดการหลังบ้าน • <span className="font-bold text-zinc-800">KUISCOOLZ OFFICIAL</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
              🛡️ ADMIN VERIFIED
            </span>
            <span className="text-xs font-bold text-zinc-700">เจ้าของร้าน</span>
          </div>
        </header>

        {/* หน้า Page ย่อย */}
        <main className="p-8 flex-1 overflow-auto bg-zinc-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}