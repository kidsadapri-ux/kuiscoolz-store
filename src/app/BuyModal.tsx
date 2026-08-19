'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingBag, MapPin, CreditCard, User, LogIn } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <div className="bg-white rounded-3xl w-full max-w-sm p-6 sm:p-8 relative shadow-2xl space-y-4 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-red-50 text-[#d30005] rounded-full flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#111111] uppercase tracking-tight">กรุณาเข้าสู่ระบบ</h3>
            <p className="text-xs text-gray-500">เข้าสู่ระบบด้วยบัญชี IG เพื่อสั่งซื้อและติดตามสถานะพัสดุ</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onRequireAuth();
              }}
              className="w-full bg-[#d30005] hover:bg-[#780700] text-white font-bold py-3 rounded-full text-xs flex items-center justify-center gap-2 uppercase tracking-wider transition-all shadow-md"
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
      // บันทึกคำสั่งซื้อพร้อมผูก user_ig
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#d30005]" />
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">สรุปรายการสั่งซื้อ</h2>
          </div>
          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            บัญชี: @{currentUser.ig_username}
          </span>
        </div>

        {/* รายละเอียดสินค้า */}
        <div className="flex gap-4 bg-[#f5f5f5] p-3.5 rounded-2xl border border-[#e5e5e5]">
          <img
            src={product.image}
            alt={product.title}
            className="w-16 h-16 object-cover rounded-xl border border-gray-200"
          />
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.brand || 'VINTAGE'}</span>
            <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{product.title}</h3>
            <div className="text-base font-black text-[#d30005]">฿{Number(product.price).toLocaleString()}</div>
          </div>
        </div>

        <form onSubmit={handleConfirmOrder} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#d30005]" /> ที่อยู่จัดส่ง และเบอร์โทรติดต่อ *
            </label>
            <textarea
              required
              rows={3}
              placeholder="ชื่อ-นามสกุล, เบอร์โทรศัพท์, บ้านเลขที่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl p-3 text-xs bg-[#fbfbfb] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-[#d30005]" /> วิธีการชำระเงิน
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('PROMPTPAY')}
                className={`p-3 rounded-xl border font-bold text-center transition-all ${
                  paymentMethod === 'PROMPTPAY'
                    ? 'border-black bg-black text-white shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Scan QR PromptPay
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`p-3 rounded-xl border font-bold text-center transition-all ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-black bg-black text-white shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                โอนเงินผ่านบัญชีธนาคาร
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 block font-medium">ยอดชำระสุทธิ</span>
              <span className="text-xl font-black text-[#d30005]">฿{Number(product.price).toLocaleString()}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#d30005] hover:bg-[#780700] disabled:bg-gray-400 text-white font-bold px-6 py-3 rounded-full text-xs transition-all uppercase tracking-wider active:scale-95 shadow-md"
            >
              {loading ? 'กำลังทำรายการ...' : 'ไปหน้าชำระเงิน'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}