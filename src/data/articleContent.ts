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
}

export const articleContents: ArticleContent[] = [
  // ==================== IT PROJECTS ====================
  {
    id: 1,
    slug: "ecommerce-platform",
    title: "E-Commerce Web Platform",
    subtitle: "Full-stack e-commerce solution with modern technologies",
    duration: "12 weeks",
    client: "Retail Startup - ShopEase India",
    role: "Full Stack Developer",
    industry: "E-commerce Retail",
    teamSize: "4 Developers",
    overview: "Developed a comprehensive e-commerce platform from scratch using React for the frontend and Node.js with Express for the backend. The platform includes a complete product catalog, shopping cart functionality, secure payment integration with Stripe and Razorpay, user authentication, order tracking, and an admin dashboard for inventory management.",
    challenge: "The client needed a scalable e-commerce solution that could handle 10,000+ concurrent users during flash sales. The system required integration with multiple payment gateways for Indian and international customers. Real-time inventory updates were critical to prevent overselling, and the admin dashboard needed to support multiple vendor management.",
    solution: "Built a microservices architecture with React frontend, Node.js/Express backend, and MongoDB for flexible product schema. Implemented Redis for session management and cart caching. Used Socket.io for real-time inventory updates. Integrated Stripe and Razorpay payment gateways with webhook handling for payment confirmations.",
    process: [
      { title: "Requirements & Planning", content: "Conducted 5 stakeholder workshops to document 78 user stories. Created wireframes for 25 screens and finalized tech stack selection based on scalability requirements." },
      { title: "Database Design", content: "Designed MongoDB schema for products, users, orders, and vendors. Implemented indexing strategy for fast product search and filtering." },
      { title: "Frontend Development", content: "Built responsive React components with Redux state management. Implemented lazy loading, code splitting, and PWA features for mobile users." },
      { title: "Backend API Development", content: "Developed RESTful APIs with Express.js. Implemented JWT authentication, rate limiting, and comprehensive error handling." },
      { title: "Payment Integration", content: "Integrated Stripe and Razorpay with webhook handlers for payment confirmation. Implemented retry logic for failed transactions." },
      { title: "Testing & Deployment", content: "Wrote 250+ unit tests and integration tests. Set up CI/CD pipeline with GitHub Actions and deployed to AWS with auto-scaling." }
    ],
    results: [
      "Successfully launched platform handling 15,000+ concurrent users during first flash sale",
      "99.9% uptime achieved in first 6 months of operation",
      "Average page load time of 1.2 seconds with Lighthouse score of 95+",
      "₹2.5 Cr in transactions processed in first quarter",
      "50% reduction in cart abandonment through optimized checkout flow",
      "4.8/5 customer satisfaction rating"
    ],
    technologies: ["React", "Node.js", "Express", "MongoDB", "Redux", "Stripe", "Razorpay", "Redis", "Socket.io", "AWS"],
    toolsUsed: ["VS Code", "Postman", "MongoDB Compass", "AWS Console", "GitHub Actions", "Figma"],
    keyMetrics: [
      { value: "15K+", label: "Concurrent Users" },
      { value: "99.9%", label: "Uptime" },
      { value: "1.2s", label: "Page Load" },
      { value: "₹2.5Cr", label: "Q1 Transactions" }
    ],
    lessons: ["Microservices architecture enables independent scaling of critical components", "Real-time inventory sync prevents customer frustration during high-traffic events", "Payment webhook handling must be idempotent to prevent duplicate charges"]
  },
  {
    id: 2,
    slug: "iot-smart-home",
    title: "IoT Smart Home System",
    subtitle: "Complete home automation with mobile app control",
    duration: "10 weeks",
    client: "Smart Living Solutions - Bangalore",
    role: "IoT Developer",
    industry: "Home Automation",
    teamSize: "3 Engineers",
    overview: "Designed and developed a comprehensive IoT-based smart home system using Arduino and Raspberry Pi as the core controllers. The system enables automated control of lighting, temperature, security cameras, and door locks through a custom React Native mobile application. Implemented MQTT protocol for reliable device communication.",
    challenge: "The system needed to work reliably in Indian conditions with frequent power outages and variable internet connectivity. Security was paramount as the system controlled door locks and security cameras. The mobile app needed to work both locally (when on home WiFi) and remotely (when away from home).",
    solution: "Used Raspberry Pi as the central hub with local data storage for offline operation. Implemented MQTT with QoS level 1 for reliable message delivery. Added battery backup for critical components. Created dual-mode app that switches between local and cloud communication automatically.",
    process: [
      { title: "Hardware Selection", content: "Selected Arduino Nano for sensor nodes due to low power consumption. Used Raspberry Pi 4 as central hub. Evaluated and selected compatible sensors for temperature, motion, and door status." },
      { title: "Communication Protocol", content: "Implemented MQTT broker on Raspberry Pi using Mosquitto. Designed topic hierarchy for efficient message routing across 15+ device types." },
      { title: "Sensor Node Development", content: "Developed firmware for 8 types of sensor nodes using Arduino IDE. Implemented power-saving sleep modes for battery-operated sensors." },
      { title: "Mobile App Development", content: "Built React Native app with real-time device status, scheduling capabilities, and push notifications for alerts." },
      { title: "Security Implementation", content: "Implemented TLS encryption for all communications. Added two-factor authentication for app access and biometric unlock option." },
      { title: "Testing & Installation", content: "Conducted 100+ hours of reliability testing. Installed system in pilot home and refined based on user feedback." }
    ],
    results: [
      "30% reduction in electricity bills through automated lighting and HVAC control",
      "System maintained 99.5% uptime even during internet outages (local mode)",
      "Response time under 200ms for all device commands",
      "Successfully integrated 25+ devices in pilot installation",
      "Zero security breaches in 12 months of operation",
      "Mobile app rated 4.7/5 on internal user testing"
    ],
    technologies: ["Python", "Arduino", "Raspberry Pi", "MQTT", "React Native", "Node.js", "SQLite", "Firebase"],
    toolsUsed: ["Arduino IDE", "VS Code", "MQTT Explorer", "Fritzing", "Android Studio", "Xcode"],
    keyMetrics: [
      { value: "30%", label: "Energy Savings" },
      { value: "200ms", label: "Response Time" },
      { value: "25+", label: "Devices Integrated" },
      { value: "99.5%", label: "Uptime" }
    ],
    lessons: ["Local-first architecture is essential for IoT reliability in Indian conditions", "Battery backup for critical components prevents security vulnerabilities during outages", "MQTT QoS levels must be carefully chosen based on message importance"]
  },
  {
    id: 3,
    slug: "inventory-management",
    title: "Inventory Management App",
    subtitle: "Cross-platform mobile solution for stock management",
    duration: "8 weeks",
    client: "Wholesale Distributor - Chennai Traders",
    role: "Mobile Developer",
    industry: "Wholesale Distribution",
    teamSize: "2 Developers",
    overview: "Developed a cross-platform mobile application for inventory management with barcode scanning, real-time stock synchronization across multiple warehouses, and automated reorder alerts. The app works offline and syncs data when connectivity is restored.",
    challenge: "The client operated 5 warehouses with frequent stock movements. Staff had varying technical skills and needed a simple interface. Connectivity was unreliable in some warehouse locations. Integration with existing Tally accounting software was required.",
    solution: "Built React Native app with offline-first architecture using WatermelonDB. Implemented barcode scanning using device camera. Created sync mechanism that handles conflicts and merges changes. Developed REST API with Python Flask for Tally integration.",
    process: [
      { title: "Workflow Analysis", content: "Spent 2 weeks observing warehouse operations. Documented 12 key workflows including receiving, picking, and cycle counting." },
      { title: "Database Design", content: "Designed schema supporting offline operation with conflict resolution. Implemented optimistic updates for responsive UX." },
      { title: "Barcode Integration", content: "Implemented camera-based barcode scanning with support for multiple formats (EAN-13, Code 128, QR codes)." },
      { title: "Sync Engine", content: "Built robust sync mechanism handling poor connectivity. Implemented queue-based sync with retry logic." },
      { title: "Tally Integration", content: "Developed Python middleware for bidirectional sync with Tally. Automated purchase order and stock adjustment entries." },
      { title: "Training & Rollout", content: "Created video tutorials in Tamil and Hindi. Conducted hands-on training for 35 warehouse staff." }
    ],
    results: [
      "Stock accuracy improved from 82% to 98% within 3 months",
      "Cycle count time reduced by 60% through barcode scanning",
      "Real-time visibility across all 5 warehouses for management",
      "Stockout incidents reduced by 45% through automated reorder alerts",
      "₹15L annual savings from reduced overstocking",
      "35 users actively using app with 95% adoption rate"
    ],
    technologies: ["React Native", "Firebase", "Python", "Flask", "WatermelonDB", "REST API", "Barcode Scanning"],
    toolsUsed: ["Expo", "VS Code", "Firebase Console", "Postman", "Charles Proxy"],
    keyMetrics: [
      { value: "98%", label: "Stock Accuracy" },
      { value: "60%", label: "Time Savings" },
      { value: "45%", label: "Fewer Stockouts" },
      { value: "5", label: "Warehouses Connected" }
    ],
    lessons: ["Offline-first architecture is non-negotiable for warehouse apps", "Barcode scanning significantly improves accuracy and speed over manual entry", "User training in local languages dramatically improves adoption"]
  },
  {
    id: 4,
    slug: "analytics-dashboard",
    title: "Data Analytics Dashboard",
    subtitle: "Real-time business intelligence with interactive visualizations",
    duration: "10 weeks",
    client: "Manufacturing Company - Coimbatore Industries",
    role: "Data Engineer",
    industry: "Manufacturing Analytics",
    teamSize: "3 Engineers",
    overview: "Developed a comprehensive analytics dashboard providing real-time insights into production, quality, and equipment performance. The system aggregates data from multiple sources including PLCs, quality management systems, and ERP, presenting actionable insights through interactive visualizations.",
    challenge: "Data was scattered across 8 different systems with no unified view. Real-time production data needed to be captured from shop floor PLCs. The client needed both high-level KPI views and drill-down capabilities. Historical data spanning 5 years needed to be migrated and analyzed.",
    solution: "Built data pipeline using Python with Pandas for ETL processing. Implemented PostgreSQL data warehouse with optimized schema for analytics queries. Created React frontend with D3.js for custom visualizations. Set up automated reporting with email scheduling.",
    process: [
      { title: "Data Source Mapping", content: "Documented data sources, formats, and refresh frequencies for 8 systems. Identified data quality issues and created cleansing rules." },
      { title: "ETL Development", content: "Built Python ETL pipelines using Pandas and Apache Airflow for orchestration. Processed 10GB+ of historical data." },
      { title: "Data Warehouse Design", content: "Designed star schema with 12 fact tables and 25 dimension tables. Optimized indexes for common query patterns." },
      { title: "Visualization Development", content: "Created 15 dashboard views with React and D3.js. Implemented responsive design for both desktop and tablet use." },
      { title: "Alerting System", content: "Built real-time alerting for KPI threshold breaches. Integrated with SMS and email for critical alerts." },
      { title: "User Training", content: "Conducted training for 20 managers on dashboard usage and data interpretation." }
    ],
    results: [
      "Unified view of operations saving 10+ hours weekly in manual report compilation",
      "Real-time OEE monitoring improved equipment efficiency by 8%",
      "Quality defect early detection reduced scrap rate by 12%",
      "Management decisions now backed by data with drill-down capability",
      "Automated daily/weekly reports sent to 50+ stakeholders",
      "Dashboard load time under 3 seconds for any query"
    ],
    technologies: ["Python", "React", "PostgreSQL", "D3.js", "Pandas", "Apache Airflow", "REST API"],
    toolsUsed: ["VS Code", "DBeaver", "Apache Airflow", "Grafana", "Jupyter Notebook"],
    keyMetrics: [
      { value: "8%", label: "OEE Improvement" },
      { value: "12%", label: "Scrap Reduction" },
      { value: "10+hrs", label: "Weekly Time Saved" },
      { value: "3s", label: "Dashboard Load Time" }
    ],
    lessons: ["Data quality at source is critical - garbage in, garbage out", "Interactive drill-down capability is more valuable than static reports", "Scheduled automated reports ensure consistent stakeholder communication"]
  },
  {
    id: 5,
    slug: "task-management",
    title: "Task Management System",
    subtitle: "Collaborative project management with real-time updates",
    duration: "8 weeks",
    client: "Software Development Agency - TechCraft Solutions",
    role: "Full Stack Developer",
    industry: "Software Services",
    teamSize: "2 Developers",
    overview: "Built a collaborative task management application with Kanban boards, real-time updates, time tracking, and team collaboration features. The system supports multiple projects with customizable workflows and integrates with popular tools like Slack and GitHub.",
    challenge: "The agency needed to track work across 15+ concurrent projects with 40 team members. Existing tools were either too complex or lacked customization. Real-time updates were essential for distributed teams. Integration with existing development workflow (GitHub, Slack) was required.",
    solution: "Developed React application with Socket.io for real-time collaboration. Implemented customizable Kanban boards with drag-and-drop. Built Node.js backend with MongoDB for flexible data structures. Created webhooks for GitHub and Slack integration.",
    process: [
      { title: "Requirements Gathering", content: "Interviewed 15 team members to understand pain points. Analyzed workflows of existing projects to design flexible board structure." },
      { title: "UI/UX Design", content: "Created wireframes and prototypes in Figma. Conducted usability testing with 5 users before development." },
      { title: "Real-time Architecture", content: "Implemented Socket.io for live updates. Designed event system for efficient data synchronization across clients." },
      { title: "Kanban Implementation", content: "Built drag-and-drop Kanban boards with react-beautiful-dnd. Implemented customizable columns and card templates." },
      { title: "Integrations", content: "Developed GitHub webhook handlers for automatic task updates. Built Slack bot for notifications and quick actions." },
      { title: "Time Tracking", content: "Implemented timer functionality with manual time entry. Created reports for project time analysis." }
    ],
    results: [
      "40 team members actively using system across 15+ projects",
      "25% improvement in project delivery timelines",
      "Real-time updates eliminated status meeting time by 2 hours/week",
      "GitHub integration reduced context switching for developers",
      "Time tracking data improved project estimation accuracy by 30%",
      "4.6/5 user satisfaction rating in internal survey"
    ],
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Redux", "GitHub API", "Slack API"],
    toolsUsed: ["VS Code", "Figma", "MongoDB Compass", "Postman", "GitHub"],
    keyMetrics: [
      { value: "25%", label: "Faster Delivery" },
      { value: "40", label: "Active Users" },
      { value: "30%", label: "Better Estimates" },
      { value: "2hrs/wk", label: "Meetings Saved" }
    ],
    lessons: ["Real-time updates transform team collaboration for distributed teams", "Integration with existing tools (GitHub, Slack) is essential for developer adoption", "Customizable workflows accommodate different project needs"]
  },
  {
    id: 6,
    slug: "weather-station",
    title: "Weather Monitoring Station",
    subtitle: "IoT weather monitoring with web dashboard",
    duration: "6 weeks",
    client: "Agricultural Cooperative - Thanjavur Farmers Association",
    role: "IoT Developer",
    industry: "Agriculture",
    teamSize: "2 Engineers",
    overview: "Designed and deployed IoT-based weather monitoring stations for agricultural applications. The system captures temperature, humidity, soil moisture, rainfall, and wind speed data, presenting insights through a web dashboard that helps farmers make irrigation and planting decisions.",
    challenge: "Weather stations needed to operate reliably in outdoor agricultural conditions with no power or internet infrastructure. Data accuracy was critical for irrigation decisions. Farmers needed simple, actionable insights rather than raw data. System needed to be affordable for cooperative deployment.",
    solution: "Built solar-powered weather stations with Arduino controllers and LoRa radio for long-range data transmission. Developed central gateway with Raspberry Pi connecting to cloud. Created Flask web dashboard with farmer-friendly visualizations and SMS alerts for critical conditions.",
    process: [
      { title: "Sensor Selection", content: "Evaluated 15 sensor types for accuracy, durability, and cost. Selected IP65-rated sensors suitable for outdoor agricultural use." },
      { title: "Power System Design", content: "Designed solar power system with 10W panel and LiFePO4 battery for 3 days autonomy. Implemented power management for extended operation." },
      { title: "Communication Architecture", content: "Implemented LoRa mesh network for 2km+ range. Designed gateway with 4G fallback for cloud connectivity." },
      { title: "Dashboard Development", content: "Built Flask application with Chart.js visualizations. Implemented farmer-friendly UI with Tamil language support." },
      { title: "Alert System", content: "Created SMS alert system for frost warnings, heavy rain predictions, and irrigation recommendations." },
      { title: "Deployment & Training", content: "Installed 8 stations across cooperative farms. Trained 25 farmers on dashboard and alert interpretation." }
    ],
    results: [
      "8 weather stations deployed across 500 hectares of farmland",
      "15% improvement in crop yield through optimized irrigation timing",
      "Early frost warning prevented ₹20L crop damage in first season",
      "SMS alerts reached 200+ farmers with relevant weather information",
      "98% data availability despite challenging outdoor conditions",
      "System operational cost of ₹500/month per station"
    ],
    technologies: ["Arduino", "Python", "Flask", "LoRa", "Chart.js", "SQLite", "Twilio SMS"],
    toolsUsed: ["Arduino IDE", "VS Code", "Fusion 360 (enclosure)", "KiCad (PCB)", "Grafana"],
    keyMetrics: [
      { value: "8", label: "Stations Deployed" },
      { value: "15%", label: "Yield Improvement" },
      { value: "₹20L", label: "Damage Prevented" },
      { value: "98%", label: "Data Availability" }
    ],
    lessons: ["Solar power with proper battery sizing enables remote IoT deployments", "LoRa mesh networking provides reliable long-range communication in rural areas", "Farmer-friendly interfaces in local languages dramatically improve adoption"]
  },
  {
    id: 7,
    slug: "restaurant-pos",
    title: "Restaurant POS System",
    subtitle: "Complete point of sale with kitchen display system",
    duration: "10 weeks",
    client: "Restaurant Chain - Spice Garden Group",
    role: "Full Stack Developer",
    industry: "Food & Beverage",
    teamSize: "3 Developers",
    overview: "Developed a comprehensive point of sale system for restaurants with order management, table tracking, kitchen display system (KDS), split billing, and detailed sales reporting. The system operates offline and syncs with cloud for multi-location management.",
    challenge: "Restaurant operations required fast, reliable ordering during peak hours. Kitchen coordination between multiple preparation areas was complex. System needed to work during internet outages (common in India). Multi-location reporting for management was essential.",
    solution: "Built Electron desktop application with React for cross-platform compatibility. Implemented local SQLite database for offline operation. Created separate KDS application with sound alerts for new orders. Developed cloud sync mechanism for multi-location aggregation.",
    process: [
      { title: "Workflow Analysis", content: "Spent 2 weeks observing restaurant operations during peak hours. Documented order flow from entry to payment." },
      { title: "UI/UX Design", content: "Designed touch-optimized interface for fast order entry. Created kitchen display with large fonts and color coding." },
      { title: "POS Application", content: "Built Electron app with React. Implemented table management, split billing, discounts, and multiple payment methods." },
      { title: "Kitchen Display", content: "Developed KDS showing orders by preparation area. Added sound alerts, order timing, and bump functionality." },
      { title: "Reporting System", content: "Created comprehensive reports including sales analysis, item performance, and staff productivity." },
      { title: "Deployment", content: "Installed across 5 restaurant locations. Provided on-site training for 40+ staff members." }
    ],
    results: [
      "Order entry time reduced by 40% compared to previous system",
      "Kitchen order accuracy improved to 99.5% with KDS",
      "Table turnover increased by 15% through faster billing",
      "₹0 revenue loss during internet outages (offline mode)",
      "Management visibility across 5 locations through cloud dashboard",
      "Staff training time reduced to 30 minutes for new employees"
    ],
    technologies: ["React", "Electron", "Node.js", "SQLite", "PostgreSQL", "Socket.io"],
    toolsUsed: ["VS Code", "Electron Forge", "DBeaver", "Figma", "TestFlight"],
    keyMetrics: [
      { value: "40%", label: "Faster Orders" },
      { value: "99.5%", label: "Order Accuracy" },
      { value: "15%", label: "Faster Turnover" },
      { value: "5", label: "Locations Live" }
    ],
    lessons: ["Touch-optimized UI is essential for fast-paced restaurant environments", "Offline capability is non-negotiable for business-critical POS systems", "Kitchen display systems dramatically improve order accuracy and speed"]
  },
  {
    id: 8,
    slug: "healthcare-app",
    title: "Healthcare Appointment App",
    subtitle: "Mobile app for medical appointments and telemedicine",
    duration: "12 weeks",
    client: "Multi-specialty Hospital - HealthFirst Chennai",
    role: "Mobile Developer",
    industry: "Healthcare",
    teamSize: "4 Developers",
    overview: "Developed a comprehensive healthcare mobile application enabling patients to book appointments, access medical records, receive appointment reminders, and conduct video consultations with doctors. The app integrates with the hospital's existing HIS (Hospital Information System).",
    challenge: "Integration with legacy HIS system using HL7 standards was complex. Patient data privacy and HIPAA-equivalent compliance was mandatory. App needed to work for patients with varying technical skills and accessibility needs. Video consultation quality had to be reliable across varying network conditions.",
    solution: "Built React Native app with accessibility features built-in. Developed Node.js middleware for HIS integration using HL7 FHIR. Implemented WebRTC-based video consultation with adaptive bitrate. Used Firebase for push notifications and analytics.",
    process: [
      { title: "Compliance Planning", content: "Documented data privacy requirements. Implemented encryption, access controls, and audit logging per healthcare regulations." },
      { title: "HIS Integration", content: "Developed integration layer translating HIS data to mobile-friendly format. Implemented real-time slot availability checking." },
      { title: "Patient Features", content: "Built appointment booking, medical records view, prescription tracking, and lab results display." },
      { title: "Telemedicine Module", content: "Implemented WebRTC video calling with TURN server fallback. Added waiting room, screen sharing, and prescription capability." },
      { title: "Accessibility", content: "Implemented VoiceOver/TalkBack support, high contrast mode, and adjustable font sizes for elderly patients." },
      { title: "Launch & Support", content: "Soft launch with 500 patients. Gathered feedback and iterated before full rollout." }
    ],
    results: [
      "15,000+ app downloads in first 3 months",
      "40% reduction in phone calls to appointment desk",
      "Patient satisfaction improved from 3.8 to 4.5/5 rating",
      "2,000+ video consultations conducted in first quarter",
      "85% reduction in appointment no-shows through reminders",
      "Average app rating of 4.4 on Play Store and App Store"
    ],
    technologies: ["React Native", "Firebase", "Node.js", "WebRTC", "HL7 FHIR", "Push Notifications"],
    toolsUsed: ["VS Code", "Expo", "Firebase Console", "Postman", "Jitsi (WebRTC)"],
    keyMetrics: [
      { value: "15K+", label: "Downloads" },
      { value: "40%", label: "Fewer Calls" },
      { value: "2K+", label: "Video Consults" },
      { value: "85%", label: "Fewer No-shows" }
    ],
    lessons: ["Healthcare app accessibility is essential for elderly patient demographics", "HIS integration requires careful planning and robust error handling", "Video consultation reliability depends heavily on proper TURN server configuration"]
  },
  {
    id: 9,
    slug: "smart-agriculture",
    title: "Smart Agriculture System",
    subtitle: "AI-powered precision farming with IoT sensors",
    duration: "14 weeks",
    client: "Agri-Tech Startup - FarmWise India",
    role: "IoT & ML Developer",
    industry: "Agriculture Technology",
    teamSize: "5 Engineers",
    overview: "Developed an integrated smart agriculture system combining IoT sensors for soil and weather monitoring with AI-powered crop health analysis using drone imagery. The system provides automated irrigation control, pest detection, and yield prediction for large-scale farming operations.",
    challenge: "Large farms (500+ acres) required scalable sensor networks. ML model needed to detect crop diseases from drone imagery with 90%+ accuracy. Automated irrigation decisions required integration with existing pump infrastructure. System needed to work with limited internet connectivity in rural areas.",
    solution: "Deployed LoRaWAN sensor network with solar-powered nodes. Trained CNN model on crop disease dataset with transfer learning from ResNet. Built edge computing gateway for local ML inference. Created React dashboard with GIS integration for field mapping.",
    process: [
      { title: "Sensor Network Design", content: "Designed LoRaWAN network topology for 500+ acre coverage. Selected sensors for soil moisture, temperature, NPK levels, and weather." },
      { title: "ML Model Development", content: "Collected and labeled 10,000+ crop images. Trained CNN model achieving 94% disease detection accuracy." },
      { title: "Edge Computing", content: "Deployed NVIDIA Jetson for edge inference of drone imagery. Implemented image stitching for field-wide analysis." },
      { title: "Irrigation Automation", content: "Integrated with VFD-controlled pumps. Developed rule engine combining sensor data and ET calculations." },
      { title: "Dashboard Development", content: "Built GIS-enabled dashboard showing field health maps, sensor data, and irrigation status. Implemented farmer-friendly mobile view." },
      { title: "Pilot Deployment", content: "Deployed on 200-acre pilot farm. Refined system based on agronomist feedback over one crop cycle." }
    ],
    results: [
      "Water usage reduced by 35% through precision irrigation",
      "Early pest detection prevented ₹45L crop loss in pilot farm",
      "Yield increased by 18% compared to conventional farming practices",
      "94% accuracy in crop disease detection from drone imagery",
      "Farmer decision time reduced from days to hours for interventions",
      "System scaled to 1,500 acres across 3 farms in first year"
    ],
    technologies: ["Python", "TensorFlow", "Raspberry Pi", "LoRaWAN", "React", "PostgreSQL", "QGIS"],
    toolsUsed: ["VS Code", "Jupyter Notebook", "QGIS", "DJI drone platform", "Grafana"],
    keyMetrics: [
      { value: "35%", label: "Water Savings" },
      { value: "18%", label: "Yield Increase" },
      { value: "94%", label: "Disease Detection" },
      { value: "1500ac", label: "Area Covered" }
    ],
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
    slug: "hydraulic-press",
    title: "Hydraulic Press Frame Design",
    subtitle: "500-ton press with FEA-optimized structure",
    duration: "10 weeks",
    client: "Stamping Equipment Supplier - Godrej & Boyce",
    role: "Structural Designer",
    industry: "Capital Equipment",
    teamSize: "3 Engineers",
    overview: "Designed a 500-ton hydraulic press frame with FEA stress analysis and deflection optimization. The project included weld joint design, bolted connection calculations, and complete fabrication specifications. This press is used for automotive body panel stamping requiring tight parallelism and deflection control.",
    challenge: "The press frame needed to limit bed deflection to 0.15mm under full 500-ton load while meeting weight targets of 9,000kg for shipping constraints. Weld joint design required careful analysis to avoid fatigue failures over 10-year service life (10 million cycles). Foundation loading required detailed force calculations for customer site preparation. Parallelism between slide and bed had to be maintained within 0.05mm.",
    solution: "Used SolidWorks with FEA simulation for iterative stress optimization over 12 design iterations. Designed frame with strategic ribbing patterns to maximize stiffness-to-weight ratio using topology optimization guidance. Specified proper weld details and inspection requirements for fatigue-critical joints per AWS D1.1.",
    process: [
      { title: "Load Analysis", content: "Documented loading conditions including 500-ton central load, 400-ton off-center loads at 4 positions, dynamic effects (1.3 factor), and thermal expansion." },
      { title: "Concept Design", content: "Developed 4 frame architectures exploring welded mono-block, tie-rod, and gap-frame construction. Selected welded mono-block for stiffness requirements." },
      { title: "FEA Optimization", content: "Performed 12 iterative FEA studies to optimize rib patterns, plate thicknesses (40-80mm range), and weld locations. Used topology optimization for weight reduction." },
      { title: "Weld Design", content: "Designed weld joints with appropriate sizing per AWS D1.1. Specified full penetration welds for critical joints with UT inspection requirements." },
      { title: "Fabrication Specs", content: "Created welding procedure specifications, stress relief requirements, and machining sequence for critical surfaces." },
      { title: "Documentation", content: "Created 22 fabrication drawings with weld callouts, 8 machining drawings, and QC inspection plan." }
    ],
    results: [
      "Bed deflection achieved 0.12mm, 20% better than 0.15mm requirement",
      "Frame weight optimized to 8,500kg meeting shipping target (500kg margin)",
      "FEA validated factor of safety >3.0 for all static conditions, >2.0 for fatigue",
      "Parallelism maintained within 0.03mm exceeding 0.05mm requirement",
      "Fabrication cost reduced 12% through DFM optimization",
      "Design approved for manufacturing with zero revisions"
    ],
    technologies: ["SolidWorks 2023", "FEA", "Structural Analysis", "Weld Design", "Fabrication", "AWS D1.1"],
    toolsUsed: ["SolidWorks Simulation Premium", "ANSYS Workbench (validation)", "MathCAD (hand calculations)", "AutoCAD (layouts)"],
    keyMetrics: [
      { value: "500-ton", label: "Press Capacity" },
      { value: "0.12mm", label: "Bed Deflection" },
      { value: "8,500kg", label: "Frame Weight" },
      { value: "3.0+", label: "Safety Factor" }
    ],
    lessons: ["Iterative FEA enables optimal weight/stiffness balance - worth the computational investment", "Weld joint design requires explicit fatigue consideration for high-cycle applications", "Early fabricator consultation prevents costly design changes"]
  },
  {
    id: 111,
    slug: "assembly-line-balancing",
    title: "Assembly Line Balancing",
    subtitle: "Production line optimization with 30% capacity increase",
    duration: "4 weeks",
    client: "Electronics Manufacturer - Dixon Technologies",
    role: "Industrial Engineer",
    industry: "Consumer Electronics",
    teamSize: "3 Engineers",
    overview: "Performed assembly line balancing analysis using FlexSim simulation to optimize workstation task allocation for LED TV assembly. The project increased line capacity while reducing operator fatigue through ergonomic task distribution. This initiative was critical to meet growing demand without adding additional lines.",
    challenge: "The existing 12-station line had significant imbalance with some stations at 95% utilization while others were at 60%. This created bottlenecks and operator stress at overloaded stations. Line needed to absorb 30% volume increase (from 500 to 650 TVs per shift) without adding equipment. Operator turnover at high-stress stations was 25% monthly.",
    solution: "Built FlexSim model capturing all 47 assembly tasks with accurate time studies (MTM-2 methodology). Analyzed task precedence constraints and rebalanced work content across stations using heuristic algorithms. Validated new configuration through simulation before implementation. Incorporated ergonomic assessment to reduce fatigue at critical stations.",
    process: [
      { title: "Time Studies", content: "Conducted detailed MTM-2 time studies of all 47 assembly tasks with video analysis. Validated times with production supervisors." },
      { title: "Precedence Analysis", content: "Documented task dependencies creating precedence diagram with 47 nodes and 68 relationships. Identified flexibility for task reassignment." },
      { title: "Simulation Model", content: "Built FlexSim model of current state with validated cycle times. Included operator walking, material handling, and quality checks." },
      { title: "Ergonomic Assessment", content: "Evaluated workstation ergonomics using RULA methodology. Identified 3 stations exceeding ergonomic thresholds." },
      { title: "Rebalancing", content: "Developed optimized task allocation using ranked positional weight method. Created 8 scenarios meeting takt time of 55 seconds." },
      { title: "Validation", content: "Simulated proposed configuration over 100 shifts. Validated improvements and identified remaining bottlenecks." }
    ],
    results: [
      "Station utilization balanced to 80-85% range (was 60-95%)",
      "Line capacity increased 30% meeting 650 units/shift target",
      "Operator ergonomic scores improved at 3 previously overloaded stations (RULA reduced from 7 to 4)",
      "Implementation completed within 2-day line shutdown (planned 3 days)",
      "Operator turnover reduced from 25% to 8% monthly at former high-stress stations",
      "Quality defect rate reduced 15% due to reduced operator fatigue"
    ],
    technologies: ["FlexSim 2023", "Line Balancing", "Time Study", "Ergonomics", "Lean Manufacturing", "MTM-2"],
    toolsUsed: ["FlexSim Professional", "MTM-2 software", "RULA assessment tool", "Video analysis software", "Excel Solver"],
    keyMetrics: [
      { value: "30%", label: "Capacity Increase" },
      { value: "650", label: "Units Per Shift" },
      { value: "80-85%", label: "Station Utilization" },
      { value: "15%", label: "Quality Improvement" }
    ],
    lessons: ["Video-based time study improves accuracy and provides training documentation", "Ergonomic consideration prevents operator fatigue issues and turnover", "Simulation de-risks line changes by predicting issues before implementation"]
  },
  {
    id: 112,
    slug: "cnc-fixture-design",
    title: "Fixture Design for CNC Machining",
    subtitle: "Quick-change fixture system for high-mix production",
    duration: "6 weeks",
    client: "Precision Machining Job Shop - Pricol Limited",
    role: "Tooling Designer",
    industry: "Precision Machining",
    teamSize: "2 Engineers",
    overview: "Designed a modular fixture system for CNC machining of a family of 12 automotive sensor housing parts. The system featured quick-change capability to reduce setup time and improve spindle utilization for high-mix, low-volume production environment processing 50+ different parts monthly.",
    challenge: "The shop was spending 2 hours per setup change limiting machine utilization to 45%. The parts family had similar features but varying sizes (40mm to 120mm diameter) requiring flexible fixturing. Clamping forces needed precise control to avoid part distortion on thin-wall aluminum castings. Customer was demanding 40% cost reduction through productivity improvement.",
    solution: "Designed modular fixture base with hydraulic clamping using PTC Creo with 5 interchangeable locating modules for different part variants. Created master plate system with zero-point clamping for 30-second changeover. Calculated clamping forces using FEA to avoid distortion while ensuring secure holding during 12,000 RPM machining.",
    process: [
      { title: "Part Analysis", content: "Analyzed 12 part variants for common features, locating datum requirements (6-point location principle), and machining force vectors." },
      { title: "Fixture Architecture", content: "Designed modular base concept with interchangeable locating elements, zero-point clamping system (EROWA compatible), and hydraulic clamping manifold." },
      { title: "Clamping Design", content: "Selected hydraulic clamps with force calculations (800-1500N range) for each part variant. Verified against machining forces with 2.5x safety factor." },
      { title: "FEA Validation", content: "Performed FEA on thin-wall parts to verify clamping-induced distortion within 0.02mm tolerance. Optimized clamp positions." },
      { title: "Detailed Design", content: "Created complete fixture assembly with 85 components. Specified tolerances, surface finishes, and heat treatment requirements." },
      { title: "CAM Validation", content: "Verified fixture clearance and tool accessibility through CAM simulation with actual machining programs." }
    ],
    results: [
      "Setup time reduced from 2 hours to 15 minutes (87% reduction)",
      "Machine utilization improved from 45% to 72% (60% improvement)",
      "Part dimensional accuracy improved through reduced distortion (Cpk improved from 1.1 to 1.8)",
      "Customer cost reduction target of 40% exceeded (achieved 45%)",
      "ROI achieved within 6 months of implementation (₹18L investment, ₹36L annual savings)",
      "System expandable for future part variants"
    ],
    technologies: ["PTC Creo 9.0", "Fixture Design", "Hydraulic Clamping", "CNC Machining", "DFM", "Zero-Point Clamping"],
    toolsUsed: ["PTC Creo Parametric", "PTC Creo Simulate", "Mastercam (CAM verification)", "EROWA configurator"],
    keyMetrics: [
      { value: "87%", label: "Setup Time Reduction" },
      { value: "72%", label: "Machine Utilization" },
      { value: "1.8", label: "Process Cpk" },
      { value: "6mo", label: "ROI Period" }
    ],
    lessons: ["Modular fixture design pays off for high-mix production environments", "Force calculations prevent part distortion issues on thin-wall components", "Zero-point clamping systems enable rapid changeover with high repeatability"]
  },
  {
    id: 113,
    slug: "pdm-configuration",
    title: "Product Data Management System",
    subtitle: "Windchill PDM configuration for engineering document control",
    duration: "8 weeks",
    client: "Industrial Machinery OEM - Kirloskar Brothers",
    role: "PDM Administrator",
    industry: "Pump Manufacturing",
    teamSize: "5 Members",
    overview: "Configured PTC Windchill PDM system for engineering document management supporting 200+ pump models. The project included lifecycle setup, approval workflows, access controls, and CAD integration for seamless document check-in/check-out. This system manages over 100,000 engineering documents across 3 engineering locations.",
    challenge: "Engineering had no formal document control system with files stored on network drives across 3 locations with frequent version conflicts. Version control was manual leading to use of obsolete drawings in production (estimated 5% of orders). Customer audits identified document control as a major nonconformance threatening ISO 9001 certification. 40 engineers needed training with varying computer literacy levels.",
    solution: "Deployed Windchill PDM with tailored lifecycles matching pump development process (7 states) and 12 approval workflows for different document types. Configured Creo integration for automatic check-in of CAD files with attribute mapping. Established folder structures based on pump series and naming conventions compliant with company standards.",
    process: [
      { title: "Requirements", content: "Documented engineering processes for 6 document types requiring control. Mapped approval authorities and access requirements across 3 sites." },
      { title: "System Design", content: "Designed 4 lifecycles (Part, Document, CAD, ECO), 12 workflows, and access control matrix for 8 user roles." },
      { title: "Configuration", content: "Configured Windchill objects with 35 custom attributes, automation rules for numbering, and notification templates." },
      { title: "Data Migration", content: "Migrated 100,000+ documents in 3 phases over 6 weeks. Cleaned up duplicates and assigned ownership." },
      { title: "Integration", content: "Set up Creo integration for 25 workstations across 3 sites. Configured workspace synchronization and visualization." },
      { title: "Training", content: "Developed role-based training materials in English and Hindi. Conducted 15 training sessions for 40 users with competency assessment." }
    ],
    results: [
      "100% of engineering drawings (100,000+) under revision control",
      "Drawing approval time reduced from 5 days to 1 day average",
      "Production use of obsolete drawings eliminated (was 5%)",
      "Successfully passed ISO 9001 surveillance audit with zero findings",
      "40 engineers trained and using system with 92% satisfaction score",
      "Document search time reduced from 45 minutes to 3 minutes average"
    ],
    technologies: ["PTC Windchill 12.1", "PDM", "Document Control", "Workflow Design", "CAD Integration", "Data Migration"],
    toolsUsed: ["Windchill PDMLink", "PTC Creo", "Info*Engine", "MS Project", "Power BI (dashboards)"],
    keyMetrics: [
      { value: "100K+", label: "Documents Managed" },
      { value: "1 day", label: "Approval Time" },
      { value: "92%", label: "User Satisfaction" },
      { value: "3 sites", label: "Locations Connected" }
    ],
    lessons: ["User-friendly workflows improve adoption rates - complexity is the enemy", "Naming conventions are critical for searchability and must be enforced from day one", "Multi-site deployment requires careful consideration of replication and synchronization"]
  },
  {
    id: 114,
    slug: "suspension-design",
    title: "Automotive Suspension Design",
    subtitle: "Double wishbone system with kinematic optimization",
    duration: "14 weeks",
    client: "Sports Car Manufacturer - Tata Motors (JLR project)",
    role: "Chassis Designer",
    industry: "Automotive Chassis",
    teamSize: "6 Engineers",
    overview: "Designed a double wishbone front suspension system using Siemens NX for a performance SUV platform. The project included kinematic analysis to optimize geometry for handling characteristics, and FEA to validate component durability under various loading conditions including off-road events.",
    challenge: "The suspension needed to achieve specific camber and toe curves during wheel travel (-80mm to +100mm) for optimal on-road handling while accommodating off-road articulation requirements. Packaging constraints from powertrain and body structure limited design space. Components required validation for durability over 250,000 km equivalent testing including special events (curb strike, pothole).",
    solution: "Used Siemens NX with Motion simulation to optimize pickup point locations through parametric DOE studies (128 runs). Performed sensitivity analysis to achieve target camber and toe characteristics with robustness to manufacturing tolerances. Validated all components through FEA for static (2.5g cornering, 3g braking) and fatigue loading conditions.",
    process: [
      { title: "Target Setting", content: "Defined kinematic targets: camber change <0.5° per 50mm travel, toe change <0.2° per 50mm travel, roll center 80-120mm from ground based on vehicle dynamics requirements." },
      { title: "Geometry Optimization", content: "Optimized 12 pickup point locations through parametric DOE studies (128 runs). Achieved targets with +/-2mm tolerance robustness." },
      { title: "Component Design", content: "Designed upper/lower wishbones (aluminum forging), upright (aluminum casting), and steering components for packaging and strength. Weight target: 28kg per corner." },
      { title: "FEA Validation", content: "Performed stress analysis for 15 load cases including cornering, braking, curb strike. Fatigue analysis for 250,000 km equivalent. Factor of safety >1.5 for all conditions." },
      { title: "Tolerance Analysis", content: "Conducted tolerance stack-up analysis for critical alignments. Developed alignment specifications for production." },
      { title: "Documentation", content: "Created complete drawing package with 45 detail drawings for prototype manufacturing. Included material specifications and test requirements." }
    ],
    results: [
      "Achieved target camber curve within ±0.1° through full wheel travel",
      "Roll center location optimized at 95mm (target 80-120mm) for handling balance",
      "All components validated for 250,000 km durability plus special events",
      "Corner weight achieved 26.5kg, 1.5kg under 28kg target",
      "Prototype testing confirmed kinematic predictions within 0.05° accuracy",
      "Design released for vehicle prototype build on schedule"
    ],
    technologies: ["Siemens NX 2212", "Motion Simulation", "Suspension Design", "FEA", "Vehicle Dynamics", "DOE"],
    toolsUsed: ["NX Motion", "NX Nastran", "ADAMS/Car (benchmark)", "Isight (optimization)", "VisualDOC"],
    keyMetrics: [
      { value: "26.5kg", label: "Corner Weight" },
      { value: "±0.1°", label: "Camber Accuracy" },
      { value: "250K km", label: "Durability Target" },
      { value: "128", label: "DOE Runs" }
    ],
    lessons: ["Kinematic simulation saves significant prototype iterations - estimated 3 prototype cycles avoided", "Early packaging integration prevents design conflicts with other systems", "DOE methodology essential for robust design meeting tolerance requirements"]
  },
  {
    id: 115,
    slug: "packaging-line-simulation",
    title: "Packaging Line Simulation",
    subtitle: "End-of-line automation validation saving ₹1.5Cr in modifications",
    duration: "4 weeks",
    client: "Beverage Manufacturer - Coca-Cola India",
    role: "Simulation Engineer",
    industry: "Beverage Packaging",
    teamSize: "3 Engineers",
    overview: "Developed FlexSim simulation of proposed end-of-line packaging system including case packer, palletizer, and stretch wrapper for a new PET bottle line. The simulation validated equipment specifications and identified integration issues before equipment purchase, potentially saving ₹1.5Cr in field modifications.",
    challenge: "The client was investing ₹8Cr in new packaging equipment and needed confidence that the proposed system would meet 600 bottles/minute target. Equipment from 4 different vendors needed to work together seamlessly. Previous line installation had required ₹1.5Cr in field modifications due to integration issues discovered after installation.",
    solution: "Built detailed FlexSim model of proposed line including case packer (vendor 1), conveyor system (vendor 2), palletizer (vendor 3), and stretch wrapper (vendor 4). Simulated all operating scenarios including normal production, changeovers, and jam recovery. Identified 3 critical integration issues requiring specification changes before purchase orders.",
    process: [
      { title: "Vendor Data Collection", content: "Gathered detailed specifications from 4 equipment vendors including cycle times, buffer capacities, changeover times, and MTBF data." },
      { title: "Model Development", content: "Created FlexSim model with accurate equipment representations. Included conveyor dynamics, accumulation behavior, and jam detection logic." },
      { title: "Normal Operation", content: "Simulated 8-hour production runs with 6 different SKUs. Validated throughput of 600 bottles/minute sustained." },
      { title: "Upset Scenarios", content: "Simulated equipment failures, jam recovery, and changeover sequences. Identified conveyor buffer undersizing issue." },
      { title: "Sensitivity Analysis", content: "Tested system response to ±10% variation in equipment cycle times. Identified palletizer as critical constraint." },
      { title: "Recommendations", content: "Documented 3 specification changes and 2 layout modifications. Presented findings to vendor and client teams." }
    ],
    results: [
      "Identified 3 critical integration issues before equipment purchase",
      "Conveyor buffer specifications increased from 2 minutes to 4 minutes avoiding accumulation overflow",
      "Palletizer infeed conveyor speed requirement increased by 15% to maintain throughput",
      "Estimated ₹1.5Cr savings by avoiding field modifications",
      "Line commissioned on schedule meeting 600 bottles/minute target",
      "Simulation model retained for future capacity planning"
    ],
    technologies: ["FlexSim 2023", "Packaging Simulation", "Equipment Integration", "Capacity Planning"],
    toolsUsed: ["FlexSim Professional", "Excel (data analysis)", "AutoCAD (layouts)", "MS Project"],
    keyMetrics: [
      { value: "600", label: "Bottles/Minute" },
      { value: "₹1.5Cr", label: "Savings" },
      { value: "3", label: "Issues Found" },
      { value: "4", label: "Vendors Coordinated" }
    ],
    lessons: ["Pre-purchase simulation prevents costly field modifications - ROI is immediate", "Multi-vendor integration requires careful coordination of specifications", "Upset scenario testing reveals issues not visible in normal operation"]
  },
  {
    id: 116,
    slug: "motor-housing-design",
    title: "Electric Motor Housing Design",
    subtitle: "Thermal-optimized housing with IP67 protection",
    duration: "6 weeks",
    client: "EV Component Supplier - Tata AutoComp",
    role: "Product Designer",
    industry: "Electric Vehicles",
    teamSize: "3 Engineers",
    overview: "Designed an aluminum die-cast motor housing for 50kW traction motor used in electric vehicles. The project included thermal management with integrated liquid cooling jacket, IP67 sealing design, and NVH optimization through structural ribbing patterns.",
    challenge: "The motor housing needed to dissipate 2kW continuous heat loss while maintaining stator temperature below 150°C. IP67 protection was mandatory for under-hood environment. Weight target of 8kg required die-cast aluminum with optimized wall thicknesses. Structural stiffness was critical for NVH performance with first mode >1500Hz.",
    solution: "Used SolidWorks with CFD analysis for cooling jacket optimization through 20 design iterations. Designed die-cast housing with optimized ribbing patterns using topology optimization guidance. Created sealing features with O-ring grooves and face seals for IP67 compliance. Validated NVH through modal analysis achieving first mode at 1650Hz.",
    process: [
      { title: "Thermal Requirements", content: "Defined heat dissipation targets based on motor loss analysis. Specified coolant flow rate (10 L/min) and inlet temperature (65°C) for cooling jacket sizing." },
      { title: "Cooling Jacket Design", content: "Optimized cooling jacket geometry through 20 CFD iterations. Achieved uniform cooling with <5°C temperature variation across stator interface." },
      { title: "Structural Design", content: "Designed housing structure with mounting features, bearing housing, and cable entry points. Used topology optimization to minimize weight while meeting stiffness targets." },
      { title: "Sealing Design", content: "Designed O-ring sealing for coolant interfaces and mating surfaces. Specified face seals for cable entries and sensor ports." },
      { title: "DFM for Die Casting", content: "Optimized design for die casting with proper draft angles, uniform wall thickness, and minimal undercuts. Consulted with foundry for tool feasibility." },
      { title: "Validation", content: "Performed modal analysis confirming first mode at 1650Hz. Conducted thermal FEA validating stator temperature of 142°C." }
    ],
    results: [
      "Stator temperature maintained at 142°C, 8°C below 150°C limit",
      "Housing weight achieved 7.6kg, 5% under 8kg target",
      "First structural mode at 1650Hz exceeding 1500Hz requirement",
      "IP67 rating verified through prototype testing",
      "Die casting tool approved with zero DFM concerns",
      "Design released for production for 3 EV platforms"
    ],
    technologies: ["SolidWorks 2023", "CFD", "Thermal Design", "Die Casting", "NVH", "Modal Analysis"],
    toolsUsed: ["SolidWorks Premium", "FloEFD", "SolidWorks Simulation", "KeyShot"],
    keyMetrics: [
      { value: "142°C", label: "Stator Temperature" },
      { value: "7.6kg", label: "Housing Weight" },
      { value: "1650Hz", label: "First Mode" },
      { value: "IP67", label: "Protection Rating" }
    ],
    lessons: ["Integrated thermal-structural optimization essential for EV components", "Early foundry consultation prevents die casting issues", "IP67 sealing requires careful attention to tolerance stack-ups"]
  },
  {
    id: 117,
    slug: "dashboard-assembly",
    title: "Automotive Dashboard Assembly",
    subtitle: "Complete instrument panel with multi-material integration",
    duration: "16 weeks",
    client: "Interior Supplier - Motherson Automotive",
    role: "Design Engineer",
    industry: "Automotive Interiors",
    teamSize: "8 Engineers",
    overview: "Designed complete dashboard module assembly using PTC Creo for a mid-size sedan platform. The project included integration of 45+ components including soft-touch upper panel, structural cross-car beam, airbag housing, HVAC ducts, and wiring harness routing. Worked closely with OEM for Class A surface approval.",
    challenge: "The dashboard had to integrate components from 12 different suppliers while meeting tight gap and flush requirements (±0.5mm). Airbag deployment analysis required careful attention to tear seam design. HVAC duct routing was complex with limited package space. Class A surface quality was required for visible areas with no sink marks or flow lines.",
    solution: "Used PTC Creo with large assembly management techniques for 2500+ component assembly. Implemented GD&T tolerance stack-up analysis using VSA-3D for all gap and flush conditions. Collaborated with OEM styling team for Class A surface development using ICEM Surf. Created detailed assembly sequence documentation for Tier-1 supplier manufacturing.",
    process: [
      { title: "Package Integration", content: "Developed packaging layout accommodating all interior systems including HVAC, electrical, airbag, and display systems. Resolved 15 packaging conflicts with cross-functional team." },
      { title: "Surface Development", content: "Developed Class A surfaces in coordination with OEM styling team. Achieved curvature continuity and reflection quality approval after 3 review cycles." },
      { title: "Structural Design", content: "Designed steel cross-car beam with instrument panel mounting points. Performed vibration analysis to meet first mode >40Hz target." },
      { title: "Airbag Integration", content: "Designed passenger airbag housing and tear seam. Coordinated with airbag supplier for deployment simulation and validation." },
      { title: "HVAC Duct Routing", content: "Routed HVAC ducts for 4 vents with minimal pressure drop. Coordinated with HVAC team for airflow CFD validation." },
      { title: "Assembly Documentation", content: "Created assembly sequence for 45+ components with torque specifications and quality inspection criteria." }
    ],
    results: [
      "Assembly achieved all gap and flush targets within ±0.5mm specification",
      "Class A surface approved by OEM styling team on third submission",
      "Airbag deployment testing passed all safety requirements",
      "First structural mode at 45Hz exceeding 40Hz target",
      "Weight target of 22kg achieved (target: 23kg)",
      "Design released for tool kick-off on schedule"
    ],
    technologies: ["PTC Creo 9.0", "Large Assembly", "Class A Surfaces", "GD&T", "ICEM Surf", "Airbag Integration"],
    toolsUsed: ["PTC Creo Parametric", "ICEM Surf", "VSA-3D", "Windchill PDM", "LS-DYNA (airbag simulation)"],
    keyMetrics: [
      { value: "45+", label: "Components" },
      { value: "±0.5mm", label: "Gap/Flush Tolerance" },
      { value: "22kg", label: "Assembly Weight" },
      { value: "12", label: "Suppliers Coordinated" }
    ],
    lessons: ["Early supplier engagement essential for complex multi-supplier assemblies", "Tolerance stack-up analysis prevents fit issues at prototype stage", "Class A surface development requires iterative collaboration with styling team"]
  },
  {
    id: 118,
    slug: "cnc-machine-design",
    title: "CNC Machine Tool Design",
    subtitle: "Vertical machining center with precision optimization",
    duration: "20 weeks",
    client: "Machine Tool Manufacturer - BFW (Bharat Fritz Werner)",
    role: "Machine Designer",
    industry: "Machine Tools",
    teamSize: "5 Engineers",
    overview: "Designed a vertical machining center (VMC) structure including bed, column, saddle, and spindle head. The project focused on static and dynamic stiffness optimization for precision machining applications requiring positioning accuracy of ±0.005mm.",
    challenge: "The machine structure needed to provide positioning accuracy of ±0.005mm while handling cutting forces up to 5000N. Thermal stability was critical as temperature variations could cause 0.01mm/°C dimensional changes. Dynamic stiffness affected surface finish quality requiring first mode >80Hz. Manufacturing feasibility for cast iron structures with complex ribbing patterns had to be ensured.",
    solution: "Used SolidWorks with comprehensive FEA for static and dynamic analysis through 15 design iterations. Applied topology optimization for ribbing pattern development. Conducted thermal FEA to understand temperature distribution and compensation requirements. Worked with foundry to ensure castability of optimized design.",
    process: [
      { title: "Specification Review", content: "Documented machine specifications including work envelope (800x500x500mm), spindle power (15kW), and accuracy targets. Benchmarked competitor machines." },
      { title: "Concept Development", content: "Developed 3 structural concepts exploring C-frame, bridge, and portal configurations. Selected C-frame for cost and accessibility." },
      { title: "Static Optimization", content: "Optimized structure for static stiffness using topology optimization. Achieved 200N/μm at tool point through ribbing patterns." },
      { title: "Dynamic Analysis", content: "Performed modal analysis achieving first mode at 95Hz. Conducted harmonic response analysis for cutting force excitation." },
      { title: "Thermal Analysis", content: "Analyzed thermal behavior under various ambient conditions. Designed cooling provisions for spindle motor and drive systems." },
      { title: "DFM for Casting", content: "Collaborated with foundry for pattern development. Specified machining allowances and critical surface callouts." }
    ],
    results: [
      "Static stiffness of 200N/μm achieved at tool point (target: 150N/μm)",
      "First structural mode at 95Hz exceeding 80Hz target",
      "Positioning accuracy of ±0.004mm achieved in testing",
      "Thermal stability within ±0.005mm over 8-hour operation",
      "Weight of 4,500kg within 5,000kg shipping limit",
      "First machine prototype validated within 3 months of casting"
    ],
    technologies: ["SolidWorks 2023", "FEA", "Modal Analysis", "Topology Optimization", "Machine Design", "Cast Iron Structures"],
    toolsUsed: ["SolidWorks Simulation Premium", "ANSYS Workbench", "MAGMASOFT (casting simulation)", "LMS Test.Lab (validation)"],
    keyMetrics: [
      { value: "200N/μm", label: "Static Stiffness" },
      { value: "95Hz", label: "First Mode" },
      { value: "±0.004mm", label: "Positioning Accuracy" },
      { value: "4,500kg", label: "Machine Weight" }
    ],
    lessons: ["Topology optimization provides excellent guidance for ribbing patterns", "Dynamic stiffness is as important as static stiffness for machining quality", "Early foundry collaboration ensures castability of complex structures"]
  },
  {
    id: 119,
    slug: "agv-system-design",
    title: "Material Handling AGV System",
    subtitle: "Automated guided vehicle fleet for factory logistics",
    duration: "10 weeks",
    client: "Automotive Assembly Plant - Maruti Suzuki",
    role: "Automation Engineer",
    industry: "Automotive Manufacturing",
    teamSize: "6 Engineers",
    overview: "Designed AGV (Automated Guided Vehicle) system for material delivery in automotive assembly plant. The project included fleet sizing through FlexSim simulation, traffic management algorithm design, and integration specifications for existing MES and WMS systems.",
    challenge: "The assembly line required just-in-time delivery of 200+ part varieties to 45 stations with 60-second takt time. Existing manual tugger trains couldn't meet increasing production demands and were safety concerns. AGV fleet needed to navigate complex factory floor with pedestrian crossings and forklift traffic. Integration with SAP for inventory management was required.",
    solution: "Developed FlexSim simulation to optimize fleet size and routing strategy. Designed traffic management rules for 15 AGVs operating in shared space with manual vehicles. Created detailed integration specifications for MES call triggers and WMS inventory updates. Selected AGV platform and designed charging infrastructure.",
    process: [
      { title: "Material Flow Analysis", content: "Mapped all 200+ part varieties, delivery frequencies, and station locations. Calculated delivery requirements and peak demand scenarios." },
      { title: "AGV Selection", content: "Evaluated 5 AGV vendors for payload capacity (500kg), navigation technology (SLAM vs magnetic tape), and integration capabilities. Selected MiR500." },
      { title: "Fleet Sizing", content: "Built FlexSim simulation with validated AGV travel times and charging requirements. Determined optimal fleet of 15 AGVs for 120% capacity." },
      { title: "Traffic Management", content: "Designed zone-based traffic rules, intersection priorities, and deadlock prevention algorithms. Validated through simulation with 1000+ hour runs." },
      { title: "Integration Design", content: "Specified MES interfaces for delivery triggers, WMS interfaces for inventory confirmation, and charging station integration." },
      { title: "Safety Planning", content: "Designed safety system with personnel detection, emergency stops, and designated pedestrian crossings. Conducted risk assessment per ISO 3691-4." }
    ],
    results: [
      "15 AGV fleet successfully handles all 200+ part varieties with 99.5% on-time delivery",
      "Material handling labor reduced by 12 FTE (₹72L annual savings)",
      "Zero safety incidents in first 6 months of operation",
      "Production line stoppages due to material shortage reduced from 45 min/week to 5 min/week",
      "System handles 25% demand surge during model changeover",
      "ROI achieved within 18 months of implementation"
    ],
    technologies: ["FlexSim 2023", "AGV Systems", "SLAM Navigation", "MES Integration", "WMS Integration", "Traffic Management"],
    toolsUsed: ["FlexSim Professional", "MiR Fleet Management", "SAP MM", "Allen-Bradley PLC", "AutoCAD (layouts)"],
    keyMetrics: [
      { value: "15", label: "AGV Fleet Size" },
      { value: "99.5%", label: "On-time Delivery" },
      { value: "₹72L", label: "Annual Savings" },
      { value: "18mo", label: "ROI Period" }
    ],
    lessons: ["Simulation is essential for AGV fleet sizing - both under and over sizing are costly", "Traffic management rules require extensive testing for deadlock prevention", "Safety integration with existing factory systems requires careful planning"]
  },
  {
    id: 120,
    slug: "heat-exchanger-design",
    title: "Heat Exchanger Design",
    subtitle: "Shell and tube exchanger with ASME code compliance",
    duration: "8 weeks",
    client: "Process Equipment Manufacturer - Thermax Limited",
    role: "Thermal Designer",
    industry: "Process Equipment",
    teamSize: "3 Engineers",
    overview: "Designed a shell and tube heat exchanger for petrochemical application with ASME Section VIII Div.1 code compliance. The project included thermal-hydraulic sizing, mechanical design with pressure calculations, and detailed fabrication drawings.",
    challenge: "The heat exchanger needed to transfer 2MW between process fluid and cooling water while meeting strict pressure drop limits (50 kPa shell, 30 kPa tube). Operating pressure of 25 bar required ASME code design with third-party certification. Tube vibration was a concern due to high shell-side flow rates. Maintenance requirements demanded removable tube bundle design.",
    solution: "Used HTRI for thermal-hydraulic design through 12 iterations optimizing tube layout and baffle spacing. Performed mechanical design calculations per ASME Section VIII Div.1 using PVElite. Designed support system and nozzle reinforcements. Conducted vibration analysis to prevent tube failure.",
    process: [
      { title: "Thermal Sizing", content: "Performed thermal-hydraulic calculations using HTRI. Optimized tube pitch, baffle spacing, and pass arrangement for required heat duty and pressure drop limits." },
      { title: "Tube Layout", content: "Designed tube layout with 380 tubes (25mm OD, 2mm wall). Selected tube pattern and determined tube sheet thickness." },
      { title: "Mechanical Design", content: "Calculated shell thickness (14mm), head thickness, flange ratings, and nozzle reinforcements per ASME Section VIII Div.1." },
      { title: "Vibration Analysis", content: "Analyzed tube vibration using HTRI vibration module. Adjusted baffle spacing to ensure natural frequency >30% above vortex shedding frequency." },
      { title: "Support Design", content: "Designed saddle supports for horizontal installation. Calculated anchor bolt sizing for seismic Zone IV requirements." },
      { title: "Drawing Package", content: "Created complete fabrication drawings with weld details, material specifications, and inspection requirements for ASME U-stamp certification." }
    ],
    results: [
      "Heat duty of 2.05MW achieved (target: 2MW) with 2.5% margin",
      "Pressure drops met targets: 45 kPa shell, 28 kPa tube",
      "Tube vibration analysis confirmed safe operation with 50% margin",
      "Design approved by third-party inspector for ASME U-stamp",
      "Fabrication completed within 16-week timeline",
      "Exchanger commissioned and operating successfully for 18 months"
    ],
    technologies: ["HTRI Xchanger Suite", "PVElite", "ASME Section VIII", "Thermal Design", "Pressure Vessel Design"],
    toolsUsed: ["HTRI Xchanger Suite", "PVElite", "AutoCAD", "MathCAD"],
    keyMetrics: [
      { value: "2MW", label: "Heat Duty" },
      { value: "25 bar", label: "Design Pressure" },
      { value: "380", label: "Tubes" },
      { value: "ASME U", label: "Certification" }
    ],
    lessons: ["HTRI provides accurate thermal-hydraulic predictions reducing prototype iterations", "Vibration analysis is critical for high-flow applications", "Early third-party involvement ensures smooth certification process"]
  }
];
