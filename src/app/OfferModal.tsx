'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Handshake, Send, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name?: string; ig_username?: string } | null;
  onRequireAuth: () => void;
  onOfferSuccess?: () => void;
  product: any;
}

export default function OfferModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onRequireAuth, 
  onOfferSuccess, 
  product 
}: OfferModalProps) {
  const [offeredPrice, setOfferedPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !product) return null;

  const handleModalClose = () => {
    setOfferedPrice('');
    setIsSuccess(false);
    setErrorMsg('');
    onClose();
  };

  // ตรวจสอบการเข้าสู่ระบบ
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <div className="bg-[#ffffff] text-[#111111] rounded-3xl w-full max-w-sm p-6 sm:p-8 relative shadow-2xl space-y-5 text-center border border-[#e5e5e5]">
          <button 
            onClick={handleModalClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f5f5f5] text-[#707072] hover:text-[#111111] transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-[#d30005]/10 text-[#d30005] rounded-full flex items-center justify-center mx-auto">
            <Handshake className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#111111] uppercase tracking-tight">กรุณาเข้าสู่ระบบ</h3>
            <p className="text-xs text-[#707072] font-medium leading-relaxed">เข้าสู่ระบบเพื่อส่งข้อเสนอต่อรองราคาสำหรับบัญชีของคุณ</p>
          </div>

          <div className="pt-1">
            <button
              onClick={() => { handleModalClose(); onRequireAuth(); }}
              className="w-full bg-[#111111] hover:bg-black text-[#ffffff] font-bold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 uppercase tracking-wider transition-all active:scale-95 shadow-md"
            >
              <LogIn className="w-4 h-4" /> เข้าสู่ระบบ / สมัครสมาชิก
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeredPrice || Number(offeredPrice) <= 0) {
      setErrorMsg('กรุณาระบุราคาที่ต้องการต่อรอง');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.from('offers').insert([
        {
          product_id: product.id,
          product_title: product.title,
          original_price: Number(product.price),
          offered_price: Number(offeredPrice),
          customer_ig: currentUser.ig_username,
          status: 'PENDING',
        }
      ]);

      if (error) throw error;

      // แสดง Success UI แทน alert browser
      setIsSuccess(true);
      if (onOfferSuccess) onOfferSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] text-[#111111] rounded-3xl w-full max-w-md p-5 sm:p-7 relative shadow-2xl space-y-5 border border-[#e5e5e5]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3.5">
          <div className="flex items-center gap-2.5">
            <Handshake className="w-5 h-5 text-[#111111]" />
            <h2 className="text-lg sm:text-xl font-black text-[#111111] uppercase tracking-tight">
              {isSuccess ? 'สถานะข้อเสนอ' : 'ยื่นข้อเสนอต่อรองราคา'}
            </h2>
          </div>
          <button 
            onClick={handleModalClose} 
            className="p-1.5 rounded-full hover:bg-[#f5f5f5] text-[#707072] hover:text-[#111111] transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View (แทนที่ alert แบบเดิม) */}
        {isSuccess ? (
          <div className="py-6 sm:py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#007d48]/10 text-[#007d48] rounded-full flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            
            <div className="space-y-1.5 px-2">
              <h4 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#111111]">
                ส่งข้อเสนอต่อรองราคาเรียบร้อย!
              </h4>
              <p className="text-xs text-[#707072] leading-relaxed font-medium">
                เมื่อร้านกดยอมรับราคาจะปรับลดที่หน้าร้าน
              </p>
            </div>

            {/* กล่องสรุปราคาที่ยื่น */}
            <div className="bg-[#f5f5f5] rounded-2xl p-4 border border-[#e5e5e5] space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#707072]">
                <span>สินค้า:</span>
                <span className="font-bold text-[#111111] truncate max-w-[200px]">{product.title}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#cacacb]/40">
                <span className="font-bold text-[#111111]">ราคาที่คุณเสนอ:</span>
                <span className="font-mono font-black text-base text-[#d30005]">
                  ฿{Number(offeredPrice).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleModalClose}
              className="w-full bg-[#111111] hover:bg-black text-[#ffffff] font-bold py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              ตกลง / ปิดหน้าต่าง
            </button>
          </div>
        ) : (
          <>
            {/* Product Info Box */}
            <div className="bg-[#f5f5f5] p-4 rounded-2xl border border-[#e5e5e5] flex justify-between items-center text-xs gap-4">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] text-[#707072] font-bold uppercase tracking-wider block">สินค้า:</span>
                <span className="font-bold text-[#111111] truncate block max-w-[200px]">{product.title}</span>
              </div>
              <div className="text-right shrink-0 space-y-0.5">
                <span className="text-[10px] text-[#707072] font-bold uppercase tracking-wider block">ราคาป้าย:</span>
                <span className="font-mono font-black text-sm sm:text-base text-[#111111] tracking-tight">฿{Number(product.price).toLocaleString()}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOffer} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold block text-[#111111] uppercase tracking-wide">ราคาที่คุณต้องการเสนอ (บาท) *</label>
                <input
                  type="number"
                  required
                  placeholder="ระบุราคาที่ต้องการ..."
                  value={offeredPrice}
                  onChange={(e) => {
                    setOfferedPrice(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full bg-[#f5f5f5] focus:bg-[#ffffff] text-[#111111] placeholder-[#707072] border border-[#cacacb] focus:border-[#111111] rounded-full px-5 py-3 text-sm font-black text-[#d30005] outline-none transition-all"
                />
                <p className="text-[11px] text-[#707072] font-medium pl-2">
                  ยื่นข้อเสนอในนามบัญชี IG: <span className="font-bold text-[#111111]">@{currentUser.ig_username}</span>
                </p>
              </div>

              {errorMsg && (
                <div className="bg-[#d30005]/10 text-[#d30005] p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111111] hover:bg-black disabled:bg-[#cacacb] text-[#ffffff] font-bold py-3.5 rounded-full uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Send className="w-4 h-4 text-[#ffffff]" /> 
                <span>{loading ? 'กำลังส่งข้อเสนอ...' : 'ยืนยันส่งข้อเสนอ'}</span>
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}