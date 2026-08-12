'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  title: string;
  price: number;
  brand: string;
  category: string;
  size: string;
  conditionGrade: string;
  image: string;
  saleType: string;
  allowOffers: boolean;
  status: 'AVAILABLE' | 'SOLD_OUT';
}

export interface CreditSlip {
  id: string;
  customerName: string;
  itemTitle: string;
  price: number;
  dateText: string;
  trackingNo: string;
  slipImage: string;
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  brand: string;
  image: string;
  currentBid: number;
}

interface StoreContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'status'>) => void;
  toggleSoldOut: (id: string) => void;
  deleteProduct: (id: string) => void;
  
  creditSlips: CreditSlip[];
  addCreditSlip: (slip: Omit<CreditSlip, 'id' | 'dateText'>) => void;
  deleteCreditSlip: (id: string) => void;

  auctionItem: AuctionItem | null;
  updateAuctionItem: (item: Partial<AuctionItem>) => void;
  deleteAuctionItem: () => void; // 🟢 ฟังก์ชันลบประมูล
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'เสื้อเชิ้ต Vintage Polo Ralph Lauren Classic Fit',
    price: 1290,
    brand: 'Polo Ralph Lauren',
    category: 'Shirt',
    size: 'L (อก 44 / ยาว 30)',
    conditionGrade: 'GRADE_A',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
    saleType: 'DIRECT_SALE',
    allowOffers: true,
    status: 'AVAILABLE',
  },
];

const INITIAL_SLIPS: CreditSlip[] = [
  {
    id: 'slip-1',
    customerName: 'กฤษฎา พ.',
    itemTitle: 'เสื้อเชิ้ต Vintage Polo Ralph Lauren Classic Fit',
    price: 1290,
    dateText: 'เมื่อสักครู่',
    trackingNo: 'TH014829XXXXX',
    slipImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
  },
];

const INITIAL_AUCTION: AuctionItem = {
  id: 'auc-001',
  title: 'เสื้อยืด VINTAGE NIRVANA HEART SHAPED BOX 90S ORIGINAL GIANT TAG',
  description: 'เสื้อยืดวินเทจหายากระดับการสะสม สภาพ 95% แท้เดิมๆ ยุค 90s',
  brand: 'NIRVANA VINTAGE',
  image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
  currentBid: 8500,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [creditSlips, setCreditSlips] = useState<CreditSlip[]>(INITIAL_SLIPS);
  const [auctionItem, setAuctionItem] = useState<AuctionItem | null>(INITIAL_AUCTION);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('kuiscoolz_products');
    const savedSlips = localStorage.getItem('kuiscoolz_slips');
    const savedAuction = localStorage.getItem('kuiscoolz_auction');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSlips) setCreditSlips(JSON.parse(savedSlips));
    if (savedAuction !== null) {
      setAuctionItem(savedAuction === 'null' ? null : JSON.parse(savedAuction));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('kuiscoolz_products', JSON.stringify(products));
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('kuiscoolz_slips', JSON.stringify(creditSlips));
  }, [creditSlips, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kuiscoolz_auction', JSON.stringify(auctionItem));
    }
  }, [auctionItem, isLoaded]);

  const addProduct = (newProd: Omit<Product, 'id' | 'status'>) => {
    const item: Product = { ...newProd, id: `prod-${Date.now()}`, status: 'AVAILABLE' };
    setProducts((prev) => [item, ...prev]);
  };

  const toggleSoldOut = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === 'AVAILABLE' ? 'SOLD_OUT' : 'AVAILABLE' } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCreditSlip = (newSlip: Omit<CreditSlip, 'id' | 'dateText'>) => {
    const slip: CreditSlip = { ...newSlip, id: `slip-${Date.now()}`, dateText: 'เมื่อสักครู่' };
    setCreditSlips((prev) => [slip, ...prev]);
  };

  const deleteCreditSlip = (id: string) => {
    setCreditSlips((prev) => prev.filter((s) => s.id !== id));
  };

  const updateAuctionItem = (item: Partial<AuctionItem>) => {
    setAuctionItem((prev) => {
      if (!prev) {
        return {
          id: `auc-${Date.now()}`,
          title: item.title || '',
          description: item.description || '',
          brand: item.brand || 'VINTAGE',
          image: item.image || '',
          currentBid: item.currentBid || 0,
        };
      }
      return { ...prev, ...item };
    });
  };

  const deleteAuctionItem = () => {
    setAuctionItem(null);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        toggleSoldOut,
        deleteProduct,
        creditSlips,
        addCreditSlip,
        deleteCreditSlip,
        auctionItem,
        updateAuctionItem,
        deleteAuctionItem,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
}