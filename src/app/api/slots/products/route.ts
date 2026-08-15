import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ดึงรายการสินค้าทั้งหมด
export async function GET() {
  try {
    const products = await (prisma as any).product.findMany({
      include: { 
        seller: true, 
        offers: true 
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถดึงข้อมูลสินค้าได้' },
      { status: 500 }
    );
  }
}

// เพิ่มสินค้าฝากขาย (หัก 1 Slot)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, title, price, brand, size, conditionGrade, saleType, image } = body;

    // เช็กว่ามี sellerId ส่งมาไหม
    if (!sellerId) {
      return NextResponse.json(
        { error: 'กรุณาระบุข้อมูลผู้ขาย (sellerId)' },
        { status: 400 }
      );
    }

    // เช็ก Slot ผู้ขาย
    const seller = await (prisma as any).user.findUnique({ where: { id: sellerId } });
    if (!seller || (seller.listingSlots !== undefined && seller.listingSlots < 1)) {
      return NextResponse.json(
        { error: 'Slot ไม่เพียงพอ กรุณาซื้อ Slot เพิ่ม (10฿/Slot)' },
        { status: 400 }
      );
    }

    // หัก Slot และเพิ่มสินค้า
    const result = await (prisma as any).$transaction(async (tx: any) => {
      // หัก 1 Slot ถ้ามีฟิลด์ listingSlots
      if (seller.listingSlots !== undefined) {
        await tx.user.update({
          where: { id: sellerId },
          data: { listingSlots: { decrement: 1 } },
        });
      }

      return await tx.product.create({
        data: {
          title,
          description: 'สินค้าแฟชั่นมือสองสภาพดี',
          price: parseFloat(price) || 0,
          brand: brand || 'General',
          size: size || 'Free Size',
          image: image || '',
          status: 'AVAILABLE',
          sellerId,
        },
      });
    });

    return NextResponse.json({
      message: 'ลงขายสินค้าสำเร็จ (หัก 1 Slot เรียบร้อย)',
      product: result,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถลงขายได้' },
      { status: 500 }
    );
  }
}