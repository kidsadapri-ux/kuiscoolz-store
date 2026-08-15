'use client';

import { useState, useEffect } from 'react';
import { X, Flame, Clock, Gavel, History, TrendingUp, ShieldCheck } from 'lucide-react';

interface AuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    brand: string;
    image: string;
    startingPrice: number;
    currentBid: number;
    minBidStep: number; // ขั้นต่ำในการเพิ่มราคา เช่น ครั้งละ 50 หรือ 100
    endTime: string; // ISO String
    bidHistory: { id: string; bidderName: string; amount: number; time: string }[];
  } | null;
}

export default function AuctionModal({ isOpen, onClose, item }: AuctionModalProps) {
  if (!isOpen) return null;
  const [currentBid, setCurrentBid] = useState(0);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [customBid, setCustomBid] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (item) {
      setCurrentBid(item.currentBid || item.startingPrice);
      setBidHistory(item.bidHistory || []);
    }
  }, [item]);

  // ระบบนับเวลาถอยหลัง (Countdown Timer)
  useEffect(() => {
    if (!item?.endTime) return;

    const timer = setInterval(() => {
      const diff = new Date(item.endTime).getTime() - new Date().getTime();
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [item]);

  if (!isOpen || !item) return null;

  // ฟังก์ชันเคาะราคาประมูล
  const handlePlaceBid = async (amount: number) => {
    if (amount <= currentBid) {
      return alert(`ราคาประมูลต้องมากกว่าราคาปัจจุบัน (฿${currentBid.toLocaleString()})`);
    }

    setLoading(true);

    try {
      await fetch('/api/auctions/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auctionId: item.id,
          bidAmount: amount,
          bidderName: 'คุณ (ผู้ใช้งาน)',
        }),
      });

      // อัปเดตราคาและประวัติเคาะทันทีบน UI
      const newBidEntry = {
        id: `bid-${Date.now()}`,
        bidderName: 'คุณ (ผู้ใช้งาน)',
        amount: amount,
        time: 'เมื่อสักครู่',
      };

      setCurrentBid(amount);
      setBidHistory([newBidEntry, ...bidHistory]);
      setCustomBid('');
      alert(`🎉 เคาะราคาประมูลที่ ฿${amount.toLocaleString()} สำเร็จ!`);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเสนอราคา');
    } finally {
      setLoading(false);
    }
  };

  const nextQuickBid = currentBid + (item.minBidStep || 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ Modal */}
        <div className="flex items-center gap-2 border-b pb-3">
          <Gavel className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-black text-gray-900">ห้องประมูลสินค้า Real-time</h2>
        </div>

        {/* รายละเอียดสินค้า + เวลานับถอยหลัง */}
        <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border">
          <img
            src={item.image}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-lg border flex-shrink-0"
          />
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
              {item.brand}
            </span>
            <h3 className="text-xs font-bold text-gray-900 line-clamp-2">{item.title}</h3>
            
            {/* ตัวนับเวลาถอยหลัง */}
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold pt-1">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>เหลือเวลา:</span>
              <span className="font-mono font-black text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* กล่องแสดงราคาปัจจุบัน */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center space-y-1">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ราคาประมูลสูงสุดปัจจุบัน</span>
          <div className="text-3xl font-black text-amber-700 flex items-center justify-center gap-1">
            <TrendingUp className="w-6 h-6" /> ฿{currentBid.toLocaleString()}
          </div>
          <span className="text-[10px] text-gray-400 block">ราคาเริ่มต้น: ฿{item.startingPrice.toLocaleString()} (เคาะขั้นต่ำครั้งละ +฿{item.minBidStep || 100})</span>
        </div>

        {/* ปุ่มเคาะราคาด่วน (Quick Bid) & กรอกระบุเอง */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-600" /> เลือกเสนอราคาแข่งประมูล
          </label>

          <div className="grid grid-cols-2 gap-2">
            {/* ปุ่มเคาะด่วนตามขั้นต่ำ */}
            <button
              onClick={() => handlePlaceBid(nextQuickBid)}
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1"
            >
              <Gavel className="w-4 h-4" /> เคาะด่วน +฿{item.minBidStep || 100} (฿{nextQuickBid.toLocaleString()})
            </button>

            {/* ปุ่มเคาะด่วน +200 */}
            <button
              onClick={() => handlePlaceBid(currentBid + 200)}
              disabled={loading}
              className="bg-black hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
            >
              เคาะ +฿200 (฿{(currentBid + 200).toLocaleString()})
            </button>
          </div>

          {/* ฟอร์มระบุราคาเอง */}
          <div className="flex gap-2 pt-1">
            <input
              type="number"
              placeholder={`ระบุราคาตั้งแต่ ฿${nextQuickBid}`}
              value={customBid}
              onChange={(e) => setCustomBid(e.target.value)}
              className="flex-1 border rounded-xl p-2 text-xs font-bold focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handlePlaceBid(parseFloat(customBid))}
              disabled={loading || !customBid}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors disabled:bg-gray-200 disabled:text-gray-400"
            >
              เสนอราคา
            </button>
          </div>
        </div>

        {/* ประวัติการเคาะราคา (Bid History) */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span className="flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-gray-500" /> ประวัติการเคาะราคาล่าสุด
            </span>
            <span className="text-[10px] text-gray-400">({bidHistory.length} ครั้ง)</span>
          </div>

          <div className="bg-gray-50 rounded-xl p-2 border max-h-36 overflow-y-auto space-y-1.5 text-xs">
            {bidHistory.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center py-3">ยังไม่มีผู้เสนอราคา เป็นคนแรกที่เคาะเลย!</p>
            ) : (
              bidHistory.map((bid, idx) => (
                <div
                  key={bid.id || idx}
                  className={`flex justify-between items-center p-2 rounded-lg text-[11px] ${
                    idx === 0 ? 'bg-amber-100/70 border border-amber-300 font-bold text-amber-900' : 'bg-white border text-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {idx === 0 && <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />}
                    <span>{bid.bidderName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-black">฿{bid.amount.toLocaleString()}</span>
                    <span className="text-[9px] text-gray-400">{bid.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}