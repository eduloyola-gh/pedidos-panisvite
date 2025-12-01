import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDeliveryDate } from '@/lib/utils';
import prisma from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    // Validate required fields
    const { items, customerName, customerEmail, customerPhone, paymentMethod, shippingMethod, customerAddress } = body;

    if (!items || !customerName || !customerEmail || !customerPhone || !paymentMethod || !shippingMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shippingCost = shippingMethod === 'delivery' ? 8 : 0;

    // Check for free shipping threshold
    let finalShippingCost = shippingCost;
    const settings = await prisma.appSettings.findFirst();
    if (settings && subtotal >= settings.freeShippingThreshold && shippingMethod === 'delivery') {
      finalShippingCost = 0;
    }

    const total = subtotal + finalShippingCost;

    // Get delivery date
    const deliveryDate = getDeliveryDate();

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session?.user ? (session.user as any).id : undefined,
        guestInfo: session?.user ? null : JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: shippingMethod === 'delivery' ? customerAddress : 'Recogida en obrador'
        }),
        items: JSON.stringify(items),
        total,
        shippingCost: finalShippingCost,
        paymentMethod,
        deliveryDate,
        status: 'PENDING'
      },
      include: {
        user: true
      }
    });

    console.log('Order created in database:', order.id);

    // Send confirmation email asynchronously
    sendOrderConfirmationEmail(order, items).catch(err => console.error('Failed to send email:', err));

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
