import { supabase } from "./supabase";

// User profiles table functions
export const createUserProfile = async (userId: string, userData: any) => {
  const { data, error } = await supabase.from("profiles").insert([
    {
      id: userId,
      full_name: userData.full_name,
      avatar_url: userData.avatar_url || null,
      emergency_info: userData.emergency_info || null,
    },
  ]);

  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  return { data, error };
};

// Trusted contacts table functions
export const getTrustedContacts = async (userId: string) => {
  const { data, error } = await supabase
    .from("trusted_contacts")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
};

export const addTrustedContact = async (userId: string, contactData: any) => {
  const { data, error } = await supabase.from("trusted_contacts").insert([
    {
      user_id: userId,
      name: contactData.name,
      phone: contactData.phone,
      relationship: contactData.relationship,
      avatar_url: contactData.avatar_url || null,
    },
  ]);

  return { data, error };
};

export const updateTrustedContact = async (contactId: string, updates: any) => {
  const { data, error } = await supabase
    .from("trusted_contacts")
    .update(updates)
    .eq("id", contactId);

  return { data, error };
};

export const deleteTrustedContact = async (contactId: string) => {
  const { data, error } = await supabase
    .from("trusted_contacts")
    .delete()
    .eq("id", contactId);

  return { data, error };
};

// Emergency events table functions
export const createEmergencyEvent = async (userId: string, eventData: any) => {
  const { data, error } = await supabase.from("emergency_events").insert([
    {
      user_id: userId,
      location: eventData.location,
      status: "active",
      details: eventData.details || null,
    },
  ]);

  return { data, error };
};

export const updateEmergencyEvent = async (eventId: string, updates: any) => {
  const { data, error } = await supabase
    .from("emergency_events")
    .update(updates)
    .eq("id", eventId);

  return { data, error };
};

export const getActiveEmergencyEvent = async (userId: string) => {
  const { data, error } = await supabase
    .from("emergency_events")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return { data, error };
};

// Location updates table functions
export const addLocationUpdate = async (eventId: string, location: any) => {
  const { data, error } = await supabase.from("location_updates").insert([
    {
      emergency_event_id: eventId,
      latitude: location.lat,
      longitude: location.lng,
      accuracy: location.accuracy || null,
    },
  ]);

  return { data, error };
};

export const getLocationUpdates = async (eventId: string) => {
  const { data, error } = await supabase
    .from("location_updates")
    .select("*")
    .eq("emergency_event_id", eventId)
    .order("created_at", { ascending: false });

  return { data, error };
};

// Safe routes table functions
export const getSafeRoutes = async (userId: string) => {
  const { data, error } = await supabase
    .from("safe_routes")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
};

export const saveSafeRoute = async (userId: string, routeData: any) => {
  const { data, error } = await supabase.from("safe_routes").insert([
    {
      user_id: userId,
      name: routeData.name,
      start_location: routeData.startLocation,
      end_location: routeData.endLocation,
      route_data: routeData.routeData,
      safety_score: routeData.safetyScore,
    },
  ]);

  return { data, error };
};
