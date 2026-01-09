import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, FileText, Code2, Cog } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";

// Import project images
import ecommerceImg from "@/assets/project-ecommerce.jpg";
import iotImg from "@/assets/project-iot.jpg";
import inventoryImg from "@/assets/project-inventory.jpg";
import analyticsImg from "@/assets/project-analytics.jpg";
import cadAutomotiveImg from "@/assets/project-cad-automotive.jpg";
import flexsimImg from "@/assets/project-flexsim.jpg";
import creoImg from "@/assets/project-creo.jpg";
import plmImg from "@/assets/project-plm.jpg";

interface Project {
  id: number;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  liveUrl?: string;
  articleUrl?: string;
  featured: boolean;
  category: "it" | "engineering";
}

// 10 IT Projects with live website URLs
const itProjects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Web Platform",
    description: "Full-stack e-commerce website with React frontend, Node.js backend, payment integration, and admin dashboard. Features include product catalog, shopping cart, user authentication, and order management.",
    images: [ecommerceImg, analyticsImg, inventoryImg, iotImg, plmImg],
    tags: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
    liveUrl: "https://ecommerce-demo.example.com",
    featured: true,
    category: "it",
  },
  {
    id: 2,
    title: "IoT Smart Home System",
    description: "Embedded system project with Arduino and Raspberry Pi for home automation with mobile app control. Includes temperature monitoring, lighting control, and security features.",
    images: [iotImg, ecommerceImg, analyticsImg, inventoryImg, plmImg],
    tags: ["Python", "Arduino", "IoT", "React Native", "MQTT"],
    liveUrl: "https://iot-dashboard.example.com",
    featured: true,
    category: "it",
  },
  {
    id: 3,
    title: "Inventory Management App",
    description: "Cross-platform mobile application for stock management with barcode scanning, real-time sync, and multi-warehouse support.",
    images: [inventoryImg, ecommerceImg, iotImg, analyticsImg, plmImg],
    tags: ["React Native", "Firebase", "Python", "REST API"],
    liveUrl: "https://inventory-app.example.com",
    featured: false,
    category: "it",
  },
  {
    id: 4,
    title: "Data Analytics Dashboard",
    description: "Real-time analytics dashboard with Python backend, interactive data visualization, and automated reporting for business intelligence.",
    images: [analyticsImg, inventoryImg, ecommerceImg, iotImg, plmImg],
    tags: ["Python", "React", "PostgreSQL", "D3.js", "Pandas"],
    liveUrl: "https://analytics-dashboard.example.com",
    featured: false,
    category: "it",
  },
  {
    id: 5,
    title: "Task Management System",
    description: "Collaborative project management tool with real-time updates, Kanban boards, team collaboration features, and time tracking.",
    images: [ecommerceImg, analyticsImg, inventoryImg, iotImg, plmImg],
    tags: ["React", "Node.js", "Socket.io", "MongoDB"],
    liveUrl: "https://task-manager.example.com",
    featured: false,
    category: "it",
  },
  {
    id: 6,
    title: "Weather Monitoring Station",
    description: "IoT-based weather station with sensors for temperature, humidity, pressure, and rainfall with web dashboard visualization.",
    images: [iotImg, analyticsImg, inventoryImg, ecommerceImg, plmImg],
    tags: ["Arduino", "Python", "Flask", "Chart.js", "IoT"],
    liveUrl: "https://weather-station.example.com",
    featured: false,
    category: "it",
  },
  {
    id: 7,
    title: "Restaurant POS System",
    description: "Point of sale system for restaurants with order management, table tracking, kitchen display system, and payment processing.",
    images: [inventoryImg, ecommerceImg, analyticsImg, iotImg, plmImg],
    tags: ["React", "Electron", "Node.js", "SQLite"],
    liveUrl: "https://restaurant-pos.example.com",
    featured: false,
    category: "it",
  },
  {
    id: 8,
    title: "Healthcare Appointment App",
    description: "Mobile application for booking medical appointments with doctor profiles, real-time availability, and notification reminders.",
    images: [ecommerceImg, iotImg, analyticsImg, inventoryImg, plmImg],
    tags: ["React Native", "Firebase", "Push Notifications"],
    liveUrl: "https://healthcare-app.example.com",
    featured: false,
    category: "it",
  },
  {
    id: 9,
    title: "Smart Agriculture System",
    description: "IoT solution for precision farming with soil moisture sensors, automated irrigation, and crop health monitoring dashboard.",
    images: [iotImg, analyticsImg, ecommerceImg, inventoryImg, plmImg],
    tags: ["IoT", "Python", "TensorFlow", "React"],
    liveUrl: "https://smart-agriculture.example.com",
    featured: false,
    category: "it",
  },
  {
    id: 10,
    title: "Learning Management System",
    description: "Educational platform with course management, video streaming, quiz creation, progress tracking, and certification system.",
    images: [ecommerceImg, analyticsImg, inventoryImg, iotImg, plmImg],
    tags: ["React", "Node.js", "PostgreSQL", "AWS S3"],
    liveUrl: "https://lms-platform.example.com",
    featured: false,
    category: "it",
  },
];

// 20 Engineering Projects with article URLs (matching existing article slugs)
const engineeringProjects: Project[] = [
  {
    id: 11,
    title: "Automotive Engine Block Design",
    description: "Complete 3D CAD design of a 4-cylinder engine block with thermal and structural FEA analysis, cooling jacket optimization, and manufacturing drawings for Mahindra & Mahindra.",
    images: [cadAutomotiveImg, flexsimImg, creoImg, plmImg, analyticsImg],
    tags: ["SolidWorks", "FEA", "Thermal Analysis", "GD&T", "DFMA"],
    articleUrl: "/projects/article/automotive-engine-block",
    featured: true,
    category: "engineering",
  },
  {
    id: 12,
    title: "Production Line Simulation",
    description: "FlexSim simulation of automotive assembly line for bottleneck identification, throughput optimization achieving 22% improvement, and resource utilization analysis.",
    images: [flexsimImg, cadAutomotiveImg, creoImg, plmImg, analyticsImg],
    tags: ["FlexSim", "Simulation", "Lean Manufacturing", "Six Sigma"],
    articleUrl: "/projects/article/production-line-simulation",
    featured: true,
    category: "engineering",
  },
  {
    id: 13,
    title: "PTC Windchill PLM Implementation",
    description: "Enterprise PLM deployment for 500+ users across 8 sites with CAD integration, workflow automation, and engineering change management for L&T.",
    images: [plmImg, cadAutomotiveImg, flexsimImg, creoImg, analyticsImg],
    tags: ["Windchill", "PLM", "Workflow", "CAD Integration"],
    articleUrl: "/projects/article/plm-implementation",
    featured: false,
    category: "engineering",
  },
  {
    id: 14,
    title: "Gearbox Housing Design",
    description: "Aluminum die-cast gearbox housing for EV application with NVH optimization, thermal management, and structural validation achieving 15% weight reduction.",
    images: [creoImg, cadAutomotiveImg, flexsimImg, plmImg, analyticsImg],
    tags: ["NX", "Die Casting", "NVH", "FEA", "EV Components"],
    articleUrl: "/projects/article/gearbox-housing",
    featured: false,
    category: "engineering",
  },
  {
    id: 15,
    title: "Robotic Welding Cell Design",
    description: "FANUC robotic welding cell layout design with cycle time optimization achieving 52-second target, safety system integration, and TÜV certification.",
    images: [flexsimImg, cadAutomotiveImg, creoImg, plmImg, analyticsImg],
    tags: ["Robcad", "Robot Simulation", "Safety Systems", "FANUC"],
    articleUrl: "/projects/article/robotic-welding-cell",
    featured: false,
    category: "engineering",
  },
  {
    id: 16,
    title: "Injection Mold Tool Design",
    description: "Two-cavity injection mold for automotive interior trim with conformal cooling, achieving 32-second cycle time and Class A surface quality.",
    images: [creoImg, cadAutomotiveImg, flexsimImg, plmImg, analyticsImg],
    tags: ["SolidWorks", "Moldflow", "Conformal Cooling", "Tooling"],
    articleUrl: "/projects/article/injection-mold-design",
    featured: false,
    category: "engineering",
  },
  {
    id: 17,
    title: "Warehouse Layout Optimization",
    description: "FlexSim simulation of 50,000 sq ft distribution center achieving 40% pick efficiency improvement and ₹45L annual savings for Flipkart Logistics.",
    images: [flexsimImg, cadAutomotiveImg, creoImg, plmImg, analyticsImg],
    tags: ["FlexSim", "Warehouse", "Slotting Optimization", "WMS"],
    articleUrl: "/projects/article/warehouse-optimization",
    featured: false,
    category: "engineering",
  },
  {
    id: 18,
    title: "Sheet Metal Enclosure Design",
    description: "IP65-rated industrial VFD enclosure with 450W heat dissipation, EMC shielding, and 20% cost reduction through DFM optimization for Siemens India.",
    images: [cadAutomotiveImg, creoImg, flexsimImg, plmImg, analyticsImg],
    tags: ["SolidWorks", "Sheet Metal", "IP Rating", "Thermal", "DFM"],
    articleUrl: "/projects/article/sheet-metal-enclosure",
    featured: false,
    category: "engineering",
  },
  {
    id: 19,
    title: "Conveyor System Design",
    description: "45-meter modular conveyor system for FMCG packaging handling 200 cartons/minute with VFD control and MES integration for Hindustan Unilever.",
    images: [flexsimImg, cadAutomotiveImg, creoImg, plmImg, analyticsImg],
    tags: ["NX", "Conveyor Systems", "Motor Sizing", "Controls"],
    articleUrl: "/projects/article/conveyor-system",
    featured: false,
    category: "engineering",
  },
  {
    id: 20,
    title: "Hydraulic Press Frame Design",
    description: "500-ton hydraulic press frame with FEA-optimized structure achieving 0.12mm deflection, meeting automotive body panel stamping requirements.",
    images: [cadAutomotiveImg, creoImg, flexsimImg, plmImg, analyticsImg],
    tags: ["SolidWorks", "FEA", "Structural Analysis", "AWS D1.1"],
    articleUrl: "/projects/article/hydraulic-press",
    featured: false,
    category: "engineering",
  },
  {
    id: 21,
    title: "Assembly Line Balancing",
    description: "LED TV assembly line optimization achieving 30% capacity increase through workstation rebalancing and ergonomic improvements for Dixon Technologies.",
    images: [flexsimImg, cadAutomotiveImg, creoImg, plmImg, analyticsImg],
    tags: ["FlexSim", "Line Balancing", "Ergonomics", "MTM-2"],
    articleUrl: "/projects/article/assembly-line-balancing",
    featured: false,
    category: "engineering",
  },
  {
    id: 22,
    title: "CNC Fixture Design",
    description: "Modular quick-change fixture system reducing setup time by 87% and improving machine utilization to 72% for automotive sensor housings.",
    images: [creoImg, cadAutomotiveImg, flexsimImg, plmImg, analyticsImg],
    tags: ["PTC Creo", "Fixture Design", "Zero-Point Clamping", "DFM"],
    articleUrl: "/projects/article/cnc-fixture-design",
    featured: false,
    category: "engineering",
  },
  {
    id: 23,
    title: "Product Data Management System",
    description: "Windchill PDM configuration for 100,000+ engineering documents across 3 sites with CAD integration and ISO 9001 compliance for Kirloskar Brothers.",
    images: [plmImg, cadAutomotiveImg, creoImg, flexsimImg, analyticsImg],
    tags: ["Windchill", "PDM", "Document Control", "CAD Integration"],
    articleUrl: "/projects/article/pdm-configuration",
    featured: false,
    category: "engineering",
  },
  {
    id: 24,
    title: "Automotive Suspension Design",
    description: "Double wishbone front suspension with kinematic optimization for performance SUV, achieving 26.5kg corner weight and 250,000 km durability validation.",
    images: [cadAutomotiveImg, creoImg, flexsimImg, plmImg, analyticsImg],
    tags: ["NX", "Motion Simulation", "Vehicle Dynamics", "DOE"],
    articleUrl: "/projects/article/suspension-design",
    featured: false,
    category: "engineering",
  },
  {
    id: 25,
    title: "Packaging Line Simulation",
    description: "End-of-line automation validation for Coca-Cola identifying 3 critical issues before purchase, saving ₹1.5Cr in potential field modifications.",
    images: [flexsimImg, cadAutomotiveImg, creoImg, plmImg, analyticsImg],
    tags: ["FlexSim", "Packaging", "Equipment Validation", "Integration"],
    articleUrl: "/projects/article/packaging-line-simulation",
    featured: false,
    category: "engineering",
  },
  {
    id: 26,
    title: "Electric Motor Housing Design",
    description: "50kW EV traction motor housing with integrated liquid cooling, IP67 protection, and NVH optimization achieving 7.6kg weight for Tata AutoComp.",
    images: [creoImg, cadAutomotiveImg, flexsimImg, plmImg, analyticsImg],
    tags: ["SolidWorks", "CFD", "Thermal Design", "Die Casting", "EV"],
    articleUrl: "/projects/article/motor-housing-design",
    featured: false,
    category: "engineering",
  },
  {
    id: 27,
    title: "Automotive Dashboard Assembly",
    description: "Complete instrument panel module with 45+ components, Class A surfaces, and multi-supplier integration for mid-size sedan platform.",
    images: [creoImg, cadAutomotiveImg, flexsimImg, plmImg, analyticsImg],
    tags: ["PTC Creo", "Class A Surfaces", "GD&T", "Airbag Integration"],
    articleUrl: "/projects/article/dashboard-assembly",
    featured: false,
    category: "engineering",
  },
  {
    id: 28,
    title: "CNC Machine Tool Design",
    description: "Vertical machining center structure with 200N/μm stiffness and ±0.004mm positioning accuracy through FEA-optimized cast iron design for BFW.",
    images: [cadAutomotiveImg, creoImg, flexsimImg, plmImg, analyticsImg],
    tags: ["SolidWorks", "Modal Analysis", "Machine Design", "Casting"],
    articleUrl: "/projects/article/cnc-machine-design",
    featured: false,
    category: "engineering",
  },
  {
    id: 29,
    title: "Material Handling AGV System",
    description: "15-AGV fleet design for automotive assembly achieving 99.5% on-time delivery and ₹72L annual savings through MES/WMS integration for Maruti Suzuki.",
    images: [flexsimImg, cadAutomotiveImg, creoImg, plmImg, analyticsImg],
    tags: ["FlexSim", "AGV Systems", "SLAM Navigation", "MES Integration"],
    articleUrl: "/projects/article/agv-system-design",
    featured: false,
    category: "engineering",
  },
  {
    id: 30,
    title: "Heat Exchanger Design",
    description: "2MW shell and tube heat exchanger with ASME Section VIII compliance, HTRI thermal-hydraulic design, and third-party certification for Thermax.",
    images: [analyticsImg, cadAutomotiveImg, creoImg, flexsimImg, plmImg],
    tags: ["HTRI", "ASME", "Thermal Design", "Pressure Vessel"],
    articleUrl: "/projects/article/heat-exchanger-design",
    featured: false,
    category: "engineering",
  },
];

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState<"it" | "engineering">("it");

  const projects = activeTab === "it" ? itProjects : engineeringProjects;
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <>
      <Helmet>
        <title>Projects | Dharaneedharan SS - IT & Engineering Portfolio</title>
        <meta
          name="description"
          content="Explore my portfolio of IT and Engineering projects including web applications, IoT systems, CAD designs, and manufacturing simulations."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Header Section */}
        <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                My <span className="text-primary">Projects</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                A collection of my work spanning IT development and Engineering design.
                Click on IT projects to visit live websites, or Engineering projects to read detailed case studies.
              </p>
            </motion.div>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mt-10 gap-4"
            >
              <button
                onClick={() => setActiveTab("it")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === "it"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                <Code2 size={20} />
                IT Projects ({itProjects.length})
              </button>
              <button
                onClick={() => setActiveTab("engineering")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === "engineering"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                <Cog size={20} />
                Engineering Projects ({engineeringProjects.length})
              </button>
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Featured Projects */}
                {featuredProjects.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Featured Projects
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      {featuredProjects.map((project, index) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={index}
                          isFeatured
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Projects */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
                    All Projects
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {otherProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
  isFeatured?: boolean;
}

const ProjectCard = ({ project, index, isFeatured = false }: ProjectCardProps) => {
  const isIT = project.category === "it";
  
  // IT projects link to live website, Engineering projects link to article
  const linkUrl = isIT ? project.liveUrl : project.articleUrl;
  const isExternal = isIT;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isExternal && linkUrl) {
      return (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {children}
        </a>
      );
    }
    if (!isExternal && linkUrl) {
      return (
        <Link to={linkUrl} className="block h-full">
          {children}
        </Link>
      );
    }
    return <div className="h-full">{children}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <CardWrapper>
        <div
          className={`group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col cursor-pointer ${
            isFeatured ? "md:flex-row" : ""
          }`}
        >
          {/* Image Section */}
          <div
            className={`relative overflow-hidden ${
              isFeatured ? "md:w-1/2 h-64 md:h-auto" : "h-48"
            }`}
          >
            <ProjectImageCarousel images={project.images} title={project.title} />
            
            {/* Link Indicator */}
            <div className="absolute top-3 left-3 z-10">
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                  isIT
                    ? "bg-blue-500/90 text-white"
                    : "bg-primary/90 text-primary-foreground"
                }`}
              >
                {isIT ? (
                  <>
                    <ExternalLink size={12} />
                    Live Site
                  </>
                ) : (
                  <>
                    <FileText size={12} />
                    Case Study
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div
            className={`p-5 flex flex-col flex-grow ${
              isFeatured ? "md:w-1/2" : ""
            }`}
          >
            <h3
              className={`font-bold mb-2 group-hover:text-primary transition-colors ${
                isFeatured ? "text-xl" : "text-lg"
              }`}
            >
              {project.title}
            </h3>
            <p
              className={`text-muted-foreground mb-4 flex-grow ${
                isFeatured ? "text-base" : "text-sm line-clamp-2"
              }`}
            >
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.slice(0, isFeatured ? 5 : 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > (isFeatured ? 5 : 3) && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                  +{project.tags.length - (isFeatured ? 5 : 3)}
                </span>
              )}
            </div>

            {/* Action Button */}
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                isIT ? "text-blue-500" : "text-primary"
              } group-hover:gap-3 transition-all`}
            >
              {isIT ? (
                <>
                  <ExternalLink size={16} />
                  Visit Live Website
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Read Case Study
                </>
              )}
            </div>
          </div>
        </div>
      </CardWrapper>
    </motion.div>
  );
};

export default ProjectsPage;
