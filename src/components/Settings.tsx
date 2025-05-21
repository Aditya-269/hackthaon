import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  Settings as SettingsIcon,
  User,
  Lock,
  MapPin,
  Volume2,
  Smartphone,
  Clock,
  Save,
  AlertTriangle,
  Check,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [notificationSettings, setNotificationSettings] = useState({
    emergencyAlerts: true,
    locationSharing: true,
    safetyTips: true,
    routeDeviations: true,
    soundAlerts: true,
  });
  const [privacySettings, setPrivacySettings] = useState({
    shareLocationWithContacts: true,
    anonymizeData: false,
    dataRetention: 30, // days
  });
  const [emergencySettings, setEmergencySettings] = useState({
    autoRecording: true,
    locationUpdateFrequency: 30, // seconds
    sirenSound: true,
    autoCallEmergency: false,
  });
  const [profileSettings, setProfileSettings] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    emergencyInfo: "No allergies, blood type O+",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
          <SettingsIcon className="mr-2 h-6 w-6" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          Customize your safety preferences and application settings
        </p>
      </motion.div>

      <Card className="bg-white/50 dark:bg-gray-800/30 shadow-2xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-700/50">
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-1"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger
                value="emergency"
                className="flex items-center gap-1"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Emergency</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="notifications" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">Emergency Alerts</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Receive high-priority alerts during emergencies
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.emergencyAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emergencyAlerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">Location Sharing Updates</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified when contacts share their location with you
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.locationSharing}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        locationSharing: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">Safety Tips</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Receive periodic safety tips and recommendations
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.safetyTips}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        safetyTips: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">Route Deviation Alerts</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Get alerted when you deviate from planned safe routes
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.routeDeviations}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        routeDeviations: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">Sound Alerts</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Play sound for important notifications
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.soundAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        soundAlerts: checked,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="privacy" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      Share Location with Trusted Contacts
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Allow your trusted contacts to see your location
                    </div>
                  </div>
                  <Switch
                    checked={privacySettings.shareLocationWithContacts}
                    onCheckedChange={(checked) =>
                      setPrivacySettings({
                        ...privacySettings,
                        shareLocationWithContacts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">Anonymize Data</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Remove personal identifiers from collected data
                    </div>
                  </div>
                  <Switch
                    checked={privacySettings.anonymizeData}
                    onCheckedChange={(checked) =>
                      setPrivacySettings({
                        ...privacySettings,
                        anonymizeData: checked,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Data Retention Period</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    How long to keep your location history and activity data
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[privacySettings.dataRetention]}
                      min={7}
                      max={90}
                      step={1}
                      onValueChange={(value) =>
                        setPrivacySettings({
                          ...privacySettings,
                          dataRetention: value[0],
                        })
                      }
                      className="flex-1"
                    />
                    <div className="w-16 text-center font-medium">
                      {privacySettings.dataRetention} days
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="font-medium mb-2">Data Management</div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Clear Location History
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Download My Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Delete All My Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="emergency" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Emergency Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      Automatic Video/Audio Recording
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Start recording when emergency mode is activated
                    </div>
                  </div>
                  <Switch
                    checked={emergencySettings.autoRecording}
                    onCheckedChange={(checked) =>
                      setEmergencySettings({
                        ...emergencySettings,
                        autoRecording: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">Emergency Siren Sound</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Play loud siren when SOS is activated
                    </div>
                  </div>
                  <Switch
                    checked={emergencySettings.sirenSound}
                    onCheckedChange={(checked) =>
                      setEmergencySettings({
                        ...emergencySettings,
                        sirenSound: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      Auto-Call Emergency Services
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically call emergency services when SOS is
                      activated
                    </div>
                  </div>
                  <Switch
                    checked={emergencySettings.autoCallEmergency}
                    onCheckedChange={(checked) =>
                      setEmergencySettings({
                        ...emergencySettings,
                        autoCallEmergency: checked,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Location Update Frequency</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    How often to send location updates during emergency
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[emergencySettings.locationUpdateFrequency]}
                      min={5}
                      max={60}
                      step={5}
                      onValueChange={(value) =>
                        setEmergencySettings({
                          ...emergencySettings,
                          locationUpdateFrequency: value[0],
                        })
                      }
                      className="flex-1"
                    />
                    <div className="w-24 text-center font-medium">
                      Every {emergencySettings.locationUpdateFrequency} sec
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="font-medium mb-2">Emergency Contacts</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    These contacts will be notified during emergencies
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Manage Emergency Contacts
                  </Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="profile" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={profileSettings.name}
                      onChange={(e) =>
                        setProfileSettings({
                          ...profileSettings,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) =>
                        setProfileSettings({
                          ...profileSettings,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      value={profileSettings.phone}
                      onChange={(e) =>
                        setProfileSettings({
                          ...profileSettings,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input type="password" value="********" readOnly />
                    <Button variant="link" className="text-xs p-0 h-auto">
                      Change Password
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Emergency Medical Information
                  </label>
                  <Textarea
                    placeholder="Add any relevant medical information for emergency responders"
                    value={profileSettings.emergencyInfo}
                    onChange={(e) =>
                      setProfileSettings({
                        ...profileSettings,
                        emergencyInfo: e.target.value,
                      })
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div className="bg-white/70 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="font-medium mb-2">Connected Devices</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-gray-500" />
                        <span>iPhone 13 Pro</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600"
                      >
                        Current
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-gray-500" />
                        <span>iPad Air</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-gray-500/10 text-gray-600"
                      >
                        Last active: 2 days ago
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>

        <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Clock className="inline-block mr-1 h-4 w-4" />
            Last updated: Today at 10:45 AM
          </div>
          <div className="flex items-center gap-4">
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-600 flex items-center"
              >
                <Check className="mr-1 h-4 w-4" />
                <span>Settings saved!</span>
              </motion.div>
            )}
            <Button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
