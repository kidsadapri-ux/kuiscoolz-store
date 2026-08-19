'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Package, ArrowLeft, Truck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MyOrdersPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kuiscoolz_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      fetchUserOrders(user.ig_username);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserOrders = async (igUsername: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_ig', igUsername)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111111] font-sans antialiased p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-[#e5e5e5] shadow-xs">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-full hover:bg-[#f5f5f5] transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">คำสั่งซื้อของฉัน</h1>
              <p className="text-xs text-gray-500">
                {currentUser ? `บัญชี IG: @${currentUser.ig_username}` : 'กรุณาเข้าสู่ระบบ'}
              </p>
            </div>
          </div>
          <Link href="/" className="text-xs font-bold underline">
            กลับหน้าร้าน
          </Link>
        </div>

        {/* Orders Content */}
        {!currentUser ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-[#e5e5e5] space-y-3 shadow-xs">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold">คุณยังไม่ได้เข้าสู่ระบบ</h3>
            <p className="text-xs text-gray-500">กรุณากลับไปหน้าหลักและเข้าสู่ระบบด้วยบัญชี IG เพื่อดูรายการคำสั่งซื้อ</p>
            <div className="pt-2">
              <Link href="/" className="inline-block bg-black text-white text-xs font-bold px-6 py-2.5 rounded-full">
                ไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-[#e5e5e5]">
            <p className="text-xs text-gray-500 font-bold">กำลังโหลดประวัติคำสั่งซื้อของคุณ...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-gray-300 space-y-2">
            <Package className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold">ยังไม่มีรายการสั่งซื้อ</h3>
            <p className="text-xs text-gray-500">เลือกสินค้าและสั่งซื้อเพื่อติดตามพัสดุได้ที่นี่</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl p-5 border border-[#e5e5e5] space-y-4 shadow-xs">
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      รหัสออเดอร์ #{order.id.slice(0, 8)}
                    </span>
                    <h3 className="font-bold text-sm text-[#111111]">{order.product_title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#d30005]">฿{Number(order.amount || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#f5f5f5] p-3 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-500">ที่อยู่จัดส่ง</span>
                    <p className="text-gray-700 leading-relaxed line-clamp-2">{order.customer_address}</p>
                  </div>

                  <div className="bg-[#f5f5f5] p-3 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-500">สถานะจัดส่ง</span>
                    <div className="flex items-center gap-1.5 font-bold">
                      {order.status === 'SHIPPED' ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" /> จัดส่งแล้ว
                        </span>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> กำลังเตรียมจัดส่ง
                        </span>
                      )}
                    </div>
                    {order.tracking_number && (
                      <div className="pt-1 text-[11px] font-mono font-bold text-black">
                        เลขพัสดุ: <span className="bg-white px-2 py-0.5 rounded border">{order.tracking_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}