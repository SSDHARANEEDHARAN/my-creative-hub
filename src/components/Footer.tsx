import { Link } from "react-router-dom";
import { Heart, Mail } from "lucide-react";
import SocialLinks from "./SocialLinks";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="py-16 border-t border-border bg-card/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-2xl font-bold text-gradient inline-block mb-4">
              Alex.dev
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Creating beautiful, high-performance web experiences that delight users and drive business results.
            </p>
            <a 
              href="mailto:hello@alexchen.dev" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              <Mail size={16} />
              hello@alexchen.dev
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="font-display font-semibold mb-4">Connect</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Follow me on social media for updates and insights.
            </p>
            <SocialLinks />
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            © {currentYear} Alex Chen. Crafted with <Heart size={14} className="text-red-500" fill="currentColor" /> and lots of ☕
          </p>
          <p className="text-muted-foreground text-xs">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
