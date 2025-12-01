import { Product } from './types';

export const products: Product[] = [
    {
        id: '1',
        name: 'Pan de Masa Madre',
        description: 'Hogaza de 1kg fermentada durante 24h con nuestra masa madre centenaria.',
        price: 4.50,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        category: 'bread'
    },
    {
        id: '2',
        name: 'Barra Rústica',
        description: 'Barra crujiente de harina de trigo molida a la piedra.',
        price: 1.20,
        imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
        category: 'bread'
    },
    {
        id: '3',
        name: 'Croissant de Mantequilla',
        description: 'Clásico croissant francés con mantequilla 100% natural.',
        price: 1.80,
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
        category: 'pastry'
    },
    {
        id: '4',
        name: 'Ensaimada',
        description: 'Dulce tradicional, esponjoso y cubierto de azúcar glass.',
        price: 2.50,
        imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&q=80',
        category: 'pastry'
    },
    {
        id: '5',
        name: 'Pan de Centeno',
        description: 'Pan denso y oscuro, 100% harina de centeno integral.',
        price: 5.00,
        imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80',
        category: 'bread'
    },
    {
        id: '6',
        name: 'Magdalenas Caseras (Pack 6)',
        description: 'Magdalenas esponjosas con aceite de oliva virgen extra.',
        price: 4.00,
        imageUrl: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=80',
        category: 'pastry'
    }
];
