'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Camera, KeyRound, ShieldCheck, UserCheck } from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [igUsername, setIgUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

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
        // ตรวจสอบว่ามี IG นี้หรือยัง
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('ig_username', cleanIg)
          .maybeSingle();

        if (existingUser) {
          setErrorMsg('ชื่อ Instagram นี้ถูกลงทะเบียนไว้แล้ว กรุณากดเข้าสู่ระบบ');
          setLoading(false);
          return;
        }

        // สมัครสมาชิกใหม่
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              ig_username: cleanIg,
              pin: cleanPin,
              role: 'CUSTOMER',
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        alert('🎉 ลงทะเบียนสำเร็จ เข้าสู่ระบบเรียบร้อย');
        onLoginSuccess({
          name: `@${cleanIg}`,
          ig_username: cleanIg,
          role: newUser?.role || 'CUSTOMER',
        });
      } else {
        // เข้าสู่ระบบด้วย IG + PIN
        const { data: user, error: loginError } = await supabase
          .from('users')
          .select('*')
          .eq('ig_username', cleanIg)
          .eq('pin', cleanPin)
          .maybeSingle();

        if (loginError) throw loginError;

        if (!user) {
          setErrorMsg('ชื่อ IG หรือ PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
          setLoading(false);
          return;
        }

        onLoginSuccess({
          name: `@${user.ig_username}`,
          ig_username: user.ig_username,
          role: user.role || 'CUSTOMER',
        });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 sm:p-8 relative shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Camera className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-xl font-black uppercase text-[#111111]">
            {isRegister ? 'ลงทะเบียนบัญชีใหม่' : 'เข้าสู่ระบบร้านค้า'}
          </h3>
          <p className="text-xs text-gray-500">
            {isRegister ? 'ใช้ชื่อ IG และตั้งรหัส PIN เพื่อสร้างบัญชี' : 'กรอกชื่อ IG และ PIN เพื่อเข้าสู่ระบบ'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-[#111111] block mb-1">ชื่อ Instagram (IG Handle)</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 font-bold text-sm">@</span>
              <input
                required
                type="text"
                placeholder="kuisccolz"
                value={igUsername}
                onChange={(e) => setIgUsername(e.target.value)}
                className="w-full bg-[#f5f5f5] text-xs font-bold pl-8 pr-3.5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#111111] block mb-1">รหัส PIN (4–6 หลัก)</label>
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                required
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-[#f5f5f5] text-xs font-mono font-black tracking-widest pl-9 pr-3.5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-black disabled:bg-gray-400 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 mt-2"
          >
            {loading ? 'กำลังดำเนินการ...' : isRegister ? 'ยืนยันลงทะเบียน' : 'เข้าสู่ระบบทันที'}
          </button>
        </form>

        <div className="text-center pt-2 border-t text-xs">
          {isRegister ? (
            <p className="text-gray-500">
              มีบัญชีอยู่แล้ว?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg('');
                }}
                className="text-black font-bold underline"
              >
                เข้าสู่ระบบที่นี่
              </button>
            </p>
          ) : (
            <p className="text-gray-500">
              ยังไม่มีบัญชี?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg('');
                }}
                className="text-black font-bold underline"
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