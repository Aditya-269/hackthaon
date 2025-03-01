import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { AlertCircle, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { sendEmergencySMSToContacts } from "@/lib/twilioService";
import { makeEmergencyCallToNumber } from "@/lib/twilioDirectCall";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./auth/AuthProvider";

interface SOSButtonProps {
  isActive?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  size?: "default" | "large" | "small";
  className?: string;
}

const SOSButton = ({
  isActive = false,
  onActivate = () => {},
  onDeactivate = () => {},
  size = "large",
  className = "",
}: SOSButtonProps) => {
  const [active, setActive] = useState(isActive);
  const [pulsing, setPulsing] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const { user } = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const locationWatchId = useRef<number | null>(null);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  // Fetch trusted contacts
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
            setContacts(data);
          }
        } catch (error) {
          console.error("Error fetching contacts:", error);
          // Fallback data
          setContacts([
            { name: "Emergency Contact 1", phone: "+1234567890" },
            { name: "Emergency Contact 2", phone: "+0987654321" },
          ]);
        }
      } else {
        // Fallback data for development
        setContacts([
          { name: "Emergency Contact 1", phone: "+1234567890" },
          { name: "Emergency Contact 2", phone: "+0987654321" },
        ]);
      }
    };

    fetchContacts();
  }, [user]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      };

      console.log("SOSButton: Getting current location");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("SOSButton: Got current location:", location);
          setUserLocation(location);
        },
        (error) => {
          console.error("SOSButton: Error getting current location:", error);
        },
        options,
      );
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let audio: HTMLAudioElement | null = null;

    if (active) {
      // Play siren sound when activated
      audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3",
      );
      audio.loop = true;
      audio.play();

      interval = setInterval(() => {
        setPulsing((prev) => !prev);
      }, 1000);

      // Start tracking location with high accuracy
      if (navigator.geolocation && !locationWatchId.current) {
        const options = {
          enableHighAccuracy: true,
          maximumAge: 0, // Don't use cached positions in emergency mode
          timeout: 10000,
        };

        console.log("SOSButton: Starting emergency location tracking");
        locationWatchId.current = navigator.geolocation.watchPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log("SOSButton: Emergency location update:", newLocation);
            setUserLocation(newLocation);

            // Send location updates to emergency contacts every 30 seconds
            if (user) {
              console.log("SOSButton: Sending location update to contacts");
              sendEmergencySMSToContacts(
                user.id,
                "EMERGENCY ALERT: I need help! This is my current location:",
                newLocation,
              )
                .then((response) => {
                  if (response.success) {
                    console.log("Alert sent to contacts successfully");
                    if (response.results) {
                      const contactCount = response.results.length;
                      console.log(`Alert sent to ${contactCount} contacts`);
                    }
                  }
                })
                .catch((err) =>
                  console.error("Error sending emergency SMS:", err),
                );
            }
          },
          (error) => {
            console.error("SOSButton: Error watching position:", error);
          },
          options,
        );
        console.log(
          "SOSButton: Location watch ID set:",
          locationWatchId.current,
        );
      }

      // Add animation when activated
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.5)",
          repeat: -1,
          yoyo: true,
          duration: 1,
        });
      }

      // Animate status text
      if (statusRef.current) {
        gsap.fromTo(
          statusRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
        );
      }
    } else {
      setPulsing(false);

      // Clear animations when deactivated
      if (buttonRef.current) {
        gsap.killTweensOf(buttonRef.current);
        gsap.to(buttonRef.current, {
          scale: 1,
          boxShadow: "none",
          duration: 0.3,
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
      if (buttonRef.current) {
        gsap.killTweensOf(buttonRef.current);
      }
      if (audio) {
        audio.pause();
        audio = null;
      }
      // Clear location tracking
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
        locationWatchId.current = null;
      }
    };
  }, [active]);

  // Initial animation
  useEffect(() => {
    if (containerRef.current && buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      );
    }
  }, []);

  const handleClick = async () => {
    // Start video recording automatically when SOS is activated
    const startEmergencyRecording = async () => {
      try {
        // First, try to create the bucket directly
        try {
          console.log("Ensuring recordings bucket exists");
          const { error: createBucketError } =
            await supabase.storage.createBucket("recordings", {
              public: true,
              fileSizeLimit: 50000000, // 50MB
            });

          if (createBucketError) {
            console.log("Bucket may already exist:", createBucketError.message);
          } else {
            console.log("Created recordings bucket");
          }
        } catch (bucketError) {
          console.log("Error with bucket creation:", bucketError);
        }

        // Import dynamically to avoid circular dependencies
        const mediaRecorderService = (await import("@/lib/mediaRecorder"))
          .default;
        if (!mediaRecorderService.isCurrentlyRecording()) {
          await mediaRecorderService.startRecording(true, true);
          console.log("Emergency recording started automatically");
          // Remove alert notification
          console.log("Emergency recording started");
        }
      } catch (error) {
        console.error("Failed to start emergency recording:", error);
      }
    };

    // Function to stop recording and download when SOS is deactivated
    const stopEmergencyRecording = async () => {
      try {
        // Import dynamically to avoid circular dependencies
        const mediaRecorderService = (await import("@/lib/mediaRecorder"))
          .default;
        if (mediaRecorderService.isCurrentlyRecording()) {
          const blob = await mediaRecorderService.stopRecording();
          if (blob && user) {
            // Create a downloadable link for the recording
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString();
            const fileType = blob.type.includes("audio") ? "audio" : "video";
            const fileName = `emergency-${fileType}-${timestamp}.${fileType === "audio" ? "mp3" : "webm"}`;

            // Create a download link
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            console.log("Emergency recording downloaded");
            console.log(
              "Emergency recording has been downloaded to your device.",
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to stop and download emergency recording:",
          error,
        );
      }
    };

    if (buttonRef.current) {
      // Click animation
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        onComplete: () => {
          gsap.to(buttonRef.current, {
            scale: active ? 1 : 1.05,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        },
      });
    }

    if (active) {
      setActive(false);
      onDeactivate();

      // Stop recording and download the file
      stopEmergencyRecording();

      // Stop location tracking
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
        locationWatchId.current = null;
      }

      // In a real implementation with Supabase:
      // const { user } = useAuth();
      // if (user) {
      //   try {
      //     // Get the active emergency event
      //     const { data: eventData } = await supabase
      //       .from('emergency_events')
      //       .select('*')
      //       .eq('user_id', user.id)
      //       .eq('status', 'active')
      //       .single();
      //
      //     if (eventData) {
      //       // Mark the emergency as resolved
      //       await supabase
      //         .from('emergency_events')
      //         .update({
      //           status: 'resolved',
      //           resolved_at: new Date().toISOString()
      //         })
      //         .eq('id', eventData.id);
      //     }
      //   } catch (error) {
      //     console.error('Error resolving emergency:', error);
      //   }
      // }
    } else {
      setActive(true);
      onActivate();

      // Start emergency recording
      startEmergencyRecording();

      // Send initial emergency alert directly from database
      if (userLocation && user) {
        // Send SMS to all contacts
        sendEmergencySMSToContacts(
          user.id,
          "EMERGENCY ALERT: I need help! This is my current location:",
          userLocation,
        ).catch((err) => console.error("Error sending emergency SMS:", err));

        // Make a direct call to one specific emergency number automatically
        const emergencyNumber = "+918917483689"; // Hardcoded emergency number
        // Call immediately without waiting for user interaction
        // Using a longer delay to ensure browser doesn't block it
        setTimeout(() => {
          console.log("Initiating emergency call now...");
          makeEmergencyCallToNumber(emergencyNumber)
            .then((result) => {
              if (result.success) {
                console.log(
                  "Emergency call automatically initiated to",
                  emergencyNumber,
                );
              }
            })
            .catch((err) => console.error("Error making emergency call:", err));
        }, 1500); // Longer delay to ensure other operations complete first
      }

      // In a real implementation with Supabase:
      // const { user } = useAuth();
      // if (user && navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(async (position) => {
      //     try {
      //       // Create a new emergency event
      //       const { data: eventData, error } = await supabase
      //         .from('emergency_events')
      //         .insert([{
      //           user_id: user.id,
      //           status: 'active',
      //           location: {
      //             lat: position.coords.latitude,
      //             lng: position.coords.longitude
      //           }
      //         }])
      //         .select();
      //
      //       if (error) throw error;
      //
      //       // Add initial location update
      //       if (eventData && eventData[0]) {
      //         await supabase
      //           .from('location_updates')
      //           .insert([{
      //             emergency_event_id: eventData[0].id,
      //             latitude: position.coords.latitude,
      //             longitude: position.coords.longitude,
      //             accuracy: position.coords.accuracy
      //           }]);
      //       }
      //     } catch (error) {
      //       console.error('Error creating emergency event:', error);
      //     }
      //   });
      // }
    }
  };

  const sizeClasses = {
    small: "h-24 w-24 text-lg",
    default: "h-36 w-36 text-xl",
    large: "h-48 w-48 text-2xl",
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-xl",
        className,
      )}
    >
      <Button
        ref={buttonRef}
        className={cn(
          "rounded-full transition-all duration-300 flex flex-col items-center justify-center gap-2 border-4",
          sizeClasses[size],
          active
            ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-2xl dark:from-red-700 dark:to-red-600 dark:hover:from-red-800 dark:hover:to-red-700 border-red-400/50 dark:border-red-500/50"
            : "bg-gradient-to-br from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-2xl dark:from-primary dark:via-primary/90 dark:to-primary/80 dark:hover:from-primary/90 dark:hover:via-primary/80 dark:hover:to-primary/70 border-primary/30 dark:border-primary/30",
          pulsing && "scale-105 shadow-xl",
        )}
        onClick={handleClick}
      >
        {active ? (
          <>
            <AlertTriangle className="h-10 w-10" />
            <span>ACTIVE</span>
          </>
        ) : (
          <>
            <ShieldAlert className="h-10 w-10" />
            <span>SOS</span>
          </>
        )}
      </Button>

      {active && (
        <div
          ref={statusRef}
          className="mt-4 flex items-center text-red-600 dark:text-red-400 animate-pulse"
        >
          <AlertCircle className="mr-2 h-5 w-5" />
          <span className="font-semibold">Emergency Mode Active</span>
        </div>
      )}

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {active
          ? "Press to deactivate emergency mode"
          : "Press for emergency assistance"}
      </p>
    </div>
  );
};

export default SOSButton;
