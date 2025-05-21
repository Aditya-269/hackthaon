import React, { useState } from "react";
import { makeEmergencyCallToNumber } from "../lib/twilioService";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Shield,
  BookOpen,
  Video,
  FileText,
  Play,
  Info,
  Award,
  ChevronRight,
  Heart,
  Star,
  Clock,
  Download,
  Share2,
} from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";

const SelfDefense = () => {
  const [activeTab, setActiveTab] = useState("techniques");
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [pdfOpen, setPdfOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");

  const handleVideoClick = (videoUrl: string) => {
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  const techniques = [
    {
      id: "tech1",
      title: "Basic Wrist Grab Escape",
      level: "Beginner",
      duration: "3:45",
      thumbnail: "https://cdn.shopify.com/s/files/1/0597/5592/1540/files/fighting_1024x1024.jpg?v=1689574517",
      instructor: "Priya Sharma",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      views: "12.5K",
      videoUrl: "https://www.youtube.com/embed/8zgxa0m0zvw",
      description: "Learn how to escape when someone grabs your wrist, a fundamental self-defense technique for women.",
    },
    {
      id: "tech2",
      title: "Front Choke Defense",
      level: "Intermediate",
      duration: "5:20",
      thumbnail: "https://www.mixedmartialarts.com/.image/t_share/MTg3NzUxMjM1MTk4MDY4MDg5/krav-maga-choke-defense.jpg",
      instructor: "Neha Patel",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
      views: "8.7K",
      videoUrl: "https://www.youtube.com/embed/hxU5mHlR5ys",
      description: "Effective techniques to defend against a front choke attack using leverage and body positioning.",
    },
    {
      id: "tech3",
      title: "Bear Hug Defense",
      level: "Beginner",
      duration: "4:15",
      thumbnail: "https://i.ytimg.com/vi/Yq1vfE8MDjw/mqdefault.jpg",
      instructor: "Anjali Desai",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali",
      views: "10.2K",
      videoUrl: "https://www.youtube.com/embed/J1Ujo_BJJtM",
      description: "Learn how to escape from a bear hug attack from behind using proper technique and timing.",
    },
    {
      id: "tech4",
      title: "Ground Defense Basics",
      level: "Advanced",
      duration: "7:30",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRafVgSrNsJ1H1-47aLs1Am-K7j6Y_YWL3urw&s",
      instructor: "Meera Kapoor",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
      views: "15.8K",
      videoUrl: "https://www.youtube.com/embed/jAh0cU1J5zk",
      description: "Essential techniques for defending yourself when taken to the ground, focusing on creating space and escaping.",
    },
  ];

  const legalGuidance = [
    {
      id: "legal1",
      title: "Self-Defense Laws in India",
      type: "PDF Document",
      author: "Adv. Rajesh Kumar",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
      readTime: "8 min read",
      description:
        "Understanding Section 96-106 of the Indian Penal Code regarding the right to self-defense.",
      pdfUrl: "https://law.uok.edu.in/Files/5ce6c765-c013-446c-b6ac-b9de496f8751/Custom/THE%20RIGHT%20OF%20PRIVATE%20DEFENCE-1.pdf"
    },
    {
      id: "legal2",
      title: "Legal Boundaries of Self-Defense",
      type: "PDF document",
      author: "Adv. Sunita Reddy",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita",
      duration: "12:45",
      description:
        "Learn about the legal limits of self-defense and how to ensure your actions are within legal boundaries.",
      pdfUrl: "https://pure.uva.nl/ws/files/2589385/179157_512917.pdf"
    },
    {
      id: "legal3",
      title: "Filing an FIR After an Attack",
      type: "PDF Document",
      author: "Adv. Vikram Singh",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
      readTime: "5 min read",
      description:
        "A comprehensive guide on how to file an FIR after experiencing an attack or threat.",
      pdfUrl: "https://www.humanrightsinitiative.org/publications/police/fir.pdf"
    },
    {
      id: "legal4",
      title: "Women's Rights Under Indian Law",
      type: "PDF Document",
      author: "Adv. Priya Malhotra",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaM",
      readTime: "15 min read",
      description:
        "Understanding the legal protections available to women under various Indian laws.",
      pdfUrl: "https://nhrc.nic.in/sites/default/files/Women%E2%80%99s%20Rights%20in%20India%20complete_compressed.pdf"
    },
  ];

  const workshops = [
    {
      id: "workshop1",
      title: "Women's Self-Defense Workshop - Delhi",
      date: "June 15, 2023",
      location: "Lodhi Gardens, Delhi",
      instructor: "Master Ritu Sharma",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ritu",
      price: "Free",
      spots: "15 spots left",
    },
    {
      id: "workshop2",
      title: "Krav Maga for Women - Mumbai",
      date: "July 8-9, 2023",
      location: "Juhu Beach, Mumbai",
      instructor: "Trainer Karan Mehta",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan",
      price: "₹1,500",
      spots: "8 spots left",
    },
    {
      id: "workshop3",
      title: "Campus Safety Training - Bangalore",
      date: "August 20, 2023",
      location: "Cubbon Park, Bangalore",
      instructor: "Coach Deepa Nair",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deepa",
      price: "₹800",
      spots: "20 spots left",
    },
  ];

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
          Self-Defense Training
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          Learn essential self-defense techniques, understand your legal rights,
          and find workshops near you.
        </p>
      </motion.div>

      <Card className="bg-white/50 dark:bg-gray-800/30 shadow-2xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md mb-8">
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop"
            alt="Self Defense Banner"
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Empower Yourself with Self-Defense
              </h2>
              <p className="text-sm md:text-base max-w-2xl mb-4">
                Learn practical techniques designed specifically for women's
                safety in Indian contexts.
              </p>
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={() => window.open('https://www.youtube.com/results?search_query=women+self+defense', '_blank', 'noopener,noreferrer')}
              >
                Watch More Videos
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700/50">
              <TabsTrigger
                value="techniques"
                className="flex items-center gap-1"
              >
                <Video className="h-4 w-4" />
                <span>Techniques</span>
              </TabsTrigger>
              <TabsTrigger value="legal" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Legal Guidance</span>
              </TabsTrigger>
              <TabsTrigger
                value="workshops"
                className="flex items-center gap-1"
              >
                <Award className="h-4 w-4" />
                <span>Workshops</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="techniques" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {techniques.map((technique) => (
                <motion.div
                  key={technique.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/70 dark:bg-gray-800/50 border-gray-100/30 dark:border-gray-700/30">
                    <div className="relative">
                      <img
                        src={technique.thumbnail}
                        alt={technique.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button 
                          className="bg-primary/90 hover:bg-primary text-white rounded-full h-12 w-12 flex items-center justify-center"
                          onClick={() => handleVideoClick(technique.videoUrl)}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                      <Badge className="absolute top-3 right-3 bg-primary/90 text-white">
                        {technique.level}
                      </Badge>
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {technique.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {technique.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {technique.description}
                          </p>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={technique.instructorAvatar} />
                              <AvatarFallback>
                                {technique.instructor.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {technique.instructor}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {technique.views} views
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-3 w-3 text-yellow-400 fill-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8"
                onClick={() => window.location.href = 'https://www.youtube.com/results?search_query=women+self+defense'}
              >
                View All Techniques
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="legal" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {legalGuidance.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/70 dark:bg-gray-800/50 border-gray-100/30 dark:border-gray-700/30">
                    <CardContent className="p-5">
                      <Badge className="mb-3 bg-secondary/20 text-secondary border-secondary/30">
                        {item.type}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={item.authorAvatar} />
                            <AvatarFallback>
                              {item.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">
                              {item.author}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.readTime || item.duration}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => {
                            if (item.pdfUrl) {
                              window.open(item.pdfUrl, '_blank');
                            }
                          }}
                        >
                          {item.type.includes("Video") ? (
                            <>
                              <Play className="mr-1 h-4 w-4" />
                              Watch
                            </>
                          ) : item.type.includes("PDF") ? (
                            <>
                              <FileText className="mr-1 h-4 w-4" />
                              View PDF
                            </>
                          ) : (
                            <>
                              <FileText className="mr-1 h-4 w-4" />
                              Read
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-primary/10 dark:bg-primary/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-2">
                    Important Legal Information
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    In India, the right to self-defense is protected under
                    Sections 96-106 of the Indian Penal Code. You have the legal
                    right to defend yourself when faced with an immediate
                    threat, but the force used should be proportionate to the
                    threat. For specific legal advice, please consult a
                    qualified attorney.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workshops" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workshops.map((workshop) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/70 dark:bg-gray-800/50 border-gray-100/30 dark:border-gray-700/30 h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {workshop.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span>{workshop.date}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span>{workshop.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={workshop.instructorAvatar} />
                            <AvatarFallback>
                              {workshop.instructor.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{workshop.instructor}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 border-green-500/30"
                          >
                            {workshop.spots}
                          </Badge>
                          <span className="font-bold text-lg">
                            {workshop.price}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 pt-0 mt-auto">
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                        onClick={() => window.open(workshop.id === "workshop1" ? "https://www.bjjindia.in/women-self-defense/#:~:text=SAFE360%20For%20Women,unpleasant%20and%20dangerous%20situation%20arises" : workshop.id === "workshop2" ? "https://www.sosparty.io/booster/activities/diversity-and-inclusion/diy-self-defence-workshop-activities-and-ideas-for-corporate-women-employees" : "https://www.agragami.org.in/self-defence-project/", '_blank', 'noopener,noreferrer')}
                      >
                        Register Now
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 bg-white/70 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100/30 dark:border-gray-700/30">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Host a Workshop in Your Community
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Want to organize a self-defense workshop in your neighborhood,
                college, or workplace? We can connect you with certified
                trainers who specialize in women's self-defense.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white">
                  Request a Workshop
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="bg-white/50 dark:bg-gray-800/30 shadow-xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Downloadable Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  const pdfUrl = "https://incometaxhyderabad.gov.in/docs/93674Women%20Safety%20Handbook.pdf";
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.setAttribute('download', 'Women_Safety_Handbook.pdf');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <FileText className="mr-2 h-4 w-4 text-primary" />
                <div>
                  <div className="font-medium">Safety Checklist PDF</div>
                  <div className="text-xs text-gray-500">2.3 MB</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  const pdfUrl = "https://www.irtsa.net/pdfdocs/List-of-Emergency-Helpline-Numbers-All-Over-in-India.pdf";
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.setAttribute('download', 'Emergency_Helpline_Numbers_India.pdf');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <FileText className="mr-2 h-4 w-4 text-primary" />
                <div>
                  <div className="font-medium">Emergency Contacts Template</div>
                  <div className="text-xs text-gray-500">1.1 MB</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  const pdfUrl = "https://ceerapub.nls.ac.in/wp-content/uploads/2022/12/Legal-Aid-Handbook.pdf";
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.setAttribute('download', 'Legal_Aid_Handbook.pdf');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <FileText className="mr-2 h-4 w-4 text-primary" />
                <div>
                  <div className="font-medium">Legal Rights Handbook</div>
                  <div className="text-xs text-gray-500">4.5 MB</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-gray-800/30 shadow-xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Featured Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=1000&auto=format&fit=crop"
                alt="Featured Video"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button 
                  className="bg-primary/90 hover:bg-primary text-white rounded-full h-12 w-12 flex items-center justify-center"
                  onClick={() => handleVideoClick(techniques[0].videoUrl)}
                >
                  <Play className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <h3 className="font-medium mt-3">
              Essential Self-Defense Moves Every Woman Should Know
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              A comprehensive guide to basic techniques that can help in
              dangerous situations.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-gray-800/30 shadow-xl border border-gray-100/20 dark:border-gray-700/20 rounded-3xl overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Community Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Join our community of women supporting each other through safety
              education and empowerment.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita" />
                  <AvatarFallback>KG</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">Kavita Gupta</div>
                  <div className="text-xs text-gray-500">
                    Delhi Chapter Lead
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lakshmi" />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">Lakshmi Rao</div>
                  <div className="text-xs text-gray-500">
                    Mumbai Chapter Lead
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">Ananya Sen</div>
                  <div className="text-xs text-gray-500">
                    Bangalore Chapter Lead
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
              onClick={() => window.open("https://discord.com/invite/P9uhWKR5", "_blank", "noopener,noreferrer")}
              >
              Join Our Community
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/30 p-6 rounded-3xl shadow-xl border border-gray-100/20 dark:border-gray-700/20 backdrop-blur-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-primary">
          Emergency Helplines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div 
            className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            onClick={() => makeEmergencyCallToNumber('1091')}
          >
            <h3 className="font-bold text-red-600 dark:text-red-400 text-lg">
              Women's Helpline
            </h3>
            <p className="text-2xl font-bold mt-2">1091</p>
          </div>
          <div 
            className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            onClick={() => makeEmergencyCallToNumber('100')}
          >
            <h3 className="font-bold text-red-600 dark:text-red-400 text-lg">
              Police
            </h3>
            <p className="text-2xl font-bold mt-2">100</p>
          </div>
          <div 
            className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            onClick={() => makeEmergencyCallToNumber('181')}
          >
            <h3 className="font-bold text-red-600 dark:text-red-400 text-lg">
              Domestic Violence
            </h3>
            <p className="text-2xl font-bold mt-2">181</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Save these numbers in your phone for quick access in case of
          emergency.
        </p>
      </div>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <div className="aspect-video w-full">
            <iframe
              src={selectedVideo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelfDefense;

const Calendar = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
};

const MapPin = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
};

{/* <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
  <DialogContent className="sm:max-w-[800px] p-0 bg-black overflow-hidden">
    <div className="aspect-video relative">
      <iframe
        src={selectedVideo}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  </DialogContent>
</Dialog> */}