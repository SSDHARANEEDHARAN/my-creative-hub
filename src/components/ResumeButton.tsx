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

type ResumeType = "mechanical" | "both";

const ResumeButton = ({ variant = "hero", size = "lg", className = "" }: ResumeButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const downloadMechanicalPdf = () => {
    setShowDialog(false);
    const link = document.createElement("a");
    link.href = "/Dharanee_Dharan_Resume.pdf";
    link.download = "Dharanee_Dharan_Mechanical_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Resume Downloaded! 📄",
      description: "Mechanical resume has been downloaded.",
    });
  };

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

  const drawPageBorder = (doc: jsPDF) => {
    const pageWidth = 210;
    const pageHeight = 297;
    const bm = 8;
    const cornerSize = 18;
    doc.setDrawColor(100, 120, 160);
    doc.setLineWidth(1.2);
    doc.rect(bm, bm, pageWidth - bm * 2, pageHeight - bm * 2);
    doc.setLineWidth(0.4);
    doc.rect(bm + 2, bm + 2, pageWidth - (bm + 2) * 2, pageHeight - (bm + 2) * 2);
    const drawCorner = (cx: number, cy: number, flipX: number, flipY: number) => {
      doc.setDrawColor(100, 120, 160);
      doc.setLineWidth(0.8);
      doc.line(cx, cy, cx + cornerSize * flipX, cy);
      doc.line(cx, cy, cx, cy + cornerSize * flipY);
      const sq = 4;
      doc.setFillColor(100, 120, 160);
      doc.rect(cx - (flipX < 0 ? sq : 0), cy - (flipY < 0 ? sq : 0), sq, sq, "F");
    };
    drawCorner(bm, bm, 1, 1);
    drawCorner(pageWidth - bm, bm, -1, 1);
    drawCorner(bm, pageHeight - bm, 1, -1);
    drawCorner(pageWidth - bm, pageHeight - bm, -1, -1);
  };

  const generateBothResume = async () => {
    setShowDialog(false);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const bm = 8;
      const margin = bm + 8;
      const contentWidth = pageWidth - margin * 2;
      let y = margin + 4;

      const black: [number, number, number] = [0, 0, 0];
      const darkGray: [number, number, number] = [60, 60, 60];
      const medGray: [number, number, number] = [100, 100, 100];
      const headerBg: [number, number, number] = [210, 220, 235];

      drawPageBorder(doc);

      try {
        const photoData = await loadImageAsBase64(profilePhoto);
        doc.addImage(photoData, "PNG", pageWidth - margin - 25, y, 25, 25);
      } catch { /* continue */ }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...black);
      doc.text("DHARANEEDHARAN S.S", margin, y + 7);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...darkGray);
      doc.text("Mechatronics Design Engineer & Full Stack Developer", margin, y + 14);

      doc.setFontSize(9);
      doc.setTextColor(...medGray);
      doc.text("Email: tharaneetharanss@gmail.com | Phone: +91 8870086023", margin, y + 20);
      doc.text("Location: Namakkal, India", margin, y + 25);
      y += 35;

      const checkPageBreak = (needed = 20) => {
        if (y > 275 - needed) {
          doc.addPage();
          drawPageBorder(doc);
          y = margin + 4;
        }
      };

      const addSectionHeader = (title: string) => {
        checkPageBreak(15);
        doc.setFillColor(...headerBg);
        doc.rect(margin, y - 4, contentWidth, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...black);
        doc.text(title.toUpperCase(), margin + 2, y + 1);
        y += 8;
      };

      const addWrappedText = (text: string, fontSize = 9.5, color: [number, number, number] = darkGray) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, contentWidth);
        for (const line of lines) {
          checkPageBreak(5);
          doc.text(line, margin, y);
          y += 4.2;
        }
        y += 2;
      };

      const addBullet = (text: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...darkGray);
        const lines = doc.splitTextToSize(text, contentWidth - 6);
        for (let i = 0; i < lines.length; i++) {
          checkPageBreak(5);
          if (i === 0) doc.text("•", margin + 1, y);
          doc.text(lines[i], margin + 6, y);
          y += 4.2;
        }
        y += 1;
      };

      const addSkillCategory = (label: string, bullets: string[]) => {
        checkPageBreak(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...black);
        doc.text(label, margin, y);
        y += 5;
        bullets.forEach(b => addBullet(b));
        y += 2;
      };

      addSectionHeader("Professional Summary");
      addWrappedText("Results-driven Mechatronics Design Engineer and Full Stack Developer with 4.5 years of hands-on experience in web development, embedded systems, and engineering design. Proficient in React, Python, Node.js, and CAD tools including SolidWorks, PTC Creo, Siemens NX, and FlexSim. Skilled in building scalable web applications, IoT solutions, and performing simulation & FEA analysis for manufacturing optimization.");

      addSectionHeader("Technical Skills");
      addSkillCategory("IT & Software:", [
        "Frontend: React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS",
        "Backend: Python, Node.js, Express.js, PostgreSQL, MongoDB, REST API",
        "Embedded Systems: Arduino, Raspberry Pi, IoT, MQTT",
        "Tools: Git, Docker, Firebase, AWS",
      ]);
      addSkillCategory("Engineering & CAD:", [
        "CAD Software: SolidWorks, Siemens NX, PTC Creo, AutoCAD, CATIA V5",
        "Simulation: FlexSim, FEA Analysis, CFD",
        "PLM: PTC Windchill, Product Data Management",
        "Manufacturing: GD&T, Technical Drawing, 3D Modeling, CAM",
      ]);

      addSectionHeader("Work Experience");
      const experiences = [
        { title: "Mechatronics Design Engineer", company: "Janatics India Pvt Ltd, Coimbatore", duration: "Sep 2023 – Present", points: ["Designed Industry 4.0 based mechatronics systems, robotics, and cobot trainer kits", "Developed PLC/HMI integrated automation and IIoT solutions"] },
        { title: "Engine & ECU Diagnostics", company: "TV Sundram Iyengar & Sons Pvt Ltd, Namakkal", duration: "2020 – 2021", points: ["Performed engine and ECU diagnostics for automotive systems"] },
      ];
      for (const exp of experiences) {
        checkPageBreak(20);
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

      checkPageBreak(20);
      addSectionHeader("Education");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...black);
      doc.text("B.E. Mechanical Engineering", margin, y);
      y += 8;

      checkPageBreak(20);
      addSectionHeader("Key Achievements");
      addBullet("4.5 years of experience across IT and Engineering domains");
      addBullet("25+ projects completed");
      addBullet("Proficient in 10+ technologies and 5+ CAD tools");

      doc.save("Dharaneedharan_Full_Resume.pdf");
      toast({
        title: "Resume Downloaded! 📄",
        description: "Full (IT + Mechanical) resume has been downloaded.",
      });
    } catch (error) {
      console.error("Resume download error:", error);
      toast({ title: "Download Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
  };

  const handleSelect = (type: ResumeType) => {
    if (type === "mechanical") downloadMechanicalPdf();
    else generateBothResume();
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
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start gap-1" onClick={() => handleSelect("mechanical")}>
              <span className="font-semibold text-sm">Mechanical Resume</span>
              <span className="text-xs text-muted-foreground">Mechatronics, CAD, SolidWorks, NX, Creo</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start gap-1" onClick={() => handleSelect("both")}>
              <span className="font-semibold text-sm">Both (Full Resume)</span>
              <span className="text-xs text-muted-foreground">Combined IT + Mechanical resume</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResumeButton;
