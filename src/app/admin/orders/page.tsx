"use client";

import { useState, useEffect } from "react";

interface Order {
    id: string;
    guestInfo: {
        name: string;
        email: string;
        phone: string;
        address: string;
    } | null;
    user?: {
        name: string;
        email: string;
    };
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    total: number;
    shippingCost: number;
    paymentMethod: string;
    deliveryDate: string;
    status: string;
    createdAt: string;
}

export default function OrdersManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const url = statusFilter === 'all'
                ? '/api/admin/orders'
                : `/api/admin/orders?status=${statusFilter}`;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status: newStatus })
            });

            if (response.ok) {
                await fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Error al actualizar el pedido');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return { bg: '#fef3c7', color: '#92400e' };
            case 'PROCESSING': return { bg: '#dbeafe', color: '#1e40af' };
            case 'COMPLETED': return { bg: '#d1fae5', color: '#065f46' };
            case 'CANCELLED': return { bg: '#fee2e2', color: '#991b1b' };
            default: return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendiente';
            case 'PROCESSING': return 'En Proceso';
            case 'COMPLETED': return 'Completado';
            case 'CANCELLED': return 'Cancelado';
            default: return status;
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando pedidos...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Gestión de Pedidos</h1>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        background: 'white'
                    }}
                >
                    <option value="all">Todos los pedidos</option>
                    <option value="PENDING">Pendientes</option>
                    <option value="PROCESSING">En Proceso</option>
                    <option value="COMPLETED">Completados</option>
                    <option value="CANCELLED">Cancelados</option>
                </select>
            </div>

            {orders.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                        No hay pedidos {statusFilter !== 'all' ? `con estado "${getStatusLabel(statusFilter)}"` : 'aún'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {orders.map(order => {
                        const customerInfo = order.guestInfo || order.user;
                        const statusStyle = getStatusColor(order.status);

                        return (
                            <div key={order.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.5rem 0' }}>Pedido #{order.id.slice(-8)}</h3>
                                        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                            {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    <span style={{
                                        padding: '0.5rem 1rem',
                                        background: statusStyle.bg,
                                        color: statusStyle.color,
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Cliente</h4>
                                        <p style={{ margin: 0 }}><strong>{customerInfo?.name}</strong></p>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>{customerInfo?.email}</p>
                                        {order.guestInfo && (
                                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>{order.guestInfo.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Entrega</h4>
                                        <p style={{ margin: 0 }}>
                                            {new Date(order.deliveryDate).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                                            {order.guestInfo?.address || 'Recogida en obrador'}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Productos</h4>
                                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                        {order.items.map((item, idx) => (
                                            <li key={idx} style={{ marginBottom: '0.25rem' }}>
                                                {item.quantity}x {item.name} - {(item.price * item.quantity).toFixed(2)}€
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                            Subtotal: {(order.total - order.shippingCost).toFixed(2)}€ | Envío: {order.shippingCost.toFixed(2)}€
                                        </p>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                                            Total: {order.total.toFixed(2)}€
                                        </p>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                            Pago: {order.paymentMethod}
                                        </p>
                                    </div>

                                    <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--color-border)',
                                            background: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="PENDING">Pendiente</option>
                                        <option value="PROCESSING">En Proceso</option>
                                        <option value="COMPLETED">Completado</option>
                                        <option value="CANCELLED">Cancelado</option>
                                    </select>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
