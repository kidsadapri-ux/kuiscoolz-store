import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    // 1. ค้นหาผู้ใช้ในฐานข้อมูล PostgreSQL
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. ถ้ายังไม่มีผู้ใช้นี้ ให้ลงทะเบียนเพิ่มลง Database ทันที
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password, // 💡 ในระบบจริง ควรใช้ bcrypt หรือ argon2 แฮชรหัสผ่านก่อนบันทึก
          name: email.split('@')[0],
          role: role || 'BUYER',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
          slots: 5,
        },
      });
    }

    return NextResponse.json({
      message: 'เข้าสู่ระบบสำเร็จ!',
      user,
    });
  } catch (error: any) {
    console.error('Auth Error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}