import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth/AuthProvider";
import Header from "./Header";
import SOSButton from "./SOSButton";
import EmergencyPanel from "./EmergencyPanel";
import SafeRouteCard from "./SafeRouteCard";
import LocationMap from "./LocationMap";
import StatusBar from "./StatusBar";
import TrustedContactsList from "./TrustedContactsList";
import AnimatedSafetyTips from "./AnimatedSafetyTips";
import EmergencyQuickActions from "./EmergencyQuickActions";
import { sendEmergencySMSToContacts } from "@/lib/twilioService";
import SafetyStats from "./SafetyStats";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [journeyActive, setJourneyActive] = useState(false);
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [safetyStatus, setSafetyStatus] = useState<
    "safe" | "caution" | "danger"
  >("safe");
  const [contacts, setContacts] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 12.838475234898915, lng:  77.65813207194557  });
  const { user } = useAuth();

  const mainRef = useRef<HTMLElement>(null);
  const emergencyPanelRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      };

      console.log("Home: Getting current location");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Home: Got current location:", location);
          setCurrentLocation(location);
        },
        (error) => {
          console.error("Home: Error getting current location:", error);
        },
        options,
      );

      // Set up location tracking
      console.log("Home: Setting up location tracking");
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const updatedLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Home: Location update:", updatedLocation);
          setCurrentLocation(updatedLocation);
        },
        (error) => {
          console.error("Home: Error watching position:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: emergencyMode ? 0 : 5000,
          timeout: 10000,
        },
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [emergencyMode]);

  // Fetch trusted contacts when component mounts
  useEffect(() => {
    const fetchContacts = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("trusted_contacts")
            .select("*")
            .eq("user_id", user.id);

          if (error) throw error;

          if (data) {
            // Transform the data to match our Contact interface
            const formattedContacts = data.map((contact) => ({
              id: contact.id,
              name: contact.name,
              phone: contact.phone,
              relationship: contact.relationship || "Friend",
              avatar:
                contact.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`,
              status: contact.status || "offline",
            }));
            setContacts(formattedContacts);
          }
        } catch (error) {
          console.error("Error fetching contacts:", error);
          setContacts([]);
        }
      } else {
        // Fallback data for development/testing
        setContacts([
          {
            id: "1",
            name: "Mom",
            phone: "+1 (555) 123-4567",
            relationship: "Family",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mom",
            status: "online",
          },
          {
            id: "2",
            name: "Dad",
            phone: "+1 (555) 987-6543",
            relationship: "Family",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dad",
            status: "offline",
          },
        ]);
      }
    };

    fetchContacts();
  }, [user]);

  useEffect(() => {
    // Initialize GSAP animations
    if (mainRef.current && leftColumnRef.current && rightColumnRef.current) {
      // Main content fade in
      gsap.fromTo(
        mainRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" },
      );

      // Left column elements animation
      gsap.fromTo(
        leftColumnRef.current.children,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)",
          delay: 0.3,
        },
      );

      // Right column elements animation
      gsap.fromTo(
        rightColumnRef.current.children,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)",
          delay: 0.5,
        },
      );

      // Set up scroll animations
      const sections = rightColumnRef.current.children;
      Array.from(sections).forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom-=100",
          onEnter: () => {
            gsap.to(section, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          },
          once: true,
        });
      });
    }
  }, []);

  // Emergency panel animation when it appears/disappears
  useEffect(() => {
    if (emergencyPanelRef.current) {
      if (emergencyMode) {
        gsap.fromTo(
          emergencyPanelRef.current,
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
        );
      }
    }
  }, [emergencyMode]);

  const handleSOSActivate = () => {
    setEmergencyMode(true);
    setSafetyStatus("danger");

    // Send emergency alert to all contacts
    if (currentLocation && user) {
      sendEmergencySMSToContacts(
        user.id,
        "EMERGENCY ALERT: I need help! This is my current location:",
        currentLocation,
      ).catch((err) => console.error("Error sending emergency SMS:", err));
    }
  };

  const handleSOSDeactivate = () => {
    if (emergencyPanelRef.current) {
      gsap.to(emergencyPanelRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        onComplete: () => {
          setEmergencyMode(false);
          setSafetyStatus("safe");
        },
      });
    } else {
      setEmergencyMode(false);
      setSafetyStatus("safe");
    }
  };

  const handleRouteSelect = (route: any) => {
    setSelectedRoute(route.id);
    setJourneyActive(true);
    // Simulate journey progress
    setJourneyProgress(5);
    const interval = setInterval(() => {
      setJourneyProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setJourneyActive(false);
          return 0;
        }
        return prev + 5;
      });
    }, 10000);
  };

  const handleMarkSafe = () => {
    handleSOSDeactivate();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-pink-50/20 to-pink-100/30 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800/90 flex flex-col">
      <Header />

      <main
        ref={mainRef}
        className="flex-1 container mx-auto px-4 py-6 space-y-8"
      >
        {/* Emergency Panel - shown only when emergency mode is active */}
        {emergencyMode && (
          <div ref={emergencyPanelRef} className="mb-8">
            <EmergencyPanel
              isActive={emergencyMode}
              onMarkSafe={handleMarkSafe}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div ref={leftColumnRef} className="flex flex-col space-y-6">
            {/* SOS Button */}
            <div
              className={cn(
                "flex justify-center items-center p-6 bg-white/50 dark:bg-gray-800/30 rounded-3xl shadow-2xl transition-all duration-300 border border-transparent backdrop-blur-md",
                emergencyMode
                  ? "bg-red-50/60 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50"
                  : "hover:border-primary/10 dark:hover:border-primary/10 hover:shadow-2xl hover:scale-[1.05] hover:bg-white/60 dark:hover:bg-gray-800/40",
              )}
            >
              <SOSButton
                isActive={emergencyMode}
                onActivate={handleSOSActivate}
                onDeactivate={handleSOSDeactivate}
              />
            </div>

            {/* Emergency Quick Actions */}
            <div className="flex flex-col space-y-6">
              <TrustedContactsList contacts={contacts} />
            </div>

            {/* Trusted Contacts List is now moved above */}
          </div>

          {/* Right Column - Map and Status */}
          <div ref={rightColumnRef} className="lg:col-span-2 space-y-6">
            <LocationMap
              isEmergencyMode={emergencyMode}
              onRouteSelect={(routeId) => {
                // Handle route selection from map
                console.log("Selected route from map:", routeId);
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <AnimatedSafetyTips />
            </div>
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <StatusBar
        isEmergencyActive={emergencyMode}
        journeyProgress={journeyProgress}
        currentLocation="Downtown, Main Street"
        estimatedArrival={journeyActive ? "15:45" : "--:--"}
        safetyStatus={safetyStatus}
      />
    </div>
  );
};

export default Home;
