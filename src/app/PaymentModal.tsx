'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Copy, Check, Image as ImageIcon, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
}

export default function PaymentModal({ isOpen, onClose, orderData }: PaymentModalProps) {
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // ไม่เกิน 5MB
  const [slipPreview, setSlipPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ข้อมูลบัญชีธนาคารสำหรับโอนเงิน
  const bankInfo = {
    bankName: 'ธนาคารกรุงไทย (Krungthai)',
    accountNumber: '663-8-62703-1',
    accountName: 'กฤษฎา ภูมิสายดอน (เท่านั้น)',
  };

  if (!isOpen || !orderData) return null;

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

    // 1. ตรวจสอบขนาดไฟล์
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg('ขนาดไฟล์ใหญ่เกินไป (จำกัดไม่เกิน 5MB)');
      e.target.value = '';
      return;
    }

    // 2. ตรวจสอบ MIME Type จริงของไฟล์
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMsg('รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP) เท่านั้น');
      e.target.value = '';
      return;
    }

    // 3. ตรวจสอบนามสกุลไฟล์ (ป้องกันการตั้งชื่อแบบ double extension เช่น script.php.jpg)
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      setErrorMsg('นามสกุลไฟล์ไม่ถูกต้อง');
      e.target.value = '';
      return;
    }

    setErrorMsg('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setSlipPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleModalClose = () => {
    setSlipPreview('');
    setIsSuccess(false);
    setErrorMsg('');
    onClose();
  };

  const handleSubmitSlip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipPreview) {
      setErrorMsg('กรุณาแนบรูปภาพสลิปโอนเงิน');
      return;
    }

    setLoading(true);
    setErrorMsg('');

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
      // 2. ปรับสถานะสินค้าเป็น SOLD_OUT อย่างปลอดภัยผ่าน RPC
const productId = orderData.product_id || orderData.productId || orderData.product?.id;
if (productId) {
  await supabase.rpc('mark_product_as_sold', {
    target_product_id: productId,
  });
}

      // แสดง Success UI แทน alert browser
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMsg(`แจ้งชำระเงินไม่สำเร็จ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] text-[#111111] rounded-3xl w-full max-w-md p-5 sm:p-7 relative shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-[#e5e5e5]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3.5">
          <div className="space-y-0.5">
            <h3 className="text-lg sm:text-xl font-black uppercase text-[#111111] tracking-tight">
              {isSuccess ? 'สถานะคำสั่งซื้อ' : 'ยืนยันการชำระเงิน'}
            </h3>
            <p className="text-xs text-[#707072] font-medium">
              {isSuccess ? 'บันทึกข้อมูลการชำระเงินเรียบร้อยแล้ว' : 'โอนเงินและแนบหลักฐานเพื่อตัดสต็อกสินค้าทันที'}
            </p>
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
                แจ้งชำระเงินเรียบร้อยแล้ว!
              </h4>
              <p className="text-xs text-[#707072] leading-relaxed font-medium">
                ทางร้านได้รับหลักฐานแล้ว จะรีบตรวจสอบยอดเงินและจัดส่งสินค้าให้โดยเร็วที่สุดครับ
              </p>
            </div>

            <div className="bg-[#f5f5f5] rounded-2xl p-3.5 border border-[#e5e5e5] text-xs font-semibold flex justify-between items-center text-left">
              <span className="text-[#707072]">สินค้า:</span>
              <span className="text-[#111111] font-bold truncate max-w-[200px]">{displayTitle}</span>
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
            {/* 1. กล่องรายละเอียดสินค้าและยอดโอน */}
            <div className="bg-[#f5f5f5] rounded-2xl p-4 space-y-2 border border-[#e5e5e5]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#707072] font-bold shrink-0">สินค้า:</span>
                <span className="font-bold text-[#111111] text-right truncate max-w-[220px]">
                  {displayTitle}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#cacacb]/40">
                <span className="text-xs font-bold text-[#111111]">ยอดโอนสุทธิ:</span>
                <span className="text-2xl font-black text-[#111111] tracking-tight">
                  ฿{Number(displayAmount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* 2. ข้อมูลเลขที่บัญชีธนาคาร */}
            <div className="border border-[#cacacb] rounded-2xl p-4 bg-[#ffffff] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#111111] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#111111]" /> {bankInfo.bankName}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="text-[11px] font-bold bg-[#f5f5f5] text-[#111111] px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#e5e5e5] active:scale-95 transition-all"
                >
                  {copied ? <Check className="w-3 h-3 text-[#007d48]" /> : <Copy className="w-3 h-3 text-[#707072]" />}
                  <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
              </div>
              <div className="font-mono font-black text-base text-[#111111] tracking-wider">
                {bankInfo.accountNumber}
              </div>
              <div className="text-[11px] text-[#707072] font-medium border-t border-[#f5f5f5] pt-1.5">
                ชื่อบัญชี: <span className="font-bold text-[#111111]">{bankInfo.accountName}</span>
              </div>
            </div>

            {/* 3. ฟอร์มเลือกไฟล์รูปภาพสลิป */}
            <form onSubmit={handleSubmitSlip} className="space-y-4 text-xs pt-1">
              <div className="space-y-1.5">
                <label className="font-bold block text-[#111111] uppercase tracking-wide">แนบรูปภาพสลิปโอนเงิน *</label>
                <div className="border-2 border-dashed border-[#cacacb] rounded-2xl p-4 text-center hover:border-[#111111] transition-colors bg-[#f5f5f5]">
                  {slipPreview ? (
                    <div className="space-y-2.5">
                      <img
                        src={slipPreview}
                        alt="Slip Preview"
                        className="w-36 max-h-48 object-contain mx-auto rounded-xl border border-[#cacacb] shadow-xs bg-white"
                      />
                      <div>
                        <label className="inline-block bg-[#ffffff] border border-[#cacacb] font-bold px-4 py-1.5 rounded-full cursor-pointer hover:bg-[#f5f5f5] text-[11px] text-[#111111] active:scale-95 transition-all">
                          เปลี่ยนรูปสลิป
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-4 space-y-2">
                      <ImageIcon className="w-8 h-8 text-[#707072] mx-auto" />
                      <div className="font-bold text-[#111111]">แตะเพื่อเลือกรูปสลิปจากเครื่อง / อัลบั้ม</div>
                      <div className="text-[10px] text-[#707072]">รองรับไฟล์ JPG, PNG (ไม่เกิน 5MB)</div>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="bg-[#d30005]/10 text-[#d30005] p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !slipPreview}
                className="w-full bg-[#111111] hover:bg-black disabled:bg-[#cacacb] text-[#ffffff] font-bold py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                {loading ? 'กำลังส่งข้อมูลชำระเงิน...' : 'ยืนยันแจ้งชำระเงิน'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}