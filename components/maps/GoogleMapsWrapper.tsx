'use client';

import { useLoadScript, GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { useCallback, useState, useEffect } from 'react';

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795, // Center of US
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface GoogleMapsWrapperProps {
  fromLocation: Location | null;
  toLocation: Location | null;
  onRouteCalculated?: (distance: number, duration: number) => void;
}

export default function GoogleMapsWrapper({
  fromLocation,
  toLocation,
  onRouteCalculated,
}: GoogleMapsWrapperProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Calculate and display route when both locations are set
  useEffect(() => {
    if (!fromLocation || !toLocation || !map) {
      setDirections(null);
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: fromLocation.lat, lng: fromLocation.lng },
        destination: { lat: toLocation.lat, lng: toLocation.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);

          // Extract distance and duration
          const route = result.routes[0];
          if (route && route.legs[0]) {
            const leg = route.legs[0];
            const distanceMiles = (leg.distance?.value || 0) / 1609.34; // Convert meters to miles
            const durationHours = (leg.duration?.value || 0) / 3600; // Convert seconds to hours
            onRouteCalculated?.(Math.round(distanceMiles), durationHours);
          }

          // Fit bounds to show both markers
          const bounds = new google.maps.LatLngBounds();
          bounds.extend({ lat: fromLocation.lat, lng: fromLocation.lng });
          bounds.extend({ lat: toLocation.lat, lng: toLocation.lng });
          map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        }
      }
    );
  }, [fromLocation, toLocation, map, onRouteCalculated]);

  // Update map view when only one location is set
  useEffect(() => {
    if (!map) return;

    if (fromLocation && !toLocation) {
      map.panTo({ lat: fromLocation.lat, lng: fromLocation.lng });
      map.setZoom(12);
    } else if (!fromLocation && toLocation) {
      map.panTo({ lat: toLocation.lat, lng: toLocation.lng });
      map.setZoom(12);
    } else if (!fromLocation && !toLocation) {
      map.panTo(defaultCenter);
      map.setZoom(4);
    }
  }, [map, fromLocation, toLocation]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-2xl">
        <div className="text-center p-8">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-lg text-muted-foreground">
            Unable to load Google Maps
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please check your API key configuration
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-2xl">
        <div className="text-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={4}
      center={defaultCenter}
      options={mapOptions}
      onLoad={onMapLoad}
    >
      {/* From marker */}
      {fromLocation && !directions && (
        <MarkerF
          position={{ lat: fromLocation.lat, lng: fromLocation.lng }}
          icon={{
            url: 'data:image/svg+xml,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                <circle cx="12" cy="12" r="10" fill="#166534" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
          }}
          title={`From: ${fromLocation.address}`}
        />
      )}

      {/* To marker */}
      {toLocation && !directions && (
        <MarkerF
          position={{ lat: toLocation.lat, lng: toLocation.lng }}
          icon={{
            url: 'data:image/svg+xml,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                <circle cx="12" cy="12" r="10" fill="#1e3a5f" stroke="white" stroke-width="2"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="12">🏠</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
          }}
          title={`To: ${toLocation.address}`}
        />
      )}

      {/* Route directions */}
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#166534',
              strokeWeight: 5,
              strokeOpacity: 0.8,
            },
          }}
        />
      )}
    </GoogleMap>
  );
}
