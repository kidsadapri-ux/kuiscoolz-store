'use client';

import { useState } from 'react';
import { X, ShoppingBag, MapPin, CreditCard } from 'lucide-react';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessPayment?: (orderInfo: { orderNumber: string; productTitle: string; amount: number; paymentMethod: string }) => void;
  product: {
    id: string;
    title: string;
    price: number;
    brand: string;
    image: string;
  } | null;
}

export default function BuyModal({ isOpen, onClose, onSuccessPayment, product }: BuyModalProps) {
  if (!isOpen) return null;
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PROMPTPAY');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return alert('กรุณากรอกที่อยู่จัดส่ง');

    setLoading(true);
    const demoOrderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          buyerId: 'demo-buyer-id',
          shippingAddress: address,
          paymentMethod,
        }),
      });
    } catch (err) {
      // ละเว้น error จากการหา API ไม่เจอเพื่อทดสอบ UI
    } finally {
      setLoading(false);
      
      // ส่งข้อมูลไปเปิดหน้า QR Code / แนบสลิป ชำระเงินทันที
      if (onSuccessPayment) {
        onSuccessPayment({
          orderNumber: demoOrderNumber,
          productTitle: product.title,
          amount: product.price,
          paymentMethod: paymentMethod,
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-2xl space-y-4">
        
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ฟอร์มสรุปและสั่งซื้อ */}
        <div className="flex items-center gap-2 border-b pb-3">
          <ShoppingBag className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-black text-gray-900">สรุปรายการสั่งซื้อ</h2>
        </div>

        {/* รายละเอียดสินค้า */}
        <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border">
          <img
            src={product.image}
            alt={product.title}
            className="w-16 h-16 object-cover rounded-lg border"
          />
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">{product.brand}</span>
            <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{product.title}</h3>
            <div className="text-sm font-black text-red-600">฿{product.price.toLocaleString()}</div>
          </div>
        </div>

        <form onSubmit={handleConfirmOrder} className="space-y-4">
          {/* กรอกที่อยู่ */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" /> ที่อยู่ในการจัดส่ง
            </label>
            <textarea
              required
              rows={2}
              placeholder="ชื่อ-นามสกุล, เบอร์โทรศัพท์, บ้านเลขที่, ตำบล, อำเภอ, จังหวัด..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-black"
            />
          </div>

          {/* เลือกวิธีชำระเงิน */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-red-600" /> ช่องทางการชำระเงิน
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('PROMPTPAY')}
                className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                  paymentMethod === 'PROMPTPAY'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                Scan QR PromptPay
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                โอนเงินผ่านบัญชีธนาคาร
              </button>
            </div>
          </div>

          {/* ยอดชำระรวม & ปุ่มยืนยัน */}
          <div className="pt-2 border-t flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 block">ยอดชำระสุทธิ</span>
              <span className="text-xl font-black text-red-600">฿{product.price.toLocaleString()}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-md"
            >
              {loading ? 'กำลังทำรายการ...' : 'ยืนยันสั่งซื้อสินค้า'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}