'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import AuthModal from './AuthModal';
import BuyModal from './BuyModal';
import OfferModal from './OfferModal';
import PaymentModal from './PaymentModal';
import ChatModal from './ChatModal';
import ProductReviews from './ProductReviews';
import WishlistModal from './WishlistModal';
import { 
  User, 
  Package, 
  LogOut, 
  Handshake, 
  ArrowRight, 
  X, 
  MessageCircle, 
  Heart, 
  Camera, 
  ShieldCheck, 
  Flame, 
  SearchX, 
  Search 
} from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [banner, setBanner] = useState({
    tag_text: 'AUTHENTIC STREETWEAR & VINTAGE',
    title_white: 'VINTAGE IS',
    title_red: 'THE STANDARD',
    subtitle: 'คัดสภาพเน้นๆ สเปกวัดจริง อก/ยาว ตรงปกทุกตัว พร้อมส่งทันที ไม่มีพรีออเดอร์',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; ig_username: string; role: string } | null>(null);
  const [selectedBuyProduct, setSelectedBuyProduct] = useState<any>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedOfferProduct, setSelectedOfferProduct] = useState<any>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [paymentOrderData, setPaymentOrderData] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedChatProduct, setSelectedChatProduct] = useState<any>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, bannerRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('news_banners').select('*').eq('id', 'main_banner').maybeSingle()
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (bannerRes.data) setBanner(bannerRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleWishlist = (product: any) => {
    if (!product?.id) return;
    if ((wishlist || []).some((item) => item?.id === product.id)) {
      setWishlist((wishlist || []).filter((item) => item?.id !== product.id));
    } else {
      setWishlist([...(wishlist || []), product]);
    }
  };

  const hasActiveFilter = searchQuery || selectedCategory !== 'ALL' || selectedGrade !== 'ALL' || maxPrice !== '';

  const filteredProducts = (products || []).filter((product: any) => {
    if (!product) return false;
    const titleMatch = (product.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const brandMatch = (product.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = !searchQuery || titleMatch || brandMatch;
    const matchesCategory = selectedCategory === 'ALL' || product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const grade = product.condition_grade || product.conditionGrade || 'GRADE_A';
    const matchesGrade = selectedGrade === 'ALL' || grade === selectedGrade;
    const matchesPrice = maxPrice === '' || Number(product.price || 0) <= Number(maxPrice);

    return matchesSearch && matchesCategory && matchesGrade && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white">
      
      {/* 1. TOP RIBBON (Balanced Typography) */}
      <div className="bg-black text-white text-[11px] font-medium py-2.5 px-4 sm:px-12 border-b border-zinc-900">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
            <Camera className="w-3.5 h-3.5 text-[#d30005]" /> IG: @kuisccolz
          </div>
          <div className="text-center font-black tracking-[0.2em] text-white text-[11px] uppercase">
  KUISCOOL<span className="text-[#ff0000]">Z</span>
  <span className="mx-2 text-zinc-600">|</span>
  <span className="font-normal text-zinc-300">ร้านที่ให้มากกว่าแฟชั่น</span>
</div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AUTHENTIC 100%
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Balanced Brand Typography) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5e5e5] h-16">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 h-full flex items-center justify-between gap-6">
          
          <Link href="/" className="flex items-center group">
            <span className="text-2xl sm:text-[28px] font-black tracking-tight text-[#111111] uppercase leading-none transition-transform active:scale-95">
              KUISCOOL<span className="text-[#d30005]">Z</span>
            </span>
          </Link>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#707072] absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="ค้นหาชื่อเสื้อผ้า, แบรนด์, สเปก..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5f5f5] text-[#111111] placeholder-[#707072] text-xs font-medium rounded-full pl-11 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#111111] transition-all"
              />
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-[#f5f5f5] transition-all active:scale-95 border border-[#e5e5e5]"
              title="สินค้าที่ถูกใจ"
            >
              <Heart className="w-4 h-4 text-[#111111]" />
              {(wishlist || []).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {(wishlist || []).length}
                </span>
              )}
            </button>

            <Link 
              href="/my-orders" 
              className="flex items-center gap-1.5 bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#111111] px-4 py-2 rounded-full transition-all"
            >
              <Package className="w-3.5 h-3.5 text-[#d30005]" /> คำสั่งซื้อ
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#111111] text-white pl-3 py-1 pr-1.5 rounded-full font-bold">
                <span className="w-6 h-6 bg-[#d30005] text-white rounded-full flex items-center justify-center text-[10px]">
                  {currentUser.ig_username?.charAt(0)?.toUpperCase()}
                </span>
                <span className="text-xs line-clamp-1">{currentUser.name}</span>
                <button
                  onClick={() => setCurrentUser(null)}
                  title="ออกจากระบบ"
                  className="text-gray-400 hover:text-[#d30005] p-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-[#d30005] hover:bg-[#780700] text-white px-4 py-2 rounded-full transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <User className="w-3.5 h-3.5" /> เข้าสู่ระบบ
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* 3. NIKE FULL-BLEED CINEMATIC HERO BANNER */}
      <section className="relative w-full bg-[#111111] min-h-[480px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden border-b-4 border-[#d30005]">
        
        {/* Background Stage */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              banner.image_url ||
              'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=85'
            }
            alt="Hero Background"
            className="w-full h-full object-cover object-center brightness-[0.72]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        </div>

        {/* Hero Lockup Container */}
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-12 flex flex-col items-center justify-center space-y-4 sm:space-y-5">
          
          {banner.tag_text && (
            <div className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d30005] animate-pulse" />
              {banner.tag_text}
            </div>
          )}

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none drop-shadow-lg">
            {banner.title_white}{' '}
            <span className="text-[#d30005] inline-block">{banner.title_red}</span>
          </h1>

          {banner.subtitle && (
            <p className="text-xs sm:text-sm text-gray-200 font-medium max-w-lg mx-auto leading-relaxed drop-shadow-md">
              {banner.subtitle}
            </p>
          )}

          {/* Action Dual Pills */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href="#catalog"
              className="bg-white hover:bg-gray-100 active:scale-95 text-[#111111] font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 rounded-full transition-all shadow-xl uppercase tracking-wider"
            >
              เลือกซื้อสินค้า
            </a>
            <a
              href="https://ig.me/m/kuisccolz"
              target="_blank"
              rel="noreferrer"
              className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 rounded-full transition-all uppercase tracking-wider"
            >
              รับชมบน IG ▶
            </a>
          </div>

        </div>
      </section>

      {/* 4. REVIEWS & FILTER STRIP */}
      <main id="catalog" className="max-w-[1440px] mx-auto px-6 sm:px-12 py-8 space-y-8">
        
        <section className="bg-white border border-[#e5e5e5] rounded-3xl p-4 md:p-6 shadow-sm overflow-hidden">
          <ProductReviews />
        </section>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e5e5] pb-4 pt-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'ทั้งหมด' },
              { id: 'Shirt', label: 'เสื้อยืด (T-Shirts)' },
              { id: 'Jacket', label: 'แจ็คเก็ต (Jackets)' },
              { id: 'Pants', label: 'กางเกง (Pants)' },
              { id: 'Shoes', label: 'รองเท้า (Shoes)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-5 py-2 rounded-full transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'bg-white text-[#111111] border border-[#cacacb] hover:border-[#111111]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'GRADE_S', 'GRADE_A', 'GRADE_B'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${
                  selectedGrade === g
                    ? 'bg-[#f5f5f5] text-[#111111] border border-[#111111]'
                    : 'text-[#707072] hover:text-[#111111]'
                }`}
              >
                {g === 'ALL' ? 'ทุกเกรด' : g.replace('_', ' ')}
              </button>
            ))}
            {hasActiveFilter && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setSelectedGrade('ALL');
                  setMaxPrice('');
                }}
                className="text-xs text-[#d30005] font-bold flex items-center gap-1 ml-2 uppercase"
              >
                <X className="w-3.5 h-3.5" /> ล้าง
              </button>
            )}
          </div>
        </div>

      </main>

      {/* 5. PRODUCT GRID */}
      <section className="bg-[#f5f5f5] py-12 border-t border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 space-y-8">
          
          <div className="flex justify-between items-baseline border-b border-[#cacacb] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111111]">
                สินค้าทั้งหมดในร้าน ({filteredProducts.length} ชิ้น)
              </h2>
              <p className="text-xs text-[#707072] font-medium">สต็อกเรียลไทม์ พร้อมจัดส่ง</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#e5e5e5]">
              <p className="text-xs font-semibold text-[#707072]">กำลังโหลดข้อมูลสินค้า...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#cacacb] space-y-3">
              <SearchX className="w-12 h-12 text-[#cacacb] mx-auto" />
              <h3 className="text-base font-bold text-[#111111]">ยังไม่มีสินค้าที่ตรงกับตัวกรอง</h3>
              <p className="text-xs text-[#707072]">ลองเปลี่ยนหมวดหมู่ หรือคำค้นหาใหม่อีกครั้ง</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => {
                const grade = product.condition_grade || product.conditionGrade;
                const isSoldOut = product.status === 'SOLD_OUT';
                const isLiked = (wishlist || []).some((item) => item?.id === product.id);

                return (
                  <div key={product.id} className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden flex flex-col justify-between group hover:border-[#111111] transition-all">
                    
                    <div>
                      <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80'}
                          alt={product.title || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#111111] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#e5e5e5]">
                          {grade === 'GRADE_S' && <span className="text-[#007d48]">สภาพเกรด S</span>}
                          {grade === 'GRADE_A' && <span className="text-[#111111]">สภาพเกรด A</span>}
                          {grade === 'GRADE_B' && <span className="text-[#707072]">สภาพเกรด B</span>}
                          {!['GRADE_S', 'GRADE_A', 'GRADE_B'].includes(grade) && <span>สภาพดี</span>}
                        </div>

                        {isSoldOut && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                            <span className="bg-[#111111] text-white font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">
                          {product.brand || 'General'} • {product.category || 'Fashion'}
                        </div>
                        <h3 className="font-bold text-[#111111] text-sm line-clamp-1 group-hover:underline">
                          {product.title}
                        </h3>
                        <div className="text-xs text-[#39393b] font-medium bg-[#f5f5f5] px-2.5 py-1.5 rounded-lg border border-[#e5e5e5]">
                          สเปก: {product.size || 'Free Size'}
                        </div>
                        <div className="text-lg font-black text-[#111111] pt-1">
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
                        className="col-span-1 bg-white hover:bg-[#f5f5f5] text-[#111111] p-2 rounded-full border border-[#cacacb] flex items-center justify-center active:scale-95 transition-all"
                        title="ทักแชตคุยกับผู้ขาย"
                      >
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        className="col-span-1 bg-white hover:bg-[#f5f5f5] p-2 rounded-full border border-[#cacacb] flex items-center justify-center active:scale-95 transition-all"
                        title="บันทึกสินค้าที่ถูกใจ"
                      >
                        <Heart
                          className={`w-4 h-4 ${isLiked ? 'text-[#d30005] fill-[#d30005]' : 'text-[#707072]'}`}
                        />
                      </button>

                      {product.allow_offers || product.allowOffers ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOfferProduct(product);
                            setIsOfferModalOpen(true);
                          }}
                          disabled={isSoldOut}
                          className="col-span-2 bg-[#f5f5f5] hover:bg-[#e5e5e5] disabled:opacity-50 text-[#111111] border border-[#cacacb] font-bold py-2 rounded-full text-[11px] flex items-center justify-center gap-1 active:scale-95 transition-all"
                        >
                          <Handshake className="w-3.5 h-3.5" /> ต่อรอง
                        </button>
                      ) : (
                        <div className="col-span-2 flex items-center justify-center bg-[#f5f5f5] text-[#707072] font-semibold text-[10px] rounded-full border border-[#e5e5e5]">
                          ราคาขายสุทธิ
                        </div>
                      )}
                      
                      <button
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => {
                          setSelectedBuyProduct(product);
                          setIsBuyModalOpen(true);
                        }}
                        className="col-span-2 bg-[#111111] hover:bg-black disabled:bg-gray-400 text-white font-bold py-2 rounded-full text-xs transition-all uppercase tracking-wider active:scale-95 shadow-sm"
                      >
                        {isSoldOut ? 'หมด' : 'สั่งซื้อ'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 6. BALANCED FOOTER */}
      <footer className="bg-black text-gray-400 py-10 text-xs text-center border-t border-zinc-900 font-medium">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            KUISCOOL<span className="text-[#d30005]">Z</span>
          </div>
          <p className="text-zinc-500 text-[11px] tracking-widest uppercase font-semibold">
            © 2026 KUISCOOLZ. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* MODALS */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(user: any) => {
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