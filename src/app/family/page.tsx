'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  Store, 
  ShieldCheck, 
  X, 
  Trash2,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminFamilyPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal เพิ่มสินค้า
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    price: '',
    size: 'Free Size',
    category: 'Shirt',
    conditionGrade: 'GRADE_A',
    description: '',
  });

  // Modal จัดการเลขพัสดุ
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false })
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (orderRes.data) setOrders(orderRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // เลือกรูปภาพจากไฟล์เครื่อง
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return alert('กรุณาเลือกไฟล์รูปภาพขนาดไม่เกิน 5 MB');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // เพิ่มสินค้า
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !imagePreview) {
      return alert('กรุณากรอกชื่อสินค้า ราคา และเลือกไฟล์รูปภาพ');
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        brand: formData.brand.trim() || 'General',
        price: Number(formData.price),
        size: formData.size.trim(),
        category: formData.category,
        condition_grade: formData.conditionGrade,
        image: imagePreview,
        description: formData.description.trim() || '',
        status: 'AVAILABLE',
      };

      const { error } = await supabase.from('products').insert([payload]);
      if (error) throw error;

      alert('✅ เพิ่มสินค้าลงระบบออนไลน์สำเร็จ!');
      setFormData({
        title: '',
        brand: '',
        price: '',
        size: 'Free Size',
        category: 'Shirt',
        conditionGrade: 'GRADE_A',
        description: '',
      });
      setImagePreview('');
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(`เพิ่มสินค้าไม่สำเร็จ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // เปลี่ยนสถานะสินค้า
  const handleToggleProductStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'AVAILABLE' ? 'SOLD_OUT' : 'AVAILABLE';
    try {
      const { error } = await supabase.from('products').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (err: any) {
      alert('เปลี่ยนสถานะสินค้าไม่สำเร็จ');
    }
  };

  // ลบสินค้า
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('ต้องการลบสินค้านี้ออกจากระบบหรือไม่?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert('ลบไม่สำเร็จ: ' + err.message);
    }
  };

  // บันทึกเลขพัสดุ
  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          tracking_number: trackingInput.trim(),
          status: trackingInput.trim() ? 'SHIPPED' : 'PAID'
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      alert('✅ อัปเดตเลขพัสดุเรียบร้อย!');
      setSelectedOrder(null);
      setTrackingInput('');
      fetchData();
    } catch (err: any) {
      alert('อัปเดตไม่สำเร็จ: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111111] font-sans antialiased pb-20">
      
      {/* 1. Header บาร์บนสุด */}
      <header className="sticky top-0 z-40 bg-[#111111] text-white px-6 py-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 active:scale-95 transition-all text-white" title="กลับไปหน้าร้าน">
            <Store className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter">
              KUISCOOL<span className="text-[#d30005]">Z</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-mono">ระบบจัดการร้านค้า</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" /> แอดมินร้านค้า
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#d30005] hover:bg-[#780700] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> เพิ่มสินค้าใหม่
          </button>
        </div>
      </header>

      {/* 2. แท็บสลับหน้าจอ สินค้า / คำสั่งซื้อ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white p-2 rounded-2xl border border-[#e5e5e5] shadow-xs flex items-center justify-center">
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-3.5 px-6 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'products' ? 'bg-[#111111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Package className="w-4 h-4" /> จัดการสินค้า ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3.5 px-6 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'orders' ? 'bg-[#111111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-red-500" /> คำสั่งซื้อ ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {/* 3. ส่วนแสดงผลหลัก */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">

        {/* TAB สินค้า */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                แตะปุ่มเพื่อเปลี่ยนสถานะ SOLD OUT หรือ AVAILABLE
              </span>
            </div>

            {loading ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#e5e5e5]">
                <p className="text-xs font-bold text-gray-400">กำลังโหลดรายการสินค้า...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#cacacb] space-y-2">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm font-bold">ยังไม่มีสินค้าในร้าน</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((p) => {
                  const isAvailable = p.status === 'AVAILABLE';
                  return (
                    <div 
                      key={p.id} 
                      className="bg-white p-4 rounded-2xl border border-[#e5e5e5] shadow-xs flex items-center justify-between gap-4 hover:border-black transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="w-16 h-16 rounded-xl object-cover border shrink-0 bg-[#f5f5f5]" 
                        />
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="font-black text-sm text-[#111111] truncate">{p.title}</h4>
                          <p className="text-xs text-gray-400 truncate">{p.brand} • ไซส์: {p.size || 'Free Size'}</p>
                          <div className="text-sm font-black text-red-600">฿{Number(p.price).toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleProductStatus(p.id, p.status)}
                          className={`px-4 py-2.5 rounded-full font-black text-xs transition-all active:scale-95 ${
                            isAvailable 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {isAvailable ? '● พร้อมขาย' : '✕ SOLD OUT'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                          title="ลบสินค้า"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB คำสั่งซื้อ */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                รายการสั่งซื้อจากหน้าเว็บ
              </span>
            </div>

            {loading ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#e5e5e5]">
                <p className="text-xs font-bold text-gray-400">กำลังโหลดคำสั่งซื้อ...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#cacacb] space-y-2">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm font-bold">ยังไม่มีคำสั่งซื้อเข้ามา</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div 
                    key={o.id}
                    className="bg-white p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-3 hover:border-black transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                      <div>
                        <span className="font-mono font-bold text-xs">#{o.id?.slice(0, 8)}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          ({new Date(o.created_at).toLocaleDateString('th-TH')})
                        </span>
                      </div>
                      <div className="text-sm font-black text-red-600">
                        ยอดโอน: ฿{Number(o.amount || 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 font-bold block">สินค้าที่สั่ง:</span>
                        <span className="font-black text-[#111111]">{o.product_title}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block">ผู้รับ & เบอร์โทร:</span>
                        <span className="font-bold">{o.customer_name} ({o.customer_tel})</span>
                        <p className="text-gray-500 line-clamp-1">{o.customer_address}</p>
                      </div>
                      <div className="md:text-right space-y-1">
                        <span className="text-gray-400 font-bold block">สถานะจัดส่ง:</span>
                        {o.tracking_number ? (
                          <div className="font-mono font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-block">
                            🚚 {o.tracking_number}
                          </div>
                        ) : (
                          <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md inline-block">
                            ยังไม่ได้ใส่เลขพัสดุ
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      {o.slip_url ? (
                        <a 
                          href={o.slip_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-blue-600 font-bold underline flex items-center gap-1"
                        >
                          ดูรูปภาพสลิป <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400">ไม่มีแนบสลิป</span>
                      )}

                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setTrackingInput(o.tracking_number || '');
                        }}
                        className="bg-black hover:bg-zinc-800 text-white font-bold px-4 py-2 rounded-full active:scale-95 transition-all text-xs"
                      >
                        {o.tracking_number ? 'แก้ไขเลขพัสดุ' : '+ ใส่เลขพัสดุจัดส่ง'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal เพิ่มสินค้าใหม่ (เลือกรูปภาพจากไฟล์เครื่อง) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black uppercase text-[#111111]">ลงสินค้าใหม่เข้าร้าน</h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              
              {/* อัปโหลดรูปภาพจากเครื่อง */}
              <div className="space-y-2">
                <label className="font-bold block">รูปภาพสินค้า *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-black transition-colors bg-[#f5f5f5] relative">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover mx-auto rounded-xl border shadow-sm"
                      />
                      <label className="inline-block bg-white border border-gray-300 font-bold px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 text-[11px]">
                        เปลี่ยนรูปภาพ
                        <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-4 space-y-2">
                      <ImageIcon className="w-10 h-10 text-gray-400 mx-auto" />
                      <div className="font-bold text-gray-700">แตะเพื่อเลือกรูปภาพจากเครื่อง / อัลบั้ม</div>
                      <div className="text-[10px] text-gray-400">รองรับไฟล์รูปภาพทุกรูปแบบ (ไม่เกิน 5MB)</div>
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">ชื่อสินค้า *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="เช่น เสื้อยืด Vintage 90s ลายวง" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full bg-[#f5f5f5] rounded-xl p-3.5 outline-none font-bold text-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">แบรนด์</label>
                  <input 
                    type="text" 
                    placeholder="เช่น Nike, Vintage" 
                    value={formData.brand} 
                    onChange={e => setFormData({ ...formData, brand: e.target.value })} 
                    className="w-full bg-[#f5f5f5] rounded-xl p-3.5 outline-none" 
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">ราคา (บาท) *</label>
                  <input 
                    required 
                    type="number" 
                    placeholder="เช่น 1200" 
                    value={formData.price} 
                    onChange={e => setFormData({ ...formData, price: e.target.value })} 
                    className="w-full bg-[#f5f5f5] rounded-xl p-3.5 outline-none font-black text-sm text-red-600" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">หมวดหมู่</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#f5f5f5] rounded-xl p-3.5 outline-none font-bold"
                  >
                    <option value="Shirt">เสื้อยืด (T-Shirt)</option>
                    <option value="Jacket">แจ็คเก็ต (Jacket)</option>
                    <option value="Pants">กางเกง (Pants)</option>
                    <option value="Shoes">รองเท้า (Shoes)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">ไซส์ / สเปกวัดจริง</label>
                  <input 
                    type="text" 
                    placeholder="เช่น L (อก 44 ยาว 28)" 
                    value={formData.size} 
                    onChange={e => setFormData({ ...formData, size: e.target.value })} 
                    className="w-full bg-[#f5f5f5] rounded-xl p-3.5 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">เกรดสภาพสินค้า</label>
                <select
                  value={formData.conditionGrade}
                  onChange={e => setFormData({ ...formData, conditionGrade: e.target.value })}
                  className="w-full bg-[#f5f5f5] rounded-xl p-3.5 outline-none font-bold"
                >
                  <option value="GRADE_S">เกรด S (สภาพเหมือนใหม่)</option>
                  <option value="GRADE_A">เกรด A (สภาพดีมาก)</option>
                  <option value="GRADE_B">เกรด B (มีร่องรอยการใช้งาน)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={saving} 
                className="w-full bg-[#111111] hover:bg-black text-white font-bold py-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 mt-2"
              >
                {saving ? 'กำลังบันทึกลงระบบออนไลน์...' : 'ยืนยันลงสินค้าทันที'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal ใส่เลขพัสดุ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl space-y-4">
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black uppercase">ใส่เลขพัสดุจัดส่ง</h3>
            <p className="text-xs text-gray-400">คำสั่งซื้อ #{selectedOrder.id?.slice(0, 8)}</p>

            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <input
                required
                type="text"
                placeholder="เช่น Flash: TH123456789"
                value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                className="w-full bg-[#f5f5f5] rounded-xl p-3.5 outline-none font-mono font-bold text-sm"
              />
              <button 
                type="submit" 
                className="w-full bg-[#007d48] hover:bg-[#006038] text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md"
              >
                บันทึกสถานะจัดส่งออนไลน์
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}