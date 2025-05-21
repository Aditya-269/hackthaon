import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  MapPin,
  Clock,
  X,
} from "lucide-react";

interface Contact {
  name: string;
  status: "Not-Delivered" | "delivered" ;
}

interface EmergencyPanelProps {
  isActive?: boolean;
  contacts?: Contact[];
  recordingActive?: boolean;
  locationUpdates?: number;
  elapsedTime?: number;
  onMarkSafe?: () => void;
}

const EmergencyPanel = ({
  isActive = true,
  contacts = [
    { name: "Vedant", status: "Not-Delivered" },
    { name: "Aditya", status: "delivered" },
  ],
  recordingActive = true,
  locationUpdates = 5,
  elapsedTime = 120, // seconds
  onMarkSafe = () => {},
}: EmergencyPanelProps) => {
  const [videoRecording, setVideoRecording] = useState(recordingActive);
  const [audioRecording, setAudioRecording] = useState(recordingActive);

  // Format elapsed time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate percentage of contacts that have seen the alert
  const alertProgress = () => {
    const seen = contacts.filter((c) => c.status === "delivered").length;
    return (seen / contacts.length) * 100;
  };

  return (
    <Card className="w-full max-w-[1400px] mx-auto bg-red-50/60 dark:bg-red-900/20 border-red-300/40 dark:border-red-700/40 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
      <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 dark:from-red-800 dark:to-red-700 text-white rounded-t-3xl flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          <CardTitle className="text-xl">EMERGENCY MODE ACTIVE</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-white text-red-500 px-3 py-1">
          <Clock className="h-4 w-4 mr-1" />
          {formatTime(elapsedTime)}
        </Badge>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            Location Updates
          </h3>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Sending location every 30 seconds
              </span>
              <Badge
                variant="outline"
                className="border-green-500 text-green-700"
              >
                Active
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Last update: Just now
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {locationUpdates} updates sent
            </p>
          </div>

          <h3 className="font-semibold text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-red-500" />
            Alert Status
          </h3>
          <div className="space-y-3">
            <Progress value={alertProgress()} className="h-2 bg-red-200" />
            <div className="grid grid-cols-2 gap-2">
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-red-200 dark:border-red-700 flex justify-between items-center"
                >
                  <span>{contact.name}</span>
                  <Badge
                    variant={
                      contact.status === "delivered" ? "default" : "secondary"
                    }
                    className={
                      contact.status === "delivered"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }
                  >
                    {contact.status === "delivered"
                      ? "Delivered"
                      : "Sent"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            {videoRecording ? (
              <Video className="h-5 w-5 text-red-500" />
            ) : (
              <VideoOff className="h-5 w-5 text-gray-500" />
            )}
            Recording Status
          </h3>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-700 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {videoRecording ? (
                  <Video className="h-5 w-5 text-red-500" />
                ) : (
                  <VideoOff className="h-5 w-5 text-gray-500" />
                )}
                <span>Video Recording</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVideoRecording(!videoRecording)}
                className={
                  videoRecording
                    ? "border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "border-gray-300 text-gray-500"
                }
              >
                {videoRecording ? "Stop & Download" : "Start"}
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {audioRecording ? (
                  <Mic className="h-5 w-5 text-red-500" />
                ) : (
                  <MicOff className="h-5 w-5 text-gray-500" />
                )}
                <span>Audio Recording</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioRecording(!audioRecording)}
                className={
                  audioRecording
                    ? "border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "border-gray-300 text-gray-500"
                }
              >
                {audioRecording ? "Stop" : "Start"}
              </Button>
            </div>
          </div>

          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-500" />
            Emergency Contacts
          </h3>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              All emergency contacts have been notified of your situation.
            </p>
            <Button
              variant="outline"
              className="w-full border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Call Emergency Contact
            </Button>
          </div>
        </div>
      </CardContent>

      
    </Card>
  );
};

export default EmergencyPanel;