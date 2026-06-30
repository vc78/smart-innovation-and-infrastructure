export const MATERIAL_DATASET = {
  meta: {
    dataset_name: "AI Project Manifest - Material & Cost Reference Dataset",
    currency: "INR",
    region: "Telangana / Andhra Pradesh",
    data_vintage: "Q2 2026",
    last_verified: "2026-06-30",
    notes:
      "City rates and material prices are aggregated from multiple verified market sources (CPWD SOR baselines, contractor quote medians, dealer price lists) as of Q2 2026. Amenity, kitchen-style and design-language figures are indicative industry estimates and should be treated as planning bands, not fixed quotes. All rates carry +/-15% variance based on site, contractor and exact specification. Recommend revalidating material prices quarterly, since cement and steel are volatile commodities.",
  },

  cities: {
    Hyderabad: {
      cost_per_sqft_inr: { economy: 1550, standard: 2000, premium: 2700, luxury: 4000 },
      seismic_zone: "II (low risk)",
      dominant_soil_profiles: ["Red Soil", "Black Cotton Soil"],
      notes:
        "Cheapest major metro for cement/aggregate due to proximity to Nalgonda/Tandur/Yerraguntla cement belt. Granite flooring locally abundant and cheap. GHMC/HMDA approvals via TG-bPASS.",
    },
    Secunderabad: {
      cost_per_sqft_inr: { economy: 1600, standard: 2050, premium: 2750, luxury: 4100 },
      seismic_zone: "II (low risk)",
      dominant_soil_profiles: ["Red Soil", "Laterite Soil"],
      notes:
        "Twin city of Hyderabad; shares the same material supply chain and labour market. Established/cantonment areas carry a small premium over outer Hyderabad.",
    },
    Vijayawada: {
      cost_per_sqft_inr: { economy: 1500, standard: 2128, premium: 2800, luxury: 3900 },
      seismic_zone: "III (moderate risk)",
      dominant_soil_profiles: ["Alluvial Soil", "Sandy Soil"],
      notes:
        "Krishna river basin alluvial belt; higher water table in low-lying zones can require deeper/pile foundations. AP material inflation trending ~5%/yr.",
    },
    Warangal: {
      cost_per_sqft_inr: { economy: 1150, standard: 1800, premium: 2900, luxury: 3800 },
      seismic_zone: "II (low risk)",
      dominant_soil_profiles: ["Red Soil", "Black Cotton Soil"],
      notes:
        "Tier-3 city; lowest labour cost of the four. Local granite quarries (Karimnagar/Khammam belt) feed Hyderabad's flooring market too. Prime areas near Fort/Bheemaram command a premium over outskirts.",
    },
  },

  materials: {
    cement_per_50kg_bag_inr: {
      "OPC 43 (Standard)": { min: 340, max: 410, avg: 375, typical_use: "General PCC/RCC up to M30, brickwork, plastering" },
      "OPC 53 (High Strength)": { min: 375, max: 430, avg: 405, typical_use: "Columns, beams, slabs - high early strength RCC work" },
      "PPC (Blended)": { min: 350, max: 390, avg: 370, typical_use: "Residential walling/RCC; lower heat of hydration, most popular for houses" },
      "PSC (Slag)": { min: 360, max: 400, avg: 380, typical_use: "Coastal/high-moisture zones (favors Vijayawada); chemical resistance" },
    },
    tmt_steel_per_kg_inr: {
      "TMT Fe415": { min: 52, max: 60, avg: 56, typical_use: "Older grade, light residential, mostly phased out" },
      "TMT Fe500": { min: 55, max: 68, avg: 60, typical_use: "Standard grade for most residential construction" },
      "TMT Fe550": { min: 58, max: 72, avg: 64, typical_use: "Heavy load/seismic zones, high-rise, premium structural builds" },
    },
    approx_consumption: {
      cement_bags_per_sqft: 0.38,
      steel_kg_per_sqft: 4.0,
    },
  },

  grade_multipliers: {
    Economy: 1.0,
    Standard: 1.0,
    Premium: 1.0,
    Luxury: 1.0,
    note: "Already baked into each city's cost_per_sqft_inr by grade above; use that table directly rather than multiplying.",
  },

  amenities_inr: {
    "home_office": { economy: 80000, standard: 150000, premium: 250000, luxury: 400000, basis: "lump sum - built-ins, electrical, AV points" },
    "pooja_room": { economy: 50000, standard: 100000, premium: 200000, luxury: 350000, basis: "lump sum - marble/wood temple unit, lighting" },
    "home_theater": { economy: 300000, standard: 600000, premium: 1500000, luxury: 2500000, basis: "lump sum - AV equipment, acoustic treatment, automation" },
    "gym": { economy: 100000, standard: 250000, premium: 500000, luxury: 1000000, basis: "lump sum - flooring, mirrors, equipment" },
    "servant_quarters": { economy: null, standard: null, premium: null, luxury: null, basis: "use city cost_per_sqft (economy/standard tier) x 100-150 sqft typical room size" },
    "terrace_garden": { economy: 150, standard: 250, premium: 400, luxury: 600, basis: "per sqft - waterproofing, planters, irrigation, decking" },
    "swimming_pool": { economy: 500000, standard: 1100000, premium: 2000000, luxury: 4000000, basis: "lump sum - RCC/FRP pool incl. filtration; scales steeply with size & finish" },
    "solar_panels": { per_kw_inr: { min: 55000, max: 85000, avg: 70000 }, typical_residential_kw: "3-5 kW", basis: "per kW installed, complete rooftop system before subsidy" },
    "smart_automation": { economy: 100000, standard: 350000, premium: 800000, luxury: 2000000, basis: "lump sum - whole-home automation points, hub, sensors" },
    "study_room": { economy: 40000, standard: 90000, premium: 180000, luxury: 300000, basis: "lump sum - shelving, desk, lighting, AC point" },
    "guest_room": { economy: null, standard: null, premium: null, luxury: null, basis: "use city cost_per_sqft x 150-200 sqft typical room size, plus 20-40% furnishing addon" },
    "ev_charging": { economy: 15000, standard: 30000, premium: 50000, luxury: 80000, basis: "lump sum - dedicated circuit + AC charger (3.3-7.4 kW), BIS-certified hardware" },
  },

  structural_compliances_inr: {
    "vastu": { min: 15000, max: 100000, basis: "consultant fee + design plan adjustments, scales with plot size" },
    "senior": { min: 50000, max: 500000, basis: "ramps, wider doors, grab bars; upper end includes a home lift" },
    "fire": { min: 25000, max: 300000, basis: "documentation + extinguishers/sprinklers; scales sharply with floor count" },
    "green": { min: 50000, max: 300000, basis: "IGBC Green Homes registration + assessment; simplified track for individual homes" },
  },

  kitchen_style_addon_inr: {
    "Straight": { min: 120000, max: 250000 },
    "L-Shaped": { min: 150000, max: 320000 },
    "Parallel": { min: 180000, max: 380000 },
    "U-Shaped": { min: 220000, max: 480000 },
    "Modular Island": { min: 300000, max: 700000 },
    basis: "lump sum for ~100 sqft modular kitchen, mid-range to premium hardware/finish",
  },

  design_language_cost_multiplier: {
    "Modern / Contemporary": 1.0,
    "Vernacular": 0.95,
    "Traditional": 1.08,
    "Mediterranean": 1.18,
    "Colonial": 1.22,
    basis: "multiplier applied to base construction cost; reflects facade complexity, woodwork, arches/columns, roofing detail",
  },

  soil_profile_foundation_factor: {
    "Red Soil": 1.0,
    "Laterite Soil": 1.03,
    "Sandy Soil": 1.12,
    "Alluvial Soil": 1.15,
    "Black Cotton Soil": 1.22,
    basis: "multiplier applied to foundation-stage cost only, not whole-building cost; expansive/loose soils need deeper footings, piling or raft foundations",
  },

  vastu_direction_note: {
    applies_to: ["North", "East", "West", "South"],
    note: "Facing direction has no direct construction-cost impact; it mainly affects layout planning (entrance, kitchen, pooja room placement) and can carry a 2-8% resale premium for North/East-facing plots in Vastu-conscious markets like Hyderabad and Vijayawada.",
  },
};
