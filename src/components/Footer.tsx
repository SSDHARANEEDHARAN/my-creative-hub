import { forwardRef, memo } from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import SocialLinks from "./SocialLinks";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer ref={ref} className="relative py-20 border-t border-border bg-card/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-mesh opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="group flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center hover:rotate-180 transition-transform duration-500">
                <Sparkles className="text-primary-foreground" size={20} />
              </div>
              <span className="font-display text-2xl font-bold text-gradient">
                TTS.dev
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm">
              Creating innovative solutions in both IT and Engineering domains - from web applications to CAD designs.
            </p>
            <a 
              href="mailto:tharaneetharan@email.com"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium group hover:translate-x-1 transition-transform duration-200"
            >
              <Mail size={18} />
              tharaneetharan@email.com
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <div key={link.name} className="hover:translate-x-1 transition-transform duration-200">
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Social & Connect */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Connect</h4>
            <p className="text-muted-foreground mb-6">
              Follow me on social media for updates, insights, and behind-the-scenes content.
            </p>
            <SocialLinks />
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            © {currentYear} Tharanee Tharan S.S. Crafted with
            <span className="animate-pulse">
              <Heart size={14} className="text-destructive" fill="currentColor" />
            </span>
            and lots of ☕
          </p>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-xs">
              Built with React, TypeScript & Tailwind CSS
            </span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-accent font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default memo(Footer);