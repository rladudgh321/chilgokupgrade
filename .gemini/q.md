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
    Sentry.captureException(error);
    await notifySlack(error, request.url);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}

--------------
`/api/inquiries/orders/route.ts`파일에 POST 매서드에는 나는 prisma가 아니라 supabase로 했으면 좋겠어
`const cookieStore = await cookies();
    const supabase = createClient(cookieStore);`을 이용하면 supabase를 사용할 수 있어