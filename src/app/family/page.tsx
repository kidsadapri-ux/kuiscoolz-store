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
  ExternalLink,
  Handshake,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminFamilyPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'offers'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [previewSlipUrl, setPreviewSlipUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // เปลี่ยนมารับรูปหลายรูปในรูปแบบ Array
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    price: '',
    size: 'Free Size',
    category: 'Shirt',
    conditionGrade: 'GRADE_A',
    description: '',
  });

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes, offerRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('offers').select('*').order('created_at', { ascending: false })
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (orderRes.data) setOrders(orderRes.data);
      if (offerRes.data) setOffers(offerRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ฟังก์ชันเลือกรูปหลายรูปพร้อมกัน
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`ไฟล์ ${file.name} มีขนาดเกิน 5 MB`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImagesPreview((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // ฟังก์ชันลบรูปที่ไม่ต้องการออกจากพรีวิว
  const handleRemoveImage = (indexToRemove: number) => {
    setImagesPreview((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || imagesPreview.length === 0) {
      return alert('กรุณากรอกชื่อสินค้า ราคา และเลือกรูปภาพอย่างน้อย 1 รูป');
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
        image: imagesPreview[0],       // รูปแรกยังเก็บในฟิลด์ image เดิมเพื่อไม่ให้กระทบระบบเก่า
        images: imagesPreview,         // เก็บ Array ของรูปภาพทั้งหมด
        description: formData.description.trim() || '',
        status: 'AVAILABLE',
      };

      const { error } = await supabase.from('products').insert([payload]);
      if (error) throw error;

      alert('✅ เพิ่มสินค้าลงระบบเรียบร้อย!');
      setFormData({
        title: '',
        brand: '',
        price: '',
        size: 'Free Size',
        category: 'Shirt',
        conditionGrade: 'GRADE_A',
        description: '',
      });
      setImagesPreview([]);
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(`เพิ่มสินค้าไม่สำเร็จ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

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

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('ต้องการลบสินค้านี้หรือไม่?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert('ลบไม่สำเร็จ: ' + err.message);
    }
  };

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

  const handleUpdateOfferStatus = async (offerId: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offerId);

      if (error) throw error;
      setOffers(prev => prev.map(item => item.id === offerId ? { ...item, status: newStatus } : item));
    } catch (err: any) {
      alert(`อัปเดตสถานะไม่สำเร็จ: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111111] font-sans antialiased pb-20">
      
      {/* Header บาร์บนสุด */}
      <header className="sticky top-0 z-40 bg-[#111111] text-white px-4 sm:px-6 py-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 active:scale-95 transition-all text-white" title="กลับไปหน้าร้าน">
            <Store className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div>
            <h1 className="text-base sm:text-xl font-black uppercase tracking-tight leading-none">
              KUISCOOL<span className="text-[#ff0000]">Z</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-mono">ระบบจัดการหลังบ้าน</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ff0000] hover:bg-[#d00000] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
            <span>เพิ่มสินค้า</span>
          </button>
        </div>
      </header>

      {/* แท็บสลับหน้าจอ */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="bg-white p-1.5 rounded-2xl border border-[#e5e5e5] shadow-xs">
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2.5 sm:py-3 px-1 sm:px-3 rounded-xl font-black text-[11px] sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all ${
                activeTab === 'products' ? 'bg-[#111111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
              <span>สินค้า ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2.5 sm:py-3 px-1 sm:px-3 rounded-xl font-black text-[11px] sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all ${
                activeTab === 'orders' ? 'bg-[#111111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" /> 
              <span>ออเดอร์ ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`py-2.5 sm:py-3 px-1 sm:px-3 rounded-xl font-black text-[11px] sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all ${
                activeTab === 'offers' ? 'bg-[#111111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Handshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" /> 
              <span>ต่อรอง ({offers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* เนื้อหาหลัก */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">

        {/* TAB 1: สินค้า */}
        {activeTab === 'products' && (
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#e5e5e5]">
                <p className="text-xs font-bold text-gray-400">กำลังโหลดรายการสินค้า...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#cacacb] space-y-2">
                <Package className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-xs sm:text-sm font-bold">ยังไม่มีสินค้าในร้าน</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {products.map((p) => {
                  const isAvailable = p.status === 'AVAILABLE';
                  const displayThumb = (p.images && p.images.length > 0) ? p.images[0] : p.image;
                  return (
                    <div 
                      key={p.id} 
                      className="bg-white p-3 sm:p-4 rounded-2xl border border-[#e5e5e5] shadow-xs flex items-center justify-between gap-3 hover:border-black transition-all"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <img 
                          src={displayThumb} 
                          alt={p.title} 
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border shrink-0 bg-[#f5f5f5]" 
                        />
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="font-black text-xs sm:text-sm text-[#111111] truncate">{p.title}</h4>
                          <p className="text-[10px] sm:text-xs text-gray-400 truncate">{p.brand} • {p.size || 'Free Size'}</p>
                          <div className="text-xs sm:text-sm font-black text-[#ff0000]">฿{Number(p.price).toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleProductStatus(p.id, p.status)}
                          className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-black text-[10px] sm:text-xs transition-all active:scale-95 ${
                            isAvailable 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {isAvailable ? '● พร้อมขาย' : '✕ หมด'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
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

        {/* TAB 2: คำสั่งซื้อ */}
        {activeTab === 'orders' && (
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#e5e5e5]">
                <p className="text-xs font-bold text-gray-400">กำลังโหลดคำสั่งซื้อ...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#cacacb] space-y-2">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-xs sm:text-sm font-bold">ยังไม่มีคำสั่งซื้อเข้ามา</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div 
                    key={o.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-3 hover:border-black transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5 border-b pb-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-[11px] sm:text-xs">#{o.id?.slice(0, 8)}</span>
                        <span className="text-[10px] sm:text-xs text-gray-400">
                          ({new Date(o.created_at).toLocaleDateString('th-TH')})
                        </span>
                        {o.user_ig && (
                          <span className="text-[10px] bg-gray-100 text-gray-800 font-bold px-2 py-0.5 rounded-full">
                            IG: @{o.user_ig}
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-black text-[#ff0000]">
                        ฿{Number(o.amount || 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px] sm:text-xs">สินค้า:</span>
                        <span className="font-black text-[#111111]">{o.product_title}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px] sm:text-xs">ผู้รับ:</span>
                        <span className="font-bold">{o.customer_name || 'ลูกค้า'} ({o.customer_tel || '-'})</span>
                        <p className="text-gray-500 text-[11px] line-clamp-1">{o.customer_address}</p>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-gray-400 font-bold block text-[10px] sm:text-xs">พัสดุ:</span>
                        {o.tracking_number ? (
                          <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block text-[11px]">
                            🚚 {o.tracking_number}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md inline-block text-[10px]">
                            รอเลขพัสดุ
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      {o.slip_url ? (
                        <button
                          type="button"
                          onClick={() => setPreviewSlipUrl(o.slip_url)}
                          className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 underline text-[11px] sm:text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> ดูสลิป
                        </button>
                      ) : (
                        <span className="text-gray-400 text-[11px]">ไม่มีสลิป</span>
                      )}

                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setTrackingInput(o.tracking_number || '');
                        }}
                        className="bg-black hover:bg-zinc-800 text-white font-bold px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs transition-all"
                      >
                        {o.tracking_number ? 'แก้เลขพัสดุ' : '+ ใส่เลขพัสดุ'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ข้อเสนอต่อรอง */}
        {activeTab === 'offers' && (
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#e5e5e5]">
                <p className="text-xs font-bold text-gray-400">กำลังโหลดข้อเสนอต่อรอง...</p>
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#cacacb] space-y-2">
                <Handshake className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-xs sm:text-sm font-bold">ยังไม่มีรายการต่อรองราคา</p>
              </div>
            ) : (
              <div className="space-y-3">
                {offers.map((offer) => (
                  <div 
                    key={offer.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-3 hover:border-black transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5 border-b pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[11px] sm:text-xs">#{offer.id?.slice(0, 8)}</span>
                        <span className="text-[10px] sm:text-xs text-gray-400">
                          ({new Date(offer.created_at).toLocaleDateString('th-TH')})
                        </span>
                      </div>
                      <div>
                        {offer.status === 'ACCEPTED' && (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> ยอมรับแล้ว
                          </span>
                        )}
                        {offer.status === 'REJECTED' && (
                          <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-xs flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> ปฏิเสธแล้ว
                          </span>
                        )}
                        {(!offer.status || offer.status === 'PENDING') && (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-xs">
                            รอตรวจสอบ
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px]">สินค้า:</span>
                        <span className="font-black text-[#111111] line-clamp-1">{offer.product_title}</span>
                        <span className="text-gray-400 text-[10px] line-through">฿{Number(offer.original_price || 0).toLocaleString()}</span>
                      </div>

                      <div>
                        <span className="text-gray-400 font-bold block text-[10px]">ผู้ขอต่อรอง:</span>
                        <span className="font-black text-blue-600 text-[11px] sm:text-xs">IG: @{offer.customer_ig}</span>
                      </div>

                      <div className="col-span-2 sm:col-span-1 sm:text-right">
                        <span className="text-gray-400 font-bold block text-[10px]">ราคาที่เสนอ:</span>
                        <span className="text-base sm:text-lg font-black text-[#ff0000]">
                          ฿{Number(offer.offered_price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {(!offer.status || offer.status === 'PENDING') && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t text-xs">
                        <button
                          onClick={() => handleUpdateOfferStatus(offer.id, 'REJECTED')}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3.5 py-1.5 rounded-full text-[11px]"
                        >
                          ปฏิเสธ
                        </button>
                        <button
                          onClick={() => handleUpdateOfferStatus(offer.id, 'ACCEPTED')}
                          className="bg-[#111111] hover:bg-black text-white font-bold px-4 py-1.5 rounded-full text-[11px]"
                        >
                          ยอมรับราคา
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal ดูสลิป */}
      {previewSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-4 max-w-sm sm:max-w-md w-full relative space-y-3 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-xs sm:text-sm uppercase text-[#111111]">หลักฐานการโอนเงิน</h3>
              <button onClick={() => setPreviewSlipUrl(null)} className="p-1 rounded-full text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto flex items-center justify-center bg-zinc-950 rounded-2xl p-2">
              <img src={previewSlipUrl} alt="Slip" className="max-h-[60vh] w-auto object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Modal เพิ่มสินค้า (ปรับใหม่: รองรับหลายรูป + พรีวิว + ลบรูป) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-8 relative shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full text-black">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base sm:text-xl font-black uppercase text-[#111111]">ลงสินค้าใหม่</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              
              {/* จุดเลือกรูปภาพหลายรูป */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-3 text-center bg-[#f5f5f5]">
                {imagesPreview.length > 0 ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                      {imagesPreview.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white">
                          <img src={src} alt="Preview" className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                              รูปหลัก
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="inline-block bg-white border border-gray-300 font-bold px-3 py-1 rounded-full cursor-pointer text-[10px] hover:bg-gray-100 transition-colors">
                      + เพิ่มรูปอีก
                      <input type="file" multiple accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-4 space-y-1">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                    <div className="font-bold text-gray-700 text-xs">เลือกรูปภาพจากเครื่อง (เลือกได้หลายรูป)</div>
                    <div className="text-[10px] text-gray-400">รูปแรกจะเป็นรูปปกหลัก</div>
                    <input type="file" multiple accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </label>
                )}
              </div>

              <div>
                <label className="font-bold block mb-1">ชื่อสินค้า *</label>
                <input required type="text" placeholder="ชื่อสินค้า..." value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#f5f5f5] rounded-xl p-2.5 outline-none font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">แบรนด์</label>
                  <input type="text" placeholder="เช่น Nike" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full bg-[#f5f5f5] rounded-xl p-2.5 outline-none" />
                </div>
                <div>
                  <label className="font-bold block mb-1">ราคา (บาท) *</label>
                  <input required type="number" placeholder="ราคา..." value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-[#f5f5f5] rounded-xl p-2.5 outline-none font-black text-[#ff0000]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">หมวดหมู่</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#f5f5f5] rounded-xl p-2.5 outline-none font-bold">
                    <option value="Shirt">เสื้อยืด</option>
                    <option value="Jacket">แจ็คเก็ต</option>
                    <option value="Pants">กางเกง</option>
                    <option value="Shoes">รองเท้า</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">ไซส์ / สเปก</label>
                  <input type="text" placeholder="เช่น L อก 42" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} className="w-full bg-[#f5f5f5] rounded-xl p-2.5 outline-none" />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">เกรดสินค้า</label>
                <select value={formData.conditionGrade} onChange={e => setFormData({ ...formData, conditionGrade: e.target.value })} className="w-full bg-[#f5f5f5] rounded-xl p-2.5 outline-none font-bold">
                  <option value="GRADE_S">เกรด S (สภาพเหมือนใหม่)</option>
                  <option value="GRADE_A">เกรด A (สภาพดีมาก)</option>
                  <option value="GRADE_B">เกรด B (มีร่องรอยใช้งาน)</option>
                </select>
              </div>

              <button type="submit" disabled={saving} className="w-full bg-[#111111] text-white font-bold py-3 rounded-full uppercase mt-2 active:scale-95 transition-all">
                {saving ? 'กำลังบันทึก...' : 'ลงสินค้าทันที'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal ใส่เลขพัสดุ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-xs p-5 relative space-y-3">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-3 right-3 text-gray-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-black uppercase">ใส่เลขพัสดุจัดส่ง</h3>
            <form onSubmit={handleSaveTracking} className="space-y-2 text-xs">
              <input required type="text" placeholder="เช่น Flash: TH1234..." value={trackingInput} onChange={e => setTrackingInput(e.target.value)} className="w-full bg-[#f5f5f5] rounded-xl p-2.5 outline-none font-mono font-bold" />
              <button type="submit" className="w-full bg-[#007d48] text-white font-bold py-2.5 rounded-full">
                บันทึกเลขพัสดุ
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}