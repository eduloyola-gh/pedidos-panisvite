import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all orders
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const where: any = {};

        if (status && status !== 'all') {
            where.status = status;
        }

        if (startDate) {
            where.createdAt = { ...where.createdAt, gte: new Date(startDate) };
        }

        if (endDate) {
            where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
        }

        const orders = await prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Parse JSON fields
        const ordersWithParsedData = orders.map(order => ({
            ...order,
            items: JSON.parse(order.items),
            guestInfo: order.guestInfo ? JSON.parse(order.guestInfo) : null
        }));

        return NextResponse.json(ordersWithParsedData);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// PATCH update order status
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

// DELETE order
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
        }

        await prisma.order.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}
