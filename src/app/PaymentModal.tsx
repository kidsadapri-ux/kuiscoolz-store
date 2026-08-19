'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, CheckCircle2, Upload, AlertCircle, ShoppingBag } from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
  onPaymentSuccess?: (productId: string) => void;
}

export default function PaymentModal({ isOpen, onClose, orderData, onPaymentSuccess }: PaymentModalProps) {
  const [slipUrl, setSlipUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !orderData) return null;

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productId = orderData.productId || orderData.product?.id || orderData.id;

      // 1. อัปเดตสถานะสินค้าในตาราง products เป็น SOLD_OUT ทันที
      if (productId) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ status: 'SOLD_OUT' })
          .eq('id', productId);

        if (updateError) {
          console.error('Error updating product status:', updateError);
        }
      }

      // 2. บันทึกคำสั่งซื้อลงตาราง orders (ถ้ามีตารางนี้)
      await supabase.from('orders').insert([
        {
          product_id: productId,
          product_title: orderData.product?.title || orderData.title,
          amount: orderData.totalPrice || orderData.price,
          customer_name: orderData.customerName || 'Customer',
          customer_address: orderData.address || '-',
          customer_tel: orderData.phone || '-',
          slip_url: slipUrl || null,
          status: 'PAID',
        }
      ]);

      setIsSuccess(true);
      if (onPaymentSuccess && productId) {
        onPaymentSuccess(productId);
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-[#007d48] mx-auto" />
            <h3 className="text-2xl font-black uppercase text-[#111111]">ชำระเงินสำเร็จ</h3>
            <p className="text-xs text-gray-500 font-medium">
              ระบบได้ปรับสถานะสินค้านี้เป็น <strong className="text-red-600">SOLD OUT</strong> เรียบร้อยแล้ว ทางร้านจะรีบจัดส่งให้ทันที
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full bg-[#111111] hover:bg-black text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider transition-all"
            >
              เสร็จสิ้น
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirmPayment} className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="text-lg font-black uppercase text-[#111111]">ยืนยันการชำระเงิน</h3>
              <p className="text-xs text-gray-400">โอนเงินและแนบหลักฐานเพื่อตัดสต็อกสินค้าทันที</p>
            </div>

            <div className="bg-[#f5f5f5] p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">สินค้า:</span>
                <span className="font-bold text-[#111111]">{orderData.product?.title || orderData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">ยอดโอนสุทธิ:</span>
                <span className="font-black text-base text-[#d30005]">
                  ฿{Number(orderData.totalPrice || orderData.price || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111111] block">ลิงก์รูปภาพสลิปโอนเงิน (ถ้ามี)</label>
              <input
                type="url"
                placeholder="https://..."
                value={slipUrl}
                onChange={(e) => setSlipUrl(e.target.value)}
                className="w-full bg-[#f5f5f5] border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#d30005] hover:bg-[#780700] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              {submitting ? 'กำลังบันทึกและตัดสต็อก...' : 'ยืนยันแจ้งชำระเงิน'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}