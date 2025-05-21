import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, UserPlus, Search, Filter, X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import TrustedContactsList from "./TrustedContactsList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  avatar?: string;
  status?: "online" | "offline";
}

const TrustedContactsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Listen for the custom event to open the dialog
  useEffect(() => {
    const handleOpenDialog = () => {
      setIsDialogOpen(true);
    };

    window.addEventListener("openAddContactDialog", handleOpenDialog);

    return () => {
      window.removeEventListener("openAddContactDialog", handleOpenDialog);
    };
  }, []);

  // Fetch contacts from Supabase when component mounts
  useEffect(() => {
    const fetchContacts = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from("trusted_contacts")
            .select("*")
            .eq("user_id", user.id);

          if (error) throw error;

          if (data) {
            // Transform the data to match our Contact interface
            const formattedContacts: Contact[] = data.map((contact) => ({
              id: contact.id,
              name: contact.name,
              phone: contact.phone,
              relationship: contact.relationship || "Friend",
              avatar:
                contact.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`,
              status: contact.status || "offline",
            }));
            setContacts(formattedContacts);
          }
        } catch (error) {
          console.error("Error fetching contacts:", error);
          // No fallback data - start with empty contacts list
          setContacts([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Start with empty contacts list if no user is logged in
        setContacts([]);
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [user]);

  const handleAddContact = async () => {
    if (newContact.name && newContact.phone) {
      // Don't call useAuth() inside a function - it's a hook that must be called at the top level
      // Get the user from the existing context

      if (user) {
        try {
          console.log("Adding contact to database for user:", user.id);
          // Add contact to Supabase database
          const { data, error } = await supabase
            .from("trusted_contacts")
            .insert([
              {
                user_id: user.id,
                name: newContact.name,
                phone: newContact.phone,
                relationship: newContact.relationship || "Friend",
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newContact.name}`,
                status: "offline",
              },
            ])
            .select();

          if (error) {
            console.error("Supabase error:", error);
            throw error;
          }

          console.log("Contact added successfully:", data);
          if (data && data[0]) {
            // Add the new contact to the local state
            const newContactWithId: Contact = {
              id: data[0].id,
              name: newContact.name,
              phone: newContact.phone,
              relationship: newContact.relationship || "Friend",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newContact.name}`,
              status: "offline",
            };

            setContacts([...contacts, newContactWithId]);
            setNewContact({ name: "", phone: "", relationship: "" });
            setIsDialogOpen(false);
          }
        } catch (error) {
          console.error("Error adding contact:", error);
          alert("Failed to add contact. Please try again.");
        }
      } else {
        // Fallback for when user is not available (development/testing)
        console.log("No user found, using fallback");
        const contact: Contact = {
          id: Date.now().toString(),
          name: newContact.name,
          phone: newContact.phone,
          relationship: newContact.relationship || "Friend",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newContact.name}`,
          status: "offline",
        };

        setContacts([...contacts, contact]);
        setNewContact({ name: "", phone: "", relationship: "" });
        setIsDialogOpen(false);
      }
    } else {
      alert("Please enter both name and phone number");
    }
  };

  const handleRemoveContact = async (id: string) => {
    // Don't call useAuth() inside a function
    // Use the user from the component's context

    if (user) {
      try {
        // Delete contact from Supabase database
        const { error } = await supabase
          .from("trusted_contacts")
          .delete()
          .eq("id", id);

        if (error) throw error;

        // Remove from local state
        setContacts(contacts.filter((contact) => contact.id !== id));
      } catch (error) {
        console.error("Error removing contact:", error);
      }
    } else {
      // Fallback for when user is not available
      setContacts(contacts.filter((contact) => contact.id !== id));
    }
  };

  const handleEditContact = async (
    id: string,
    updatedContact: Omit<Contact, "id">,
  ) => {
    // Don't call useAuth() inside a function
    // Use the user from the component's context

    if (user) {
      try {
        // Update contact in Supabase database
        const { error } = await supabase
          .from("trusted_contacts")
          .update({
            name: updatedContact.name,
            phone: updatedContact.phone,
            relationship: updatedContact.relationship,
            // Only update avatar if it changed
            ...(updatedContact.avatar && { avatar_url: updatedContact.avatar }),
          })
          .eq("id", id);

        if (error) throw error;

        // Update in local state
        setContacts(
          contacts.map((contact) =>
            contact.id === id ? { ...contact, ...updatedContact } : contact,
          ),
        );
      } catch (error) {
        console.error("Error updating contact:", error);
      }
    } else {
      // Fallback for when user is not available
      setContacts(
        contacts.map((contact) =>
          contact.id === id ? { ...contact, ...updatedContact } : contact,
        ),
      );
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.relationship.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
          <Shield className="mr-2 h-6 w-6" />
          Trusted Contacts
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          Manage your emergency contacts who will be notified when you activate
          SOS mode
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/50 dark:bg-gray-800/30 shadow-2xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md">
            <CardContent className="p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Add Trusted Contact</DialogTitle>
                    <DialogDescription>
                      Add someone you trust to be notified during emergencies.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddContact();
                    }}
                    className="space-y-4 py-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Contact name"
                        value={newContact.name}
                        onChange={(e) =>
                          setNewContact({ ...newContact, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        value={newContact.phone}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        placeholder="Friend, Family, etc."
                        value={newContact.relationship}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            relationship: e.target.value,
                          })
                        }
                      />
                    </div>
                  </form>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddContact}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                      type="button"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Add Contact
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Why Add Trusted Contacts?
                </h3>
                <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      They'll be notified immediately when you activate SOS
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>They'll receive your real-time location updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      You can share your journey with them for added safety
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/30 shadow-2xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Quick Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    searchQuery === ""
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : ""
                  }
                  onClick={() => setSearchQuery("")}
                >
                  All Contacts
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    searchQuery === "online"
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : ""
                  }
                  onClick={() => setSearchQuery("online")}
                >
                  Available Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    searchQuery === "family"
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : ""
                  }
                  onClick={() => setSearchQuery("family")}
                >
                  Family
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    searchQuery === "friend"
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : ""
                  }
                  onClick={() => setSearchQuery("friend")}
                >
                  Friends
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8 bg-white/50 dark:bg-gray-800/30 rounded-3xl shadow-xl border border-gray-100/20 dark:border-gray-700/20 backdrop-blur-md max-w-md">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Loading Contacts</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Please wait while we fetch your trusted contacts...
                </p>
              </div>
            </div>
          ) : filteredContacts.length > 0 ? (
            <TrustedContactsList
              contacts={filteredContacts}
              onAddContact={(contact) => {
                const newContact: Contact = {
                  id: Date.now().toString(),
                  ...contact,
                };
                setContacts([...contacts, newContact]);
              }}
              onRemoveContact={handleRemoveContact}
              onEditContact={handleEditContact}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8 bg-white/50 dark:bg-gray-800/30 rounded-3xl shadow-xl border border-gray-100/20 dark:border-gray-700/20 backdrop-blur-md max-w-md">
                <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Contacts Found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchQuery
                    ? `No contacts match "${searchQuery}". Try a different search.`
                    : "You haven't added any trusted contacts yet."}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setIsDialogOpen(true);
                  }}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Your First Contact
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustedContactsPage;
