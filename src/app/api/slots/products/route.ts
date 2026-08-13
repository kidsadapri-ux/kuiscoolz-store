import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


// ดึงรายการสินค้าทั้งหมด
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { seller: true, bids: true, offers: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error: any) { // 👈 เติม : any
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
    const { sellerId, title, price, brand, size, conditionGrade, saleType } = body;

    // เช็ก Slot ผู้ขาย
    const seller = await prisma.user.findUnique({ where: { id: sellerId } });
    if (!seller || seller.listingSlots < 1) {
      return NextResponse.json(
        { error: 'Slot ไม่เพียงพอ กรุณาซื้อ Slot เพิ่ม (10฿/Slot)' },
        { status: 400 }
      );
    }

    // หัก Slot และเพิ่มสินค้า
    const result = await prisma.$transaction(async (tx: any) => { // 👈 เติม : any
      await tx.user.update({
        where: { id: sellerId },
        data: { listingSlots: { decrement: 1 } },
      });

      return await tx.product.create({
        data: {
          title,
          slug: `${title.toLowerCase().replace(/ /g, '-')}-${Date.now()}`,
          description: 'สินค้าแฟชั่นมือสองสภาพดี',
          price: parseFloat(price),
          brand,
          category: 'Fashion',
          size,
          measurements: { chest: '40', length: '28' },
          conditionGrade,
          saleType: saleType || 'DIRECT_SALE',
          sellerId,
        },
      });
    });

    return NextResponse.json({
      message: 'ลงขายสินค้าสำเร็จ (หัก 1 Slot เรียบร้อย)',
      product: result,
    });
  } catch (error: any) { // 👈 เติม : any
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถลงขายได้' },
      { status: 500 }
    );
  }
}