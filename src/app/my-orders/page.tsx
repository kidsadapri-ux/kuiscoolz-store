'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  MapPin,
  ChevronRight
} from 'lucide-react';

// ข้อมูลจำลองรายการสั่งซื้อของผู้ซื้อ (Mock Data)
const INITIAL_MY_ORDERS = [
  {
    id: 'ord-892101',
    orderNumber: 'ORD-892101',
    createdAt: '09 ส.ค. 2026, 11:30 น.',
    productTitle: 'เสื้อเชิ้ต Vintage Polo Ralph Lauren Classic Fit',
    brand: 'POLO RALPH LAUREN',
    price: 1290,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80',
    shippingAddress: 'กฤษฎา ภูมิสายลอน | 99/1 ม.3 ต.หนองทุ่ม อ.เซกา จ.บึงกาฬ 38150',
    status: 'PAID_PENDING_SHIPMENT', // ผู้ขายกำลังเตรียมจัดส่ง
    courier: 'Flash Express',
    trackingNumber: '',
  },
  {
    id: 'ord-892100',
    orderNumber: 'ORD-892100',
    createdAt: '05 ส.ค. 2026, 14:15 น.',
    productTitle: 'กางเกงยีนส์ Levi’s 501 Vintage 90s Made in USA',
    brand: "LEVI'S",
    price: 2450,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80',
    shippingAddress: 'กฤษฎา ภูมิสายลอน | 99/1 ม.3 ต.หนองทุ่ม อ.เซกา จ.บึงกาฬ 38150',
    status: 'SHIPPED', // จัดส่งเรียบร้อย
    courier: 'Flash Express',
    trackingNumber: 'TH01234567890F',
  },
];

export default function MyOrdersPage() {
  const [orders] = useState(INITIAL_MY_ORDERS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ฟังก์ชันคัดลอกเลขพัสดุ
  const handleCopyTracking = (tracking: string, id: string) => {
    navigator.clipboard.writeText(tracking);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
              <ShoppingBag className="w-5 h-5 text-red-500" />
              คำสั่งซื้อของฉัน (My Orders)
            </h1>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            ทั้งหมด {orders.length} รายการ
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border shadow-sm space-y-3">
            <Package className="w-16 h-16 text-gray-300 mx-auto" />
            <h2 className="text-lg font-bold text-gray-700">ยังไม่มีรายการสั่งซื้อ</h2>
            <p className="text-xs text-gray-400">เลือกซื้อเสื้อผ้ามือสองสภาพดีได้ในหน้าแรกเลยครับ</p>
            <Link
              href="/"
              className="inline-block bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors mt-2"
            >
              ไปเลือกซื้อสินค้า
            </Link>
          </div>
        ) : (
          orders.map((ord) => (
            <div key={ord.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md">
              
              {/* หัวการ์ด: เลขออเดอร์ & วันที่ & สถานะ */}
              <div className="bg-gray-50/80 px-5 py-3 border-b flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-gray-900">{ord.orderNumber}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-400 text-[11px]">{ord.createdAt}</span>
                </div>

                {/* แสดง Badge สถานะ */}
                {ord.status === 'PAID_PENDING_SHIPMENT' ? (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-3 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5 animate-spin" /> ผู้ขายกำลังเตรียมจัดส่ง
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> จัดส่งเรียบร้อยแล้ว
                  </span>
                )}
              </div>

              {/* ตัวการ์ด: รายละเอียดสินค้า */}
              <div className="p-5 space-y-4">
                <div className="flex gap-4 items-start">
                  <img
                    src={ord.image}
                    alt={ord.productTitle}
                    className="w-20 h-20 object-cover rounded-xl border flex-shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">
                      {ord.brand}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                      {ord.productTitle}
                    </h3>
                    <div className="text-base font-black text-red-600 pt-0.5">
                      ฿{ord.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* ที่อยู่จัดส่ง */}
                <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 space-y-0.5 border border-gray-100">
                  <div className="font-bold text-gray-800 flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-red-600" /> ที่อยู่จัดส่ง:
                  </div>
                  <div className="pl-4 text-[11px] leading-relaxed">{ord.shippingAddress}</div>
                </div>

                {/* กล่องแสดงเลขพัสดุ (กรณีจัดส่งแล้ว) */}
                {ord.status === 'SHIPPED' && (
                  <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-600" /> ขนส่ง: {ord.courier}
                      </div>
                      <div className="text-[11px] text-gray-600">
                        เลขพัสดุ: <strong className="font-mono text-black font-bold text-xs">{ord.trackingNumber}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyTracking(ord.trackingNumber, ord.id)}
                        className="bg-white border hover:bg-gray-50 text-gray-800 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                        {copiedId === ord.id ? 'คัดลอกแล้ว!' : 'คัดลอกเลข'}
                      </button>

                      <a
                        href={`https://flashexpress.co.th/tracking/?se=${ord.trackingNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                      >
                        เช็กพัสดุ <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

              </div>

            </div>
          ))
        )}

      </main>

    </div>
  );
}