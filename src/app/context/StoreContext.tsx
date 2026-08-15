'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  brand?: string;
  size?: string;
  category?: string;
  conditionGrade?: string;
  image?: string;
  status: 'AVAILABLE' | 'AUCTION' | 'SOLD_OUT';
  allowOffers?: boolean;
  sellerName?: string;
  createdAt?: string;
}

interface StoreContextType {
  products: Product[];
  auctionItem: any;
  loading: boolean;
  fetchProducts: () => Promise<void>;
  updateProductStatus: (id: string, status: 'AVAILABLE' | 'AUCTION' | 'SOLD_OUT') => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [auctionItem, setAuctionItem] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/slots/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // ฟัง Event เมื่อมีการเปลี่ยนแปลงข้อมูลในตาราง products (Real-time)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateProductStatus = async (id: string, status: 'AVAILABLE' | 'AUCTION' | 'SOLD_OUT') => {
    await supabase.from('products').update({ status }).eq('id', id);
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        auctionItem,
        loading,
        fetchProducts,
        updateProductStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}