import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    // 2. เช็กว่าอีเมลนี้เคยสมัครหรือยัง
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' }, { status: 400 });
    }

    // 3. เข้ารหัส password เพื่อความปลอดภัย
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. บันทึกผู้ใช้ใหม่ลง Database (แถม Slot ฝากขายฟรีเริ่มต้น 1 Slot)
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        role: 'BUYER',
        listingSlots: 1, // แถม Slot ฟรีให้ผู้ใช้ใหม่ลองลงขาย
      },
    });

    return NextResponse.json({
      message: 'สมัครสมาชิกสำเร็จ!',
      user: { id: newUser.id, email: newUser.email, name: newUser.fullName },
    });
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' }, { status: 500 });
  }
}