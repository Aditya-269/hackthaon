import React, { useEffect, useRef } from "react";
import {
  Menu,
  Bell,
  User,
  Settings,
  MapPin,
  Shield,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ThemeToggle from "./ui/theme-toggle";
import gsap from "gsap";
import { useAuth } from "./auth/AuthProvider";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
  userName?: string;
  userInitials?: string;
  userAvatarUrl?: string;
  onNavigate?: (path: string) => void;
}

const Header = ({
  title = "Women Safety Alert System",
  userName = "Jane Doe",
  userInitials = "JD",
  userAvatarUrl = "",
  onNavigate = () => {},
}: HeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current && logoRef.current && navRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6 },
      );

      gsap.fromTo(
        navRef.current.children,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.3 },
      );
    }
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <header
      ref={headerRef}
      className="w-full h-[70px] px-4 py-2 flex items-center justify-between bg-white/60 dark:bg-gray-900/60 border-b border-gray-200/20 dark:border-gray-800/20 shadow-sm sticky top-0 z-50 backdrop-blur-xl"
    >
      <div ref={logoRef} className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold text-primary dark:text-primary-foreground">
            {title}
          </h1>
        </div>
      </div>

      <div ref={navRef} className="hidden md:flex items-center space-x-6">
        <Button
          variant="ghost"
          className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground relative group"
          onClick={() => handleNavigate("/")}
        >
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </Button>
        <Button
          variant="ghost"
          className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground relative group"
          onClick={() => handleNavigate("/routes")}
        >
          <MapPin className="h-4 w-4 mr-1" />
          Route Planning
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </Button>
        <Button
          variant="ghost"
          className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground relative group"
          onClick={() => handleNavigate("/contacts")}
        >
          Trusted Contacts
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </Button>
        <Button
          variant="ghost"
          className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground relative group"
          onClick={() => handleNavigate("/self-defense")}
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Self-Defense
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </Button>
        <Button
          variant="ghost"
          className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground relative group"
          onClick={() => handleNavigate("/report-incident")}
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          Report Incident
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </Button>
        <Button
          variant="ghost"
          className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground relative group"
          onClick={() => handleNavigate("/settings")}
        >
          Settings
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Avatar>
                {userAvatarUrl ? (
                  <AvatarImage src={userAvatarUrl} alt={userName} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium dark:text-white">{userName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
            </div>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            <DropdownMenuItem
              onClick={() => handleNavigate("/profile")}
              className="dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigate("/settings")}
              className="dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await signOut();
                  handleNavigate("/login");
                } catch (error) {
                  console.error("Error signing out:", error);
                }
              }}
              className="dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;