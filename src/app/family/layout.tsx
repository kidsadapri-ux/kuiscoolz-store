'use client';

import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔑 ตั้งรหัสผ่านเข้าหลังบ้านตรงนี้ (เปลี่ยนเป็นรหัสที่คุณต้องการได้เลย)
  const ADMIN_PASSWORD = 'i die for family';

  useEffect(() => {
    // เช็กว่าเคยกรอกรหัสผ่านผ่านแล้วหรือยังใน Session นี้
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
        <p className="text-zinc-500">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  // 🔒 ถ้ายังไม่ผ่านการใส่รหัส ให้แสดงหน้าจอนี้
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

  // ✅ เมื่อใส่รหัสผ่านถูกต้อง จะแสดงหน้า Admin ปกติ พร้อมปุ่มล็อกหน้าจอด้านบนขวา
  return (
    <div className="relative min-h-screen bg-zinc-950">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 transition-all shadow-md"
        >
          🔒 ล็อกหน้าจอ (Logout)
        </button>
      </div>
      {children}
    </div>
  );
}