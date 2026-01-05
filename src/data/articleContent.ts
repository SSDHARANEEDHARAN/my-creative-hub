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
    subtitle: "End-of-line automation validation saving $200K in modifications",
    duration: "4 weeks",
    client: "Beverage Manufacturer - Coca-Cola India",
    role: "Simulation Engineer",
    industry: "Beverage Packaging",
    teamSize: "3 Engineers",
    overview: "Developed FlexSim simulation of proposed end-of-line packaging system including case packer, palletizer, and stretch wrapper for a new PET bottle line. The simulation validated equipment specifications and identified integration issues before equipment purchase, potentially saving ₹1.5 Cr in field modifications.",
    challenge: "The client was investing ₹15 Cr in new packaging equipment and needed validation of vendor throughput claims of 400 cases/hour. Integration of equipment from 3 different suppliers (case packer from Italy, palletizer from Germany, wrapper from India) created timing uncertainty. Layout changes during building construction made early validation critical. Line needed to handle 6 SKU variants with different case configurations.",
    solution: "Built detailed FlexSim model based on vendor specifications and equipment data sheets from all 3 suppliers. Simulated various product mix scenarios and failure recovery conditions to validate throughput. Identified timing conflicts and buffer requirements before equipment installation. Presented findings to enable contract modifications.",
    process: [
      { title: "Data Collection", content: "Gathered equipment specifications, cycle times, and product data from 3 vendors. Obtained 6 months of production schedule data for demand patterns." },
      { title: "Model Building", content: "Created accurate simulation of all packaging equipment including case packer (2 lanes), palletizer (layer forming), and wrapper. Modeled product routing for 6 SKU variants." },
      { title: "Validation", content: "Validated model against vendor FAT test data achieving 98% accuracy on cycle times." },
      { title: "Scenario Testing", content: "Tested 15 product mix scenarios, 5 failure scenarios, and 8 recovery conditions." },
      { title: "Issue Identification", content: "Identified palletizer integration issue - layer forming conflicting with case packer output timing during SKU changeover." },
      { title: "Recommendations", content: "Presented findings with specific buffer size recommendations and control logic modifications. Negotiated contract changes with vendors." }
    ],
    results: [
      "Identified palletizer integration issue before installation - timing conflict during changeover",
      "Recommended buffer modifications prevented ₹1.5 Cr in estimated field changes",
      "Validated throughput capability of 420 cases/hour for all product scenarios (exceeding 400 target)",
      "Changeover procedure optimized reducing time from 30 to 18 minutes",
      "Equipment installation completed on schedule with zero integration surprises",
      "Line achieved target OEE of 85% within 2 weeks of commissioning"
    ],
    technologies: ["FlexSim 2023", "Packaging Simulation", "Equipment Validation", "Integration Analysis", "OEE Modeling"],
    toolsUsed: ["FlexSim Professional", "Excel (data analysis)", "AutoCAD (layouts)", "Power BI (reporting)"],
    keyMetrics: [
      { value: "420", label: "Cases/Hour Validated" },
      { value: "₹1.5Cr", label: "Savings Identified" },
      { value: "6 SKU", label: "Variants Modeled" },
      { value: "85%", label: "OEE Achieved" }
    ],
    lessons: ["Vendor specifications often miss integration details - independent validation is essential", "Simulation ROI is highest during design phase when changes are cheap", "Multi-vendor integration requires careful interface definition"]
  },
  {
    id: 116,
    slug: "motor-housing-design",
    title: "Electric Motor Housing Design",
    subtitle: "Thermal-optimized aluminum casting for industrial drives",
    duration: "6 weeks",
    client: "Electric Motor Manufacturer - ABB India",
    role: "Product Designer",
    industry: "Industrial Motors",
    teamSize: "3 Engineers",
    overview: "Designed an aluminum die-cast motor housing with optimized thermal performance for a 22kW industrial motor. The project included CFD analysis for cooling fin optimization, structural analysis for mounting loads, and DFM review for high-pressure die casting process. The motor is designed for continuous duty in 45°C ambient.",
    challenge: "The motor generated 800W of heat at full load requiring efficient dissipation to maintain winding temperature below Class F limit (155°C). Housing needed IP55 rating while allowing for heat rejection through natural convection. Die casting process constraints limited wall thicknesses (3-8mm range) and draft angles (minimum 1.5°). Cost target required single-cavity die casting tool.",
    solution: "Used SolidWorks with FloEFD for thermal CFD simulation to optimize fin geometry through 20 design iterations. Designed housing with proper draft angles, radii (minimum 2mm), and wall transitions for die casting. Specified appropriate surface treatments (chromate conversion coating) and sealing features for IP55 rating.",
    process: [
      { title: "Thermal Requirements", content: "Calculated heat dissipation needs based on motor efficiency (92%) at 22kW. Target: maintain winding at 145°C with 45°C ambient and 800W heat generation." },
      { title: "Fin Optimization", content: "Performed 20 CFD studies varying fin height (20-40mm), spacing (8-15mm), and orientation. Optimized for natural convection heat transfer coefficient." },
      { title: "Structural Design", content: "Designed foot mounting for 4-point bolt pattern. Verified structural adequacy for 2g vibration loading per IEC 60034-14." },
      { title: "DFM Review", content: "Reviewed design with 2 die casters. Incorporated feedback on draft angles, ejector locations, and gate positioning for minimum porosity." },
      { title: "IP55 Design", content: "Designed shaft seal, cable entry, and junction box interfaces for IP55 rating. Specified gasket materials and compression requirements." },
      { title: "Documentation", content: "Created casting drawings with dimensional tolerances (CT8 per ISO 8062) and surface specifications. Included machining drawings for critical interfaces." }
    ],
    results: [
      "Achieved winding temperature of 142°C, 13°C below 155°C limit at full load",
      "IP55 rating verified through independent testing (TÜV SÜD) first attempt",
      "Casting yield achieved 97% in trial production (50 pieces)",
      "Unit casting cost met target of ₹4,200 through DFM optimization",
      "Weight reduction of 8% vs. previous design through fin optimization",
      "Tool cost reduced 15% through single-cavity design with optimized runner system"
    ],
    technologies: ["SolidWorks 2023", "FloEFD", "Thermal Design", "Die Casting", "IP Rating", "CFD"],
    toolsUsed: ["SolidWorks Premium", "FloEFD", "SolidWorks Simulation", "MAGMA (casting simulation)", "Teamcenter"],
    keyMetrics: [
      { value: "142°C", label: "Winding Temperature" },
      { value: "IP55", label: "Protection Rating" },
      { value: "97%", label: "Casting Yield" },
      { value: "8%", label: "Weight Reduction" }
    ],
    lessons: ["Fin spacing is as important as fin height for natural convection thermal performance", "Early DFM review with die caster prevents costly tool modifications", "CFD iteration is essential for thermal optimization - 20 runs found optimum that hand calculations would miss"]
  }
];

export const getArticleBySlug = (slug: string): ArticleContent | undefined => {
  return articleContents.find(article => article.slug === slug);
};

export const getArticleById = (id: number): ArticleContent | undefined => {
  return articleContents.find(article => article.id === id);
};
