import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productTitle, amount, customerName, userIg, customerAddress } = body;

    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const adminUserId = process.env.LINE_ADMIN_USER_ID;

    if (!lineToken || !adminUserId) {
      console.warn('LINE Notification skipped: Missing LINE credentials');
      return NextResponse.json({ success: false, message: 'LINE credentials not configured' });
    }

    // ข้อความที่จะส่งเข้า LINE
    const messageText = 
`🛍️ มีคำสั่งซื้อใหม่เข้ามา!
------------------------
📦 สินค้า: ${productTitle || 'ไม่ได้ระบุ'}
💰 ยอดเงิน: ${Number(amount || 0).toLocaleString()} บาท
👤 ลูกค้า (IG): @${(userIg || customerName || '').replace(/^@/, '')}
📍 ที่อยู่จัดส่ง:
${customerAddress || 'ไม่ได้ระบุ'}
------------------------
โปรดตรวจสอบสลิปในระบบร้านค้า`;

    // ยิงเข้า LINE Messaging API Push Message
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${lineToken}`,
      },
      body: JSON.stringify({
        to: adminUserId,
        messages: [
          {
            type: 'text',
            text: messageText,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errDetail = await res.text();
      console.error('LINE Push Error:', errDetail);
      return NextResponse.json({ success: false, error: errDetail }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Server Notify Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}