'use client';

import { useState } from 'react';
import { X, QrCode, Upload, CheckCircle2, Copy, Building2, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderNumber: string;
    productTitle: string;
    amount: number;
    paymentMethod: string;
  } | null;
}

export default function PaymentModal({ isOpen, onClose, orderData }: PaymentModalProps) {
  const [slipFile, setSlipFile] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !orderData) return null;

  // ฟังก์ชันจำลองการเลือกรูปสลิป
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // คัดลอกเลขบัญชี/พร้อมเพย์
  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // กดยืนยันแจ้งชำระเงิน
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipFile) {
      return alert('กรุณาอัปโหลดสลิปโอนเงินเพื่อยืนยัน');
    }

    setLoading(true);

    try {
      await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderNumber,
          slipImage: slipFile,
          paymentMethod: orderData.paymentMethod,
        }),
      });

      setIsSuccess(true);
    } catch (err) {
      setIsSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setSlipFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* ปุ่มปิด */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* หน้าจอแจ้งชำระเงินสำเร็จ */
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-gray-900">แจ้งชำระเงินสำเร็จ!</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              ระบบได้รับหลักฐานการโอนเงินของออเดอร์ <span className="font-mono font-bold text-black">{orderData.orderNumber}</span> แล้ว
              <br />ผู้ขายจะทำการตรวจสอบสลิปและจัดส่งสินค้าให้โดยเร็วที่สุดครับ
            </p>
            <button
              onClick={handleClose}
              className="bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 mt-4"
            >
              เสร็จสิ้น
            </button>
          </div>
        ) : (
          /* ฟอร์มแสดง QR Code / เลขบัญชี & อัปโหลดสลิป */
          <>
            <div className="flex items-center gap-2 border-b pb-3">
              <QrCode className="w-5 h-5 text-red-600" />
              <div>
                <h2 className="text-lg font-black text-gray-900">ชำระเงิน & แนบสลิป</h2>
                <p className="text-[10px] text-gray-400">เลขที่คำสั่งซื้อ: {orderData.orderNumber}</p>
              </div>
            </div>

            {/* ยอดเงินที่ต้องโอน */}
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-center space-y-0.5">
              <span className="text-[10px] text-gray-500 uppercase font-bold">ยอดที่ต้องชำระสุทธิ</span>
              <div className="text-2xl font-black text-red-600">฿{orderData.amount.toLocaleString()}</div>
            </div>

            {/* ส่วนแสดง QR Code PromptPay หรือ โอนธนาคาร */}
            {orderData.paymentMethod === 'PROMPTPAY' ? (
              <div className="space-y-2 text-center bg-gray-50 p-4 rounded-xl border">
                <div className="text-xs font-bold text-gray-700 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> สแกน QR Code เพื่อชำระเงิน
                </div>
                
                {/* รูปตัวอย่าง QR Code PromptPay */}
                <div className="bg-white p-3 rounded-lg border w-44 h-44 mx-auto flex items-center justify-center shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PROMPTPAY-0812345678-AMOUNT-${orderData.amount}`}
                    alt="PromptPay QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
                  <span>พร้อมเพย์: <strong className="font-mono text-black">081-234-5678</strong></span>
                  <button
                    type="button"
                    onClick={() => handleCopyAccount('0812345678')}
                    className="text-red-600 hover:text-red-700 font-bold ml-1"
                  >
                    {copied ? 'คัดลอกแล้ว!' : <Copy className="w-3.5 h-3.5 inline" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 bg-gray-50 p-4 rounded-xl border text-xs">
                <div className="font-bold text-gray-700 flex items-center gap-1.5 border-b pb-2">
                  <Building2 className="w-4 h-4 text-blue-600" /> บัญชีธนาคารสำหรับโอนเงิน
                </div>
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ธนาคาร:</span>
                    <span className="font-bold text-gray-900">กสิกรไทย (KBANK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ชื่อบัญชี:</span>
                    <span className="font-bold text-gray-900">ร้านขายเสื้อผ้ามือสอง</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">เลขที่บัญชี:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-black">123-4-56789-0</span>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount('1234567890')}
                        className="text-red-600 hover:text-red-700 font-bold ml-1"
                      >
                        {copied ? 'คัดลอกแล้ว!' : <Copy className="w-3.5 h-3.5 inline" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* อัปโหลดสลิปการโอนเงิน */}
            <form onSubmit={handleSubmitPayment} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-red-600" /> อัปโหลดสลิปการโอนเงิน
                </label>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center hover:border-black transition-colors relative bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {slipFile ? (
                    <div className="space-y-1">
                      <img src={slipFile} alt="สลิปที่เลือก" className="h-28 mx-auto object-contain rounded border" />
                      <p className="text-[10px] text-emerald-600 font-bold">✓ เลือกสลิปเรียบร้อยแล้ว (คลิกเพื่อเปลี่ยนรูป)</p>
                    </div>
                  ) : (
                    <div className="space-y-1 py-2">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                      <p className="text-xs font-medium text-gray-600">คลิกที่นี่เพื่อแนบรูปสลิปโอนเงิน</p>
                      <p className="text-[10px] text-gray-400">รองรับไฟล์ JPG, PNG</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ปุ่มแจ้งชำระเงิน */}
              <button
                type="submit"
                disabled={loading || !slipFile}
                className={`w-full font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-1.5 ${
                  slipFile
                    ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'กำลังส่งหลักฐาน...' : 'ยืนยันแจ้งชำระเงิน'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}