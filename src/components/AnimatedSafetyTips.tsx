import React, { useRef, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  Battery,
  Share,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TipProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

const Tip: React.FC<TipProps> = ({ icon, title, description, link }) => {
  const tipRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (tipRef.current) {
      gsap.fromTo(
        tipRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: tipRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        },
      );
    }
  }, []);

  return (
    <div
      ref={tipRef}
      className="bg-white/70 dark:bg-gray-800/50 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20 hover:scale-[1.05] relative overflow-hidden group"
    >
      {/* Background gradient effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex items-start space-x-4 relative z-10">
        <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-full text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">{description}</p>
          {link && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto text-sm"
              onClick={() => navigate(link)}
            >
              Learn more <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const AnimatedSafetyTips = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            toggleActions: "play none none reverse",
          },
        },
      );
    }
  }, []);

  const tips = [
    {
      icon: <Share className="h-6 w-6" />,
      title: "Share Your Journey",
      description:
        "Always share your travel plans with trusted contacts before starting your journey.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Stay in Safe Areas",
      description:
        "Stick to well-lit areas and avoid shortcuts through isolated places, especially at night.",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Learn Self-Defense",
      description:
        "Knowing basic self-defense techniques can boost your confidence and help in emergency situations.",
      link: "/self-defense",
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Use SOS When Needed",
      description:
        "If you feel unsafe, don't hesitate to use the SOS button to alert your trusted contacts.",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="space-y-6 bg-white/50 dark:bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-100/20 dark:border-gray-700/20 backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <Shield className="h-6 w-6 mr-2 text-primary" />
          Safety Tips
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="text-primary border-primary/30 hover:bg-primary/10"
          onClick={() => navigate("/self-defense")}
        >
          View All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <Tip
            key={index}
            icon={tip.icon}
            title={tip.title}
            description={tip.description}
            link={tip.link}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedSafetyTips;
