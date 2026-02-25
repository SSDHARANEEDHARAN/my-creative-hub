import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import SocialLinks from "./SocialLinks";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Skills", href: "/skills" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-background/95 backdrop-blur-xl border-b-2 border-border shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-foreground flex items-center justify-center"
            >
              <span className="text-background font-bold text-sm sm:text-lg">AE</span>
            </motion.div>
            <span className="font-display text-lg sm:text-xl font-bold text-foreground">
              ArtTech Engine
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative px-3 xl:px-4 py-2 group"
              >
                <span className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
                  location.pathname === link.href 
                    ? "text-foreground" 
                    : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {link.name}
                </span>
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-secondary border-2 border-foreground"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <SocialLinks iconSize={16} />
            <div className="w-px h-6 bg-border" />
            <ThemeToggle />
            {user ? (
              <Button variant="outline" size="default" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            ) : (
              <Link to="/contact">
                <Button variant="hero" size="default">
                  Hire Me
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="text-foreground p-2 hover:bg-secondary border-2 border-transparent hover:border-border transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden overflow-hidden border-t-2 border-border"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block py-3 px-4 font-medium transition-all duration-300 ${
                        location.pathname === link.href 
                          ? "text-foreground bg-secondary border-l-4 border-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-4 border-transparent"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 border-t-2 border-border mt-4 space-y-4 px-4">
                  <SocialLinks className="justify-start" />
                  {user ? (
                    <Button variant="outline" className="w-full" onClick={() => { handleLogout(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-1.5" />
                      Logout
                    </Button>
                  ) : (
                    <Link to="/contact" onClick={() => setIsOpen(false)}>
                      <Button variant="hero" className="w-full">
                        Hire Me
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;