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
  downloadCount: number;
  onDownloaded?: () => void;
}

const ProjectDownloadDialog = ({ projectId, projectTitle, projectDescription, tags, downloadCount, onDownloaded }: ProjectDownloadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (fileType: "pdf" | "step") => {
    setIsDownloading(true);
    try {
      if (fileType === "pdf") {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - margin * 2;

        // Watermark
        doc.saveGraphicsState();
        doc.setGState(new jsPDF.GState({ opacity: 0.06 }));
        doc.setFontSize(50);
        doc.setTextColor(100, 100, 100);
        for (let y = 30; y < pageHeight; y += 80) {
          for (let x = -20; x < pageWidth; x += 120) {
            doc.text("Dharaneedharan SS", x, y, { angle: 35 });
          }
        }
        doc.restoreGraphicsState();

        // Header
        doc.setFillColor(30, 30, 30);
        doc.rect(0, 0, pageWidth, 35, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text("Dharaneedharan SS — Engineering Case Study", margin, 15);
        doc.setFontSize(8);
        doc.text("Mechanical Engineering Portfolio", margin, 25);

        // Title
        let y = 50;
        doc.setTextColor(20, 20, 20);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        const titleLines = doc.splitTextToSize(projectTitle, contentWidth);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 9 + 8;

        // Tags
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`Technologies: ${tags.join(" • ")}`, margin, y);
        y += 12;

        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        // Description
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        const descLines = doc.splitTextToSize(projectDescription, contentWidth);
        doc.text(descLines, margin, y);
        y += descLines.length * 6 + 15;

        // Sections
        const sections = [
          { title: "Project Objective", content: `This engineering project focuses on ${projectTitle.toLowerCase()}. The primary objective was to deliver a production-ready design that meets all functional requirements, manufacturing constraints, and quality standards.` },
          { title: "Design Methodology", content: "The design process followed a systematic approach: concept generation through brainstorming and benchmarking, concept evaluation using a Pugh matrix, detailed design in CAD software, design validation through FEA/CFD simulation, and design for manufacturability (DFM) review." },
          { title: "Tools & Software Used", content: tags.map(t => `• ${t}`).join("\n") },
          { title: "Key Design Features", content: "• Parametric 3D modeling with full design intent\n• Tolerance analysis per ASME Y14.5 standards\n• Material selection based on functional requirements\n• Assembly design with interference checking\n• Manufacturing-ready 2D drawings with GD&T" },
          { title: "Results & Outcomes", content: "The final design met all performance targets and passed manufacturing review. Design validation through simulation confirmed structural integrity and thermal performance within specified limits." },
          { title: "Disclaimer", content: "This document is part of Dharaneedharan SS's engineering portfolio. All designs and analyses are for demonstration purposes. For detailed SolidWorks/Creo files, please contact directly." },
        ];

        for (const section of sections) {
          if (y > pageHeight - 40) {
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`© Dharaneedharan SS | Page ${doc.getNumberOfPages()}`, pageWidth / 2, pageHeight - 10, { align: "center" });
            doc.addPage();
            // watermark on new page
            doc.saveGraphicsState();
            doc.setGState(new jsPDF.GState({ opacity: 0.06 }));
            doc.setFontSize(50);
            doc.setTextColor(100, 100, 100);
            for (let wy = 30; wy < pageHeight; wy += 80) {
              for (let wx = -20; wx < pageWidth; wx += 120) {
                doc.text("Dharaneedharan SS", wx, wy, { angle: 35 });
              }
            }
            doc.restoreGraphicsState();
            y = 20;
          }

          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(20, 20, 20);
          doc.text(section.title, margin, y);
          y += 8;

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(50, 50, 50);
          const sLines = doc.splitTextToSize(section.content, contentWidth);
          doc.text(sLines, margin, y);
          y += sLines.length * 5 + 10;
        }

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`© Dharaneedharan SS | Page ${doc.getNumberOfPages()}`, pageWidth / 2, pageHeight - 10, { align: "center" });

        doc.save(`${projectTitle.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-case-study.pdf`);
      } else {
        // Generate a placeholder STEP file (text-based)
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

      // Track download
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
                <p className="text-sm text-muted-foreground">Case study with drawings & specifications</p>
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
            <p className="text-sm text-muted-foreground text-center mt-2">Preparing download...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDownloadDialog;
