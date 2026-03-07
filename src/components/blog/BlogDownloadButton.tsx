import { useState } from "react";
import { Download, FileDown } from "lucide-react";
import { Button } from "../ui/button";
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
      const margin = 22;
      const contentWidth = pageWidth - margin * 2;

      // ─── Watermark (single elegant centered mark) ───
      const addWatermark = (d: jsPDF) => {
        d.saveGraphicsState();
        const cx = pageWidth / 2;
        const cy = pageHeight / 2;
        // Diamond decorative element
        d.setDrawColor(235, 235, 235);
        d.setLineWidth(0.3);
        const s = 8;
        d.line(cx, cy - s - 20, cx + s, cy - 20);
        d.line(cx + s, cy - 20, cx, cy + s - 20);
        d.line(cx, cy + s - 20, cx - s, cy - 20);
        d.line(cx - s, cy - 20, cx, cy - s - 20);
        // Name
        d.setFontSize(32);
        d.setFont("helvetica", "bold");
        d.setTextColor(232, 232, 232);
        d.text("Dharaneedharan SS", cx, cy + 2, { align: "center" });
        // Subtle tagline
        d.setFontSize(8);
        d.setFont("helvetica", "normal");
        d.setTextColor(215, 215, 215);
        d.text("PORTFOLIO  •  BLOG  •  ARTICLES", cx, cy + 12, { align: "center" });
        d.restoreGraphicsState();
      };

      // ─── Page Footer ───
      const addFooter = (d: jsPDF, pageNum: number, totalLabel?: string) => {
        d.setDrawColor(220, 220, 220);
        d.setLineWidth(0.2);
        d.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
        d.setFontSize(7);
        d.setFont("helvetica", "normal");
        d.setTextColor(160, 160, 160);
        d.text("© Dharaneedharan SS  |  www.dharaneedharan.dev", margin, pageHeight - 12);
        d.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 12, { align: "right" });
      };

      // ═══════════════════════════════════════
      // PAGE 1 — COVER PAGE
      // ═══════════════════════════════════════
      // Dark full-page header block
      doc.setFillColor(18, 18, 18);
      doc.rect(0, 0, pageWidth, 95, "F");

      // Accent stripe
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(0, 95, pageWidth, 3, "F");

      // Header branding
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("DHARANEEDHARAN SS  —  PORTFOLIO BLOG", margin, 18);

      // Category pill
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(59, 130, 246);
      doc.text(category.toUpperCase(), margin, 35);

      // Title on dark bg
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.setFont("helvetica", "bold");
      const coverTitleLines = doc.splitTextToSize(title, contentWidth);
      doc.text(coverTitleLines, margin, 52);
      const titleEndY = 52 + coverTitleLines.length * 11;

      // Author & date on dark bg
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(180, 180, 180);
      doc.text(`By ${author}  •  ${date}`, margin, Math.min(titleEndY + 8, 88));

      // Content area starts below accent stripe
      let yPos = 110;

      // Excerpt / intro styling
      const cleanContent = content
        .replace(/```[\s\S]*?```/g, (match) => {
          const code = match.replace(/```\w*\n?/g, "").trim();
          return `[CODE]\n${code}\n[/CODE]`;
        })
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/\|(.*)\|/g, "$1")
        .replace(/[-]{3,}/g, "")
        .replace(/\n{3,}/g, "\n\n");

      // Section counter for numbered headings
      let sectionNum = 0;

      const paragraphs = cleanContent.split("\n");
      let inCodeBlock = false;

      addWatermark(doc);

      for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) { yPos += 3; continue; }

        if (trimmed === "[CODE]") { inCodeBlock = true; continue; }
        if (trimmed === "[/CODE]") { inCodeBlock = false; yPos += 5; continue; }

        // Check for heading patterns
        const isHeading = /^#{1,3}\s+/.test(para);
        const headingText = para.replace(/^#{1,3}\s+/, "");

        if (isHeading) {
          sectionNum++;
          // Need space for heading
          if (yPos > pageHeight - 45) {
            addFooter(doc, doc.getNumberOfPages());
            doc.addPage();
            addWatermark(doc);
            yPos = 25;
          }

          yPos += 6;

          // Section number badge
          doc.setFillColor(59, 130, 246);
          doc.roundedRect(margin, yPos - 5, 10, 7, 1, 1, "F");
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text(String(sectionNum).padStart(2, "0"), margin + 5, yPos, { align: "center" });

          // Heading text
          doc.setFontSize(15);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(25, 25, 25);
          const hLines = doc.splitTextToSize(headingText, contentWidth - 16);
          doc.text(hLines, margin + 14, yPos);
          yPos += hLines.length * 7 + 2;

          // Underline accent
          doc.setDrawColor(59, 130, 246);
          doc.setLineWidth(0.6);
          doc.line(margin + 14, yPos, margin + 50, yPos);
          doc.setLineWidth(0.2);
          yPos += 6;
          continue;
        }

        if (inCodeBlock) {
          // Code block with background
          const codeLines = doc.splitTextToSize(trimmed, contentWidth - 12);
          const blockHeight = codeLines.length * 4.5 + 6;

          if (yPos + blockHeight > pageHeight - 25) {
            addFooter(doc, doc.getNumberOfPages());
            doc.addPage();
            addWatermark(doc);
            yPos = 25;
          }

          doc.setFillColor(245, 245, 245);
          doc.roundedRect(margin, yPos - 3, contentWidth, blockHeight, 2, 2, "F");
          doc.setDrawColor(220, 220, 220);
          doc.roundedRect(margin, yPos - 3, contentWidth, blockHeight, 2, 2, "S");

          // Code accent bar
          doc.setFillColor(59, 130, 246);
          doc.rect(margin, yPos - 3, 2, blockHeight, "F");

          doc.setFontSize(8);
          doc.setFont("courier", "normal");
          doc.setTextColor(60, 60, 60);
          doc.text(codeLines, margin + 6, yPos + 2);
          yPos += blockHeight + 4;
          continue;
        }

        // Bullet points styling
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          const bulletText = trimmed.replace(/^[•\-]\s*/, "");
          const bLines = doc.splitTextToSize(bulletText, contentWidth - 12);

          if (yPos + bLines.length * 5.5 > pageHeight - 25) {
            addFooter(doc, doc.getNumberOfPages());
            doc.addPage();
            addWatermark(doc);
            yPos = 25;
          }

          // Blue bullet dot
          doc.setFillColor(59, 130, 246);
          doc.circle(margin + 3, yPos - 1.2, 1.2, "F");

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(45, 45, 45);
          doc.text(bLines, margin + 8, yPos);
          yPos += bLines.length * 5.5 + 2;
          continue;
        }

        // Regular paragraph
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(45, 45, 45);
        const lines = doc.splitTextToSize(trimmed, contentWidth);

        for (const line of lines) {
          if (yPos > pageHeight - 25) {
            addFooter(doc, doc.getNumberOfPages());
            doc.addPage();
            addWatermark(doc);
            yPos = 25;
          }
          doc.text(line, margin, yPos);
          yPos += 5.5;
        }
        yPos += 2;
      }

      // Final page footer
      addFooter(doc, doc.getNumberOfPages());

      // ─── End page branding ───
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

      doc.setFillColor(59, 130, 246);
      doc.rect(cx - 20, cy + 8, 40, 1.5, "F");

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text("www.dharaneedharan.dev", cx, cy + 22, { align: "center" });
      doc.text("Full Stack Developer  •  CAD Engineer  •  IoT Specialist", cx, cy + 30, { align: "center" });

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
