import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' }, { status: 400 });
    }

    // จำลองการเข้าสู่ระบบสำเร็จ
    const user = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: role || 'BUYER', // BUYER หรือ SELLER
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      slots: 5,
    };

    return NextResponse.json({
      message: 'เข้าสู่ระบบสำเร็จ!',
      user,
    });

  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' }, { status: 500 });
  }
}