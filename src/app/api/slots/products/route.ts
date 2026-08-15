export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. ดึงข้อมูลสินค้าทั้งหมด
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. รับข้อมูลจากหน้าแอดมินมาบันทึกลง Supabase
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          title: body.title,
          description: body.description || '',
          price: Number(body.price),
          brand: body.brand || 'General',
          size: body.size || 'Free Size',
          category: body.category || 'Shirt',
          condition_grade: body.conditionGrade || body.condition_grade || 'GRADE_A',
          image: body.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
          status: body.status || 'AVAILABLE',
          allow_offers: body.allowOffers || false,
        }
      ])
      .select();

    if (error) throw error;
    return NextResponse.json(data?.[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. แก้ไขสถานะสินค้า (เช่น เปลี่ยนเป็น SOLD OUT)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const { data, error } = await supabase
      .from('products')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data?.[0]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}