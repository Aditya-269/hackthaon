import { supabase } from "./supabase";

interface RecordingOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  maxDurationMs?: number;
}

export class MediaRecorderService {
  mediaRecorder: MediaRecorder | null = null;
  stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private isRecording = false;
  private recordingStartTime: number = 0;
  private recordingTimer: NodeJS.Timeout | null = null;
  private options: RecordingOptions;
  private locationWatchId: number | null = null;
  private currentLocation: { lat: number; lng: number } | null = null;

  constructor(options: RecordingOptions = {}) {
    // Check for supported MIME types
    let supportedMimeType = "video/webm";

    if (typeof MediaRecorder !== "undefined") {
      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) {
        supportedMimeType = "video/webm;codecs=vp9,opus";
      } else if (MediaRecorder.isTypeSupported("video/webm")) {
        supportedMimeType = "video/webm";
      } else if (MediaRecorder.isTypeSupported("video/mp4")) {
        supportedMimeType = "video/mp4";
      }
    }

    this.options = {
      mimeType: options.mimeType || supportedMimeType,
      videoBitsPerSecond: options.videoBitsPerSecond || 2500000,
      audioBitsPerSecond: options.audioBitsPerSecond || 128000,
      maxDurationMs: options.maxDurationMs || 5 * 60 * 1000, // 5 minutes by default
    };
    console.log("Using MIME type:", this.options.mimeType);

    // Initialize location tracking
    this.startLocationTracking();
  }

  // Start tracking user's location
  private startLocationTracking() {
    if (navigator.geolocation && !this.locationWatchId) {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0, // Don't use cached positions
        timeout: 10000,
      };

      console.log("MediaRecorder: Starting location tracking");
      this.locationWatchId = navigator.geolocation.watchPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("MediaRecorder: Updated location:", this.currentLocation);
        },
        (error) => {
          console.error("MediaRecorder: Error tracking location:", error);
        },
        options,
      );

      // Also get a one-time high accuracy position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log(
            "MediaRecorder: Got precise location:",
            this.currentLocation,
          );
        },
        (error) => {
          console.error(
            "MediaRecorder: Error getting precise position:",
            error,
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    }
  }

  // Stop tracking user's location
  private stopLocationTracking() {
    if (this.locationWatchId !== null) {
      navigator.geolocation.clearWatch(this.locationWatchId);
      this.locationWatchId = null;
    }
  }

  // Get current location
  getCurrentLocation(): { lat: number; lng: number } | null {
    return this.currentLocation;
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  async startRecording(
    videoEnabled = true,
    audioEnabled = true,
  ): Promise<boolean> {
    console.log(
      `Starting recording with video: ${videoEnabled}, audio: ${audioEnabled}`,
    );
    try {
      // Clean up any existing recording first
      if (this.isRecording) {
        console.warn("Recording is already in progress, stopping it first");
        await this.stopRecording();
      }

      // Reset state
      this.chunks = [];
      this.isRecording = false;
      this.recordingStartTime = 0;

      // Stop any existing stream
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
      }

      // Ensure location tracking is active
      this.startLocationTracking();

      // Set up media constraints
      const constraints: MediaStreamConstraints = {
        video: videoEnabled
          ? {
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }
          : false,
        audio: audioEnabled
          ? {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : false,
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Create MediaRecorder instance
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.options.mimeType,
        videoBitsPerSecond: videoEnabled
          ? this.options.videoBitsPerSecond
          : undefined,
        audioBitsPerSecond: this.options.audioBitsPerSecond,
      });

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.chunks.push(event.data);
          console.log(`Received data chunk: ${event.data.size} bytes`);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
      };

      // Start recording with a larger timeslice for more frequent data chunks
      this.mediaRecorder.start(500); // Collect data every 500ms

      this.isRecording = true;
      this.recordingStartTime = Date.now();

      // Set up a timer to stop recording after maxDurationMs
      if (this.options.maxDurationMs) {
        this.recordingTimer = setTimeout(() => {
          console.log(
            `Max recording duration of ${this.options.maxDurationMs}ms reached, stopping recording`,
          );
          this.stopRecording();
        }, this.options.maxDurationMs);
      }

      return true;
    } catch (error) {
      console.error("Error starting recording:", error);
      return false;
    }
  }

  async stopRecording(): Promise<Blob | null> {
    if (!this.isRecording || !this.mediaRecorder) {
      console.warn("No recording in progress");
      return null;
    }

    return new Promise((resolve) => {
      // Force a final dataavailable event before stopping
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        try {
          // Request a data chunk right now
          this.mediaRecorder.requestData();
        } catch (e) {
          console.warn("Could not request final data chunk", e);
        }
      }

      // Set up the onstop handler before calling stop
      this.mediaRecorder!.onstop = () => {
        console.log(`Recording stopped, got ${this.chunks.length} chunks`);

        if (this.chunks.length === 0) {
          console.error("No data chunks collected during recording");
          resolve(null);
          return;
        }

        try {
          // Use the actual MIME type from the recorder if available
          const mimeType =
            this.mediaRecorder?.mimeType || this.options.mimeType;
          console.log(`Creating blob with MIME type: ${mimeType}`);

          // Create a copy of the chunks array to ensure it's not modified during blob creation
          const chunksToProcess = [...this.chunks];
          const blob = new Blob(chunksToProcess, { type: mimeType });
          console.log(`Created blob: ${blob.size} bytes, type: ${blob.type}`);
          this.chunks = [];

          // Stop all tracks
          if (this.stream) {
            this.stream.getTracks().forEach((track) => {
              console.log(`Stopping track: ${track.kind}`);
              track.stop();
            });
            this.stream = null;
          }

          // Clear the timer if it exists
          if (this.recordingTimer) {
            clearTimeout(this.recordingTimer);
            this.recordingTimer = null;
          }

          this.isRecording = false;
          resolve(blob);
        } catch (error) {
          console.error("Error creating blob:", error);
          resolve(null);
        }
      };

      // Add a small delay before stopping to ensure all data is captured
      setTimeout(() => {
        try {
          // Request one final data chunk
          if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
            this.mediaRecorder.requestData();
          }
          // Then stop the recording
          this.mediaRecorder!.stop();
        } catch (error) {
          console.error("Error stopping MediaRecorder:", error);
          resolve(null);
        }
      }, 100);
    });
  }

  async uploadRecording(
    blob: Blob,
    userId: string,
    isEmergency: boolean = false,
  ): Promise<string | null> {
    // Always save emergency recordings locally
    try {
      console.log("Recording captured", {
        type: blob.type,
        size: blob.size,
        timestamp: new Date().toISOString(),
        location: this.currentLocation,
      });

      // Create a download link for the recording
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
      console.log("Recording saved locally");

      // If this is an emergency recording, send location to emergency contacts
      if (isEmergency && this.currentLocation) {
        try {
          // Import dynamically to avoid circular dependencies
          const { sendEmergencySMSToContacts } = await import(
            "./twilioService"
          );

          // Send emergency SMS with current location directly from database
          await sendEmergencySMSToContacts(
            userId,
            "EMERGENCY ALERT: I need help! This is my current location:",
            this.currentLocation,
          );
          console.log("Emergency SMS sent to contacts with current location");
        } catch (error) {
          console.error("Error sending emergency SMS:", error);
        }
      }

      // Try to upload to Supabase as a backup
      try {
        // Create a unique filename for Supabase
        const supabaseFileName = `recordings/${userId}/${fileType}-${timestamp}.${fileType === "audio" ? "mp3" : "webm"}`;

        // Make sure the storage bucket exists
        try {
          console.log("Checking if recordings bucket exists");
          const { error: bucketError } =
            await supabase.storage.getBucket("recordings");

          if (bucketError && bucketError.message.includes("not found")) {
            // Create the bucket if it doesn't exist
            console.log("Creating recordings bucket");
            await supabase.storage.createBucket("recordings", {
              public: true,
              fileSizeLimit: 50000000, // 50MB limit
            });
          }
        } catch (bucketError) {
          console.error("Error checking/creating bucket:", bucketError);
        }

        // Upload the blob to Supabase Storage as backup
        console.log("Attempting to upload to Supabase as backup");
        const { data, error } = await supabase.storage
          .from("recordings")
          .upload(supabaseFileName, blob, {
            contentType: blob.type,
            cacheControl: "3600",
            upsert: true,
          });

        if (error) {
          console.error(
            "Error uploading recording to Supabase (backup only):",
            error,
          );
        } else {
          console.log("Backup upload to Supabase successful");
        }
      } catch (backupError) {
        console.error("Error in backup upload process:", backupError);
      }

      return fileName;
    } catch (error) {
      console.error("Error in uploadRecording:", error);
      return null;
    }
  }
}

// Create a singleton instance
const mediaRecorderService = new MediaRecorderService();
export default mediaRecorderService;
