"use client";

import { useState } from 'react';

interface ImageUploadProps {
    onImageUploaded: (url: string) => void;
    currentImage?: string;
}

export default function ImageUpload({ onImageUploaded, currentImage }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                onImageUploaded(data.imageUrl);
            } else {
                const error = await response.json();
                alert(error.error || 'Error al subir la imagen');
                setPreview(currentImage || null);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen');
            setPreview(currentImage || null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Imagen del Producto
            </label>

            {preview && (
                <div style={{ marginBottom: '1rem' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--color-border)'
                        }}
                    />
                </div>
            )}

            <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={uploading}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    cursor: uploading ? 'not-allowed' : 'pointer'
                }}
            />

            {uploading && (
                <p style={{ marginTop: '0.5rem', color: 'var(--color-primary)', fontSize: '0.9rem' }}>
                    Subiendo imagen...
                </p>
            )}

            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Formatos permitidos: JPEG, PNG, WebP. Tamaño máximo: 5MB
            </p>
        </div>
    );
}
