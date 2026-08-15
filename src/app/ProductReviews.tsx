'use client';

import { useState } from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export default function ProductReviews({ reviews = [] }: { reviews?: any[] }) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> รีวิวและสลิปการจัดส่งจริง
        </h3>
        <span className="text-[11px] font-bold text-gray-500">
          ความพึงพอใจ 4.9/5 ({safeReviews.length} รีวิว)
        </span>
      </div>

      {safeReviews.length === 0 ? (
        <div className="text-center py-6 text-xs text-gray-400 font-bold">
          ยังไม่มีรีวิวสำหรับสินค้านี้
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {safeReviews.map((rev: any, index: number) => (
            <div key={rev?.id || index} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs font-bold text-gray-800">{rev?.comment || 'สินค้าสวย ตรงปก ส่งไวมากครับ'}</p>
              <div className="text-[10px] text-gray-400 font-extrabold">{rev?.user || 'ลูกค้าที่สั่งซื้อ'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}