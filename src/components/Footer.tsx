import { forwardRef, memo } from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, ArrowUpRight } from "lucide-react";
import SocialLinks from "./SocialLinks";
import NewsletterSubscription from "./NewsletterSubscription";

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
    <footer ref={ref} className="relative py-12 sm:py-20 border-t-2 border-border bg-secondary/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-mesh opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="group flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-foreground flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <span className="text-background font-bold text-sm sm:text-lg">TT</span>
              </div>
              <span className="font-display text-xl sm:text-2xl font-bold text-foreground">
                TTS.dev
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 max-w-sm text-sm sm:text-base">
              Creating innovative solutions in both IT and Engineering domains - from web applications to CAD designs.
            </p>
            <a 
              href="mailto:tharaneetharanss@gmail.com"
              className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors font-medium group text-sm sm:text-base"
            >
              <Mail size={16} />
              <span className="hidden sm:inline">tharaneetharanss@gmail.com</span>
              <span className="sm:hidden">Email Me</span>
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-bold mb-4 sm:mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-2 sm:gap-3">
              {footerLinks.map((link) => (
                <div key={link.name} className="hover:translate-x-1 transition-transform duration-200">
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group text-sm sm:text-base"
                  >
                    <span className="w-1.5 h-1.5 bg-muted-foreground group-hover:bg-foreground transition-colors" />
                    {link.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-display text-base sm:text-lg font-bold mb-4 sm:mb-6">Newsletter</h4>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Subscribe to get updates on new projects, blog posts, and exclusive content.
            </p>
            <NewsletterSubscription />
            <div className="mt-6">
              <h5 className="font-medium text-sm mb-3">Connect</h5>
              <SocialLinks />
            </div>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t-2 border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-2 text-center sm:text-left">
            © {currentYear} Tharaneetharan SS. Crafted with
            <span className="animate-pulse">
              <Heart size={12} className="text-foreground" fill="currentColor" />
            </span>
            and lots of ☕
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="text-muted-foreground text-xs">
              Built with React, TypeScript & Tailwind CSS
            </span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-foreground animate-pulse" />
              <span className="text-xs text-foreground font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default memo(Footer);