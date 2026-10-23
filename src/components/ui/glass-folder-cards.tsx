import { useState } from "react";
import { FileArchive, FileCode2, FileText, Box, FolderOpen, Lock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FilePreviewIcon({ name, className }: { name: string; className?: string }) {
  const extension = name.split(".").pop()?.toUpperCase() || "FILE";
  const Icon = ["ZIP", "RAR", "7Z"].includes(extension) ? FileArchive : ["STL", "STEP", "SLDPRT", "SLDASM", "IGS"].includes(extension) ? Box : ["INO", "CPP", "H", "BIN", "JSON"].includes(extension) ? FileCode2 : FileText;
  return <span aria-hidden="true" className={cn("inline-flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-1 border border-border bg-secondary text-foreground", className)}><Icon size={20} /><span className="text-[8px] font-semibold leading-none">{extension.slice(0, 7)}</span></span>;
}

export type FolderFile = { name: string; meta?: string; href?: string };
export default function GlassFolder({ label, files, locked = false, onFileSelect, onOpen }: { label: string; files: FolderFile[]; locked?: boolean; onFileSelect?: (file: FolderFile, index: number) => void; onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  return <div className="w-full min-w-0 max-w-72">
    <Button variant="ghost" aria-label={`Preview ${label}`} aria-expanded={open} onClick={() => { setOpen(value => !value); onOpen?.(); }} className="file-folder group relative block h-48 w-full whitespace-normal p-0 text-left">
      <span className="absolute left-4 right-4 top-8 bottom-4 border border-border bg-secondary" />
      <span aria-hidden="true" className={cn("absolute left-8 right-8 top-6 bottom-12 border border-border bg-card transition-transform duration-300 motion-reduce:transition-none", open ? "-translate-y-4 -rotate-6" : "group-hover:-translate-y-2") }><FileText className="m-4 h-6 w-6 text-muted-foreground" /></span>
      <span aria-hidden="true" className={cn("absolute left-10 right-6 top-10 bottom-10 border border-border bg-card transition-transform duration-300 motion-reduce:transition-none", open ? "-translate-y-6 rotate-6" : "group-hover:-translate-y-3") }><FileArchive className="m-4 h-6 w-6 text-muted-foreground" /></span>
      <span className="absolute left-2 right-2 top-20 bottom-2 border border-border bg-background/80 p-4 backdrop-blur-md flex flex-col justify-between">
        <span className="flex items-center justify-between"><FolderOpen size={24} />{locked && <Lock size={16} />}</span>
        <span className="block"><span className="block font-display text-lg font-semibold break-words">{label}</span><span className="block text-xs text-muted-foreground">{files.length} {files.length === 1 ? "file" : "files"}{locked ? " · Paid access" : ""}</span></span>
      </span>
    </Button>
    {open && <ul className="mt-3 space-y-2">{files.map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center gap-3 min-w-0"><FilePreviewIcon name={file.name} /><div className="min-w-0 flex-1"><p className="text-sm font-medium break-words">{file.name}</p>{file.meta && <p className="text-xs text-muted-foreground break-words">{file.meta}</p>}</div>{!locked && file.href ? <Button asChild size="icon" variant="outline"><a href={file.href} aria-label={`Download ${file.name}`}><Download size={16} /></a></Button> : !locked && onFileSelect ? <Button size="icon" variant="outline" aria-label={`Open ${file.name}`} onClick={() => onFileSelect(file, index)}><Download size={16} /></Button> : locked ? <Lock size={14} className="shrink-0 text-muted-foreground" /> : null}</li>)}</ul>}
  </div>;
}