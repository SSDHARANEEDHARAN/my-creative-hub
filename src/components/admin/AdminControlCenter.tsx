import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, Images, Eye, Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { to: "/admin/moderation", icon: Shield, title: "Moderation & approvals", desc: "Blog, projects, skills, certificates, experience, comments, guests, visits, notifications, audit." },
  { to: "/admin/content", icon: FileText, title: "Content editor", desc: "Edit every project and blog post with a live preview, AI suggestions and layout checks." },
  { to: "/admin/gallery", icon: Images, title: "Gallery & toolchain", desc: "Photos/videos, toolchain logos, connector files, downloads analytics." },
];

const PAGES = [
  { path: "/", label: "Home", edit: "/admin/moderation" },
  { path: "/about", label: "About", edit: "/admin/moderation" },
  { path: "/projects", label: "Projects", edit: "/admin/content" },
  { path: "/blog", label: "Blog", edit: "/admin/content" },
  { path: "/gallery", label: "Gallery", edit: "/admin/gallery" },
  { path: "/skills", label: "Skills", edit: "/admin/moderation" },
  { path: "/contact", label: "Contact", edit: "/admin/moderation" },
];

const SIZES = { desktop: "100%", tablet: "768px", mobile: "390px" } as const;

const AdminControlCenter = () => {
  const [page, setPage] = useState(PAGES[0]);
  const [size, setSize] = useState<keyof typeof SIZES>("desktop");
  const [nonce, setNonce] = useState(0);

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <Link key={s.to} to={s.to} className="bg-card border border-border p-5 hover:border-primary transition-colors group">
            <s.icon className="w-5 h-5 text-primary mb-2" />
            <p className="font-semibold text-foreground group-hover:text-primary">{s.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="font-semibold mr-auto">Live site preview</h2>
          {(Object.keys(SIZES) as (keyof typeof SIZES)[]).map((k) => {
            const Icon = k === "desktop" ? Monitor : k === "tablet" ? Tablet : Smartphone;
            return (
              <Button key={k} size="sm" variant={size === k ? "default" : "outline"} onClick={() => setSize(k)} aria-label={k}>
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
          <Button size="sm" variant="outline" onClick={() => setNonce((n) => n + 1)} aria-label="Refresh preview"><RefreshCw className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {PAGES.map((p) => (
            <Button key={p.path} size="sm" variant={page.path === p.path ? "default" : "outline"} onClick={() => setPage(p)}>{p.label}</Button>
          ))}
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" asChild><Link to={page.edit}><Pencil className="w-4 h-4 mr-1" />Edit {page.label}</Link></Button>
            <Button size="sm" variant="outline" asChild><a href={page.path} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-1" />Open</a></Button>
          </div>
        </div>
        <div className="flex justify-center bg-secondary/40 p-2 overflow-x-auto">
          <iframe
            key={`${page.path}-${nonce}`}
            src={page.path}
            title={`${page.label} preview`}
            className="bg-background border border-border h-[640px] transition-all"
            style={{ width: SIZES[size], maxWidth: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminControlCenter;
