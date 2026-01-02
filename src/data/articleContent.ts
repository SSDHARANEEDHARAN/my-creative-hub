export interface ArticleSection {
  title: string;
  content: string;
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
}

export const articleContents: ArticleContent[] = [
  {
    id: 101,
    slug: "automotive-engine-block",
    title: "Automotive Engine Block Design",
    subtitle: "Complete 3D CAD design with thermal and structural analysis",
    duration: "8 weeks",
    client: "Automotive OEM",
    role: "Lead CAD Designer",
    overview: "This project involved the complete 3D CAD design of a 4-cylinder inline engine block for a mid-size sedan application. The design process included extensive FEA thermal analysis to optimize cooling jacket geometry and stress simulation to ensure structural integrity under extreme operating conditions.",
    challenge: "The main challenge was designing an engine block that could withstand thermal stresses up to 150°C while maintaining precise cylinder bore geometry within 0.02mm tolerance. Additionally, weight reduction targets of 15% compared to the previous generation required innovative ribbing patterns and material optimization.",
    solution: "Utilized SolidWorks for parametric 3D modeling with integrated simulation tools. Implemented topology optimization for weight reduction while maintaining structural requirements. Created comprehensive manufacturing drawings with GD&T specifications for casting and machining processes.",
    process: [
      { title: "Requirements Analysis", content: "Gathered performance specifications, packaging constraints, and manufacturing requirements from the client engineering team." },
      { title: "Concept Development", content: "Created multiple concept designs exploring different cooling jacket configurations and structural ribbing patterns." },
      { title: "Detailed Design", content: "Developed the final 3D model with all features including bolt bosses, oil galleries, water jackets, and mounting interfaces." },
      { title: "FEA Validation", content: "Performed thermal and structural FEA simulations to validate design performance under operating conditions." },
      { title: "Drawing Package", content: "Created complete manufacturing drawings with GD&T specifications for casting and machining operations." }
    ],
    results: [
      "Achieved 18% weight reduction compared to previous design",
      "Thermal analysis confirmed maximum temperature of 142°C within safe limits",
      "Stress analysis showed factor of safety >2.5 for all operating conditions",
      "Design approved for prototype casting and testing"
    ],
    technologies: ["SolidWorks", "FEA Simulation", "Thermal Analysis", "GD&T", "Technical Drawing"],
    lessons: ["Early integration of manufacturing constraints significantly reduces design iterations", "Parametric modeling enables rapid design optimization cycles"]
  },
  {
    id: 102,
    slug: "manufacturing-line-simulation",
    title: "Manufacturing Line Simulation",
    subtitle: "FlexSim optimization achieving 25% efficiency improvement",
    duration: "6 weeks",
    client: "Automotive Tier-1 Supplier",
    role: "Simulation Engineer",
    overview: "Developed a comprehensive discrete event simulation of an automotive component production line using FlexSim. The simulation identified bottlenecks, optimized buffer sizes, and validated proposed layout changes before implementation.",
    challenge: "The existing production line was experiencing throughput issues with only 72% OEE. The client needed to increase production capacity by 20% without significant capital investment. Understanding the complex interactions between 12 workstations with varying cycle times was critical.",
    solution: "Built a detailed FlexSim simulation model capturing all workstations, material handling, operator assignments, and downtime patterns. Ran multiple scenarios to identify optimal buffer sizes and workstation sequencing. Validated results with actual production data.",
    process: [
      { title: "Data Collection", content: "Gathered cycle times, downtime data, shift patterns, and material flow information from the production floor." },
      { title: "Model Building", content: "Created accurate 3D simulation model in FlexSim with all workstations, conveyors, and operators." },
      { title: "Validation", content: "Validated model output against actual production data achieving >95% accuracy." },
      { title: "Scenario Analysis", content: "Tested 15+ scenarios including buffer changes, workstation resequencing, and shift modifications." },
      { title: "Recommendations", content: "Presented optimized configuration with implementation roadmap to management." }
    ],
    results: [
      "Identified primary bottleneck at Station 7 limiting throughput",
      "Recommended buffer size changes reduced WIP by 30%",
      "Optimized configuration increased OEE to 89%",
      "25% throughput improvement achieved with minimal investment"
    ],
    technologies: ["FlexSim", "Discrete Event Simulation", "Statistical Analysis", "Lean Manufacturing"],
    lessons: ["Accurate input data is crucial for reliable simulation results", "Involving operators in data collection improves model accuracy"]
  },
  {
    id: 103,
    slug: "gearbox-assembly",
    title: "Gearbox Assembly Design",
    subtitle: "6-speed manual transmission with complete motion analysis",
    duration: "12 weeks",
    client: "Transmission Manufacturer",
    role: "Design Engineer",
    overview: "Designed a complete 6-speed manual gearbox assembly using PTC Creo, including all gears, shafts, bearings, and housing components. The project included motion analysis to validate gear engagement and interference checking for assembly feasibility.",
    challenge: "The gearbox needed to handle 400 Nm torque while fitting within a tight packaging envelope. Synchronizer design required precise motion analysis to ensure smooth shifting feel. Assembly sequence had to accommodate automated production line constraints.",
    solution: "Used PTC Creo's advanced assembly capabilities with motion analysis module for gear engagement simulation. Implemented GD&T stack-up analysis for critical tolerances. Created detailed assembly instructions with exploded views for manufacturing.",
    process: [
      { title: "Gear Design", content: "Designed all gear pairs with proper involute profiles, face widths, and surface hardness specifications." },
      { title: "Shaft Design", content: "Created input, output, and countershaft designs with bearing journal specifications." },
      { title: "Housing Design", content: "Designed split-line aluminum housing with mounting features and oil gallery routing." },
      { title: "Motion Analysis", content: "Simulated synchronizer engagement and verified interference-free operation throughout shift sequence." },
      { title: "Documentation", content: "Created complete drawing package with assembly instructions and quality inspection criteria." }
    ],
    results: [
      "Assembly passed all interference checks in motion analysis",
      "Synchronizer engagement time optimized to 0.3 seconds",
      "Weight target achieved at 42kg complete assembly",
      "Design released for prototype manufacturing"
    ],
    technologies: ["PTC Creo", "Motion Analysis", "GD&T", "Tolerance Stack-up", "Assembly Design"],
    lessons: ["Motion analysis early in design prevents costly prototype failures", "Clear assembly documentation reduces manufacturing issues"]
  },
  {
    id: 104,
    slug: "plm-implementation",
    title: "PLM Implementation Project",
    subtitle: "Enterprise Windchill deployment for document and workflow management",
    duration: "16 weeks",
    client: "Manufacturing Enterprise",
    role: "PLM Consultant",
    overview: "Led the implementation of PTC Windchill PLM system for a mid-size manufacturing company. The project covered document control, engineering change management workflows, BOM management, and CAD data integration with PTC Creo.",
    challenge: "The client had engineering data scattered across multiple file servers with no version control. Engineering changes were tracked manually in spreadsheets leading to errors and delays. Integration with existing ERP system was required for BOM synchronization.",
    solution: "Deployed Windchill PDMLink with customized workflows for ECR/ECO process. Configured CAD workstation integration for seamless check-in/check-out. Developed custom reports for management visibility. Created comprehensive training program for 50+ users.",
    process: [
      { title: "Requirements Gathering", content: "Conducted workshops with engineering, manufacturing, and quality teams to document requirements." },
      { title: "System Configuration", content: "Configured Windchill organization structure, lifecycles, workflows, and access controls." },
      { title: "Data Migration", content: "Migrated 50,000+ CAD files and documents with proper metadata and folder structure." },
      { title: "Integration Setup", content: "Configured Creo integration and ERP BOM sync interface." },
      { title: "Training & Go-Live", content: "Delivered role-based training and supported hypercare period after go-live." }
    ],
    results: [
      "100% of engineering documents under version control",
      "ECO cycle time reduced from 15 days to 5 days",
      "Eliminated 95% of BOM errors through automated sync",
      "50+ users trained and actively using system"
    ],
    technologies: ["PTC Windchill", "PLM", "Workflow Design", "Data Migration", "ERP Integration"],
    lessons: ["User adoption is critical - invest heavily in training", "Start with core functionality before adding advanced features"]
  },
  {
    id: 105,
    slug: "robot-cell-design",
    title: "Industrial Robot Cell Design",
    subtitle: "Robotic welding cell with path simulation and safety planning",
    duration: "10 weeks",
    client: "Automotive Body Shop",
    role: "Automation Engineer",
    overview: "Designed a complete robotic welding cell using Siemens NX including robot selection, fixture design, weld gun specification, and safety system layout. The project included robot path programming and cycle time validation through simulation.",
    challenge: "The cell needed to perform 45 spot welds on an automotive body panel within 55-second cycle time. Limited floor space required compact layout while maintaining operator access for part loading. Safety systems had to comply with ISO 10218 requirements.",
    solution: "Used Siemens NX for 3D cell layout with integrated robot simulation. Optimized robot paths for minimum cycle time while avoiding collisions. Designed custom weld fixtures with quick-change capability. Specified safety scanners and light curtains for compliant operation.",
    process: [
      { title: "Cell Layout", content: "Created 3D layout exploring multiple robot positions and fixture orientations for optimal reach." },
      { title: "Robot Selection", content: "Evaluated robot models based on reach, payload, and weld gun compatibility." },
      { title: "Path Programming", content: "Developed robot programs for all weld points with optimized travel paths." },
      { title: "Simulation", content: "Validated cycle time and verified collision-free operation through simulation." },
      { title: "Safety Planning", content: "Designed safety system layout compliant with risk assessment requirements." }
    ],
    results: [
      "Achieved 52-second cycle time, 5% better than target",
      "Compact cell layout within 6m x 4m footprint",
      "Zero collision paths verified through simulation",
      "Safety system design approved by third-party auditor"
    ],
    technologies: ["Siemens NX", "Robot Simulation", "Path Planning", "Safety Systems", "Welding"],
    lessons: ["Simulation-first approach prevents costly field modifications", "Early safety planning avoids compliance issues"]
  },
  {
    id: 106,
    slug: "injection-mold-design",
    title: "Injection Mold Tool Design",
    subtitle: "Automotive interior component mold with optimized cooling",
    duration: "8 weeks",
    client: "Plastics Molder",
    role: "Mold Designer",
    overview: "Designed a two-cavity injection mold for an automotive interior trim component. The project included conformal cooling channel design, gate location optimization using flow analysis, and complete tool design with ejection system.",
    challenge: "The part had complex geometry with varying wall thicknesses leading to potential warpage issues. Cycle time target of 35 seconds required efficient cooling. Part surface had visible A-surface quality requirements with no witness marks allowed.",
    solution: "Used SolidWorks with Moldflow analysis for gate optimization and warpage prediction. Designed conformal cooling channels using additive manufacturing techniques. Specified appropriate steel grades and surface finishes for A-surface quality.",
    process: [
      { title: "Part Analysis", content: "Analyzed part geometry for moldability, draft angles, and undercut features." },
      { title: "Flow Analysis", content: "Performed Moldflow simulation to optimize gate location and predict fill pattern." },
      { title: "Cooling Design", content: "Designed conformal cooling channels for uniform temperature distribution." },
      { title: "Tool Design", content: "Created complete mold design including core, cavity, ejection system, and mold base." },
      { title: "Documentation", content: "Prepared manufacturing drawings and BOM for tool build." }
    ],
    results: [
      "Achieved 32-second cycle time, 9% better than target",
      "Warpage reduced to 0.3mm within specification",
      "A-surface quality approved by OEM customer",
      "Tool approved for production release"
    ],
    technologies: ["SolidWorks", "Moldflow", "Conformal Cooling", "Tool Design", "Plastics Engineering"],
    lessons: ["Conformal cooling significantly improves cycle time and quality", "Flow analysis prevents costly mold modifications"]
  },
  {
    id: 107,
    slug: "warehouse-optimization",
    title: "Warehouse Layout Optimization",
    subtitle: "Distribution center simulation for 40% pick efficiency improvement",
    duration: "5 weeks",
    client: "E-commerce Fulfillment",
    role: "Simulation Consultant",
    overview: "Developed FlexSim simulation of a distribution center warehouse to optimize layout, slotting strategy, and pick path routing. The project analyzed current operations and proposed improvements for throughput increase.",
    challenge: "The warehouse was experiencing increasing order volumes with declining pick productivity. Travel time accounted for 65% of picker time. SKU velocity analysis showed suboptimal slotting with fast movers scattered throughout the facility.",
    solution: "Built detailed FlexSim model of warehouse including all rack locations, pick zones, and material handling equipment. Analyzed SKU velocity data to optimize slotting. Simulated multiple layout configurations to identify optimal design.",
    process: [
      { title: "Current State Mapping", content: "Documented existing layout, pick paths, and operational procedures." },
      { title: "Data Analysis", content: "Analyzed order data, SKU velocity, and pick frequency patterns." },
      { title: "Model Development", content: "Created FlexSim model with accurate rack locations and picker behavior." },
      { title: "Optimization", content: "Tested slotting strategies and layout modifications through simulation." },
      { title: "Implementation Plan", content: "Developed phased implementation plan for approved changes." }
    ],
    results: [
      "Pick productivity improved 40% through optimized slotting",
      "Travel time reduced from 65% to 45% of picker time",
      "Order throughput increased 35% with same headcount",
      "ROI achieved within 4 months of implementation"
    ],
    technologies: ["FlexSim", "Warehouse Simulation", "Slotting Optimization", "Data Analysis"],
    lessons: ["SKU velocity analysis is foundational for warehouse optimization", "Simulation enables risk-free testing of layout changes"]
  },
  {
    id: 108,
    slug: "sheet-metal-enclosure",
    title: "Sheet Metal Enclosure Design",
    subtitle: "IP65 industrial enclosure with optimized manufacturing",
    duration: "4 weeks",
    client: "Industrial Equipment OEM",
    role: "Product Designer",
    overview: "Designed an IP65-rated sheet metal enclosure for industrial control equipment. The design included proper bend allowance calculations, sealing features, and DFM optimization for laser cutting and press brake forming.",
    challenge: "The enclosure needed IP65 protection while allowing for field serviceability. Heat dissipation from internal electronics required ventilation without compromising ingress protection. Cost targets required design for single-setup fabrication.",
    solution: "Used SolidWorks sheet metal tools with accurate K-factor calculations for 2mm stainless steel. Designed modular panels with captive hardware for easy assembly. Specified appropriate sealing gaskets and cable glands for IP65 rating.",
    process: [
      { title: "Requirements", content: "Documented dimensional constraints, IP rating, thermal requirements, and access needs." },
      { title: "Concept Design", content: "Developed enclosure architecture with modular panel approach." },
      { title: "Detailed Design", content: "Created detailed sheet metal models with bend features and hardware cutouts." },
      { title: "DFM Review", content: "Reviewed design with fabrication vendor for manufacturability feedback." },
      { title: "Documentation", content: "Prepared flat patterns, assembly drawings, and BOM for production." }
    ],
    results: [
      "IP65 rating verified through third-party testing",
      "Fabrication cost 20% below target through DFM optimization",
      "Assembly time reduced 40% with snap-fit features",
      "Design approved for production release"
    ],
    technologies: ["SolidWorks", "Sheet Metal Design", "DFM", "IP Rating", "Fabrication"],
    lessons: ["Early vendor engagement improves manufacturability", "Modular design enables easier field service"]
  },
  {
    id: 109,
    slug: "conveyor-system",
    title: "Conveyor System Design",
    subtitle: "Modular packaging line conveyor with integrated controls",
    duration: "7 weeks",
    client: "Consumer Goods Manufacturer",
    role: "Mechanical Designer",
    overview: "Designed a modular conveyor system for a packaging line application. The project included structural analysis, motor sizing calculations, and integration documentation for controls and safety systems.",
    challenge: "The conveyor system needed to handle product sizes from 100mm to 500mm with quick changeover capability. Variable speed requirements from 10 to 40 m/min demanded proper motor sizing. Integration with existing line required precise timing coordination.",
    solution: "Designed modular conveyor sections in Siemens NX for flexible configuration. Performed motor and gearbox sizing calculations for all operating conditions. Created detailed integration specifications for controls and safety interlocks.",
    process: [
      { title: "Layout Planning", content: "Developed conveyor routing to integrate with existing equipment layout." },
      { title: "Component Selection", content: "Selected belt type, drives, and support structure for application requirements." },
      { title: "Structural Analysis", content: "Verified frame structure for loading conditions and vibration." },
      { title: "Motor Sizing", content: "Calculated motor power and gearbox ratios for speed range and loading." },
      { title: "Integration Docs", content: "Created wiring diagrams and controls integration specifications." }
    ],
    results: [
      "Modular design reduced installation time by 50%",
      "Quick changeover achieved in under 5 minutes",
      "Energy consumption 15% lower than specification",
      "System commissioned on schedule"
    ],
    technologies: ["Siemens NX", "Mechanical Design", "Motor Sizing", "Conveyor Systems"],
    lessons: ["Modular design enables faster installation and maintenance", "Proper motor sizing prevents reliability issues"]
  },
  {
    id: 110,
    slug: "hydraulic-press",
    title: "Hydraulic Press Frame Design",
    subtitle: "500-ton press with FEA-optimized structure",
    duration: "10 weeks",
    client: "Stamping Equipment Supplier",
    role: "Structural Designer",
    overview: "Designed a 500-ton hydraulic press frame with FEA stress analysis and deflection optimization. The project included weld joint design, bolted connection calculations, and complete fabrication specifications.",
    challenge: "The press frame needed to limit bed deflection to 0.15mm under full load while meeting weight targets for shipping constraints. Weld joint design required careful analysis to avoid fatigue failures. Foundation loading required detailed force calculations.",
    solution: "Used SolidWorks with FEA simulation for iterative stress optimization. Designed frame with strategic ribbing patterns to maximize stiffness-to-weight ratio. Specified proper weld details and inspection requirements for fatigue-critical joints.",
    process: [
      { title: "Load Analysis", content: "Documented loading conditions including dynamic effects and off-center loading." },
      { title: "Concept Design", content: "Developed frame architectures exploring welded vs. tie-rod construction." },
      { title: "FEA Optimization", content: "Performed iterative FEA studies to optimize rib patterns and plate thicknesses." },
      { title: "Weld Design", content: "Designed weld joints with appropriate sizing and inspection requirements." },
      { title: "Documentation", content: "Created fabrication drawings with weld specifications and QC requirements." }
    ],
    results: [
      "Bed deflection achieved 0.12mm, 20% better than requirement",
      "Frame weight optimized to 8,500kg meeting shipping target",
      "FEA validated factor of safety >3.0 for all conditions",
      "Design approved for manufacturing"
    ],
    technologies: ["SolidWorks", "FEA", "Structural Analysis", "Weld Design", "Fabrication"],
    lessons: ["Iterative FEA enables optimal weight/stiffness balance", "Weld joint design requires fatigue consideration"]
  },
  {
    id: 111,
    slug: "assembly-line-balancing",
    title: "Assembly Line Balancing",
    subtitle: "Production line optimization with 30% capacity increase",
    duration: "4 weeks",
    client: "Electronics Manufacturer",
    role: "Industrial Engineer",
    overview: "Performed assembly line balancing analysis using FlexSim simulation to optimize workstation task allocation. The project increased line capacity while reducing operator fatigue through ergonomic task distribution.",
    challenge: "The existing line had significant imbalance with some stations at 95% utilization while others were at 60%. This created bottlenecks and operator stress at overloaded stations. Line needed to absorb 30% volume increase.",
    solution: "Built FlexSim model capturing all assembly tasks with accurate time studies. Analyzed task precedence constraints and rebalanced work content across stations. Validated new configuration through simulation before implementation.",
    process: [
      { title: "Time Studies", content: "Conducted detailed time studies of all assembly tasks with video analysis." },
      { title: "Precedence Analysis", content: "Documented task dependencies and flexibility for reassignment." },
      { title: "Simulation Model", content: "Built FlexSim model of current state with validated cycle times." },
      { title: "Rebalancing", content: "Developed optimized task allocation meeting takt time requirements." },
      { title: "Validation", content: "Simulated proposed configuration and validated improvements." }
    ],
    results: [
      "Station utilization balanced to 80-85% range",
      "Line capacity increased 30% meeting volume target",
      "Operator ergonomic scores improved at previously overloaded stations",
      "Implementation completed within 2-day line shutdown"
    ],
    technologies: ["FlexSim", "Line Balancing", "Time Study", "Ergonomics", "Lean Manufacturing"],
    lessons: ["Video-based time study improves accuracy", "Ergonomic consideration prevents operator fatigue issues"]
  },
  {
    id: 112,
    slug: "cnc-fixture-design",
    title: "Fixture Design for CNC Machining",
    subtitle: "Quick-change fixture system for high-mix production",
    duration: "6 weeks",
    client: "Precision Machining Job Shop",
    role: "Tooling Designer",
    overview: "Designed a modular fixture system for CNC machining of a family of automotive parts. The system featured quick-change capability to reduce setup time and improve spindle utilization for high-mix, low-volume production.",
    challenge: "The shop was spending 2 hours per setup change limiting machine utilization to 45%. Parts family had similar features but varying sizes requiring flexible fixturing. Clamping forces needed precise control to avoid part distortion.",
    solution: "Designed modular fixture base with hydraulic clamping using PTC Creo. Created interchangeable locating modules for different part variants. Calculated clamping forces to avoid distortion while ensuring secure holding during machining.",
    process: [
      { title: "Part Analysis", content: "Analyzed part family for common features and locating datum requirements." },
      { title: "Fixture Architecture", content: "Designed modular base concept with interchangeable locating elements." },
      { title: "Clamping Design", content: "Selected hydraulic clamps with force calculations for each part variant." },
      { title: "Detailed Design", content: "Created complete fixture assembly with all components and specifications." },
      { title: "Validation", content: "Verified fixture clearance and tool accessibility through CAM simulation." }
    ],
    results: [
      "Setup time reduced from 2 hours to 15 minutes",
      "Machine utilization improved from 45% to 72%",
      "Part dimensional accuracy improved through reduced distortion",
      "ROI achieved within 6 months of implementation"
    ],
    technologies: ["PTC Creo", "Fixture Design", "Hydraulic Clamping", "CNC Machining", "DFM"],
    lessons: ["Modular fixture design pays off for high-mix production", "Force calculations prevent part distortion issues"]
  },
  {
    id: 113,
    slug: "pdm-configuration",
    title: "Product Data Management System",
    subtitle: "Windchill PDM configuration for engineering document control",
    duration: "8 weeks",
    client: "Industrial Machinery OEM",
    role: "PDM Administrator",
    overview: "Configured PTC Windchill PDM system for engineering document management. The project included lifecycle setup, approval workflows, access controls, and CAD integration for seamless document check-in/check-out.",
    challenge: "Engineering had no formal document control system with files stored on individual workstations. Version control was manual leading to frequent use of obsolete drawings. Customer audits identified document control as a major nonconformance.",
    solution: "Deployed Windchill PDM with tailored lifecycles and workflows matching engineering processes. Configured Creo integration for automatic check-in of CAD files. Established folder structures and naming conventions for organized storage.",
    process: [
      { title: "Requirements", content: "Documented engineering processes and document types requiring control." },
      { title: "System Design", content: "Designed lifecycles, workflows, and access control matrix." },
      { title: "Configuration", content: "Configured Windchill objects, attributes, and automation rules." },
      { title: "Integration", content: "Set up Creo integration and configured workspace synchronization." },
      { title: "Training", content: "Developed training materials and conducted sessions for all users." }
    ],
    results: [
      "100% of engineering drawings under revision control",
      "Drawing approval time reduced from 5 days to 1 day",
      "Customer audit finding closed with compliant system",
      "25 engineers trained and using system daily"
    ],
    technologies: ["PTC Windchill", "PDM", "Document Control", "Workflow Design", "CAD Integration"],
    lessons: ["User-friendly workflows improve adoption rates", "Naming conventions are critical for searchability"]
  },
  {
    id: 114,
    slug: "suspension-design",
    title: "Automotive Suspension Design",
    subtitle: "Double wishbone system with kinematic optimization",
    duration: "14 weeks",
    client: "Sports Car Manufacturer",
    role: "Chassis Designer",
    overview: "Designed a double wishbone front suspension system using Siemens NX. The project included kinematic analysis to optimize geometry for handling characteristics, and FEA to validate component durability under various loading conditions.",
    challenge: "The suspension needed to achieve specific camber and toe curves during wheel travel for optimal handling. Packaging constraints limited design space. Components required validation for durability over 150,000 km equivalent testing.",
    solution: "Used Siemens NX with kinematic simulation to optimize pickup point locations. Performed parametric studies to achieve target camber and toe characteristics. Validated all components through FEA for static and fatigue loading conditions.",
    process: [
      { title: "Target Setting", content: "Defined kinematic targets for camber, toe, and roll center based on vehicle dynamics requirements." },
      { title: "Geometry Optimization", content: "Optimized pickup point locations through parametric kinematic studies." },
      { title: "Component Design", content: "Designed wishbones, uprights, and steering components for packaging and strength." },
      { title: "FEA Validation", content: "Performed stress and fatigue analysis for all loading conditions." },
      { title: "Documentation", content: "Created complete drawing package for prototype manufacturing." }
    ],
    results: [
      "Achieved target camber curve within ±0.1° through wheel travel",
      "Roll center location optimized for handling balance",
      "All components validated for 150,000 km durability",
      "Prototype testing confirmed kinematic predictions"
    ],
    technologies: ["Siemens NX", "Kinematics", "Suspension Design", "FEA", "Vehicle Dynamics"],
    lessons: ["Kinematic simulation saves significant prototype iterations", "Early packaging integration prevents design conflicts"]
  },
  {
    id: 115,
    slug: "packaging-line-simulation",
    title: "Packaging Line Simulation",
    subtitle: "End-of-line automation validation saving $200K in modifications",
    duration: "4 weeks",
    client: "Beverage Manufacturer",
    role: "Simulation Engineer",
    overview: "Developed FlexSim simulation of proposed end-of-line packaging system including case packer, palletizer, and stretch wrapper. The simulation validated equipment specifications and identified integration issues before equipment purchase.",
    challenge: "The client was investing $2M in new packaging equipment and needed validation of vendor throughput claims. Integration of equipment from three different suppliers created timing uncertainty. Layout changes during construction made early validation critical.",
    solution: "Built detailed FlexSim model based on vendor specifications and equipment data sheets. Simulated various product mix scenarios to validate throughput. Identified timing conflicts and buffer requirements before equipment installation.",
    process: [
      { title: "Data Collection", content: "Gathered equipment specifications, cycle times, and product data from vendors." },
      { title: "Model Building", content: "Created accurate simulation of all packaging equipment and material flow." },
      { title: "Scenario Testing", content: "Tested product mix scenarios and failure recovery conditions." },
      { title: "Issue Identification", content: "Identified integration issues and developed solutions." },
      { title: "Recommendations", content: "Presented findings with specific equipment and control modifications." }
    ],
    results: [
      "Identified palletizer integration issue before installation",
      "Recommended buffer modifications prevented $200K in field changes",
      "Validated throughput capability for all product scenarios",
      "Equipment installation completed on schedule"
    ],
    technologies: ["FlexSim", "Packaging Simulation", "Equipment Validation", "Integration Analysis"],
    lessons: ["Vendor specifications often miss integration details", "Simulation ROI is highest during design phase"]
  },
  {
    id: 116,
    slug: "motor-housing-design",
    title: "Electric Motor Housing Design",
    subtitle: "Thermal-optimized aluminum casting for industrial drives",
    duration: "6 weeks",
    client: "Electric Motor Manufacturer",
    role: "Product Designer",
    overview: "Designed an aluminum die-cast motor housing with optimized thermal performance. The project included CFD analysis for cooling fin optimization, structural analysis for mounting loads, and DFM review for die casting process.",
    challenge: "The motor generated 500W of heat requiring efficient dissipation to maintain winding temperature below 155°C. Housing needed IP55 rating while allowing for heat rejection. Die casting process constraints limited wall thicknesses and draft angles.",
    solution: "Used SolidWorks with thermal simulation to optimize fin geometry and spacing. Designed housing with proper draft angles and radii for die casting. Specified appropriate surface treatments and sealing features for IP55 rating.",
    process: [
      { title: "Thermal Requirements", content: "Calculated heat dissipation needs based on motor efficiency and operating conditions." },
      { title: "Fin Optimization", content: "Performed CFD studies to optimize fin height, spacing, and orientation." },
      { title: "Structural Design", content: "Designed mounting features and verified structural adequacy under loads." },
      { title: "DFM Review", content: "Reviewed design with die caster for manufacturability and tool feasibility." },
      { title: "Documentation", content: "Created casting drawings with dimensional tolerances and surface specifications." }
    ],
    results: [
      "Achieved winding temperature of 145°C, 10°C below limit",
      "IP55 rating verified through independent testing",
      "Casting yield achieved 98% in production",
      "Unit cost met target through DFM optimization"
    ],
    technologies: ["SolidWorks", "CFD", "Thermal Design", "Die Casting", "IP Rating"],
    lessons: ["Fin spacing is as important as fin height for thermal performance", "Early DFM review prevents costly tool modifications"]
  }
];

export const getArticleBySlug = (slug: string): ArticleContent | undefined => {
  return articleContents.find(article => article.slug === slug);
};

export const getArticleById = (id: number): ArticleContent | undefined => {
  return articleContents.find(article => article.id === id);
};