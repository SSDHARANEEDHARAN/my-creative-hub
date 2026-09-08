import { memo } from "react";
import { ExternalLink } from "lucide-react";

interface Connector {
  name: string;
  description: string;
  url: string;
  /** simpleicons.org slug — falls back to initials tile when omitted */
  slug?: string;
}

const connectors: Connector[] = [
  { name: "SolidWorks", description: "3D CAD modelling, assemblies and drawings", url: "https://www.solidworks.com/" },
  { name: "Siemens NX CAD", description: "Advanced parametric 3D CAD & CAM design", url: "https://www.plm.automation.siemens.com/global/en/products/nx/", slug: "siemens" },
  { name: "PTC Creo", description: "Parametric 3D CAD for product design", url: "https://www.ptc.com/en/products/creo" },
  { name: "Autodesk AutoCAD", description: "2D drafting and technical documentation", url: "https://www.autodesk.com/products/autocad/overview", slug: "autodesk" },
  { name: "Ansys", description: "FEA / structural and thermal simulation", url: "https://www.ansys.com/", slug: "ansys" },
  { name: "Leo AI", description: "AI co-pilot for mechanical engineers — parts, concept design & 3D models", url: "https://www.getleo.ai/downloads" },
  { name: "MecAgent", description: "AI CAD copilot to automate SolidWorks, CATIA & Inventor tasks", url: "https://mecagent.com/" },
  { name: "Creality", description: "Consumer 3D printers, laser engravers & 3D scanners", url: "https://www.creality.com/" },
  { name: "Factory I/O", description: "3D factory simulation for PLC training", url: "https://factoryio.com/" },
  { name: "Siemens TIA Portal", description: "S7 PLC & HMI programming environment", url: "https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html", slug: "siemens" },
  { name: "GX / GT Works3", description: "Mitsubishi PLC & GOT HMI programming", url: "https://www.mitsubishielectric.com/fa/products/software/gx-works3/index.html" },
  { name: "EduVolt", description: "Didactic electrical and automation trainer suite", url: "https://www.eduvolt.in/" },
  { name: "Arduino IDE", description: "Embedded firmware for AVR / ESP boards", url: "https://www.arduino.cc/en/software", slug: "arduino" },
  { name: "VS Code", description: "Primary code editor for web and embedded work", url: "https://code.visualstudio.com/", slug: "visualstudiocode" },
  { name: "JetBrains", description: "IntelliJ / PyCharm / WebStorm IDE suite", url: "https://www.jetbrains.com/", slug: "jetbrains" },
  { name: "Trae AI", description: "AI-assisted pair programming IDE", url: "https://www.trae.ai/" },
  { name: "Antigravity", description: "Google's agent-first AI development platform", url: "https://antigravity.google/" },
  { name: "Tharanee Cloud", description: "Backend, database & auth hosting platform", url: "https://lovable.dev/" },
  { name: "Tharanee AI", description: "AI Gateway for chat, image & speech models", url: "https://lovable.dev/" },
  { name: "ElevenLabs", description: "Text-to-speech & voice AI generation", url: "https://elevenlabs.io/", slug: "elevenlabs" },
  { name: "Supabase", description: "Postgres database, auth & edge functions", url: "https://supabase.com/", slug: "supabase" },
  { name: "Gmail", description: "Email communication & notifications", url: "https://mail.google.com/", slug: "gmail" },
  { name: "Slack", description: "Team messaging & workflow automation", url: "https://slack.com/", slug: "slack" },
  { name: "Google Drive", description: "Cloud storage for project files & media", url: "https://drive.google.com/", slug: "googledrive" },
  { name: "Firecrawl", description: "Web scraping & crawling API service", url: "https://www.firecrawl.dev/", slug: "firecrawl" },
  { name: "Google Sheets", description: "Spreadsheet automation & data tracking", url: "https://sheets.google.com/", slug: "googlesheets" },
  { name: "Google Calendar", description: "Scheduling & project timeline management", url: "https://calendar.google.com/", slug: "googlecalendar" },
  { name: "Google Docs", description: "Collaborative documentation & writing", url: "https://docs.google.com/", slug: "googledocs" },
  { name: "Airtable", description: "Low-code database & project tracking", url: "https://www.airtable.com/", slug: "airtable" },
  { name: "Microsoft Outlook", description: "Email & calendar productivity suite", url: "https://outlook.live.com/", slug: "microsoftoutlook" },
  { name: "GitHub API", description: "Version control & code collaboration", url: "https://github.com/", slug: "github" },
  { name: "Google Slides", description: "Presentation & pitch deck creation", url: "https://slides.google.com/", slug: "googleslides" },
  { name: "Microsoft Excel", description: "Advanced data analysis & reporting", url: "https://www.microsoft.com/microsoft-365/excel", slug: "microsoftexcel" },
  { name: "Microsoft OneDrive", description: "Cloud file storage & sharing", url: "https://onedrive.live.com/", slug: "microsoftonedrive" },
  { name: "Perplexity", description: "AI-powered answer engine & research", url: "https://www.perplexity.ai/", slug: "perplexity" },
  { name: "WordPress", description: "Self-hosted CMS & website builder", url: "https://wordpress.org/", slug: "wordpress" },
  { name: "Linear", description: "Issue tracking & project management", url: "https://linear.app/", slug: "linear" },
  { name: "Microsoft Teams", description: "Video meetings & team collaboration", url: "https://www.microsoft.com/microsoft-teams/", slug: "microsoftteams" },
  { name: "PLC IO SIM", description: "Online PLC ladder-logic conveyor simulator", url: "https://plciosim.com/examples/counting-conveyor" },
  { name: "Wokwi", description: "Browser-based ESP32 & Arduino simulator", url: "https://wokwi.com/esp32" },
  { name: "Tinkercad", description: "Online circuit design & 3D modelling", url: "https://www.tinkercad.com/", slug: "tinkercad" },
  { name: "Circuito.io", description: "Auto circuit wiring & schematic builder", url: "https://www.circuito.io/" },
  { name: "EveryCircuit", description: "Interactive circuit simulation app", url: "https://everycircuit.com/" },
  { name: "Claude", description: "Anthropic AI assistant for coding & analysis", url: "https://claude.ai/", slug: "anthropic" },
  { name: "Gemini", description: "Google AI for multimodal generation", url: "https://gemini.google.com/", slug: "googlegemini" },
  { name: "Kimi", description: "Moonshot AI long-context assistant", url: "https://kimi.moonshot.cn/" },
  { name: "DeepSeek", description: "Open-source reasoning & code AI", url: "https://www.deepseek.com/", slug: "deepseek" },
  { name: "Ollama", description: "Local LLM runtime for on-device models", url: "https://ollama.com/", slug: "ollama" },
  { name: "n8n", description: "Self-hostable workflow & automation engine", url: "https://n8n.io/", slug: "n8n" },
];

const initials = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9 /]/g, "")
    .split(/[\s/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const ConnectorCard = memo(({ c, index }: { c: Connector; index: number }) => (
  <a
    href={c.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${c.name} — open official site`}
    className="group flex items-start gap-3 p-4 bg-card border-2 border-border hover:border-foreground transition-all duration-300"
    style={{ animationDelay: `${index * 40}ms` }}
  >
    <span className="shrink-0 w-10 h-10 border-2 border-border group-hover:border-foreground flex items-center justify-center bg-background">
      {c.slug ? (
        <img
          src={`https://cdn.simpleicons.org/${c.slug}/currentColor`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={20}
          height={20}
          className="w-5 h-5 text-foreground"
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = "none";
            el.parentElement?.setAttribute("data-fallback", initials(c.name));
          }}
        />
      ) : (
        <span className="text-xs font-bold text-foreground">{initials(c.name)}</span>
      )}
    </span>
    <span className="min-w-0 flex-1">
      <span className="flex items-center gap-1.5">
        <span className="font-semibold text-sm sm:text-base text-foreground truncate">{c.name}</span>
        <ExternalLink size={13} className="shrink-0 text-muted-foreground group-hover:text-foreground" />
      </span>
      <span className="block text-xs sm:text-sm text-muted-foreground mt-1">{c.description}</span>
    </span>
  </a>
));

ConnectorCard.displayName = "ConnectorCard";

const ConnectorSkills = () => (
  <section className="py-12 sm:py-16 border-t-2 border-border bg-background">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12">
        <span className="text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-3 block">
          Toolchain
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          Software & <span className="text-gradient">Connectors</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Design, simulation, automation and development platforms I work with daily. Click any tile to open its
          official site.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
        {connectors.map((c, i) => (
          <ConnectorCard key={c.name} c={c} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default ConnectorSkills;
