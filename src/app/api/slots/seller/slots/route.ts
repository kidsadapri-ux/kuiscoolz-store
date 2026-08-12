import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, brand, category, price, grade, chest, length, waist, image, allowOffers } = body;

    if (!title || !price || !brand) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลสินค้าให้ครบถ้วน' }, { status: 400 });
    }

    // จำลองการหัก 1 Slot ฝากขาย (10 บาท) และบันทึกสินค้าใหม่
    const newProduct = {
      id: `prod-${Date.now()}`,
      title,
      brand,
      category: category || 'Shirt',
      price: parseFloat(price),
      grade: grade || 'GRADE_A',
      chest: chest ? `${chest}"` : '-',
      length: length ? `${length}"` : '-',
      waist: waist ? `${waist}"` : '-',
      image: image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
      allowOffers: Boolean(allowOffers),
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'ลงขายสินค้าเรียบร้อยแล้ว! (ใช้ไป 1 Slot)',
      product: newProduct,
    });

  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลงขายสินค้า' }, { status: 500 });
  }
}