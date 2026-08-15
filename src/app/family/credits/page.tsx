'use client';

import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FileText, Plus, Upload, Trash2 } from 'lucide-react';

export default function AdminCreditsPage() {
  const { creditSlips, addCreditSlip, deleteCreditSlip } = useStore();

  const [creditForm, setCreditForm] = useState({
    customerName: '',
    itemTitle: '',
    price: '',
    trackingNo: '',
    slipImage: '',
  });

  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSlipPreview(result);
        setCreditForm({ ...creditForm, slipImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditForm.slipImage) {
      alert('⚠️ กรุณาเลือกไฟล์สลิปการโอนเงินก่อนบันทึกครับ');
      return;
    }

    addCreditSlip({
      customerName: creditForm.customerName,
      itemTitle: creditForm.itemTitle,
      price: Number(creditForm.price),
      trackingNo: creditForm.trackingNo,
      slipImage: creditForm.slipImage,
    });

    alert(`✅ บันทึกสลิปเครดิตการโอนเรียบร้อย!\nลูกค้า: ${creditForm.customerName}`);
    setCreditForm({ customerName: '', itemTitle: '', price: '', trackingNo: '', slipImage: '' });
    setSlipPreview(null);
  };

  return (
    <div className="space-y-8 text-black">
      
      <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black italic tracking-wider uppercase flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" /> จัดการสลิปเครดิตการโอนเงิน (Verified Credits)
          </h1>
          <p className="text-xs text-gray-500 font-bold">
            เพิ่มหลักฐาน ดูรายการ หรือลบสลิปเครดิตเพื่อควบคุมสิ่งที่แสดงผลหน้าแรกของร้าน
          </p>
        </div>
      </div>

      {/* 1. ฟอร์มเพิ่มสลิปเครดิต */}
      <form onSubmit={handleAddCredit} className="bg-white border-2 border-black rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-black uppercase text-black flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-600" /> อัปโหลดสลิปเครดิตใหม่
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-black">
          <div className="space-y-1.5">
            <label className="block text-black uppercase">ชื่อลูกค้า</label>
            <input
              type="text"
              required
              placeholder="เช่น กฤษฎา พ."
              value={creditForm.customerName}
              onChange={(e) => setCreditForm({ ...creditForm, customerName: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-black uppercase">ยอดโอนเงิน (บาท)</label>
            <input
              type="number"
              required
              placeholder="เช่น 1290"
              value={creditForm.price}
              onChange={(e) => setCreditForm({ ...creditForm, price: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-black uppercase">ชื่อสินค้าที่จัดส่ง</label>
            <input
              type="text"
              required
              placeholder="เช่น เสื้อเชิ้ต Vintage Polo Ralph Lauren Classic Fit"
              value={creditForm.itemTitle}
              onChange={(e) => setCreditForm({ ...creditForm, itemTitle: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-black uppercase">เลขติดตามพัสดุ (Tracking No.)</label>
            <input
              type="text"
              required
              placeholder="เช่น TH014829XXXXX"
              value={creditForm.trackingNo}
              onChange={(e) => setCreditForm({ ...creditForm, trackingNo: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-black font-extrabold focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-black uppercase">เลือกไฟล์สลิปการโอนจากเครื่อง</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-black text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-emerald-600 transition-colors">
                <Upload className="w-4 h-4" /> เลือกไฟล์สลิป
                <input type="file" accept="image/*" onChange={handleSlipChange} className="hidden" />
              </label>
              {slipPreview ? (
                <div className="flex items-center gap-2">
                  <img src={slipPreview} alt="พรีวิว" className="w-12 h-12 object-cover rounded-lg border border-black" />
                  <span className="text-[10px] text-emerald-600 font-bold">✓ เลือกรูปสลิปแล้ว</span>
                </div>
              ) : (
                <span className="text-gray-400 text-[11px] font-bold">ยังไม่ได้เลือกรูป</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black hover:bg-emerald-600 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md active:scale-95"
        >
          บันทึกเครดิตการจัดส่ง
        </button>
      </form>

      {/* 2. 🟢 ตารางรายการสลิปเครดิตที่มีอยู่ทั้งหมดในระบบ */}
      <div className="space-y-4">
        <h2 className="text-base font-black uppercase text-black flex items-center gap-2">
          <FileText className="w-5 h-5 text-black" /> รายการสลิปเครดิตในระบบ ({creditSlips.length} รายการ)
        </h2>

        <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-xl">
          {creditSlips.length === 0 ? (
            <div className="p-8 text-center text-gray-400 font-bold text-xs">
              ยังไม่มีรายการสลิปเครดิตในระบบ
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs font-bold">
              <thead>
                <tr className="bg-black text-white uppercase text-[11px] font-black">
                  <th className="p-4">รูปสลิป</th>
                  <th className="p-4">ชื่อลูกค้า</th>
                  <th className="p-4">สินค้า</th>
                  <th className="p-4">ยอดโอน</th>
                  <th className="p-4">เลขพัสดุ</th>
                  <th className="p-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y border-gray-200">
                {creditSlips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={slip.slipImage}
                        alt="สลิป"
                        className="w-12 h-16 object-cover rounded-lg border border-gray-300 shadow-sm"
                      />
                    </td>
                    <td className="p-4 font-black">{slip.customerName}</td>
                    <td className="p-4 text-gray-700 max-w-xs truncate">{slip.itemTitle}</td>
                    <td className="p-4 font-black text-emerald-600">฿{slip.price.toLocaleString()}</td>
                    <td className="p-4 font-mono text-gray-600">{slip.trackingNo}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบสลิปเครดิตของ "${slip.customerName}" ใช่หรือไม่?`)) {
                            deleteCreditSlip(slip.id);
                          }
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-colors inline-flex items-center gap-1 font-black text-[10px]"
                        title="ลบสลิปเครดิต"
                      >
                        <Trash2 className="w-4 h-4" /> ลบสลิป
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}