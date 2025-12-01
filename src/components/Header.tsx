"use client";

import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
    const { itemCount, cartTotal } = useCart();
    const { data: session } = useSession();

    return (
        <header style={{
            borderBottom: '1px solid var(--color-border)',
            padding: '1rem 0',
            marginBottom: '2rem',
            backgroundColor: 'var(--color-surface)',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <Link href="/" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        MFEL Obrador
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Panadería Artesanal
                    </span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {session ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.9rem' }}>
                                Hola, <strong>{session.user?.name}</strong>
                            </span>
                            {(session.user as any)?.role === 'ADMIN' && (
                                <Link href="/admin">
                                    <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                                        Admin
                                    </button>
                                </Link>
                            )}
                            <button
                                className="btn btn-outline"
                                style={{ padding: '0.5rem 1rem' }}
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link href="/login">
                                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                                    Iniciar Sesión
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                                    Registrarse
                                </button>
                            </Link>
                        </div>
                    )}

                    {itemCount > 0 && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            fontSize: '0.9rem'
                        }}>
                            <span style={{ fontWeight: '600' }}>{itemCount} productos</span>
                            <span style={{ color: 'var(--color-primary)' }}>{cartTotal.toFixed(2)}€</span>
                        </div>
                    )}
                    <Link href="/checkout">
                        <button className="btn btn-primary">
                            {itemCount > 0 ? 'Ver Pedido' : 'Cesta Vacía'}
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
