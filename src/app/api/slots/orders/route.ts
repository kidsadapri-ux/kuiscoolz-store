import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, buyerId, shippingAddress, paymentMethod } = body;

    if (!productId || !shippingAddress) {
      return NextResponse.json({ error: 'กรอกข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    // 1. ลองค้นหาและบันทึกลง Database จริง (ถ้าเซ็ต DB ไว้แล้ว)
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (product) {
        const order = await prisma.order.create({
          data: {
            orderNumber: `ORD-${Date.now()}`,
            buyerId: buyerId || 'demo-buyer',
            sellerId: product.sellerId,
            productId: product.id,
            productPrice: product.price,
            totalAmount: product.price,
            status: 'PENDING_PAYMENT',
          },
        });

        return NextResponse.json({ message: 'สร้างคำสั่งซื้อเรียบร้อยแล้ว!', order });
      }
    } catch (dbError) {
      console.log('ยังไม่ได้เชื่อมต่อ Database หรือไม่มีข้อมูลสินค้านี้ ใช้ระบบทดสอบแทน');
    }

    // 2. ถ้ายังไม่มี Database ให้ตอบกลับเป็นออเดอร์ทดสอบสำเร็จทันที
    return NextResponse.json({
      message: 'สั่งซื้อสำเร็จ! (ทดสอบระบบ)',
      order: {
        orderNumber: `ORD-${Date.now()}`,
        status: 'PENDING_PAYMENT',
      },
    });

  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 });
  }
}