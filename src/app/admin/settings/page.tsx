"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({ freeShippingThreshold: 50.0 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/settings');
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setMessage('✅ Configuración guardada correctamente');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('❌ Error al guardar la configuración');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('❌ Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando configuración...</div>;
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Configuración</h1>

            <div className="card" style={{ maxWidth: '600px' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Configuración de Envíos</h3>

                {message && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: message.includes('✅') ? '#d1fae5' : '#fee2e2',
                        color: message.includes('✅') ? '#065f46' : '#991b1b'
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Umbral para Envío Gratis (€)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={settings.freeShippingThreshold}
                            onChange={e => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                fontSize: '1rem'
                            }}
                        />
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                            Los pedidos con un importe igual o superior a este valor tendrán envío gratis.
                        </p>
                    </div>

                    <div style={{
                        padding: '1rem',
                        background: 'var(--color-background)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.9rem'
                    }}>
                        <strong>Ejemplo:</strong> Si estableces {settings.freeShippingThreshold}€, los pedidos de {settings.freeShippingThreshold}€ o más tendrán envío gratis.
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                        style={{ padding: '1rem' }}
                    >
                        {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </form>
            </div>
        </div>
    );
}
