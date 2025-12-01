"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
    weeklyOrders: number;
    weeklyRevenue: number;
    totalProducts: number;
    pendingOrders: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        weeklyOrders: 0,
        weeklyRevenue: 0,
        totalProducts: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Fetch all orders
            const ordersResponse = await fetch('/api/admin/orders');
            const orders = ordersResponse.ok ? await ordersResponse.json() : [];

            // Fetch all products
            const productsResponse = await fetch('/api/admin/products');
            const products = productsResponse.ok ? await productsResponse.json() : [];

            // Calculate stats
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            const weeklyOrders = orders.filter((order: any) =>
                new Date(order.createdAt) >= oneWeekAgo
            );

            const weeklyRevenue = weeklyOrders.reduce((sum: number, order: any) =>
                sum + order.total, 0
            );

            const pendingOrders = orders.filter((order: any) =>
                order.status === 'PENDING'
            ).length;

            setStats({
                weeklyOrders: weeklyOrders.length,
                weeklyRevenue,
                totalProducts: products.filter((p: any) => p.active).length,
                pendingOrders
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando estadísticas...</div>;
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        {stats.weeklyOrders}
                    </div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Pedidos esta semana</div>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        {stats.weeklyRevenue.toFixed(2)}€
                    </div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Ingresos esta semana</div>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥖</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        {stats.totalProducts}
                    </div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Productos activos</div>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        {stats.pendingOrders}
                    </div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Pedidos pendientes</div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Accesos Rápidos</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link href="/admin/products" className="btn btn-primary">
                        Gestionar Productos
                    </Link>
                    <Link href="/admin/orders" className="btn btn-outline">
                        Ver Pedidos
                    </Link>
                </div>
            </div>
        </div>
    );
}
