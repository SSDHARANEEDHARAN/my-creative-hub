import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

interface ResumeButtonProps {
  variant?: "hero" | "heroOutline" | "default";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
}

const ResumeButton = ({ variant = "hero", size = "lg", className = "" }: ResumeButtonProps) => {
  const handleDownload = () => {
    // Create a sample resume content
    const resumeContent = `
ALEX CHEN
Creative Developer & Digital Nomad
San Francisco, CA | hello@alexchen.dev | +1 (555) 123-4567

SUMMARY
Full-stack developer and UI/UX designer with 5+ years of experience building beautiful, 
high-performance web applications. Passionate about clean code, stunning design, and 
exploring the world.

SKILLS
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, PostgreSQL, MongoDB, GraphQL
- Design: Figma, UI/UX, Prototyping, Design Systems
- Other: Docker, AWS, Git, Agile

EXPERIENCE
Senior Developer | TechStart Inc | 2022 - Present
- Led development of e-commerce platform serving 100k+ users
- Implemented modern CI/CD pipelines reducing deployment time by 60%
- Mentored junior developers and established coding standards

Full-Stack Developer | InnovateCo | 2020 - 2022
- Built real-time analytics dashboard with React and D3.js
- Designed and implemented RESTful APIs using Node.js
- Collaborated with design team to improve UX

EDUCATION
B.S. Computer Science | UC Berkeley | 2019

TRAVEL
Visited 15+ countries while working remotely, including Japan, Italy, 
Iceland, Thailand, Portugal, and Morocco.
    `.trim();

    // Create blob and download
    const blob = new Blob([resumeContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Alex_Chen_Resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Resume Downloaded!",
      description: "Thank you for your interest. The resume has been downloaded.",
    });
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={handleDownload}>
      <Download size={18} className="mr-2" />
      Download Resume
    </Button>
  );
};

export default ResumeButton;
