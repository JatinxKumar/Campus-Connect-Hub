import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap, Sun, Moon, ArrowLeftRight } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isDark, setIsDark] = useState(false);

  // Read role from local storage. Default to student if not set.
  const rawRole = typeof window !== "undefined" ? localStorage.getItem("appRole") : null;
  const appRole = rawRole === "admin" ? "admin" : "student";

  const handleSwitchRole = () => {
    localStorage.removeItem("appRole");
    navigate("/");
  };

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const formatName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const baseNavItems = [
    { path: "/home", label: "Home" },
    { path: "/clubs", label: "Clubs" },
    { path: "/events", label: "Events" },
    { path: "https://www.chitkara.edu.in/", label: "About", external: true },
  ];

  const adminItems = appRole === "admin" ? [
    { path: "/admin", label: "Admin" },
    ...(isAuthenticated ? [] : [{ path: "/create-account", label: "Create Account" }])
  ] : [];

  const navItems = [
    ...baseNavItems,
    ...adminItems,
    { 
      path: isAuthenticated ? "/logout" : "/login", 
      label: isAuthenticated ? (user?.name ? <span className="font-bold text-primary">{formatName(user.name)}</span> : "Logout") : "Login" 
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-secondary/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/home" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-2.5 transition-transform group-hover:scale-110 shadow-lg">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ClubHub</span>
          </Link>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              {navItems.map((item) => (
                item.external ? (
                  <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" className="transition-all font-medium hover:text-primary">
                      {item.label}
                    </Button>
                  </a>
                ) : (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className="transition-all font-medium"
                    >
                      {item.label}
                    </Button>
                  </Link>
                )
              ))}
            </div>

            {/* Switch Role Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchRole}
              aria-label="Switch Role"
              className="hidden md:flex items-center gap-2 border-border hover:bg-secondary"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span className="hidden lg:inline">Switch Role</span>
            </Button>

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors hover:bg-secondary/80"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-in slide-in-from-top-2 border-t border-border/40">
            {navItems.map((item) => (
              item.external ? (
                <a key={item.path} href={item.path} onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="w-full justify-start font-medium hover:text-primary transition-all">
                    {item.label}
                  </Button>
                </a>
              ) : (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start font-medium transition-all"
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            ))}

            {/* Mobile Switch Role Button */}
            <Button 
              variant="outline" 
              onClick={handleSwitchRole} 
              className="w-full justify-start font-medium transition-all mt-2 border-border"
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Switch Role
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
