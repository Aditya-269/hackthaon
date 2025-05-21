import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth/AuthProvider";
import SOSButton from "./SOSButton";
import EmergencyPanel from "./EmergencyPanel";
import SafeRouteCard from "./SafeRouteCard";
import LocationMap from "./LocationMap";
import StatusBar from "./StatusBar";
import TrustedContactsList from "./TrustedContactsList";
import AnimatedSafetyTips from "./AnimatedSafetyTips";
import { sendEmergencySMSToContacts } from "@/lib/twilioService";
import { supabase } from "@/lib/supabase";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [journeyActive, setJourneyActive] = useState(false);
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [safetyStatus, setSafetyStatus] = useState<"safe" | "caution" | "danger">("safe");
  const [contacts, setContacts] = useState<any[]>([]);
  const { user } = useAuth();
  const mainRef = useRef<HTMLElement>(null);
  const emergencyPanelRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Home: Got current location:", position.coords);
        },
        (error) => {
          console.error("Home: Error getting current location:", error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }
  }, [emergencyMode]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.from("trusted_contacts").select("*").eq("user_id", user.id);
          if (error) throw error;
          setContacts(data || []);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      }
    };
    fetchContacts();
  }, [user]);

  const handleSOSActivate = () => {
    setEmergencyMode(true);
    setSafetyStatus("danger");
    if (user) {
      sendEmergencySMSToContacts(user.id, "EMERGENCY ALERT: I need help!",{ lat: 12.836559196847052, lng:  77.65709306836929 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main ref={mainRef} className="flex-1 container mx-auto px-4 py-6">
        {emergencyMode && (
          <div ref={emergencyPanelRef} className="mb-8">
            <EmergencyPanel isActive={emergencyMode} onMarkSafe={() => setEmergencyMode(false)} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div ref={leftColumnRef} className="flex flex-col space-y-6">
            <SOSButton isActive={emergencyMode} onActivate={handleSOSActivate} onDeactivate={() => setEmergencyMode(false)} />
            <TrustedContactsList contacts={contacts} />
          </div>

          {/* Right Column */}
          <div ref={rightColumnRef} className="lg:col-span-2 space-y-6">
            <LocationMap />
            <AnimatedSafetyTips />
          </div>
        </div>
      </main>

      <StatusBar isEmergencyActive={emergencyMode} journeyProgress={journeyProgress} currentLocation="Downtown, Main Street" />
    </div>
  );
};

export default Home;
