import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auctionId, bidAmount, bidderName } = body;

    if (!auctionId || !bidAmount) {
      return NextResponse.json({ error: 'ข้อมูลการเสนอราคาไม่ถูกต้อง' }, { status: 400 });
    }

    // จำลองการบันทึกราคาประมูลใหม่
    return NextResponse.json({
      message: 'เคาะราคาประมูลสำเร็จ!',
      bid: {
        auctionId,
        bidAmount: parseFloat(bidAmount),
        bidderName: bidderName || 'ผู้ใช้ทั่วไป',
        bidAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการเคาะราคา' }, { status: 500 });
  }
}