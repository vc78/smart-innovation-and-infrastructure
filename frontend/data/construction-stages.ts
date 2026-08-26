// Centralized Data Architecture for SIID Construction Workflow Stages
export interface StageExample {
  projectName: string
  buildingType: string
  plotDimensions?: string
  builtUpArea?: string
  beforeState: string
  afterState: string
  highlights: string[]
  calculationsOrSpecs?: { label: string; value: string }[]
}

export interface ConstructionStage {
  id: string
  step: number
  title: string
  tagline: string
  category: string
  shortSummary: string
  heroImage: string
  whyItMatters: string
  inputs: { title: string; desc: string; icon?: string }[]
  activities: { stepNum: string; title: string; desc: string }[]
  tools: { name: string; category: string; description: string }[]
  outputs: { title: string; desc: string; type: "document" | "model" | "report" | "compliance" }[]
  example: StageExample
  keyChecks: string[]
  stakeholders: string[]
  estimatedTimeline: string
  commonRisks: { risk: string; mitigation: string }[]
  prevStageId: string | null
  nextStageId: string | null
}

export const CONSTRUCTION_STAGES: ConstructionStage[] = [
  {
    id: "site-survey",
    step: 1,
    title: "Site Survey & Requirements",
    tagline: "Transforming real-world site conditions into accurate project intelligence.",
    category: "Site Intelligence",
    shortSummary: "Comprehensive topographical elevation surveys, soil bearing capacity testing, boundary verification, and local zoning constraint mapping.",
    heroImage: "/images/construction-site-survey-equipment.jpg",
    whyItMatters: "92% of construction delays and foundation rework originate from unverified site topography or poor soil classification. Accurate baseline intelligence protects your budget from day one.",
    inputs: [
      { title: "Boundary & Cadastral Records", desc: "Official land registry documents and deed coordinates." },
      { title: "Soil Stratigraphy Data", desc: "Core sample borehole logs and safe bearing capacity (SBC)." },
      { title: "Topography & Contours", desc: "Elevation gradients, natural drainage paths, and slope vectors." },
      { title: "Zoning & Setback Rules", desc: "Municipal FAR, setback limits, and height restrictions." },
      { title: "Utility Ingress Points", desc: "Stormwater mains, 3-phase grid transformer, and water supply." },
      { title: "Client Spatial Program", desc: "BHK configuration, parking capacity, and accessibility needs." },
    ],
    activities: [
      { stepNum: "01", title: "GNSS Boundary Georeferencing", desc: "Total station & RTK-GPS survey capturing mm-level corner coordinates and setback offsets." },
      { stepNum: "02", title: "Geotechnical Core Drilling", desc: "Sub-surface soil sampling to establish water table depth and 180–240 kN/m² bearing capacity." },
      { stepNum: "03", title: "Drone Photogrammetry & LiDAR", desc: "3D point-cloud reconstruction of adjacent structures, trees, and overhead power cables." },
      { stepNum: "04", title: "Vastu & Solar Ingress Assessment", desc: "Cardinal orientation measurement for sunlight path and wind trajectory audit." },
      { stepNum: "05", title: "Digital Site Model Generation", desc: "Ingesting raw point data into SIID's parametric engine to generate the digital terrain model." },
    ],
    tools: [
      { name: "Electronic Total Station", category: "Surveying", description: "Leica TS16 for high-precision angular and distance measurements." },
      { name: "RTK-GPS Rover & Base", category: "Geodetic", description: "Centimeter-accurate satellite boundary pinning." },
      { name: "Survey Drone (LiDAR)", category: "Aerial Mapping", description: "DJI Matrice with optical LiDAR for point cloud contour mapping." },
      { name: "SIID Terrain Ingestor", category: "Parametric AI", description: "Automated digital terrain model (DTM) builder." },
      { name: "Standard Penetration Test (SPT)", category: "Geotechnical", description: "Dynamic soil resistance measuring apparatus." },
    ],
    outputs: [
      { title: "Digital Terrain Model (DTM)", desc: "3D mesh surface with 0.5m elevation contour lines.", type: "model" },
      { title: "Geotechnical Soil Borehole Report", desc: "Certified SBC rating and foundation recommendation.", type: "report" },
      { title: "Zoning & Setback Constraint Envelope", desc: "Buildable footprint polygon conforming to municipal FAR.", type: "compliance" },
      { title: "Project Requirements Document (PRD)", desc: "Structured architectural brief with room-by-room area targets.", type: "document" },
    ],
    example: {
      projectName: "Cyber View Residences",
      buildingType: "G+2 Luxury Villa (3,850 sq.ft)",
      plotDimensions: "40' × 60' East-Facing Plot",
      builtUpArea: "3,850 sq.ft across 3 levels",
      beforeState: "Unlevel 2,400 sq.ft plot with 1.4m natural slope towards rear and undocumented high-tension line proximity.",
      afterState: "Digitized 3D terrain envelope, optimized stepped plinth beam level (+0.6m from road), and 100% compliant municipal setbacks.",
      highlights: [
        "Identified 180 kN/m² hard gravel stratum at 2.2m depth.",
        "Saved ₹1.8 Lakh in excess excavation through cut-and-fill balancing.",
        "Solar ingress analysis oriented living areas for 38% reduced HVAC load.",
      ],
      calculationsOrSpecs: [
        { label: "Safe Bearing Capacity (SBC)", value: "210 kN/m²" },
        { label: "Water Table Depth", value: "8.4m below GL" },
        { label: "Permissible Ground Coverage", value: "62.5% (1,500 sq.ft)" },
        { label: "Municipal FAR Ratio", value: "1.75 Approved" },
      ],
    },
    keyChecks: [
      "Confirm boundary diagonals match revenue sketch within ±15mm tolerance.",
      "Verify minimum 3m front and 1.5m side municipal setback offsets.",
      "Check sub-soil organic content (< 3%) and sulfate contamination levels.",
      "Inspect stormwater discharge gradient to prevent site waterlogging.",
    ],
    stakeholders: ["Land Surveyor", "Geotechnical Engineer", "Principal Architect", "Client / Land Owner"],
    estimatedTimeline: "3 to 6 Days",
    commonRisks: [
      { risk: "Undetected subterranean boulders or loose fill", mitigation: "Minimum 2 boreholes per 2,000 sq.ft plot before structural sign-off." },
      { risk: "Discrepancy with neighbor compound walls", mitigation: "DGPS tie-in to city benchmark pillars." },
    ],
    prevStageId: null,
    nextStageId: "concept-design",
  },
  {
    id: "concept-design",
    step: 2,
    title: "Concepts & Floor Plans",
    tagline: "Turn verified site parameters into intelligent, parametric architectural blueprints.",
    category: "AI Design & BIM",
    shortSummary: "Algorithmic room layouts, double-height spatial ergonomics, Vastu-compliant flow, and real-time 3D parametric massing models.",
    heroImage: "/images/architectural-floor-plan-blueprint.jpg",
    whyItMatters: "Early design decisions lock in 80% of total lifecycle building costs. Parametric design allows instant iteration without weeks of manual drafting.",
    inputs: [
      { title: "Survey DTM Mesh", desc: "Digital terrain contour mesh and buildable boundary envelope." },
      { title: "Family Lifestyle Brief", desc: "Bedrooms, home office, prayer room, and terrace entertainment." },
      { title: "Vastu Shastra Preferences", desc: "Orientation matrix for master bedroom (SW), kitchen (SE), and water source (NE)." },
      { title: "Budget Classification", desc: "Material tier targeting (Moderate, Premium, or Ultra-Luxury)." },
    ],
    activities: [
      { stepNum: "01", title: "Parametric Layout Generation", desc: "SIID neural engine synthesizes 4 layout variations optimized for ventilation and daylight." },
      { stepNum: "02", title: "Vastu Matrix Scoring", desc: "Automated scoring of room placements against ancient 16-zone directional rules." },
      { stepNum: "03", title: "3D Volumetric Massing", desc: "Translating 2D lines into real-time 3D models with floor-to-ceiling heights and slab overhangs." },
      { stepNum: "04", title: "Daylight & Thermal Simulation", desc: "Calculating Lux levels and solar heat coefficient across window fenestrations." },
      { stepNum: "05", title: "Collaborative Design Review", desc: "Interactive 3D client walkthrough with real-time room dimension tuning." },
    ],
    tools: [
      { name: "SIID Neural Floorplanner", category: "AI Generative", description: "BIM layout generator with instant room dimension calculation." },
      { name: "3D WebGL Engine", category: "Visualization", description: "Browser-based ray-traced spatial viewer with dynamic lighting." },
      { name: "Vastu Compliance Auditor", category: "Compliance", description: "Automated cardinal alignment and scoring algorithm." },
      { name: "Climate Studio / Daylight Sim", category: "Physics", description: "Solar orientation and shadow analysis engine." },
    ],
    outputs: [
      { title: "Architectural 2D Blueprint Set", desc: "Dimensioned floor plans, section cuts, and exterior elevation drawings.", type: "document" },
      { title: "Parametric 3D BIM Model", desc: "LOD 200 spatial model with material layers and wall assemblies.", type: "model" },
      { title: "Vastu Compliance Scorecard", desc: "Certified 94%+ compliance report detailing elemental zone mapping.", type: "report" },
      { title: "Daylight & Energy Report", desc: "Window-to-wall ratio (WWR) and natural illumination index.", type: "report" },
    ],
    example: {
      projectName: "The Courtyard Pavilion",
      buildingType: "G+2 Contemporary Villa (4,200 sq.ft)",
      beforeState: "Traditional cramped 4BHK with dark interior hallways and unvented kitchen.",
      afterState: "Open-plan layout with central landscaped courtyard, 14ft double-height living room, and 98% Vastu alignment.",
      highlights: [
        "4 distinct AI design variations generated in under 120 seconds.",
        "Internal temperatures reduced by 3.2°C through passive cross-ventilation.",
        "Saved 45 sq.ft of wasted circulation corridors into usable master walk-in wardrobe.",
      ],
      calculationsOrSpecs: [
        { label: "Carpet Area Efficiency", value: "84.2% of Super Built-Up" },
        { label: "Natural Daylight Coverage", value: "91% daytime hours" },
        { label: "Vastu Audit Score", value: "96 / 100" },
        { label: "Floor-to-Ceiling Height", value: "3.35m (11'-0\")" },
      ],
    },
    keyChecks: [
      "Validate minimum hallway width >= 1.05m and staircase tread/riser (275mm / 150mm).",
      "Ensure master bedroom positioned in South-West quadrant for optimal stability.",
      "Check kitchen cooktop faces East for Vastu Agni element compliance.",
      "Verify structural grid lines are aligned for economical column spans (< 6.5m).",
    ],
    stakeholders: ["Principal Architect", "Vastu Specialist", "Interior Designer", "Client"],
    estimatedTimeline: "5 to 10 Days",
    commonRisks: [
      { risk: "Excessive design iterations delaying timeline", mitigation: "Parametric 3D walkthroughs for instant client consensus." },
      { risk: "Unbuildable cantilever spans increasing cost", mitigation: "Early structural span checker embedded in floorplan generator." },
    ],
    prevStageId: "site-survey",
    nextStageId: "approvals-boq",
  },
  {
    id: "approvals-boq",
    step: 3,
    title: "Approvals & Deterministic BOQ",
    tagline: "Secure municipal building permits and lock in itemized material quantity pricing.",
    category: "Cost & Approvals",
    shortSummary: "Automated municipal drawing production, statutory authority sanctions, and bill of quantities computed down to every steel bar and cement bag.",
    heroImage: "/images/building-permit-approval-documents.jpg",
    whyItMatters: "Unplanned material escalation causes 70% of project budget overruns. A deterministic BOQ gives absolute financial clarity before groundbreaking.",
    inputs: [
      { title: "Approved Concept Blueprints", desc: "LOD 200 architectural CAD/BIM drawing files." },
      { title: "Municipal Byelaws & Master Plan", desc: "GHMC / HMDA / BDA specific building sanction checklists." },
      { title: "Live Market Material Index", desc: "Real-time regional prices for TMT 550D rebar, OPC 53 cement, and aggregates." },
      { title: "Contractor Rate Cards", desc: "Itemized civil labor, shuttering, and MEP subcontract rates." },
    ],
    activities: [
      { stepNum: "01", title: "Sanction Drawing Formatting", desc: "Auto-formatting CAD layers, setback color codes, and area tables for online municipal portals." },
      { stepNum: "02", title: "Statutory Sanction Submission", desc: "Filing structural stability affidavit, fire NOC exemption, and building permit application." },
      { stepNum: "03", title: "Deterministic Quantity Takeoff", desc: "Extracting volume measurements for concrete, steel tonnage, brickwork, and plastering." },
      { stepNum: "04", title: "Market Rate Ingestion", desc: "Applying current mill prices and transport logistics to itemized material schedules." },
      { stepNum: "05", title: "Cash Flow & Milestone Schedule", desc: "Binding material procurement milestones to civil construction stages." },
    ],
    tools: [
      { name: "SIID BOQ Engine", category: "Cost Intelligence", description: "Parametric bill of quantities calculator with live price feeds." },
      { name: "Municipal Auto-Sanction Script", category: "Compliance", description: "Automated municipal drawing layout and FAR validation tool." },
      { name: "Material Price Tracker", category: "Market Data", description: "Live commodity price monitoring for cement, steel, and sand." },
    ],
    outputs: [
      { title: "Municipal Sanction Permit Set", desc: "Official signed approval drawings with sanction license.", type: "compliance" },
      { title: "Deterministic Bill of Quantities (BOQ)", desc: "Line-item schedule with 140+ material items and labor costs.", type: "report" },
      { title: "Project Cash Flow Milestone Plan", desc: "Month-by-month financial disbursement roadmap.", type: "document" },
      { title: "Tender Package for Contractors", desc: "Standardized bid package for transparent contractor comparison.", type: "document" },
    ],
    example: {
      projectName: "Greenwood Villa",
      buildingType: "G+2 Residential (3,600 sq.ft)",
      beforeState: "Estimated project budget between ₹75L - ₹95L with undefined cost escalation buffer.",
      afterState: "Fixed deterministic BOQ of ₹78.42 Lakhs with locked material pricing and GHMC building permit cleared in 14 days.",
      highlights: [
        "Quantified exact requirement: 1,420 cement bags and 11.2 Tons of Fe 550D TMT steel.",
        "Saved ₹3.4 Lakhs by bulk-contracting steel at pre-escalation quarterly pricing.",
        "Zero municipal rejection queries due to auto-checked setback code rules.",
      ],
      calculationsOrSpecs: [
        { label: "Total Estimated Civil Cost", value: "₹46.20 Lakhs" },
        { label: "Finishes & MEP Budget", value: "₹32.22 Lakhs" },
        { label: "Steel Consumption Rate", value: "3.85 kg / sq.ft" },
        { label: "Cement Consumption Rate", value: "0.39 bags / sq.ft" },
      ],
    },
    keyChecks: [
      "Ensure building height does not exceed 10m road-width permissible ratio.",
      "Check rainwater harvesting pit capacity conforms to local green building mandates.",
      "Verify structural engineer registration with municipal authority for structural stability endorsement.",
      "Confirm 10% contingency buffer allocated for unpredicted subterranean anomalies.",
    ],
    stakeholders: ["Licensed Municipal Liaison Architect", "Quantity Surveyor (QS)", "Civil Contractor", "Structural Engineer"],
    estimatedTimeline: "12 to 20 Days",
    commonRisks: [
      { risk: "Municipal sanction delay due to missing land clearance documents", mitigation: "Automated pre-filing compliance scanner." },
      { risk: "Steel and cement commodity price inflation", mitigation: "Direct procurement contracts with authorized distributors." },
    ],
    prevStageId: "concept-design",
    nextStageId: "structural-engineering",
  },
  {
    id: "structural-engineering",
    step: 4,
    title: "Foundation & Structure",
    tagline: "High-precision seismic engineering, reinforced foundation framing, and load vectors.",
    category: "Structural Engineering",
    shortSummary: "Detailed column-beam schedules, finite element seismic stress simulations, rebar bending schedules (BBS), and high-grade concrete casting.",
    heroImage: "/images/building-foundation-concrete-construction.jpg",
    whyItMatters: "The skeleton of your building must resist decades of gravity loads, seismic tremors, and wind shear forces. Flawless structural design guarantees life-safety.",
    inputs: [
      { title: "Geotechnical SBC Soil Report", desc: "Sub-surface strata bearing strength and water table depth." },
      { title: "Approved Architectural BIM", desc: "Floor geometry, wall heights, and dead load distribution." },
      { title: "Seismic Zone Classification", desc: "Regional seismic zone (Zone II, III, or IV) and wind pressure (39 m/s)." },
      { title: "Live Load Design Criteria", desc: "IS 875 residential (2.0 kN/m²) and terrace assembly loads." },
    ],
    activities: [
      { stepNum: "01", title: "3D Finite Element Analysis (FEA)", desc: "Simulating bending moments, shear forces, and joint deflections under combined load states." },
      { stepNum: "02", title: "Foundation System Design", desc: "Designing isolated trapezoidal footings with tie-beams or raft slab according to soil strata." },
      { stepNum: "03", title: "Bar Bending Schedule (BBS) Generation", desc: "Detailed rebar cut lengths, crank angles, and lap splice locations for Fe 550D steel." },
      { stepNum: "04", title: "Substructure Excavation & PCC", desc: "Earthwork excavation, anti-termite treatment, and 1:4:8 plain cement concrete bed casting." },
      { stepNum: "05", title: "Superstructure Column & Slab Casting", desc: "Reinforced column cage fixing, M25 grade concrete pouring, and mandatory 28-day curing cycle." },
    ],
    tools: [
      { name: "STAAD.Pro / ETABS Integration", category: "FEA Engine", description: "3D frame structural analysis and dynamic modal response." },
      { name: "SIID Rebar Optimizer", category: "Structural BIM", description: "Automated Bar Bending Schedule (BBS) generator minimizing steel scrap." },
      { name: "Ultrasonic Rebar Cover Meter", category: "Site QA", description: "Non-destructive verification of 25mm/40mm concrete cover depth." },
      { name: "Schmidt Rebound Hammer", category: "Testing", description: "In-situ compressive strength testing of cured concrete elements." },
    ],
    outputs: [
      { title: "Structural Good-for-Construction (GFC) Set", desc: "Foundation layout, column sections, beam schedules, and slab reinforcement.", type: "document" },
      { title: "Automated Bar Bending Schedule (BBS)", desc: "Exact steel cutting and bending sheets ready for steel yard fabrication.", type: "document" },
      { title: "Cube Test Compressive Strength Reports", desc: "7-day and 28-day laboratory crushing strength results for M25/M30 concrete.", type: "report" },
      { title: "Structural Stability Certification", desc: "Registered Structural Engineer stamped safety guarantee.", type: "compliance" },
    ],
    example: {
      projectName: "Hilltop Vista Residence",
      buildingType: "G+2 Reinforced Concrete Framed Structure",
      beforeState: "Complex 5.8m cantilever balcony requiring expensive heavy steel truss retrofitting.",
      afterState: "Optimized post-tensioned beam design utilizing high-yield Fe 550D rebar with zero structural columns obstructing car parking.",
      highlights: [
        "Steel scrap reduced from industry average 8% down to 2.1% using SIID BBS optimizer.",
        "M25 concrete achieved 29.4 N/mm² 28-day strength exceeding design requirement.",
        "Seismic Zone III ductile detailing with 135° seismic cross-ties on all columns.",
      ],
      calculationsOrSpecs: [
        { label: "Concrete Grade (Columns/Slabs)", value: "M25 (1:1:2 Ready-Mix)" },
        { label: "Steel Specification", value: "Fe 550D Primary Rebar" },
        { label: "Footing Depth below NGL", value: "2.1 meters into hard murrum" },
        { label: "Max Column Deflection", value: "3.2mm (well within L/500 limit)" },
      ],
    },
    keyChecks: [
      "Verify 40mm clear cover for footings, 40mm for columns, 25mm for beams, and 20mm for slabs.",
      "Check column lap splice positions are located in the middle-third zone with staggered laps.",
      "Inspect shuttering formwork alignment, plumb, and propping support stability before pour.",
      "Ensure minimum 14 days wet water ponding / hessian curing for all structural slabs.",
    ],
    stakeholders: ["Chartered Structural Engineer", "Site Civil Engineer", "Reinforcement Contractor", "Ready-Mix Concrete Supplier"],
    estimatedTimeline: "35 to 55 Days",
    commonRisks: [
      { risk: "Honeycombing and void formation in congested column joints", mitigation: "High-frequency needle vibrators and self-compacting concrete mixes." },
      { risk: "Early stripping of slab formwork causing structural micro-cracks", mitigation: "Strict 14-day minimum prop-retention rule enforced by site engineer." },
    ],
    prevStageId: "approvals-boq",
    nextStageId: "services-routing",
  },
  {
    id: "services-routing",
    step: 5,
    title: "Smart MEP & Services Routing",
    tagline: "Intelligent mechanical, electrical, and plumbing conduit routing with zero clash.",
    category: "MEP Engineering",
    shortSummary: "3D BIM spatial coordination of electrical circuits, 3-phase power distribution, sanitary drainage falls, water supply pressure lines, and HVAC ducts.",
    heroImage: "/images/electrical-plumbing-hvac-installation.jpg",
    whyItMatters: "Post-construction chasing of walls to fix plumbing leaks or missed electrical points ruins finishes and weakens masonry. Pre-planned 3D MEP eliminates rework.",
    inputs: [
      { title: "Structural GFC Drawings", desc: "Beam drop depths, column locations, and sleeve penetration points." },
      { title: "Interior Electrical Load Brief", desc: "HVAC tonnage, EV fast charger (7.4 kW), induction hob, and solar inverter capacity." },
      { title: "Water Supply & Pressure Demand", desc: "Hydro-pneumatic booster pump capacity and solar water heater sizing." },
      { title: "Sanitary Drainage Gradients", desc: "1:40 pipe falls for sewage and greywater line separation." },
    ],
    activities: [
      { stepNum: "01", title: "3D MEP Clash Detection", desc: "Running automated clash checks between plumbing drain lines, electrical conduits, and structural beams." },
      { stepNum: "02", title: "Electrical Circuit Sizing & Panel Schedules", desc: "Calculating voltage drop, MCB/RCCB sizing, and dedicated circuits for heavy inductive loads." },
      { stepNum: "03", title: "Plumbing Loop & Drainage Layout", desc: "Dual-pipe plumbing design (potable water + treated flushing water) with cleanout traps." },
      { stepNum: "04", title: "Concealed Conduit & Pipe Installation", desc: "Chasing brickwork with groove-cutters and embedding FR-LSH grade electrical conduits." },
      { stepNum: "05", title: "Hydrostatic Pressure & Continuity Testing", desc: "Pressurizing water supply lines to 10 bar for 24 hours to guarantee leak-free joints." },
    ],
    tools: [
      { name: "SIID MEP Router", category: "Algorithmic BIM", description: "Automated shortest-path conduit routing with regulatory clearance checks." },
      { name: "Hydrostatic Pipe Pressure Tester", category: "Plumbing QA", description: "10-bar hydraulic testing unit for CPVC and UPVC joint integrity." },
      { name: "Digital Insulation Multimeter", category: "Electrical QA", description: "Megger tester for earth resistance (< 1 Ohm) and circuit continuity." },
      { name: "Laser Level & Inclinometer", category: "Sanitary", description: "Self-leveling laser for precise 1:40 sewage pipe slope verification." },
    ],
    outputs: [
      { title: "Integrated MEP Clash-Free Coordination Model", desc: "3D federated BIM model combining civil, electrical, and plumbing layers.", type: "model" },
      { title: "Electrical Distribution Board (DB) Schedule", desc: "Circuit-by-circuit breaker chart with phase balancing.", type: "document" },
      { title: "Plumbing Schematic & Isometric Drawings", desc: "Pipe diameter sizing, valve manifolds, and drainage stack layouts.", type: "document" },
      { title: "Hydrostatic & Earth Continuity Test Certificate", desc: "Signed site testing report certifying zero leaks and grounded electricals.", type: "report" },
    ],
    example: {
      projectName: "Aura Smart Residence",
      buildingType: "G+2 Smart Home with Home Automation",
      beforeState: "Conventional manual MEP installation resulting in 18 structural beam puncture clashes and inadequate EV charger wiring.",
      afterState: "Zero structural penetrations using designated pre-cast slab sleeves, concealed CAT6 + KNX automation conduits, and 100% leak-proof CPVC lines.",
      highlights: [
        "Eliminated 14 potential beam clashes during 3D simulation before masonry commenced.",
        "Hydrostatic pressure tested to 10 kg/cm² for 24 hours with zero pressure drop.",
        "Balanced 3-phase load to within 4.5% variance across all R-Y-B phases.",
      ],
      calculationsOrSpecs: [
        { label: "Connected Electrical Load", value: "18.5 kW (3-Phase 415V)" },
        { label: "Earth Resistance Reading", value: "0.78 Ohms (Safe < 1.0)" },
        { label: "Plumbing Pressure Test", value: "10 Bar sustained 24 hrs" },
        { label: "Drainage Fall Gradient", value: "1:40 (25mm per 1m run)" },
      ],
    },
    keyChecks: [
      "Ensure minimum 300mm horizontal separation between electrical conduits and water supply pipes.",
      "Check chemical earthing pit resistance is strictly under 1.0 Ohm.",
      "Verify dual-trap water seals installed on all floor drains to prevent sewer gas backflow.",
      "Confirm all electrical wires are 100% Flame Retardant Low Smoke Halogen (FR-LSH) copper.",
    ],
    stakeholders: ["MEP Consultant", "Licensed Electrical Contractor", "Plumbing Specialist", "Home Automation Engineer"],
    estimatedTimeline: "18 to 28 Days",
    commonRisks: [
      { risk: "Future plumbing pinhole leak inside tiled walls", mitigation: "10-bar 24-hour hydrostatic testing + ASTM SDR-11 certified CPVC fittings." },
      { risk: "Electrical short circuit from overloaded neutrals", mitigation: "Dedicated neutral wires for each circuit with RCCB shock prevention." },
    ],
    prevStageId: "structural-engineering",
    nextStageId: "interior-finishes",
  },
  {
    id: "interior-finishes",
    step: 6,
    title: "Interior Architecture & Fit-Out",
    tagline: "Turn concrete spaces into luxurious, functional living environments with precision craftsmanship.",
    category: "Interior Fit-Out",
    shortSummary: "Gypsum false ceilings, bespoke modular joinery, Italian marble/vitrified flooring, acoustic insulation, architectural lighting, and premium paint finishes.",
    heroImage: "/images/interior-finishing-painting-flooring.jpg",
    whyItMatters: "Finishes represent what you see, touch, and live with every day. High-precision alignment, seamless transitions, and durable materials define long-term comfort.",
    inputs: [
      { title: "Interior Design Elevation Sheets", desc: "Detailed 2D carpentry joinery drawings and false ceiling levels." },
      { title: "Material Palette Specs", desc: "Veneer samples, Italian marble slabs, quartz countertops, and hardware brands." },
      { title: "Lighting Lux & Lumens Plan", desc: "3000K warm white ambient fixtures, anti-glare COB downlights, and cove LEDs." },
      { title: "Plastering Quality Surface Sign-Off", desc: "Laser-straight 90-degree right-angle plastered walls ready for primer." },
    ],
    activities: [
      { stepNum: "01", title: "Sub-Floor Levelling & Waterproofing", desc: "Applying 2-coat elastomeric waterproofing in all wet areas followed by 72-hour pond testing." },
      { stepNum: "02", title: "Large-Format Tile & Stone Laying", desc: "Laying 1200×1800mm porcelain tiles / marble with 2mm leveling spacers and epoxy grout." },
      { stepNum: "03", title: "Gypsum False Ceiling Grid Framing", desc: "Installing GI metal frame suspended ceiling with cove lighting troughs and AC return diffusers." },
      { stepNum: "04", title: "Modular Kitchen & Millwork Carpentry", desc: "Precision factory-manufactured marine-grade HDHMR cabinets with soft-close Blum hinges." },
      { stepNum: "05", title: "Multi-Coat Premium Paint Application", desc: "1 coat alkali-resistant primer, 2 coats acrylic putty sanding, and 2 coats luxury PU/Emulsion paint." },
    ],
    tools: [
      { name: "360° Multi-Line Laser Level", category: "Alignment", description: "Bosch GLL 3-80 for mm-level tile alignment and ceiling level datum lines." },
      { name: "Pinless Moisture Meter", category: "Paint QA", description: "Verifying wall substrate moisture (< 12%) before painting." },
      { name: "Airless Paint Spray Station", category: "Finishing", description: "Uniform high-gloss and ultra-matte spray application without roller marks." },
      { name: "Pneumatic Brad Nailer & Clamp Set", category: "Carpentry", description: "Heavy-duty pneumatic joinery assembly." },
    ],
    outputs: [
      { title: "Complete Interior As-Built Drawing Set", desc: "Final dimensioned drawings of all bespoke furniture, kitchens, and wardrobes.", type: "document" },
      { title: "Material Warranty & Maintenance Dossier", desc: "Authenticity certificates for stone, hardware, laminate, and paint warranties.", type: "document" },
      { title: "Wet-Area Waterproofing 10-Year Guarantee", desc: "Certified guarantee covering bathrooms, balconies, and utility wash areas.", type: "compliance" },
      { title: "Acoustic & Lux Level Audit Report", desc: "Verified ambient lighting and sound dampening ratings.", type: "report" },
    ],
    example: {
      projectName: "Skyline Penthouse Loft",
      buildingType: "G+2 Luxury Duplex Interior (4,100 sq.ft)",
      beforeState: "Bare concrete shell with exposed MEP conduits and uneven 18mm floor variations.",
      afterState: "Seamless Italian Bottochino marble flooring with mirror polish, custom fluted charcoal acoustic paneling, and German-engineered modular kitchen.",
      highlights: [
        "Zero floor hollows detected across 4,100 sq.ft using automated laser screeding.",
        "Moisture levels tested at 8.2% before paint application, guaranteeing zero peeling.",
        "Modular kitchen installed with 0.5mm tolerances and 100% moisture-resistant HDHMR.",
      ],
      calculationsOrSpecs: [
        { label: "Flooring Level Tolerance", value: "< 1.5mm variation over 3m" },
        { label: "Wall Moisture Index", value: "8.2% (Passed < 12% rule)" },
        { label: "Ambient Lighting Rating", value: "350 Lux in Work Areas" },
        { label: "Formaldehyde Emission Grade", value: "E0 / E1 Certified Boards" },
      ],
    },
    keyChecks: [
      "Verify 72-hour water ponding test passed in all bathrooms before tile installation.",
      "Check tile joints are completely filled with water-resistant epoxy grout.",
      "Ensure all cabinet doors and drawers close flush without binding or misalignment.",
      "Verify light fixtures provide 3000K–4000K CRI > 90 for natural color rendering.",
    ],
    stakeholders: ["Interior Architect", "Master Joiner / Carpenter", "Flooring Specialist", "Painting Contractor"],
    estimatedTimeline: "30 to 50 Days",
    commonRisks: [
      { risk: "Paint bubbling or flaking due to trapped wall moisture", mitigation: "Moisture meter testing mandatory before applying putty coats." },
      { risk: "Tile hollow sounds / debonding over time", mitigation: "100% adhesive buttering on tile back using C2TE high-polymer adhesive." },
    ],
    prevStageId: "services-routing",
    nextStageId: "qa-inspection",
  },
  {
    id: "qa-inspection",
    step: 7,
    title: "Quality Audit & Compliance",
    tagline: "Rigorous 180-point multi-disciplinary inspection to certify flawless execution.",
    category: "Quality Assurance",
    shortSummary: "Thermal imaging leak audits, electrical circuit safety testing, acoustic isolation checks, plumb/squareness laser sweeps, and snags rectification.",
    heroImage: "/images/building-quality-inspection-handover.jpg",
    whyItMatters: "Discovering minor defects before moving in prevents costly repairs later. An independent QA audit guarantees that your building meets every promised standard.",
    inputs: [
      { title: "Contractual Specification Schedule", desc: "Approved material brand manifests, BOQ line items, and tolerances." },
      { title: "GFC Architectural & Structural Sets", desc: "As-built reference drawings and room dimension specs." },
      { title: "MEP Testing Records", desc: "Prior plumbing pressure logs and earthing resistance values." },
      { title: "Contractor Snag List Draft", desc: "Internal punch list of items needing final touch-ups." },
    ],
    activities: [
      { stepNum: "01", title: "Thermal Imaging Enclosure Audit", desc: "Infrared thermal cameras inspect external walls, windows, and roof slabs for thermal bridges and hidden moisture leaks." },
      { stepNum: "02", title: "Laser 3D Surface & Plumb Scan", desc: "Checking verticality of all doors, windows, walls, and tile levels against tolerance thresholds." },
      { stepNum: "03", title: "Electrical Safety & Load Stress Test", desc: "Full-load stress testing for 4 hours; checking thermal hotspots in DB panels with infrared thermography." },
      { stepNum: "04", title: "Acoustic & Airflow CFM Verification", desc: "Measuring bathroom exhaust CFM extraction rate and door sound attenuation." },
      { stepNum: "05", title: "Snag Logging & Rectification Tracking", desc: "Tagging punch-list items with photo coordinates for immediate contractor rectification." },
    ],
    tools: [
      { name: "FLIR Thermal Imaging Camera", category: "Thermal Inspection", description: "High-resolution thermal camera detecting hidden leaks and insulation voids." },
      { name: "Laser Disto & Plumb Inclinometer", category: "Dimensional QA", description: "Sub-millimeter accurate room dimension and verticality verification." },
      { name: "Anemometer & Airflow Hood", category: "HVAC QA", description: "Measuring air velocity and CFM output from vents and exhaust fans." },
      { name: "SIID Digital Snag Engine", category: "QA Tracking", description: "Cloud-synced photo punch list manager with automatic sign-offs." },
    ],
    outputs: [
      { title: "180-Point Comprehensive QA Audit Report", desc: "Exhaustive category-by-category score sheet with pass/fail benchmarks.", type: "report" },
      { title: "Thermal Leak & Insulation Audit Map", desc: "Infrared imaging report certifying zero envelope thermal breaks or leaks.", type: "report" },
      { title: "Verified Snag Resolution Sign-Off", desc: "Before-and-after photo log certifying 100% punch-list closure.", type: "compliance" },
      { title: "Structural & Fire Safety Compliance Certificate", desc: "Final engineering sign-off on structural and fire egress clearances.", type: "compliance" },
    ],
    example: {
      projectName: "The Palms Villa 12",
      buildingType: "G+2 Residential Villa (3,900 sq.ft)",
      beforeState: "Initial inspection revealed 37 minor snags including 2 unsealed window weep holes and a loose DB neutral terminal.",
      afterState: "100% of snags rectified in 48 hours; certified 98.6% overall QA compliance score with zero thermal leaks.",
      highlights: [
        "Thermal scan identified and fixed a hidden AC drain drip before ceiling closure.",
        "Electrical DB thermography verified maximum terminal temperature remained under 38°C at full load.",
        "Water flow rate calibrated to exactly 6.0 LPM across all aerated fixtures for green compliance.",
      ],
      calculationsOrSpecs: [
        { label: "Overall Quality Score", value: "98.6% (Pass Threshold > 95%)" },
        { label: "Total Snags Detected / Resolved", value: "37 / 37 (100% Closed)" },
        { label: "DB Panel Max Temperature", value: "36.4°C (Safe limit < 55°C)" },
        { label: "Window Air Infiltration", value: "0.04 CFM/sq.ft (Class A)" },
      ],
    },
    keyChecks: [
      "Verify all electrical RCCB safety trips operate within 30 milliseconds under simulated test fault.",
      "Check all window and sliding door gaskets achieve 100% watertight seal against heavy simulated spray.",
      "Inspect roof waterproofing slope directs 100% water to rainwater downspouts with zero ponding.",
      "Confirm all door locks, hinges, and handles operate smoothly with zero rattle or friction.",
    ],
    stakeholders: ["Certified QA/QC Lead Auditor", "Principal Structural Engineer", "Project Director", "Client"],
    estimatedTimeline: "5 to 8 Days",
    commonRisks: [
      { risk: "Unresolved snags delaying move-in date", mitigation: "Digital punch-list with automated SMS alerts and contractor SLA penalties." },
      { risk: "Hidden plumbing leaks behind tiled vanity counters", mitigation: "Thermal imaging combined with acoustic leak detectors." },
    ],
    prevStageId: "interior-finishes",
    nextStageId: "handover",
  },
  {
    id: "handover",
    step: 8,
    title: "Certified Project Handover",
    tagline: "Receive your keys, digital BIM twin, warranties, and official occupancy clearances.",
    category: "Certified Handover",
    shortSummary: "Final municipal Occupancy Certificate (OC), digital BIM twin transfer, asset warranty dossier, deep professional cleaning, and formal key handover ceremony.",
    heroImage: "/images/building-quality-inspection-handover.jpg",
    whyItMatters: "A home is a lifetime investment. Receiving organized digital as-built records, clear operating manuals, and legal occupancy certificates ensures seamless living and high resale value.",
    inputs: [
      { title: "Completed QA Snag Sign-Off", desc: "100% certified defect rectification document." },
      { title: "As-Built Drawing Revisions", desc: "Updated architectural, MEP, and structural drawings reflecting real construction." },
      { title: "Statutory Occupancy Filing", desc: "Municipal completion notice, tax assessment, and water meter connection." },
      { title: "Equipment Vendor Warranties", desc: "Elevator, solar inverter, pump, AC, and appliance registration serials." },
    ],
    activities: [
      { stepNum: "01", title: "Municipal Occupancy Certificate (OC) Clearance", desc: "Final municipal site inspection and issuance of official legal Occupancy Certificate." },
      { stepNum: "02", title: "Digital As-Built BIM Twin Delivery", desc: "Transferring the complete digital 3D model with exact concealed pipe and wiring locations to the homeowner." },
      { stepNum: "03", title: "Comprehensive Home Asset Dossier", desc: "Consolidating all equipment warranties, paint codes, tile batch numbers, and maintenance schedules." },
      { stepNum: "04", title: "Deep Industrial Cleaning & Sanitization", desc: "Professional high-pressure cleaning, window glass buffing, and marble sealant application." },
      { stepNum: "05", title: "Formal Handover & Smart Systems Walkthrough", desc: "Personal orientation explaining home automation, water filtration, inverter backup, and key handover." },
    ],
    tools: [
      { name: "SIID Digital Twin App", category: "Homeowner Portal", description: "Mobile app with 3D X-ray view of all concealed plumbing and electrical lines." },
      { name: "Asset Warranty Vault", category: "Digital Management", description: "Centralized cloud vault storing all equipment warranties and service reminders." },
      { name: "Municipal Portal Integration", category: "Compliance", description: "Direct linkage for municipal tax assessment and OC download." },
    ],
    outputs: [
      { title: "Official Municipal Occupancy Certificate (OC)", desc: "Legal municipal clearance certifying building is fit and safe for habitation.", type: "compliance" },
      { title: "SIID Homeowner Digital Twin & As-Built Set", desc: "Complete 3D model showing exact hidden electrical and plumbing routes.", type: "model" },
      { title: "Comprehensive Warranty & Maintenance Dossier", desc: "Bound manual with all warranties, paint shades, and supplier contact lists.", type: "document" },
      { title: "Key Set & Smart Access Credentials", desc: "Master physical keys, RFID access cards, and smart lock administrator transfers.", type: "document" },
    ],
    example: {
      projectName: "Villa Serene G+2",
      buildingType: "G+2 Luxury Smart Villa (4,400 sq.ft)",
      beforeState: "Traditional disorganized handover with missing warranty cards and unknown conduit paths inside walls.",
      afterState: "Complete SIID Digital Twin delivered with official GHMC Occupancy Certificate, 10-year waterproofing warranty, and full smart home app access.",
      highlights: [
        "Homeowner can locate exact hidden water pipes using the AR phone viewer before hanging artwork.",
        "Municipal Occupancy Certificate issued in 11 days with zero pending compliance notes.",
        "Zero-hassle manufacturer warranties registered automatically across 16 major appliances.",
      ],
      calculationsOrSpecs: [
        { label: "Occupancy Certificate Status", value: "Issued & Legally Valid" },
        { label: "Structural Warranty Duration", value: "10 Years Guaranteed" },
        { label: "Waterproofing Warranty", value: "10 Years Comprehensive" },
        { label: "Digital Twin File Format", value: "Interactive 3D / IFC BIM" },
      ],
    },
    keyChecks: [
      "Confirm official municipal Occupancy Certificate (OC) is stamped and legally valid.",
      "Verify all smart home admin credentials, Wi-Fi router passwords, and cameras are transferred to the owner.",
      "Check all manufacturer warranty cards are stamped with purchase invoice dates.",
      "Ensure full set of physical master keys, terrace keys, and utility keys are tested and labeled.",
    ],
    stakeholders: ["Project Director", "Principal Architect", "Client / New Homeowner", "Municipal Building Inspector"],
    estimatedTimeline: "3 to 5 Days",
    commonRisks: [
      { risk: "Future renovation contractor accidentally drilling into hidden live wires", mitigation: "SIID 3D Digital Twin provides exact centimeter-accurate conduit coordinates." },
      { risk: "Delayed equipment warranty claims due to missing vendor invoices", mitigation: "All invoices and serial numbers preserved in SIID Asset Vault." },
    ],
    prevStageId: "qa-inspection",
    nextStageId: null,
  },
]
