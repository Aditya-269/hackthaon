import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, MapPin, Clock, Users } from "lucide-react";
import gsap from "gsap";

interface SafetyStatsProps {
  safetyScore?: number;
  safeZonesNearby?: number;
  responderTime?: string;
  trustedContacts?: number;
}

const SafetyStats = ({
  safetyScore = 85,
  safeZonesNearby = 3,
  responderTime = "4 mins",
  trustedContacts = 3,
}: SafetyStatsProps) => {
  const statsRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statsRef.current && scoreRef.current) {
      // Animate stats items
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
      );

      // Animate safety score
      gsap.fromTo(
        scoreRef.current,
        { innerText: 0 },
        {
          innerText: safetyScore,
          duration: 1.5,
          ease: "power2.out",
          snap: { innerText: 1 },
        },
      );
    }
  }, [safetyScore]);

  // Determine safety score color
  const getSafetyScoreColor = () => {
    if (safetyScore >= 80) return "text-green-500 dark:text-green-400";
    if (safetyScore >= 60) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  return (
    <Card className="bg-white/50 dark:bg-gray-800/30 shadow-2xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Safety Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200 dark:text-gray-700 stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <circle
                className={`${safetyScore >= 80 ? "text-green-500 dark:text-green-400" : safetyScore >= 60 ? "text-yellow-500 dark:text-yellow-400" : "text-red-500 dark:text-red-400"} stroke-current`}
                strokeWidth="10"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * safetyScore) / 100}
                transform="rotate(-90 50 50)"
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <div
                className={`text-3xl font-bold ${getSafetyScoreColor()}`}
                ref={scoreRef}
              >
                {safetyScore}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Safety Score
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4" ref={statsRef}>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex flex-col items-center">
            <MapPin className="h-5 w-5 text-blue-500 mb-1" />
            <div className="text-xl font-semibold">{safeZonesNearby}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Safe Zones Nearby
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex flex-col items-center">
            <Clock className="h-5 w-5 text-amber-500 mb-1" />
            <div className="text-xl font-semibold">{responderTime}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Responder ETA
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex flex-col items-center col-span-2">
            <Users className="h-5 w-5 text-green-500 mb-1" />
            <div className="text-xl font-semibold">{trustedContacts}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Trusted Contacts
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyStats;
