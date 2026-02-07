import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import profilePhoto from "@/assets/profile-photo.jpg";

interface ResumeButtonProps {
  variant?: "hero" | "heroOutline" | "default";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
}

const ResumeButton = ({ variant = "hero", size = "lg", className = "" }: ResumeButtonProps) => {

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
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  const handleDownload = async () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Colors
      const darkColor = [30, 30, 30] as const;
      const accentColor = [50, 50, 50] as const;
      const mutedColor = [120, 120, 120] as const;

      // --- Header with Photo ---
      try {
        const photoData = await loadImageAsBase64(profilePhoto);
        doc.addImage(photoData, "JPEG", margin, y, 30, 30);
      } catch {
        // If photo fails, continue without it
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...darkColor);
      doc.text("THARANEE THARAN S.S", margin + 36, y + 10);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(...accentColor);
      doc.text("Full Stack Developer & CAD Engineer", margin + 36, y + 18);

      doc.setFontSize(9);
      doc.setTextColor(...mutedColor);
      doc.text("tharaneetharan@email.com  |  Tamil Nadu, India  |  3+ Years Experience", margin + 36, y + 25);

      y += 38;

      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // --- Summary ---
      const addSection = (title: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(...darkColor);
        doc.text(title, margin, y);
        y += 2;
        doc.setDrawColor(50, 50, 50);
        doc.setLineWidth(0.8);
        doc.line(margin, y, margin + doc.getTextWidth(title), y);
        y += 6;
      };

      addSection("PROFESSIONAL SUMMARY");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...accentColor);
      const summary = "Full-stack developer and CAD engineer with 3+ years of expertise in React, Python, Embedded Systems, and engineering tools like SolidWorks, FlexSim, NX, Creo, and PTC Windchill. Passionate about building modern web applications and designing engineering solutions.";
      const summaryLines = doc.splitTextToSize(summary, contentWidth);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 4.5 + 6;

      // --- IT Skills ---
      addSection("IT & SOFTWARE SKILLS");
      const itSkills = [
        { name: "React / TypeScript", level: "90%" },
        { name: "Python / Node.js", level: "85%" },
        { name: "Embedded Systems (Arduino, IoT)", level: "80%" },
        { name: "Web Development (HTML, CSS, JS)", level: "88%" },
        { name: "App Development", level: "82%" },
      ];

      itSkills.forEach((skill) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...accentColor);
        doc.text(`• ${skill.name}`, margin + 2, y);
        doc.setTextColor(...mutedColor);
        doc.text(skill.level, margin + contentWidth - 10, y);
        y += 5;
      });
      y += 4;

      // --- Engineering Skills ---
      addSection("ENGINEERING & CAD SKILLS");
      const engSkills = [
        { name: "SolidWorks", level: "92%" },
        { name: "FlexSim (Simulation)", level: "88%" },
        { name: "Siemens NX", level: "85%" },
        { name: "PTC Creo", level: "87%" },
        { name: "PTC Windchill (PLM)", level: "83%" },
      ];

      engSkills.forEach((skill) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...accentColor);
        doc.text(`• ${skill.name}`, margin + 2, y);
        doc.setTextColor(...mutedColor);
        doc.text(skill.level, margin + contentWidth - 10, y);
        y += 5;
      });
      y += 4;

      // --- Technologies ---
      addSection("TECHNOLOGIES");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...accentColor);
      const techs = "JavaScript, TypeScript, Node.js, MongoDB, PostgreSQL, Docker, Git, REST API, Arduino, Raspberry Pi, IoT, CAD Design, 3D Modeling, Simulation, PLM, FEA Analysis, GD&T, Technical Drawing";
      const techLines = doc.splitTextToSize(techs, contentWidth);
      doc.text(techLines, margin, y);
      y += techLines.length * 4.5 + 6;

      // --- Work Experience ---
      addSection("WORK EXPERIENCE");
      const experiences = [
        { title: "Senior Full Stack Developer", company: "Infosys Limited", duration: "2023 - Present", location: "Chennai" },
        { title: "Full Stack Developer", company: "TCS", duration: "2022 - 2023", location: "Bangalore" },
        { title: "Senior CAD Design Engineer", company: "Mahindra & Mahindra", duration: "2023 - Present", location: "Chennai" },
        { title: "CAD Design Engineer", company: "Sundram Fasteners", duration: "2022 - 2023", location: "Chennai" },
        { title: "Simulation Engineer", company: "Ashok Leyland", duration: "2021 - 2022", location: "Chennai" },
      ];

      experiences.forEach((exp) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...darkColor);
        doc.text(exp.title, margin + 2, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...mutedColor);
        doc.text(`${exp.company}  |  ${exp.location}  |  ${exp.duration}`, margin + 2, y + 4.5);
        y += 11;
      });
      y += 4;

      // --- Education ---
      addSection("EDUCATION");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...darkColor);
      doc.text("Bachelor's Degree in Engineering", margin + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...mutedColor);
      doc.text("Mechanical / Computer Science", margin + 2, y + 4.5);

      // Save
      doc.save("Tharanee_Tharan_Resume.pdf");

      toast({
        title: "Resume Downloaded!",
        description: "Your professional PDF resume has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={handleDownload}>
      <Download size={18} className="mr-2" />
      Download Resume
    </Button>
  );
};

export default ResumeButton;