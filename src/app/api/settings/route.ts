import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET settings (public endpoint for checkout)
export async function GET() {
    try {
        let settings = await prisma.appSettings.findFirst();

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.appSettings.create({
                data: {
                    freeShippingThreshold: 50.0
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}
