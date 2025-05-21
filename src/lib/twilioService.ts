import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Twilio API configuration
const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.error("Twilio credentials are not properly configured");
}

interface Location {
  lat: number;
  lng: number;
}

interface TwilioResponse {
  success: boolean;
  results?: any[];
  error?: string;
}

// Validate phone number format
const validatePhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  let cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's an Indian number
  if (cleanPhone.length === 10) {
    // Add Indian country code
    return `+91${cleanPhone}`;
  } else if (cleanPhone.length > 10) {
    // If number already has country code
    return `+${cleanPhone}`;
  }
  
  throw new Error(`Invalid phone number format: ${phone}`);
};

// 🚀 Send Emergency SMS with enhanced error handling
export const sendEmergencySMSToContacts = async (
  userId: string,
  message: string,
  location: Location
): Promise<TwilioResponse> => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    return { success: false, error: "Twilio credentials not configured" };
  }

  try {
    // First, try to get contacts from the trusted_contacts table
    let { data, error } = await supabase
      .from("trusted_contacts")
      .select("phone")
      .eq("user_id", userId);

    // If no data in trusted_contacts, try the contacts table as fallback
    if (!data || data.length === 0) {
      const contactsResult = await supabase
        .from("contacts")
        .select("phone")
        .eq("user_id", userId);
      
      data = contactsResult.data;
      error = contactsResult.error;
    }

    if (error) {
      console.error("Error fetching contacts:", error);
      return { success: false, error: "Failed to fetch contacts" };
    }

    if (!data || data.length === 0) {
      console.warn("No emergency contacts found for this user.");
      return { success: false, error: "No emergency contacts found" };
    }

    const contacts = data.map((contact) => contact.phone);
    const smsBody = `${message} https://www.google.com/maps?q=${location.lat},${location.lng}`;

    console.log(`🚨 Sending emergency SMS to ${contacts.length} contacts`);

    // Send SMS to each contact using Twilio REST API
    const results = await Promise.all(
      contacts.map(async (phone) => {
        try {
          const formattedPhone = validatePhoneNumber(phone);
          const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
              },
              body: new URLSearchParams({
                To: formattedPhone,
                From: TWILIO_PHONE_NUMBER,
                Body: smsBody
              })
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const message = await response.json();
          console.log(`📱 SMS sent to ${formattedPhone} - SID: ${message.sid}`);
          return {
            phone: formattedPhone,
            status: "sent",
            messageId: message.sid,
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error(`Error sending SMS to ${phone}:`, errorMessage);
          return {
            phone,
            status: "failed",
            error: errorMessage,
          };
        }
      })
    );

    const successfulSends = results.filter((result) => result.status === "sent");
    return {
      success: successfulSends.length > 0,
      results,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Unexpected error:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

// 🚀 Make Emergency Call
export const makeEmergencyCallToNumber = async (phone: string) => {
  try {
    // Log the call attempt
    console.log(`🚨 EMERGENCY CALL would be made to: ${phone}`);
    
    // In a browser environment, we can try to open the phone dialer
    // This works on mobile devices but will be ignored on desktop
    if (typeof window !== 'undefined') {
      // Create a clickable link that opens the phone dialer
      const a = document.createElement('a');
      a.href = `tel:${phone}`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
      
      console.log(`📞 Phone dialer opened for: ${phone}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error making call:", error);
    return { success: false, error };
  }
};
