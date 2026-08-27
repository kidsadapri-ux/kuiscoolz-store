'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, KeyRound, AlertCircle } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }

  const [isRegister, setIsRegister] = useState(false);
  const [igUsername, setIgUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleModalClose = () => {
    setErrorMsg('');
    setPin('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanIg = igUsername.trim().replace(/^@/, '').toLowerCase();
    const cleanPin = pin.trim();

    if (!cleanIg) return setErrorMsg('กรุณากรอกชื่อ Instagram');
    if (cleanPin.length < 4) return setErrorMsg('รหัส PIN ต้องมีอย่างน้อย 4 หลัก');

    setLoading(true);

    try {
      if (isRegister) {
        // สมัครสมาชิกผ่าน Secure Database Function
        const { data, error } = await supabase.rpc('register_user', {
          new_ig: cleanIg,
          new_pin: cleanPin,
        });

        if (error) {
          if (error.message.includes('ถูกลงทะเบียนไว้แล้ว')) {
            setErrorMsg('ชื่อ Instagram นี้ถูกลงทะเบียนไว้แล้ว กรุณากดเข้าสู่ระบบ');
          } else {
            throw error;
          }
          return;
        }

        const registeredUser = data[0];
        const userData = {
          id: registeredUser.id,
          name: `@${cleanIg}`,
          ig_username: cleanIg,
          role: registeredUser.role || 'CUSTOMER',
        };

        localStorage.setItem('kuiscoolz_user', JSON.stringify(userData));
        onLoginSuccess(userData);
        handleModalClose();
      } else {
        // เข้าสู่ระบบผ่าน Secure Database Function
        const { data, error } = await supabase.rpc('verify_user_login', {
          user_identifier: cleanIg,
          input_pin: cleanPin,
        });

        if (error) throw error;

        if (!data || data.length === 0) {
          setErrorMsg('ชื่อ IG หรือ PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
          return;
        }

        const user = data[0];
        const userData = {
          id: user.id,
          name: `@${user.ig_username}`,
          ig_username: user.ig_username,
          role: user.role || 'CUSTOMER',
        };

        localStorage.setItem('kuiscoolz_user', JSON.stringify(userData));
        onLoginSuccess(userData);
        handleModalClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] text-[#111111] rounded-3xl w-full max-w-sm p-6 sm:p-8 relative shadow-2xl space-y-5 border border-[#e5e5e5]">
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f5f5f5] text-[#707072] hover:text-[#111111] transition-all active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-[#111111] text-[#ffffff] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            <InstagramIcon className="w-6 h-6 text-[#ffffff]" />
          </div>
          <h3 className="text-lg sm:text-xl font-black uppercase text-[#111111] tracking-tight">
            {isRegister ? 'ลงทะเบียนบัญชีใหม่' : 'เข้าสู่ระบบร้านค้า'}
          </h3>
          <p className="text-xs text-[#707072] font-medium leading-relaxed">
            {isRegister ? 'ใช้ชื่อ IG และตั้งรหัส PIN เพื่อสร้างบัญชี' : 'กรอกชื่อ IG และ PIN เพื่อเข้าสู่ระบบ'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-[#d30005]/10 text-[#d30005] text-xs p-3 rounded-2xl font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#111111] uppercase tracking-wide block">ชื่อ Instagram</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#707072] font-bold text-sm">@</span>
              <input
                required
                type="text"
                placeholder="your_ig"
                value={igUsername}
                onChange={(e) => setIgUsername(e.target.value)}
                className="w-full bg-[#f5f5f5] focus:bg-[#ffffff] text-[#111111] placeholder-[#707072] border border-[#cacacb] focus:border-[#111111] text-xs font-bold pl-9 pr-4 py-3 rounded-full outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#111111] uppercase tracking-wide block">รหัส PIN (4–6 หลัก)</label>
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-[#707072] absolute left-4" />
              <input
                required
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-[#f5f5f5] focus:bg-[#ffffff] text-[#111111] placeholder-[#707072] border border-[#cacacb] focus:border-[#111111] text-sm font-mono font-black tracking-widest pl-11 pr-4 py-3 rounded-full outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-black disabled:bg-[#cacacb] text-[#ffffff] font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 mt-2"
          >
            {loading ? 'กำลังดำเนินการ...' : isRegister ? 'ยืนยันลงทะเบียน' : 'เข้าสู่ระบบทันที'}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-[#e5e5e5] text-xs">
          {isRegister ? (
            <p className="text-[#707072] font-medium">
              มีบัญชีอยู่แล้ว?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg('');
                }}
                className="text-[#111111] font-bold hover:underline ml-1"
              >
                เข้าสู่ระบบที่นี่
              </button>
            </p>
          ) : (
            <p className="text-[#707072] font-medium">
              ยังไม่มีบัญชี?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg('');
                }}
                className="text-[#111111] font-bold hover:underline ml-1"
              >
                สมัครสมาชิกด้วย IG
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}