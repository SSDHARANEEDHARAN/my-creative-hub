import React from "react";
import ReactMarkdown from "react-markdown";
import { BookOpen, Code2, Lightbulb, ChevronRight, Quote, Table2, ListChecks } from "lucide-react";

interface StyledArticleRendererProps {
  content: string;
}

let sectionCounter = 0;

const StyledArticleRenderer = ({ content }: StyledArticleRendererProps) => {
  sectionCounter = 0;

  return (
    <article className="space-y-6">
      <ReactMarkdown
        components={{
          h2: ({ children }) => {
            sectionCounter++;
            return (
              <div className="relative mt-12 mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm font-display">
                    {String(sectionCounter).padStart(2, "0")}
                  </div>
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight">
                      {children}
                    </h2>
                    <div className="mt-2 h-0.5 w-16 bg-gradient-to-r from-primary to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            );
          },
          h3: ({ children }) => (
            <div className="flex items-center gap-3 mt-8 mb-3">
              <ChevronRight size={18} className="text-primary flex-shrink-0" />
              <h3 className="font-display text-lg font-semibold text-foreground">{children}</h3>
            </div>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground leading-[1.85] text-[15px] pl-0 sm:pl-14">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <div className="pl-0 sm:pl-14 my-4">
              <div className="bg-secondary/40 border border-border/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2 uppercase tracking-wider">
                  <ListChecks size={14} /> Key Points
                </div>
                <ul className="space-y-2">{children}</ul>
              </div>
            </div>
          ),
          ol: ({ children }) => (
            <div className="pl-0 sm:pl-14 my-4">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <ol className="space-y-3 list-none counter-reset-item">{children}</ol>
              </div>
            </div>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-3 text-muted-foreground text-[15px]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="leading-relaxed">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <div className="pl-0 sm:pl-14 my-6">
              <div className="relative bg-primary/5 border-l-4 border-primary rounded-r-xl p-5">
                <Quote size={20} className="absolute top-4 right-4 text-primary/20" />
                <div className="text-foreground/90 italic text-[15px] leading-relaxed">{children}</div>
              </div>
            </div>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              const lang = className?.replace("language-", "") || "code";
              return (
                <div className="pl-0 sm:pl-14 my-6">
                  <div className="rounded-xl overflow-hidden border border-border bg-[hsl(var(--secondary))]">
                    <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border-b border-border">
                      <Code2 size={14} className="text-primary" />
                      <span className="text-xs font-mono text-muted-foreground uppercase">{lang}</span>
                      <div className="ml-auto flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                      </div>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-sm font-mono text-foreground/90 leading-relaxed">{children}</code>
                    </pre>
                  </div>
                </div>
              );
            }
            return (
              <code className="px-1.5 py-0.5 rounded-md bg-secondary text-primary text-sm font-mono border border-border/50">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          table: ({ children }) => (
            <div className="pl-0 sm:pl-14 my-6">
              <div className="rounded-xl overflow-hidden border border-border">
                <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border-b border-border">
                  <Table2 size={14} className="text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">Data Overview</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">{children}</table>
                </div>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary/60">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-muted-foreground border-b border-border/50">{children}</td>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-primary/80 not-italic font-medium">{children}</em>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors">
              {children}
            </a>
          ),
          hr: () => (
            <div className="pl-0 sm:pl-14 my-8">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <Lightbulb size={16} className="text-primary/40" />
                <div className="h-px flex-1 bg-border" />
              </div>
            </div>
          ),
          img: ({ src, alt }) => (
            <div className="pl-0 sm:pl-14 my-6">
              <div className="rounded-xl overflow-hidden border border-border">
                <img src={src} alt={alt || ""} className="w-full h-auto" loading="lazy" />
                {alt && (
                  <div className="px-4 py-2 bg-secondary/30 text-xs text-muted-foreground text-center">{alt}</div>
                )}
              </div>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Reading complete indicator */}
      <div className="mt-12 pt-8 flex flex-col items-center gap-3 border-t border-border">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen size={20} className="text-primary" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">End of Article</p>
      </div>
    </article>
  );
};

export default StyledArticleRenderer;
