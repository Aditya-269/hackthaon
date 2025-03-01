import React from "react";
import { Button } from "./ui/button";
import {
  Phone,
  Video,
  MessageCircle,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { sendEmergencySMSToContacts } from "@/lib/twilioService";
import { useAuth } from "./auth/AuthProvider";

interface EmergencyQuickActionsProps {
  onCallEmergency?: () => void;
  onVideoRecord?: () => void;
  onSendAlert?: () => void;
  onCallTrusted?: () => void;
  contacts?: any[];
  userLocation?: { lat: number; lng: number } | null;
}

const EmergencyQuickActions = ({
  onCallEmergency = () => {
    // Default implementation: call emergency services
    window.open("tel:911", "_self");
  },
  onVideoRecord = () => {},
  onSendAlert = () => {},
  onCallTrusted = () => {},
  contacts = [],
  userLocation = null,
}: EmergencyQuickActionsProps) => {
  const buttonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.95 },
  };

  const { user } = useAuth();

  const handleSendAlert = async () => {
    // Call the provided callback
    onSendAlert();

    // Get the most current location
    let currentLocation = userLocation;

    // Try to get the most up-to-date location
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });
          },
        );

        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log("Got fresh location for alert:", currentLocation);
      } catch (err) {
        console.warn(
          "Could not get fresh location, using last known location",
          err,
        );
      }
    }

    // Send alert to emergency contacts if we have location and user is logged in
    if (currentLocation && user) {
      try {
        const response = await sendEmergencySMSToContacts(
          user.id,
          "ALERT: I'm feeling unsafe. Please check on me. This is my current location:",
          currentLocation,
        );

        if (response.success && response.results) {
          console.log("Alert sent to contacts with location:", currentLocation);
          const contactCount = response.results.length;

          // Show confirmation to user
          alert(
            `Alert sent to ${contactCount} contacts with your current location.`,
          );
        } else {
          throw new Error("Failed to send alerts");
        }
      } catch (error) {
        console.error("Error sending alert to contacts:", error);
        alert("Failed to send alert. Please try again.");
      }
    } else {
      console.log("Cannot send alert: missing location or user not logged in");
      alert(
        "Cannot send alert: missing location data or you're not logged in.",
      );
    }
  };

  const handleCallTrusted = () => {
    // Call the provided callback
    onCallTrusted();

    // If we have contacts, call the first one
    if (contacts && contacts.length > 0 && contacts[0].phone) {
      window.open(`tel:${contacts[0].phone}`, "_self");
    } else {
      console.log("No trusted contacts available to call");
    }
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-100/20 dark:border-gray-700/20 backdrop-blur-md bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center bg-blend-overlay">
      <div className="flex items-center mb-4">
        <Shield className="h-5 w-5 text-white mr-2" />
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={onCallEmergency}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white flex items-center justify-center gap-2 h-16 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 backdrop-blur-sm"
          >
            <Phone className="h-5 w-5" />
            <span>Call Emergency</span>
          </Button>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={onVideoRecord}
            className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white flex items-center justify-center gap-2 h-16 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 backdrop-blur-sm"
          >
            <Video className="h-5 w-5" />
            <span>Record Video</span>
          </Button>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSendAlert}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white flex items-center justify-center gap-2 h-16 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 backdrop-blur-sm"
          >
            <AlertTriangle className="h-5 w-5" />
            <span>Send Alert</span>
          </Button>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleCallTrusted}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white flex items-center justify-center gap-2 h-16 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 backdrop-blur-sm"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Message Contact</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyQuickActions;
