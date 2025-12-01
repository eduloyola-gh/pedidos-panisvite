import prisma from './prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@mfelobrador.com' },
        update: {},
        create: {
            email: 'admin@mfelobrador.com',
            password: hashedPassword,
            name: 'Administrador',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create products
    const products = [
        {
            name: 'Pan de Masa Madre',
            description: 'Hogaza de 1kg fermentada durante 24h con nuestra masa madre centenaria.',
            price: 4.50,
            imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
            category: 'bread',
            active: true
        },
        {
            name: 'Barra Rústica',
            description: 'Barra crujiente de harina de trigo molida a la piedra.',
            price: 1.20,
            imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
            category: 'bread',
            active: true
        },
        {
            name: 'Croissant de Mantequilla',
            description: 'Clásico croissant francés con mantequilla 100% natural.',
            price: 1.80,
            imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
            category: 'pastry',
            active: true
        },
        {
            name: 'Ensaimada',
            description: 'Dulce tradicional, esponjoso y cubierto de azúcar glass.',
            price: 2.50,
            imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&q=80',
            category: 'pastry',
            active: true
        },
        {
            name: 'Pan de Centeno',
            description: 'Pan denso y oscuro, 100% harina de centeno integral.',
            price: 5.00,
            imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80',
            category: 'bread',
            active: true
        },
        {
            name: 'Magdalenas Caseras (Pack 6)',
            description: 'Magdalenas esponjosas con aceite de oliva virgen extra.',
            price: 4.00,
            imageUrl: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=80',
            category: 'pastry',
            active: true
        }
    ];

    for (const p of products) {
        const product = await prisma.product.upsert({
            where: { name: p.name },
            update: p,
            create: p,
        });
        console.log('✅ Product created:', product.name);
    }

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
