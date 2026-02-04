import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Settings, FolderKanban, FileText, Users, Shield } from "lucide-react";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import SocialLinks from "./SocialLinks";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

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
              <span className="text-background font-bold text-sm sm:text-lg">TT</span>
            </motion.div>
            <span className="font-display text-lg sm:text-xl font-bold text-foreground">
              TTS.dev
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
            
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Shield className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/admin/projects" className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4" />
                      Manage Projects
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/blog" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Manage Blog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/moderation" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Moderation
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/subscribers" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Subscribers
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Link to="/contact">
              <Button variant="hero" size="default">
                Hire Me
              </Button>
            </Link>
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
                  {isAdmin && (
                    <div className="space-y-2 pb-4 border-b border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Admin</p>
                      <Link to="/admin/projects" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                        <FolderKanban className="h-4 w-4" /> Manage Projects
                      </Link>
                      <Link to="/admin/blog" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                        <FileText className="h-4 w-4" /> Manage Blog
                      </Link>
                      <Link to="/admin/moderation" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                        <Settings className="h-4 w-4" /> Moderation
                      </Link>
                      <Link to="/subscribers" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
                        <Users className="h-4 w-4" /> Subscribers
                      </Link>
                      <button onClick={() => { signOut(); setIsOpen(false); }} className="flex items-center gap-2 py-2 text-sm text-destructive hover:text-destructive/80">
                        Sign Out
                      </button>
                    </div>
                  )}
                  <SocialLinks className="justify-start" />
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    <Button variant="hero" className="w-full">
                      Hire Me
                    </Button>
                  </Link>
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