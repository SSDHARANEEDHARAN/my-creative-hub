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
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // ATS-safe colors (black/dark gray only)
      const black: [number, number, number] = [0, 0, 0];
      const darkGray: [number, number, number] = [60, 60, 60];
      const medGray: [number, number, number] = [100, 100, 100];

      // --- Profile Photo (small, top-right corner) ---
      try {
        const photoData = await loadImageAsBase64(profilePhoto);
        doc.addImage(photoData, "JPEG", pageWidth - margin - 25, y, 25, 25);
      } catch {
        // Continue without photo
      }

      // --- Header (ATS: plain text, no tables) ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...black);
      doc.text("THARANEE THARAN S.S", margin, y + 7);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...darkGray);
      doc.text("Full Stack Developer & CAD Engineer", margin, y + 14);

      doc.setFontSize(9);
      doc.setTextColor(...medGray);
      doc.text("Email: tharaneetharanss@gmail.com | Phone: +91 8870086023", margin, y + 20);
      doc.text("Location: Tamil Nadu, India | LinkedIn: linkedin.com/in/dharaneedharan-ss-70941a211", margin, y + 25);
      doc.text("GitHub: github.com/SSDHARANEEDHARAN", margin, y + 30);

      y += 36;

      // --- ATS Divider (simple line) ---
      const addDivider = () => {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.4);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
      };

      // --- Section Header ---
      const addSectionHeader = (title: string) => {
        addDivider();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...black);
        doc.text(title.toUpperCase(), margin, y);
        y += 6;
      };

      // --- Wrapped text helper ---
      const addWrappedText = (text: string, fontSize = 9.5, color: [number, number, number] = darkGray) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * 4.2 + 2;
      };

      // --- Bullet point ---
      const addBullet = (text: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...darkGray);
        const lines = doc.splitTextToSize(text, contentWidth - 6);
        doc.text("•", margin + 1, y);
        doc.text(lines, margin + 6, y);
        y += lines.length * 4.2 + 1;
      };

      // === PROFESSIONAL SUMMARY ===
      addSectionHeader("Professional Summary");
      addWrappedText(
        "Results-driven Full Stack Developer and CAD Engineer with 3+ years of hands-on experience in web development, embedded systems, and engineering design. Proficient in React, Python, Node.js, and CAD tools including SolidWorks, PTC Creo, Siemens NX, and FlexSim. Skilled in building scalable web applications, IoT solutions, and performing simulation & FEA analysis for manufacturing optimization."
      );

      // === TECHNICAL SKILLS ===
      addSectionHeader("Technical Skills");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...black);
      doc.text("IT & Software:", margin, y);
      y += 5;
      addBullet("Frontend: React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS");
      addBullet("Backend: Python, Node.js, Express.js, PostgreSQL, MongoDB, REST API");
      addBullet("Embedded Systems: Arduino, Raspberry Pi, IoT, MQTT");
      addBullet("Tools: Git, Docker, Firebase, AWS");
      y += 2;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...black);
      doc.text("Engineering & CAD:", margin, y);
      y += 5;
      addBullet("CAD Software: SolidWorks, Siemens NX, PTC Creo, AutoCAD, CATIA V5");
      addBullet("Simulation: FlexSim, FEA Analysis, CFD");
      addBullet("PLM: PTC Windchill, Product Data Management");
      addBullet("Manufacturing: GD&T, Technical Drawing, 3D Modeling, CAM");

      // === WORK EXPERIENCE ===
      addSectionHeader("Work Experience");

      const experiences = [
        {
          title: "Senior Full Stack Developer",
          company: "Infosys Limited, Chennai",
          duration: "2023 - Present",
          points: [
            "Leading development of enterprise web applications using React, TypeScript, and Node.js",
            "Architecting microservices and implementing CI/CD pipelines with Docker and AWS",
            "Managing a team of 4 junior developers and conducting code reviews",
          ],
        },
        {
          title: "Senior CAD Design Engineer",
          company: "Mahindra & Mahindra, Chennai",
          duration: "2023 - Present",
          points: [
            "Leading powertrain component design using SolidWorks and PTC Creo",
            "Performing advanced FEA simulations and managing engineering changes through Windchill PLM",
          ],
        },
        {
          title: "Full Stack Developer",
          company: "TCS (Tata Consultancy Services), Bangalore",
          duration: "2022 - 2023",
          points: [
            "Developed IoT dashboards and real-time monitoring systems using React and Python",
            "Built RESTful APIs and integrated with industrial sensors and PLCs",
          ],
        },
        {
          title: "CAD Design Engineer",
          company: "Sundram Fasteners, Chennai",
          duration: "2022 - 2023",
          points: [
            "Designed automotive components for Tier-1 manufacturing with GD&T specifications",
            "Created manufacturing drawings and managed product data in enterprise PLM systems",
          ],
        },
        {
          title: "Simulation Engineer",
          company: "Ashok Leyland, Chennai",
          duration: "2021 - 2022",
          points: [
            "Developed FlexSim simulations for assembly line optimization",
            "Achieved 25% throughput improvement through bottleneck analysis and layout optimization",
          ],
        },
        {
          title: "Software Developer",
          company: "Zoho Corporation, Chennai",
          duration: "2021 - 2022",
          points: [
            "Worked on Zoho CRM customizations and integrations",
            "Developed mobile applications using React Native for enterprise clients",
          ],
        },
      ];

      for (const exp of experiences) {
        // Check for page break
        if (y > 260) {
          doc.addPage();
          y = margin;
        }

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

        for (const point of exp.points) {
          addBullet(point);
        }
        y += 2;
      }

      // === EDUCATION ===
      if (y > 255) {
        doc.addPage();
        y = margin;
      }
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
      if (y > 255) {
        doc.addPage();
        y = margin;
      }
      addSectionHeader("Key Achievements");
      addBullet("25+ projects completed across IT and Engineering domains");
      addBullet("Achieved 25% throughput improvement through FlexSim simulation optimization");
      addBullet("Led a team of 4 developers in enterprise application development");
      addBullet("Proficient in 10+ technologies and 5+ CAD tools");

      // Save PDF
      doc.save("Tharanee_Tharan_Resume.pdf");

      toast({
        title: "Resume Downloaded! 📄",
        description: "ATS-friendly PDF resume has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Resume download error:", error);
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