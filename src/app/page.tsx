"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import type { Product } from "@/lib/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
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

  return (
    <>
      <Header />
      <main className="container">
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <h2>Haz tu pedido semanal</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Selecciona los productos que deseas recibir el próximo jueves.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>
              No hay productos disponibles en este momento.
            </p>
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </main>
    </>
  );
}
