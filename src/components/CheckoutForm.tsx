"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { getDeliveryDate, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function CheckoutForm() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        isGuest: true,
        shippingMethod: 'delivery' as 'delivery' | 'pickup',
        paymentMethod: 'bizum' as 'bizum' | 'transfer' | 'card'
    });

    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

    useEffect(() => {
        setDeliveryDate(getDeliveryDate());
    }, []);

    const shippingCost = formData.shippingMethod === 'delivery' ? 8 : 0;
    const finalTotal = cartTotal + shippingCost;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    customerName: formData.name,
                    customerEmail: formData.email,
                    customerPhone: formData.phone,
                    customerAddress: formData.address,
                    paymentMethod: formData.paymentMethod,
                    shippingMethod: formData.shippingMethod
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Order placed:', data);
                alert('¡Pedido realizado con éxito! Gracias por confiar en MFEL Obrador.');
                clearCart();
                router.push('/');
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
        }
    };

    if (items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h3>Tu cesta está vacía</h3>
                <button className="btn btn-primary" onClick={() => router.push('/')} style={{ marginTop: '1rem' }}>
                    Volver a la tienda
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Datos de Contacto</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Nombre Completo"
                            required
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            type="tel"
                            placeholder="Teléfono"
                            required
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Entrega</h3>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="shipping"
                                checked={formData.shippingMethod === 'delivery'}
                                onChange={() => setFormData({ ...formData, shippingMethod: 'delivery' })}
                            />
                            <span>Envío a Domicilio (8.00€)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="shipping"
                                checked={formData.shippingMethod === 'pickup'}
                                onChange={() => setFormData({ ...formData, shippingMethod: 'pickup' })}
                            />
                            <span>Recogida en Obrador (Gratis)</span>
                        </label>
                    </div>

                    {formData.shippingMethod === 'delivery' && (
                        <input
                            type="text"
                            placeholder="Dirección de Entrega"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    )}

                    {deliveryDate && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                                Fecha estimada de entrega/recogida:
                            </p>
                            <p>{formatDate(deliveryDate)}</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Pago</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="payment"
                                checked={formData.paymentMethod === 'bizum'}
                                onChange={() => setFormData({ ...formData, paymentMethod: 'bizum' })}
                            />
                            <span>Bizum</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="payment"
                                checked={formData.paymentMethod === 'transfer'}
                                onChange={() => setFormData({ ...formData, paymentMethod: 'transfer' })}
                            />
                            <span>Transferencia Bancaria</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="payment"
                                checked={formData.paymentMethod === 'card'}
                                onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                            />
                            <span>Tarjeta</span>
                        </label>
                    </div>

                    <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        {formData.paymentMethod === 'bizum' && (
                            <p>Hacer Bizum al <strong>609 037 555</strong> indicando tu nombre en el concepto.</p>
                        )}
                        {formData.paymentMethod === 'transfer' && (
                            <p>
                                Transferencia a cuenta:<br />
                                IBAN: <strong>ES25 2100 3411 8622 0009 1786</strong><br />
                                Titular: MFEL Obrador, S.L.<br />
                                Concepto: Tu nombre completo
                            </p>
                        )}
                        {formData.paymentMethod === 'card' && (
                            <p>Serás redirigido a la pasarela de pago segura.</p>
                        )}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                    Confirmar Pedido ({finalTotal.toFixed(2)}€)
                </button>
            </form>

            <div className="card" style={{ position: 'sticky', top: '6rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Resumen del Pedido</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.quantity}x {item.name}</span>
                            <span>{(item.price * item.quantity).toFixed(2)}€</span>
                        </div>
                    ))}
                    <hr style={{ borderColor: 'var(--color-border)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Subtotal</span>
                        <span>{cartTotal.toFixed(2)}€</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Envío</span>
                        <span>{shippingCost.toFixed(2)}€</span>
                    </div>
                    <hr style={{ borderColor: 'var(--color-border)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total</span>
                        <span>{finalTotal.toFixed(2)}€</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
