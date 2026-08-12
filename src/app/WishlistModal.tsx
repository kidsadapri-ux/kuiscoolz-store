'use client';

import { X, Heart, Trash2, ShoppingCart } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: any[];
  onRemoveItem: (id: string) => void;
  onBuyItem: (product: any) => void;
}

export default function WishlistModal({
  isOpen,
  onClose,
  wishlist,
  onRemoveItem,
  onBuyItem,
}: WishlistModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-base font-black text-gray-900">
              สินค้าที่ถูกใจ ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* รายการสินค้า */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Heart className="w-12 h-12 text-gray-200 mx-auto" />
              <p className="text-xs font-bold text-gray-400">ยังไม่มีรายการที่บันทึกไว้</p>
              <p className="text-[11px] text-gray-300">กดไอคอนหัวใจที่รูปสินค้าเพื่อบันทึกไว้ดูภายหลังได้ครับ</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                  />
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-[11px] text-gray-400 font-bold">{item.sizeText}</p>
                    <p className="text-xs font-black text-red-600">฿{item.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onBuyItem(item);
                      onClose();
                    }}
                    className="bg-black hover:bg-gray-800 text-white p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    title="สั่งซื้อ"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-xl transition-colors"
                    title="ลบออก"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}