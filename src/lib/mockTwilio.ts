// Mock implementation of Twilio for client-side use

// Function to send emergency SMS (mock version)
export const sendEmergencySMS = async (
  to: string,
  message: string,
  location: { lat: number; lng: number },
) => {
  try {
    // Create Google Maps link with the location
    const googleMapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    const fullMessage = `${message}\n\nCurrent Location: ${googleMapsLink}\nLatitude: ${location.lat}\nLongitude: ${location.lng}\nSent at: ${new Date().toLocaleTimeString()}`;

    // Log the message instead of actually sending it
    console.log(`[EMERGENCY SMS to ${to}]: ${fullMessage}`);

    // Show an alert in development environment
    if (import.meta.env.DEV) {
      alert(`Emergency SMS would be sent to ${to}:\n\n${fullMessage}`);
    }

    // Return a mock success response
    return { success: true, sid: `mock-sid-${Date.now()}` };
  } catch (error) {
    console.error("Error sending mock emergency SMS:", error);
    return { success: false, error };
  }
};

// Function to send emergency SMS to multiple contacts (mock version)
export const sendEmergencySMSToContacts = async (
  contacts: any[],
  message: string,
  location: { lat: number; lng: number },
) => {
  const results = [];

  for (const contact of contacts) {
    if (contact.phone) {
      const result = await sendEmergencySMS(contact.phone, message, location);
      results.push({ contact, result });
    }
  }

  return results;
};
