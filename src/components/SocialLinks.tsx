import { Github, Linkedin, Coffee } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
}

const VercelIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 76 65" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
  </svg>
);

export const socialLinks = [
  { icon: Github, href: "https://github.com/SSDHARANEEDHARAN", label: "GitHub", comingSoon: false },
  { icon: Linkedin, href: "https://www.linkedin.com/in/dharaneedharan-ss-70941a211/", label: "LinkedIn", comingSoon: false },
  { icon: VercelIcon, href: "https://vercel.com/dharaneedharansss-projects", label: "Vercel", comingSoon: true },
  { icon: Coffee, href: "https://studio.buymeacoffee.com/home", label: "Buy Me a Coffee", comingSoon: false },
];

const SocialLinks = ({ className = "", iconSize = 20 }: SocialLinksProps) => {
  const handleClick = (e: React.MouseEvent, link: typeof socialLinks[0]) => {
    if (link.comingSoon) {
      e.preventDefault();
      toast({
        title: "Coming Soon! 🚀",
        description: `${link.label} page is coming soon. Stay tuned!`,
      });
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleClick(e, link)}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
          aria-label={link.label}
        >
          <link.icon size={iconSize} />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
