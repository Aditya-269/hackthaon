import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import gsap from "gsap";

interface StatusBarProps {
  isEmergencyActive?: boolean;
  journeyProgress?: number;
  currentLocation?: string;
  estimatedArrival?: string;
  safetyStatus?: "safe" | "caution" | "danger";
}

const StatusBar = ({
  isEmergencyActive = false,
  journeyProgress = 0,
  currentLocation = "Unknown Location",
  estimatedArrival = "--:--",
  safetyStatus = "safe",
}: StatusBarProps) => {
  const [expanded, setExpanded] = useState(false);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const statusColors = {
    safe: "bg-green-500",
    caution: "bg-yellow-500",
    danger: "bg-red-500",
  };

  const statusTextColors = {
    safe: "text-green-500 dark:text-green-400",
    caution: "text-yellow-500 dark:text-yellow-400",
    danger: "text-red-500 dark:text-red-400",
  };

  useEffect(() => {
    // Initial animation for status bar
    if (statusBarRef.current) {
      gsap.fromTo(
        statusBarRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.8 },
      );
    }
  }, []);

  // Animation for expanded details
  useEffect(() => {
    if (detailsRef.current) {
      if (expanded) {
        gsap.fromTo(
          detailsRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" },
        );
      } else {
        gsap.to(detailsRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [expanded]);

  // Progress bar animation
  useEffect(() => {
    if (progressRef.current && journeyProgress > 0) {
      gsap.fromTo(
        progressRef.current,
        { width: "0%" },
        { width: `${journeyProgress}%`, duration: 1, ease: "power2.out" },
      );
    }
  }, [journeyProgress]);

  const renderStatusIcon = () => {
    switch (safetyStatus) {
      case "safe":
        return (
          <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
        );
      case "caution":
        return (
          <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
        );
      case "danger":
        return (
          <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
        );
      default:
        return (
          <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
        );
    }
  };

  return (
    <div
      ref={statusBarRef}
      className={`fixed bottom-0 left-0 right-0 bg-white/60 dark:bg-gray-900/60 border-t border-gray-200/20 dark:border-gray-800/20 shadow-lg transition-all duration-300 z-50 backdrop-blur-xl`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`p-2 rounded-full ${statusColors[safetyStatus]} transition-all duration-300 hover:scale-110 cursor-pointer`}
                  >
                    {renderStatusIcon()}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="dark:bg-gray-800 dark:border-gray-700">
                  <p className="dark:text-white">Current Safety Status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div>
              <p className="text-sm font-medium dark:text-white">
                Status:
                <span className={`ml-1 ${statusTextColors[safetyStatus]}`}>
                  {safetyStatus.charAt(0).toUpperCase() + safetyStatus.slice(1)}
                </span>
              </p>
            </div>
          </div>

          {journeyProgress > 0 && (
            <div className="flex-1 mx-4">
              <div className="flex justify-between text-xs mb-1 dark:text-gray-300">
                <span>Journey Progress</span>
                <span>{journeyProgress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  ref={progressRef}
                  className={`h-full ${safetyStatus === "safe" ? "bg-green-500" : safetyStatus === "caution" ? "bg-yellow-500" : "bg-red-500"} rounded-full`}
                  style={{ width: `${journeyProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isEmergencyActive && (
              <Badge
                variant="destructive"
                className="animate-pulse dark:bg-red-700 dark:text-white"
              >
                Emergency Mode Active - Contacts Notified
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-xs flex items-center gap-1 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {expanded ? (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Details
                </>
              )}
            </Button>
          </div>
        </div>

        <div
          ref={detailsRef}
          className={`overflow-hidden ${expanded ? "mt-4" : "h-0 opacity-0"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm dark:text-gray-200">
                {currentLocation}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm dark:text-gray-200">
                ETA: {estimatedArrival}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm dark:text-gray-200">
                {isEmergencyActive ? "Emergency Mode Active" : "Normal Mode"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
