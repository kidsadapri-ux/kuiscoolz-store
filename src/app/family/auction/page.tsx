'use client';

import { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Gavel, Plus, Trash2, Upload, Sparkles, Flame } from 'lucide-react';

export default function AdminAuctionPage() {
  const { auctionItem, updateAuctionItem, deleteAuctionItem } = useStore();

  const [form, setForm] = useState({
    title: '',
    description: '',
    currentBid: 0,
    image: '',
  });

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (auctionItem) {
      setForm({
        title: auctionItem.title,
        description: auctionItem.description,
        currentBid: auctionItem.currentBid,
        image: auctionItem.image,
      });
      setPreview(auctionItem.image);
    } else {
      setForm({ title: '', description: '', currentBid: 0, image: '' });
      setPreview(null);
    }
  }, [auctionItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setForm((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      alert('⚠️ กรุณาเลือกไฟล์รูปภาพสินค้าประมูลด้วยครับ');
      return;
    }
    updateAuctionItem({
      title: form.title,
      description: form.description,
      currentBid: Number(form.currentBid),
      image: form.image,
    });
    alert('✅ บันทึก/อัปเดตระบบประมูลเรียบร้อยแล้ว!');
  };

  const handleDelete = () => {
    if (confirm('คุณต้องการลบ/ปิดรายการประมูลนี้ออกจากหน้าแรกใช่หรือไม่?')) {
      deleteAuctionItem();
      alert('🗑️ ลบรายการประมูลออกจากหน้าแรกเรียบร้อยครับ!');
    }
  };

  return (
    <div className="space-y-6 text-black">
      
      <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black italic tracking-wider uppercase flex items-center gap-2">
            <Gavel className="w-6 h-6 text-purple-600" /> จัดการระบบประมูลสด (Live Auction Manager)
          </h1>
          <p className="text-xs text-gray-500 font-bold">
            แก้ไข สร้างใหม่ หรือกดลบรายการประมูลสดที่แสดงบนหน้าแรกของร้าน
          </p>
        </div>

        {auctionItem && (
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 uppercase transition-colors active:scale-95 shadow-md"
          >
            <Trash2 className="w-4 h-4" /> ลบรายการประมูล
          </button>
        )}
      </div>

      {/* ฟอร์มสร้าง / แก้ไขการประมูล */}
      <form onSubmit={handleSubmit} className="bg-white border-2 border-black rounded-3xl p-6 shadow-xl space-y-6">
        <h2 className="text-sm font-black uppercase text-black flex items-center gap-2">
          {auctionItem ? (
            <>
              <Flame className="w-4 h-4 text-amber-500" /> แก้ไขรายการประมูลปัจจุบัน
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-emerald-600" /> สร้างรายการประมูลใหม่
            </>
          )}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-black">
          
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-black uppercase">ชื่อสินค้าประมูล (Title)</label>
            <input
              type="text"
              required
              placeholder="เช่น เสื้อยืด VINTAGE NIRVANA HEART SHAPED BOX 90S"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-black uppercase">รายละเอียดสินค้าประมูล</label>
            <textarea
              required
              rows={2}
              placeholder="เช่น เสื้อยืดวินเทจหายากระดับการสะสม สภาพ 95%"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-black uppercase">ราคาประมูลสูงสุดปัจจุบัน (บาท)</label>
            <input
              type="number"
              required
              placeholder="เช่น 8500"
              value={form.currentBid}
              onChange={(e) => setForm({ ...form, currentBid: Number(e.target.value) })}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black text-red-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-black uppercase">เลือกไฟล์รูปภาพสินค้าประมูล</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-black text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-purple-600 transition-colors">
                <Upload className="w-4 h-4" /> เลือกรูปภาพ
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {preview ? (
                <img src={preview} alt="พรีวิว" className="w-12 h-12 object-cover rounded-lg border border-black" />
              ) : (
                <span className="text-gray-400 text-[11px]">ยังไม่ได้เลือกรูป</span>
              )}
            </div>
          </div>

        </div>

        <button
          type="submit"
          className="w-full bg-black hover:bg-purple-600 text-white font-black py-4 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> {auctionItem ? 'อัปเดตรายการประมูล' : 'ลงรายการประมูลทันที'}
        </button>

      </form>

    </div>
  );
}