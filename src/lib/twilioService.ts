import { supabase } from "./supabase";

// Function to send emergency SMS using database contacts
export const sendEmergencySMS = async (
  to: string,
  message: string,
  location: { lat: number; lng: number },
) => {
  try {
    // Create Google Maps link with the location
    const googleMapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    const fullMessage = `${message}\n\nCurrent Location: ${googleMapsLink}\nLatitude: ${location.lat}\nLongitude: ${location.lng}\nSent at: ${new Date().toLocaleTimeString()}`;

    // In a real implementation, this would call the Twilio API
    // For now, we'll log the message and return a success response
    console.log(`[EMERGENCY SMS to ${to}]: ${fullMessage}`);

    // Return a success response
    return { success: true, sid: `twilio-sid-${Date.now()}` };
  } catch (error) {
    console.error("Error sending emergency SMS:", error);
    return { success: false, error };
  }
};

// Function to send emergency SMS to contacts directly from database
export const sendEmergencySMSToContacts = async (
  userId: string,
  message: string,
  location: { lat: number; lng: number },
) => {
  try {
    // Get user's trusted contacts directly from database
    const { data: contacts, error } = await supabase
      .from("trusted_contacts")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching contacts:", error);
      return { success: false, error };
    }

    if (!contacts || contacts.length === 0) {
      console.warn("No contacts found for user", userId);
      return { success: false, error: "No contacts found" };
    }

    console.log(`Found ${contacts.length} contacts to notify:`, contacts);
    const results = [];

    // Send SMS to each contact
    for (const contact of contacts) {
      if (contact.phone) {
        console.log(`Sending alert to ${contact.name} at ${contact.phone}`);
        const result = await sendEmergencySMS(contact.phone, message, location);
        console.log(
          `Alert to ${contact.name} ${result.success ? "sent successfully" : "failed"}`,
        );
        results.push({ contact, result });
      }
    }

    // Log the overall results
    const successCount = results.filter((r) => r.result.success).length;
    console.log(
      `Successfully sent alerts to ${successCount} out of ${contacts.length} contacts`,
    );

    return { success: true, results };
  } catch (error) {
    console.error("Error sending emergency SMS to contacts:", error);
    return { success: false, error };
  }
};
