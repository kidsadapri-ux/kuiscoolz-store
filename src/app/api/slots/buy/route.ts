import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function POST(request: Request) {
  try {
    // 1. รับค่าที่ส่งมาจากหน้าเว็บ (User ID และ จำนวน Slot ที่ต้องการซื้อ)
    const body = await request.json();
    const { userId, slotsBought } = body;

    // เช็กความถูกต้องของข้อมูล
    if (!userId || !slotsBought || slotsBought < 1) {
      return NextResponse.json(
        { error: 'จำนวน Slot ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // 2. คำนวณราคา (ช่องละ 10 บาท)
    const PRICE_PER_SLOT = 10;
    const totalAmount = slotsBought * PRICE_PER_SLOT;

    // 3. ทำงานพร้อมกัน 2 อย่างใน Database ( Transaction )
    const result = await prisma.$transaction(async (tx: any) => {
      // บันทึกประวัติการซื้อ Slot ลงตาราง SlotPurchase
      const purchase = await tx.slotPurchase.create({
        data: {
          userId: userId,
          slotsBought: slotsBought,
          amount: totalAmount,
        },
      });

      // บวกเพิ่มจำนวน Slot สะสมให้ผู้ขายในตาราง User
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          listingSlots: {
            increment: slotsBought, // เพิ่มค่าเดิม + slotsBought
          },
        },
      });

      return { purchase, newSlotBalance: updatedUser.listingSlots };
    });

    // 4. ส่งคำตอบกลับไปหาหน้าเว็บ
    return NextResponse.json({
      success: true,
      message: `ทำรายการสำเร็จ! คุณได้รับ ${slotsBought} Slot`,
      data: result,
    });

  } catch (error: any) { // 👈 เติม : any ตรงนี้เพื่อป้องกัน TypeScript Error
    console.error('Error buying slots:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการซื้อ Slot' },
      { status: 500 }
    );
  }
}