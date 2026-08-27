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
  X, 
  MessageCircle, 
  ShoppingBag,
  ShieldCheck, 
  SearchX, 
  Search,
  Sparkles,
  ArrowDownRight
} from 'lucide-react';

const supabaseUrl = 'https://obhvuxvtsfihdelqjzmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaHZ1eHZ0c2ZpaGRlbHFqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTQ5MDMsImV4cCI6MjEwMjE5MDkwM30.kkVSeL3fK-V5dx0CQRdBRf1UZPd198cDNUrXEjik7qM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HomePage() {
  function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
  const [products, setProducts] = useState<any[]>([]);
  const [banner, setBanner] = useState({
    title_white: 'KUISCOOLZ',
    subtitle: 'รับประกันแท้ทุกชิ้น ',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnRdWdA5uuxMJ_JWBZy0KIELUG8FO5raDKDQTxHepnLg&s=10'
  });
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; ig_username: string; role?: string; address?: string } | null>(null);
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
  const [userOffers, setUserOffers] = useState<any[]>([]);

  const fetchData = async (userIg?: string) => {
    try {
      setLoading(true);
      const [prodRes, bannerRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('news_banners').select('*').eq('id', 'main_banner').maybeSingle()
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (bannerRes.data) setBanner(bannerRes.data);

      const targetIg = userIg || currentUser?.ig_username;
      if (targetIg) {
        const cleanIg = targetIg.trim().replace(/^@/, '');
        const { data: offersData } = await supabase
          .from('offers')
          .select('*')
          .ilike('customer_ig', cleanIg)
          .eq('status', 'ACCEPTED');
        if (offersData) setUserOffers(offersData);
      } else {
        setUserOffers([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('kuiscoolz_user');
    let currentIg = '';
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        currentIg = parsed.ig_username;
        fetchData(parsed.ig_username);
      } catch (e) {
        console.error(e);
        fetchData();
      }
    } else {
      fetchData();
    }

    const channel = supabase
      .channel('realtime_offers_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'offers' },
        () => {
          fetchData(currentIg);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('kuiscoolz_user', JSON.stringify(user));
    setIsAuthOpen(false);
    fetchData(user.ig_username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kuiscoolz_user');
    setUserOffers([]);
  };

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
    <div className="min-h-screen bg-[#ffffff] text-[#111111] font-sans antialiased scroll-smooth">
      
      {/* 1. TOP UTILITY BAR (ปรับเป็นแถบสีขาว Soft Cloud สไตล์มินิมอลตามรูป)[cite: 1] */}
      <div className="hidden md:block bg-[#f5f5f5] text-[#111111] text-[12px] font-medium py-2 px-6 sm:px-12 border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#707072] font-semibold">
            <InstagramIcon className="w-3.5 h-3.5 text-[#d30005]" /> @kuisccolz
          </div>
          <div className="text-center font-bold tracking-[0.15em] text-[#111111] text-[11px] uppercase">
            KUISCOOL<span className="text-[#d30005]">Z</span>
            <span className="mx-2 text-[#cacacb]">|</span>
            <span className="font-normal text-[#707072]">ร้านที่ให้มากกว่าแฟชั่น</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#007d48] font-bold text-[11px]">
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-50 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e5e5e5] h-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-12 h-full flex items-center justify-between gap-3 sm:gap-6">
          
          <Link href="/" className="inline-flex items-center shrink-0">
            <span className="text-xl sm:text-[26px] font-black tracking-tighter text-[#111111] uppercase leading-none">
              KUISCOOL<span className="text-[#d30005]">Z</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="flex-1 max-w-md hidden md:block">

          </div>

          {/* Right Action Icons & Auth */}
          <nav className="flex items-center gap-2 sm:gap-3 text-xs font-semibold shrink-0">
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-full bg-[#f5f5f5] hover:bg-[#e5e5e5] transition-all active:scale-90"
              title="สินค้าที่ถูกใจ"
            >
              <ShoppingBag className="w-4 h-4 text-[#111111]" />
              {(wishlist || []).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d30005] text-[#ffffff] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {(wishlist || []).length}
                </span>
              )}
            </button>

            <Link 
              href="/my-orders" 
              className="flex items-center gap-1.5 bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#111111] px-3.5 py-2 rounded-full transition-all text-[11px] sm:text-xs font-bold active:scale-95"
            >
              <span className="hidden sm:inline">คำสั่งซื้อ</span>
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#111111] text-[#ffffff] pl-3 py-1 pr-1.5 rounded-full font-bold max-w-[130px] sm:max-w-none">
                <span className="w-5 h-5 bg-[#d30005] text-[#ffffff] rounded-full flex items-center justify-center text-[10px] shrink-0 font-black">
                  {currentUser.ig_username?.charAt(0)?.toUpperCase()}
                </span>
                <span className="text-[11px] sm:text-xs truncate">{currentUser.name || currentUser.ig_username}</span>
                <button
                  onClick={handleLogout}
                  title="ออกจากระบบ"
                  className="text-[#9e9ea0] hover:text-[#ffffff] p-1 transition-colors shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-[#111111] hover:bg-black text-[#ffffff] px-4 py-2 rounded-full transition-all flex items-center gap-1.5 active:scale-95 text-[11px] sm:text-xs font-bold shadow-sm"
              >
                <User className="w-3.5 h-3.5" /> เข้าสู่ระบบ
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="block md:hidden px-4 py-2.5 bg-[#ffffff] border-b border-[#e5e5e5]">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-[#707072] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหาชื่อเสื้อผ้า, แบรนด์, สเปก..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f5f5f5] text-[#111111] placeholder-[#707072] text-[12px] font-medium rounded-full pl-9 pr-3.5 py-2 outline-none focus:bg-[#ffffff] focus:ring-1.5 focus:ring-[#111111] transition-all"
          />
        </div>
      </div>

      {/* 3. HERO CAMPAIGN SECTION */}
      <section className="relative w-full bg-[#111111] min-h-[440px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={
              banner.image_url ||
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVrrdTkWkD11eIalzupIxv-J7TPWgc8L_sWL45nJuZ3Q&s'
            }
            alt="Campaign Stage"
            className="w-full h-full object-cover object-center brightness-[0.70]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-12 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          {banner.tag_text && (
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 text-[#ffffff] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d30005] animate-pulse" />
              {banner.tag_text}
            </div>
          )}

          <h1 className="text-4xl sm:text-7xl lg:text-[88px] font-black uppercase tracking-tighter text-[#ffffff] leading-[0.92] drop-shadow-md">
            {banner.title_white}{' '}
            <span className="text-[#d30005] inline-block">{banner.title_red}</span>
          </h1>

          {banner.subtitle && (
            <p className="text-xs sm:text-base text-[#ffffff]/90 font-medium max-w-lg mx-auto leading-relaxed px-2">
              {banner.subtitle}
            </p>
          )}

         <div className="pt-2 flex items-center justify-center">
  <a
    href="#products-list"
    className="bg-[#ffffff] hover:bg-zinc-200 text-[#111111] font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full transition-all active:scale-95 shadow-xl uppercase tracking-wider inline-flex items-center gap-1.5"
  >
    <span>เลือกซื้อสินค้า</span> <ArrowDownRight className="w-4 h-4" />
  </a>
</div>
        </div>
      </section>

      {/* 4. REVIEWS & FILTER STRIP */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-6 sm:space-y-8">
        <section className="bg-[#ffffff] border border-[#e5e5e5] rounded-3xl p-4 sm:p-6 shadow-xs">
          <ProductReviews />
        </section>

        {/* Filter Chip Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cacacb] pb-5 pt-2">
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
                className={`text-xs font-bold px-5 py-2.5 rounded-full transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-[#111111] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#111111] border border-[#cacacb] hover:border-[#111111]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'GRADE_S', 'GRADE_A', 'GRADE_B'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors shrink-0 ${
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
                className="text-xs text-[#d30005] font-bold flex items-center gap-1 ml-2 uppercase shrink-0"
              >
                <X className="w-3.5 h-3.5" /> ล้าง
              </button>
            )}
          </div>
        </div>
      </main>

      {/* 5. PRODUCT CATALOG */}
      <section id="products-list" className="bg-[#fcfcfc] pb-16 pt-2 scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
          
          <div className="flex justify-between items-baseline border-b border-[#e5e5e5] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111111]">
                สินค้าทั้งหมด ({filteredProducts.length})
              </h2>
              <p className="text-xs text-[#707072] font-medium">คัดสภาพเน้นๆ พร้อมส่งทันที</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 bg-[#f5f5f5] rounded-2xl">
              <p className="text-xs font-semibold text-[#707072]">กำลังโหลดข้อมูลสินค้า...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#f5f5f5] rounded-2xl border border-dashed border-[#cacacb] space-y-3">
              <SearchX className="w-12 h-12 text-[#cacacb] mx-auto" />
              <h3 className="text-base font-bold text-[#111111]">ไม่พบสินค้าที่ค้นหา</h3>
              <p className="text-xs text-[#707072]">ลองปรับตัวกรองหรือคำค้นหาใหม่อีกครั้ง</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredProducts.map((product: any) => {
                const grade = product.condition_grade || product.conditionGrade;
                const isSoldOut = product.status === 'SOLD_OUT';
                const isLiked = (wishlist || []).some((item) => item?.id === product.id);

                const acceptedOffer = userOffers.find((o) => String(o.product_id) === String(product.id));
                const finalPrice = acceptedOffer ? Number(acceptedOffer.offered_price) : Number(product.price || 0);

                return (
                  <div key={product.id} className="bg-[#ffffff] rounded-2xl border border-[#e5e5e5] p-2.5 sm:p-3.5 flex flex-col justify-between group hover:border-[#111111] transition-all shadow-xs">
                    
                    <div>
                      {/* Product Image Stage */}
                      <div className="relative aspect-square bg-[#f5f5f5] rounded-xl overflow-hidden">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80'}
                          alt={product.title || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Grade Badge */}
                        <div className="absolute top-2 left-2 bg-[#ffffff]/95 backdrop-blur-md text-[#111111] text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#cacacb] shadow-xs">
                          {grade === 'GRADE_S' && <span className="text-[#007d48]">เกรด S</span>}
                          {grade === 'GRADE_A' && <span className="text-[#111111]">เกรด A</span>}
                          {grade === 'GRADE_B' && <span className="text-[#707072]">เกรด B</span>}
                          {!['GRADE_S', 'GRADE_A', 'GRADE_B'].includes(grade) && <span>สภาพดี</span>}
                        </div>

                        {acceptedOffer && (
                          <div className="absolute top-2 right-2 bg-[#111111] text-[#ffffff] text-[8px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                            <Sparkles className="w-2.5 h-2.5 text-[#d30005]" /> ราคาพิเศษ
                          </div>
                        )}

                        {isSoldOut && (
                          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex items-center justify-center">
                            <span className="bg-[#111111] text-[#ffffff] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Metadata */}
                      <div className="pt-3 pb-2 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#707072] truncate">
                          {product.brand || 'General'} • {product.category || 'Fashion'}
                        </div>
                        <h3 className="font-bold text-[#111111] text-xs sm:text-sm line-clamp-1 group-hover:underline">
                          {product.title}
                        </h3>
                        <div className="text-[10px] sm:text-xs text-[#707072] truncate">
                           {product.size || 'Free Size'}
                        </div>
                        
                        {/* Price Row */}
                        <div className="pt-1 flex items-baseline gap-1.5">
                          <span className={`text-base sm:text-lg font-black ${acceptedOffer ? 'text-[#d30005]' : 'text-[#111111]'}`}>
                            ฿{finalPrice.toLocaleString()}
                          </span>
                          {acceptedOffer && (
                            <span className="text-[10px] sm:text-xs font-semibold text-[#707072] line-through">
                              ฿{Number(product.price).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 4 ACTION BUTTONS (แถบปุ่มกดแบบในภาพ 1: แชต / ถูกใจ / ต่อรอง / สั่งซื้อ)[cite: 1] */}
                    <div className="grid grid-cols-6 gap-1 pt-2 border-t border-[#f5f5f5]">
        

                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        className="col-span-1 bg-[#f5f5f5] hover:bg-[#e5e5e5] p-2 rounded-full flex items-center justify-center active:scale-90 transition-all"
                        title="บันทึกที่ถูกใจ"
                      >
                        <ShoppingBag
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'text-[#d30005] fill-[#d30005]' : 'text-[#111111]'}`}
                        />
                      </button>

                      {product.allow_offers || product.allowOffers ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOfferProduct(product);
                            setIsOfferModalOpen(true);
                          }}
                          disabled={isSoldOut || !!acceptedOffer}
                          className="col-span-2 bg-[#f5f5f5] hover:bg-[#e5e5e5] disabled:opacity-50 text-[#111111] font-bold py-2 rounded-full text-[10px] sm:text-[11px] flex items-center justify-center gap-1 active:scale-95 transition-all"
                        >
                          <Handshake className="w-3 h-3 text-[#111111]" /> 
                          <span>{acceptedOffer ? 'ผ่านแล้ว' : 'ต่อรองราคา'}</span>
                        </button>
                      ) : (
                        <div className="col-span-2 flex items-center justify-center bg-[#f5f5f5] text-[#707072] font-semibold text-[9px] sm:text-[10px] rounded-full">
                          สุทธิ
                        </div>
                      )}
                      
                      <button
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => {
                          setSelectedBuyProduct({
                            ...product,
                            price: finalPrice,
                          });
                          setIsBuyModalOpen(true);
                        }}
                        className="col-span-2 bg-[#111111] hover:bg-black disabled:bg-[#cacacb] text-[#ffffff] font-bold py-2 rounded-full text-[10px] sm:text-xs transition-all uppercase tracking-wider active:scale-95 shadow-xs"
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

      {/* 6. MINIMALIST DARK FOOTER */}
      <footer className="bg-[#111111] text-zinc-400 py-10 text-xs border-t border-zinc-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-12 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xl font-black uppercase text-[#ffffff] tracking-tight">
              KUISCOOL<span className="text-[#d30005]">Z</span>
            </span>
            <div className="flex items-center gap-6 font-semibold">
              <a href="https://instagram.com/kuiscoolz" target="_blank" rel="noopener noreferrer" className="text-[#ffffff] hover:underline">
                Instagram
              </a>
              <Link href="/my-orders" className="text-[#ffffff] hover:underline">
                ติดตามพัสดุ
              </Link>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p>© 2026 KUISCOOLZ. ALL RIGHTS RESERVED.</p>
            <p className="text-zinc-500">AUTHENTIC STREETWEAR & VINTAGE APPAREL</p>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
      
      <BuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        currentUser={currentUser}
        onRequireAuth={() => setIsAuthOpen(true)}
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
        currentUser={currentUser}
        onRequireAuth={() => setIsAuthOpen(true)}
        onOfferSuccess={() => fetchData()}
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