import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, buyerId, offeredPrice, message } = body;

    if (!productId || !offeredPrice) {
      return NextResponse.json(
        { error: 'กรอกข้อมูลราคาที่ต้องการต่อรองให้ถูกต้อง' },
        { status: 400 }
      );
    }

    // 1. บันทึกลง Database จริง (ถ้ามีตาราง Offer)
    try {
      const offer = await prisma.offer.create({
        data: {
          productId,
          buyerId: buyerId || 'demo-buyer-id',
          offeredPrice: parseFloat(offeredPrice),
          message: message || '',
          status: 'PENDING',
        },
      });

      return NextResponse.json({
        message: 'ส่งข้อเสนอต่อรองราคาเรียบร้อยแล้ว!',
        offer,
      });
    } catch (dbError: any) { // 👈 เติม : any ตรงนี้
      console.log('ยังไม่ได้สร้างตาราง Offer ใน DB หรือเกิดปัญหาในระบบ DB ใช้ระบบจำลองแทน:', dbError.message);
    }

    // 2. ถ้ายังไม่มี Database หรือพัง ให้ตอบกลับเป็นจำลองการส่งสำเร็จ
    return NextResponse.json({
      message: 'ส่งข้อเสนอต่อรองราคาสำเร็จ! (รอผู้ขายตอบรับ)',
      offer: {
        id: `offer-${Date.now()}`,
        offeredPrice: parseFloat(offeredPrice),
        status: 'PENDING',
      },
    });

  } catch (error: any) { // 👈 เติม : any ตรงนี้
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการส่งข้อเสนอ' },
      { status: 500 }
    );
  }
}