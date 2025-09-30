
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      category,
      transactionType,
      author,
      propertyType,
      estimatedAmount,
      contact,
      region,
      title,
      description,
      note,
    } = body;

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.socket?.remoteAddress;


    const newOrder = await prisma.order.create({
      data: {
        category,
        transactionType,
        author,
        propertyType,
        estimatedAmount,
        contact,
        ipAddress: ipAddress || 'unknown',
        region,
        title,
        description,
        note,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}

import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("Order")
      .select("*", { count: "exact" })
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
    }
    
    return NextResponse.json({ data, count });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}
