'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { 
  Package, 
  ArrowLeft, 
  Search, 
  Truck, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check 
} from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTel, setSearchTel] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ฟังก์ชันสร้าง Direct Link ไปยังระบบเช็กพัสดุอัตโนมัติ
  const getTrackingUrl = (trackingNumber: string, courierName?: string) => {
    const cleanTrack = trackingNumber.trim();
    const courier = (courierName || '').toLowerCase();

    if (courier.includes('flash') || cleanTrack.startsWith('TH')) {
      return `https://www.flashexpress.co.th/tracking/?se=${cleanTrack}`;
    }
    if (courier.includes('ems') || courier.includes('thai post') || /^[A-Z]{2}\d{9}TH$/i.test(cleanTrack)) {
      return `https://track.thailandpost.co.th/?trackNumber=${cleanTrack}`;
    }
    return `https://www.flashexpress.co.th/tracking/?se=${cleanTrack}`;
  };

  const handleCopy = (trackNo: string, orderId: string) => {
    navigator.clipboard.writeText(trackNo);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('kuiscoolz_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.ig_username) {
          fetchUserOrders(user.ig_username);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchUserOrders = async (ig: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const cleanIg = ig.trim().replace(/^@/, '');
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .ilike('user_ig', cleanIg)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByTel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTel.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_tel', searchTel.trim())
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const maskPhone = (phone?: string) => {
    if (!phone) return '-';
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length < 9) return phone;
    return `${clean.slice(0, 3)}-xxx-${clean.slice(-4)}`;
  };

  // ฟังก์ชันแปลงชื่อลูกค้า เช่น สมชาย -> ส**าย
  const maskName = (name?: string) => {
    if (!name) return '-';
    const clean = name.trim();
    if (clean.length <= 2) return clean;
    return `${clean[0]}${'*'.repeat(Math.min(clean.length - 2, 4))}${clean[clean.length - 1]}`;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111111] font-sans antialiased pb-20 selection:bg-black/10 selection:text-current">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#e5e5e5] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <Link href="/" className="flex items-center gap-1.5 text-xs font-bold text-[#707072] hover:text-[#111111] transition-colors">
          <ArrowLeft className="w-4 h-4" /> กลับหน้าร้าน
        </Link>
        <span className="text-base sm:text-lg font-black uppercase tracking-tight">
          KUISCOOL<span className="text-[#d30005]">Z</span>
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111]">
            ติดตามพัสดุและคำสั่งซื้อ
          </h1>
          <p className="text-xs text-[#707072] font-medium"></p>
        </div>

        {/* ฟอร์มค้นหาเบอร์โทร */}
        <form onSubmit={handleSearchByTel} className="flex gap-2">
          <input
            type="text"
            placeholder="กรอกเบอร์โทรศัพท์ที่ใช้สั่งซื้อ..."
            value={searchTel}
            onChange={(e) => setSearchTel(e.target.value)}
            className="flex-1 bg-white border border-[#cacacb] focus:border-[#111111] rounded-full px-5 py-2.5 text-xs font-medium outline-none transition-all"
          />
          <button
            type="submit"
            className="bg-[#111111] hover:bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 active:scale-95 transition-all uppercase tracking-wider shadow-xs"
          >
            <Search className="w-3.5 h-3.5" /> ค้นหา
          </button>
        </form>

        {/* รายการคำสั่งซื้อ */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#e5e5e5]">
            <p className="text-xs font-bold text-[#707072]">กำลังค้นหาข้อมูล...</p>
          </div>
        ) : orders.length === 0 ? (
          searched && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#cacacb] space-y-2">
              <Package className="w-10 h-10 text-[#cacacb] mx-auto" />
              <p className="text-xs sm:text-sm font-bold text-[#111111]">ไม่พบประวัติคำสั่งซื้อ</p>
            </div>
          )
        ) : (
          <div className="space-y-3.5">
            {orders.map((order) => {
              const hasTracking = !!order.tracking_number;
              const trackingUrl = hasTracking ? getTrackingUrl(order.tracking_number, order.courier_name) : '';

              return (
                <div key={order.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-3.5">
                  
                  {/* หัวการ์ดคำสั่งซื้อ */}
                  <div className="flex justify-between items-center border-b border-[#f5f5f5] pb-3">
                    <div>
                      <span className="font-mono font-bold text-xs text-[#111111]">#{order.id?.slice(0, 8)}</span>
                      <span className="text-[10px] text-[#707072] ml-2">
                        {order.created_at ? `(${new Date(order.created_at).toLocaleDateString('th-TH')})` : ''}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-[#d30005] tracking-tight">
                      ฿{Number(order.amount || 0).toLocaleString()}
                    </div>
                  </div>

                  {/* รายละเอียดสินค้าและผู้รับ */}
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-[#111111]">{order.product_title}</div>
                    <div className="text-[#707072] text-[11px]">
    ผู้รับ: <span className="text-[#111111] font-semibold">{maskName(order.customer_name)}</span> 
    {order.customer_tel ? ` (${maskPhone(order.customer_tel)})` : ''}
  </div>
</div>

                  {/* ส่วนแสดงสถานะและปุ่มติดตามพัสดุ */}
                  <div className="pt-2.5 border-t border-[#f5f5f5]">
                    {hasTracking ? (
                      <div className="bg-[#f5f5f5] border border-[#e5e5e5] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#707072]">
                            <Truck className="w-3.5 h-3.5 text-[#111111]" />
                            <span>{order.courier_name || 'พัสดุจัดส่ง'}:</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-[#111111] tracking-wider">
                              {order.tracking_number}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(order.tracking_number, order.id)}
                              className="p-1 hover:bg-white rounded-md transition-all text-[#707072] hover:text-[#111111]"
                              title="คัดลอกเลขพัสดุ"
                            >
                              {copiedId === order.id ? (
                                <Check className="w-3.5 h-3.5 text-[#007d48]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 bg-[#111111] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shrink-0 shadow-xs"
                        >
                          <span>เช็กพัสดุ</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#cacacb]" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs py-1">
                        <span className="text-[#707072] text-[11px]">สถานะจัดส่ง:</span>
                        <span className="text-amber-700 font-bold bg-amber-50 border border-amber-200/50 px-3 py-1 rounded-full text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> กำลังเตรียมจัดส่ง
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}