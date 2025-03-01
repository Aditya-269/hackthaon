import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap as GoogleMapApi,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

interface GoogleMapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ position: { lat: number; lng: number }; title?: string }>;
  destination?: { lat: number; lng: number };
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
  isEmergencyMode?: boolean;
  className?: string;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  center = { lat: 12.838475234898915, lng:  77.65813207194557 },
  zoom = 14,
  markers = [],
  destination,
  onLocationUpdate,
  isEmergencyMode = false,
  className = "",
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(currentLocation);
        if (onLocationUpdate) onLocationUpdate(currentLocation);
        if (map) map.panTo(currentLocation);
      },
      (error) => {
        console.error("Error getting location:", error);
        setUserLocation(center);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, [map, center, onLocationUpdate]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    if (isLoaded && userLocation && destination) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: destination,
          travelMode: google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, userLocation, destination]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    if (userLocation) map.setCenter(userLocation);
  }, [userLocation]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    console.error("Google Maps loading error:", loadError);
    return <div className="flex items-center justify-center h-full">Error loading maps: Please check your API key</div>;
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-full">Loading maps...</div>;
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <GoogleMapApi
        mapContainerStyle={containerStyle}
        center={userLocation || center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true,
        }}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
            title="Your Location"
          />
        )}

        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} title={marker.title} />
        ))}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: isEmergencyMode ? "#FF0000" : "#4285F4",
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMapApi>
    </div>
  );
};

export default GoogleMapComponent;
