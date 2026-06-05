import { forwardRef, memo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, ArrowUpRight, Shield } from "lucide-react";
import SocialLinks from "./SocialLinks";
import NewsletterSubscription from "./NewsletterSubscription";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

interface FooterProps {
  persisted?: boolean;
}

const Footer = forwardRef<HTMLElement, FooterProps>(({ persisted }, ref) => {
  const { globalLayoutEnabled } = useLayoutContext();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  if (globalLayoutEnabled && !persisted) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <>
    <footer ref={ref} className="relative py-12 sm:py-20 border-t-2 border-border bg-secondary/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-mesh opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="group flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-foreground flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <span className="text-background font-bold text-sm sm:text-lg">SS</span>
              </div>
              <span className="font-display text-xl sm:text-2xl font-bold text-foreground">
                SS. Tharan
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 max-w-sm text-sm sm:text-base">
              Creating innovative mechatronics solutions and advanced engineering designs - from robotics to automation systems.
            </p>
            <a 
              href="mailto:tharaneetharanss@gmail.com"
              className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors font-medium group text-sm sm:text-base"
            >
              <Mail size={16} />
              <span className="hidden sm:inline">tharaneetharanss@gmail.com</span>
              <span className="sm:hidden">Email Us</span>
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
            © {currentYear} SS. Tharan. Crafted with
            <span className="animate-pulse">
              <Heart size={12} className="text-foreground" fill="currentColor" />
            </span>
            and lots of ☕
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <Shield size={12} />
              Privacy & Terms
            </button>
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

    <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Shield size={20} /> Privacy Policy & Terms of Use
          </DialogTitle>
          <DialogDescription>Last updated: {new Date().toLocaleDateString()}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h3 className="font-semibold text-foreground mb-2">1. Information We Collect</h3>
              <p>We collect basic account information (name, email) when you sign up, and engagement data (likes, comments, downloads) to improve the experience. IP addresses may be logged for security and abuse prevention.</p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-2">2. How We Use Your Data</h3>
              <p>Your data is used solely to operate the portfolio platform: authentication, notifications, newsletter delivery, and analytics. We do not sell or share your personal information with third parties.</p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-2">3. Cookies & Tracking</h3>
              <p>Essential cookies are used to keep you signed in and remember your preferences. No third-party advertising trackers are deployed.</p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-2">4. Content Protection</h3>
              <p>All projects, blog posts, images, and downloadable assets remain the intellectual property of SS. Tharan. Reproduction, redistribution, or commercial use without written consent is prohibited.</p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-2">5. User Conduct</h3>
              <p>Users agree not to attempt unauthorized access, scraping, reverse engineering, or any activity that disrupts the service. Violations may result in IP blocking and account termination.</p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-2">6. Industrial Projects Access</h3>
              <p>Industrial project content is restricted and may only be accessed by authenticated, approved users. Disclaimers attached to such content (including Janatics-related materials) must be respected.</p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-2">7. Your Rights</h3>
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting tharaneetharanss@gmail.com.</p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-2">8. Changes to This Policy</h3>
              <p>We may update this policy periodically. Continued use of the site after changes constitutes acceptance of the updated terms.</p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-2">9. Contact</h3>
              <p>For privacy questions or concerns, contact: <a href="mailto:tharaneetharanss@gmail.com" className="text-primary hover:underline">tharaneetharanss@gmail.com</a></p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
    </>
  );
});

Footer.displayName = "Footer";

export default memo(Footer);