import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { confirm, note } = body;

    const updateData: { confirm?: boolean; note?: string } = {};

    if (typeof confirm === 'boolean') {
      updateData.confirm = confirm;
    }

    if (typeof note === 'string') {
      updateData.note = note;
    }

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error(`Error updating order ${params.id}:`, error);
    return NextResponse.json({ error: `Error updating order ${params.id}` }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.order.delete({
      where: { id: parseInt(id, 10) },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting order ${params.id}:`, error);
    return NextResponse.json({ error: `Error deleting order ${params.id}` }, { status: 500 });
  }
}
