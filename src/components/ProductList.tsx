"use client";

import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface ProductListProps {
    products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
    const { addToCart, items, updateQuantity } = useCart();

    const getQuantity = (productId: string) => {
        return items.find(item => item.id === productId)?.quantity || 0;
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
            padding: '2rem 0'
        }}>
            {products.map(product => {
                const quantity = getQuantity(product.id);

                return (
                    <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                        <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{product.name}</h3>
                                <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                                    {product.price.toFixed(2)}€
                                </span>
                            </div>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                {product.description}
                            </p>

                            {quantity === 0 ? (
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                    onClick={() => addToCart(product)}
                                >
                                    Añadir al Pedido
                                </button>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-background)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                                    <button
                                        className="btn"
                                        style={{ padding: '0.5rem 1rem', color: 'var(--color-primary)' }}
                                        onClick={() => updateQuantity(product.id, quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span style={{ fontWeight: '600' }}>{quantity}</span>
                                    <button
                                        className="btn"
                                        style={{ padding: '0.5rem 1rem', color: 'var(--color-primary)' }}
                                        onClick={() => updateQuantity(product.id, quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
