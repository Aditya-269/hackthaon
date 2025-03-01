import { Twilio } from "twilio";

// Initialize Twilio client with your Account SID and Auth Token
const accountSid =
  import.meta.env.VITE_TWILIO_ACCOUNT_SID || "your_account_sid";
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN || "your_auth_token";
const twilioPhoneNumber =
  import.meta.env.VITE_TWILIO_PHONE_NUMBER || "your_twilio_phone_number";

// Create Twilio client
export const twilioClient = new Twilio(accountSid, authToken);

// Function to send emergency SMS
export const sendEmergencySMS = async (
  to: string,
  message: string,
  location: { lat: number; lng: number },
) => {
  try {
    // Create Google Maps link with the location
    const googleMapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    const fullMessage = `${message}\n\nCurrent Location: ${googleMapsLink}`;

    // Send the message using Twilio
    const response = await twilioClient.messages.create({
      body: fullMessage,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log("Emergency SMS sent:", response.sid);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("Error sending emergency SMS:", error);
    return { success: false, error };
  }
};

// Function to send emergency SMS to multiple contacts
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
