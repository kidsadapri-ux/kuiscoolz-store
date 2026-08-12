'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import { ArrowLeft, Plus, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';

export default function AdminNewProductPage() {
  const router = useRouter();
  const { addProduct } = useStore();

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'Shirt',
    size: '',
    conditionGrade: 'GRADE_S',
    price: '',
    saleType: 'DIRECT_SALE',
    allowOffers: true,
    image: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('⚠️ กรุณาเลือกรูปภาพสินค้าก่อนบันทึกครับ');
      return;
    }

    addProduct({
      title: formData.title,
      brand: formData.brand,
      category: formData.category,
      size: formData.size,
      conditionGrade: formData.conditionGrade,
      price: Number(formData.price),
      saleType: formData.saleType,
      allowOffers: formData.allowOffers,
      image: formData.image,
    });

    alert(`✅ บันทึกและดันสินค้าขึ้นหน้าแรกเรียบร้อย!\nชื่อ: ${formData.title}`);
    router.push('/admin/products');
  };

  return (
    <div className="space-y-6 text-black">
      <div className="flex items-center justify-between border-b-2 border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black italic tracking-wider uppercase text-black flex items-center gap-2">
              <Plus className="w-6 h-6 text-red-600" /> เพิ่มสินค้าใหม่ของร้าน (KUISCOOLZ Official)
            </h1>
            <p className="text-xs text-gray-500 font-bold">
              กรอกสเปกสัดส่วนวัดจริงและอัปโหลดรูปถ่ายสินค้าเพื่อนำไปขึ้นแสดงในหน้าแรก
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-black rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-red-600 border-b pb-2">
            1. ข้อมูลทั่วไปของสินค้า
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-black">
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-black uppercase">ชื่อสินค้า / รุ่น</label>
              <input
                type="text"
                required
                placeholder="เช่น เสื้อเชิ้ต Vintage Polo Ralph Lauren Classic Fit"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-black uppercase">แบรนด์ (Brand)</label>
              <input
                type="text"
                required
                placeholder="เช่น Polo Ralph Lauren, Nike, Levi's"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-black uppercase">หมวดหมู่สินค้า</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
              >
                <option value="Shirt">Shirt (เสื้อ)</option>
                <option value="Outerwear">Outerwear (แจ็คเก็ต)</option>
                <option value="Pants">Pants (กางเกง)</option>
                <option value="Shoes">Shoes (รองเท้า)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-red-600 border-b pb-2">
            2. สเปกสัดส่วนวัดจริง & เกรดสภาพ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-black">
            <div className="space-y-1.5">
              <label className="block text-black uppercase">สเปกวัดจริง (Size Details)</label>
              <input
                type="text"
                required
                placeholder="เช่น L (อก 44 / ยาว 30) หรือ 42 EU / 8.5 US"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-black uppercase">เกรดสภาพสินค้า</label>
              <select
                value={formData.conditionGrade}
                onChange={(e) => setFormData({ ...formData, conditionGrade: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
              >
                <option value="GRADE_S">เกรด S (เหมือนใหม่ / Deadstock)</option>
                <option value="GRADE_A">เกรด A (สภาพดีมาก 90%+)</option>
                <option value="GRADE_B">เกรด B (มีรอยใช้งานเล็กน้อย)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-red-600 border-b pb-2">
            3. ราคา & รูปถ่ายสินค้า
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-black">
            <div className="space-y-1.5">
              <label className="block text-black uppercase">ราคาขาย (บาท)</label>
              <input
                type="number"
                required
                placeholder="เช่น 1290"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-black uppercase">รูปแบบการขาย</label>
              <select
                value={formData.saleType}
                onChange={(e) => setFormData({ ...formData, saleType: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
              >
                <option value="DIRECT_SALE">ขายตรง (Direct Sale)</option>
                <option value="AUCTION">เปิดประมูล (Auction)</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-black uppercase">เลือกรูปภาพสินค้าจากเครื่อง</label>
              <div className="flex flex-col sm:flex-row items-center gap-4 border-2 border-dashed border-gray-300 p-4 rounded-2xl bg-gray-50 hover:border-black transition-colors">
                <label className="cursor-pointer bg-black text-white font-black px-4 py-3 rounded-xl text-xs flex items-center gap-2 hover:bg-red-600 transition-colors">
                  <Upload className="w-4 h-4" /> เลือกไฟล์รูปภาพ
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imagePreview ? (
                  <div className="flex items-center gap-3">
                    <img src={imagePreview} alt="พรีวิว" className="w-20 h-20 object-cover rounded-xl border-2 border-black" />
                    <span className="text-[11px] text-emerald-600 font-bold">✓ อัปโหลดรูปเรียบร้อยแล้ว</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" /> ยังไม่ได้เลือกไฟล์
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black hover:bg-red-600 text-white font-black py-4 rounded-xl text-xs transition-all uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> บันทึกและลงขายทันที
        </button>
      </form>
    </div>
  );
}