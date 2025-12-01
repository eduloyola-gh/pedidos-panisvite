import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryDate } from '@/lib/utils';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { items, customerName, customerEmail, customerPhone, paymentMethod, shippingMethod, customerAddress } = body;

    if (!items || !customerName || !customerEmail || !customerPhone || !paymentMethod || !shippingMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shippingCost = shippingMethod === 'delivery' ? 8 : 0;
    const total = subtotal + shippingCost;

    // Get delivery date
    const deliveryDate = getDeliveryDate();

    // Create order in database
    const order = await prisma.order.create({
      data: {
        guestInfo: JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: shippingMethod === 'delivery' ? customerAddress : 'Recogida en obrador'
        }),
        items: JSON.stringify(items),
        total,
        shippingCost,
        paymentMethod,
        deliveryDate,
        status: 'PENDING'
      }
    });

    console.log('Order created in database:', order.id);

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
