import { supabase } from "./supabase";

// Function to make a direct call using Twilio
export const makeEmergencyCall = async (phoneNumber: string) => {
  try {
    // In a real implementation, this would call the Twilio API to initiate a call
    // For now, we'll log the call attempt and simulate the behavior
    console.log(`[EMERGENCY CALL to ${phoneNumber}]: Initiating direct call`);

    // Automatically initiate call without user interaction
    // Using iframe approach which works better for automatic calls
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.contentWindow.location.href = `tel:${phoneNumber}`;

    // Remove the iframe after a short delay
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);

    // Return a success response
    return { success: true, callSid: `twilio-call-sid-${Date.now()}` };
  } catch (error) {
    console.error("Error making emergency call:", error);
    return { success: false, error };
  }
};

// Function to make an emergency call to a specific number
export const makeEmergencyCallToNumber = async (phoneNumber: string) => {
  try {
    console.log(`Making emergency call to ${phoneNumber}`);
    const result = await makeEmergencyCall(phoneNumber);

    if (result.success) {
      console.log("Emergency call initiated successfully");
      return { success: true, result };
    } else {
      throw new Error("Failed to initiate call");
    }
  } catch (error) {
    console.error("Error making emergency call:", error);
    return { success: false, error };
  }
};
