'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function ProductReviews() {
  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="border-b border-[#e5e5e5] pb-3">
        <div className="inline-flex items-center gap-1.5 text-[#007d48] font-bold text-[11px] uppercase tracking-wider mb-1">
        </div>
        <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-[#111111]">
          เครดิต & รีวิวการจัดส่ง
        </h2>
      </div>

      {/* Trust Highlights & Direct IG Card */}
      <div className="bg-[#f5f5f5] rounded-2xl p-5 sm:p-7 border border-[#e5e5e5] flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Detail & Highlights */}
        <div className="space-y-3 text-center md:text-left max-w-xl">
          <p className="text-xs sm:text-sm text-[#39393b] font-medium leading-relaxed">
            เครดิตและรีวิวรวบรวมไว้แล้วที่ Instargram
          </p>

        </div>

        {/* Right: Instagram Profile Direct Card */}
        <a
          href="https://instagram.com/billionx.credits"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#ffffff] hover:border-[#111111] transition-all p-4 rounded-xl border border-[#cacacb] shadow-xs flex items-center gap-4 w-full md:w-auto shrink-0 group active:scale-95"
        >
          <div className="w-11 h-11 bg-[#111111] text-[#ffffff] rounded-full flex items-center justify-center font-black text-sm shrink-0">
            K
          </div>
          <div className="text-left space-y-0.5">
            <div className="text-[10px] uppercase font-bold text-[#707072]">Credits Instagram</div>
            <div className="text-xs sm:text-sm font-black text-[#111111] group-hover:text-[#d30005] transition-colors flex items-center gap-1">
              @billionx.credits
              <ExternalLink className="w-3.5 h-3.5 text-[#707072]" />
            </div>
          </div>
        </a>

      </div>
    </div>
  );
}