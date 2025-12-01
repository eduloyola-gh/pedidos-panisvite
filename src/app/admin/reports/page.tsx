"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ProductStats {
    productName: string;
    weeklyQuantity: number;
    weeklyRevenue: number;
    totalQuantity: number;
    totalRevenue: number;
}

interface CustomerStats {
    customerName: string;
    customerEmail: string;
    totalOrders: number;
    totalSpent: number;
}

export default function ReportsPage() {
    const [productStats, setProductStats] = useState<ProductStats[]>([]);
    const [customerStats, setCustomerStats] = useState<CustomerStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year' | 'all'>('week');

    useEffect(() => {
        fetchStats();
    }, [timeFilter]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/reports?period=${timeFilter}`);
            if (response.ok) {
                const data = await response.json();
                setProductStats(data.productStats || []);
                setCustomerStats(data.customerStats || []);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = (data: any[], filename: string) => {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(',')).join('\n');
        const csv = `${headers}\n${rows}`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const printReport = () => {
        window.print();
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando estadísticas...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1>Informes y Estadísticas</h1>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value as any)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <option value="week">Esta Semana</option>
                        <option value="month">Este Mes</option>
                        <option value="year">Este Año</option>
                        <option value="all">Histórico</option>
                    </select>

                    <button className="btn btn-outline" onClick={printReport}>
                        🖨️ Imprimir
                    </button>

                    <Link href="/admin/reports/production">
                        <button className="btn btn-primary">
                            📦 Informe de Producción
                        </button>
                    </Link>
                </div>
            </div>

            {/* Product Statistics */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Estadísticas por Producto</h3>
                    <button
                        className="btn btn-outline"
                        onClick={() => exportToCSV(productStats, 'productos')}
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        📥 Exportar CSV
                    </button>
                </div>

                {productStats.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>No hay datos para el período seleccionado</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Producto</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Cantidad (Período)</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Ingresos (Período)</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Cantidad (Total)</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Ingresos (Total)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productStats.map((stat, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '0.75rem' }}><strong>{stat.productName}</strong></td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{stat.weeklyQuantity}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{stat.weeklyRevenue.toFixed(2)}€</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{stat.totalQuantity}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--color-primary)', fontWeight: '600' }}>
                                            {stat.totalRevenue.toFixed(2)}€
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Customer Statistics */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Estadísticas por Cliente</h3>
                    <button
                        className="btn btn-outline"
                        onClick={() => exportToCSV(customerStats, 'clientes')}
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        📥 Exportar CSV
                    </button>
                </div>

                {customerStats.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>No hay datos para el período seleccionado</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Cliente</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Pedidos</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total Gastado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerStats.map((stat, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '0.75rem' }}><strong>{stat.customerName}</strong></td>
                                        <td style={{ padding: '0.75rem' }}>{stat.customerEmail}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{stat.totalOrders}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--color-primary)', fontWeight: '600' }}>
                                            {stat.totalSpent.toFixed(2)}€
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style jsx>{`
        @media print {
          button, select {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
}
