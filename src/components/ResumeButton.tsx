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
THARANEE THARAN S.S
Full Stack Developer & CAD Engineer
tharaneetharan@email.com

SUMMARY
Full-stack developer and CAD engineer with expertise in React, Python, 
Embedded Systems, and engineering tools like SolidWorks, FlexSim, NX, Creo, and PTC Windchill.

SKILLS
IT & Software:
- Frontend: React, JavaScript, TypeScript, Tailwind CSS
- Backend: Python, Node.js, PostgreSQL, MongoDB
- Embedded: Arduino, Raspberry Pi, IoT

Engineering & CAD:
- SolidWorks, Siemens NX, PTC Creo
- FlexSim (Simulation)
- PTC Windchill (PLM)
- FEA Analysis, 3D Modeling

EXPERIENCE
Full Stack Developer & CAD Engineer
- Developed web applications using React and Python
- Created CAD designs and simulations for manufacturing
- Implemented IoT solutions with embedded systems

EDUCATION
Bachelor's Degree in Engineering
    `.trim();

    // Create blob and download
    const blob = new Blob([resumeContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Tharanee_Tharan_Resume.txt";
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
