import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, slipImage, paymentMethod } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลคำสั่งซื้อ' }, { status: 400 });
    }

    // จำลองการบันทึกข้อมูลสลิปชำระเงิน
    return NextResponse.json({
      message: 'แจ้งชำระเงินสำเร็จ! ผู้ขายจะตรวจสอบและจัดส่งสินค้าโดยเร็ว',
      payment: {
        orderId,
        slipImage,
        paymentMethod,
        status: 'PENDING_VERIFICATION',
        paidAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการส่งหลักฐานชำระเงิน' }, { status: 500 });
  }
}