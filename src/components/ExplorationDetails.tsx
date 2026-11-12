import { useState } from "react";
import { Lock, Mail, BookOpen, LayoutDashboard, FileText, Download, ExternalLink, CheckCircle2, Film } from "lucide-react";
import { Link } from "react-router-dom";
import { CARTESIAN_ID } from "@/lib/buyerPurchases";
import { Button } from "@/components/ui/button";
import StyledArticleRenderer from "@/components/StyledArticleRenderer";
import ExplorationInquiryModal from "@/components/ExplorationInquiryModal";
import type { Exploration } from "@/components/ExplorationCard";
import { explorationDocuments } from "@/components/ExplorationCard";
import ExplorationOffers from "@/components/ExplorationOffers";
import { drivePreviewUrl } from "@/lib/siteOverrides";

const ExplorationDetails = ({ item, preview = false }: { item: Exploration; preview?: boolean }) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const videos = (Array.isArray(item.drive_videos) ? item.drive_videos : [])
    .filter((video) => video?.url && drivePreviewUrl(video.url))
    .map((video) => ({ ...video, previewUrl: drivePreviewUrl(video.url)! }));
  return <div className="min-w-0 space-y-8">
    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="border border-border px-2 py-1">{item.status}</span>{item.tags?.map(tag => <span key={tag} className="px-2 py-1">#{tag}</span>)}</div>
    <section><h2 className="font-display text-2xl font-semibold mb-4">About this exploration</h2><p className="whitespace-pre-line text-muted-foreground leading-relaxed">{item.description}</p></section>
    {videos.length > 0 && <section aria-labelledby="exploration-videos-title" className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Media</p>
        <h2 id="exploration-videos-title" className="mt-2 font-display text-2xl font-semibold flex items-center gap-2"><Film size={20} /> Exploration videos</h2>
      </div>
      <div className={videos.length > 1 ? "grid gap-5 md:grid-cols-2" : ""}>
        {videos.map((video) => <article key={video.url} className="min-w-0 border border-border p-3 sm:p-4">
          <div className="aspect-video bg-muted">
            <iframe src={video.previewUrl} title={video.name} className="h-full w-full border-0" allow="autoplay; fullscreen" allowFullScreen />
          </div>
          <h3 className="mt-3 font-medium break-words">{video.name}</h3>
        </article>)}
      </div>
    </section>}
    {explorationDocuments(item).length > 0 && <section aria-labelledby="technical-documents-title" className="border border-border p-5 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Documentation</p>
          <h2 id="technical-documents-title" className="mt-3 font-display text-2xl font-semibold flex items-center gap-2"><FileText size={20} /> Technical documents</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Official reference files for this exploration. Open a document to read it, or use the download icon to save a copy.</p>
          <ul className="mt-5 space-y-2">
            {explorationDocuments(item).map((doc) => (
              <li key={doc.url} className="flex items-start gap-2 text-sm"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><span>{doc.name}</span></li>
            ))}
          </ul>
        </div>
        <ol className="relative space-y-4 border-l-2 border-foreground pl-6 sm:pl-8">
          {explorationDocuments(item).map((doc, index) => (
            <li key={doc.url} className="relative border border-border bg-muted/40 p-4">
              <span className="absolute -left-[2.35rem] sm:-left-[2.85rem] top-4 grid h-8 w-8 place-items-center bg-foreground text-sm font-bold text-background ring-4 ring-background">{index + 1}</span>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold break-words">{doc.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">PDF document</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button asChild variant="outline" size="icon" aria-label={`Open ${doc.name} full screen`}><a href={doc.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /></a></Button>
                  <Button asChild size="icon" aria-label={`Download ${doc.name}`}><a href={doc.url} download target="_blank" rel="noopener noreferrer"><Download size={16} /></a></Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>}
    {item.technical_content && <StyledArticleRenderer content={item.technical_content} />}
    {item.paid_parts && <section className="border-y border-border py-6 space-y-3">
      <h2 className="font-display text-2xl font-semibold">Products & purchased files</h2>
      <p className="text-muted-foreground flex items-center gap-2"><Lock size={16} /> Paid access only</p>
      {item.product_price_inr != null && <p className="font-medium">Complete bot: {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(item.product_price_inr)}</p>}
      <ExplorationOffers key={item.id} explorationId={item.id} preview={preview} />
      {!preview && <div className="flex flex-wrap gap-3 pt-3">
        <Button asChild variant="outline"><Link to="/buyer/dashboard"><LayoutDashboard size={16} className="mr-2" />My purchases</Link></Button>
        {item.id === CARTESIAN_ID && <Button asChild variant="outline"><Link to="/cartesian/build-guide"><BookOpen size={16} className="mr-2" />Assembly guide</Link></Button>}
      </div>}
    </section>}
    <section className="border-t border-border pt-6"><p className="text-sm text-muted-foreground mb-3">{item.contact_note || "Interested in this exploration?"}</p><Button disabled={preview} onClick={() => setInquiryOpen(true)}><Mail size={16} className="mr-2" /> Contact about this</Button></section>
    {!preview && <ExplorationInquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} exploration={{ id: item.id, title: item.title }} />}
  </div>;
};
export default ExplorationDetails;