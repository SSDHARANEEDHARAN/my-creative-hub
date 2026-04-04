import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, FileText, Code2, Cog, Eye, Heart, MessageSquare, Factory } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";
import ImageLightbox from "@/components/ImageLightbox";
import { useProjectListCounts } from "@/hooks/useProjectData";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import GuestAccessModal from "@/components/GuestAccessModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ProjectComments from "@/components/ProjectComments";
import {
  itProjects as sharedItProjects,
  engineeringProjects as sharedEngineeringProjects,
} from "@/data/projectsData";

// Import project images
import ecommerceImg from "@/assets/project-ecommerce.jpg";
import iotImg from "@/assets/project-iot.jpg";
import mindscape1 from "@/assets/projects/mindscape-1.png";
import mindscape2 from "@/assets/projects/mindscape-2.png";
import mindscape3 from "@/assets/projects/mindscape-3.png";
import mindscape4 from "@/assets/projects/mindscape-4.png";
import mindscape5 from "@/assets/projects/mindscape-5.png";
import mindscape6 from "@/assets/projects/mindscape-6.png";
import mindscape7 from "@/assets/projects/mindscape-7.png";
import mindscape8 from "@/assets/projects/mindscape-8.png";
import mindscape9 from "@/assets/projects/mindscape-9.png";
import mindscape10 from "@/assets/projects/mindscape-10.png";
import smarthome1 from "@/assets/projects/smarthome-1.jpg";
import smarthome2 from "@/assets/projects/smarthome-2.jpg";
import smarthome3 from "@/assets/projects/smarthome-3.jpg";
import smarthome4 from "@/assets/projects/smarthome-4.jpg";
import smarthome5 from "@/assets/projects/smarthome-5.jpg";
import smarthome6 from "@/assets/projects/smarthome-6.jpg";
import smarthome7 from "@/assets/projects/smarthome-7.jpg";
import smarthome8 from "@/assets/projects/smarthome-8.jpg";
import smarthome9 from "@/assets/projects/smarthome-9.jpg";
import smarthome10 from "@/assets/projects/smarthome-10.jpg";
import inventoryImg from "@/assets/project-inventory.jpg";
import servoScientific1 from "@/assets/projects/servo-scientific-1.png";
import servoScientific2 from "@/assets/projects/servo-scientific-2.png";
import servoScientific3 from "@/assets/projects/servo-scientific-3.png";
import servoScientific4 from "@/assets/projects/servo-scientific-4.png";
import analyticsImg from "@/assets/project-analytics.jpg";
import swiftUpload1 from "@/assets/projects/swift-upload-1.png";
import swiftUpload2 from "@/assets/projects/swift-upload-2.png";
import swiftUpload3 from "@/assets/projects/swift-upload-3.png";
import swiftUpload4 from "@/assets/projects/swift-upload-4.png";
import swiftUpload5 from "@/assets/projects/swift-upload-5.png";
import learnGrowHub1 from "@/assets/projects/learn-grow-hub-1.png";
import learnGrowHub2 from "@/assets/projects/learn-grow-hub-2.png";
import learnGrowHub3 from "@/assets/projects/learn-grow-hub-3.png";
import stickyNotePro1 from "@/assets/projects/sticky-note-pro-1.png";
import stickyNotePro2 from "@/assets/projects/sticky-note-pro-2.png";
import stickyNotePro3 from "@/assets/projects/sticky-note-pro-3.png";
import stickyNotePro4 from "@/assets/projects/sticky-note-pro-4.png";
import perfectHomes1 from "@/assets/projects/perfect-homes-1.png";
import perfectHomes2 from "@/assets/projects/perfect-homes-2.png";
import perfectHomes3 from "@/assets/projects/perfect-homes-3.png";
import perfectHomes4 from "@/assets/projects/perfect-homes-4.png";
import perfectHomes5 from "@/assets/projects/perfect-homes-5.png";
import cadAutomotiveImg from "@/assets/project-cad-automotive.jpg";
import flexsimImg from "@/assets/project-flexsim.jpg";
import creoImg from "@/assets/project-creo.jpg";
import plmImg from "@/assets/project-plm.jpg";
import smartFarmAi1 from "@/assets/projects/smart-farm-ai-1.png";
import smartFarmAi2 from "@/assets/projects/smart-farm-ai-2.png";
import smartFarmAi3 from "@/assets/projects/smart-farm-ai-3.png";
import smartFarmAi4 from "@/assets/projects/smart-farm-ai-4.png";
import smartFarmAi5 from "@/assets/projects/smart-farm-ai-5.png";
import smartFarmAi6 from "@/assets/projects/smart-farm-ai-6.png";
import codeflowLearn1 from "@/assets/projects/codeflow-learn-1.png";
import codeflowLearn2 from "@/assets/projects/codeflow-learn-2.png";
import codeflowLearn3 from "@/assets/projects/codeflow-learn-3.png";
import codeflowLearn4 from "@/assets/projects/codeflow-learn-4.png";
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
import extruder6 from "@/assets/projects/extruder-6.jpg";
import extruder7 from "@/assets/projects/extruder-7.jpg";
import extruder8 from "@/assets/projects/extruder-8.jpg";
import extruder9 from "@/assets/projects/extruder-9.jpg";
import extruder10 from "@/assets/projects/extruder-10.jpg";
import extruder11 from "@/assets/projects/extruder-11.jpg";
import extruder12 from "@/assets/projects/extruder-12.jpg";
import extruder13 from "@/assets/projects/extruder-13.jpg";
import extruder14 from "@/assets/projects/extruder-14.jpg";
import extruder15 from "@/assets/projects/extruder-15.jpg";
import extruder16 from "@/assets/projects/extruder-16.jpg";
import extruder17 from "@/assets/projects/extruder-17.jpg";
import extruder18 from "@/assets/projects/extruder-18.jpg";
import extruder19 from "@/assets/projects/extruder-19.jpg";
import extruder20 from "@/assets/projects/extruder-20.jpg";
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
import conveyorAlu1 from "@/assets/projects/conveyor-alu-1.jpg";
import conveyorAlu2 from "@/assets/projects/conveyor-alu-2.jpg";
import conveyorAlu3 from "@/assets/projects/conveyor-alu-3.jpg";
import conveyorAlu4 from "@/assets/projects/conveyor-alu-4.jpg";
import conveyorAlu5 from "@/assets/projects/conveyor-alu-5.jpg";
import conveyorAlu6 from "@/assets/projects/conveyor-alu-6.jpg";
import conveyorAlu7 from "@/assets/projects/conveyor-alu-7.jpg";
import conveyorAlu8 from "@/assets/projects/conveyor-alu-8.jpg";
import conveyorAlu9 from "@/assets/projects/conveyor-alu-9.jpg";
import cobotTrainer1 from "@/assets/projects/cobot-trainer-1.jpg";
import cobotTrainer2 from "@/assets/projects/cobot-trainer-2.jpg";
import cobotTrainer3 from "@/assets/projects/cobot-trainer-3.jpg";
import cobotTrainer4 from "@/assets/projects/cobot-trainer-4.jpg";
import cobotTrainer5 from "@/assets/projects/cobot-trainer-5.jpg";
import cobotTrainer6 from "@/assets/projects/cobot-trainer-6.jpg";
import cobotTrainer7 from "@/assets/projects/cobot-trainer-7.jpg";
import cobotTrainer8 from "@/assets/projects/cobot-trainer-8.jpg";
import cobotTrainer9 from "@/assets/projects/cobot-trainer-9.jpg";
import cobotTrainer10 from "@/assets/projects/cobot-trainer-10.jpg";
import cobotTrainer11 from "@/assets/projects/cobot-trainer-11.jpg";
import cobotTrainer12 from "@/assets/projects/cobot-trainer-12.jpg";
import cobotTrainer13 from "@/assets/projects/cobot-trainer-13.jpg";
import cobotTrainer14 from "@/assets/projects/cobot-trainer-14.jpg";
import cobotTrainer15 from "@/assets/projects/cobot-trainer-15.jpg";
import cobotTrainer16 from "@/assets/projects/cobot-trainer-16.jpg";
import cobotTrainer26 from "@/assets/projects/cobot-trainer-26.jpg";
import cobotTrainer27 from "@/assets/projects/cobot-trainer-27.jpg";
import cobotTrainer28 from "@/assets/projects/cobot-trainer-28.jpg";
import cobotTrainer29 from "@/assets/projects/cobot-trainer-29.jpg";
import cobotTrainer30 from "@/assets/projects/cobot-trainer-30.jpg";
import cobotTrainer31 from "@/assets/projects/cobot-trainer-31.jpg";
import cobotTrainer32 from "@/assets/projects/cobot-trainer-32.jpg";
import cobotTrainer33 from "@/assets/projects/cobot-trainer-33.jpg";
import cobotTrainer34 from "@/assets/projects/cobot-trainer-34.jpg";
import cobotTrainer35 from "@/assets/projects/cobot-trainer-35.jpg";
import cobotTrainer36 from "@/assets/projects/cobot-trainer-36.jpg";
import cobotTrainer37 from "@/assets/projects/cobot-trainer-37.jpg";
import cobotTrainer38 from "@/assets/projects/cobot-trainer-38.jpg";
import cobotTrainer39 from "@/assets/projects/cobot-trainer-39.jpg";
import cobotTrainer40 from "@/assets/projects/cobot-trainer-40.jpg";
import cobotTrainer41 from "@/assets/projects/cobot-trainer-41.jpg";
import cobotTrainer42 from "@/assets/projects/cobot-trainer-42.jpg";
import cobotTrainer43 from "@/assets/projects/cobot-trainer-43.jpg";
import cobotTrainer44 from "@/assets/projects/cobot-trainer-44.jpg";
import cobotTrainer45 from "@/assets/projects/cobot-trainer-45.jpg";

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
    title: "MindScape AI – Mental Health Analysis",
    description: "AI-powered mental health analysis platform integrating facial emotion recognition, social media sentiment analysis, AI chatbot assistant, and ESP32 wearable device synchronization for personalized wellness insights.",
    images: [mindscape1, mindscape2, mindscape3, mindscape4, mindscape5, mindscape6, mindscape7, mindscape8, mindscape9, mindscape10],
    tags: ["React.js", "AI/ML", "ESP32", "Emotion Detection", "IoT"],
    liveUrl: "https://mindscape-ai-orcin.vercel.app/",
    articleUrl: "/projects/article/mindscape-ai",
    featured: true,
    category: "it",
  },
  {
    id: 2,
    title: "SmartHome Harmony – IoT Home Automation",
    description: "Open-source IoT home automation platform with centralized web dashboard for smart device control, real-time sensor monitoring, automation rules, and energy consumption tracking. Built with React.js, Firebase, MQTT, ESP32, and custom IoT PCB.",
    images: [smarthome9, smarthome1, smarthome7, smarthome3, smarthome4, smarthome5, smarthome6, smarthome2, smarthome8, smarthome10],
    tags: ["React.js", "Firebase", "MQTT", "ESP32", "IoT"],
    liveUrl: "https://smart-home-harmony.vercel.app/",
    articleUrl: "/projects/article/iot-smart-home",
    featured: true,
    category: "it",
  },
  {
    id: 3,
    title: "Servo Scientific – Industrial Manufacturing Website",
    description: "Full-stack industrial company website with product catalog, service showcase, client inquiry system, and responsive design for a scientific equipment manufacturer.",
    images: [servoScientific1, servoScientific2, servoScientific3, servoScientific4],
    tags: ["React.js", "MongoDB", "Node.js", "Tailwind CSS"],
    liveUrl: "https://servo-scientific-dharaneedharansss-projects.vercel.app/",
    articleUrl: "/projects/article/servo-scientific",
    featured: false,
    category: "it",
  },
  {
    id: 4,
    title: "SS Perfect Homes – Interior & IoT Solutions",
    description: "Digital platform for home interior design, exterior architecture, and smart home IoT solutions with product showcases, service management, and client inquiry system.",
    images: [perfectHomes1, perfectHomes2, perfectHomes3, perfectHomes4, perfectHomes5],
    tags: ["React.js", "Tailwind CSS", "IoT", "ESP32", "Smart Home"],
    liveUrl: "https://ss-perfect-homes.vercel.app/",
    articleUrl: "/projects/article/perfect-homes",
    featured: false,
    category: "it",
  },
  {
    id: 5,
    title: "Swift Upload & Share – File Transfer Platform",
    description: "Lightweight web-based file transfer platform for secure file uploading, storage, and sharing through generated links with drag-and-drop interface and AI-powered file tools.",
    images: [swiftUpload1, swiftUpload2, swiftUpload3, swiftUpload4, swiftUpload5],
    tags: ["React.js", "Node.js", "Cloud Storage", "File Transfer"],
    liveUrl: "https://swift-upload-share.vercel.app/",
    articleUrl: "/projects/article/swift-upload",
    featured: false,
    category: "it",
  },
  {
    id: 6,
    title: "Sticky Note Pro – Cloud-Based Smart Notes",
    description: "Modern cloud-based sticky note platform with real-time synchronization, color-coded notes, drag-and-drop positioning, multi-auth (Google, Apple, Magic Link), and AI-powered productivity features.",
    images: [stickyNotePro1, stickyNotePro2, stickyNotePro3, stickyNotePro4],
    tags: ["React.js", "Tailwind CSS", "Cloud DB", "AI/LLM"],
    liveUrl: "https://sticky-note-pro.vercel.app/",
    articleUrl: "/projects/article/sticky-note-pro",
    featured: false,
    category: "it",
  },
  {
    id: 7,
    title: "CodeFlow Learn – Visual Programming Platform",
    description: "Interactive programming learning platform with node-based visual programming, JavaScript code playground, structured coding challenges, and progress tracking for beginners.",
    images: [codeflowLearn4, codeflowLearn1, codeflowLearn2, codeflowLearn3],
    tags: ["React.js", "React Flow", "JavaScript", "Tailwind CSS"],
    liveUrl: "https://codeflow-learn.vercel.app/",
    articleUrl: "/projects/article/codeflow-learn",
    featured: false,
    category: "it",
  },
  {
    id: 8,
    title: "Learn & Grow Hub – E-Learning Platform",
    description: "Web-based e-learning platform providing an interactive digital environment for students to access educational content, structured courses, and learning resources online.",
    images: [learnGrowHub1, learnGrowHub2, learnGrowHub3],
    tags: ["React.js", "Tailwind CSS", "E-Learning", "Cloud Hosting"],
    liveUrl: "https://learn-grow-hub-tan.vercel.app/",
    articleUrl: "/projects/article/learn-grow-hub",
    featured: false,
    category: "it",
  },
  {
    id: 9,
    title: "Smart Farm AI",
    description: "AI-powered precision agriculture platform integrating IoT sensors, machine learning crop health analysis, and real-time farm monitoring dashboard.",
    images: [smartFarmAi5, smartFarmAi6, smartFarmAi1, smartFarmAi2, smartFarmAi3, smartFarmAi4],
    tags: ["Python", "Raspberry Pi", "TensorFlow", "React"],
    liveUrl: "https://smart-farm-ai-murex.vercel.app/",
    articleUrl: "/projects/article/smart-agriculture",
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
    articleUrl: "/projects/article/learning-management",
    featured: false,
    category: "it",
  },
];

// 20 Engineering Projects with article URLs (matching existing article slugs)
const engineeringProjects: Project[] = [
  {
    id: 11,
    title: "Coming Soon",
    description: "Projects are updating coming soon new project stay tuned to watch",
    images: [],
    tags: ["Upcoming"],
    articleUrl: "/projects/article/automotive-engine-block",
    featured: true,
    category: "engineering",
  },
  {
    id: 20,
    title: "Mini Industrial Conveyor System (Aluminum Structure)",
    description: "Compact aluminum-framed conveyor system with variable speed motor drive (20–600 RPM), 510mm belt length, and 15kg load capacity for laboratory automation.",
    images: [conveyorAlu1, conveyorAlu2, conveyorAlu3, conveyorAlu4, conveyorAlu5, conveyorAlu6, conveyorAlu7, conveyorAlu8, conveyorAlu9],
    tags: ["Mechanical Design", "Industrial Automation", "CAD Modeling", "Fabrication"],
    articleUrl: "/projects/article/mini-conveyor-aluminum",
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
    images: [extruder20, extruder16, extruder15, extruder14, extruder9, extruder6, extruder7, extruder8, extruder10, extruder11, extruder12, extruder13, extruder17, extruder18, extruder19, extruder1, extruder2, extruder3, extruder4, extruder5],
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
    id: 32,
    title: "Cobot Trainer Kit with ATC – Industrial Didactic Robotics",
    description: "Industrial robotics training platform with collaborative robot arm, Automatic Tool Changer, multi-gripper system (DH Mechanical, Pneumatic, Vacuum), and modular workpiece stations for Industry 4.0 education.",
    images: [cobotTrainer1, cobotTrainer4, cobotTrainer8, cobotTrainer10, cobotTrainer9, cobotTrainer2, cobotTrainer3, cobotTrainer5, cobotTrainer6, cobotTrainer7, cobotTrainer11, cobotTrainer12, cobotTrainer13, cobotTrainer14, cobotTrainer15, cobotTrainer16, cobotTrainer26, cobotTrainer27, cobotTrainer28, cobotTrainer29, cobotTrainer30, cobotTrainer31, cobotTrainer32, cobotTrainer33, cobotTrainer34, cobotTrainer35, cobotTrainer36, cobotTrainer37, cobotTrainer38, cobotTrainer39, cobotTrainer40, cobotTrainer41, cobotTrainer42, cobotTrainer43, cobotTrainer44, cobotTrainer45],
    tags: ["Collaborative Robotics", "ATC", "Pneumatics", "Industry 4.0", "Mechatronics"],
    articleUrl: "/projects/article/cobot-trainer-kit-atc",
    featured: true,
    category: "engineering",
  },
];

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"it" | "engineering">("it");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ src: string; alt: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAccessModal, setShowAccessModal] = useState(false);

  const { user } = useAuth();
  const { guest } = useGuest();
  const currentUserEmail = user?.email || guest?.email || null;
  const currentUserName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || guest?.name || null;

  const projects = activeTab === "it" ? sharedItProjects : sharedEngineeringProjects;
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const projectIds = useMemo(
    () => [...sharedItProjects, ...sharedEngineeringProjects].map((project) => String(project.id)),
    []
  );
  const { viewCounts, likeCounts, refresh: refreshCounts } = useProjectListCounts(projectIds);

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
      refreshCounts();
      return;
    }

    if (error.code === "23505") {
      toast({ description: "You already liked this project." });
      refreshCounts();
      return;
    }

    toast({ title: "Error", description: "Failed to update like count.", variant: "destructive" });
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
                IT Projects ({sharedItProjects.length})
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
                Engineering ({sharedEngineeringProjects.length})
              </button>
              <button
                onClick={() => navigate("/industrial-projects")}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all duration-300 border-2 text-sm sm:text-base bg-card text-muted-foreground hover:bg-muted border-border hover:border-foreground"
              >
                <Factory size={18} />
                Industrial
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
                      New Projects
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
                            {project.images && project.images.length > 0 ? (
                              <ProjectImageCarousel images={project.images} title={project.title} onImageClick={(i) => openLightbox(project.images, project.title, i)} />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-6 text-center">
                                <span className="font-display font-bold text-2xl text-primary animate-pulse">Update in Progress</span>
                              </div>
                            )}
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
                            <div className="flex items-center gap-4">
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
                          {project.images && project.images.length > 0 ? (
                            <ProjectImageCarousel images={project.images} title={project.title} onImageClick={(i) => openLightbox(project.images, project.title, i)} />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-4 text-center rounded-t-xl">
                              <span className="font-display font-bold text-lg text-primary animate-pulse">Update in Progress</span>
                            </div>
                          )}
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
                          <div className="flex items-center gap-3">
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
