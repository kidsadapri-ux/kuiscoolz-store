'use client';

import { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, ShieldCheck, User, Store } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: string; slots: number }) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('BUYER'); // BUYER หรือ SELLER
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        onLoginSuccess({
          name: isRegister ? name || email.split('@')[0] : data.user.name,
          email: data.user.email,
          role: role,
          slots: data.user.slots,
        });
        alert(`🎉 ${isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'} สำเร็จ! ยินดีต้อนรับคุณ ${name || email.split('@')[0]}`);
        onClose();
      } else {
        alert(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      // จำลองล็อกอินสำเร็จถ้ายังไม่ได้ต่อ DB
      onLoginSuccess({
        name: name || email.split('@')[0],
        email: email,
        role: role,
        slots: 5,
      });
      alert(`🎉 เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ ${name || email.split('@')[0]}`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-4">
        
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ Modal */}
        <div className="text-center space-y-1">
          <div className="bg-black text-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
            {isRegister ? <UserPlus className="w-6 h-6 text-amber-400" /> : <LogIn className="w-6 h-6 text-red-500" />}
          </div>
          <h2 className="text-xl font-black text-gray-900">
            {isRegister ? 'สมัครสมาชิก KUISCOOLZ' : 'เข้าสู่ระบบ KUISCOOLZ'}
          </h2>
          <p className="text-xs text-gray-400">
            {isRegister ? 'สร้างบัญชีเพื่อซื้อ-ขายเสื้อผ้ามือสอง' : 'ยินดีต้อนรับกลับมา! กรอกข้อมูลเพื่อเข้าใช้งาน'}
          </p>
        </div>

        {/* สลับบทบาท ผู้ซื้อ / ผู้ขาย */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('BUYER')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'BUYER' ? 'bg-white text-black shadow-sm' : 'text-gray-500'
            }`}
          >
            <User className="w-3.5 h-3.5" /> บัญชีผู้ซื้อ (Buyer)
          </button>
          <button
            type="button"
            onClick={() => setRole('SELLER')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'SELLER' ? 'bg-black text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-400" /> บัญชีผู้ขาย (Seller)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {/* ชื่อสมาชิก (กรณีสมัครใหม่) */}
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">ชื่อผู้ใช้งาน</label>
              <input
                type="text"
                required
                placeholder="เช่น กฤษฎา ภูมิสายลอน"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-black"
              />
            </div>
          )}

          {/* อีเมล */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> อีเมล
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-black"
            />
          </div>

          {/* รหัสผ่าน */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-gray-400" /> รหัสผ่าน
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-black"
            />
          </div>

          {/* ปุ่มยืนยัน */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md mt-2 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {loading ? 'กำลังดำเนินการ...' : isRegister ? 'ลงทะเบียนใช้งาน' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* ปุ่มสลับหน้า Login / Register */}
        <div className="text-center pt-2 border-t text-xs text-gray-500">
          {isRegister ? (
            <p>
              มีบัญชีอยู่แล้ว?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-bold text-red-600 hover:underline"
              >
                เข้าสู่ระบบ
              </button>
            </p>
          ) : (
            <p>
              ยังไม่มีบัญชี KUISCOOLZ?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-bold text-red-600 hover:underline"
              >
                สมัครสมาชิกใหม่
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}