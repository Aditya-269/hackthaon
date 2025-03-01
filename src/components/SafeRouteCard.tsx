import React, { useState } from "react";
import { MapPin, Navigation, Shield, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Route {
  id: string;
  name: string;
  duration: string;
  safety: number;
  lighting: string;
}

interface SafeRouteCardProps {
  onRouteSelect?: (route: Route) => void;
  suggestedRoutes?: Route[];
  isLoading?: boolean;
}

const SafeRouteCard = ({
  onRouteSelect = () => {},
  suggestedRoutes = [
    {
      id: "1",
      name: "Main Street Route",
      duration: "15 mins",
      safety: 95,
      lighting: "Well lit",
    },
    {
      id: "2",
      name: "Park Avenue",
      duration: "20 mins",
      safety: 90,
      lighting: "Mostly lit",
    },
    {
      id: "3",
      name: "University Way",
      duration: "25 mins",
      safety: 85,
      lighting: "Partially lit",
    },
  ],
  isLoading = false,
}: SafeRouteCardProps) => {
  const [destination, setDestination] = useState("");
  const [showRoutes, setShowRoutes] = useState(false);

  const handleSearch = () => {
    if (destination.trim()) {
      setShowRoutes(true);
      // In a real implementation, this would fetch routes based on the destination
    }
  };

  const handleRouteSelect = (route: Route) => {
    onRouteSelect(route);
  };

  // Function to render safety indicator based on safety score
  const renderSafetyIndicator = (safety: number) => {
    let bgColor = "";
    if (safety >= 90) bgColor = "bg-green-500";
    else if (safety >= 75) bgColor = "bg-yellow-500";
    else bgColor = "bg-red-500";

    return (
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${bgColor}`}></div>
        <span>{safety}% Safe</span>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-[450px] bg-white/50 dark:bg-gray-800/30 shadow-2xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Safe Route Planner
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Find the safest route to your destination
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Fix: Wrap Input in a container with an absolute-positioned icon */}
          <div className="flex gap-2">
            <div className="relative flex items-center w-full">
              <MapPin className="absolute left-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Enter your destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 flex-1" // Add left padding to prevent overlap
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {showRoutes && (
            <div className="space-y-3 mt-4">
              <h4 className="text-sm font-medium">Suggested Safe Routes:</h4>
              {suggestedRoutes.map((route) => (
                <div
                  key={route.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRouteSelect(route)}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{route.name}</div>
                    {renderSafetyIndicator(route.safety)}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {route.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {route.lighting}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" className="text-xs">
          <Navigation className="h-3 w-3 mr-1" />
          View on Map
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SafeRouteCard;
