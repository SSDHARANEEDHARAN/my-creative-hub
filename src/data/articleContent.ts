export interface ArticleSection {
  title: string;
  content: string;
}

export interface KeyMetric {
  value: string | number;
  label: string | number;
}

export interface ArticleContent {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  client: string;
  role: string;
  overview: string;
  challenge: string;
  solution: string;
  process: ArticleSection[];
  results: string[];
  technologies: string[];
  lessons: string[];
  keyMetrics?: KeyMetric[];
  toolsUsed?: string[];
  teamSize?: string;
  industry?: string;
  conclusionVideoUrl?: string;
  conclusionVideoUrls?: string[];
}

export const articleContents: ArticleContent[] = [
  // ==================== IT PROJECTS ====================
  {
    id: 1,
    slug: "mindscape-ai",
    title: "MindScape AI – Intelligent Mental State Analysis & Health Assistant",
    subtitle: "AI-powered mental health analysis integrating facial recognition, social media sentiment, and wearable IoT devices",
    duration: "Ongoing",
    client: "Personal / Academic Project",
    role: "Full-Stack AI & IoT Developer",
    industry: "AI Healthcare / Mental Wellness",
    teamSize: "Solo Developer",
    overview: "MindScape AI is an intelligent AI-driven platform designed to analyze a user's mental and emotional state using multiple data sources, including facial expressions, social media activity, and conversational input. The system integrates artificial intelligence, web technologies, medical advisory algorithms, and embedded hardware communication to provide personalized insights related to emotional well-being, stress levels, and lifestyle improvements. The platform processes selfie-based facial analysis, Instagram profile activity patterns, and user interaction with an AI chatbot to estimate whether the user is experiencing states such as stress, happiness, anxiety, or neutral emotional conditions. Based on this analysis, the system provides AI-generated suggestions including diet plans, wellness recommendations, and medical guidance. Additionally, the platform supports real-time wearable device synchronization using embedded hardware to track health-related data.",
    challenge: "Building a unified mental health analysis platform that combines multiple AI models for facial emotion recognition, social media behavioral analysis, and conversational AI posed significant engineering challenges. The system needed to process selfie-based facial analysis with accurate emotion detection, analyze Instagram activity patterns for behavioral signals, and integrate a responsive AI chatbot for health guidance — all while maintaining real-time communication with ESP32-based wearable devices for health data synchronization. Ensuring data privacy, model accuracy across diverse user inputs, and seamless hardware-software integration added further complexity.",
    solution: "Implemented a three-layer architecture: a Frontend Application Layer (React.js dashboard for facial image upload, AI chatbot interaction, mental state results visualization, and health recommendations), an AI Processing Layer (emotion recognition AI models, sentiment analysis algorithms, medical recommendation models, and conversational AI chatbot), and an Embedded Device Communication Layer (ESP32 microcontroller with IoT messaging for wearable device data synchronization). The platform was deployed on Vercel with cloud API communication and real-time web application architecture.",
    process: [
      { title: "System Architecture Design", content: "Designed a three-layer system: Frontend Application Layer for user interaction (facial image upload, chatbot, results dashboard), AI Processing Layer for emotion detection, sentiment analysis, and medical recommendations, and Embedded Device Communication Layer using ESP32 for wearable health data sync." },
      { title: "Emotional State Detection", content: "Implemented AI models analyzing user inputs through multiple channels to determine emotional and psychological conditions including stress level detection, mood estimation (happy, neutral, stressed), behavioral pattern recognition, and social activity-based emotional insights." },
      { title: "Selfie-Based Facial Emotion Recognition", content: "Developed facial analysis pipeline where users upload or capture selfies analyzed using AI facial recognition models to detect emotional cues including facial expression patterns, eye and muscle movement signals, and mood classification based on facial features." },
      { title: "Social Media Behavior Analysis", content: "Built Instagram profile activity analysis system examining posting frequency, caption sentiment analysis, image emotion patterns, and activity engagement trends to identify potential emotional indicators linked to the user's mental state." },
      { title: "AI Medical Assistant Integration", content: "Integrated an AI chatbot functioning as a digital mental wellness assistant capable of answering health-related questions, suggesting mental wellness practices, providing AI-generated lifestyle recommendations, and offering diet and nutrition suggestions based on user condition." },
      { title: "Smart Wearable Device Integration", content: "Developed real-time synchronization with wearable devices using ESP32 microcontroller enabling real-time health data transmission, device-to-cloud communication, and message passing between wearable sensors and the platform for future smart watch integration." }
    ],
    results: [
      "AI-based emotional state detection with multi-source data analysis",
      "Facial expression mood analysis using AI recognition models",
      "Instagram activity sentiment evaluation for behavioral insights",
      "AI chatbot providing health, diet, and wellness suggestions",
      "Real-time wearable device data synchronization via ESP32",
      "Comprehensive web dashboard with mood charts, health metrics, and AI predictions"
    ],
    technologies: ["React.js", "JavaScript", "HTML5", "CSS/Tailwind", "Emotion Detection AI", "Sentiment Analysis", "Conversational AI", "ESP32", "IoT Messaging", "Vercel"],
    toolsUsed: ["VS Code", "Vercel Cloud Hosting", "AI Model APIs", "ESP32 Development Tools", "IoT Communication Protocols"],
    keyMetrics: [
      { value: "Multi-AI", label: "Model Integration" },
      { value: "Real-time", label: "IoT Sync" },
      { value: "3-Layer", label: "Architecture" },
      { value: "ESP32", label: "Hardware Link" }
    ],
    lessons: [
      "Combining multiple AI data sources (facial, social, conversational) provides more accurate emotional state estimation than any single source alone",
      "Real-time wearable device synchronization requires robust IoT messaging protocols for reliable health data transmission",
      "AI medical assistants should provide general wellness guidance rather than direct medical diagnosis to ensure responsible AI use"
    ]
  },
  {
    id: 2,
    slug: "iot-smart-home",
    title: "SmartHome Harmony – IoT Home Automation & Embedded Control Platform",
    subtitle: "Full-stack IoT platform integrating web technologies, cloud services, embedded systems, and custom hardware",
    duration: "Ongoing",
    client: "Open-Source / Personal Project",
    role: "Full-Stack IoT & Embedded Developer",
    industry: "Home Automation / IoT / Embedded Systems",
    teamSize: "Solo Developer",
    overview: "SmartHome Harmony is a full-stack IoT Home Automation Platform that integrates web technologies, cloud services, embedded systems, and custom hardware to provide intelligent control and monitoring of home devices. The system is designed with a hybrid IT and embedded architecture, combining a web-based control dashboard with microcontroller-driven hardware nodes. The platform enables users to remotely control appliances, monitor environmental sensors, and configure automated behaviors through a centralized interface. This project demonstrates the integration of full-stack web development, IoT communication protocols, cloud infrastructure, and embedded hardware systems.",
    challenge: "Building a unified smart home platform that seamlessly bridges web technologies with embedded IoT hardware posed significant challenges. The system needed real-time device communication with minimal latency, support for multiple IoT protocols (MQTT, Wi-Fi, SPI/I2C/UART), and reliable cloud synchronization. Designing a custom IoT PCB board for centralized device management added hardware engineering complexity. The platform also needed to handle wireless communication reliability, power efficiency for embedded nodes, and sensor data accuracy across diverse environmental conditions.",
    solution: "Implemented a three-layer architecture: a User Interface Layer (React.js/Next.js dashboard), a Cloud & Communication Layer (Firebase Realtime Database + MQTT broker), and an Embedded Device Layer (ESP32 controllers, Raspberry Pi gateway, smart relays, custom PCB). Deployed on Vercel with Git-based CI/CD. Used Firebase Authentication for secure access and MQTT for low-latency bidirectional device messaging. Developed custom IoT control PCB currently under testing for centralized embedded control.",
    process: [
      { title: "System Architecture Design", content: "Designed three primary engineering layers: User Interface Layer (web dashboard for device control, sensor monitoring, automation rules, energy analytics), Cloud & Communication Layer (Firebase Database, MQTT Broker, IoT Device Authentication, Cloud Data Storage), and Embedded Device Layer (ESP32, Raspberry Pi, smart relays, sensors)." },
      { title: "Frontend Dashboard Development", content: "Built the SmartHome Harmony dashboard using React.js, Next.js, Tailwind CSS, and TypeScript. Implemented real-time device state monitoring, room-based device management, energy usage tracking and visualization, and automation rule configuration interface." },
      { title: "Cloud & Backend Integration", content: "Integrated Firebase Realtime Database for cloud data synchronization, Firebase Authentication for user security, MQTT protocol for real-time IoT device communication, and REST API endpoints for device control commands." },
      { title: "Embedded Hardware Development", content: "Programmed ESP32 microcontrollers for appliance switching using smart relays, environmental sensor monitoring (temperature, humidity, current/energy), real-time device state reporting, and wireless communication with cloud servers. Integrated Raspberry Pi as gateway node." },
      { title: "Custom PCB Development", content: "Designed and developed a custom IoT smart home controller PCB to serve as the central embedded system. Hardware testing focuses on system stability, reliable cloud communication, power efficiency, and sensor data accuracy." },
      { title: "Deployment & DevOps", content: "Deployed the web platform on Vercel Cloud Hosting with Git-based CI/CD pipeline. Configured Firebase Console for cloud management. Used Arduino IDE and ESP-IDF for embedded firmware development with serial debugging tools." }
    ],
    results: [
      "Full-stack IoT platform with real-time device control and monitoring",
      "Cloud-connected embedded systems with Firebase and MQTT integration",
      "Custom IoT control PCB designed and under active testing",
      "Scalable IoT architecture supporting multiple communication protocols",
      "Room-based device management with automation and scheduling",
      "Energy monitoring with real-time consumption visualization"
    ],
    technologies: ["React.js", "Next.js", "Tailwind CSS", "TypeScript", "Firebase Realtime DB", "Firebase Auth", "MQTT Protocol", "REST API", "ESP32", "Raspberry Pi", "Smart Relays", "Custom IoT PCB", "Vercel", "Git CI/CD"],
    toolsUsed: ["VS Code", "Git & GitHub", "Vercel", "Firebase Console", "Arduino IDE", "ESP-IDF Framework", "Raspberry Pi OS", "Serial Debugging Tools", "MQTT Explorer"],
    keyMetrics: [
      { value: "Real-time", label: "Device Control" },
      { value: "3-Layer", label: "Architecture" },
      { value: "Custom", label: "PCB Board" },
      { value: "Full-Stack", label: "IT + Embedded" }
    ],
    lessons: ["A hybrid IT and embedded architecture requires careful protocol selection (MQTT for low-latency, REST for configuration)", "Firebase Realtime Database provides excellent free-tier support for IoT prototyping with real-time sync", "Custom PCB development significantly improves reliability and scalability over breadboard prototypes", "Git-based CI/CD with Vercel enables rapid iteration on the web dashboard while hardware development continues independently"]
  },
  {
    id: 3,
    slug: "servo-scientific",
    title: "Servo Scientific – Industrial Manufacturing Company Website",
    subtitle: "Full-stack web platform for a scientific and industrial equipment manufacturer",
    duration: "Ongoing",
    client: "Servo Scientific Suppliers",
    role: "Full-Stack Web Developer",
    industry: "Industrial Manufacturing / Scientific Equipment",
    teamSize: "Solo Developer",
    overview: "The Servo Scientific Industrial Website is a full-stack web platform developed for a manufacturing and engineering company to showcase its products, services, and technical capabilities online. The platform functions as a digital portfolio and corporate presence for an industrial organization, enabling clients to explore product catalogs, company information, and technical services through an interactive web interface. The project was developed using modern web technologies including React.js for the frontend and MongoDB for data management, creating a scalable and responsive industrial website suitable for manufacturing businesses.",
    challenge: "The company needed a modern digital platform to present their industrial equipment catalog (heating instruments, industrial furnaces, environmental chambers, heaters, microbiology instruments, thermocouples), engineering services, and manufacturing capabilities. The website required responsive design for desktop and mobile, dynamic product content rendering, a client inquiry and contact system, and scalable architecture for future admin dashboard and product management features.",
    solution: "Built a full-stack web application with React.js frontend using Tailwind CSS for responsive styling, MongoDB for product and inquiry data storage, Node.js backend environment with REST API communication, and deployed on Vercel for global cloud access. The platform features a structured navigation with product categories, individual product detail pages with image galleries, company overview sections, and a contact/inquiry system for business communications.",
    process: [
      { title: "Requirements Analysis", content: "Documented the company's product categories (Heating Instruments, Industrial Furnace, Environmental Chamber, Heater, Microbiology Instruments, Thermocouple) and defined the website structure for product showcase, company profile, and client contact interface." },
      { title: "Frontend Development", content: "Built responsive React.js components with Tailwind CSS for the homepage hero section, product category navigation with dropdown menus, individual product detail pages with image carousels, and contact form interface." },
      { title: "Product Catalog System", content: "Developed dynamic product pages with image galleries, product descriptions, key features, and inquiry buttons. Implemented category-based navigation for easy product browsing." },
      { title: "Backend & Database Integration", content: "Set up MongoDB database for product information storage, project portfolio management, client inquiry data handling, and company information. Implemented REST API communication between frontend and backend." },
      { title: "Contact & Inquiry System", content: "Built a contact module allowing users to send business inquiries, request product information, connect with the engineering team, and submit service requests." },
      { title: "Deployment & Optimization", content: "Deployed on Vercel Cloud with Git-based version control. Optimized for performance, SEO, and mobile responsiveness across all device types." }
    ],
    results: [
      "Modern industrial company website with professional product presentation",
      "Responsive UI optimized for desktop and mobile devices",
      "Dynamic product catalog with category-based navigation",
      "Client inquiry and contact system for business communications",
      "Scalable full-stack architecture ready for future admin dashboard",
      "Cloud deployment providing global access and fast load times"
    ],
    technologies: ["React.js", "JavaScript", "HTML5", "CSS/Tailwind CSS", "MongoDB", "Node.js", "REST API", "Vercel"],
    toolsUsed: ["VS Code", "MongoDB Compass", "Vercel Dashboard", "Git", "Postman"],
    keyMetrics: [
      { value: "6+", label: "Product Categories" },
      { value: "Full-Stack", label: "Architecture" },
      { value: "Responsive", label: "Multi-Device" },
      { value: "Cloud", label: "Deployment" }
    ],
    conclusionVideoUrl: "/videos/servo-scientific-demo.mp4",
    lessons: [
      "Industrial websites require clear product categorization and easy navigation for technical buyers",
      "Responsive design is critical for manufacturing clients who access product information on various devices",
      "A structured inquiry system improves client engagement and lead generation for manufacturing companies"
    ]
  },
  {
    id: 4,
    slug: "perfect-homes",
    title: "SS Perfect Homes – Smart Home Interior, Exterior & IoT Solutions Platform",
    subtitle: "Digital platform combining architecture, interior design, and smart home IoT technology",
    duration: "Ongoing",
    client: "SS Perfect Homes – Interiors & Solutions",
    role: "Full-Stack Web & IoT Developer",
    industry: "Interior Design / Smart Home / IoT",
    teamSize: "Solo Developer",
    overview: "SS Perfect Homes is a digital platform designed to showcase and manage home interior design, exterior architecture, and smart home IoT solutions. The website functions as a complete service platform for residential design and smart home technology integration, allowing users to explore modern home designs, automation solutions, and architectural services. The project combines web-based portfolio presentation, service management, and IoT technology integration, creating a platform where customers can discover home design concepts, smart automation solutions, and technology-enabled living environments.",
    challenge: "The client needed a unified digital platform that presents interior design portfolios (living rooms, modular kitchens, bedrooms, workspaces), exterior architectural concepts (house elevations, landscape designs), and smart home IoT solutions (smart lighting, automated appliance control, security systems, energy monitoring) — all within a responsive, modern web experience with client inquiry capabilities.",
    solution: "Built a three-layer architecture: a Web Application Layer (React.js with Tailwind CSS for design gallery browsing, service information display, client contact forms, and smart home solution presentation), a Service & Content Management Layer (interior design project data, exterior architecture portfolios, IoT solution descriptions, customer inquiries), and a Smart Home Technology Layer (ESP32 microcontroller-based devices, smart sensors, IoT communication protocols, remote device monitoring). Deployed on Vercel with Git-based workflow.",
    process: [
      { title: "Platform Architecture Design", content: "Designed a three-layer system: Web Application Layer for user interface and design portfolio experience, Service & Content Management Layer for managing design and IoT content, and Smart Home Technology Layer for IoT device integration and automation." },
      { title: "Interior Design Showcase", content: "Built visual portfolio sections for living room designs, modular kitchen concepts, bedroom interiors, office workspace layouts, and decorative lighting and furniture concepts with image carousels and product detail cards." },
      { title: "Exterior & Architectural Design", content: "Developed exterior house elevation design showcases, structural layout concepts, garden and landscape designs, and exterior lighting and outdoor architecture presentations." },
      { title: "Smart Home IoT Integration", content: "Integrated IoT-enabled features including smart lighting control systems, automated appliance control, security monitoring systems, remote device management, and energy consumption monitoring using ESP32 microcontrollers and IoT communication protocols." },
      { title: "Client Inquiry System", content: "Built contact and inquiry forms with service selection dropdowns, project description fields, and contact information collection for business communications." },
      { title: "Deployment & Optimization", content: "Deployed on Vercel Cloud with responsive design optimized for desktop and mobile. Implemented dark/light theme toggle and modern UI patterns." }
    ],
    results: [
      "Complete interior design portfolio with multiple room categories",
      "Exterior architecture showcase with modern house elevation concepts",
      "Smart home IoT integration supporting ESP32-based automation devices",
      "Responsive modern web interface with dark/light theme support",
      "Client inquiry system for business communication and lead generation",
      "IoT product catalog with specifications, dimensions, and feature listings"
    ],
    technologies: ["React.js", "JavaScript", "HTML5", "CSS/Tailwind CSS", "ESP32", "IoT Protocols", "Smart Sensors", "Vercel"],
    toolsUsed: ["VS Code", "Vercel Dashboard", "Git", "ESP32 Development Tools", "IoT Communication Tools"],
    keyMetrics: [
      { value: "3-Layer", label: "Architecture" },
      { value: "IoT", label: "Smart Home" },
      { value: "Full-Stack", label: "Web Platform" },
      { value: "Responsive", label: "Multi-Device" }
    ],
    conclusionVideoUrl: "/videos/perfect-homes-demo.mp4",
    lessons: [
      "Combining interior design presentation with IoT technology creates a compelling unified platform for modern home solutions",
      "Smart home IoT integration requires clear product categorization and specification presentation for customer understanding",
      "A three-layer architecture effectively separates presentation, content management, and technology integration concerns"
    ]
  },
  {
    id: 5,
    slug: "swift-upload",
    title: "Swift Upload & Share – Web-Based File Transfer Platform",
    subtitle: "Lightweight file upload, storage, and sharing solution",
    duration: "6 weeks",
    client: "Personal Project – Safe Eye Platform",
    role: "Full Stack Developer",
    industry: "Cloud Services & File Management",
    teamSize: "1 Developer",
    conclusionVideoUrl: "/videos/swift-upload-demo.mp4",
    overview: "Swift Upload & Share is a lightweight web-based file transfer platform designed to allow users to securely upload, store, and share files through a simple web interface. The system enables quick file sharing without requiring complex configuration, making it suitable for personal use, team collaboration, and quick data exchange. The platform also integrates AI-powered file tools including image editing, upscaling, background removal, OCR, PDF compression, and more.",
    challenge: "Users needed a simple, fast way to share files without complex setup or heavy enterprise tools. The platform had to support drag-and-drop uploading, multiple file formats, anonymous uploads up to 500MB, and authenticated uploads up to 2GB. Additionally, AI-powered file manipulation tools were needed to provide value beyond basic file transfer.",
    solution: "Built a React.js frontend with a clean, modern UI featuring drag-and-drop file upload, shareable link generation, and a comprehensive AI tools suite. The backend handles file validation, secure storage, and download request management through a scalable cloud architecture deployed on Vercel.",
    process: [
      { title: "UI/UX Design", content: "Designed a minimal, intuitive interface with clear upload zones, progress indicators, and a tools discovery page with categorized AI features." },
      { title: "File Upload System", content: "Implemented drag-and-drop file upload supporting multiple formats with browser-based progress tracking and server-side storage handling." },
      { title: "File Sharing System", content: "Built shareable link generation for uploaded files enabling quick transfer between users without authentication requirements." },
      { title: "AI Tools Integration", content: "Integrated AI-powered tools including image editing, upscaling, recoloring, background removal, OCR text extraction, image vectorization, 3D conversion, image-to-video, and PDF tools." },
      { title: "Authentication System", content: "Implemented user authentication with sign-in/sign-up flows, allowing registered users to upload files up to 2GB and access upload history." },
      { title: "Deployment", content: "Deployed on Vercel cloud platform with Git-based workflow for continuous deployment and global CDN distribution." }
    ],
    results: [
      "Anonymous file uploads supported up to 500MB without login",
      "Authenticated users can share files up to 2GB",
      "12+ AI-powered file tools available including image editing and PDF manipulation",
      "Sub-second file link generation for instant sharing",
      "Responsive design works across all devices and screen sizes",
      "Cloud deployment ensures global accessibility and fast transfer speeds"
    ],
    technologies: ["React.js", "JavaScript", "HTML5", "CSS", "Node.js", "Cloud Storage", "Vercel"],
    toolsUsed: ["VS Code", "Git", "Vercel Dashboard", "Chrome DevTools"],
    keyMetrics: [
      { value: "500MB", label: "Anonymous Upload" },
      { value: "2GB", label: "Auth Upload Limit" },
      { value: "12+", label: "AI Tools" },
      { value: "<1s", label: "Link Generation" }
    ],
    lessons: [
      "Simple, focused tools with minimal friction drive higher user adoption than feature-heavy alternatives",
      "Supporting anonymous uploads with reasonable limits encourages first-time usage while authentication unlocks premium features",
      "AI-powered file tools add significant value beyond basic file transfer functionality"
    ]
  },
  {
    id: 6,
    slug: "sticky-note-pro",
    title: "Sticky Note Pro – Cloud-Based Smart Notes Platform",
    subtitle: "Modern productivity tool with cloud sync and AI features",
    duration: "8 weeks",
    client: "Personal Project – Productivity Tool",
    role: "Full Stack Developer",
    industry: "Productivity / SaaS",
    teamSize: "1 Developer",
    overview: "Sticky Note Pro is a modern web-based note management platform that allows users to create, organize, and manage digital sticky notes directly in the browser. The application provides a lightweight and intuitive interface inspired by physical sticky notes, helping users quickly capture ideas, reminders, and tasks. It supports real-time cloud storage, multiple authentication methods (Google, Apple, Magic Link, OTP), and AI-powered productivity features.",
    challenge: "Building a seamless note-taking experience that feels as natural as physical sticky notes while providing cloud persistence, real-time sync across devices, and secure multi-auth login. The UI needed to support drag-and-drop positioning, color-coded organization, and responsive design for both desktop and mobile users.",
    solution: "Developed a React.js frontend with Tailwind CSS for a clean, sticky-note-inspired UI. Integrated cloud backend services for real-time note synchronization and secure authentication via Google, Apple, Magic Link, and phone OTP. Added AI integration layer supporting text analysis, content summarization, and chat assistance powered by Large Language Models.",
    process: [
      { title: "UI/UX Design", content: "Designed a sticky-note-inspired workspace with color-coded notes, pin decorations, and drag-and-drop positioning. Created responsive layouts for desktop and mobile." },
      { title: "Authentication System", content: "Implemented multiple login methods including Google Sign-In, Apple Sign-In, Magic Link (email-based), and Phone OTP for maximum accessibility and security." },
      { title: "Cloud Backend", content: "Set up cloud database for real-time note storage and synchronization. Implemented automatic saving so users never lose their work." },
      { title: "Note Management", content: "Built core features: creating, editing, deleting, and color-coding notes. Added drag-and-drop positioning for spatial organization." },
      { title: "AI Integration", content: "Integrated LLM-powered features for text analysis, content summarization, and AI chat assistance to boost productivity." },
      { title: "Deployment", content: "Deployed on Vercel with Git-based CI/CD pipeline for continuous updates and scalable cloud hosting." }
    ],
    results: [
      "Fully functional cloud-based sticky note platform with real-time sync",
      "4 authentication methods for flexible and secure user access",
      "Color-coded note organization with drag-and-drop positioning",
      "AI-powered productivity features including summarization and chat",
      "Responsive design working seamlessly across desktop and mobile",
      "Scalable serverless architecture with zero-downtime deployments"
    ],
    technologies: ["React.js", "Tailwind CSS", "Cloud Database", "Authentication APIs", "LLM/AI", "Vercel"],
    toolsUsed: ["VS Code", "Vercel Dashboard", "Git/GitHub", "Cloud Backend Console"],
    keyMetrics: [
      { value: "4", label: "Auth Methods" },
      { value: "Real-time", label: "Cloud Sync" },
      { value: "AI", label: "LLM Integration" },
      { value: "100%", label: "Responsive" }
    ],
    conclusionVideoUrl: "/videos/sticky-note-pro-demo.mp4",
    lessons: ["Multiple authentication options dramatically improve user onboarding", "Sticky-note-inspired UI creates an intuitive and familiar user experience", "AI integration adds significant value to simple productivity tools"]
  },
  {
    id: 7,
    slug: "codeflow-learn",
    title: "CodeFlow Learn – Visual Programming Platform",
    subtitle: "Interactive programming education through node-based visual coding",
    duration: "8 weeks",
    client: "Personal / Academic Project",
    role: "Full-Stack Web Developer",
    industry: "Education Technology",
    teamSize: "Solo Developer",
    overview: "CodeFlow Learn is a modern interactive programming learning platform designed to teach coding concepts through visual node-based programming and hands-on coding exercises. The system allows learners to build program logic using Node Flow visual programming blocks while also providing a JavaScript code playground for direct coding practice. The platform focuses on improving programming education by combining visual logic building, coding challenges, and real-time execution environments.",
    challenge: "Traditional programming education often overwhelms beginners with syntax before they understand core logic concepts. Creating an engaging platform that bridges visual programming with real coding required building a node-based editor, code execution environment, and structured lesson system that progressively transitions learners from graphical workflows to traditional code.",
    solution: "Built a React.js application with React Flow for the node-based programming editor, featuring drag-and-drop Input/Process/Output nodes with visual data flow connections. Implemented a browser-based JavaScript code playground with syntax highlighting and real-time execution. Created 14 structured coding challenges covering JavaScript fundamentals through advanced async programming, with localStorage-based progress tracking.",
    conclusionVideoUrl: "/videos/codeflow-learn-demo.mp4",
    process: [
      { title: "Platform Architecture", content: "Designed a three-layer system: User Interface Layer for node flow and code editors, Logic Execution Layer for program execution and challenge validation, and Data Persistence Layer using localStorage for progress tracking." },
      { title: "Node Flow Editor", content: "Built a visual node-based programming interface using React Flow with custom Input, Process, and Output node types. Implemented drag-and-drop functionality and real-time data flow connections between nodes." },
      { title: "Code Playground", content: "Developed a browser-based JavaScript code editor with syntax highlighting, real-time code execution, error feedback, and support for variables, loops, and functions." },
      { title: "Challenges & Lessons", content: "Created 14 structured coding challenges covering JavaScript fundamentals, closures, async/await, promise chaining, DOM manipulation, and event-driven programming with step-by-step instructions and difficulty levels." },
      { title: "Progress Tracking", content: "Implemented challenge completion tracking with visual progress bar, mark-as-complete functionality, and persistent progress using localStorage." },
      { title: "Theme & Deployment", content: "Added dark/light theme toggle system. Deployed on Vercel Cloud Platform with responsive design for desktop and mobile learning." }
    ],
    results: [
      "14 structured coding challenges across multiple difficulty levels",
      "Node Flow visual programming editor with drag-and-drop node creation",
      "Real-time JavaScript code execution in browser-based playground",
      "Progress tracking system with visual completion indicators",
      "Dark and light theme support for different user preferences",
      "Responsive design supporting desktop and mobile learning"
    ],
    technologies: ["React.js", "JavaScript", "React Flow", "HTML5", "CSS", "Tailwind CSS", "Vercel"],
    toolsUsed: ["VS Code", "Git", "Vercel Dashboard", "Chrome DevTools", "Figma"],
    keyMetrics: [
      { value: "14", label: "Challenges" },
      { value: "2", label: "Code Editors" },
      { value: "100%", label: "Responsive" },
      { value: "Fast", label: "Execution" }
    ],
    lessons: ["Visual programming dramatically lowers the barrier to understanding core logic concepts", "Combining node-based and text-based coding creates an effective learning progression", "Structured challenges with clear objectives keep learners engaged and motivated"]
  },
  {
    id: 8,
    slug: "learn-grow-hub",
    title: "Learn & Grow Hub – E-Learning Platform",
    subtitle: "Web-based digital learning ecosystem for structured online education",
    duration: "Ongoing",
    client: "Personal / Academic Project",
    role: "Full-Stack Web Developer",
    industry: "Education Technology",
    teamSize: "Solo Developer",
    overview: "Learn & Grow Hub is a web-based E-Learning Platform designed to provide an interactive digital environment for students and learners to access educational content, courses, and learning resources online. The platform simplifies knowledge sharing by offering structured learning materials and an intuitive user interface for course navigation, demonstrating the implementation of a modern educational web application integrating course presentation, learner interaction, and digital content delivery.",
    challenge: "Creating an engaging and intuitive digital learning platform that organizes diverse educational content into structured modules while ensuring responsive performance across devices. The system needed to handle course browsing, multimedia content delivery, and provide a smooth learning experience with clear navigation for users of varying technical skill levels.",
    solution: "Built a modern React.js application with Tailwind CSS for responsive design, implementing a component-based architecture for course browsing, content display, and learning module navigation. The platform features category-based course filtering, multimedia learning resources, and a clean UI optimized for both desktop and mobile learning experiences. Deployed on Vercel for global accessibility.",
    conclusionVideoUrl: "/videos/learn-grow-hub-demo.mp4",
    process: [
      { title: "Platform Architecture Design", content: "Designed a three-layer system: Frontend Layer for user interface and learning interaction, Content Delivery Layer for course materials and multimedia resources, and Hosting & Deployment Layer for stable online accessibility." },
      { title: "Course Browsing Interface", content: "Implemented category-based course filtering (Embedded Systems, IoT, Industrial Automation, Programming, Electronics, Robotics, etc.), search functionality, and structured course card layouts with pricing, ratings, and enrollment details." },
      { title: "Course Detail Pages", content: "Built detailed course pages with descriptions, lesson counts, duration, difficulty levels, certificates of completion, reviews, and enrollment options including UPI payment integration." },
      { title: "Responsive UI Development", content: "Developed a fully responsive layout using Tailwind CSS ensuring smooth navigation across desktop, tablet, and mobile devices with consistent learning experience." },
      { title: "Content Management", content: "Structured course modules, video learning materials, educational articles, and learning guides into organized and accessible formats for learners." },
      { title: "Cloud Deployment", content: "Deployed on Vercel Cloud Platform with Git-based development workflow for continuous deployment and global content delivery." }
    ],
    results: [
      "Fully functional e-learning platform with structured course presentation",
      "Category-based course browsing across 10+ technical domains",
      "Responsive design working seamlessly on mobile and desktop",
      "Cloud-deployed platform with global accessibility via Vercel",
      "Intuitive navigation enabling easy course discovery and enrollment",
      "Scalable architecture ready for future features like progress tracking and quizzes"
    ],
    technologies: ["React.js", "JavaScript", "HTML5", "CSS", "Tailwind CSS", "Vercel"],
    toolsUsed: ["VS Code", "Git", "Vercel Dashboard", "Chrome DevTools", "Figma"],
    keyMetrics: [
      { value: "10+", label: "Course Categories" },
      { value: "100%", label: "Responsive" },
      { value: "Global", label: "Cloud Access" },
      { value: "Fast", label: "Page Load" }
    ],
    lessons: ["Structured content organization is critical for effective e-learning platforms", "Category-based filtering significantly improves course discovery", "Responsive design is essential for mobile learners who make up a large portion of users"]
  },
  {
    id: 9,
    slug: "smart-agriculture",
    title: "Smart Farm AI",
    subtitle: "AI-powered precision agriculture platform with IoT sensors",
    duration: "14 weeks",
    client: "FarmWise India",
    role: "IoT & ML Developer",
    industry: "Agriculture Technology",
    teamSize: "5 Engineers",
    overview: "Smart Farm AI is an intelligent precision agriculture platform designed to improve farm productivity through the integration of Artificial Intelligence, IoT sensors, and real-time data analytics. The system monitors environmental conditions, analyzes crop health, and provides farmers with actionable insights to optimize irrigation, disease prevention, and crop yield. The platform combines machine learning models, sensor-based data collection, and a cloud-based dashboard to enable data-driven agricultural management.",
    challenge: "500+ acres required scalable sensor networks. ML model needed 90%+ disease detection accuracy. Integration with existing pump infrastructure was essential. System needed to work with limited rural internet connectivity.",
    solution: "Deployed LoRaWAN sensor network with solar-powered nodes. Trained CNN model with ResNet transfer learning achieving 94% accuracy. Built NVIDIA Jetson edge computing gateway for local ML inference. Created React dashboard with GIS field mapping and real-time IoT sensor visualization.",
    process: [
      { title: "IoT Device Layer", content: "Deployed soil moisture sensors, temperature/humidity sensors, Raspberry Pi IoT gateway, and embedded sensor controllers across the farm." },
      { title: "AI & Data Processing", content: "Built plant disease classification using TensorFlow CNN with ResNet transfer learning. Implemented predictive analytics for crop health and environmental data processing pipelines." },
      { title: "Smart Irrigation", content: "Developed soil moisture monitoring with automated irrigation recommendations and water usage optimization based on environmental condition tracking." },
      { title: "Web Dashboard", content: "Built real-time farm monitoring dashboard with sensor data visualization, crop health monitoring, farm analytics, and AI-powered decision support tools." },
      { title: "Edge Computing", content: "Deployed NVIDIA Jetson for edge inference of drone imagery. Implemented image stitching for field-wide crop health analysis." },
      { title: "Pilot Deployment", content: "Deployed on 200-acre pilot farm. Refined system based on agronomist feedback over one crop cycle. Scaled to 1,500 acres across 3 farms." }
    ],
    results: [
      "Water usage reduced by 35% through precision irrigation management",
      "Crop yield increased by 18% compared to conventional farming practices",
      "94% accuracy in AI-powered crop disease detection",
      "1,500 acres of farm monitoring capability achieved",
      "Early pest detection prevented significant crop losses in pilot farm",
      "Farmer decision time reduced from days to hours for interventions"
    ],
    technologies: ["Python", "TensorFlow", "Raspberry Pi", "React", "JavaScript", "IoT Sensors", "Edge Computing"],
    toolsUsed: ["VS Code", "Jupyter Notebook", "QGIS", "DJI drone platform", "Grafana", "Vercel"],
    keyMetrics: [
      { value: "35%", label: "Water Savings" },
      { value: "18%", label: "Yield Increase" },
      { value: "94%", label: "Disease Detection" },
      { value: "1500ac", label: "Area Covered" }
    ],
    conclusionVideoUrl: "/videos/smart-farm-ai-demo.mp4",
    lessons: ["Edge computing enables ML inference in connectivity-limited rural areas", "Transfer learning dramatically reduces training data requirements for agriculture ML", "Agronomist involvement in system design ensures practical applicability"]
  },
  {
    id: 10,
    slug: "learning-management",
    title: "Learning Management System",
    subtitle: "Comprehensive e-learning platform with video streaming",
    duration: "16 weeks",
    client: "Professional Training Institute - SkillUp Academy",
    role: "Full Stack Developer",
    industry: "EdTech",
    teamSize: "4 Developers",
    overview: "Developed a complete learning management system supporting video courses, live classes, quizzes, progress tracking, and certificate generation. The platform supports multiple instructors, course bundling, and integration with payment gateways for course sales.",
    challenge: "Video streaming needed to work smoothly across varying bandwidths common in India. Content protection was critical to prevent unauthorized sharing. Live class feature required support for 500+ concurrent participants. Certificate verification needed to be tamper-proof.",
    solution: "Implemented HLS video streaming with adaptive bitrate. Used DRM for premium content protection. Built live class feature using WebRTC with SFU architecture. Implemented blockchain-verified certificates. Created instructor dashboard for content management.",
    process: [
      { title: "Platform Architecture", content: "Designed microservices architecture with separate services for auth, content, streaming, and payments." },
      { title: "Video Pipeline", content: "Built video upload, transcoding (FFmpeg), and HLS streaming pipeline. Implemented CDN integration for global delivery." },
      { title: "Course Management", content: "Created instructor tools for course creation, quiz building, and student management." },
      { title: "Live Classes", content: "Implemented live streaming with Jitsi/WebRTC. Added chat, screen share, and recording capabilities." },
      { title: "Assessment & Certification", content: "Built quiz engine with multiple question types. Implemented certificate generation with blockchain verification." },
      { title: "Payment Integration", content: "Integrated Razorpay for course purchases. Built subscription management and refund handling." }
    ],
    results: [
      "50,000+ registered learners within first 6 months",
      "500+ courses created by 100+ instructors",
      "Average video completion rate of 72% (industry average: 40%)",
      "₹1.2Cr in course revenue in first year",
      "Live classes supporting 500+ concurrent participants reliably",
      "Certificate verification used by 200+ employers"
    ],
    technologies: ["React", "Node.js", "MongoDB", "AWS", "Redis", "FFmpeg", "WebRTC", "Razorpay"],
    toolsUsed: ["VS Code", "AWS Console", "FFmpeg", "Jitsi", "Postman", "MongoDB Atlas"],
    keyMetrics: [
      { value: "50K+", label: "Learners" },
      { value: "500+", label: "Courses" },
      { value: "72%", label: "Completion Rate" },
      { value: "₹1.2Cr", label: "Revenue" }
    ],
    lessons: ["Adaptive bitrate streaming is essential for Indian internet conditions", "Content protection (DRM) is critical for premium course monetization", "Instructor experience is as important as learner experience for platform success"]
  },
  // ==================== ENGINEERING PROJECTS ====================
  {
    id: 101,
    slug: "automotive-engine-block",
    title: "Coming Soon",
    subtitle: "Projects are updating coming soon new project stay tuned to watch",
    duration: "Coming Soon",
    client: "Coming Soon",
    role: "Coming Soon",
    industry: "Coming Soon",
    teamSize: "Coming Soon",
    overview: "Projects are updating coming soon new project stay tuned to watch. Please stay tuned for our upcoming engineering designs and technical case studies.",
    challenge: "This section will be updated soon with new project details.",
    solution: "New and innovative engineering solutions will be showcased here in the near future.",
    process: [
      { title: "Update in Progress", content: "We are currently preparing new technical content for this section." }
    ],
    results: [
      "New results and achievements will be posted soon."
    ],
    technologies: ["Engineering", "Design", "Innovation"],
    toolsUsed: ["CAD", "Analysis", "Simulation"],
    keyMetrics: [
      { value: "0", label: "Progress" }
    ],
    lessons: ["Stay tuned for more updates!"]
  },
  {
    id: 102,
    slug: "manufacturing-line-simulation",
    title: "Manufacturing Line Simulation",
    subtitle: "FlexSim optimization achieving 25% efficiency improvement",
    duration: "6 weeks",
    client: "Automotive Tier-1 Supplier - Sundram Fasteners",
    role: "Simulation Engineer",
    industry: "Automotive Components",
    teamSize: "3 Engineers",
    overview: "Developed a comprehensive discrete event simulation of an automotive component production line using FlexSim. The simulation identified bottlenecks, optimized buffer sizes, and validated proposed layout changes before implementation. This project was critical for expanding capacity to meet new OEM orders without significant capital investment.",
    challenge: "The existing production line was experiencing throughput issues with only 72% OEE. The client needed to increase production capacity by 20% without significant capital investment. Understanding the complex interactions between 12 workstations with varying cycle times was critical. The line produced 6 different part variants with different routings, adding complexity to the analysis. Machine breakdowns averaged 8% downtime, and changeover times between variants were consuming 12% of available time.",
    solution: "Built a detailed FlexSim simulation model capturing all workstations, material handling, operator assignments, and downtime patterns based on 3 months of historical data. Ran multiple scenarios to identify optimal buffer sizes and workstation sequencing. Validated results with actual production data achieving 97% accuracy. Recommended specific changes that could be implemented during a planned 2-week shutdown.",
    process: [
      { title: "Data Collection", content: "Gathered cycle times from 2,400 time studies, downtime data from MES system, shift patterns, and material flow information from the production floor. Analyzed 6 months of historical data to establish statistical distributions." },
      { title: "Model Building", content: "Created accurate 3D simulation model in FlexSim with all 12 workstations, 8 conveyors, 3 AGVs, and 15 operators. Programmed variant-specific routings and changeover logic." },
      { title: "Validation", content: "Validated model output against actual production data achieving 97% accuracy on throughput and 95% accuracy on WIP levels. Obtained sign-off from production manager." },
      { title: "Bottleneck Analysis", content: "Used FlexSim's statistical tools to identify primary and secondary bottlenecks. Created utilization heat maps and throughput sensitivity analysis." },
      { title: "Scenario Analysis", content: "Tested 23 scenarios including buffer changes, workstation resequencing, shift modifications, and maintenance scheduling optimization." },
      { title: "Recommendations", content: "Presented optimized configuration with implementation roadmap to senior management. Included ROI analysis and risk assessment for each recommendation." }
    ],
    results: [
      "Identified primary bottleneck at Station 7 (CNC machining) limiting throughput to 340 parts/shift",
      "Recommended buffer size changes reduced WIP inventory by 30% saving ₹15L in working capital",
      "Optimized configuration increased OEE from 72% to 89%",
      "25% throughput improvement achieved with minimal investment of ₹8L (vs. ₹1.2Cr for new equipment)",
      "Changeover time reduced 40% through sequencing optimization",
      "ROI achieved within 4 months of implementation"
    ],
    technologies: ["FlexSim 2023", "Discrete Event Simulation", "Statistical Analysis", "Lean Manufacturing", "Six Sigma"],
    toolsUsed: ["FlexSim Professional", "Minitab", "MS Excel Advanced Analytics", "Power BI"],
    keyMetrics: [
      { value: "25%", label: "Throughput Increase" },
      { value: "30%", label: "WIP Reduction" },
      { value: "89%", label: "Final OEE" },
      { value: "4mo", label: "ROI Period" }
    ],
    lessons: ["Accurate input data is crucial for reliable simulation results - garbage in, garbage out", "Involving operators in data collection improves model accuracy and acceptance", "Simple buffer optimization often delivers better ROI than new equipment"]
  },
  {
    id: 110,
    slug: "mini-conveyor-aluminum",
    title: "Mini Industrial Conveyor System (Aluminum Structure)",
    subtitle: "Compact aluminum-framed conveyor with variable speed motor drive",
    duration: "6 weeks",
    client: "Laboratory Automation & Prototyping Project",
    role: "Mechanical Design Engineer",
    industry: "Industrial Automation & Material Handling",
    teamSize: "2 Engineers",
    overview: "The Mini Industrial Conveyor System was designed as a compact material handling solution for laboratory automation setups, small production environments, and engineering prototype demonstrations. The system uses a fully aluminum structural frame, providing high strength while maintaining a lightweight design for easy integration with other automation equipment. The conveyor transports materials across a 510 mm belt length with a 60 mm belt width, operating at speeds up to 52 mm/s. The conveyor is powered by a variable speed motor capable of operating between 20 RPM and 600 RPM, allowing adjustable transport speed depending on application requirements. The 100 mm system height ensures compatibility with tabletop automation systems and modular manufacturing platforms.",
    challenge: "The key challenges during the design and development process included designing a compact conveyor system with stable belt tracking, maintaining structural rigidity while using lightweight aluminum materials, ensuring smooth material transport under varying load conditions up to 15 kg, and integrating a variable speed drive system for flexible conveyor operation. Another important factor was achieving proper belt alignment and tension control, which is critical for preventing belt slippage and maintaining consistent motion.",
    solution: "A motor-driven conveyor mechanism was developed with a precision roller system and adjustable belt tension mechanism. The aluminum frame structure provides a balance between durability and lightweight construction, improving portability and system stability. The motor drive system allows adjustable speed control between 20–600 RPM, enabling operators to modify the conveyor speed depending on the material handling process. The aluminum rollers and structural components reduce overall weight while maintaining the mechanical strength required for continuous operation.",
    process: [
      { title: "Requirement Analysis", content: "Defined key industrial parameters including conveyor length (510 mm), width (60 mm), load capacity (15 kg), motor speed range (20–600 RPM), and operating height (100 mm)." },
      { title: "CAD Design", content: "Developed detailed 3D CAD models of the conveyor frame, roller assemblies, and belt alignment system using SolidWorks." },
      { title: "Material Selection", content: "Selected aluminum alloy as the primary structural material due to its strength-to-weight ratio, corrosion resistance, and ease of fabrication." },
      { title: "Drive System Integration", content: "Integrated a variable-speed motor capable of delivering 20–600 RPM to control conveyor belt speed with smooth acceleration." },
      { title: "Fabrication & Assembly", content: "Manufactured aluminum structural components and assembled the conveyor frame, rollers, motor drive, and belt system." },
      { title: "Performance Testing", content: "Tested the conveyor system under multiple load conditions to verify belt stability, motor performance, and transport efficiency." }
    ],
    results: [
      "Successfully designed a compact aluminum conveyor system within 510 × 60 × 100 mm envelope",
      "Achieved stable material transport speed of 52 mm/s",
      "System capable of handling loads up to approximately 15 kg",
      "Lightweight aluminum construction improves portability and durability",
      "Variable motor speed (20–600 RPM) allows flexible conveyor operation",
      "Belt tracking and tension system ensures consistent material transport"
    ],
    technologies: ["Mechanical Design", "Industrial Automation", "Conveyor Drive Systems", "CAD Modeling", "Fabrication & Assembly"],
    toolsUsed: ["SolidWorks", "AutoCAD", "Motor Speed Controller", "Aluminum Machining Tools"],
    keyMetrics: [
      { value: "510mm", label: "Conveyor Length" },
      { value: "52mm/s", label: "Belt Speed" },
      { value: "15kg", label: "Load Capacity" },
      { value: "600RPM", label: "Max Motor Speed" }
    ],
    lessons: ["Aluminum structures provide an excellent balance between strength and lightweight design", "Accurate belt tension adjustment is essential for stable conveyor operation", "Variable motor speed control significantly improves conveyor system flexibility"],
    conclusionVideoUrls: [
      "https://drive.google.com/file/d/1xyVySJJYCdwR7pT3ld6M1NrRxB1KxLdG/preview",
      "https://drive.google.com/file/d/1DYu3mUbH-bb8zQpqjJnyXnutJoPkQkZj/preview",
      "https://drive.google.com/file/d/1hm771YktGBoU73WJvE3zrPyaZrzeSaWN/preview"
    ]
  },
  {
    id: 111,
    slug: "effi-que-ev-car",
    title: "EFFI-QUE EV Car",
    subtitle: "Electric Vehicle Platform Development with Battery Thermal Optimization",
    duration: "16 weeks",
    client: "EV Research & Innovation Project",
    role: "Lead Product Design Engineer",
    industry: "Electric Vehicle Engineering",
    teamSize: "5 Engineers",
    overview: "This project involved the complete design and development of an electric vehicle platform intended for sustainable urban transportation. The design process included full 3D CAD modeling of the vehicle chassis, battery housing, motor mounting structure, and suspension interfaces using SolidWorks. Structural and thermal simulations were conducted to ensure safe operation under different load conditions. The goal was to create a lightweight EV architecture with optimized battery cooling and improved driving efficiency while keeping the manufacturing cost suitable for scalable production.",
    challenge: "The major challenge was achieving high driving range while maintaining lightweight vehicle structure and safe battery packaging. Thermal management of lithium battery modules was critical, especially under continuous high-load driving conditions. Additionally, packaging constraints required careful positioning of battery modules, motor assemblies, and control electronics without compromising safety or vehicle stability.",
    solution: "A parametric CAD architecture was developed in SolidWorks to allow rapid design iterations and weight optimization. Structural simulations were conducted to analyze chassis strength under acceleration, braking, and impact loads. Battery thermal analysis helped optimize airflow paths and cooling structures to maintain stable battery temperatures. The final design achieved improved energy efficiency and structural safety suitable for prototype development.",
    process: [
      { title: "Requirements Analysis", content: "Defined vehicle specifications including driving range targets, motor power output, chassis dimensions, battery capacity, and safety requirements." },
      { title: "Concept Development", content: "Developed multiple EV architecture concepts focusing on battery placement, structural frame layout, and drivetrain configuration." },
      { title: "Detailed CAD Design", content: "Created a full 3D assembly including chassis frame, motor mountings, battery housing, suspension brackets, and structural reinforcements." },
      { title: "Simulation & Validation", content: "Performed structural simulations and thermal analysis to validate chassis durability and battery cooling efficiency." },
      { title: "Design Optimization", content: "Optimized frame geometry and battery enclosure design to reduce weight while maintaining structural strength." },
      { title: "Documentation", content: "Prepared detailed manufacturing drawings and assembly documentation for prototype fabrication." }
    ],
    results: [
      "Achieved estimated 300-mile driving range per charge",
      "Reduced structural weight by 15% through optimized frame design",
      "Improved battery cooling efficiency through thermal optimization",
      "Prepared complete CAD package for prototype vehicle manufacturing"
    ],
    technologies: ["SolidWorks 2023", "FEA Structural Analysis", "Battery Thermal Analysis", "EV Powertrain Integration", "Technical Drawing"],
    toolsUsed: ["SolidWorks Premium", "ANSYS Workbench", "MATLAB", "AutoCAD"],
    keyMetrics: [
      { value: "15%", label: "Weight Reduction" },
      { value: "300mi", label: "Estimated Range" },
      { value: "85 kW", label: "Motor Output" },
      { value: "52", label: "Engineering Drawings" }
    ],
    lessons: ["Early integration of battery thermal analysis significantly improves EV performance", "Parametric CAD design enables faster design optimization cycles", "System-level design integration is critical for EV packaging efficiency"]
  },
  {
    id: 112,
    slug: "borbique-cooking-machine",
    title: "Industrial BORBIQUE Cooking Machine",
    subtitle: "High-capacity industrial cooking system with thermal optimization",
    duration: "8 weeks",
    client: "Industrial Food Processing Project",
    role: "Mechanical Design Engineer",
    industry: "Industrial Food Processing Equipment",
    teamSize: "3 Engineers",
    overview: "The Industrial BORBIQUE Cooking Machine project focused on developing a high-capacity cooking system for industrial kitchens and large-scale food production environments. The design involved 3D CAD modeling of the cooking chamber, heat distribution system, and structural frame using SolidWorks. Thermal analysis was conducted to ensure uniform heat distribution and improved energy efficiency.",
    challenge: "Industrial kitchens require machines capable of handling high cooking volumes while maintaining consistent heat distribution and operational safety. Heat loss, uneven cooking temperatures, and inefficient fuel usage were the main issues that needed to be addressed.",
    solution: "A thermally optimized cooking chamber was designed to ensure even heat distribution. Structural reinforcements were integrated into the frame design to support high-temperature operation. The heating system layout was optimized to minimize energy loss and improve cooking efficiency.",
    process: [
      { title: "Requirements Analysis", content: "Industrial cooking requirements analysis including capacity, temperature range, and safety standards." },
      { title: "Concept Development", content: "Concept development of heating chamber structures with multiple design iterations." },
      { title: "Detailed CAD Modeling", content: "Detailed CAD modeling of cooking unit and structural frame in SolidWorks." },
      { title: "Thermal Analysis", content: "Thermal analysis for heat distribution optimization across the cooking chamber." },
      { title: "Structural Validation", content: "Structural design validation for high-temperature operation safety." },
      { title: "Documentation", content: "Manufacturing drawing preparation with assembly instructions." }
    ],
    results: [
      "Improved cooking efficiency by 30%",
      "Reduced energy consumption through optimized heat flow",
      "Designed safe high-temperature cooking system",
      "Prepared manufacturing documentation for industrial production"
    ],
    technologies: ["SolidWorks 2023", "Thermal Analysis", "Industrial Equipment Design", "Manufacturing CAD"],
    toolsUsed: ["SolidWorks Premium", "ANSYS Workbench", "AutoCAD"],
    keyMetrics: [
      { value: "30%", label: "Energy Efficiency" },
      { value: "350°C", label: "Max Temperature" },
      { value: "20%", label: "Faster Cooking" },
      { value: "28", label: "Manufacturing Drawings" }
    ],
    lessons: ["Thermal optimization in cooking equipment directly impacts energy costs", "Structural reinforcement is critical for high-temperature industrial equipment", "Iterative design testing improves heat distribution uniformity"],
    conclusionVideoUrl: "/videos/borbique-demo.mov"
  },
  {
    id: 113,
    slug: "rocket-stove",
    title: "Efficient & Sustainable Rocket Stove",
    subtitle: "Fuel-efficient cooking solution for rural communities",
    duration: "4 weeks",
    client: "Sustainable Energy Research Project",
    role: "Mechanical Design Engineer",
    industry: "Sustainable Energy Technology",
    overview: "The Efficient Rocket Stove project aimed to develop a low-cost, fuel-efficient cooking solution for rural and off-grid communities. The stove was designed using SolidWorks to maximize combustion efficiency and heat transfer while minimizing fuel consumption.",
    challenge: "Traditional cooking stoves consume large quantities of biomass fuel and produce excessive smoke. The challenge was designing a stove that improves combustion efficiency while remaining simple to manufacture and operate.",
    solution: "A high-efficiency combustion chamber design was created with optimized airflow paths. Thermal modeling helped improve heat concentration and reduce heat loss during cooking.",
    process: [
      { title: "Research & Analysis", content: "Studied existing rocket stove designs and identified key areas for combustion and thermal efficiency improvement." },
      { title: "Combustion Chamber Design", content: "Designed optimized combustion chamber with improved airflow paths for complete fuel burning." },
      { title: "Thermal Modeling", content: "Performed thermal simulation to maximize heat transfer to cooking surface." },
      { title: "Prototype Design", content: "Created manufacturing-ready CAD models for low-cost production." }
    ],
    results: [
      "Reduced fuel consumption by 60%",
      "Improved cooking speed by 40%",
      "Lower smoke emissions for healthier cooking environment",
      "Cost-effective rural cooking solution"
    ],
    technologies: ["SolidWorks 2023", "Combustion Optimization", "Thermal Simulation"],
    toolsUsed: ["SolidWorks Premium", "ANSYS Workbench"],
    keyMetrics: [
      { value: "60%", label: "Fuel Reduction" },
      { value: "40%", label: "Faster Cooking" },
      { value: "Low", label: "Smoke Emission" },
      { value: "15", label: "Design Drawings" }
    ],
    lessons: ["Airflow optimization is the key factor in combustion efficiency", "Simple designs are more practical for rural manufacturing", "Thermal insulation significantly improves stove performance"]
  },
  {
    id: 114,
    slug: "self-navigating-robot",
    title: "Self-Navigating Robot for Safe and Smart Movement",
    subtitle: "Autonomous Mobile Robot for Industrial Automation",
    duration: "10 weeks",
    client: "Industrial Automation Research Project",
    role: "Robotics Design Engineer",
    industry: "Industrial Robotics & Automation",
    teamSize: "4 Engineers",
    overview: "The Self-Navigating Robot project focused on developing an autonomous mobile robot capable of navigating complex industrial environments without human assistance. The robot integrates multiple sensors, microcontrollers, and IoT communication modules to detect obstacles and determine efficient movement paths. The project included mechanical design, control system development, and sensor integration to enable real-time navigation and safety monitoring in warehouses and production facilities.",
    challenge: "The primary challenge was ensuring reliable obstacle detection and accurate navigation in dynamic environments such as warehouses where objects and people frequently move. The robot also required a stable motion control system capable of maintaining path accuracy while avoiding collisions.",
    solution: "The robot was equipped with ultrasonic sensors, proximity sensors, and onboard microcontrollers to analyze surrounding environments in real time. Navigation algorithms were implemented to enable path planning and collision avoidance. Mechanical design of the robot chassis ensured stability during movement and optimal sensor placement for maximum coverage.",
    process: [
      { title: "Requirement Analysis", content: "Requirement analysis for industrial navigation including obstacle detection range and response time." },
      { title: "Chassis Design", content: "Concept design of robot chassis and drive mechanism for stable movement." },
      { title: "Sensor Integration", content: "Sensor integration and embedded controller development for real-time environment scanning." },
      { title: "Algorithm Development", content: "Navigation algorithm testing and validation for autonomous path planning." },
      { title: "Prototype Assembly", content: "Prototype assembly and testing in simulated industrial environments." },
      { title: "Performance Optimization", content: "System performance optimization for improved navigation accuracy and speed." }
    ],
    results: [
      "Achieved 98% navigation accuracy in controlled environments",
      "Reduced need for manual material transportation",
      "Improved operational safety in industrial areas",
      "Successfully demonstrated autonomous navigation capability"
    ],
    technologies: ["IoT Communication", "Embedded Systems", "Sensor Integration", "Autonomous Navigation Algorithms"],
    toolsUsed: ["Arduino IDE", "MATLAB", "SolidWorks", "Embedded C"],
    keyMetrics: [
      { value: "98%", label: "Navigation Accuracy" },
      { value: "2 m/s", label: "Maximum Speed" },
      { value: "360°", label: "Obstacle Detection" },
      { value: "32", label: "Design Drawings" }
    ],
    lessons: ["Sensor placement significantly affects navigation accuracy", "Combining multiple sensors improves obstacle detection reliability", "Real-time data processing is critical for autonomous robotics systems"]
  },
  {
    id: 115,
    slug: "iot-smart-home-automation",
    title: "IoT Smart Home Automation",
    subtitle: "Centralized smart control system for residential environments",
    duration: "6 weeks",
    client: "Smart Home Technology Research Project",
    role: "IoT System Developer",
    industry: "Smart Home Technology",
    overview: "The IoT Smart Home Automation project involved developing a centralized smart control system for residential environments. The system enables users to remotely control lighting, appliances, and security systems through internet connectivity. The project included hardware design, embedded programming, and cloud communication integration.",
    challenge: "Ensuring reliable communication between multiple devices and maintaining system security were the primary challenges. The system also needed to be scalable to support additional smart devices.",
    solution: "An IoT architecture was developed using Wi-Fi enabled microcontrollers and sensor modules. The system allows remote device control through a mobile interface while monitoring power consumption and system status in real time.",
    process: [
      { title: "System Architecture", content: "Designed IoT communication architecture with Wi-Fi enabled microcontrollers." },
      { title: "Hardware Design", content: "Designed sensor modules and relay circuits for device control." },
      { title: "Embedded Programming", content: "Developed firmware for microcontrollers with cloud connectivity." },
      { title: "Mobile Interface", content: "Created mobile control interface for remote device management." },
      { title: "Integration Testing", content: "Tested multi-device communication and system reliability." }
    ],
    results: [
      "Enabled remote control of 15+ home appliances",
      "Reduced electricity consumption by 30% through automation",
      "Improved home security monitoring capabilities",
      "Scalable smart home architecture for future expansion"
    ],
    technologies: ["IoT Systems", "Wireless Communication", "Embedded Controllers", "Cloud Integration"],
    toolsUsed: ["Arduino IDE", "ESP32", "Firebase", "MIT App Inventor"],
    keyMetrics: [
      { value: "15+", label: "Connected Devices" },
      { value: "30%", label: "Energy Saving" },
      { value: "Remote", label: "Mobile Control" },
      { value: "18", label: "Circuit Designs" }
    ],
    lessons: ["Device communication reliability is critical for smart home systems", "Security must be built into IoT architecture from the start", "Scalable design enables easy addition of new devices"]
  },
  {
    id: 116,
    slug: "mini-electronic-fridge",
    title: "Mini Electronic Fridge",
    subtitle: "Compact refrigeration system with thermoelectric cooling",
    duration: "5 weeks",
    client: "Consumer Electronics Development Project",
    role: "Product Development Engineer",
    industry: "Consumer Electronics",
    overview: "The Mini Electronic Fridge project focused on developing a compact refrigeration system suitable for personal and portable use. The design emphasized energy efficiency, small form factor, and reliable cooling performance using thermoelectric cooling technology.",
    challenge: "The key challenge was achieving effective cooling performance within a compact design while minimizing power consumption for portable use.",
    solution: "An optimized cooling module was designed using thermoelectric cooling technology and improved insulation materials to maintain stable internal temperatures.",
    process: [
      { title: "Cooling System Design", content: "Selected and optimized thermoelectric cooling modules for compact application." },
      { title: "Enclosure Design", content: "Designed compact enclosure with thermal insulation for temperature retention." },
      { title: "Power Optimization", content: "Optimized power consumption for portable battery-powered operation." },
      { title: "Prototype Testing", content: "Tested cooling performance and energy efficiency across various conditions." }
    ],
    results: [
      "Reduced energy consumption by 40%",
      "Achieved 15°C temperature drop in compact 10L capacity",
      "Reliable cooling for small storage applications",
      "Ideal design for offices and travel use"
    ],
    technologies: ["Electronic Cooling Systems", "Thermal Design", "Compact Product Engineering"],
    toolsUsed: ["SolidWorks", "ANSYS Thermal", "Arduino"],
    keyMetrics: [
      { value: "40%", label: "Energy Reduction" },
      { value: "10L", label: "Cooling Capacity" },
      { value: "15°C", label: "Temperature Drop" },
      { value: "20", label: "Manufacturing Drawings" }
    ],
    lessons: ["Thermoelectric cooling is ideal for small-scale refrigeration", "Insulation design is critical for maintaining cooling efficiency", "Power management enables practical portable applications"]
  },
  {
    id: 117,
    slug: "3d-extruder-machine",
    title: "3D Extruder Machine",
    subtitle: "Precision extrusion system for additive manufacturing",
    duration: "7 weeks",
    client: "Additive Manufacturing Research Project",
    role: "Mechanical Design Engineer",
    industry: "Additive Manufacturing",
    overview: "The 3D Extruder Machine project involved designing a plastic extrusion system capable of producing precise 3D printed components. The machine includes a controlled heating chamber and precision feed system for consistent material flow.",
    challenge: "Maintaining stable extrusion temperature and filament flow across different plastic materials was a major engineering challenge requiring precise thermal control.",
    solution: "A temperature-controlled extrusion system with improved heating elements and filament feed mechanisms was developed to ensure smooth material flow and consistent output quality.",
    process: [
      { title: "Extrusion System Design", content: "Designed heating chamber and nozzle assembly for precise temperature control." },
      { title: "Feed Mechanism", content: "Developed precision filament feed system for consistent material flow." },
      { title: "Thermal Control", content: "Implemented temperature control system for stable extrusion across materials." },
      { title: "Testing & Validation", content: "Tested with multiple filament types for output quality and consistency." }
    ],
    results: [
      "Stable extrusion performance at 220°C operating temperature",
      "Support for multiple filament types including PLA, ABS, and PETG",
      "High-quality prototype production with 0.4mm nozzle precision",
      "Improved manufacturing flexibility for rapid prototyping"
    ],
    technologies: ["Additive Manufacturing", "Mechanical Design", "Thermal Control Systems"],
    toolsUsed: ["SolidWorks", "Arduino", "PID Controller"],
    keyMetrics: [
      { value: "220°C", label: "Extrusion Temp" },
      { value: "0.4mm", label: "Nozzle Precision" },
      { value: "Multi", label: "Filament Support" },
      { value: "25", label: "Design Drawings" }
    ],
    lessons: ["PID temperature control is essential for consistent extrusion quality", "Feed mechanism design directly impacts print quality", "Multi-material compatibility requires flexible thermal management"]
  },
  {
    id: 118,
    slug: "bottle-filling-machine",
    title: "Automatic Bottle Filling Machine",
    subtitle: "High-speed automated liquid filling system with PLC control",
    duration: "8 weeks",
    client: "Manufacturing Automation Project",
    role: "Automation Design Engineer",
    industry: "Manufacturing Automation",
    overview: "The Automatic Bottle Filling Machine project focused on designing a high-speed automated liquid filling system for industrial production lines. The system integrates sensors, conveyors, and automated filling mechanisms for consistent, accurate bottle filling.",
    challenge: "The key challenge was ensuring precise filling accuracy while maintaining high production speed and compatibility with different bottle sizes.",
    solution: "A programmable control system and adjustable filling mechanism were developed to allow flexible production settings and consistent accuracy across bottle variants.",
    process: [
      { title: "System Architecture", content: "Designed conveyor and filling station layout for high-speed operation." },
      { title: "Filling Mechanism", content: "Developed adjustable filling nozzles with flow control sensors." },
      { title: "PLC Programming", content: "Programmed PLC for automated filling sequences and bottle detection." },
      { title: "Sensor Integration", content: "Integrated level sensors and proximity sensors for accurate filling." },
      { title: "Testing & Calibration", content: "Tested filling accuracy and production speed across bottle sizes." }
    ],
    results: [
      "Achieved 120 bottles per minute filling rate",
      "Maintained ±2ml filling accuracy consistently",
      "Reduced manual labor by 30%",
      "Improved production efficiency and consistency"
    ],
    technologies: ["Industrial Automation", "PLC Systems", "Mechanical Design", "Sensor Integration"],
    toolsUsed: ["SolidWorks", "PLC Programming Software", "Embedded C"],
    keyMetrics: [
      { value: "120/min", label: "Filling Speed" },
      { value: "±2ml", label: "Filling Accuracy" },
      { value: "30%", label: "Labor Reduction" },
      { value: "34", label: "Design Drawings" }
    ],
    lessons: ["PLC-based control enables flexible production adjustments", "Sensor calibration is critical for filling accuracy", "Modular design allows adaptation to different bottle sizes"]
  },
  {
    id: 119,
    slug: "ev-rotavator-agriculture",
    title: "EV Agriculture Rotavator Car",
    subtitle: "Electric Rotavator Vehicle for Smart Agriculture — Automated soil tilling and farming assistance system",
    duration: "8 weeks",
    client: "Agricultural Innovation & Prototype Development Project",
    role: "Mechanical & Embedded Systems Developer",
    industry: "Agricultural Engineering & Automation",
    overview: "The EV Agriculture Rotavator Car project focused on developing a compact electric-powered agricultural machine designed to assist farmers in soil tilling operations. Traditional rotavators typically require fuel-powered engines or manual labor, which increases operational costs and environmental impact. This project aimed to create a battery-powered electric rotavator vehicle capable of performing soil cultivation tasks efficiently while reducing fuel consumption and labor effort.\n\nThe system integrates an electric drive motor, rotating soil tilling mechanism, and a lightweight chassis structure designed for small-scale agricultural environments such as vegetable farms and greenhouses.",
    challenge: "One of the main challenges was designing a compact yet powerful rotating blade mechanism capable of loosening soil effectively while being powered by a low-voltage electric system. Another challenge involved ensuring stable movement of the vehicle on uneven agricultural terrain while maintaining efficient energy consumption.\n\nThe project also required balancing mechanical durability with lightweight design, ensuring that the machine could operate for extended periods without excessive battery drain.",
    solution: "A battery-powered electric motor system was implemented to drive both the vehicle wheels and the rotavator blade mechanism. The chassis structure was designed using lightweight materials to improve mobility and reduce power consumption. The rotating blades were optimized to break and mix soil efficiently while minimizing resistance to the motor.\n\nControl circuitry and motor drivers were integrated to regulate speed and ensure safe operation of the rotavator system.",
    process: [
      { title: "Requirement Analysis", content: "Defined system requirements including soil tilling depth, vehicle speed, power consumption limits, and agricultural field operation conditions." },
      { title: "Concept Design", content: "Developed multiple mechanical layouts for the rotavator blade system and vehicle chassis structure." },
      { title: "Mechanical Development", content: "Designed the rotating blade assembly, wheel system, and vehicle frame to support agricultural operation." },
      { title: "Electrical Integration", content: "Integrated electric motors, battery system, and control electronics to power the vehicle and tilling mechanism." },
      { title: "Prototype Assembly", content: "Constructed the prototype rotavator vehicle and tested its performance on soil surfaces." },
      { title: "Performance Optimization", content: "Improved blade configuration and motor torque control to enhance soil tilling efficiency." }
    ],
    results: [
      "Successfully developed battery-powered rotavator vehicle prototype",
      "Reduced manual farming labor by approximately 50%",
      "Provided eco-friendly alternative to fuel-powered tilling machines",
      "Demonstrated efficient soil cultivation for small farming areas"
    ],
    technologies: ["Electric DC Motors", "Battery Power System", "Mechanical Rotating Blade Mechanism", "Embedded Control Electronics", "Agricultural Machine Design"],
    toolsUsed: ["SolidWorks", "AutoCAD", "Arduino IDE", "Mechanical Fabrication Tools"],
    keyMetrics: [
      { value: "50%", label: "Labor Reduction" },
      { value: "3–5 km/h", label: "Operating Speed" },
      { value: "12V", label: "Battery Powered" },
      { value: "24", label: "Design Drawings" }
    ],
    lessons: ["Electric-powered agricultural machines can significantly reduce fuel costs and environmental impact.", "Proper blade geometry is critical for effective soil tilling.", "Lightweight mechanical design improves energy efficiency and vehicle mobility."],
    conclusionVideoUrl: "/videos/ev-agriculture-rotavator-car.mp4"
  },
  {
    id: 121,
    slug: "maze-navigation-robot",
    title: "Autonomous Maze Navigation Robot",
    subtitle: "Smart navigation robot for maze environment testing",
    duration: "6 weeks",
    client: "Robotics Research & Development Project",
    role: "Embedded Systems & Robotics Developer",
    industry: "Robotics & Automation",
    teamSize: "2 Engineers",
    overview: "The Autonomous Maze Navigation Robot project focused on designing and developing a compact robotic vehicle capable of detecting obstacles and navigating through a structured maze environment autonomously. The robot uses an ultrasonic distance sensor mounted at the front to detect nearby objects and make movement decisions in real time. The robot was tested in a custom-built maze platform, where it navigates narrow paths and avoids collisions with walls and obstacles. The system integrates embedded programming, sensor feedback processing, and motor control to achieve smooth autonomous movement.",
    challenge: "The main challenge was enabling the robot to accurately detect obstacles and determine movement direction within confined spaces. The robot had to react quickly to sensor data to avoid collisions while maintaining stable navigation through narrow maze paths. Another challenge was integrating sensor readings with motor control logic so that the robot could dynamically decide whether to move forward, stop, or change direction.",
    solution: "An Arduino-based control system was implemented to continuously monitor the ultrasonic sensor readings. When an obstacle is detected within a defined distance threshold, the robot automatically adjusts its movement by stopping or turning. The robot chassis was designed with two rear drive wheels and a front caster wheel, providing stability and flexible turning capability inside the maze environment.",
    process: [
      { title: "Requirement Analysis", content: "Defined robot navigation goals including obstacle detection range, maze navigation capability, and response time." },
      { title: "Hardware Design", content: "Designed the robot chassis and integrated components including DC motors, ultrasonic sensor, motor driver module, and power supply." },
      { title: "Circuit Integration", content: "Connected the ultrasonic sensor, motor driver, and Arduino controller for real-time signal processing and movement control." },
      { title: "Software Development", content: "Developed Arduino firmware for obstacle detection, distance measurement, and motor direction control." },
      { title: "Testing Environment", content: "Constructed a maze testing platform with walls and obstacles to evaluate robot navigation performance." },
      { title: "Performance Optimization", content: "Fine-tuned sensor thresholds and turning logic to improve navigation efficiency and reduce collision risk." }
    ],
    results: [
      "Successfully demonstrated autonomous obstacle avoidance in maze environment",
      "Achieved reliable ultrasonic detection within 30 cm range",
      "Stable robot movement using two-wheel drive system",
      "Improved navigation performance through iterative algorithm tuning"
    ],
    technologies: ["Arduino Uno", "Ultrasonic Distance Sensor (HC-SR04)", "DC Motor Driver Module (L298N)", "Embedded C Programming", "Robotics Navigation Logic"],
    toolsUsed: ["Arduino IDE", "Embedded C Programming", "Circuit Design Tools", "Mechanical Prototyping"],
    keyMetrics: [
      { value: "95%", label: "Obstacle Detection" },
      { value: "30 cm", label: "Detection Range" },
      { value: "2 DC", label: "Motor Drive" },
      { value: "18", label: "Circuit Diagrams" }
    ],
    lessons: ["Sensor positioning plays a critical role in accurate obstacle detection", "Real-time processing of sensor data is essential for smooth robot navigation", "Iterative testing in controlled environments significantly improves robotics performance"],
    conclusionVideoUrl: "/videos/maze-robot-demo.mp4",
  },
  {
    id: 122,
    slug: "cobot-trainer-kit-atc",
    title: "Cobot Trainer Kit with ATC – Industrial Didactic Robotics Training System",
    subtitle: "Hands-on collaborative robot training platform with Automatic Tool Changer and multi-gripper system",
    duration: "Ongoing",
    client: "Janatics India Pvt Ltd",
    role: "Mechatronics Design Engineer",
    industry: "Industrial Robotics / Manufacturing Automation / Technical Education",
    teamSize: "Engineering Team",
    overview: "The Cobot Trainer Kit with ATC (Farinoo) is a didactic industrial robotics training platform designed to provide hands-on learning in collaborative robot programming, industrial automation, and robotic material handling systems. The system simulates real manufacturing environments where students and engineers can practice robot control, gripper selection, tool changing operations, and automated workpiece handling. The trainer kit integrates a collaborative robot arm, Automatic Tool Changer (ATC), multiple industrial grippers, pneumatic systems, and modular workpiece stations.",
    challenge: "Developing a comprehensive training platform that accurately simulates real industrial robotic workflows while remaining safe and accessible for educational environments. The system needed to support multiple gripper technologies (mechanical, pneumatic, vacuum), automatic tool changing, and diverse workpiece geometries — all within a compact, modular, and precision-engineered framework suitable for didactic use.",
    solution: "Designed and built a modular cobot trainer kit integrating a collaborative robot arm with an Automatic Tool Changer system, three industrial gripper types (DH Mechanical, Pneumatic, and Vacuum with Compact Ejector), pneumatic circuit systems, and multiple workpiece stations with varied geometries. The platform enables complete industrial robotics training workflows including gripper selection, robotic path programming, and precision material handling.",
    process: [
      { title: "System Architecture Design", content: "Designed the overall trainer kit architecture including collaborative robot arm mounting, ATC integration, gripper station layout, workpiece placement zones, and pneumatic circuit routing for a compact industrial training environment." },
      { title: "Multi-Workpiece Handling System", content: "Developed multiple industrial workpieces including triangle, ball, square block, rectangular block, bush components, and industrial profile materials — each requiring different gripping methods and robotic handling strategies." },
      { title: "Industrial Gripper Systems Integration", content: "Integrated three end-effector technologies: DH Mechanical Gripper for rigid components with precise force control, Pneumatic Gripper for high-speed pick-and-place operations, and Vacuum Gripper with Compact Ejector for lightweight flat surface handling." },
      { title: "Automatic Tool Changer (ATC) Implementation", content: "Implemented the ATC system enabling the robot to automatically switch between different grippers, demonstrating flexible manufacturing systems used in Industry 4.0 environments with multi-tool operation programming." },
      { title: "Pneumatic Circuit Design", content: "Designed and built industrial pneumatic circuits with properly insulated tubing, industrial air supply connections, compact ejector vacuum generation, and safe circuit layout for operating the pneumatic gripper and vacuum ejector." },
      { title: "Precision Mechanical Engineering", content: "Engineered the trainer kit structure with rigid aluminum frame, precision-machined workpiece stations, accurate gripper mounting interfaces, and stable robotic workspace alignment ensuring high positional accuracy during robot teaching." },
      { title: "Gripper Selection Training Module", content: "Developed training curriculum for gripper selection based on workpiece shape, material type, surface texture, weight, size, and handling precision requirements — simulating real industrial robotic engineering decision-making." }
    ],
    results: [
      "Complete industrial robotics training platform with collaborative robot programming",
      "Multi-gripper automation training with DH Mechanical, Pneumatic, and Vacuum systems",
      "Automatic Tool Changer enabling flexible multi-tool robotic operations",
      "Workpiece handling training based on material properties and geometry",
      "Pneumatic and vacuum system integration for industrial automation education",
      "Industrial-level mechanical precision design with aluminum frame structure",
      "Gripper selection decision-making training for real-world industrial applications"
    ],
    technologies: ["Collaborative Robot Arm", "Automatic Tool Changer (ATC)", "DH Mechanical Gripper", "Pneumatic Gripper", "Vacuum Gripper with Compact Ejector", "Pneumatic Valves & Circuits", "Precision Aluminum Frame", "Industrial Workpiece Stations"],
    toolsUsed: ["SolidWorks", "Pneumatic Circuit Design Tools", "Robot Programming Software", "Mechanical Fabrication Tools", "Industrial Assembly Equipment"],
    keyMetrics: [
      { value: "3", label: "Gripper Types" },
      { value: "6+", label: "Workpiece Types" },
      { value: "ATC", label: "Auto Tool Change" },
      { value: "Industry 4.0", label: "Standard" }
    ],
    lessons: [
      "Modular gripper systems enable flexible robotic operations across diverse manufacturing tasks",
      "Automatic Tool Changers are essential for modern flexible manufacturing systems",
      "Proper pneumatic circuit design is critical for reliable industrial automation",
      "Precision mechanical alignment directly impacts robot teaching accuracy and repeatability",
      "Gripper selection based on workpiece characteristics is a fundamental industrial robotics skill"
    ],
    conclusionVideoUrls: [
      "https://drive.google.com/file/d/1lTsPFAYp2PoOxxLcJk6DLxPuQNmxHFkg/preview",
      "https://drive.google.com/file/d/12QDwaOUijznHN1FKZ65F0UcxmkFb0TcV/preview",
      "https://drive.google.com/file/d/1hNPM0j3W6wjViHlUHUWoA_AOLxQhBv6B/preview"
    ]
  },
  {
    id: 124,
    slug: "modular-manufacturing-system",
    title: "Modular Manufacturing System (MMS) – 5 Station Didactic Setup",
    subtitle: "Industry 4.0 didactic automation training platform simulating real-world hybrid manufacturing environments",
    duration: "Ongoing",
    client: "Janatics India Pvt Ltd",
    role: "Mechatronics Design Engineer",
    industry: "Industrial Automation / Technical Education",
    teamSize: "Engineering Team",
    overview: "The Modular Manufacturing System (MMS) is a didactic industrial automation training platform designed to simulate real-world hybrid manufacturing environments. This system integrates mechanical, electrical, pneumatic, and control technologies to provide hands-on learning in modern automation and Industry 4.0 concepts. It replicates actual production workflows including feeding, inspection, buffering, processing, conveying, and sorting, enabling students and engineers to understand complete manufacturing cycles.\n\n⚠️ Disclaimer: This content (images/videos) is from projects developed during my tenure at Janatics. Shared for demonstration purposes only. All rights and intellectual property belong to Janatics. No unauthorized use or reproduction permitted.",
    challenge: "Designing a comprehensive training platform that accurately replicates multi-station manufacturing workflows while remaining modular, safe, and accessible for educational environments. Each station needed independent PLC and HMI control with seamless inter-station I/O communication, pneumatic systems integration, and MES connectivity — all within a compact footprint suitable for training labs.",
    solution: "Developed a 5-station modular manufacturing system with independent PLC-HMI control consoles per station, industrial pneumatic circuits, sensor arrays, and real-time inter-station communication. Each station simulates a specific manufacturing process (feeding, inspection, buffering, processing, sorting) with MES integration for Industry 4.0 smart factory training.",
    process: [
      { title: "Feeder Station Design", content: "Designed the feeder station with stack magazine, pneumatic separation cylinder, rotary pick & place module (180° transfer), suction cup handling system, and optical sensors for job detection. Components are separated using pneumatic actuators and transferred via rotary arm." },
      { title: "Inspection Station Integration", content: "Implemented quality inspection station with analog height sensor (~25mm detection), optical presence sensors, and sorting slide mechanism. Measures workpiece height, accepts correct parts to next station, and rejects faulty parts to rejection bin." },
      { title: "Buffer Station Development", content: "Built buffer station capable of storing up to 5 workpieces using retro-reflective sensors, light barrier sensors, and separator modules. Controls transfer flow, stops upstream process if buffer limit exceeded, and communicates with downstream stations." },
      { title: "Process Station with Vision", content: "Integrated process station with vision system for inspection, alignment, and smart processing. Features automated handling and operation execution for workpiece processing operations." },
      { title: "Sorting Station Implementation", content: "Designed final sorting station for workpiece classification based on size, shape, and quality. Uses sensor arrays and pneumatic actuators for precise routing of workpieces to correct output bins." },
      { title: "PLC & HMI Programming", content: "Programmed Omron PLC controllers and HMI touchscreen interfaces for each station with real-time I/O communication, emergency stop circuits, start/stop/reset controls, and manual/auto mode selection." },
      { title: "System Integration & MES", content: "Integrated all 5 stations with inter-station I/O networking, MES connectivity for smart production flow control, data-driven decision making, and real-time monitoring across the entire manufacturing line." }
    ],
    results: [
      "Complete 5-station modular manufacturing training platform operational",
      "Real-time inter-station I/O communication with PLC networking",
      "Independent HMI control consoles per station with Omron touchscreens",
      "Industry 4.0 MES integration for smart factory training",
      "Pneumatic, sensor, and actuator systems fully integrated across all stations",
      "Modular design enabling flexible station configuration and expansion",
      "Comprehensive training platform for PLC programming, pneumatics, and automation"
    ],
    technologies: ["Omron PLC", "HMI Touchscreen", "Pneumatic Actuators", "Optical Sensors", "Analog Sensors", "Magnetic Sensors", "Vision System", "MES Integration", "I/O Networking"],
    toolsUsed: ["SolidWorks", "Omron CX-Programmer", "HMI Design Software", "Pneumatic Circuit Design Tools", "Industrial Assembly Equipment"],
    keyMetrics: [
      { value: "5", label: "Stations" },
      { value: "5", label: "HMI Panels" },
      { value: "5", label: "PLC Units" },
      { value: "Industry 4.0", label: "Standard" }
    ],
    lessons: [
      "Modular station design enables flexible manufacturing training configurations",
      "Inter-station I/O communication is critical for synchronized production flow",
      "PLC and HMI integration provides intuitive operator control interfaces",
      "MES connectivity transforms standalone stations into a smart factory ecosystem",
      "Pneumatic system reliability depends on proper FRCLM unit maintenance"
    ]
  },
];

export const getArticleBySlug = (slug: string): ArticleContent | undefined => {
  return articleContents.find(article => article.slug === slug);
};
