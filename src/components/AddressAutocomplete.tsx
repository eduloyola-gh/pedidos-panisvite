"use client";

import { useState, useEffect, useRef } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];

interface AddressAutocompleteProps {
    onAddressSelect: (address: string) => void;
    defaultValue?: string;
}

export default function AddressAutocomplete({ onAddressSelect, defaultValue = '' }: AddressAutocompleteProps) {
    const [address, setAddress] = useState(defaultValue);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [error, setError] = useState('');

    // Load Google Maps Script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    useEffect(() => {
        setAddress(defaultValue);
    }, [defaultValue]);

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                setAddress(place.formatted_address);
                onAddressSelect(place.formatted_address);
                setError('');
            } else if (place.name) {
                // Fallback if formatted_address is missing but name exists (rare for addresses)
                setAddress(place.name);
                onAddressSelect(place.name);
                setError('');
            }
        }
    };

    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            setError("La geolocalización no es soportada por tu navegador.");
            return;
        }

        setLocationLoading(true);
        setError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Use Geocoding service to get address from coordinates
                // We need to wait for the script to be loaded to use google.maps.Geocoder
                if (isLoaded && window.google) {
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                        if (status === "OK" && results && results[0]) {
                            const formattedAddress = results[0].formatted_address;
                            setAddress(formattedAddress);
                            onAddressSelect(formattedAddress);
                        } else {
                            setError("No se pudo encontrar la dirección para tu ubicación.");
                        }
                        setLocationLoading(false);
                    });
                } else {
                    setError("Google Maps no está cargado aún.");
                    setLocationLoading(false);
                }
            },
            (err) => {
                console.error(err);
                setError("Error al obtener tu ubicación. Por favor verifica los permisos.");
                setLocationLoading(false);
            }
        );
    };

    if (loadError) {
        return (
            <div style={{ color: 'red', fontSize: '0.9rem' }}>
                Error al cargar Google Maps. Por favor verifica tu conexión o la configuración.
                <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                        onAddressSelect(e.target.value);
                    }}
                    placeholder="Escribe tu dirección manualmente"
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        marginTop: '0.5rem'
                    }}
                />
            </div>
        );
    }

    if (!isLoaded) {
        return <div>Cargando buscador de direcciones...</div>;
    }

    // Check if API key is missing to show a helpful message (for development)
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                        onAddressSelect(e.target.value);
                    }}
                    placeholder="Dirección de Entrega"
                    required
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                    }}
                />
                <p style={{ fontSize: '0.8rem', color: 'orange', marginTop: '0.25rem' }}>
                    ⚠️ API Key de Google Maps no configurada. El autocompletado no funcionará.
                </p>
            </div>
        )
    }

    return (
        <div style={{ position: 'relative' }}>
            <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
                fields={["formatted_address", "geometry", "name"]}
            >
                <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                        onAddressSelect(e.target.value);
                    }}
                    placeholder="Busca tu dirección..."
                    required
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        paddingRight: '3rem', // Space for the location button
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                    }}
                />
            </Autocomplete>

            <button
                type="button"
                onClick={handleGeolocation}
                disabled={locationLoading}
                title="Usar mi ubicación actual"
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    opacity: locationLoading ? 0.5 : 1
                }}
            >
                {locationLoading ? '⏳' : '📍'}
            </button>

            {error && (
                <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {error}
                </div>
            )}
        </div>
    );
}
