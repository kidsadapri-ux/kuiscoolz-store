'use client';

import { useState } from 'react';
import { useStore } from './context/StoreContext';
import { ShieldCheck, CheckCircle2, X, ExternalLink, ZoomIn } from 'lucide-react';

export default function ProductReviews() {
  const { creditSlips } = useStore(); // 🟢 ดึงสลิปจริงจาก Store
  const [selectedSlip, setSelectedSlip] = useState<any>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
        <div>
          <h2 className="text-base font-black text-black flex items-center gap-2 uppercase tracking-wide">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> เครดิตการโอนเงิน & หลักฐานการจัดส่ง (Verified Credits)
          </h2>
          <p className="text-xs text-gray-500 font-bold">
            รวมหลักฐานสลิปการโอนเงินและเลขพัสดุจากลูกค้าที่สั่งซื้อจริงกับทางร้าน (คลิกเพื่อดูรูปขยาย)
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-black">
          <CheckCircle2 className="w-4 h-4" /> ส่งจริง โอนจริง 100%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {creditSlips.map((slip) => (
          <div
            key={slip.id}
            onClick={() => setSelectedSlip(slip)}
            className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 border-2 border-gray-200 p-4 rounded-2xl hover:border-black hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="relative w-full sm:w-28 h-36 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 border border-gray-300 group-hover:opacity-90 transition-opacity">
              <img
                src={slip.slipImage}
                alt="สลิปการโอนเงิน"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <ZoomIn className="w-3 h-3" /> ขยาย
              </span>
            </div>

            <div className="space-y-1.5 w-full text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black flex items-center gap-1">
                  👤 {slip.customerName}
                </span>
                <span className="text-[10px] text-gray-400 font-bold">{slip.dateText}</span>
              </div>

              <div className="text-xs font-bold text-gray-700 line-clamp-1">
                📦 {slip.itemTitle}
              </div>

              <div className="text-sm font-black text-black">
                ยอดโอน: <span className="text-emerald-600">฿{slip.price.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] font-mono text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                  เลขพัสดุ: <span className="font-bold text-black">{slip.trackingNo}</span>
                </div>
                <span className="text-[11px] font-black text-red-600 group-hover:underline flex items-center gap-0.5">
                  ดูรูปสลิป <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border-2 border-black space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSlip(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-black hover:text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3 text-left">
              <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED CREDIT SLIP
              </div>
              <h3 className="text-base font-black text-black">หลักฐานสลิปการโอนเงินจริง</h3>
              <p className="text-xs text-gray-500 font-bold">ลูกค้า: {selectedSlip.customerName} ({selectedSlip.dateText})</p>
            </div>

            <div className="bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200 flex justify-center items-center p-2">
              <img
                src={selectedSlip.slipImage}
                alt="สลิปโอนเงินขยายใหญ่"
                className="max-h-[50vh] object-contain rounded-xl shadow-md"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-left space-y-1.5 text-xs">
              <div className="font-extrabold text-black">📦 สินค้า: {selectedSlip.itemTitle}</div>
              <div className="font-black text-black">
                💰 ยอดชำระ: <span className="text-emerald-600 text-sm">฿{selectedSlip.price.toLocaleString()} บาท</span>
              </div>
              <div className="font-mono text-gray-600">
                🚚 เลขติดตามพัสดุ: <span className="font-black text-black">{selectedSlip.trackingNo}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSlip(null)}
              className="w-full bg-black hover:bg-gray-800 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}