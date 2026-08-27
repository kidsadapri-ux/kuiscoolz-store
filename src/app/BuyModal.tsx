'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingBag, MapPin, CreditCard, User, LogIn, ChevronRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name?: string; ig_username?: string; address?: string } | null;
  onRequireAuth: () => void;
  onSuccessPayment?: (orderInfo: any) => void;
  product: {
    id: string;
    title: string;
    price: number;
    brand: string;
    image: string;
  } | null;
}

export default function BuyModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onRequireAuth, 
  onSuccessPayment, 
  product 
}: BuyModalProps) {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PROMPTPAY');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.address) {
      setAddress(currentUser.address);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !product) return null;

  // ถ้ายังไม่ล็อกอิน แสดงปุ่มแจ้งเตือนให้เข้าสู่ระบบก่อน
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <div className="bg-[#ffffff] text-[#111111] rounded-3xl w-full max-w-sm p-6 sm:p-8 relative shadow-2xl space-y-5 text-center border border-[#e5e5e5]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f5f5f5] text-[#707072] hover:text-[#111111] transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-[#d30005]/10 text-[#d30005] rounded-full flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#111111] uppercase tracking-tight">กรุณาเข้าสู่ระบบ</h3>
            <p className="text-xs text-[#707072] font-medium leading-relaxed">
              เข้าสู่ระบบด้วยบัญชี IG เพื่อสั่งซื้อและติดตามสถานะพัสดุ
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                onClose();
                onRequireAuth();
              }}
              className="w-full bg-[#111111] hover:bg-black text-[#ffffff] font-bold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 uppercase tracking-wider transition-all active:scale-95 shadow-md"
            >
              <LogIn className="w-4 h-4" /> เข้าสู่ระบบ / สมัครสมาชิก
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return alert('กรุณากรอกที่อยู่จัดส่ง');

    setLoading(true);

    try {
      // บันทึกคำสั่งซื้อพร้อมผูก user_ig (Logic เดิม)
      const { data: newOrder, error } = await supabase
        .from('orders')
        .insert([
          {
            product_id: product.id,
            product_title: product.title,
            amount: Number(product.price),
            customer_name: currentUser.name || currentUser.ig_username,
            customer_address: address.trim(),
            user_ig: currentUser.ig_username, // ผูกกับบัญชีลูกค้า
            payment_method: paymentMethod,
            status: 'PENDING',
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (onSuccessPayment) {
        onSuccessPayment({
          id: newOrder?.id,
          product_id: product.id,
          productTitle: product.title,
          product_title: product.title,
          title: product.title,
          amount: Number(product.price),
          price: Number(product.price),
          customer_address: address.trim(),
          user_ig: currentUser.ig_username,
          payment_method: paymentMethod,
        });
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      alert(`สั่งซื้อไม่สำเร็จ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] text-[#111111] rounded-3xl w-full max-w-lg p-5 sm:p-7 relative shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-[#e5e5e5]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#111111]" />
            <h2 className="text-lg font-black text-[#111111] uppercase tracking-tight">สรุปรายการสั่งซื้อ</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#707072] bg-[#f5f5f5] px-3 py-1 rounded-full border border-[#e5e5e5]">
              บัญชี: <span className="text-[#111111]">@{currentUser.ig_username}</span>
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f5f5f5] text-[#707072] hover:text-[#111111] transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* รายละเอียดสินค้า (Product Stage) */}
        <div className="flex gap-4 bg-[#f5f5f5] p-3.5 sm:p-4 rounded-2xl border border-[#e5e5e5] items-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#cacacb] bg-[#ffffff] shrink-0"
          />
          <div className="flex-1 space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-[#707072] uppercase tracking-wider block">
              {product.brand || 'VINTAGE'}
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-[#111111] line-clamp-1">{product.title}</h3>
            <div className="text-base sm:text-lg font-black text-[#111111] tracking-tight pt-0.5">
              ฿{Number(product.price).toLocaleString()}
            </div>
          </div>
        </div>

        {/* ฟอร์มข้อมูลสั่งซื้อ */}
        <form onSubmit={handleConfirmOrder} className="space-y-4">
          
          {/* ข้อมูลที่อยู่ */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5 uppercase tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-[#d30005]" /> 
              <span>ที่อยู่จัดส่ง และเบอร์โทรติดต่อ *</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="ระบุชื่อ-นามสกุล, เบอร์โทรศัพท์, บ้านเลขที่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-transparent focus:border-[#111111] rounded-2xl p-3.5 text-xs font-medium bg-[#f5f5f5] focus:bg-[#ffffff] outline-none transition-all resize-none"
            />
          </div>

          {/* วิธีการชำระเงิน (Pill Toggle) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5 uppercase tracking-wide">
              <CreditCard className="w-3.5 h-3.5 text-[#111111]" /> 
              <span>วิธีการชำระเงิน</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('PROMPTPAY')}
                className={`py-3 px-4 rounded-full font-bold text-center transition-all flex items-center justify-center active:scale-95 ${
                  paymentMethod === 'PROMPTPAY'
                    ? 'bg-[#111111] text-[#ffffff] shadow-sm'
                    : 'bg-[#ffffff] text-[#111111] border border-[#cacacb] hover:border-[#111111]'
                }`}
              >
              
              
                โอนผ่านบัญชีธนาคาร
              </button>
            </div>
          </div>

          {/* สรุปยอดและปุ่มยืนยัน */}
          <div className="pt-4 border-t border-[#e5e5e5] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#707072] block font-bold uppercase tracking-wider">ยอดชำระสุทธิ</span>
              <span className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
                ฿{Number(product.price).toLocaleString()}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#111111] hover:bg-black disabled:bg-[#cacacb] text-[#ffffff] font-bold px-7 py-3.5 rounded-full text-xs sm:text-sm transition-all uppercase tracking-wider active:scale-95 shadow-md flex items-center gap-1.5"
            >
              <span>{loading ? 'กำลังทำรายการ...' : 'ไปหน้าชำระเงิน'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}