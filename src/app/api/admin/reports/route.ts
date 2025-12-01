import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'week';

        // Calculate date range
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            case 'all':
                startDate = new Date(0); // Beginning of time
                break;
        }

        // Get all orders
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Get all historical orders for total stats
        const allOrders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Calculate product statistics
        const productStatsMap = new Map<string, any>();

        // Period stats
        orders.forEach(order => {
            const items = JSON.parse(order.items);
            items.forEach((item: any) => {
                if (!productStatsMap.has(item.name)) {
                    productStatsMap.set(item.name, {
                        productName: item.name,
                        weeklyQuantity: 0,
                        weeklyRevenue: 0,
                        totalQuantity: 0,
                        totalRevenue: 0
                    });
                }
                const stats = productStatsMap.get(item.name);
                stats.weeklyQuantity += item.quantity;
                stats.weeklyRevenue += item.price * item.quantity;
            });
        });

        // Total stats
        allOrders.forEach(order => {
            const items = JSON.parse(order.items);
            items.forEach((item: any) => {
                if (!productStatsMap.has(item.name)) {
                    productStatsMap.set(item.name, {
                        productName: item.name,
                        weeklyQuantity: 0,
                        weeklyRevenue: 0,
                        totalQuantity: 0,
                        totalRevenue: 0
                    });
                }
                const stats = productStatsMap.get(item.name);
                stats.totalQuantity += item.quantity;
                stats.totalRevenue += item.price * item.quantity;
            });
        });

        const productStats = Array.from(productStatsMap.values())
            .sort((a, b) => b.totalRevenue - a.totalRevenue);

        // Calculate customer statistics
        const customerStatsMap = new Map<string, any>();

        allOrders.forEach(order => {
            const guestInfo = order.guestInfo ? JSON.parse(order.guestInfo) : null;
            const customerName = order.user?.name || guestInfo?.name || 'Cliente Invitado';
            const customerEmail = order.user?.email || guestInfo?.email || 'N/A';

            if (!customerStatsMap.has(customerEmail)) {
                customerStatsMap.set(customerEmail, {
                    customerName,
                    customerEmail,
                    totalOrders: 0,
                    totalSpent: 0
                });
            }

            const stats = customerStatsMap.get(customerEmail);
            stats.totalOrders += 1;
            stats.totalSpent += order.total;
        });

        const customerStats = Array.from(customerStatsMap.values())
            .sort((a, b) => b.totalSpent - a.totalSpent);

        return NextResponse.json({
            productStats,
            customerStats
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}
