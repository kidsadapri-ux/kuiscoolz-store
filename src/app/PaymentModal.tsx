'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Copy, Check, Image as ImageIcon, CreditCard, ShieldCheck } from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
}

export default function PaymentModal({ isOpen, onClose, orderData }: PaymentModalProps) {
  const [slipPreview, setSlipPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ข้อมูลบัญชีธนาคารสำหรับโอนเงิน
  const bankInfo = {
    bankName: 'ธนาคารกรุงไทย (Krungthai)',
    accountNumber: '...', // ใส่เลขบัญชีของคุณที่นี่
    accountName: '... (เท่านั้น)',
  };

  if (!isOpen || !orderData) return null;

  // ดึงชื่อสินค้าและยอดเงินอย่างแม่นยำ
  const displayTitle = 
    orderData.productTitle || 
    orderData.product_title || 
    orderData.title || 
    orderData.product?.title || 
    'สินค้าแฟชั่น';

  const displayAmount = 
    orderData.amount ?? 
    orderData.price ?? 
    orderData.totalPrice ?? 
    orderData.product?.price ?? 
    0;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return alert('กรุณาเลือกไฟล์สลิปขนาดไม่เกิน 5 MB');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSlipPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitSlip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipPreview) {
      return alert('กรุณาแนบรูปภาพสลิปโอนเงิน');
    }

    setLoading(true);
    try {
      // 1. อัปเดตข้อมูลสลิปใน Orders (ถ้ามี ID ใน Supabase)
      if (orderData.id && typeof orderData.id === 'string' && !orderData.id.startsWith('ORD-')) {
        await supabase
          .from('orders')
          .update({
            slip_url: slipPreview,
            status: 'PAID',
          })
          .eq('id', orderData.id);
      } else {
        // หากเป็นการสร้าง Order ใหม่
        await supabase.from('orders').insert([
          {
            product_title: displayTitle,
            amount: Number(displayAmount),
            customer_address: orderData.customer_address || orderData.shippingAddress || '-',
            slip_url: slipPreview,
            status: 'PAID',
          }
        ]);
      }

      // 2. ปรับสถานะสินค้าเป็น SOLD_OUT
      const productId = orderData.product_id || orderData.productId || orderData.product?.id;
      if (productId) {
        await supabase
          .from('products')
          .update({ status: 'SOLD_OUT' })
          .eq('id', productId);
      }

      alert('✅ แจ้งชำระเงินเรียบร้อยแล้ว! ทางร้านจะรีบตรวจสอบและจัดส่งสินค้าให้ครับ');
      setSlipPreview('');
      onClose();
    } catch (err: any) {
      console.error('Payment error:', err);
      alert(`แจ้งชำระเงินไม่สำเร็จ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-xl font-black uppercase text-[#111111] tracking-tight">ยืนยันการชำระเงิน</h3>
          <p className="text-xs text-[#707072] font-medium">โอนเงินและแนบหลักฐานเพื่อตัดสต็อกสินค้าทันที</p>
        </div>

        {/* 1. กล่องรายละเอียดสินค้าและยอดโอน (แสดงชื่อสินค้าจริง) */}
        <div className="bg-[#f5f5f5] rounded-2xl p-4 space-y-2 border border-[#e5e5e5]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-bold shrink-0">สินค้า:</span>
            <span className="font-black text-[#111111] text-right truncate max-w-[220px]">
              {displayTitle}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-xs font-bold text-gray-700">ยอดโอนสุทธิ:</span>
            <span className="text-xl font-black text-[#d30005]">
              ฿{Number(displayAmount).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 2. ข้อมูลเลขที่บัญชีธนาคาร */}
        <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#111111] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" /> {bankInfo.bankName}
            </span>
            <button
              type="button"
              onClick={handleCopyAccount}
              className="text-[11px] font-bold bg-white border border-gray-300 px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-gray-100 active:scale-95 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
            </button>
          </div>
          <div className="font-mono font-black text-base text-[#111111] tracking-wider">
            {bankInfo.accountNumber}
          </div>
          <div className="text-[11px] text-gray-500 font-medium">
            ชื่อบัญชี: <span className="font-bold text-black">{bankInfo.accountName}</span>
          </div>
        </div>

        {/* 3. ฟอร์มเลือกไฟล์รูปภาพสลิป */}
        <form onSubmit={handleSubmitSlip} className="space-y-4 text-xs pt-1">
          <div>
            <label className="font-bold block mb-1.5 text-[#111111]">แนบรูปภาพสลิปโอนเงิน *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-black transition-colors bg-[#f5f5f5]">
              {slipPreview ? (
                <div className="space-y-2">
                  <img
                    src={slipPreview}
                    alt="Slip Preview"
                    className="w-36 max-h-48 object-contain mx-auto rounded-xl border shadow-sm bg-white"
                  />
                  <label className="inline-block bg-white border border-gray-300 font-bold px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 text-[11px]">
                    เปลี่ยนรูปสลิป
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block py-4 space-y-2">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                  <div className="font-bold text-gray-700">แตะเพื่อเลือกรูปสลิปจากเครื่อง / อัลบั้ม</div>
                  <div className="text-[10px] text-gray-400">รองรับไฟล์ JPG, PNG (ไม่เกิน 5MB)</div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !slipPreview}
            className="w-full bg-[#d30005] hover:bg-[#780700] disabled:bg-gray-300 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            {loading ? 'กำลังส่งข้อมูลชำระเงิน...' : 'ยืนยันแจ้งชำระเงิน'}
          </button>
        </form>
      </div>
    </div>
  );
}