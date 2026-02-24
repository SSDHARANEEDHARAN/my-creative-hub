import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import jsPDF from "jspdf";
import profilePhoto from "@/assets/profile-photo.png";

interface ResumeButtonProps {
  variant?: "hero" | "heroOutline" | "default";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
}

type ResumeType = "it" | "core" | "both";

const ResumeButton = ({ variant = "hero", size = "lg", className = "" }: ResumeButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const loadImageAsBase64 = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  const generateResume = async (type: ResumeType) => {
    setShowDialog(false);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const black: [number, number, number] = [0, 0, 0];
      const darkGray: [number, number, number] = [60, 60, 60];
      const medGray: [number, number, number] = [100, 100, 100];

      // --- Profile Photo ---
      try {
        const photoData = await loadImageAsBase64(profilePhoto);
        doc.addImage(photoData, "PNG", pageWidth - margin - 25, y, 25, 25);
      } catch { /* continue */ }

      // --- Header ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...black);
      doc.text("THARANEE THARAN S.S", margin, y + 7);

      const subtitle = type === "it" ? "Full Stack Developer" : type === "core" ? "CAD Engineer" : "Full Stack Developer & CAD Engineer";
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...darkGray);
      doc.text(subtitle, margin, y + 14);

      doc.setFontSize(9);
      doc.setTextColor(...medGray);
      doc.text("Email: tharaneetharanss@gmail.com | Phone: +91 8870086023", margin, y + 20);
      doc.text("Location: Namakkal, India | LinkedIn: linkedin.com/in/dharaneedharan-ss-70941a211", margin, y + 25);
      doc.text("GitHub: github.com/SSDHARANEEDHARAN", margin, y + 30);
      y += 36;

      const addDivider = () => {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.4);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
      };

      const addSectionHeader = (title: string) => {
        if (y > 260) { doc.addPage(); y = margin; }
        addDivider();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...black);
        doc.text(title.toUpperCase(), margin, y);
        y += 6;
      };

      const addWrappedText = (text: string, fontSize = 9.5, color: [number, number, number] = darkGray) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * 4.2 + 2;
      };

      const addBullet = (text: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...darkGray);
        const lines = doc.splitTextToSize(text, contentWidth - 6);
        doc.text("•", margin + 1, y);
        doc.text(lines, margin + 6, y);
        y += lines.length * 4.2 + 1;
      };

      const addSkillCategory = (label: string, bullets: string[]) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...black);
        doc.text(label, margin, y);
        y += 5;
        bullets.forEach(b => addBullet(b));
        y += 2;
      };

      // === PROFESSIONAL SUMMARY ===
      addSectionHeader("Professional Summary");
      const summaries: Record<ResumeType, string> = {
        it: "Results-driven Full Stack Developer with 3+ years of experience in web development, embedded systems, and IoT solutions. Proficient in React, Python, Node.js, TypeScript, and cloud technologies. Skilled in building scalable web applications and real-time monitoring systems.",
        core: "Experienced CAD Engineer with 3+ years of hands-on expertise in engineering design, simulation, and product lifecycle management. Proficient in SolidWorks, PTC Creo, Siemens NX, FlexSim, and PTC Windchill. Skilled in FEA analysis, GD&T, and manufacturing optimization.",
        both: "Results-driven Full Stack Developer and CAD Engineer with 3+ years of hands-on experience in web development, embedded systems, and engineering design. Proficient in React, Python, Node.js, and CAD tools including SolidWorks, PTC Creo, Siemens NX, and FlexSim. Skilled in building scalable web applications, IoT solutions, and performing simulation & FEA analysis for manufacturing optimization.",
      };
      addWrappedText(summaries[type]);

      // === TECHNICAL SKILLS ===
      addSectionHeader("Technical Skills");

      if (type === "it" || type === "both") {
        addSkillCategory("IT & Software:", [
          "Frontend: React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS",
          "Backend: Python, Node.js, Express.js, PostgreSQL, MongoDB, REST API",
          "Embedded Systems: Arduino, Raspberry Pi, IoT, MQTT",
          "Tools: Git, Docker, Firebase, AWS",
        ]);
      }

      if (type === "core" || type === "both") {
        addSkillCategory("Engineering & CAD:", [
          "CAD Software: SolidWorks, Siemens NX, PTC Creo, AutoCAD, CATIA V5",
          "Simulation: FlexSim, FEA Analysis, CFD",
          "PLM: PTC Windchill, Product Data Management",
          "Manufacturing: GD&T, Technical Drawing, 3D Modeling, CAM",
        ]);
      }

      // === WORK EXPERIENCE ===
      addSectionHeader("Work Experience");

      const itExperiences = [
        { title: "Senior Full Stack Developer", company: "Infosys Limited, Chennai", duration: "2023 - Present", points: ["Leading development of enterprise web applications using React, TypeScript, and Node.js", "Architecting microservices and implementing CI/CD pipelines with Docker and AWS", "Managing a team of 4 junior developers and conducting code reviews"] },
        { title: "Full Stack Developer", company: "TCS (Tata Consultancy Services), Bangalore", duration: "2022 - 2023", points: ["Developed IoT dashboards and real-time monitoring systems using React and Python", "Built RESTful APIs and integrated with industrial sensors and PLCs"] },
        { title: "Software Developer", company: "Zoho Corporation, Chennai", duration: "2021 - 2022", points: ["Worked on Zoho CRM customizations and integrations", "Developed mobile applications using React Native for enterprise clients"] },
      ];

      const coreExperiences = [
        { title: "Senior CAD Design Engineer", company: "Mahindra & Mahindra, Chennai", duration: "2023 - Present", points: ["Leading powertrain component design using SolidWorks and PTC Creo", "Performing advanced FEA simulations and managing engineering changes through Windchill PLM"] },
        { title: "CAD Design Engineer", company: "Sundram Fasteners, Chennai", duration: "2022 - 2023", points: ["Designed automotive components for Tier-1 manufacturing with GD&T specifications", "Created manufacturing drawings and managed product data in enterprise PLM systems"] },
        { title: "Simulation Engineer", company: "Ashok Leyland, Chennai", duration: "2021 - 2022", points: ["Developed FlexSim simulations for assembly line optimization", "Achieved 25% throughput improvement through bottleneck analysis and layout optimization"] },
      ];

      const experiences = type === "it" ? itExperiences : type === "core" ? coreExperiences : [...itExperiences, ...coreExperiences];

      for (const exp of experiences) {
        if (y > 260) { doc.addPage(); y = margin; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...black);
        doc.text(exp.title, margin, y);
        y += 4.5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...medGray);
        doc.text(`${exp.company} | ${exp.duration}`, margin, y);
        y += 5;
        for (const point of exp.points) addBullet(point);
        y += 2;
      }

      // === EDUCATION ===
      if (y > 255) { doc.addPage(); y = margin; }
      addSectionHeader("Education");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...black);
      doc.text("Bachelor of Engineering", margin, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...medGray);
      doc.text("Mechanical / Computer Science Engineering", margin, y);
      y += 8;

      // === KEY ACHIEVEMENTS ===
      if (y > 255) { doc.addPage(); y = margin; }
      addSectionHeader("Key Achievements");
      addBullet("25+ projects completed across IT and Engineering domains");
      if (type === "core" || type === "both") addBullet("Achieved 25% throughput improvement through FlexSim simulation optimization");
      if (type === "it" || type === "both") addBullet("Led a team of 4 developers in enterprise application development");
      addBullet("Proficient in 10+ technologies and 5+ CAD tools");

      const fileNames: Record<ResumeType, string> = {
        it: "Tharanee_Tharan_IT_Resume.pdf",
        core: "Tharanee_Tharan_Core_Resume.pdf",
        both: "Tharanee_Tharan_Full_Resume.pdf",
      };
      doc.save(fileNames[type]);

      const labels: Record<ResumeType, string> = { it: "IT", core: "Core Engineering", both: "Full (IT + Core)" };
      toast({
        title: "Resume Downloaded! 📄",
        description: `${labels[type]} ATS-friendly resume has been downloaded.`,
      });
    } catch (error) {
      console.error("Resume download error:", error);
      toast({ title: "Download Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
  };

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setShowDialog(true)}>
        <Download size={18} className="mr-2" />
        Download Resume
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Choose Resume Type</DialogTitle>
            <DialogDescription>Select the version that best fits your needs.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start gap-1" onClick={() => generateResume("it")}>
              <span className="font-semibold text-sm">IT Resume</span>
              <span className="text-xs text-muted-foreground">Full Stack Development, React, Python, IoT</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start gap-1" onClick={() => generateResume("core")}>
              <span className="font-semibold text-sm">Core Engineering Resume</span>
              <span className="text-xs text-muted-foreground">CAD, SolidWorks, NX, Creo, FlexSim, PLM</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start gap-1" onClick={() => generateResume("both")}>
              <span className="font-semibold text-sm">Both (Full Resume)</span>
              <span className="text-xs text-muted-foreground">Combined IT + Core Engineering resume</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResumeButton;
