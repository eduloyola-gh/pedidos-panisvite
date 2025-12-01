"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import ImageUpload from "@/components/ImageUpload";

export default function ProductsManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: 'bread'
    });

    // Fetch products from API
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                // Update existing product
                const response = await fetch('/api/admin/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...editingProduct, ...formData })
                });

                if (response.ok) {
                    await fetchProducts();
                }
            } else {
                // Create new product
                const response = await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    await fetchProducts();
                }
            }

            // Reset form
            setFormData({ name: '', description: '', price: 0, imageUrl: '', category: 'bread' });
            setEditingProduct(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                const response = await fetch(`/api/admin/products?id=${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await fetchProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error al eliminar el producto');
            }
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando productos...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Gestión de Productos</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setShowForm(true);
                        setEditingProduct(null);
                        setFormData({ name: '', description: '', price: 0, imageUrl: '', category: 'bread' });
                    }}
                >
                    + Nuevo Producto
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>
                        {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descripción</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minHeight: '100px' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Precio (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Categoría</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                >
                                    <option value="bread">Pan</option>
                                    <option value="pastry">Repostería</option>
                                    <option value="other">Otro</option>
                                </select>
                            </div>
                        </div>

                        <ImageUpload
                            currentImage={formData.imageUrl}
                            onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                        />

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                {editingProduct ? 'Actualizar' : 'Crear'} Producto
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingProduct(null);
                                    setFormData({ name: '', description: '', price: 0, imageUrl: '', category: 'bread' });
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                {products.map(product => (
                    <div key={product.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                        />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                                {product.description}
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                                    {product.price.toFixed(2)}€
                                </span>
                                <span style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem', background: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
                                    {product.category === 'bread' ? 'Pan' : product.category === 'pastry' ? 'Repostería' : 'Otro'}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className="btn btn-outline"
                                onClick={() => handleEdit(product)}
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                Editar
                            </button>
                            <button
                                className="btn"
                                onClick={() => handleDelete(product.id)}
                                style={{ padding: '0.5rem 1rem', background: '#fee', color: '#c00' }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
