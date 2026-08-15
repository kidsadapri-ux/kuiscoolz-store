'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, 
  Package, 
  Gavel, 
  CreditCard, 
  Plus, 
  Store, 
  ShieldCheck, 
  X, 
  Trash2, 
  CheckCircle,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

// ตัวช่วยสร้าง Supabase Client
const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) {
    console.error('Supabase URL หรือ Anon Key หายไป!');
  }
  return createClient(url, key);
};

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  brand?: string;
  size?: string;
  category?: string;
  condition_grade?: string;
  image?: string;
  status: 'AVAILABLE' | 'AUCTION' | 'SOLD_OUT';
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // ฟอร์มข้อมูลสินค้าใหม่
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    price: '',
    size: 'Free Size',
    category: 'T-Shirt',
    conditionGrade: 'GRADE_A',
    image: '',
    description: '',
  });

  // 1. ดึงข้อมูลสินค้าจาก Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        alert(`❌ โหลดข้อมูลไม่สำเร็จ: ${error.message}`);
        return;
      }
      setProducts(data || []);
    } catch (err: any) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. ฟังก์ชันเพิ่มสินค้าใหม่ลง Supabase พร้อมแจ้งเตือน Error ชัดเจน
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.image) {
      return alert('กรุณากรอกชื่อสินค้า ราคา และ URL รูปภาพ ให้ครบถ้วน');
    }

    setSaving(true);
    try {
      const supabase = getSupabase();
      
      const payload = {
        title: formData.title.trim(),
        brand: formData.brand.trim() || 'General',
        price: Number(formData.price),
        size: formData.size.trim(),
        category: formData.category,
        condition_grade: formData.conditionGrade,
        image: formData.image.trim(),
        description: formData.description.trim() || '',
        status: 'AVAILABLE',
      };

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        alert(`❌ Supabase ปฏิเสธข้อมูล:\nข้อความ: ${error.message}\nรหัส: ${error.code}`);
        return;
      }

      alert('✅ เพิ่มสินค้าลง Supabase สำเร็จแล้ว!');
      setFormData({
        title: '',
        brand: '',
        price: '',
        size: 'Free Size',
        category: 'T-Shirt',
        conditionGrade: 'GRADE_A',
        image: '',
        description: '',
      });
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      console.error('Catch error:', error);
      alert(`❌ ข้อผิดพลาดระบบ: ${error.message || 'ไม่สามารถส่งคำขอได้'}`);
    } finally {
      setSaving(false);
    }
  };

  // 3. ฟังก์ชันสลับสถานะสินค้า (AVAILABLE <-> SOLD_OUT)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'AVAILABLE' ? 'SOLD_OUT' : 'AVAILABLE';
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        alert(`อัปเดตไม่สำเร็จ: ${error.message}`);
        return;
      }

      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
      );
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const availableCount = products.filter((p) => p.status === 'AVAILABLE').length;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div className="space-y-8">
          <div>
            <h1 className="text-xl font-black italic tracking-wider">KUISCOOLZ</h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Admin Control Center</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard' ? 'bg-zinc-800 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              ภาพรวม (DASHBOARD)
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products' ? 'bg-zinc-800 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Package className="w-4 h-4 text-amber-500" />
              จัดการสินค้าทั้งหมด ({products.length})
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-zinc-900"
            >
              <Gavel className="w-4 h-4 text-purple-400" />
              จัดการระบบประมูล
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-zinc-900"
            >
              <CreditCard className="w-4 h-4 text-emerald-500" />
              จัดการสลิปเครดิต
            </button>
          </nav>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white pt-4 border-t border-zinc-800"
        >
          <Store className="w-4 h-4" /> กลับไปหน้าร้านค้า
        </Link>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              ระบบจัดการหลังบ้าน • KUISCOOLZ OFFICIAL
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> ADMIN VERIFIED เจ้าของร้าน
            </span>
          </div>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black uppercase">ภาพรวมระบบจัดการ (DASHBOARD)</h2>
                <p className="text-xs text-gray-500">สรุปสถานะสินค้า ฝากขาย และกิจกรรมภายในร้าน KUISCOOLZ</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black hover:bg-zinc-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> ลงสินค้าใหม่
              </button>
            </div>

            {/* 4 STAT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-gray-400">สินค้าพร้อมขายทั้งหมด</span>
                <div className="text-2xl font-black text-black">{availableCount} ชิ้น</div>
              </div>
              <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-amber-500">รายการฝากขายรออนุมัติ</span>
                <div className="text-2xl font-black text-amber-500">0 รายการ</div>
              </div>
              <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-emerald-600">สลิปเครดิตการโอน</span>
                <div className="text-2xl font-black text-emerald-600">0 สลิป</div>
              </div>
              <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-purple-600">รายการประมูลกำลังวิ่ง</span>
                <div className="text-2xl font-black text-purple-600">0 รายการ</div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-gray-500 tracking-wider">ทางลัดจัดการระบบ (QUICK ACTIONS)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="border border-gray-200 hover:border-black rounded-xl p-4 text-left transition-all flex items-start gap-3 bg-gray-50"
                >
                  <Plus className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">ลงสินค้าของร้าน</h4>
                    <p className="text-[10px] text-gray-400">เพิ่มเสื้อผ้า/รองเท้าเข้าร้าน</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className="border border-gray-200 hover:border-black rounded-xl p-4 text-left transition-all flex items-start gap-3 bg-gray-50"
                >
                  <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">จัดการตารางสินค้า</h4>
                    <p className="text-[10px] text-gray-400">เปลี่ยนสถานะเป็น SOLD OUT</p>
                  </div>
                </button>

                <button
                  className="border border-gray-200 hover:border-black rounded-xl p-4 text-left transition-all flex items-start gap-3 bg-gray-50"
                >
                  <CreditCard className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">อัปเดตสลิปเครดิต</h4>
                    <p className="text-[10px] text-gray-400">แนบสลิปโอน + เลขพัสดุ</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TABLE TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase">จัดการตารางสินค้าทั้งหมด ({products.length})</h2>
                <p className="text-xs text-gray-500">คลิกที่ปุ่มสถานะเพื่อเปลี่ยนเป็น SOLD OUT หรือ AVAILABLE</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black hover:bg-zinc-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> เพิ่มสินค้าใหม่
              </button>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 border-b text-gray-600 uppercase font-black text-[10px]">
                    <th className="p-4">รูปภาพ</th>
                    <th className="p-4">ชื่อสินค้า / แบรนด์</th>
                    <th className="p-4">หมวดหมู่ / ไซส์</th>
                    <th className="p-4">ราคา</th>
                    <th className="p-4">สถานะ (คลิกเพื่อสลับ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-400">กำลังโหลดรายการสินค้า...</td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-400">ยังไม่มีรายการสินค้าในระบบ</td>
                    </tr>
                  ) : (
                    products.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover border" />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{item.title}</div>
                          <span className="text-[10px] text-gray-400">{item.brand || 'No Brand'}</span>
                        </td>
                        <td className="p-4">
                          <div>{item.category || 'เสื้อผ้า'}</div>
                          <span className="text-[10px] text-gray-400">{item.size}</span>
                        </td>
                        <td className="p-4 font-black text-black">฿{Number(item.price).toLocaleString()}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(item.id, item.status)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                              item.status === 'AVAILABLE'
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {item.status === 'AVAILABLE' ? '● พร้อมขาย' : '✕ SOLD OUT'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: เพิ่มสินค้าใหม่ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3">
              <h3 className="text-lg font-black">ลงสินค้าใหม่เข้าร้าน</h3>
              <p className="text-xs text-gray-400">ข้อมูลจะถูกบันทึกลง Supabase โดยตรงทันที</p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">ชื่อสินค้า *</label>
                <input
                  required
                  type="text"
                  placeholder="เช่น เสื้อยืด Vintage 90s ลายวง"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-xl p-2.5 focus:border-black outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">แบรนด์</label>
                  <input
                    type="text"
                    placeholder="เช่น Nike, Vintage"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full border rounded-xl p-2.5 focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">ราคา (บาท) *</label>
                  <input
                    required
                    type="number"
                    placeholder="990"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border rounded-xl p-2.5 focus:border-black outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">หมวดหมู่</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border rounded-xl p-2.5 focus:border-black outline-none"
                  >
                    <option value="T-Shirt">เสื้อยืด (T-Shirt)</option>
                    <option value="Jacket">แจ็คเก็ต (Jacket)</option>
                    <option value="Pants">กางเกง (Pants)</option>
                    <option value="Shoes">รองเท้า (Shoes)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">ขนาด (Size)</label>
                  <input
                    type="text"
                    placeholder="L (อก 44 ยาว 28)"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full border rounded-xl p-2.5 focus:border-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">URL รูปภาพสินค้า *</label>
                <input
                  required
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border rounded-xl p-2.5 focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">รายละเอียดสินค้า (ถ้ามี)</label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดสภาพสินค้า..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-xl p-2.5 focus:border-black outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4"
              >
                {saving ? 'กำลังบันทึกลง Supabase...' : 'ยืนยันลงสินค้า'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}