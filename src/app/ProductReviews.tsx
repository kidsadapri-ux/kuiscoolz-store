'use client';

import React from 'react';
import { Camera, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export default function ProductReviews() {
  const creditIgAccount = 'kuisccolz';

  return (
    <div className="py-2 px-1 space-y-6">
      
      {/* ส่วนบน: หัวข้อซ้าย + ปุ่มแคปซูลเข้า IG ขวา */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5e5] pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#007d48]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#007d48]" /> Verified Customer Reviews
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111]">
            เครดิต & รีวิวการจัดส่งจริง
          </h2>
        </div>

        <a
          href={`https://instagram.com/${creditIgAccount}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full transition-all active:scale-95 shadow-sm hover:shadow-md"
        >
          <Camera className="w-4 h-4 text-[#d30005]" />
          <span>ดูเครดิตบน Instagram</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </a>
      </div>

      {/* ส่วนกลาง: กล่องข้อความและชื่อ IG ดีไซน์สไตล์มินิมอล */}
      <div className="bg-[#f5f5f5] rounded-2xl p-6 sm:p-8 text-center space-y-3 border border-[#e5e5e5]">
        <p className="text-xs sm:text-sm text-[#707072] font-medium max-w-xl mx-auto leading-relaxed">
          ทางร้านรวบรวมสลิปโอนเงิน ประวัติการแพ็กของ ส่งพัสดุ Flash / EMS <br className="hidden sm:inline" />
          และรีวิวจากลูกค้าจริงทุกคำสั่งซื้อไว้ในไฮไลต์สตอรี่ไอจี
        </p>

        <div className="pt-2">
          <a
            href={`https://instagram.com/${creditIgAccount}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#111111] px-5 py-2.5 rounded-full border border-[#cacacb] hover:border-[#111111] transition-all shadow-xs group"
          >
            <span className="text-xs font-bold text-[#707072]">ชื่อ IG ทางการ:</span>
            <span className="text-sm font-black text-[#111111] group-hover:text-[#d30005] transition-colors">
              @{creditIgAccount}
            </span>
          </a>
        </div>
      </div>

    </div>
  );
}