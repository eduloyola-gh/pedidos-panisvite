"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/products', label: 'Productos', icon: '🥖' },
        { href: '/admin/orders', label: 'Pedidos', icon: '📦' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background)' }}>
            {/* Sidebar - Desktop */}
            <aside style={{
                width: '250px',
                background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0,
                zIndex: 10
            }}
                className="desktop-sidebar">
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', margin: 0 }}>
                        MFEL Obrador
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.5rem 0 0 0' }}>
                        Panel de Administración
                    </p>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: pathname === item.href ? 'var(--color-primary)' : 'transparent',
                                color: pathname === item.href ? 'white' : 'var(--color-text)',
                                fontWeight: pathname === item.href ? '600' : '400',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <strong>{session?.user?.name}</strong><br />
                        <span style={{ color: 'var(--color-text-muted)' }}>{session?.user?.email}</span>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '0.5rem' }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="mobile-header" style={{
                display: 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                padding: '1rem',
                zIndex: 20
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>MFEL Obrador</h2>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                    >
                        ☰
                    </button>
                </div>

                {mobileMenuOpen && (
                    <nav style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    padding: '0.75rem',
                                    background: pathname === item.href ? 'var(--color-primary)' : 'var(--color-background)',
                                    color: pathname === item.href ? 'white' : 'var(--color-text)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="btn btn-outline"
                            style={{ marginTop: '0.5rem' }}
                        >
                            Cerrar Sesión
                        </button>
                    </nav>
                )}
            </div>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '250px',
                padding: '2rem'
            }}
                className="admin-main">
                {children}
            </main>

            <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-header {
            display: block !important;
          }
          .admin-main {
            margin-left: 0 !important;
            margin-top: 70px !important;
            padding: 1rem !important;
          }
        }
      `}</style>
        </div>
    );
}
