import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, FileText, Code2, Cog, Eye, Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";
import ImageLightbox from "@/components/ImageLightbox";
import { useProjectListCounts } from "@/hooks/useProjectData";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import GuestAccessModal from "@/components/GuestAccessModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ProjectComments from "@/components/ProjectComments";

// Import project images
import ecommerceImg from "@/assets/project-ecommerce.jpg";
import iotImg from "@/assets/project-iot.jpg";
import inventoryImg from "@/assets/project-inventory.jpg";
import analyticsImg from "@/assets/project-analytics.jpg";
import cadAutomotiveImg from "@/assets/project-cad-automotive.jpg";
import flexsimImg from "@/assets/project-flexsim.jpg";
import creoImg from "@/assets/project-creo.jpg";
import plmImg from "@/assets/project-plm.jpg";
import mazeRobot1 from "@/assets/projects/maze-robot-1.jpg";
import mazeRobot2 from "@/assets/projects/maze-robot-2.jpg";
import mazeRobot3 from "@/assets/projects/maze-robot-3.jpg";
import mazeRobot4 from "@/assets/projects/maze-robot-4.jpg";
import mazeRobot5 from "@/assets/projects/maze-robot-5.jpg";
import rocketStoveImg from "@/assets/projects/rocket-stove.png";
import iotHome1 from "@/assets/projects/iot-home-1.jpg";
import iotHome2 from "@/assets/projects/iot-home-2.jpg";
import iotHome3 from "@/assets/projects/iot-home-3.jpg";
import iotHome4 from "@/assets/projects/iot-home-4.jpg";
import iotHome5 from "@/assets/projects/iot-home-5.jpg";
import extruder1 from "@/assets/projects/extruder-1.jpg";
import extruder2 from "@/assets/projects/extruder-2.jpg";
import extruder3 from "@/assets/projects/extruder-3.jpg";
import extruder4 from "@/assets/projects/extruder-4.jpg";
import extruder5 from "@/assets/projects/extruder-5.jpg";
import bottleFilling1 from "@/assets/projects/bottle-filling-1.jpg";
import bottleFilling2 from "@/assets/projects/bottle-filling-2.jpg";
import bottleFilling3 from "@/assets/projects/bottle-filling-3.jpg";
import bottleFilling4 from "@/assets/projects/bottle-filling-4.jpg";
import bottleFilling5 from "@/assets/projects/bottle-filling-5.jpg";
import evRotavator1 from "@/assets/projects/ev-rotavator-1.jpg";
import evRotavator2 from "@/assets/projects/ev-rotavator-2.jpg";
import evRotavator3 from "@/assets/projects/ev-rotavator-3.jpg";
import evRotavator4 from "@/assets/projects/ev-rotavator-4.jpg";
import evRotavator5 from "@/assets/projects/ev-rotavator-5.jpg";
import borbique1 from "@/assets/projects/borbique-1.jpeg";
import borbique2 from "@/assets/projects/borbique-2.jpeg";
import borbique3 from "@/assets/projects/borbique-3.jpeg";
import borbique4 from "@/assets/projects/borbique-4.jpeg";
import borbique5 from "@/assets/projects/borbique-5.jpeg";
import borbique8 from "@/assets/projects/borbique-8.jpeg";
import borbique9 from "@/assets/projects/borbique-9.jpeg";
import borbique10 from "@/assets/projects/borbique-10.jpeg";
import fridge1 from "@/assets/projects/fridge-1.jpg";
import selfNavRobot1 from "@/assets/projects/self-navigating-robot-1.jpg";
import effiQue1 from "@/assets/projects/effi-que-ev-car-1.jpg";
import effiQue1Avif from "@/assets/projects/effi-que-ev-car-1.avif";
import effiQue2 from "@/assets/projects/effi-que-ev-car-2.avif";

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
    articleUrl: "/projects/article/ecommerce-platform",
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
    articleUrl: "/projects/article/iot-smart-home",
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
    articleUrl: "/projects/article/inventory-management",
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
    articleUrl: "/projects/article/analytics-dashboard",
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
    articleUrl: "/projects/article/task-management",
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
    articleUrl: "/projects/article/weather-station",
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
    articleUrl: "/projects/article/restaurant-pos",
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
    title: "EFFI-QUE EV Car",
    description: "Complete 3D CAD design of an electric vehicle platform with structural and battery thermal optimization for sustainable urban transportation.",
    images: [effiQue1, effiQue1Avif, effiQue2],
    tags: ["SolidWorks", "FEA", "Battery Thermal", "EV Powertrain"],
    articleUrl: "/projects/article/effi-que-ev-car",
    featured: false,
    category: "engineering",
  },
  {
    id: 22,
    title: "Industrial BORBIQUE Cooking Machine",
    description: "High-capacity industrial cooking system with thermally optimized chamber and energy-efficient heat distribution for large-scale food production.",
    images: [borbique1, borbique2, borbique3, borbique4, borbique5, borbique8, borbique9, borbique10],
    tags: ["SolidWorks", "Thermal Analysis", "Industrial Equipment"],
    articleUrl: "/projects/article/borbique-cooking-machine",
    featured: false,
    category: "engineering",
  },
  {
    id: 23,
    title: "Efficient & Sustainable Rocket Stove",
    description: "Low-cost, fuel-efficient cooking solution for rural communities with optimized combustion chamber and reduced smoke emissions.",
    images: [rocketStoveImg, cadAutomotiveImg, creoImg, plmImg, flexsimImg],
    tags: ["SolidWorks", "Combustion Optimization", "Thermal Simulation"],
    articleUrl: "/projects/article/rocket-stove",
    featured: false,
    category: "engineering",
  },
  {
    id: 24,
    title: "Self-Navigating Robot for Safe Movement",
    description: "Autonomous mobile robot with IoT sensors and real-time navigation for industrial warehouse automation and obstacle avoidance.",
    images: [selfNavRobot1],
    tags: ["IoT", "Autonomous Navigation", "Sensor Integration"],
    articleUrl: "/projects/article/self-navigating-robot",
    featured: false,
    category: "engineering",
  },
  {
    id: 25,
    title: "IoT Smart Home Automation",
    description: "Centralized smart control system for residential environments enabling remote control of lighting, appliances, and security via mobile app.",
    images: [iotHome1, iotHome2, iotHome3, iotHome4, iotHome5],
    tags: ["IoT Systems", "Wireless Communication", "Embedded Controllers"],
    articleUrl: "/projects/article/iot-smart-home-automation",
    featured: false,
    category: "engineering",
  },
  {
    id: 26,
    title: "Mini Electronic Fridge",
    description: "Compact refrigeration system using thermoelectric cooling technology with energy-efficient design for personal and portable use.",
    images: [fridge1],
    tags: ["Electronic Cooling", "Thermal Design", "Product Engineering"],
    articleUrl: "/projects/article/mini-electronic-fridge",
    featured: false,
    category: "engineering",
  },
  {
    id: 27,
    title: "3D Extruder Machine",
    description: "Precision plastic extrusion system for 3D printing with temperature-controlled heating chamber and multi-filament support.",
    images: [extruder1, extruder2, extruder3, extruder4, extruder5],
    tags: ["Additive Manufacturing", "Mechanical Design", "Thermal Control"],
    articleUrl: "/projects/article/3d-extruder-machine",
    featured: false,
    category: "engineering",
  },
  {
    id: 28,
    title: "Automatic Bottle Filling Machine",
    description: "High-speed automated liquid filling system with PLC control, achieving 120 bottles per minute with ±2ml filling accuracy.",
    images: [bottleFilling1, bottleFilling2, bottleFilling3, bottleFilling4, bottleFilling5],
    tags: ["Industrial Automation", "PLC Systems", "Mechanical Design"],
    articleUrl: "/projects/article/bottle-filling-machine",
    featured: false,
    category: "engineering",
  },
  {
    id: 29,
    title: "EV Agriculture Rotavator Car",
    description: "Battery-powered electric rotavator vehicle for automated soil tilling, reducing manual labor by 50% with 3–5 km/h operating speed.",
    images: [evRotavator1, evRotavator2, evRotavator3, evRotavator4, evRotavator5],
    tags: ["Electric Motor Drive", "Agricultural Automation", "Embedded Control", "Battery Powered"],
    articleUrl: "/projects/article/ev-rotavator-agriculture",
    featured: false,
    category: "engineering",
  },
  {
    id: 31,
    title: "Autonomous Maze Navigation Robot",
    description: "Compact robotic vehicle with ultrasonic sensors and Arduino control for autonomous obstacle avoidance and maze navigation.",
    images: [mazeRobot1, mazeRobot5, mazeRobot3, mazeRobot4, mazeRobot2],
    tags: ["Arduino", "Embedded Systems", "Ultrasonic Sensor", "Robotics"],
    articleUrl: "/projects/article/maze-navigation-robot",
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ src: string; alt: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAccessModal, setShowAccessModal] = useState(false);

  const { user } = useAuth();
  const { guest } = useGuest();
  const currentUserEmail = user?.email || guest?.email || null;
  const currentUserName = user?.email?.split("@")[0] || guest?.name || null;

  const projects = activeTab === "it" ? itProjects : engineeringProjects;
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const allProjects = [...itProjects, ...engineeringProjects];
  const projectIds = useMemo(() => allProjects.map((p) => String(p.id)), []);
  const { viewCounts, likeCounts } = useProjectListCounts(projectIds);

  const openLightbox = (images: string[], title: string, index: number) => {
    setLightboxImages(images.map((src, i) => ({ src, alt: `${title} - Image ${i + 1}` })));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLikeProject = async (projectId: number) => {
    if (!currentUserEmail || !currentUserName) {
      setShowAccessModal(true);
      return;
    }
    const { error } = await supabase.from("project_likes").insert({
      project_id: String(projectId),
      name: currentUserName,
      email: currentUserEmail,
    });
    if (!error) {
      toast({ description: "Project liked!" });
    } else if (error.code === "23505") {
      toast({ description: "You already liked this project." });
    }
  };

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
        <section className="py-10 sm:py-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="section-badge-sharp mb-4 sm:mb-6 inline-flex">
                <span className="section-badge-dot-sharp" />
                <span className="text-secondary-foreground font-medium text-xs sm:text-sm">Portfolio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                My <span className="text-foreground">Projects</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">
                A collection of my work spanning IT development and Engineering design.
              </p>
            </motion.div>

            {/* Category Tabs - Sharp Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center mt-6 sm:mt-10 gap-2 sm:gap-4 px-4"
            >
              <button
                onClick={() => setActiveTab("it")}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all duration-300 border-2 text-sm sm:text-base ${
                  activeTab === "it"
                    ? "bg-foreground text-background border-foreground shadow-lg"
                    : "bg-card text-muted-foreground hover:bg-muted border-border hover:border-foreground"
                }`}
              >
                <Code2 size={18} />
                IT Projects ({itProjects.length})
              </button>
              <button
                onClick={() => setActiveTab("engineering")}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all duration-300 border-2 text-sm sm:text-base ${
                  activeTab === "engineering"
                    ? "bg-foreground text-background border-foreground shadow-lg"
                    : "bg-card text-muted-foreground hover:bg-muted border-border hover:border-foreground"
                }`}
              >
                <Cog size={18} />
                Engineering ({engineeringProjects.length})
              </button>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects */}
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
                {/* Featured Section */}
                {featuredProjects.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="w-2 h-8 bg-primary" />
                      Featured Projects
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      {featuredProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group sharp-card overflow-hidden hover:border-primary/50 transition-all duration-300"
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <ProjectImageCarousel images={project.images} title={project.title} onImageClick={(i) => openLightbox(project.images, project.title, i)} />
                            <div className="absolute top-4 left-4 z-10">
                              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold">
                                Featured
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Eye size={13} /> {viewCounts[String(project.id)] || 0} views</span>
                              <button onClick={() => handleLikeProject(project.id)} className="flex items-center gap-1 hover:text-primary transition-colors">
                                <Heart size={13} /> {likeCounts[String(project.id)] || 0} likes
                              </button>
                            </div>
                            <ProjectComments projectId={String(project.id)} />
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                              >
                                View Live <ExternalLink size={14} />
                              </a>
                            )}
                            {project.articleUrl && (
                              <Link
                                to={project.articleUrl}
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                              >
                                Read Case Study <FileText size={14} />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Projects Grid */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-accent" />
                    All Projects
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {otherProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group sharp-card overflow-hidden hover:border-primary/50 transition-all duration-300"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <ProjectImageCarousel images={project.images} title={project.title} onImageClick={(i) => openLightbox(project.images, project.title, i)} />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground relative">
                            <span className="flex items-center gap-1"><Eye size={12} /> {viewCounts[String(project.id)] || 0}</span>
                            <button onClick={() => handleLikeProject(project.id)} className="flex items-center gap-1 hover:text-primary transition-colors">
                              <Heart size={12} /> {likeCounts[String(project.id)] || 0}
                            </button>
                            <ProjectComments projectId={String(project.id)} compact />
                          </div>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              View Live <ExternalLink size={12} />
                            </a>
                          )}
                          {project.articleUrl && (
                            <Link
                              to={project.articleUrl}
                              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              Read More <FileText size={12} />
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
      <GuestAccessModal isOpen={showAccessModal} onClose={() => setShowAccessModal(false)} />
    </>
  );
};

export default ProjectsPage;
