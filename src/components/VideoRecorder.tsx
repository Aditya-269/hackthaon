import React, { useState, useRef, useEffect } from "react";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Play,
  Pause,
  Save,
  Trash2,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "./auth/AuthProvider";
import mediaRecorderService from "@/lib/mediaRecorder";
import { supabase } from "@/lib/supabase";

interface VideoRecorderProps {
  onRecordingComplete?: (filePath: string | null) => void;
  isEmergencyMode?: boolean;
  autoStart?: boolean;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onRecordingComplete,
  isEmergencyMode = false,
  autoStart = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, []);

  // Auto-start recording if in emergency mode
  useEffect(() => {
    if (autoStart || isEmergencyMode) {
      startRecording();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoStart, isEmergencyMode]);

  const startRecording = async () => {
    try {
      setErrorMessage(null);
      setRecordedBlob(null);

      // Reset video element
      if (videoRef.current) {
        videoRef.current.src = "";
        videoRef.current.srcObject = null;
        videoRef.current.controls = false;
      }

      const success = await mediaRecorderService.startRecording(
        videoEnabled,
        audioEnabled,
      );

      if (success) {
        setIsRecording(true);
        setRecordingTime(0);

        // Set up the timer
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);

        // Set the video stream to the video element
        if (videoRef.current && videoEnabled && mediaRecorderService.stream) {
          videoRef.current.srcObject = mediaRecorderService.stream;
          videoRef.current.muted = true; // Mute to prevent feedback
          videoRef.current
            .play()
            .catch((err) => console.error("Error playing video:", err));
        }
      } else {
        setErrorMessage("Failed to start recording");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      setErrorMessage("Error starting recording");
    }
  };

  const stopRecording = async () => {
    try {
      const blob = await mediaRecorderService.stopRecording();
      if (blob) {
        setRecordedBlob(blob);

        // Display the recorded video
        if (videoRef.current) {
          try {
            // Clear the srcObject first
            videoRef.current.srcObject = null;
            // Then set the src to the blob URL
            const url = URL.createObjectURL(blob);
            videoRef.current.src = url;
            videoRef.current.controls = true;
            videoRef.current.muted = false; // Unmute for playback
            videoRef.current.volume = 1.0; // Ensure volume is up

            // Force a reload of the video element
            videoRef.current.load();

            // Play after a short delay to ensure the video is loaded
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current
                  .play()
                  .catch((err) => console.error("Error playing video:", err));
              }
            }, 100);
          } catch (err) {
            console.error("Error setting up video playback:", err);
          }
        }

        // If in emergency mode, automatically upload the recording
        if (isEmergencyMode) {
          uploadRecording();
        }
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      setErrorMessage(
        "Error stopping recording: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const uploadRecording = async () => {
    if (!recordedBlob || !user) {
      setErrorMessage("No recording to upload or user not logged in");
      return;
    }

    try {
      setIsUploading(true);
      console.log(
        "Starting upload with blob size:",
        recordedBlob.size,
        "bytes",
      );
      console.log("User ID:", user.id);
      console.log("Is emergency mode:", isEmergencyMode);

      // Create a downloadable link for the recording
      const url = URL.createObjectURL(recordedBlob);
      const timestamp = new Date().toISOString();
      const fileType = recordedBlob.type.includes("audio") ? "audio" : "video";
      const fileName = `emergency-${fileType}-${timestamp}.${fileType === "audio" ? "mp3" : "webm"}`;

      // Create a download link
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Try to upload to Supabase as a backup
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

        // Try to upload directly to storage
        const supabaseFileName = `recordings/${user.id}/${fileType}-${timestamp}.${fileType === "audio" ? "mp3" : "webm"}`;
        console.log(
          "Attempting to upload to Supabase as backup:",
          supabaseFileName,
        );

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("recordings")
          .upload(supabaseFileName, recordedBlob, {
            contentType: recordedBlob.type,
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("Supabase upload error (backup only):", uploadError);
        } else {
          console.log("Backup upload to Supabase successful");
        }
      } catch (backupError) {
        console.error("Error in backup upload process:", backupError);
      }

      // Complete the process
      if (onRecordingComplete) {
        onRecordingComplete(fileName);
      }

      // Show success message
      setErrorMessage(null);
      alert("Recording has been downloaded to your device");
    } catch (error) {
      console.error("Error in recording process:", error);
      setErrorMessage(
        "Error processing recording: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="bg-white/50 dark:bg-gray-800/30 shadow-lg border border-gray-100/20 dark:border-gray-700/20 rounded-xl overflow-hidden backdrop-blur-md">
      <CardContent className="p-4 space-y-4">
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          {!recordedBlob ? (
            isRecording ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full text-white text-xs flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                  {formatTime(recordingTime)}
                </div>
                {/* Location indicator */}
                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded-md text-white text-xs flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-primary" />
                  Location tracking active
                </div>
              </>
            ) : (
              <div className="text-white flex flex-col items-center">
                <Video className="h-12 w-12 text-gray-500 mb-2" />
                <p>Ready to record</p>
              </div>
            )
          ) : (
            <video
              ref={videoRef}
              controls
              className="w-full h-full"
              playsInline
            ></video>
          )}
        </div>

        {errorMessage && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2">
            {!isRecording && !recordedBlob && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={videoEnabled ? "" : "bg-gray-200 dark:bg-gray-700"}
                >
                  {videoEnabled ? (
                    <Video className="h-4 w-4 mr-1" />
                  ) : (
                    <VideoOff className="h-4 w-4 mr-1" />
                  )}
                  {videoEnabled ? "Video On" : "Video Off"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={audioEnabled ? "" : "bg-gray-200 dark:bg-gray-700"}
                >
                  {audioEnabled ? (
                    <Mic className="h-4 w-4 mr-1" />
                  ) : (
                    <MicOff className="h-4 w-4 mr-1" />
                  )}
                  {audioEnabled ? "Audio On" : "Audio Off"}
                </Button>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {!isRecording && !recordedBlob && (
              <Button
                onClick={startRecording}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
              >
                <Play className="h-4 w-4 mr-1" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button onClick={stopRecording} variant="destructive">
                <Pause className="h-4 w-4 mr-1" />
                Stop Recording
              </Button>
            )}

            {recordedBlob && !isUploading && (
              <>
                <Button
                  onClick={uploadRecording}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Download Recording
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRecordedBlob(null);
                    if (videoRef.current) {
                      videoRef.current.src = "";
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Discard
                </Button>
              </>
            )}

            {isUploading && (
              <Button disabled>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoRecorder;
