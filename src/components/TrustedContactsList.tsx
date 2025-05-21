import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  UserPlus,
  Trash2,
  Edit,
  Check,
  X,
  Share2,
  Shield,
  Heart,
  Bell,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  avatar?: string;
  status?: "online" | "offline";
}

interface TrustedContactsListProps {
  contacts?: Contact[];
  onAddContact?: (contact: Omit<Contact, "id">) => void;
  onRemoveContact?: (id: string) => void;
  onEditContact?: (id: string, contact: Omit<Contact, "id">) => void;
}

const TrustedContactsList = ({
  contacts = [],
  onAddContact = () => {},
  onRemoveContact = () => {},
  onEditContact = () => {},
}: TrustedContactsListProps) => {
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Contact, "id">>({
    name: "",
    phone: "",
    relationship: "",
  });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
            }
          });
        },
        { threshold: 0.1 },
      );
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact.id);
    setEditFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      avatar: contact.avatar,
      status: contact.status,
    });
  };

  // This would be used in a real implementation with Supabase
  // const fetchContacts = async () => {
  //   const { user } = useAuth();
  //   if (!user) return;
  //
  //   try {
  //     const { data, error } = await supabase
  //       .from('trusted_contacts')
  //       .select('*')
  //       .eq('user_id', user.id);
  //
  //     if (error) throw error;
  //     if (data) setContacts(data);
  //   } catch (error) {
  //     console.error('Error fetching contacts:', error);
  //   }
  // };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleSaveEdit = (id: string) => {
    onEditContact(id, editFormData);
    setEditingContact(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card
      ref={cardRef}
      className="w-full max-w-md bg-white/50 dark:bg-gray-800/30 shadow-2xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-500"
    >
      <CardHeader className="bg-gradient-to-r from-primary/30 to-primary/20 dark:from-primary/30 dark:to-primary/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-primary dark:text-primary-foreground font-bold">
              Trusted Contacts
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                 
                  
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-white/80 backdrop-blur-md border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                <p>Add new trusted contact</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100/50 dark:divide-gray-700/30">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="p-4 hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {editingContact === contact.id ? (
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center space-x-3">
                    <Avatar className="border-2 border-primary/30 h-12 w-12 ring-2 ring-white/50 dark:ring-gray-800/50">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback className="bg-primary/30 text-primary dark:bg-primary/40 dark:text-primary-foreground">
                        {contact.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/80 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-transparent outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-2">
                      <Phone
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <input
                        type="text"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/80 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-transparent outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        Relationship:
                      </span>
                      <input
                        type="text"
                        name="relationship"
                        value={editFormData.relationship}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/80 dark:bg-gray-700/80 dark:text-white backdrop-blur-sm focus:ring-2 focus:ring-primary/30 focus:border-transparent outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 border-gray-300/50 dark:border-gray-600/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg shadow-sm hover:shadow transition-all duration-300"
                      >
                        <X size={14} />
                        <span>Cancel</span>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSaveEdit(contact.id)}
                        className="flex items-center gap-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Check size={14} />
                        <span>Save</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="border-2 border-primary/30 h-12 w-12 shadow-md ring-2 ring-white/50 dark:ring-gray-800/50">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback className="bg-primary/30 text-primary dark:bg-primary/40 dark:text-primary-foreground">
                          {contact.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${contact.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                      ></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium dark:text-white text-lg">
                          {contact.name}
                        </h4>
                        {index === 0 && (
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary border-primary/20 text-xs"
                          >
                            <Heart className="h-3 w-3 mr-1 fill-primary" />{" "}
                            Primary
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Phone size={14} className="mr-1" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100/50 dark:bg-gray-700/50 px-2 py-1 rounded-full inline-block">
                          {contact.relationship}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {contact.status === "online"
                            ? "Available now"
                            : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-accent dark:text-gray-400 dark:hover:text-accent hover:scale-110 transition-all duration-300 hover:bg-accent/10 rounded-full"
                            >
                              <Share2 size={16} />
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white/80 backdrop-blur-md border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                          <p>Share your location</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-500 hover:scale-110 transition-all duration-300 hover:bg-amber-500/10 rounded-full"
                              onClick={() => handleEditClick(contact)}
                            >
                              <Edit size={16} />
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white/80 backdrop-blur-md border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                          <p>Edit contact</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 hover:scale-110 transition-all duration-300 hover:bg-red-500/10 rounded-full"
                              onClick={() => onRemoveContact(contact.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white/80 backdrop-blur-md border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                          <p>Remove contact</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30 text-xs text-gray-500 dark:text-gray-400 justify-center py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <Bell className="h-3 w-3 text-primary" />
          <span>These contacts will be notified in case of emergency</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrustedContactsList;
