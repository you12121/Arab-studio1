// src/components/Navbar.tsx (الكود الصحيح والنهائي)

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Gamepad2, Home, BookHeart, Sparkles } from "lucide-react"; // 1. تم استيراد أيقونة الكتاب
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    // يمكنك إبقاء هذه الرسالة الترحيبية أو حذفها
    toast.success("مرحباً بك في Arab-studio!", {
      description: "موقع سعودي للثقافة والتراث",
      duration: 2000,
    });
  };

  // 2. إضافة "روايات" إلى قائمة الروابط
  const navItems = [
    { path: "/", label: "الرئيسية", icon: Home },
    { path: "/games", label: "الألعاب", icon: Gamepad2 },
    { path: "/novels", label: "روايات", icon: BookHeart }, // <-- هذا هو السطر المهم الذي تمت إضافته
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-saudi rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-saudi bg-clip-text text-transparent">
              Arab-studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 space-x-reverse">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-foreground hover:bg-accent"
              aria-label="القائمة"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-2 bg-card/95 backdrop-blur-md rounded-lg mt-2 border border-border">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)} // إغلاق القائمة عند الاختيار
                    className={`flex items-center space-x-2 space-x-reverse px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 block'} ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
