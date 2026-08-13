import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, slipImage, paymentMethod } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลคำสั่งซื้อ' },
        { status: 400 }
      );
    }

    // อัปเดตสถานะการชำระเงินลง Database จริง
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'WAITING_FOR_VERIFICATION',
        slipImage: slipImage || null,
        paymentMethod: paymentMethod || 'TRANSFER',
      },
    });

    return NextResponse.json({
      message: 'แจ้งชำระเงินสำเร็จ! ผู้ขายจะตรวจสอบและจัดส่งสินค้าโดยเร็ว',
      payment: updatedOrder,
    });
  } catch (error: any) { // 👈 เติม : any ให้ TypeScript
    console.error('Payment Notice Error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการส่งหลักฐานชำระเงิน' },
      { status: 500 }
    );
  }
}