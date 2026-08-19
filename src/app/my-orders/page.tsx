'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { 
  Package, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Search, 
  ExternalLink,
  ShieldCheck,
  Camera
} from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch orders error:', error);
      } else if (data) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (!searchPhone) return true;
    const phoneMatch = (order.customer_tel || '').includes(searchPhone);
    const nameMatch = (order.customer_name || '').toLowerCase().includes(searchPhone.toLowerCase());
    const idMatch = (order.id || '').includes(searchPhone);
    return phoneMatch || nameMatch || idMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 bg-[#007d48]/10 text-[#007d48] text-xs font-bold px-3 py-1 rounded-full border border-[#007d48]/20">
            <Truck className="w-3.5 h-3.5" /> จัดส่งเรียบร้อยแล้ว
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> รอจัดส่งพัสดุ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> รับคำสั่งซื้อแล้ว
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111111] font-sans antialiased">
      
      {/* Top Ribbon */}
      <div className="bg-black text-white text-[11px] font-extrabold py-2 px-4 uppercase tracking-widest">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white">
            <Camera className="w-3.5 h-3.5 text-red-600" /> IG KUISCCOLZ
          </div>
          <div className="text-center font-black italic tracking-widest text-white">
            KUISCOOL<span className="text-red-600">Z</span> — เช็กสถานะคำสั่งซื้อ
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-black">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> AUTHENTIC 100%
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#111111] hover:underline">
            <ArrowLeft className="w-4 h-4" /> กลับหน้าร้านค้า
          </Link>
          <span className="text-xl font-black italic tracking-tighter uppercase">
            KUISCOOL<span className="text-red-600">Z</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5e5] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5e5] pb-4">
            <div>
              <h1 className="text-2xl font-black uppercase text-[#111111] flex items-center gap-2">
                <Package className="w-6 h-6 text-red-600" /> ตรวจสอบคำสั่งซื้อออนไลน์
              </h1>
              <p className="text-xs text-[#707072] font-medium pt-1">
                ค้นหาด้วยเบอร์โทรศัพท์, ชื่อผู้รับ, หรือรหัสคำสั่งซื้อ
              </p>
            </div>
            
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#707072] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="กรอกเบอร์โทร หรือ ชื่อ..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full bg-[#f5f5f5] text-xs font-medium pl-10 pr-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-16 text-xs text-[#707072] font-medium">
              กำลังค้นหาและดึงข้อมูลคำสั่งซื้อ...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 space-y-2 text-[#707072]">
              <Package className="w-12 h-12 mx-auto text-[#cacacb]" />
              <p className="text-sm font-bold text-[#111111]">ไม่พบข้อมูลคำสั่งซื้อ</p>
              <p className="text-xs">เมื่อสั่งซื้อสินค้าผ่านหน้าเว็บ รายการจะปรากฏที่นี่ทันที</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-[#f5f5f5] rounded-2xl p-5 border border-[#e5e5e5] space-y-4 hover:border-black transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e5e5] pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-[#707072] uppercase tracking-wider">
                        คำสั่งซื้อ #{order.id?.slice(0, 8)}
                      </span>
                      <div className="text-xs text-[#707072]">
                        วันที่: {new Date(order.created_at).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[#707072] block font-medium">รายการสินค้า:</span>
                      <span className="font-bold text-[#111111] text-sm block">{order.product_title || 'สินค้าแฟชั่น'}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[#707072] block font-medium">ข้อมูลผู้รับ:</span>
                      <div className="font-bold text-[#111111]">{order.customer_name} ({order.customer_tel})</div>
                      <div className="text-[#707072] line-clamp-1">{order.customer_address}</div>
                    </div>

                    <div className="space-y-1 sm:text-right">
                      <span className="text-[#707072] block font-medium">ยอดชำระสุทธิ:</span>
                      <span className="text-lg font-black text-red-600">
                        ฿{Number(order.amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {order.tracking_number && (
                    <div className="bg-white p-3 rounded-xl border border-[#e5e5e5] flex items-center justify-between text-xs">
                      <span className="font-medium text-[#707072]">เลขพัสดุจัดส่ง:</span>
                      <span className="font-black text-[#111111] font-mono tracking-wider">{order.tracking_number}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-8 text-xs text-center border-t-2 border-black font-bold mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="text-2xl font-black text-white italic tracking-tighter uppercase">
            KUISCOOL<span className="text-red-600">Z</span>
          </div>
          <p className="text-gray-500 text-[11px]">© 2026 KUISCOOLZ. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

    </div>
  );
}