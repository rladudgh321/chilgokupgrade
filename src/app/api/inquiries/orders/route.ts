import { NextResponse } from 'next/server';
import * as Sentry from "@sentry/nextjs";
import { notifySlack } from "@/app/utils/sentry/slack";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
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

    const { data: newOrder, error } = await supabase.from('Order').insert([
      {
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
    ]).select();

    if (error) {
      Sentry.captureException(error);
      await notifySlack(error, request.url);
      return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    Sentry.captureException(error);
    await notifySlack(error, request.url);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}



export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
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
      Sentry.captureException(error);
      await notifySlack(error, request.url);
      return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
    }
    
    return NextResponse.json({ data, count });

  } catch (error) {
    Sentry.captureException(error);
    await notifySlack(error, request.url);
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}