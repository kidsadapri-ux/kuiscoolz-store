import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auctionId, bidAmount, bidderName } = body;

    if (!auctionId || !bidAmount) {
      return NextResponse.json(
        { error: 'ข้อมูลการเสนอราคาไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const parsedAmount = parseFloat(bidAmount);

    // 🚀 ใช้ $transaction ป้องกันการประมูลชนกัน
    const newBid = await prisma.$transaction(async (tx: any) => {
      // 1. ค้นหาประมูลเพื่อเช็กราคาปัจจุบัน
      const auction = await tx.auction.findUnique({
        where: { id: auctionId },
      });

      if (!auction) {
        throw new Error('ไม่พบรายการประมูลนี้');
      }

      if (parsedAmount <= auction.currentPrice) {
        throw new Error('ราคาเสนอซื้อต้องสูงกว่าราคาปัจจุบัน');
      }

      // 2. อัปเดตราคาสูงสุดในรายการประมูล
      await tx.auction.update({
        where: { id: auctionId },
        data: { currentPrice: parsedAmount },
      });

      // 3. บันทึกประวัติการเคาะราคา
      const bidRecord = await tx.bid.create({
        data: {
          auctionId,
          amount: parsedAmount,
          bidderName: bidderName || 'ผู้ใช้ทั่วไป',
        },
      });

      return bidRecord;
    });

    return NextResponse.json({
      message: 'เคาะราคาประมูลสำเร็จ!',
      bid: newBid,
    });
  } catch (error: any) { // 👈 ใส่ : any เพื่อให้ TypeScript ไม่ฟ้อง Error
    console.error('Bid Error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการเคาะราคา' },
      { status: 500 }
    );
  }
}