import React from "react";
import { motion } from "framer-motion";
import { Shield, Send, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";

const FeedbackForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    location: "",
    incidentDate: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to submit an incident report");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("incident_reports").insert([
        {
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          incident_date: formData.incidentDate,
          status: "pending",
        },
      ]);

      if (error) throw error;

      alert("Incident report submitted successfully");
      setFormData({
        title: "",
        description: "",
        location: "",
        incidentDate: "",
      });
    } catch (error) {
      console.error("Error submitting incident report:", error);
      alert("Failed to submit incident report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <AlertTriangle className="mr-2 h-6 w-6" />
          Report an Incident
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          Help us make our community safer by reporting any safety-related incidents
          you've encountered.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white/50 dark:bg-gray-800/30 shadow-2xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Incident Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief title describing the incident"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where did the incident occur?"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incidentDate">Date of Incident</Label>
                  <Input
                    id="incidentDate"
                    type="datetime-local"
                    value={formData.incidentDate}
                    onChange={(e) =>
                      setFormData({ ...formData, incidentDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about the incident"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white/50 dark:bg-gray-800/30 shadow-2xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="h-5 w-5" />
                  <h3 className="font-semibold">Why Report an Incident?</h3>
                </div>

                <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-full text-primary">
                      1
                    </div>
                    <span>
                      Help us identify unsafe areas and take preventive measures
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-full text-primary">
                      2
                    </div>
                    <span>
                      Contribute to creating a safer environment for everyone
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-full text-primary">
                      3
                    </div>
                    <span>
                      Enable authorities to respond quickly to safety concerns
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-full text-primary">
                      4
                    </div>
                    <span>
                      Your report helps in improving safety measures and awareness
                    </span>
                  </li>
                </ul>

                <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Note:</strong> All reports are kept confidential and
                    reviewed by our safety team. In case of immediate danger,
                    please contact emergency services directly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;