import type { Project } from "@/data/projectsData";
import { resolveProjectPhotoUrl } from "@/lib/projectPhotoUrl";
import type { ArticleContent } from "@/data/articleContent";
import photo1 from "@/assets/projects/amr-cobot-development/photo-001.jpg.asset.json";
import photo2 from "@/assets/projects/amr-cobot-development/photo-002.jpg.asset.json";
import photo3 from "@/assets/projects/amr-cobot-development/photo-003.jpg.asset.json";
import photo4 from "@/assets/projects/amr-cobot-development/photo-004.jpg.asset.json";
import photo5 from "@/assets/projects/amr-cobot-development/photo-005.jpg.asset.json";
import photo6 from "@/assets/projects/amr-cobot-development/photo-006.jpg.asset.json";
import photo7 from "@/assets/projects/amr-cobot-development/photo-007.jpg.asset.json";
import photo8 from "@/assets/projects/amr-cobot-development/photo-008.jpg.asset.json";
import photo9 from "@/assets/projects/amr-cobot-development/photo-009.jpg.asset.json";
import photo10 from "@/assets/projects/amr-cobot-development/photo-010.jpg.asset.json";
import photo11 from "@/assets/projects/amr-cobot-development/photo-011.jpg.asset.json";
import photo12 from "@/assets/projects/amr-cobot-development/photo-012.jpg.asset.json";
import photo13 from "@/assets/projects/amr-cobot-development/photo-013.jpg.asset.json";
import photo14 from "@/assets/projects/amr-cobot-development/photo-014.jpg.asset.json";
import photo15 from "@/assets/projects/amr-cobot-development/photo-015.jpg.asset.json";
import photo16 from "@/assets/projects/amr-cobot-development/photo-016.jpg.asset.json";
import photo17 from "@/assets/projects/amr-cobot-development/photo-017.jpg.asset.json";
import photo18 from "@/assets/projects/amr-cobot-development/photo-018.jpg.asset.json";
import photo19 from "@/assets/projects/amr-cobot-development/photo-019.jpg.asset.json";
import photo20 from "@/assets/projects/amr-cobot-development/photo-020.jpg.asset.json";
import photo21 from "@/assets/projects/amr-cobot-development/photo-021.jpg.asset.json";
import photo22 from "@/assets/projects/amr-cobot-development/photo-022.jpg.asset.json";
import photo23 from "@/assets/projects/amr-cobot-development/photo-023.jpg.asset.json";
import photo24 from "@/assets/projects/amr-cobot-development/photo-024.jpg.asset.json";
import photo25 from "@/assets/projects/amr-cobot-development/photo-025.jpg.asset.json";
import photo26 from "@/assets/projects/amr-cobot-development/photo-026.jpg.asset.json";
import photo27 from "@/assets/projects/amr-cobot-development/photo-027.jpg.asset.json";
import photo28 from "@/assets/projects/amr-cobot-development/photo-028.jpg.asset.json";
import photo29 from "@/assets/projects/amr-cobot-development/photo-029.jpg.asset.json";
import photo30 from "@/assets/projects/amr-cobot-development/photo-030.jpg.asset.json";
import photo31 from "@/assets/projects/amr-cobot-development/photo-031.jpg.asset.json";
import photo32 from "@/assets/projects/amr-cobot-development/photo-032.jpg.asset.json";
import photo33 from "@/assets/projects/amr-cobot-development/photo-033.jpg.asset.json";
import photo34 from "@/assets/projects/amr-cobot-development/photo-034.jpg.asset.json";
import photo35 from "@/assets/projects/amr-cobot-development/photo-035.jpg.asset.json";
import photo36 from "@/assets/projects/amr-cobot-development/photo-036.jpg.asset.json";
import photo37 from "@/assets/projects/amr-cobot-development/photo-037.jpg.asset.json";
import photo38 from "@/assets/projects/amr-cobot-development/photo-038.jpg.asset.json";
import photo39 from "@/assets/projects/amr-cobot-development/photo-039.jpg.asset.json";
import photo40 from "@/assets/projects/amr-cobot-development/photo-040.jpg.asset.json";
import photo41 from "@/assets/projects/amr-cobot-development/photo-041.jpg.asset.json";
import photo42 from "@/assets/projects/amr-cobot-development/photo-042.jpg.asset.json";
import photo43 from "@/assets/projects/amr-cobot-development/photo-043.jpg.asset.json";
import photo44 from "@/assets/projects/amr-cobot-development/photo-044.jpg.asset.json";
import photo45 from "@/assets/projects/amr-cobot-development/photo-045.jpg.asset.json";
import photo46 from "@/assets/projects/amr-cobot-development/photo-046.jpg.asset.json";
import photo47 from "@/assets/projects/amr-cobot-development/photo-047.jpg.asset.json";
import photo48 from "@/assets/projects/amr-cobot-development/photo-048.jpg.asset.json";
import photo49 from "@/assets/projects/amr-cobot-development/photo-049.jpg.asset.json";
import photo50 from "@/assets/projects/amr-cobot-development/photo-050.jpg.asset.json";
import photo51 from "@/assets/projects/amr-cobot-development/photo-051.jpg.asset.json";
import photo52 from "@/assets/projects/amr-cobot-development/photo-052.jpg.asset.json";
import photo53 from "@/assets/projects/amr-cobot-development/photo-053.jpg.asset.json";
import photo54 from "@/assets/projects/amr-cobot-development/photo-054.jpg.asset.json";
import photo55 from "@/assets/projects/amr-cobot-development/photo-055.jpg.asset.json";
import photo56 from "@/assets/projects/amr-cobot-development/photo-056.jpg.asset.json";
import photo57 from "@/assets/projects/amr-cobot-development/photo-057.jpg.asset.json";
import photo58 from "@/assets/projects/amr-cobot-development/photo-058.jpg.asset.json";
import photo59 from "@/assets/projects/amr-cobot-development/photo-059.jpg.asset.json";
import photo60 from "@/assets/projects/amr-cobot-development/photo-060.jpg.asset.json";
import photo61 from "@/assets/projects/amr-cobot-development/photo-061.jpg.asset.json";
import photo62 from "@/assets/projects/amr-cobot-development/photo-062.jpg.asset.json";
import photo63 from "@/assets/projects/amr-cobot-development/photo-063.jpg.asset.json";
import photo64 from "@/assets/projects/amr-cobot-development/photo-064.jpg.asset.json";
import photo65 from "@/assets/projects/amr-cobot-development/photo-065.jpg.asset.json";
import photo66 from "@/assets/projects/amr-cobot-development/photo-066.jpg.asset.json";
import photo67 from "@/assets/projects/amr-cobot-development/photo-067.jpg.asset.json";
import photo68 from "@/assets/projects/amr-cobot-development/photo-068.jpg.asset.json";
import photo69 from "@/assets/projects/amr-cobot-development/photo-069.jpg.asset.json";
import photo70 from "@/assets/projects/amr-cobot-development/photo-070.jpg.asset.json";
import photo71 from "@/assets/projects/amr-cobot-development/photo-071.jpg.asset.json";
import photo72 from "@/assets/projects/amr-cobot-development/photo-072.jpg.asset.json";
import photo73 from "@/assets/projects/amr-cobot-development/photo-073.jpg.asset.json";
import photo74 from "@/assets/projects/amr-cobot-development/photo-074.jpg.asset.json";
import photo75 from "@/assets/projects/amr-cobot-development/photo-075.jpg.asset.json";
import photo76 from "@/assets/projects/amr-cobot-development/photo-076.jpg.asset.json";
import photo77 from "@/assets/projects/amr-cobot-development/photo-077.jpg.asset.json";
import photo78 from "@/assets/projects/amr-cobot-development/photo-078.jpg.asset.json";
import photo79 from "@/assets/projects/amr-cobot-development/photo-079.jpg.asset.json";
import photo80 from "@/assets/projects/amr-cobot-development/photo-080.jpg.asset.json";
import photo81 from "@/assets/projects/amr-cobot-development/photo-081.jpg.asset.json";
import photo82 from "@/assets/projects/amr-cobot-development/photo-082.jpg.asset.json";
import photo83 from "@/assets/projects/amr-cobot-development/photo-083.jpg.asset.json";
import photo84 from "@/assets/projects/amr-cobot-development/photo-084.jpg.asset.json";
import photo85 from "@/assets/projects/amr-cobot-development/photo-085.jpg.asset.json";
import photo86 from "@/assets/projects/amr-cobot-development/photo-086.jpg.asset.json";
import photo87 from "@/assets/projects/amr-cobot-development/photo-087.jpg.asset.json";
import photo88 from "@/assets/projects/amr-cobot-development/photo-088.jpg.asset.json";
import photo89 from "@/assets/projects/amr-cobot-development/photo-089.jpg.asset.json";
import photo90 from "@/assets/projects/amr-cobot-development/photo-090.jpg.asset.json";
import photo91 from "@/assets/projects/amr-cobot-development/photo-091.jpg.asset.json";
import photo92 from "@/assets/projects/amr-cobot-development/photo-092.jpg.asset.json";
import photo93 from "@/assets/projects/amr-cobot-development/photo-093.jpg.asset.json";
import photo94 from "@/assets/projects/amr-cobot-development/photo-094.jpg.asset.json";
import photo95 from "@/assets/projects/amr-cobot-development/photo-095.jpg.asset.json";
import photo96 from "@/assets/projects/amr-cobot-development/photo-096.jpg.asset.json";
import photo97 from "@/assets/projects/amr-cobot-development/photo-097.jpg.asset.json";
import photo98 from "@/assets/projects/amr-cobot-development/photo-098.jpg.asset.json";
import photo99 from "@/assets/projects/amr-cobot-development/photo-099.jpg.asset.json";
import photo100 from "@/assets/projects/amr-cobot-development/photo-100.jpg.asset.json";
import photo101 from "@/assets/projects/amr-cobot-development/photo-101.jpg.asset.json";
import photo102 from "@/assets/projects/amr-cobot-development/photo-102.jpg.asset.json";
import photo103 from "@/assets/projects/amr-cobot-development/photo-103.jpg.asset.json";
import photo104 from "@/assets/projects/amr-cobot-development/photo-104.jpg.asset.json";
import photo105 from "@/assets/projects/amr-cobot-development/photo-105.jpg.asset.json";
import photo106 from "@/assets/projects/amr-cobot-development/photo-106.jpg.asset.json";
import photo107 from "@/assets/projects/amr-cobot-development/photo-107.jpg.asset.json";
import photo108 from "@/assets/projects/amr-cobot-development/photo-108.jpg.asset.json";
import photo109 from "@/assets/projects/amr-cobot-development/photo-109.jpg.asset.json";
import photo110 from "@/assets/projects/amr-cobot-development/photo-110.jpg.asset.json";
import photo111 from "@/assets/projects/amr-cobot-development/photo-111.jpg.asset.json";
import photo112 from "@/assets/projects/amr-cobot-development/photo-112.jpg.asset.json";
import video1 from "@/assets/projects/amr-cobot-development/video-01.mp4.asset.json";

export const amrCobotDevelopmentProject: Project = {
  "id": 132,
  "title": "AMR with Cobot – End-to-End Product Development",
  "description": "A standalone 48 V autonomous mobile robot integrated with a Techman collaborative robot, developed over two months from SOLIDWORKS mechanical design through electrical integration, functional testing and handover. Designed for a 400 kg carrying-capacity provision, with onboard HMI and a four-side opening enclosure; capacity and final safety require validation.",
  "tags": [
    "AMR",
    "Techman Cobot",
    "SOLIDWORKS",
    "48 V DC",
    "HMI",
    "Product Development",
    "Mechanical Design"
  ],
  "articleUrl": "/projects/article/amr-cobot-product-development",
  "featured": true,
  "category": "industrial",
  images: [photo57.url, photo1.url, photo2.url, photo3.url, photo4.url, photo5.url, photo6.url, photo7.url, photo8.url, photo9.url, photo10.url, photo11.url, photo12.url, photo13.url, photo14.url, photo15.url, photo16.url, photo17.url, photo18.url, photo19.url, photo20.url, photo21.url, photo22.url, photo23.url, photo24.url, photo25.url, photo26.url, photo27.url, photo28.url, photo29.url, photo30.url, photo31.url, photo32.url, photo33.url, photo34.url, photo35.url, photo36.url, photo37.url, photo38.url, photo39.url, photo40.url, photo41.url, photo42.url, photo43.url, photo44.url, photo45.url, photo46.url, photo47.url, photo48.url, photo49.url, photo50.url, photo51.url, photo52.url, photo53.url, photo54.url, photo55.url, photo56.url, photo58.url, photo59.url, photo60.url, photo61.url, photo62.url, photo63.url, photo64.url, photo65.url, photo66.url, photo67.url, photo68.url, photo69.url, photo70.url, photo71.url, photo72.url, photo73.url, photo74.url, photo75.url, photo76.url, photo77.url, photo78.url, photo79.url, photo80.url, photo81.url, photo82.url, photo83.url, photo84.url, photo85.url, photo86.url, photo87.url, photo88.url, photo89.url, photo90.url, photo91.url, photo92.url, photo93.url, photo94.url, photo95.url, photo96.url, photo97.url, photo98.url, photo99.url, photo100.url, photo101.url, photo102.url, photo103.url, photo104.url, photo105.url, photo106.url, photo107.url, photo108.url, photo109.url, photo110.url, photo111.url, photo112.url].map(resolveProjectPhotoUrl),
  videoUrls: [video1.url],
};

export const amrCobotDevelopmentArticle: ArticleContent = {
  "id": 132,
  "slug": "amr-cobot-product-development",
  "title": "AMR with Cobot – End-to-End Product Development",
  "subtitle": "From mechanical design to integration, testing and product handover in two months",
  "duration": "2 Months",
  "client": "Industrial material-handling application",
  "role": "Mechatronics Design Engineer",
  "teamSize": "Individual end-to-end responsibility",
  "industry": "Industrial Automation / Mobile Robotics",
  "overview": "Designed and developed an Autonomous Mobile Robot (AMR) integrated with a Techman collaborative robot for smart manufacturing and industrial material handling. Individual responsibility covered the complete product development process: mechanical design, system integration, electrical and control integration, safety provisions, functional testing, finalization and handover over a two-month development period.\n\nThe compact platform measures 800 mm (height) × 540 mm (width) × 680 mm (length) and uses a 48 V DC battery-powered architecture. Its 400 kg carrying-capacity design provision remains subject to structural and stability validation.",
  "challenge": "Integrate mobile robotics, a Techman cobot, battery power, electrical controls and accessible servicing within a compact chassis, while providing safety provisions and completing development within two months.",
  "solution": "Develop a SOLIDWORKS-based chassis and flower-inspired four-side opening enclosure, integrate the cobot and 48 V DC controls with onboard HMI, and provide emergency-stop devices on all four sides, additional storage and an extendable/removable battery arrangement.",
  "process": [
    {
      "title": "Mechanical Design using SOLIDWORKS",
      "content": "Developed chassis, enclosure, component placement and integration requirements using SOLIDWORKS. The compact structure incorporates provisions for a 400 kg carrying capacity, subject to structural and stability validation."
    },
    {
      "title": "Four-Side Opening Enclosure",
      "content": "Designed a flower-inspired opening mechanism on all four sides for convenient access during assembly, inspection, maintenance and troubleshooting."
    },
    {
      "title": "AMR and Techman Cobot Integration",
      "content": "Integrated the mobile platform and collaborative robot, considering mechanical mounting, electrical interfaces, cable routing and coordination between mobile and robotic systems."
    },
    {
      "title": "Electrical and Control Integration",
      "content": "Worked on the 48 V DC power architecture, battery integration, control-panel arrangement, controller assembly and onboard HMI. Internal layouts prioritize accessibility for installation and servicing."
    },
    {
      "title": "Safety and Operator Interface",
      "content": "Incorporated emergency-stop provisions on all four sides and an onboard HMI for operator interaction and status monitoring. The final safety architecture requires validation for the intended application."
    },
    {
      "title": "Battery, Storage and Operating Targets",
      "content": "Included additional-storage provisions and an extendable or removable battery arrangement. Target charging time is two hours; target AMR operating duration is at least five hours, subject to operating conditions. These are design targets, not validated performance results."
    },
    {
      "title": "Testing, Finalization and Handover",
      "content": "Completed system integration, functional testing, design refinement, finalization and preparation for product handover within the two-month development period."
    }
  ],
  "results": [
    "End-to-end product development responsibility from design through finalization and handover.",
    "Compact AMR platform with Techman collaborative robot integration.",
    "400 kg carrying-capacity design provision, subject to structural and stability validation.",
    "Four-side opening enclosure supports assembly and maintenance access.",
    "48 V DC battery architecture with onboard HMI and electrical-control integration.",
    "Four-side emergency-stop provisions; final safety requires application-specific validation."
  ],
  "technologies": [
    "AMR",
    "Techman Cobot",
    "SOLIDWORKS",
    "48 V DC",
    "HMI",
    "Product Development",
    "Mechanical Design"
  ],
  "toolsUsed": [
    "SOLIDWORKS",
    "Techman Collaborative Robot",
    "48 V DC Battery System",
    "Onboard HMI",
    "Electrical Control Panel"
  ],
  "keyMetrics": [
    {
      "value": "2 Months",
      "label": "Development Period"
    },
    {
      "value": "400 kg",
      "label": "Capacity Design Provision"
    },
    {
      "value": "48 V DC",
      "label": "Power Architecture"
    },
    {
      "value": "4 Sides",
      "label": "Enclosure Access / E-stop Provisions"
    }
  ],
  "lessons": [
    "Service accessibility must be considered alongside compact mechanical packaging.",
    "Mechanical mounting, electrical interfaces and cable routing require coordinated integration.",
    "Carrying capacity, stability, safety and battery performance targets require validation under intended operating conditions."
  ]
};
