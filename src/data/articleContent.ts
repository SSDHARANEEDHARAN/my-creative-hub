export interface ArticleSection {
  title: string;
  content: string;
}

export interface KeyMetric {
  value: string;
  label: string;
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
    title: "Automotive Engine Block Design",
    subtitle: "Complete 3D CAD design with thermal and structural analysis",
    duration: "8 weeks",
    client: "Automotive OEM - Mahindra & Mahindra",
    role: "Lead CAD Designer",
    industry: "Automotive Manufacturing",
    teamSize: "4 Engineers",
    overview: "This comprehensive project involved the complete 3D CAD design of a 4-cylinder inline engine block for a mid-size sedan application. The design process included extensive FEA thermal analysis to optimize cooling jacket geometry and stress simulation to ensure structural integrity under extreme operating conditions. Working closely with the powertrain team, we developed a next-generation engine block that reduced weight by 18% while improving thermal efficiency.",
    challenge: "The main challenge was designing an engine block that could withstand thermal stresses up to 150°C while maintaining precise cylinder bore geometry within 0.02mm tolerance. Additionally, weight reduction targets of 15% compared to the previous generation required innovative ribbing patterns and material optimization. The project also faced tight timeline constraints as the new platform launch was scheduled for Q4 2024. Integration with existing manufacturing processes was crucial, requiring careful consideration of casting and machining capabilities at the Pune plant.",
    solution: "Utilized SolidWorks for parametric 3D modeling with integrated simulation tools. Implemented topology optimization for weight reduction while maintaining structural requirements. Created comprehensive manufacturing drawings with GD&T specifications for casting and machining processes. Collaborated with the foundry team to optimize casting ribs and ensure proper molten metal flow during the die-casting process. Developed multiple design iterations using DOE (Design of Experiments) methodology to find the optimal configuration.",
    process: [
      { title: "Requirements Analysis", content: "Gathered performance specifications including 120kW power output, 240Nm torque, packaging constraints from the chassis team, and manufacturing requirements from the production engineering department. Documented 47 critical requirements in the PRD document." },
      { title: "Concept Development", content: "Created 5 concept designs exploring different cooling jacket configurations and structural ribbing patterns. Evaluated each concept against the requirements matrix using QFD methodology. Selected the most promising concept based on weighted scoring." },
      { title: "Detailed Design", content: "Developed the final 3D model with all 126 features including bolt bosses, oil galleries, water jackets, main bearing housings, and mounting interfaces. Created parametric relationships for easy design optimization." },
      { title: "FEA Validation", content: "Performed thermal FEA simulations under 15 different operating conditions. Conducted structural analysis for main bearing cap loads, cylinder pressure loads, and bolt pretension. Validated fatigue life prediction for 500,000 km target." },
      { title: "Design Review", content: "Conducted DFMEA with cross-functional team identifying 23 potential failure modes. Implemented design changes for 8 high-risk items. Achieved sign-off from quality and manufacturing teams." },
      { title: "Drawing Package", content: "Created 45 manufacturing drawings with GD&T specifications compliant with ASME Y14.5-2018 standard. Included casting drawings, machining drawings, and assembly drawings with torque specifications." }
    ],
    results: [
      "Achieved 18% weight reduction compared to previous design (from 28kg to 23kg)",
      "Thermal analysis confirmed maximum temperature of 142°C within safe limits with 8°C margin",
      "Stress analysis showed factor of safety >2.5 for all operating conditions",
      "Reduced number of machining operations by 15% through DFM optimization",
      "Design approved for prototype casting and testing - prototype delivered on schedule",
      "Zero design changes required during prototype validation phase"
    ],
    technologies: ["SolidWorks 2023", "ANSYS Mechanical", "Thermal Analysis", "GD&T", "Technical Drawing", "DFMEA"],
    toolsUsed: ["SolidWorks Premium", "ANSYS Workbench 2023", "Teamcenter PLM", "CATIA V5 (for legacy data)", "Minitab"],
    keyMetrics: [
      { value: "18%", label: "Weight Reduction" },
      { value: "142°C", label: "Max Temperature" },
      { value: "2.5+", label: "Safety Factor" },
      { value: "45", label: "Drawings Created" }
    ],
    lessons: ["Early integration of manufacturing constraints significantly reduces design iterations", "Parametric modeling enables rapid design optimization cycles", "Cross-functional DFMEA sessions catch issues early in design phase"]
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
    id: 103,
    slug: "gearbox-assembly",
    title: "Gearbox Assembly Design",
    subtitle: "6-speed manual transmission with complete motion analysis",
    duration: "12 weeks",
    client: "Transmission Manufacturer - Aisin India",
    role: "Design Engineer",
    industry: "Automotive Drivetrain",
    teamSize: "6 Engineers",
    overview: "Designed a complete 6-speed manual gearbox assembly using PTC Creo, including all gears, shafts, bearings, and housing components. The project included motion analysis to validate gear engagement and interference checking for assembly feasibility. This transmission was developed for a compact SUV platform requiring high torque capacity in a compact package.",
    challenge: "The gearbox needed to handle 400 Nm torque while fitting within a tight packaging envelope of 420mm x 280mm x 350mm. Synchronizer design required precise motion analysis to ensure smooth shifting feel under cold start conditions (-20°C). Assembly sequence had to accommodate automated production line constraints with robot handling limitations. NVH targets were aggressive, requiring gear micro-geometry optimization.",
    solution: "Used PTC Creo's advanced assembly capabilities with motion analysis module for gear engagement simulation. Implemented GD&T stack-up analysis for critical tolerances using VSA software. Created detailed assembly instructions with exploded views for manufacturing. Collaborated with gear specialists to optimize micro-geometry for NVH performance.",
    process: [
      { title: "Gear Design", content: "Designed all 18 gears with proper involute profiles optimized using KISSsoft. Specified face widths, pressure angles, and surface hardness (58-62 HRC). Applied crowning and lead modifications for optimal load distribution." },
      { title: "Shaft Design", content: "Created input, output, and countershaft designs with bearing journal specifications. Performed torsional vibration analysis and verified spline strength for 1.5x torque overload condition." },
      { title: "Synchronizer Design", content: "Designed synchronizer cones, sleeves, and detent mechanisms. Analyzed shift effort and synchronization time across temperature range." },
      { title: "Housing Design", content: "Designed split-line aluminum housing with mounting features, oil gallery routing, and breather provisions. Performed thermal analysis for oil temperature distribution." },
      { title: "Motion Analysis", content: "Simulated synchronizer engagement and verified interference-free operation throughout shift sequence. Analyzed gear clash conditions and validated shift feel parameters." },
      { title: "Documentation", content: "Created complete drawing package with 78 detail drawings and 12 assembly drawings. Included quality inspection criteria and assembly instructions with torque specifications." }
    ],
    results: [
      "Assembly passed all interference checks in motion analysis with 0.5mm minimum clearance",
      "Synchronizer engagement time optimized to 0.3 seconds (target: 0.4s)",
      "Weight target achieved at 42kg complete assembly (2kg under target)",
      "NVH performance exceeded targets by 3dB margin",
      "Design released for prototype manufacturing",
      "Zero design changes required during prototype testing"
    ],
    technologies: ["PTC Creo 9.0", "Motion Analysis", "GD&T", "Tolerance Stack-up", "Assembly Design", "KISSsoft"],
    toolsUsed: ["PTC Creo Parametric", "PTC Creo Mechanism", "VSA-3D", "KISSsoft", "Windchill PDM"],
    keyMetrics: [
      { value: "400Nm", label: "Torque Capacity" },
      { value: "42kg", label: "Assembly Weight" },
      { value: "0.3s", label: "Shift Time" },
      { value: "78", label: "Detail Drawings" }
    ],
    lessons: ["Motion analysis early in design prevents costly prototype failures", "Clear assembly documentation reduces manufacturing issues", "Cross-functional collaboration with gear specialists is essential for NVH optimization"]
  },
  {
    id: 104,
    slug: "plm-implementation",
    title: "PLM Implementation Project",
    subtitle: "Enterprise Windchill deployment for document and workflow management",
    duration: "16 weeks",
    client: "Manufacturing Enterprise - TVS Srichakra",
    role: "PLM Consultant",
    industry: "Tire Manufacturing",
    teamSize: "8 Members",
    overview: "Led the implementation of PTC Windchill PLM system for a mid-size manufacturing company. The project covered document control, engineering change management workflows, BOM management, and CAD data integration with PTC Creo. This digital transformation initiative was crucial for the company's quality management system upgrade and customer audit compliance.",
    challenge: "The client had engineering data scattered across 15 file servers with no version control - over 50,000 files with duplicate and obsolete versions. Engineering changes were tracked manually in Excel spreadsheets leading to errors and delays averaging 15 days per ECO. Integration with SAP ERP system was required for BOM synchronization. The company had failed a customer audit due to document control deficiencies.",
    solution: "Deployed Windchill PDMLink 12.0 with customized workflows for ECR/ECO process matching company procedures. Configured CAD workstation integration for seamless check-in/check-out with automatic revision control. Developed custom reports using Windchill Info*Engine for management visibility. Created comprehensive training program covering 5 user roles across 50+ users.",
    process: [
      { title: "Requirements Gathering", content: "Conducted 12 workshops with engineering, manufacturing, quality, and purchasing teams to document 156 functional requirements. Created process flow diagrams for all document types and change processes." },
      { title: "System Configuration", content: "Configured Windchill organization structure with 3 contexts, 8 lifecycles, 12 workflows, and role-based access controls for 50+ users across 6 departments." },
      { title: "Data Migration", content: "Migrated 50,000+ CAD files and documents with proper metadata mapping. Cleaned up duplicates, established folder structure, and assigned ownership for all legacy data." },
      { title: "Integration Setup", content: "Configured Creo integration for 25 designer workstations. Developed custom SAP integration for BOM synchronization using TIBCO middleware." },
      { title: "Customization", content: "Developed 8 custom reports, 3 dashboard widgets, and email notification templates for workflow events." },
      { title: "Training & Go-Live", content: "Delivered role-based training over 10 sessions. Supported 4-week hypercare period after go-live with dedicated helpdesk." }
    ],
    results: [
      "100% of engineering documents (50,000+) under version control",
      "ECO cycle time reduced from 15 days to 5 days (67% reduction)",
      "Eliminated 95% of BOM errors through automated sync with SAP",
      "Successfully passed customer audit 6 weeks after go-live",
      "50+ users trained and actively using system with 95% adoption rate",
      "Document search time reduced from 30 minutes to 2 minutes average"
    ],
    technologies: ["PTC Windchill 12.0", "PLM", "Workflow Design", "Data Migration", "SAP Integration", "Info*Engine"],
    toolsUsed: ["Windchill PDMLink", "PTC Creo", "SAP ECC", "TIBCO", "MS Project", "Jira"],
    keyMetrics: [
      { value: "50K+", label: "Documents Migrated" },
      { value: "67%", label: "ECO Time Reduction" },
      { value: "95%", label: "User Adoption" },
      { value: "5 days", label: "Avg ECO Cycle" }
    ],
    lessons: ["User adoption is critical - invest heavily in training and change management", "Start with core functionality before adding advanced features", "Executive sponsorship is essential for enterprise system implementation"]
  },
  {
    id: 105,
    slug: "robot-cell-design",
    title: "Industrial Robot Cell Design",
    subtitle: "Robotic welding cell with path simulation and safety planning",
    duration: "10 weeks",
    client: "Automotive Body Shop - Hyundai MOBIS",
    role: "Automation Engineer",
    industry: "Automotive Assembly",
    teamSize: "5 Engineers",
    overview: "Designed a complete robotic welding cell using Siemens NX including robot selection, fixture design, weld gun specification, and safety system layout. The project included robot path programming and cycle time validation through offline simulation. This cell was part of a new model launch requiring 47 JPH (jobs per hour) production rate.",
    challenge: "The cell needed to perform 45 spot welds on an automotive body-in-white panel within 55-second cycle time. Limited floor space of 6m x 4m required compact layout while maintaining operator access for part loading. Safety systems had to comply with ISO 10218 and RIA standards. Integration with existing PLC architecture using Siemens S7-1500 was required.",
    solution: "Used Siemens NX for 3D cell layout with integrated Robcad simulation module. Optimized robot paths for minimum cycle time while avoiding collisions with 50mm safety margin. Designed custom weld fixtures with quick-change capability for model variants. Specified safety scanners and light curtains for compliant human-robot collaboration zones.",
    process: [
      { title: "Cell Layout", content: "Created 8 layout concepts exploring different robot positions and fixture orientations. Evaluated each for reach, cycle time, and operator ergonomics. Selected optimal configuration achieving 52s cycle time." },
      { title: "Robot Selection", content: "Evaluated 5 robot models from ABB, FANUC, and KUKA based on reach envelope, payload capacity (weld gun weight: 85kg), and weld gun compatibility. Selected FANUC R-2000iC/165F." },
      { title: "Fixture Design", content: "Designed pneumatic fixtures with 12 locating pins and 8 clamps. Included sensors for part presence detection and clamp confirmation." },
      { title: "Path Programming", content: "Developed robot programs for all 45 weld points with optimized travel paths. Programmed 3 weld schedules for different material stackups." },
      { title: "Simulation", content: "Validated cycle time of 52 seconds through Robcad simulation. Verified collision-free operation with dynamic interference checking." },
      { title: "Safety Planning", content: "Designed safety system layout with 2 SICK microScan3 scanners, light curtains, and safety PLC integration. Conducted risk assessment per ISO 12100." }
    ],
    results: [
      "Achieved 52-second cycle time, 5% better than 55s target",
      "Compact cell layout within 6m x 4m footprint as required",
      "Zero collision paths verified through 100 hours of simulation testing",
      "Safety system design approved by TÜV third-party auditor",
      "Cell commissioned on schedule for new model launch",
      "Production achieved 98% uptime in first month"
    ],
    technologies: ["Siemens NX 2206", "Robcad", "Robot Simulation", "Path Planning", "Safety Systems", "FANUC Welding"],
    toolsUsed: ["NX Mechatronics Concept Designer", "Robcad", "FANUC Roboguide", "SICK Safety Designer", "TIA Portal"],
    keyMetrics: [
      { value: "52s", label: "Cycle Time" },
      { value: "45", label: "Weld Points" },
      { value: "24m²", label: "Cell Footprint" },
      { value: "98%", label: "Uptime Achieved" }
    ],
    lessons: ["Simulation-first approach prevents costly field modifications estimated at $50K savings", "Early safety planning avoids compliance issues and project delays", "Fixture design should be developed in parallel with robot programming"]
  },
  {
    id: 106,
    slug: "injection-mold-design",
    title: "Injection Mold Tool Design",
    subtitle: "Automotive interior component mold with optimized cooling",
    duration: "8 weeks",
    client: "Plastics Molder - Motherson Sumi Systems",
    role: "Mold Designer",
    industry: "Automotive Plastics",
    teamSize: "3 Engineers",
    overview: "Designed a two-cavity injection mold for an automotive interior trim component (instrument panel air vent bezel). The project included conformal cooling channel design, gate location optimization using flow analysis, and complete tool design with ejection system. The component had Class A visible surface requirements.",
    challenge: "The part had complex geometry with wall thicknesses varying from 1.8mm to 3.5mm leading to potential warpage issues up to 2mm. Cycle time target of 35 seconds required efficient cooling. Part visible surface had Class A requirements with no witness marks, sink marks, or flow lines allowed in the customer-visible area.",
    solution: "Used SolidWorks with Moldflow analysis for gate optimization and warpage prediction through 15 iterations. Designed conformal cooling channels using DMLS (Direct Metal Laser Sintering) inserts for hot spots. Specified appropriate steel grades (H13 for core, S136 for cavity) and surface finishes (SPI A-1) for Class A quality.",
    process: [
      { title: "Part Analysis", content: "Analyzed part geometry for moldability, draft angles (minimum 1.5°), and undercut features requiring 2 lifters. Identified 8 potential sink mark locations and 3 weld line concerns." },
      { title: "Flow Analysis", content: "Performed 15 Moldflow iterations to optimize gate location (2 valve gates selected) and predict fill pattern. Achieved balanced fill within 0.2 seconds between cavities." },
      { title: "Cooling Design", content: "Designed conformal cooling channels in cavity inserts achieving 15% faster cooling. Standard cooling for core side with baffles and bubblers." },
      { title: "Tool Design", content: "Created complete mold design including P20 core and cavity blocks, ejection system with 24 pins, 2 hydraulic lifters, and DME mold base." },
      { title: "Documentation", content: "Prepared 35 manufacturing drawings with machining tolerances and BOM for tool build. Included assembly sequence for mold shop." }
    ],
    results: [
      "Achieved 32-second cycle time, 9% better than 35s target",
      "Warpage reduced to 0.3mm within 0.5mm specification",
      "Class A surface quality approved by OEM customer on first submission",
      "Tool approved for production release with zero modifications",
      "First article inspection passed all 45 dimensional checks",
      "Tool life expected to exceed 500,000 shots"
    ],
    technologies: ["SolidWorks 2023", "Moldflow Insight", "Conformal Cooling", "Tool Design", "Plastics Engineering"],
    toolsUsed: ["SolidWorks Premium", "Autodesk Moldflow Insight", "CATIA V5 (OEM data)", "GOM Inspect"],
    keyMetrics: [
      { value: "32s", label: "Cycle Time" },
      { value: "0.3mm", label: "Max Warpage" },
      { value: "2-cavity", label: "Mold Config" },
      { value: "500K+", label: "Tool Life (shots)" }
    ],
    lessons: ["Conformal cooling significantly improves cycle time and quality - worth the extra cost for high-volume tools", "Flow analysis prevents costly mold modifications estimated at ₹25L savings", "Gate location is critical for Class A surface quality"]
  },
  {
    id: 107,
    slug: "warehouse-optimization",
    title: "Warehouse Layout Optimization",
    subtitle: "Distribution center simulation for 40% pick efficiency improvement",
    duration: "5 weeks",
    client: "E-commerce Fulfillment - Flipkart Logistics",
    role: "Simulation Consultant",
    industry: "E-commerce Logistics",
    teamSize: "4 Engineers",
    overview: "Developed FlexSim simulation of a 50,000 sq ft distribution center warehouse to optimize layout, slotting strategy, and pick path routing. The project analyzed current operations and proposed improvements for throughput increase to meet growing e-commerce demand during festive season peaks.",
    challenge: "The warehouse was experiencing increasing order volumes (15,000 orders/day peak) with declining pick productivity (120 picks/hour vs. 180 target). Travel time accounted for 65% of picker time. SKU velocity analysis showed suboptimal slotting with fast movers scattered throughout the facility. Peak season was 8 weeks away requiring fast implementation.",
    solution: "Built detailed FlexSim model of warehouse including all 12,000 rack locations, 6 pick zones, 4 pack stations, and conveyor system. Analyzed 90 days of order data (450,000 orders) to determine SKU velocity and order profiles. Simulated multiple layout configurations and slotting strategies to identify optimal design.",
    process: [
      { title: "Current State Mapping", content: "Documented existing layout with 3D scanning, pick paths, and operational procedures. Conducted time studies on 200 pick transactions." },
      { title: "Data Analysis", content: "Analyzed 90 days of order data, SKU velocity patterns, and order characteristics. Identified that 20% of SKUs represented 80% of picks." },
      { title: "Model Development", content: "Created FlexSim model with accurate rack locations, picker behavior algorithms, and order batching logic. Validated against 3 days of actual operations." },
      { title: "Slotting Optimization", content: "Developed velocity-based slotting strategy placing A-movers in golden zone. Created zone-based picking strategy for wave planning." },
      { title: "Layout Testing", content: "Tested 12 layout modifications and 8 slotting configurations through simulation." },
      { title: "Implementation Plan", content: "Developed phased implementation plan executable over 3 weekends with minimal disruption." }
    ],
    results: [
      "Pick productivity improved 40% from 120 to 168 picks per hour",
      "Travel time reduced from 65% to 45% of picker time",
      "Order throughput increased 35% with same headcount (25 pickers)",
      "ROI achieved within 4 months of implementation (₹45L annual savings)",
      "Peak season capacity increased to 22,000 orders/day",
      "Customer complaints reduced 25% due to faster order processing"
    ],
    technologies: ["FlexSim 2023", "Warehouse Simulation", "Slotting Optimization", "Data Analysis", "WMS Integration"],
    toolsUsed: ["FlexSim Professional", "Python (pandas, numpy)", "Power BI", "Excel Advanced Analytics", "WMS data exports"],
    keyMetrics: [
      { value: "40%", label: "Pick Rate Improvement" },
      { value: "35%", label: "Throughput Increase" },
      { value: "4mo", label: "ROI Period" },
      { value: "₹45L", label: "Annual Savings" }
    ],
    lessons: ["SKU velocity analysis is foundational for warehouse optimization - Pareto principle applies strongly", "Simulation enables risk-free testing of layout changes before physical rearrangement", "Picker input during validation improves model accuracy and solution acceptance"]
  },
  {
    id: 108,
    slug: "sheet-metal-enclosure",
    title: "Sheet Metal Enclosure Design",
    subtitle: "IP65 industrial enclosure with optimized manufacturing",
    duration: "4 weeks",
    client: "Industrial Equipment OEM - Siemens India",
    role: "Product Designer",
    industry: "Industrial Electronics",
    teamSize: "2 Engineers",
    overview: "Designed an IP65-rated sheet metal enclosure for industrial VFD (Variable Frequency Drive) control equipment. The design included proper bend allowance calculations, sealing features, and DFM optimization for laser cutting and press brake forming. The enclosure houses 15kW drive electronics with significant heat dissipation requirements.",
    challenge: "The enclosure needed IP65 protection while dissipating 450W of heat from internal electronics. Field serviceability required easy access to components without breaking IP sealing. Cost targets required design for single-setup fabrication on standard laser/brake equipment. EMC shielding was required to meet EN 61800-3 standards.",
    solution: "Used SolidWorks sheet metal tools with accurate K-factor calculations for 2mm 304 stainless steel. Designed modular panels with captive hardware (PEM studs) for easy assembly. Specified appropriate sealing gaskets and IP68 cable glands for IP65 rating. Integrated forced air cooling with filtered intake and exhaust.",
    process: [
      { title: "Requirements", content: "Documented dimensional constraints (600x400x200mm), IP65 rating per IEC 60529, thermal requirements (450W dissipation at 45°C ambient), EMC requirements, and access needs for 4 service points." },
      { title: "Concept Design", content: "Developed 3 enclosure concepts including welded construction, folded construction, and modular panel approach. Selected modular panel design for serviceability." },
      { title: "Detailed Design", content: "Created detailed sheet metal models with 28 bend features, 45 hardware cutouts, and sealing provisions. Optimized bend sequence for manufacturing." },
      { title: "Thermal Design", content: "Selected axial fans with 180 CFM capacity. Designed filtered intake louvers and exhaust provisions maintaining IP65 with IP68 filters." },
      { title: "DFM Review", content: "Reviewed design with 3 fabrication vendors. Incorporated feedback on bend radii, cutout spacing, and welding access." },
      { title: "Documentation", content: "Prepared flat patterns with bend sequence, assembly drawings with hardware BOM, and painting specifications for powder coating." }
    ],
    results: [
      "IP65 rating verified through third-party testing (TÜV SÜD) first attempt",
      "Fabrication cost 20% below target (₹4,200 vs ₹5,250 target) through DFM optimization",
      "Assembly time reduced 40% with snap-fit features and captive hardware",
      "Thermal testing confirmed electronics temperature 8°C below limit at 45°C ambient",
      "EMC testing passed EN 61800-3 Category C2 limits",
      "Design approved for production release - initial order 500 units"
    ],
    technologies: ["SolidWorks 2023", "Sheet Metal Design", "DFM", "IP Rating", "Thermal Management", "EMC Design"],
    toolsUsed: ["SolidWorks Premium", "FloEFD (thermal)", "DraftSight (flat patterns)", "KeyShot (renders)"],
    keyMetrics: [
      { value: "IP65", label: "Protection Rating" },
      { value: "450W", label: "Heat Dissipation" },
      { value: "20%", label: "Cost Under Target" },
      { value: "40%", label: "Assembly Time Reduction" }
    ],
    lessons: ["Early vendor engagement improves manufacturability and catches issues before tooling", "Modular design enables easier field service reducing total cost of ownership", "Thermal design must be considered from concept stage"]
  },
  {
    id: 109,
    slug: "conveyor-system",
    title: "Conveyor System Design",
    subtitle: "Modular packaging line conveyor with integrated controls",
    duration: "7 weeks",
    client: "Consumer Goods Manufacturer - Hindustan Unilever",
    role: "Mechanical Designer",
    industry: "FMCG Packaging",
    teamSize: "4 Engineers",
    overview: "Designed a modular conveyor system for a packaging line application handling personal care products. The project included structural analysis, motor sizing calculations, and integration documentation for controls and safety systems. The system spans 45 meters with 6 zones and handles 200 cartons per minute.",
    challenge: "The conveyor system needed to handle product sizes ranging from 100mm to 500mm with quick changeover capability under 10 minutes. Variable speed requirements from 10 to 40 m/min demanded proper motor sizing with VFD control. Integration with existing MES system required precise zone tracking. The system had to meet hygiene standards for personal care products (stainless steel contact surfaces).",
    solution: "Designed modular conveyor sections in Siemens NX for flexible configuration with 3 standard lengths. Performed motor and gearbox sizing calculations for all operating conditions including acceleration and product accumulation. Created detailed integration specifications for controls and safety interlocks compatible with existing Allen-Bradley PLC architecture.",
    process: [
      { title: "Layout Planning", content: "Developed conveyor routing to integrate with 4 packaging machines and 2 palletizers. Created 3D layout model showing all interfaces and clearances." },
      { title: "Component Selection", content: "Selected modular belt type (Intralox S1600), drives (SEW-Eurodrive), and 304SS support structure for hygiene requirements." },
      { title: "Structural Analysis", content: "Verified frame structure for product loading (max 50kg/m), conveyor tension, and seismic Zone III requirements using NX Nastran." },
      { title: "Motor Sizing", content: "Calculated motor power (6 motors ranging 0.75kW to 2.2kW) and gearbox ratios for speed range. Included accumulation load calculations." },
      { title: "Controls Design", content: "Developed electrical schematics, I/O list, and controls integration specifications for Allen-Bradley CompactLogix PLC." },
      { title: "Integration Docs", content: "Created wiring diagrams, communication protocol specifications, and commissioning procedures." }
    ],
    results: [
      "Modular design reduced installation time by 50% (3 days vs. 6 days estimated)",
      "Quick changeover achieved in 8 minutes (target: 10 minutes)",
      "Energy consumption 15% lower than specification through proper motor sizing",
      "System commissioned on schedule with zero punch list items",
      "Achieved 99.5% uptime in first 3 months of operation",
      "Hygiene audit passed with zero observations"
    ],
    technologies: ["Siemens NX 2206", "Mechanical Design", "Motor Sizing", "Conveyor Systems", "Controls Integration"],
    toolsUsed: ["Siemens NX", "NX Nastran", "AutoCAD Electrical", "SEW Workbench", "Intralox Layout Tool"],
    keyMetrics: [
      { value: "200", label: "Cartons/Minute" },
      { value: "45m", label: "Total Length" },
      { value: "50%", label: "Faster Install" },
      { value: "99.5%", label: "Uptime" }
    ],
    lessons: ["Modular design enables faster installation and maintenance reducing project risk", "Proper motor sizing prevents reliability issues and energy waste", "Early controls integration planning prevents commissioning delays"]
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
    conclusionVideoUrl: "/videos/conveyor-alu-demo.mp4"
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
    lessons: ["Electric-powered agricultural machines can significantly reduce fuel costs and environmental impact.", "Proper blade geometry is critical for effective soil tilling.", "Lightweight mechanical design improves energy efficiency and vehicle mobility."]
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
    ]
  },
];

export const getArticleBySlug = (slug: string): ArticleContent | undefined => {
  return articleContents.find(article => article.slug === slug);
};
