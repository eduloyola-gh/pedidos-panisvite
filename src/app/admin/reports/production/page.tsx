"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    items: OrderItem[];
    user?: { name: string; email: string };
    guestInfo?: { name: string; email: string; address: string; phone: string };
    deliveryDate: string;
    total: number;
    shippingCost: number;
    status: string;
}

export default function ProductionReportPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchOrders();
    }, [selectedDate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Fetch orders for the selected date (or week containing the date)
            // For simplicity, we'll fetch recent orders and filter client-side for now
            // Ideally, the API should support date filtering more precisely
            const response = await fetch(`/api/admin/orders?startDate=${selectedDate}`);
            if (response.ok) {
                const data = await response.json();
                // Filter out cancelled orders
                setOrders(data.filter((o: any) => o.status !== 'CANCELLED'));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate total production
    const productionTotals = orders.reduce((acc: Record<string, number>, order) => {
        order.items.forEach(item => {
            acc[item.name] = (acc[item.name] || 0) + item.quantity;
        });
        return acc;
    }, {});

    const printReport = () => {
        window.print();
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando informe de producción...</div>;
    }

    return (
        <div>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Informe de Producción y Picking</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                    />
                    <button className="btn btn-primary" onClick={printReport}>
                        🖨️ Imprimir
                    </button>
                </div>
            </div>

            {/* Total Production Section */}
            <div className="report-section">
                <h2 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    📦 Producción Total - {formatDate(new Date(selectedDate))}
                </h2>

                {Object.keys(productionTotals).length === 0 ? (
                    <p>No hay pedidos activos para esta fecha.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Producto</th>
                                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Cantidad Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(productionTotals).map(([name, quantity]) => (
                                <tr key={name} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.5rem' }}>{name}</td>
                                    <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>{quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Page Break for Printing */}
            <div className="page-break"></div>

            {/* Individual Packing Slips */}
            <h2 className="no-print" style={{ marginTop: '3rem', marginBottom: '1rem' }}>📑 Albaranes de Picking</h2>

            <div className="packing-slips">
                {orders.map(order => {
                    const customerName = order.user?.name || order.guestInfo?.name || 'Cliente';
                    const customerPhone = order.guestInfo?.phone || 'N/A';
                    const customerAddress = order.guestInfo?.address || 'Recogida en tienda';

                    return (
                        <div key={order.id} className="packing-slip" style={{ border: '1px solid #ccc', padding: '2rem', marginBottom: '2rem', pageBreakInside: 'avoid' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>PanIsVite</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Albarán de Entrega</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0 }}><strong>Pedido #{order.id.slice(-6)}</strong></p>
                                    <p style={{ margin: 0 }}>{formatDate(new Date(order.deliveryDate))}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <p><strong>Cliente:</strong> {customerName}</p>
                                <p><strong>Teléfono:</strong> {customerPhone}</p>
                                <p><strong>Dirección:</strong> {customerAddress}</p>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid black' }}>
                                        <th style={{ textAlign: 'left', padding: '0.5rem' }}>Producto</th>
                                        <th style={{ textAlign: 'right', padding: '0.5rem' }}>Cant.</th>
                                        <th style={{ textAlign: 'center', padding: '0.5rem' }}>Check</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem' }}>{item.name}</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 'bold' }}>{item.quantity}</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>⬜</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem', textAlign: 'right' }}>
                                <p style={{ margin: 0 }}><strong>Total a Cobrar: {order.total.toFixed(2)}€</strong></p>
                                {order.shippingCost > 0 && <p style={{ margin: 0, fontSize: '0.9rem' }}>(Incluye {order.shippingCost}€ de envío)</p>}
                            </div>

                            <div className="page-break"></div>
                        </div>
                    );
                })}
            </div>

            <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
          }
          .packing-slip {
            border: none !important;
            padding: 0 !important;
            margin-bottom: 0 !important;
          }
          body {
            font-size: 12pt;
          }
        }
      `}</style>
        </div>
    );
}
