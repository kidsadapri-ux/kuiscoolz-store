'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Image, CheckCheck, Store } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    brand: string;
    image: string;
    price: number;
  } | null;
}

export default function ChatModal({ isOpen, onClose, product }: ChatModalProps) {
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'me' | 'seller'; text: string; time: string }>>([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ข้อความเริ่มต้นเมื่อเปิดแชต
  useEffect(() => {
    if (product) {
      setMessages([
        {
          id: 'm1',
          sender: 'seller',
          text: `สวัสดีครับ! สนใจสินค้า "${product.title}" สอบถามรูปถ่ายเพิ่มเติมหรือรอบจัดส่งได้เลยครับ 😊`,
          time: '12:30 น.',
        },
      ]);
    }
  }, [product]);

  // เลื่อนลงล่างสุดอัตโนมัติเมื่อมีข้อความใหม่
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !product) return null;

  // ฟังก์ชันส่งข้อความ
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // จำลองการตอบกลับจากผู้ขาย
    setTimeout(() => {
      const sellerReply = {
        id: `reply-${Date.now()}`,
        sender: 'seller' as const,
        text: 'รับทราบครับ เดี๋ยวสักครู่ผมถ่ายรูปมุมตำหนิเพิ่มเติมส่งให้อีกทีนะครับ!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, sellerReply]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md h-[550px] flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Header แชต */}
        <div className="bg-black text-white p-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-10 h-10 object-cover rounded-xl border border-neutral-700"
              />
              <span className="w-3 h-3 bg-emerald-500 border-2 border-black rounded-full absolute -bottom-0.5 -right-0.5"></span>
            </div>
            <div>
              <div className="text-xs font-bold text-white line-clamp-1">{product.title}</div>
              <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-1">
                <Store className="w-3 h-3" /> ผู้ขายออนไลน์อยู่
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* แถบสรุปสินค้าด่วน */}
        <div className="bg-neutral-100 px-4 py-2 flex items-center justify-between text-xs border-b">
          <span className="font-bold text-neutral-600">ราคาขาย: <strong className="text-red-600 font-black">฿{product.price.toLocaleString()}</strong></span>
          <span className="text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded font-bold">{product.brand}</span>
        </div>

        {/* โซนแสดงข้อความแชต */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/50 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 shadow-sm leading-relaxed ${
                  msg.sender === 'me'
                    ? 'bg-black text-white rounded-tr-none'
                    : 'bg-white text-neutral-900 border border-neutral-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-neutral-400 mt-1 flex items-center gap-1 px-1">
                {msg.time}
                {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-blue-500" />}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* ฟอร์มพิมพ์ส่งข้อความ */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex items-center gap-2">
          <input
            type="text"
            placeholder="พิมพ์ข้อความสอบถามผู้ขาย..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-black hover:bg-neutral-800 disabled:bg-neutral-200 text-white p-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}