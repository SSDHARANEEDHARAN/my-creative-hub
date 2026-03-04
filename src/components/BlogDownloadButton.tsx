import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface BlogDownloadButtonProps {
  postId: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  downloadCount: number;
  onDownloaded?: () => void;
}

const BlogDownloadButton = ({ postId, title, content, author, date, category, downloadCount, onDownloaded }: BlogDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const generatePDF = async () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      const addWatermark = (pageDoc: jsPDF) => {
        pageDoc.setFontSize(50);
        pageDoc.setTextColor(235, 235, 235);
        const text = "Dharaneedharan SS";
        for (let y = 30; y < pageHeight; y += 80) {
          for (let x = -20; x < pageWidth; x += 120) {
            pageDoc.text(text, x, y, { angle: 35 });
          }
        }
      };

      // Add watermark to first page
      addWatermark(doc);

      // Header bar
      doc.setFillColor(30, 30, 30);
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Dharaneedharan SS — Portfolio Blog", margin, 15);
      doc.setFontSize(8);
      doc.text(`Category: ${category}  |  ${date}`, margin, 25);
      doc.text("www.dharaneedharan.dev", pageWidth - margin, 25, { align: "right" });

      // Title
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      let yPos = 55;
      const titleLines = doc.splitTextToSize(title, contentWidth);
      doc.text(titleLines, margin, yPos);
      yPos += titleLines.length * 10 + 5;

      // Author line
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text(`By ${author}`, margin, yPos);
      yPos += 10;

      // Separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Process content - strip markdown formatting for clean PDF
      const cleanContent = content
        .replace(/```[\s\S]*?```/g, (match) => {
          const code = match.replace(/```\w*\n?/g, "").trim();
          return `[CODE]\n${code}\n[/CODE]`;
        })
        .replace(/#{1,3}\s+/g, "\n\n")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/\|(.*)\|/g, "$1")
        .replace(/[-]{3,}/g, "")
        .replace(/\n{3,}/g, "\n\n");

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);

      const paragraphs = cleanContent.split("\n");
      let inCodeBlock = false;

      for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) { yPos += 4; continue; }

        if (trimmed === "[CODE]") { inCodeBlock = true; continue; }
        if (trimmed === "[/CODE]") { inCodeBlock = false; yPos += 4; continue; }

        if (inCodeBlock) {
          doc.setFontSize(9);
          doc.setFont("courier", "normal");
          doc.setTextColor(60, 60, 60);
        } else {
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(40, 40, 40);
        }

        const lines = doc.splitTextToSize(trimmed, contentWidth);
        for (const line of lines) {
          if (yPos > pageHeight - 25) {
            // Footer on current page
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`© Dharaneedharan SS | Page ${doc.getNumberOfPages()}`, pageWidth / 2, pageHeight - 10, { align: "center" });

            doc.addPage();
            addWatermark(doc);
            yPos = 20;
          }
          doc.text(line, margin, yPos);
          yPos += inCodeBlock ? 5 : 6;
        }
      }

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`© Dharaneedharan SS | Page ${doc.getNumberOfPages()}`, pageWidth / 2, pageHeight - 10, { align: "center" });

      doc.save(`${title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.pdf`);

      // Track download
      await supabase.from("download_tracking").insert({
        content_type: "blog",
        content_id: postId,
        file_type: "pdf",
      });

      onDownloaded?.();
      toast({ description: "Blog article downloaded as PDF!" });
    } catch (err) {
      console.error("PDF generation error:", err);
      toast({ title: "Error", description: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button onClick={generatePDF} disabled={isDownloading} variant="outline" className="gap-2">
      <Download size={16} />
      {isDownloading ? "Generating..." : "Download PDF"}
      {downloadCount > 0 && (
        <span className="ml-1 px-1.5 py-0.5 bg-secondary text-secondary-foreground text-xs">
          {downloadCount}
        </span>
      )}
    </Button>
  );
};

export default BlogDownloadButton;
