import React, { useState, useEffect } from "react";
import GoogleMapComponent from "./GoogleMap";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { MapPin, Navigation, AlertTriangle, Locate } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

interface LocationMapProps {
  isEmergencyMode?: boolean;
  currentLocation?: { lat: number; lng: number };
  destination?: { lat: number; lng: number; name: string };
  onRouteSelect?: (routeId: string) => void;
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({
  isEmergencyMode = false,
  currentLocation,
  destination,
  onRouteSelect = () => {},
  onLocationUpdate = () => {},
}) => {
  useEffect(() => {
    let watchId: number | null = null;

    const handleLocationError = (error: GeolocationPositionError) => {
      console.error("LocationMap: Error getting position:", error);
      // Fallback to default location if provided
      if (currentLocation) {
        onLocationUpdate(currentLocation);
      }
    };

    const handleLocationUpdate = (position: GeolocationPosition) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      console.log("LocationMap: Location updated:", newLocation);
      onLocationUpdate(newLocation);
    };

    const startLocationTracking = async () => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
      }

      try {
        // First get a high-accuracy position
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { enableHighAccuracy: true, timeout: 11000, maximumAge: 0 }
          );
        });
        handleLocationUpdate(position);

        // Then start watching for updates
        watchId = navigator.geolocation.watchPosition(
          handleLocationUpdate,
          handleLocationError,
          {
            enableHighAccuracy: true,
            maximumAge: isEmergencyMode ? 0 : 5000,
            timeout: 10000,
          }
        );
      } catch (error) {
        handleLocationError(error as GeolocationPositionError);
      }
    };

    startLocationTracking();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [onLocationUpdate, isEmergencyMode, currentLocation]);

  return (
    <Card className="w-full h-[500px] bg-white/50 dark:bg-gray-800/30 overflow-hidden flex flex-col shadow-2xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl backdrop-blur-md">
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Location Tracker</h3>
          {isEmergencyMode && (
            <Badge variant="destructive" className="ml-2 animate-pulse">
              Emergency Mode Active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                          };
                          onLocationUpdate(location);
                          // Force map to center and zoom on current location
                          const mapElement = document.querySelector('[class*="map"]');
                          if (mapElement) {
                            mapElement.scrollIntoView({ behavior: 'smooth' });
                            // Trigger a resize event to ensure map renders correctly
                            window.dispatchEvent(new Event('resize'));
                          }
                        },
                        (error) => console.error("Error getting location:", error),
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                      );
                    }
                  }}
                >
                  <Locate className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Center on my location</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
          <GoogleMapComponent
            center={currentLocation}
            destination={destination}
            isEmergencyMode={isEmergencyMode}
            onLocationUpdate={(location) => {
              onLocationUpdate(location);
              // In a real app, this would update the location in the database
              console.log("Location updated:", location);
            }}
            markers={[]}
          />

          {/* Map overlay elements */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md max-w-xs border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Current Location</span>
            </div>
            {/* {destination && (
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-secondary" />
                <span className="text-sm">Destination: {destination.name}</span>
              </div>
            )} */}
          </div>

          {isEmergencyMode && (
            <div className="absolute top-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-3 rounded-lg shadow-md">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Emergency Mode Active
                </span>
              </div>
              <p className="text-xs text-red-500 mt-1">
                Location updates every 30 seconds
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LocationMap;
