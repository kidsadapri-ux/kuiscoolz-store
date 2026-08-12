'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Tag, 
  ArrowLeft, 
  PlusCircle, 
  Upload, 
  CheckCircle2, 
  Ruler, 
  Footprints
} from 'lucide-react';

export default function SellerSlotsPage() {
  const [availableSlots, setAvailableSlots] = useState(3);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Shirt');
  const [price, setPrice] = useState('');
  const [grade, setGrade] = useState('GRADE_A');
  
  // Dynamic Size State
  const [size1, setSize1] = useState(''); // อก / เอว / ไซส์รองเท้า (EU)
  const [size2, setSize2] = useState(''); // ยาว / ยาวทั้งตัว / ความยาวพื้นใน (CM)
  const [size3, setSize3] = useState(''); // ไหล่ / ปลายขา / ไซส์ US
  
  const [allowOffers, setAllowOffers] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBuyMoreSlots = () => {
    const buyCount = prompt('ต้องการซื้อ Slot ฝากขายเพิ่มกี่ Slot? (Slot ละ 10 บาท)', '5');
    if (buyCount && parseInt(buyCount) > 0) {
      const count = parseInt(buyCount);
      const totalCost = count * 10;
      if (confirm(`ยืนยันสั่งซื้อ ${count} Slot รวมเป็นเงิน ฿${totalCost} บาท?`)) {
        setAvailableSlots((prev) => prev + count);
        alert(`🎉 เติม Slot สำเร็จ! คุณมี Slot ฝากขายทั้งหมด ${availableSlots + count} Slots`);
      }
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (availableSlots <= 0) {
      return alert('Slot ฝากขายของคุณหมดแล้ว กรุณากดเติม Slot (10฿/Slot) ก่อนลงขายครับ');
    }

    if (!title || !brand || !price) {
      return alert('กรุณากรอกข้อมูลสินค้าให้ครบถ้วน');
    }

    setLoading(true);

    try {
      await fetch('/api/seller/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          brand,
          category,
          price,
          grade,
          size1,
          size2,
          size3,
          allowOffers,
          image: imagePreview,
        }),
      });

      setAvailableSlots((prev) => prev - 1);
      setIsSuccess(true);
    } catch (err) {
      setIsSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setBrand('');
    setPrice('');
    setSize1('');
    setSize2('');
    setSize3('');
    setImagePreview(null);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-16">
      
      {/* Header Bar */}
      <header className="bg-black text-white py-4 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Tag className="w-5 h-5 text-red-500" />
              ฝากขายเสื้อผ้า & รองเท้ามือสอง (10฿ / Slot)
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <span className="text-gray-400">Slot คงเหลือ:</span>
              <span className="text-amber-400 font-mono text-sm">{availableSlots}</span>
            </div>
            <button
              onClick={handleBuyMoreSlots}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shadow-sm"
            >
              + เติม Slot
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {isSuccess ? (
          <div className="bg-white rounded-2xl p-8 border shadow-sm text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-gray-900">ลงขายสินค้าเรียบร้อยแล้ว!</h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
              สินค้าของคุณถูกลงแสดงบนหน้าแรกเรียบร้อยแล้ว (หักไป 1 Slot / เหลือ {availableSlots} Slots)
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleResetForm}
                className="bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
              >
                ลงขายชิ้นถัดไป
              </button>
              <Link
                href="/"
                className="bg-gray-100 text-gray-700 text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
              >
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 space-y-6">
            
            <div className="border-b pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-red-600" /> กรอกรายละเอียดสินค้า
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  ระบุไซส์และวัดสัดส่วนจริง ถ่ายรูปมุมตำหนิชัดเจน ช่วยให้ปิดการขายได้เร็วขึ้น!
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-5">
              
              {/* อัปโหลดรูปภาพสินค้า */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-red-600" /> รูปถ่ายสินค้าสภาพจริง (หน้า-หลัง/พื้นรองเท้า/ตำหนิ)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-black transition-colors relative bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img src={imagePreview} alt="พรีวิวสินค้า" className="h-44 mx-auto object-contain rounded-xl border shadow-sm" />
                      <p className="text-[10px] text-emerald-600 font-bold">✓ อัปโหลดรูปถ่ายเรียบร้อยแล้ว (คลิกเพื่อเปลี่ยนรูป)</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-4">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-xs font-bold text-gray-700">คลิกที่นี่เพื่อแนบรูปถ่ายสินค้า</p>
                      <p className="text-[10px] text-gray-400">รองรับไฟล์ JPG, PNG</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ชื่อสินค้า & แบรนด์ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">ชื่อสินค้า / รุ่น / ยุคปี</label>
                  <input
                    type="text"
                    required
                    placeholder={category === 'Shoes' ? "เช่น Nike Air Jordan 1 Retro High Chicago" : "เช่น เสื้อเชิ้ต Vintage Polo Ralph Lauren"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">แบรนด์ (Brand)</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น Nike, Adidas, Polo, Levi's"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-black uppercase"
                  />
                </div>
              </div>

              {/* หมวดหมู่ & เกรดสภาพสินค้า & ราคา */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">หมวดหมู่</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      // ล้างค่าไซส์เดิมเวลาเปลี่ยนหมวดหมู่
                      setSize1('');
                      setSize2('');
                      setSize3('');
                    }}
                    className="w-full border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-black bg-amber-50 border-amber-300"
                  >
                    <option value="Shirt">Shirt (เสื้อเชิ้ต/เสื้อยืด)</option>
                    <option value="Outerwear">Outerwear (แจ็คเก็ต/สเวตเตอร์)</option>
                    <option value="Pants">Pants (กางเกงยีนส์/สแล็ค)</option>
                    <option value="Shoes">👟 Shoes (รองเท้า)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">เกรดสภาพสินค้า</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-black"
                  >
                    <option value="GRADE_S">เกรด S (เหมือนใหม่/กล่องครบ)</option>
                    <option value="GRADE_A">เกรด A (สภาพดีมาก 90%+)</option>
                    <option value="GRADE_B">เกรด B (มีรอยใช้งาน/ตำหนิตามภาพ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">ราคาตั้งขาย (บาท)</label>
                  <input
                    type="number"
                    required
                    placeholder="เช่น 2500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border rounded-xl p-2.5 text-xs font-black text-red-600 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* ⚡ สัดส่วน / ขนาดรองเท้า (เปลี่ยนตามหมวดหมู่แบบ Dynamic) */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 transition-all">
                {category === 'Shoes' ? (
                  /* 👟 กรณีเลือกรองเท้า (Shoes) */
                  <>
                    <label className="text-xs font-bold text-blue-700 flex items-center gap-1">
                      <Footprints className="w-4 h-4 text-blue-600" /> ขนาดรองเท้า (Shoe Size & Measurements)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">ไซส์รองเท้า (EU)</span>
                        <input
                          type="text"
                          required
                          placeholder="เช่น 42.5 หรือ 43"
                          value={size1}
                          onChange={(e) => setSize1(e.target.value)}
                          className="w-full border rounded-lg p-2 text-xs font-bold bg-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">ความยาวแผ่นรองใน (CM)</span>
                        <input
                          type="text"
                          placeholder="เช่น 27.5 cm"
                          value={size2}
                          onChange={(e) => setSize2(e.target.value)}
                          className="w-full border rounded-lg p-2 text-xs font-bold bg-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">ไซส์ (US / UK)</span>
                        <input
                          type="text"
                          placeholder="เช่น 9.5 US / 9 UK"
                          value={size3}
                          onChange={(e) => setSize3(e.target.value)}
                          className="w-full border rounded-lg p-2 text-xs font-bold bg-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </>
                ) : category === 'Pants' ? (
                  /* 👖 กรณีกางเกง (Pants) */
                  <>
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <Ruler className="w-4 h-4 text-red-600" /> สัดส่วนกางเกงวัดจริง (นิ้ว)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">รอบเอววัดจริง (Waist)</span>
                        <input
                          type="text"
                          required
                          placeholder='เช่น 32"'
                          value={size1}
                          onChange={(e) => setSize1(e.target.value)}
                          className="w-full border rounded-lg p-2 text-xs font-bold bg-white focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">ความยาวทั้งตัว (Length)</span>
                        <input
                          type="text"
                          placeholder='เช่น 40"'
                          value={size2}
                          onChange={(e) => setSize2(e.target.value)}
                          className="w-full border rounded-lg p-2 text-xs font-bold bg-white focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">ปลายขา (Leg Opening)</span>
                        <input
                          type="text"
                          placeholder='เช่น 8"'
                          value={size3}
                          onChange={(e) => setSize3(e.target.value)}
                          className="w-full border rounded-lg p-2 text-xs font-bold bg-white focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  /* 👕 กรณีเสื้อ / แจ็คเก็ต (Shirt / Outerwear) */
                  <>
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <Ruler className="w-4 h-4 text-red-600" /> สัดส่วนเสื้อวัดจริง (นิ้ว)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">รอบอก (Chest)</span>
                        <input
                          type="text"
                          required
                          placeholder='เช่น 22"'
                          value={size1}
                          onChange={(e) => setSize1(e.target.value)}
                          className="w-full border rounded-lg p-2 text-xs font-bold bg-white focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">ความยาว (Length)</span>
                        <input
                          type="text"
                          placeholder='เช่น 29"'
                          value={size2}
                          onChange={(e) => setSize2(e.target.value)}
                          className="w-full border rounded-lg p-2 text-xs font-bold bg-white focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">ไหล่กว้าง (Shoulder)</span>
                        <input
                          type="text"
                          placeholder='เช่น 19"'
                          value={size3}
                          onChange={(e) => setSize3(e.target.value)}
                          className="w-full border rounded-lg p-2 text-xs font-bold bg-white focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* ตัวเลือกเปิดให้ต่อรองราคาได้ */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="allowOffers"
                  checked={allowOffers}
                  onChange={(e) => setAllowOffers(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                />
                <label htmlFor="allowOffers" className="text-xs font-bold text-gray-700 cursor-pointer">
                  อนุญาตให้ผู้ซื้อยื่นข้อเสนอต่อรองราคาได้ (💬 ต่อรองราคาได้)
                </label>
              </div>

              {/* ปุ่มยื่นลงขาย */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md mt-4 flex items-center justify-center gap-1.5"
              >
                <Tag className="w-4 h-4" />
                {loading ? 'กำลังลงขาย...' : `ยืนยันลงขายสินค้า (ใช้ 1 Slot / เหลือ ${availableSlots} Slots)`}
              </button>

            </form>
          </div>
        )}

      </main>

    </div>
  );
}