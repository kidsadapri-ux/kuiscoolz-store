import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, title, brand, category, price, grade, chest, length, waist, image, allowOffers } = body;

    if (!title || !price || !brand || !sellerId) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลสินค้าและผู้ขายให้ครบถ้วน' }, { status: 400 });
    }

    // 1. ตรวจสอบ Slot ผู้ขาย
    const seller = await prisma.user.findUnique({ where: { id: sellerId } });
    if (!seller || seller.listingSlots < 1) {
      return NextResponse.json({ error: 'Slot ไม่เพียงพอ กรุณาซื้อ Slot เพิ่มก่อนลงขาย' }, { status: 400 });
    }

    // 2. หัก Slot และเพิ่มสินค้าลง Database พร้อมกัน
    const result = await prisma.$transaction(async (tx: any) => {
      // หัก 1 Slot
      await tx.user.update({
        where: { id: sellerId },
        data: { listingSlots: { decrement: 1 } },
      });

      // เพิ่มสินค้าใหม่
      return await tx.product.create({
        data: {
          title,
          slug: `${title.toLowerCase().replace(/ /g, '-')}-${Date.now()}`,
          brand,
          category: category || 'Shirt',
          price: parseFloat(price),
          conditionGrade: grade || 'GRADE_A',
          measurements: {
            chest: chest ? `${chest}"` : '-',
            length: length ? `${length}"` : '-',
            waist: waist ? `${waist}"` : '-',
          },
          image: image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
          allowOffers: Boolean(allowOffers),
          sellerId,
        },
      });
    });

    return NextResponse.json({
      message: 'ลงขายสินค้าเรียบร้อยแล้ว! (หัก 1 Slot เรียบร้อย)',
      product: result,
    });

  } catch (error: any) {
    console.error('Create Product Error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลงขายสินค้า' }, { status: 500 });
  }
}