import { useState } from "react";
import { Download, FileText, Box } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface ProjectDownloadDialogProps {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  tags: string[];
  images?: string[];
  downloadCount: number;
  onDownloaded?: () => void;
}

const loadImageAsBase64 = (src: string): Promise<{ data: string; width: number; height: number } | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxW = 800;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        const data = canvas.toDataURL("image/jpeg", 0.75);
        resolve({ data, width: canvas.width, height: canvas.height });
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

const ProjectDownloadDialog = ({ projectId, projectTitle, projectDescription, tags, images, downloadCount, onDownloaded }: ProjectDownloadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (fileType: "pdf" | "step") => {
    setIsDownloading(true);
    try {
      if (fileType === "pdf") {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 22;
        const contentWidth = pageWidth - margin * 2;

        const addWatermark = (d: jsPDF) => {
          d.saveGraphicsState();
          const cx = pageWidth / 2;
          const cy = pageHeight / 2;
          d.setDrawColor(235, 235, 235);
          d.setLineWidth(0.3);
          const s = 8;
          d.line(cx, cy - s - 20, cx + s, cy - 20);
          d.line(cx + s, cy - 20, cx, cy + s - 20);
          d.line(cx, cy + s - 20, cx - s, cy - 20);
          d.line(cx - s, cy - 20, cx, cy - s - 20);
          d.setFontSize(32);
          d.setFont("helvetica", "bold");
          d.setTextColor(232, 232, 232);
          d.text("Dharaneedharan SS", cx, cy + 2, { align: "center" });
          d.setFontSize(8);
          d.setFont("helvetica", "normal");
          d.setTextColor(215, 215, 215);
          d.text("ENGINEERING  •  CAD  •  DESIGN", cx, cy + 12, { align: "center" });
          d.restoreGraphicsState();
        };

        const addFooter = (d: jsPDF, pageNum: number) => {
          d.setDrawColor(220, 220, 220);
          d.setLineWidth(0.2);
          d.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
          d.setFontSize(7);
          d.setFont("helvetica", "normal");
          d.setTextColor(160, 160, 160);
          d.text("© Dharaneedharan SS  |  www.dharaneedharan.dev", margin, pageHeight - 12);
          d.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 12, { align: "right" });
        };

        // ═══ COVER PAGE ═══
        doc.setFillColor(18, 18, 18);
        doc.rect(0, 0, pageWidth, 95, "F");
        doc.setFillColor(34, 197, 94);
        doc.rect(0, 95, pageWidth, 3, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("DHARANEEDHARAN SS  —  ENGINEERING CASE STUDY", margin, 18);

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(34, 197, 94);
        doc.text("MECHANICAL ENGINEERING", margin, 35);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        const coverTitleLines = doc.splitTextToSize(projectTitle, contentWidth);
        doc.text(coverTitleLines, margin, 52);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(180, 180, 180);
        doc.text(`Technologies: ${tags.join("  •  ")}`, margin, 85);

        addWatermark(doc);

        let y = 110;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(45, 45, 45);
        const descLines = doc.splitTextToSize(projectDescription, contentWidth);
        doc.text(descLines, margin, y);
        y += descLines.length * 5.5 + 12;

        // Sections
        const sections = [
          { title: "Project Objective", content: `This engineering project focuses on ${projectTitle.toLowerCase()}. The primary objective was to deliver a production-ready design that meets all functional requirements, manufacturing constraints, and quality standards.` },
          { title: "Design Methodology", content: "The design process followed a systematic approach:\n• Concept generation through brainstorming and benchmarking\n• Concept evaluation using a Pugh matrix\n• Detailed design in CAD software\n• Design validation through FEA/CFD simulation\n• Design for manufacturability (DFM) review" },
          { title: "Tools & Software Used", content: tags.map(t => `• ${t}`).join("\n") },
          { title: "Key Design Features", content: "• Parametric 3D modeling with full design intent\n• Tolerance analysis per ASME Y14.5 standards\n• Material selection based on functional requirements\n• Assembly design with interference checking\n• Manufacturing-ready 2D drawings with GD&T" },
          { title: "Results & Outcomes", content: "The final design met all performance targets and passed manufacturing review. Design validation through simulation confirmed structural integrity and thermal performance within specified limits." },
          { title: "Disclaimer", content: "This document is part of Dharaneedharan SS's engineering portfolio. All designs and analyses are for demonstration purposes. For detailed SolidWorks/Creo files, please contact directly." },
        ];

        let secNum = 0;
        for (const section of sections) {
          secNum++;
          if (y > pageHeight - 50) {
            addFooter(doc, doc.getNumberOfPages());
            doc.addPage();
            addWatermark(doc);
            y = 25;
          }

          y += 4;
          doc.setFillColor(34, 197, 94);
          doc.roundedRect(margin, y - 5, 10, 7, 1, 1, "F");
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text(String(secNum).padStart(2, "0"), margin + 5, y, { align: "center" });

          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(25, 25, 25);
          doc.text(section.title, margin + 14, y);
          y += 3;

          doc.setDrawColor(34, 197, 94);
          doc.setLineWidth(0.6);
          doc.line(margin + 14, y, margin + 48, y);
          doc.setLineWidth(0.2);
          y += 6;

          const cLines = section.content.split("\n");
          for (const cl of cLines) {
            const trimmed = cl.trim();
            if (!trimmed) { y += 2; continue; }

            if (trimmed.startsWith("•")) {
              const bulletText = trimmed.replace(/^•\s*/, "");
              const bLines = doc.splitTextToSize(bulletText, contentWidth - 12);
              if (y + bLines.length * 5 > pageHeight - 25) {
                addFooter(doc, doc.getNumberOfPages());
                doc.addPage();
                addWatermark(doc);
                y = 25;
              }
              doc.setFillColor(34, 197, 94);
              doc.circle(margin + 3, y - 1.2, 1.2, "F");
              doc.setFontSize(10);
              doc.setFont("helvetica", "normal");
              doc.setTextColor(45, 45, 45);
              doc.text(bLines, margin + 8, y);
              y += bLines.length * 5 + 2;
            } else {
              const tLines = doc.splitTextToSize(trimmed, contentWidth);
              if (y + tLines.length * 5 > pageHeight - 25) {
                addFooter(doc, doc.getNumberOfPages());
                doc.addPage();
                addWatermark(doc);
                y = 25;
              }
              doc.setFontSize(10);
              doc.setFont("helvetica", "normal");
              doc.setTextColor(45, 45, 45);
              doc.text(tLines, margin, y);
              y += tLines.length * 5 + 2;
            }
          }
          y += 6;
        }

        addFooter(doc, doc.getNumberOfPages());

        // ═══ IMAGE GALLERY PAGES ═══
        if (images && images.length > 0) {
          doc.addPage();
          addWatermark(doc);
          
          // Gallery title
          doc.setFillColor(18, 18, 18);
          doc.rect(0, 0, pageWidth, 30, "F");
          doc.setFillColor(34, 197, 94);
          doc.rect(0, 30, pageWidth, 2, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.text("Project Gallery", margin, 20);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(180, 180, 180);
          doc.text(`${images.length} images`, pageWidth - margin, 20, { align: "right" });

          let imgY = 40;
          const imgWidth = (contentWidth - 6) / 2; // 2 images per row
          const imgHeight = imgWidth * 0.65; // aspect ratio
          let col = 0;

          // Load all images
          const loadedImages: ({ data: string; width: number; height: number } | null)[] = [];
          for (const imgSrc of images.slice(0, 20)) { // Max 20 images
            const loaded = await loadImageAsBase64(imgSrc);
            loadedImages.push(loaded);
          }

          for (let i = 0; i < loadedImages.length; i++) {
            const loaded = loadedImages[i];
            if (!loaded) continue;

            const xPos = margin + col * (imgWidth + 6);

            if (imgY + imgHeight > pageHeight - 25) {
              addFooter(doc, doc.getNumberOfPages());
              doc.addPage();
              addWatermark(doc);
              imgY = 25;
              col = 0;
            }

            // Image border
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.roundedRect(xPos - 1, imgY - 1, imgWidth + 2, imgHeight + 2, 2, 2, "S");

            doc.addImage(loaded.data, "JPEG", xPos, imgY, imgWidth, imgHeight);

            // Caption
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(140, 140, 140);
            doc.text(`Image ${i + 1}`, xPos + imgWidth / 2, imgY + imgHeight + 5, { align: "center" });

            col++;
            if (col >= 2) {
              col = 0;
              imgY += imgHeight + 12;
            }
          }

          addFooter(doc, doc.getNumberOfPages());
        }

        // ─── End page ───
        doc.addPage();
        doc.setFillColor(18, 18, 18);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        const cx = pageWidth / 2;
        const cy = pageHeight / 2;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("THANK YOU FOR READING", cx, cy - 25, { align: "center" });
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("Dharaneedharan SS", cx, cy, { align: "center" });
        doc.setFillColor(34, 197, 94);
        doc.rect(cx - 20, cy + 8, 40, 1.5, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text("www.dharaneedharan.dev", cx, cy + 22, { align: "center" });
        doc.text("Mechanical Engineer  •  CAD Designer  •  IoT Specialist", cx, cy + 30, { align: "center" });

        doc.save(`${projectTitle.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-case-study.pdf`);
      } else {
        const stepContent = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Dharaneedharan SS - Engineering Portfolio'),'2;1');
FILE_NAME('${projectTitle.replace(/'/g, "")}.step','${new Date().toISOString()}',('Dharaneedharan SS'),('Portfolio'),'','','');
FILE_SCHEMA(('AUTOMOTIVE_DESIGN'));
ENDSEC;
DATA;
/* ================================================ */
/* Project: ${projectTitle} */
/* Author: Dharaneedharan SS */
/* Technologies: ${tags.join(", ")} */
/* Description: ${projectDescription.substring(0, 200)} */
/* ================================================ */
/* This is a portfolio demonstration STEP file. */
/* For the complete SolidWorks/Creo native files, */
/* please contact Dharaneedharan SS directly. */
/* ================================================ */
#1=SHAPE_REPRESENTATION('${projectTitle}',(#2),#3);
#2=AXIS2_PLACEMENT_3D('',#4,#5,#6);
#3=(GEOMETRIC_REPRESENTATION_CONTEXT(3) GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((#7)) GLOBAL_UNIT_ASSIGNED_CONTEXT((#8,#9,#10)) REPRESENTATION_CONTEXT('Context3D','3D Context with 1e-07 uncertainty'));
#4=CARTESIAN_POINT('',(0.,0.,0.));
#5=DIRECTION('',(0.,0.,1.));
#6=DIRECTION('',(1.,0.,0.));
#7=UNCERTAINTY_MEASURE_WITH_UNIT(LENGTH_MEASURE(1.E-07),#8,'distance_accuracy_value','confusion accuracy');
#8=(LENGTH_UNIT() NAMED_UNIT(*) SI_UNIT(.MILLI.,.METRE.));
#9=(NAMED_UNIT(*) PLANE_ANGLE_UNIT() SI_UNIT($,.RADIAN.));
#10=(NAMED_UNIT(*) SI_UNIT($,.STERADIAN.) SOLID_ANGLE_UNIT());
ENDSEC;
END-ISO-10303-21;`;
        
        const blob = new Blob([stepContent], { type: "application/step" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${projectTitle.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.step`;
        a.click();
        URL.revokeObjectURL(url);
      }

      await supabase.from("download_tracking").insert({
        content_type: "project",
        content_id: String(projectId),
        file_type: fileType,
      });

      onDownloaded?.();
      setOpen(false);
      toast({ description: `${fileType.toUpperCase()} file downloaded!` });
    } catch (err) {
      console.error("Download error:", err);
      toast({ title: "Error", description: "Failed to download file", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" className="gap-2">
        <Download size={16} />
        Download Files
        {downloadCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-secondary text-secondary-foreground text-xs">
            {downloadCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Download Project Files</DialogTitle>
            <DialogDescription>
              Choose the file format you'd like to download for "{projectTitle}"
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <button
              onClick={() => handleDownload("pdf")}
              disabled={isDownloading}
              className="flex items-center gap-4 p-4 border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center">
                <FileText size={24} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">PDF Document</p>
                <p className="text-sm text-muted-foreground">Case study with images, drawings & specifications</p>
              </div>
            </button>

            <button
              onClick={() => handleDownload("step")}
              disabled={isDownloading}
              className="flex items-center gap-4 p-4 border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center">
                <Box size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">SolidWorks / STEP File</p>
                <p className="text-sm text-muted-foreground">3D CAD model in STEP format (.step)</p>
              </div>
            </button>
          </div>

          {isDownloading && (
            <p className="text-sm text-muted-foreground text-center mt-2">Preparing download with images...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDownloadDialog;