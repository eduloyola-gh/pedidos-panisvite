import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET settings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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

// PUT update settings
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { freeShippingThreshold } = body;

        if (freeShippingThreshold === undefined || freeShippingThreshold < 0) {
            return NextResponse.json({ error: 'Invalid threshold value' }, { status: 400 });
        }

        // Get or create settings
        let settings = await prisma.appSettings.findFirst();

        if (!settings) {
            settings = await prisma.appSettings.create({
                data: { freeShippingThreshold: parseFloat(freeShippingThreshold) }
            });
        } else {
            settings = await prisma.appSettings.update({
                where: { id: settings.id },
                data: { freeShippingThreshold: parseFloat(freeShippingThreshold) }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
