'use client';

import Link from 'next/link';
import { Package, PlusCircle, FileText, TrendingUp, Gavel, CheckCircle2 } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 text-black">
      
      {/* Page Title */}
      <div className="flex justify-between items-end border-b-2 border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black italic tracking-wider uppercase text-black">
            ภาพรวมระบบจัดการ (Dashboard)
          </h1>
          <p className="text-xs text-gray-500 font-bold">
            สรุปสถานะสินค้า ฝากขาย และกิจกรรมภายในร้าน KUISCOOLZ
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-black hover:bg-red-600 text-white font-black px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 uppercase shadow-md"
        >
          <PlusCircle className="w-4 h-4" /> ลงสินค้าใหม่
        </Link>
      </div>

      {/* 📈 Cards สรุปสถิติตัวเลข */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="text-xs font-black text-gray-400 uppercase">สินค้าพร้อมขายทั้งหมด</div>
          <div className="text-3xl font-black text-black">12 ชิ้น</div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="text-xs font-black text-gray-400 uppercase">รายการฝากขายรออนุมัติ</div>
          <div className="text-3xl font-black text-amber-500">3 รายการ</div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="text-xs font-black text-gray-400 uppercase">สลิปเครดิตการโอน</div>
          <div className="text-3xl font-black text-emerald-600">28 สลิป</div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="text-xs font-black text-gray-400 uppercase">รายการประมูลกำลังวิ่ง</div>
          <div className="text-3xl font-black text-purple-600">1 รายการ</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-black">
          ทางลัดจัดการระบบ (Quick Actions)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-black">
          <Link
            href="/admin/products/new"
            className="p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-black transition-all flex items-center gap-3"
          >
            <PlusCircle className="w-6 h-6 text-red-600" />
            <div>
              <div className="text-black font-extrabold">ลงสินค้าของร้าน</div>
              <div className="text-[10px] text-gray-400 font-bold">เพิ่มเสื้อผ้า/รองเท้าเข้าร้าน</div>
            </div>
          </Link>

          <Link
            href="/admin/products"
            className="p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-black transition-all flex items-center gap-3"
          >
            <Package className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-black font-extrabold">จัดการตารางสินค้า</div>
              <div className="text-[10px] text-gray-400 font-bold">เปลี่ยนสถานะเป็น SOLD OUT</div>
            </div>
          </Link>

          <Link
            href="/admin/credits"
            className="p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-black transition-all flex items-center gap-3"
          >
            <FileText className="w-6 h-6 text-emerald-600" />
            <div>
              <div className="text-black font-extrabold">อัปเดตสลิปเครดิต</div>
              <div className="text-[10px] text-gray-400 font-bold">แนบสลิปโอน + เลขพัสดุ</div>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}