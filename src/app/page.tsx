'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from './context/StoreContext';
import AuthModal from './AuthModal';
import BuyModal from './BuyModal';
import OfferModal from './OfferModal';
import PaymentModal from './PaymentModal';
import AuctionModal from './AuctionModal';
import ChatModal from './ChatModal';
import ProductReviews from './ProductReviews';
import WishlistModal from './WishlistModal';
import { 
  User, 
  Package, 
  LogOut, 
  Tag, 
  Gavel, 
  Handshake, 
  Sparkles, 
  SlidersHorizontal,
  ArrowRight,
  X,
  MessageCircle,
  Heart,
  Camera,
  ShieldCheck,
  Flame,
  SearchX
} from 'lucide-react';

export default function HomePage() {
  const store = useStore();
  const products = store?.products || [];
  const auctionItem = store?.auctionItem || null;

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [chestFilter, setChestFilter] = useState('');
  
  const [selectedBuyProduct, setSelectedBuyProduct] = useState<any>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedOfferProduct, setSelectedOfferProduct] = useState<any>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [paymentOrderData, setPaymentOrderData] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAuctionItem, setSelectedAuctionItem] = useState<any>(null);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string; slots: number } | null>(null);
  const [selectedChatProduct, setSelectedChatProduct] = useState<any>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const toggleWishlist = (product: any) => {
    if (!product?.id) return;
    if ((wishlist || []).some((item) => item?.id === product.id)) {
      setWishlist((wishlist || []).filter((item) => item?.id !== product.id));
    } else {
      setWishlist([...(wishlist || []), product]);
    }
  };

  const hasActiveFilter = searchQuery || selectedCategory !== 'ALL' || selectedGrade !== 'ALL' || maxPrice !== '' || chestFilter !== '';

  const filteredProducts = (products || []).filter((product: any) => {
    if (!product) return false;
    const matchesSearch = 
      (product.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    const matchesGrade = selectedGrade === 'ALL' || product.conditionGrade === selectedGrade;
    const matchesPrice = maxPrice === '' || Number(product.price) <= Number(maxPrice);
    const matchesChest = !chestFilter || (selectedCategory === 'Shoes' ? product.size?.startsWith(chestFilter) : selectedCategory === 'Pants' ? true : product.size?.startsWith(chestFilter));

    return matchesSearch && matchesCategory && matchesGrade && matchesPrice && matchesChest;
  });

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      
      {/* Top Ribbon */}
      <div className="bg-black text-white text-[11px] font-extrabold py-2 px-4 uppercase tracking-widest">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
            <Camera className="w-3.5 h-3.5 text-red-600" /> IG kuisccolz
          </div>
          <div className="text-center font-black italic tracking-widest text-white">
            KUISCOOL<span className="text-red-600">Z</span> — ร้านที่ให้มากกว่าแฟชั่น
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-black">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> AUTHENTIC 100%
          </div>
        </div>
      </div>

      {/* Header Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl text-black border-b-2 border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl font-black italic tracking-tighter text-black group-hover:text-red-600 transition-colors uppercase">
              KUISCOOL<span className="text-red-600">Z</span>
            </span>
          </Link>

          <nav className="flex items-center gap-3 text-xs font-black">
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-black border border-gray-200 rounded-xl transition-all"
              title="สินค้าที่ถูกใจ"
            >
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              {(wishlist || []).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {(wishlist || []).length}
                </span>
              )}
            </button>

            <Link href="/my-orders" className="hidden sm:flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-black border border-gray-200 px-3.5 py-2 rounded-xl transition-all uppercase tracking-wider">
              <Package className="w-4 h-4 text-red-600" /> คำสั่งซื้อของฉัน
            </Link>

            <Link
              href="/seller/slots"
              className="bg-black hover:bg-gray-800 active:scale-95 text-white font-black px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1 uppercase tracking-wider"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" /> ฝากขาย (10B/Slot)
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2 bg-black text-white pl-3 py-1.5 pr-2 rounded-xl font-extrabold">
                <span className="w-6 h-6 bg-red-600 text-white rounded-md flex items-center justify-center font-black text-[10px]">
                  {currentUser.name?.charAt(0)?.toUpperCase()}
                </span>
                <span className="text-xs font-black line-clamp-1">{currentUser.name}</span>

                {currentUser.role === 'SELLER' && (
                  <Link
                    href="/seller/orders"
                    className="bg-gray-800 text-white text-[10px] font-black px-2 py-1 rounded-md transition-colors ml-1"
                  >
                    หลังบ้านผู้ขาย
                  </Link>
                )}

                <button
                  onClick={() => setCurrentUser(null)}
                  title="ออกจากระบบ"
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 uppercase tracking-wider"
              >
                <User className="w-4 h-4" /> เข้าสู่ระบบ
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Advanced Spec Filter */}
        <section className="bg-white border-2 border-black rounded-3xl p-6 shadow-xl space-y-4 text-black relative">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <h2 className="text-xs font-black text-black flex items-center gap-2 uppercase tracking-widest">
              <SlidersHorizontal className="w-4 h-4 text-red-600" /> ค้นหาสเปกสัดส่วนวัดจริง & แบรนด์
            </h2>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setSelectedGrade('ALL');
                  setMaxPrice('');
                  setChestFilter('');
                }}
                className="text-xs text-red-600 hover:text-red-700 font-black flex items-center gap-1 uppercase tracking-wider"
              >
                <X className="w-3.5 h-3.5" /> ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="space-y-1.5">
              <label className="font-black text-black block uppercase tracking-wider">หมวดหมู่สินค้า</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setChestFilter('');
                }}
                className="w-full border-2 border-gray-200 rounded-xl p-3 font-extrabold text-black bg-white focus:outline-none focus:border-black transition-colors"
              >
                <option value="ALL">ทุกหมวดหมู่</option>
                <option value="Shirt">Shirt (เสื้อ)</option>
                <option value="Outerwear">Outerwear (แจ็คเก็ต)</option>
                <option value="Pants">Pants (กางเกง)</option>
                <option value="Shoes">Shoes (รองเท้า)</option>
              </select>
            </div>

            {selectedCategory === 'Shoes' ? (
              <div className="space-y-1.5">
                <label className="font-black text-blue-600 block uppercase tracking-wider">ไซส์รองเท้า (EU)</label>
                <select
                  value={chestFilter}
                  onChange={(e) => setChestFilter(e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-xl p-3 font-extrabold text-black bg-blue-50/50 focus:outline-none focus:border-blue-600 transition-colors"
                >
                  <option value="">ทุกไซส์รองเท้า</option>
                  <option value="40">EU 40</option>
                  <option value="41">EU 41</option>
                  <option value="42">EU 42</option>
                  <option value="42.5">EU 42.5</option>
                  <option value="43">EU 43</option>
                </select>
              </div>
            ) : selectedCategory === 'Pants' ? (
              <div className="space-y-1.5">
                <label className="font-black text-black block uppercase tracking-wider">รอบเอวสูงสุด (นิ้ว)</label>
                <input
                  type="number"
                  placeholder='เช่น 32"'
                  value={chestFilter}
                  onChange={(e) => setChestFilter(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 font-extrabold text-black bg-white focus:outline-none focus:border-black transition-colors placeholder-gray-400"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="font-black text-black block uppercase tracking-wider">ไซส์เสื้อ (SIZE)</label>
                <select
                  value={chestFilter}
                  onChange={(e) => setChestFilter(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 font-extrabold text-black bg-white focus:outline-none focus:border-black transition-colors"
                >
                  <option value="">ทุกไซส์เสื้อ</option>
                  <option value="S">Size S (อก 36"-38")</option>
                  <option value="M">Size M (อก 38"-40")</option>
                  <option value="L">Size L (อก 40"-42")</option>
                  <option value="XL">Size XL (อก 42"-44")</option>
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-black text-black block uppercase tracking-wider">เกรดสภาพสินค้า</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 font-extrabold text-black bg-white focus:outline-none focus:border-black transition-colors"
              >
                <option value="ALL">ทุกเกรดสภาพ</option>
                <option value="GRADE_S">เกรด S (เหมือนใหม่)</option>
                <option value="GRADE_A">เกรด A (สภาพดีมาก)</option>
                <option value="GRADE_B">เกรด B (มีรอยใช้งาน)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-black text-black block uppercase tracking-wider">งบสูงสุด (บาท)</label>
              <input
                type="number"
                placeholder="เช่น 3000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-xl p-3 font-extrabold text-red-600 bg-white focus:outline-none focus:border-black transition-colors placeholder-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-black text-black block uppercase tracking-wider">ค้นหาแบรนด์/รุ่น</label>
              <input
                type="text"
                placeholder="เช่น Nike, Polo"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 font-extrabold text-black bg-white focus:outline-none focus:border-black transition-colors placeholder-gray-400"
              />
            </div>
          </div>
        </section>

        {/* Real-Time Live Auction Box */}
        {auctionItem ? (
          <section className="bg-white text-black border-2 border-black rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 bg-black text-amber-400 font-black text-xs px-3.5 py-1.5 rounded-md uppercase tracking-wider">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" /> REAL-TIME LIVE AUCTION
                </div>
                <h2 className="text-xl md:text-3xl font-black text-black italic tracking-tight uppercase">{auctionItem?.title}</h2>
                <p className="text-xs text-gray-500 font-bold">{auctionItem?.description}</p>
                
                <div className="pt-2 flex items-baseline justify-center md:justify-start gap-3">
                  <span className="text-xs text-gray-500 font-black uppercase tracking-wider">ราคาประมูลสูงสุดปัจจุบัน:</span>
                  <span className="text-3xl md:text-4xl font-black text-black tracking-tight">
                    ฿{Number(auctionItem?.currentBid || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedAuctionItem({
                    id: auctionItem?.id,
                    title: auctionItem?.title,
                    currentBid: auctionItem?.currentBid,
                    image: auctionItem?.image,
                  });
                  setIsAuctionModalOpen(true);
                }}
                className="w-full md:w-auto bg-black hover:bg-red-600 active:scale-95 text-white font-black px-8 py-4 rounded-xl text-xs transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider"
              >
                <Gavel className="w-4 h-4 text-amber-400" /> เข้าร่วมเคาะราคาประมูล
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-wrap justify-center gap-4 text-xs font-black text-black">
              <div className="bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>ฝากขาย 10 บาท/Slot</span>
              </div>
              <div className="bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Handshake className="w-4 h-4 text-blue-600" />
                <span>ต่อรองราคาตรงได้</span>
              </div>
              <div className="bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Gavel className="w-4 h-4 text-purple-600" />
                <span>ระบบประมูล REAL-TIME</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center space-y-2">
            <Gavel className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="text-sm font-black uppercase text-black">ยังไม่มีรายการประมูลสดในขณะนี้</h3>
            <p className="text-xs text-gray-500 font-bold">โปรดติดตามรอบการเปิดประมูลสินค้า Rare Items ครั้งถัดไป</p>
          </section>
        )}

        {/* Reviews Section */}
        <section className="bg-white border-2 border-black/10 rounded-3xl p-4 md:p-6 shadow-xl relative overflow-hidden">
          <ProductReviews />
        </section>

      </main>

      {/* Product Grid */}
      <section className="bg-gray-50 py-12 border-t-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex justify-between items-end border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black italic tracking-wider text-black flex items-center gap-2 uppercase">
                <Sparkles className="w-5 h-5 text-red-600" /> พื้นที่วางสินค้า ({filteredProducts.length} ชิ้น)
              </h2>
              <p className="text-xs text-black font-bold">สินค้ามือสองสภาพดี ถ่ายสเปกวัดจริงจากตัวจริงทุกชิ้น</p>
            </div>
            <Link href="/products" className="text-xs font-black text-red-600 hover:text-red-700 flex items-center gap-1 uppercase tracking-wider">
              ดูสินค้าทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-300 space-y-3">
              <SearchX className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-base font-black text-black uppercase">ไม่พบสินค้าในระบบ</h3>
              <p className="text-xs text-gray-500 font-bold">สินค้าอาจถูกลบหรือขายหมดแล้วครับ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => (
                <div key={product.id} className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:border-black transition-all duration-300 flex flex-col justify-between group">
                  
                  <div>
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80'}
                        alt={product.title || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {product.conditionGrade === 'GRADE_S' && <span className="text-amber-400">เกรด S (เหมือนใหม่)</span>}
                        {product.conditionGrade === 'GRADE_A' && <span className="text-emerald-400">เกรด A (สภาพดี)</span>}
                        {product.conditionGrade === 'GRADE_B' && <span className="text-blue-400">เกรด B (มีร่องรอย)</span>}
                        {!['GRADE_S', 'GRADE_A', 'GRADE_B'].includes(product.conditionGrade) && <span className="text-zinc-300">สภาพดี</span>}
                      </div>

                      {product.status === 'SOLD_OUT' && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                          <span className="bg-red-600 text-white font-black text-xs px-4 py-1.5 rounded-xl uppercase tracking-widest border border-white">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {product.brand || 'General'} • {product.category || 'Fashion'}
                      </div>
                      <h3 className="font-extrabold text-black text-sm line-clamp-2 leading-snug">
                        {product.title}
                      </h3>
                      <div className="text-xs text-black font-black bg-gray-100 p-2.5 rounded-xl border border-gray-200">
                        📏 สเปก: {product.size || 'Free Size'}
                      </div>
                      <div className="text-xl font-black text-black tracking-tight pt-1">
                        ฿{Number(product.price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 grid grid-cols-6 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedChatProduct(product);
                        setIsChatModalOpen(true);
                      }}
                      className="col-span-1 bg-white hover:bg-gray-100 text-black font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center border-2 border-gray-200 active:scale-95"
                      title="ทักแชตคุยกับผู้ขาย"
                    >
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className="col-span-1 bg-white hover:bg-gray-100 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center border-2 border-gray-200 active:scale-95"
                      title="บันทึกสินค้าที่ถูกใจ"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          (wishlist || []).some((item) => item?.id === product.id)
                            ? 'text-red-600 fill-red-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>

                    {product.allowOffers ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOfferProduct(product);
                          setIsOfferModalOpen(true);
                        }}
                        disabled={product.status === 'SOLD_OUT'}
                        className="col-span-2 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 text-blue-700 border-2 border-blue-200 font-black py-2.5 rounded-xl text-[11px] transition-all flex items-center justify-center gap-1 active:scale-95"
                      >
                        <Handshake className="w-3.5 h-3.5" /> ต่อรอง
                      </button>
                    ) : (
                      <div className="col-span-2 flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-[10px] rounded-xl border-2 border-gray-200">
                        ราคาขายสุทธิ
                      </div>
                    )}
                    
                    <button
                      type="button"
                      disabled={product.status === 'SOLD_OUT'}
                      onClick={() => {
                        setSelectedBuyProduct(product);
                        setIsBuyModalOpen(true);
                      }}
                      className="col-span-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-black py-2.5 rounded-xl text-xs transition-all shadow-md uppercase tracking-wider"
                    >
                      {product.status === 'SOLD_OUT' ? 'หมดแล้ว' : 'สั่งซื้อ'}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-8 text-xs text-center border-t-2 border-black font-bold">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="text-2xl font-black text-white italic tracking-tighter uppercase">
            KUISCOOL<span className="text-red-600">Z</span>
          </div>
          <p className="text-gray-500 text-[11px]">© 2026 KUISCOOLZ. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
        }} 
      />
      
      <BuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onSuccessPayment={(orderInfo: any) => {
          setPaymentOrderData(orderInfo);
          setIsBuyModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
        product={selectedBuyProduct}
      />
      
      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        product={selectedOfferProduct}
      />
      
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={paymentOrderData}
      />
      
      <AuctionModal
        isOpen={isAuctionModalOpen}
        onClose={() => setIsAuctionModalOpen(false)}
        item={selectedAuctionItem}
      />
      
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        product={selectedChatProduct}
      />
      
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist || []}
        onRemoveItem={(id: string) => setWishlist((wishlist || []).filter((item) => item?.id !== id))}
        onBuyItem={(product: any) => {
          setSelectedBuyProduct(product);
          setIsBuyModalOpen(true);
        }}
      />

    </div>
  );
}