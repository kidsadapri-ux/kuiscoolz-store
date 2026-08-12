'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Eye, 
  X, 
  MapPin, 
  ArrowLeft,
  Send,
  FileText
} from 'lucide-react';

// ตัวอย่างข้อมูลคำสั่งซื้อฝั่งผู้ขาย (Mock Data)
const INITIAL_ORDERS = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-892101',
    createdAt: '2026-08-09 11:30',
    buyerName: 'กฤษฎา ภูมิสายลอน',
    phone: '081-999-8888',
    shippingAddress: '99/1 ม.3 ต.หนองทุ่ม อ.เซกา จ.บึงกาฬ 38150',
    productTitle: 'เสื้อเชิ้ต Vintage Polo Ralph Lauren Classic Fit',
    price: 1290,
    paymentMethod: 'PROMPTPAY',
    slipImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&q=80',
    status: 'PAID_PENDING_SHIPMENT', // รอจัดส่ง
    trackingNumber: '',
    courier: 'FLASH_EXPRESS',
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-892102',
    createdAt: '2026-08-08 16:45',
    buyerName: 'สมชาย สายวินเทจ',
    phone: '082-333-4444',
    shippingAddress: '123/4 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110',
    productTitle: 'แจ็คเก็ตยีนส์ Levi’s 70505 Small e 80s Vintage',
    price: 3500,
    paymentMethod: 'BANK_TRANSFER',
    slipImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&q=80',
    status: 'SHIPPED', // จัดส่งแล้ว
    trackingNumber: 'TH01234567890F',
    courier: 'FLASH_EXPRESS',
  },
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [courierInput, setCourierInput] = useState('FLASH_EXPRESS');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // ฟังก์ชันอัปเดตเลขพัสดุและเปลี่ยนสถานะเป็นจัดส่งแล้ว
  const handleUpdateTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return alert('กรุณากรอกเลขพัสดุ');

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === selectedOrder.id
          ? {
              ...ord,
              status: 'SHIPPED',
              trackingNumber: trackingInput,
              courier: courierInput,
            }
          : ord
      )
    );

    alert(`✅ อัปเดตเลขพัสดุ ${trackingInput} สำหรับออเดอร์ ${selectedOrder.orderNumber} เรียบร้อยแล้ว!`);
    setSelectedOrder(null);
    setTrackingInput('');
  };

  // ตัวกรองตามสถานะ
  const filteredOrders = orders.filter((ord) => {
    if (filterStatus === 'PENDING') return ord.status === 'PAID_PENDING_SHIPMENT';
    if (filterStatus === 'SHIPPED') return ord.status === 'SHIPPED';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      
      {/* Header Bar */}
      <header className="bg-black text-white py-4 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-500" />
              จัดการคำสั่งซื้อร้านค้า (Seller Dashboard)
            </h1>
          </div>
          <span className="text-xs bg-amber-500 text-black font-bold px-2.5 py-1 rounded-md">
            ฝั่งผู้ขาย
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {/* แถบสรุป & ตัวกรอง */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-gray-400">กรองสถานะ:</span>
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterStatus === 'ALL' ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-700'
              }`}
            >
              ทั้งหมด ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterStatus === 'PENDING' ? 'bg-amber-500 text-black border-amber-500 font-extrabold' : 'bg-gray-50 text-gray-700'
              }`}
            >
              รอจัดส่ง ({orders.filter((o) => o.status === 'PAID_PENDING_SHIPMENT').length})
            </button>
            <button
              onClick={() => setFilterStatus('SHIPPED')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterStatus === 'SHIPPED' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700'
              }`}
            >
              จัดส่งแล้ว ({orders.filter((o) => o.status === 'SHIPPED').length})
            </button>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            มีรายการที่ต้องจัดส่ง <span className="font-bold text-red-600">{orders.filter((o) => o.status === 'PAID_PENDING_SHIPMENT').length}</span> รายการ
          </div>
        </div>

        {/* ตารางรายการคำสั่งซื้อ */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 font-bold border-b uppercase text-[10px]">
                <tr>
                  <th className="p-4">เลขคำสั่งซื้อ / เวลา</th>
                  <th className="p-4">สินค้า</th>
                  <th className="p-4">ผู้ซื้อ / ที่อยู่</th>
                  <th className="p-4 text-right">ยอดเงิน</th>
                  <th className="p-4 text-center">สถานะ</th>
                  <th className="p-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* เลขคำสั่งซื้อ */}
                    <td className="p-4 align-top">
                      <div className="font-mono font-bold text-black">{ord.orderNumber}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{ord.createdAt}</div>
                    </td>

                    {/* สินค้า */}
                    <td className="p-4 align-top max-w-xs">
                      <div className="font-bold text-gray-900 line-clamp-2">{ord.productTitle}</div>
                      <span className="text-[10px] text-gray-400">ชำระผ่าน: {ord.paymentMethod}</span>
                    </td>

                    {/* ผู้ซื้อ & ที่อยู่ */}
                    <td className="p-4 align-top max-w-xs">
                      <div className="font-bold text-gray-900">{ord.buyerName} ({ord.phone})</div>
                      <div className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">{ord.shippingAddress}</div>
                    </td>

                    {/* ยอดเงิน */}
                    <td className="p-4 align-top text-right font-black text-red-600 text-sm">
                      ฿{ord.price.toLocaleString()}
                    </td>

                    {/* สถานะ */}
                    <td className="p-4 align-top text-center">
                      {ord.status === 'PAID_PENDING_SHIPMENT' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3 animate-spin" /> ชำระแล้ว (รอจัดส่ง)
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> จัดส่งแล้ว
                          </span>
                          <div className="text-[10px] font-mono text-gray-500 font-bold">{ord.trackingNumber}</div>
                        </div>
                      )}
                    </td>

                    {/* ปุ่มการจัดการ */}
                    <td className="p-4 align-top text-center">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setTrackingInput(ord.trackingNumber);
                        }}
                        className="bg-black hover:bg-gray-800 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> ตรวจสอบ / ส่งของ
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Modal ดูสลิป & กรอกเลขพัสดุ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3 space-y-0.5">
              <h2 className="text-lg font-black text-gray-900">รายละเอียดคำสั่งซื้อ</h2>
              <p className="text-xs text-gray-400">เลขที่ออเดอร์: {selectedOrder.orderNumber}</p>
            </div>

            {/* ที่อยู่จัดส่ง */}
            <div className="bg-gray-50 p-3 rounded-xl border text-xs space-y-1">
              <div className="font-bold text-gray-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> ที่อยู่สำหรับจัดส่งพัสดุ
              </div>
              <div className="font-bold text-gray-900">{selectedOrder.buyerName} | {selectedOrder.phone}</div>
              <div className="text-gray-600 leading-relaxed">{selectedOrder.shippingAddress}</div>
            </div>

            {/* ดูสลิปโอนเงิน */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" /> หลักฐานสลิปโอนเงินลูกค้า
              </label>
              <div className="bg-gray-100 p-2 rounded-xl border text-center">
                <img
                  src={selectedOrder.slipImage}
                  alt="สลิปโอนเงิน"
                  className="max-h-48 mx-auto object-contain rounded border shadow-sm"
                />
              </div>
            </div>

            {/* ฟอร์มกรอกเลขพัสดุ */}
            <form onSubmit={handleUpdateTracking} className="space-y-3 pt-2 border-t">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" /> กรอกเลขพัสดุสำหรับจัดส่ง
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={courierInput}
                    onChange={(e) => setCourierInput(e.target.value)}
                    className="border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-black col-span-1"
                  >
                    <option value="FLASH_EXPRESS">Flash Express</option>
                    <option value="THAI_POST">ไปรษณีย์ไทย (EMS)</option>
                    <option value="KERRY">Kerry Express</option>
                    <option value="J_AND_T">J&T Express</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="เช่น TH01234567890F"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="border rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-black col-span-2 uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" /> บันทึกและแจ้งเลขพัสดุให้ผู้ซื้อ
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}