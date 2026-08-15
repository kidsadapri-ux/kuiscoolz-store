'use client';

import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const { products, toggleSoldOut, deleteProduct } = useStore();

  return (
    <div className="space-y-6 text-black">
      <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black italic tracking-wider uppercase">รายการสินค้าในระบบ</h1>
          <p className="text-xs text-gray-500 font-bold">เปลี่ยนสถานะสินค้าหรือลบรายการออกจากหน้าร้าน</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-black text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 uppercase hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> เพิ่มสินค้า
        </Link>
      </div>

      <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs font-bold">
          <thead>
            <tr className="bg-black text-white uppercase text-[11px] font-black">
              <th className="p-4">สินค้า</th>
              <th className="p-4">หมวดหมู่ / สเปก</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y border-gray-200">
            {products.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 font-black flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg border" />
                  <span className="line-clamp-1">{item.title}</span>
                </td>
                <td className="p-4 text-gray-600">{item.category} • {item.size}</td>
                <td className="p-4 font-black">฿{item.price.toLocaleString()}</td>
                <td className="p-4">
                  {item.status === 'AVAILABLE' ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-md">
                      พร้อมขาย
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-[10px] font-black px-2.5 py-1 rounded-md">
                      SOLD OUT
                    </span>
                  )}
                </td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => toggleSoldOut(item.id)}
                    className="bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-lg text-[10px] font-black border border-gray-300 transition-colors"
                  >
                    {item.status === 'AVAILABLE' ? 'ปรับเป็น SOLD OUT' : 'ปรับเป็น พร้อมขาย'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('คุณต้องการลบสินค้ารายการนี้ใช่หรือไม่?')) deleteProduct(item.id);
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg transition-colors"
                    title="ลบสินค้า"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}