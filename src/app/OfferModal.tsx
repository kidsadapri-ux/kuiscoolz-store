'use client';

import { useState } from 'react';
import { X, Handshake, CheckCircle2, DollarSign, MessageSquare } from 'lucide-react';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
    brand: string;
    image: string;
  } | null;
}

export default function OfferModal({ isOpen, onClose, product }: OfferModalProps) {
  const [offeredPrice, setOfferedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(offeredPrice);
    if (!priceNum || priceNum <= 0) {
      return alert('กรุณาระบุราคาที่ต้องการเสนอ');
    }

    if (priceNum >= product.price) {
      return alert(`ราคาต่อรองต้องต่ำกว่าราคาเต็ม (฿${product.price.toLocaleString()})`);
    }

    setLoading(true);

    try {
      await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          buyerId: 'demo-buyer-id',
          offeredPrice: priceNum,
          message,
        }),
      });

      setIsSuccess(true);
    } catch (err) {
      setIsSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setOfferedPrice('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-4">
        
        {/* ปุ่มปิด */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* หน้าจอเมื่อยื่นข้อเสนอสำเร็จ */
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-16 h-16 text-blue-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-gray-900">ส่งข้อเสนอเรียบร้อย!</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              ยื่นข้อเสนอราคา <span className="font-bold text-blue-600">฿{parseFloat(offeredPrice).toLocaleString()}</span> 
              สำหรับสินค้า <span className="font-bold text-black">{product.title}</span> แล้ว
              <br />ระบบจะแจ้งเตือนเมื่อผู้ขายตอบรับหรือปฏิเสธข้อเสนอครับ
            </p>
            <button
              onClick={handleClose}
              className="bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 mt-4"
            >
              ตกลง
            </button>
          </div>
        ) : (
          /* ฟอร์มกรอกราคาต่อรอง */
          <>
            <div className="flex items-center gap-2 border-b pb-3">
              <Handshake className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-gray-900">ยื่นข้อเสนอต่อรองราคา</h2>
            </div>

            {/* รายละเอียดสินค้า */}
            <div className="flex gap-3 bg-gray-50 p-3 rounded-xl border">
              <img
                src={product.image}
                alt={product.title}
                className="w-14 h-14 object-cover rounded-lg border"
              />
              <div className="flex-1 space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">{product.brand}</span>
                <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                <div className="text-xs text-gray-500">
                  ราคาตั้งขาย: <span className="font-bold text-red-600">฿{product.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-4">
              {/* ระบุราคาที่ต้องการเสนอ */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-blue-600" /> ราคาที่คุณต้องการเสนอ (บาท)
                  </span>
                  <span className="text-[10px] text-gray-400">ระบุน้อยกว่าราคาเต็ม</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder={`เช่น ${Math.round(product.price * 0.85)}`}
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  className="w-full border rounded-xl p-2.5 text-sm font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* ข้อความเพิ่มเติมถึงผู้ขาย */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> ข้อความถึงผู้ขาย (ถ้ามี)
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น พร้อมโอนทันทีถ้าผู้ขายตกลงครับ..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>

              {/* ปุ่มยื่นข้อเสนอ */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <Handshake className="w-4 h-4" />
                {loading ? 'กำลังส่งข้อเสนอ...' : 'ยืนยันการยื่นข้อเสนอ'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}