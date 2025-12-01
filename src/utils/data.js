import { LOGOS } from "@/constants/branding";
import {
    Phone,
    ShieldCheck,
    Wrench,
    Droplets,
    Cog,
    Sun,
    Factory,
    Recycle,
    Zap,
    Building2,
    Sparkles,
} from "lucide-react";



export const CLIENTS = [
    {
        name: "Government Royapettah Hospital",
        subtitle: "Chennai, Tamil Nadu",
        logo: LOGOS.Govt_Royapettah_Hospital_Logo,
        link: "https://tnhealth.tn.gov.in/",
        projects: [
            {
                heading: "Nephrology Department",
                description: "Installed RO plant systems for Nephrology units ensuring high-purity water for dialysis operations.",
                count: "1000 LPH × 3 units",
            },
            {
                heading: "Surgical and Cancer Blocks",
                description: "Commissioned independent RO units for Surgical and Cancer blocks to support medical equipment.",
                count: "1000 LPH × 2 units",
            },
            {
                heading: "Medical & Biochemistry Labs",
                description: "Setup RO systems for Biochemistry (500 LPH) and Medical Common Ward (1000 LPH).",
                count: "2 units",
            },
            {
                heading: "IMCH – Terrace & 1st Floor",
                description: "Installed RO systems for maternal and child health labs to maintain laboratory water standards.",
                count: "1000 LPH (Terrace) + 500 LPH (1st Floor)",
            },
        ],
    },
    {
        name: "Commissioner of Police, Egmore",
        subtitle: "Chennai – 600008",
        logo: LOGOS.COP_Egmore_Logo,
        link: "https://chennaipolice.gov.in/",
        projects: [
            {
                heading: "RO Plant Installation",
                description: "Supplied and installed industrial RO system for the Egmore Police Commissioner’s Office.",
                count: "1500 LPH",
            },
            {
                heading: "Maintenance & Quality Check",
                description: "Provides regular AMC for consistent output and water quality compliance.",
                count: "Ongoing",
            },
        ],
    },
    {
        name: "Anna University",
        subtitle: "Guindy, Chennai",
        logo: LOGOS.Anna_University_Logo,
        link: "https://www.annauniv.edu/",
        projects: [
            {
                heading: "RO System Network",
                description: "Installed multiple capacity RO systems across departments and laboratories.",
                count: "500, 250, 1000 LPH units",
            },
            {
                heading: "Water Quality Maintenance",
                description: "Monthly service and water testing for university-wide distribution lines.",
                count: "5 buildings covered",
            },
        ],
    },
    {
        name: "Government Peripheral Hospital",
        subtitle: "West Jafferkhanpet, Chennai",
        logo: LOGOS.GOVT_Peripheral_Hospital_Logo,
        link: "https://tnhealth.tn.gov.in/",
        projects: [
            {
                heading: "Hospital RO Systems",
                description: "Installed RO plants for critical departments including kitchen, pediatric, male, and female wards.",
                count: "1000 LPH × 7 units",
            },
            {
                heading: "Supplementary Units",
                description: "Additional compact RO systems for smaller wards and nursing sections.",
                count: "500 LPH × 2 units",
            },
        ],
    },
    {
        name: "Sathyabama University",
        subtitle: "Jeppiaar Nagar, Chennai",
        logo: LOGOS.Satyabhama_University_Logo,
        link: "https://www.sathyabama.ac.in/",
        projects: [
            {
                heading: "Campus-wide RO Setup",
                description: "Installed centralized RO plants for hostel, academic, and canteen facilities.",
                count: "Multiple 1000 LPH systems",
            },
            {
                heading: "Regular Servicing",
                description: "Handles water quality checks and preventive maintenance every quarter.",
                count: "Annual Contract",
            },
        ],
    },
    {
        name: "House of Hiranandani, OMR",
        subtitle: "Egattur, Chennai",
        logo: LOGOS.House_of_Hiranandani_Logo,
        link: "https://www.houseofhiranandani.com/",
        projects: [
            {
                heading: "STP Plant Setup",
                description: "Installed 400 KLD Sewage Treatment Plant for residential complex wastewater management.",
                count: "400 KLD",
            },
            {
                heading: "Operation & Maintenance",
                description: "End-to-end operation and maintenance of STP for water recycling and discharge control.",
                count: "Ongoing O&M",
            },
        ],
    },
    {
        name: "ICON Select by Bhagini, Mahadevapura",
        subtitle: "Bengaluru, Karnataka",
        logo: LOGOS.Icon_Bhagini_Logo,
        link: "https://bhagini.com/icon-select-hotel/",
        projects: [
            {
                heading: "RO and Softener Installation",
                description: "Installed dual RO systems and water softener plants to ensure high-quality water for hospitality operations.",
                count: "1000 LPH, 250 LPH, 200 KLD softener",
            },
            {
                heading: "AMC Services",
                description: "Comprehensive annual maintenance including water testing, filter replacement, and performance tuning.",
                count: "Ongoing contract",
            },
        ],
    },
    {
        name: "The Pride Hotel Bangalore",
        subtitle: "Richmond Rd, Bengaluru",
        logo: LOGOS.Pride_Hotel_Logo,
        link: "https://www.pridehotel.com/",
        projects: [
            {
                heading: "RO and STP Plant Installation",
                description: "Installed 850 LPH RO system and 100 KLD STP for full water treatment and recycling within hotel operations.",
                count: "RO 850 LPH + STP 100 KLD",
            },
            {
                heading: "Water Network Maintenance",
                description: "Handles operation, inspection, and compliance for wastewater and drinking water systems.",
                count: "Ongoing",
            },
        ],
    },
    {
        name: "Butterfly Gandhimathi Appliances Ltd",
        subtitle: "Pudupakkam, Kelambakkam",
        logo: LOGOS.Butterfly_Logo,
        link: "https://butterflyindia.com/",
        projects: [
            {
                heading: "HVAC Installation – Split AC",
                description: "Installed energy-efficient split air conditioning systems for office and manufacturing zones.",
                count: "7 units (16.5 Ton package units)",
            },
            {
                heading: "HVAC Installation – Duct AC",
                description: "Implemented duct AC systems across production areas ensuring uniform cooling.",
                count: "42 units",
            },
            {
                heading: "Maintenance & Service Support",
                description: "Provides periodic HVAC service and system health checks for all installed units.",
                count: "Quarterly schedule",
            },
        ],
    },
    {
        name: "Bharath Heavy Electricals Ltd",
        subtitle: "Vizagh, Andhra Pradesh",
        logo: LOGOS.BHEL_Logo,
        link: "https://www.bhel.com/",
        projects: [
            {
                heading: "STP Plant Setup",
                description: "Installed 1 Million Liters per Day(MLD) Sewage Treatment Plant for residential complex wastewater management.",
                count: "1 MLD",
            },
            {
                heading: "Operation & Maintenance",
                description: "End-to-end operation and maintenance of STP for water recycling and discharge control.",
                count: "Ongoing O&M",
            },
        ],
    },
];

export const CITIES = ["Chennai", "Bangalore", "Delhi", "Hyderabad", "Mumbai"];


export const SERVICES = [
    {
        id: 'ac-services',
        title: 'AC Services',
        icon: Wrench,
        summary:
            'End-to-end AC repair, servicing & maintenance across India with quick turnaround and standardized quality.',
        bullets: [
            "Evaporator & condenser coil cleaning",
            "Refrigerant checks & leak fix",
            "Annual Maintenance Contracts (AMC)",
        ],
        details: {
            deliverables: [
                'Evaporator & condenser coil cleaning',
                'Refrigerant checks & leak fix',
                'Annual Maintenance Contracts (AMC)',
            ],
            typicalTimeline: 'Same-day servicing available',
            sla: '24–48 hour response time',
            compliance: 'Certified HVAC technicians ensuring safety and standards.',
        },
    },
    {
        id: 'commercial-ac',
        title: 'Commercial AC Services',
        icon: Building2,
        summary:
            'Design, install, and maintain high-performance cooling for offices, hotels, hospitals, factories & data centers.',
          bullets: ["VRF/VRV expertise", "Energy optimization", "Breakdown & preventive care"],
            details: {
            deliverables: ['VRF/VRV expertise', 'Energy optimization', 'Breakdown & preventive care'],
            typicalTimeline: '3–30 days depending on project size',
            sla: '24–72 hour business response',
            compliance: 'Adheres to commercial HVAC compliance & safety codes.',
        },
    },
    {
        id: 'ro-plants',
        title: 'RO Plants',
        icon: Droplets,
        summary:
            'Reverse Osmosis plants for drinking & process water — design, install, and upkeep for reliable purity.',
                bullets: ["Membrane descaling", "Biofouling removal", "Flow & purity restoration"],
            details: {
            deliverables: ['Membrane descaling', 'Biofouling removal', 'Flow & purity restoration'],
            typicalTimeline: '1–8 weeks depending on capacity',
            sla: 'Quality check reports after every service',
            compliance: 'Meets water purity & industrial standards.',
        },
    },
    {
        id: 'wtp',
        title: 'Water Treatment Plants (WTP)',
        icon: Recycle,
        summary:
            'Convert contaminated water into usable water for safe consumption & utility applications.',
                bullets: ["Kitchen, bath & utility reuse", "Quality compliance", "Operations support"],
            details: {
            deliverables: ['Kitchen, bath & utility reuse', 'Quality compliance', 'Operations support'],
            typicalTimeline: '2–12 weeks',
            sla: 'Routine inspection & maintenance support',
            compliance: 'Follows all water reuse and quality regulations.',
        },
    },
    {
        id: 'etp',
        title: 'Effluent Treatment Plants (ETP)',
        icon: Factory,
        summary:
            'Turnkey ETP projects: design, supply, erection, commissioning, upgrades & maintenance.',
               bullets: ["Process engineering", "AMC & troubleshooting", "PLC/automation upgrades"],
            details: {
            deliverables: ['Process engineering', 'AMC & troubleshooting', 'PLC/automation upgrades'],
            typicalTimeline: '1–6 months',
            sla: 'Dedicated project engineers assigned',
            compliance: 'Meets industrial effluent discharge standards.',
        },
    },
    {
        id: 'stp',
        title: 'Sewage Treatment Plants (STP)',
        icon: Recycle,
        summary:
            'End-to-end STP solutions for residential, commercial & industrial clients with compliance assurance.',
                bullets: ["Operator training", "Performance optimization", "SCADA integration"],
            details: {
            deliverables: ['Operator training', 'Performance optimization', 'SCADA integration'],
            typicalTimeline: '2–10 months',
            sla: 'Performance audits & remote support',
            compliance: 'Adheres to environmental and discharge regulations.',
        },
    },
    {
        id: 'lift-escalator',
        title: 'Lift & Escalator',
        icon: Cog,
        summary:
            'Installation, modernization & maintenance for elevators and escalators tailored to your building.',
         bullets: ["High-speed lifts", "Freight elevators", "Safety inspection & AMCs"],
            details: {
            deliverables: ['High-speed lifts', 'Freight elevators', 'Safety inspection & AMCs'],
            typicalTimeline: '3–20 weeks',
            sla: '24/7 emergency breakdown support',
            compliance: 'Follows lift & safety board regulations.',
        },
    },
    {
        id: 'inverter-generator',
        title: 'Inverter & Generator',
        icon: Zap,
        summary:
            'Installation, repair & AMC for inverters and DG sets (5–1000 kVA) with complete electrical integration.',
             bullets: ["Load testing", "Overhauling & spares", "Emergency breakdown service"],
            details: {
            deliverables: ['Load testing', 'Overhauling & spares', 'Emergency breakdown service'],
            typicalTimeline: '1–14 days',
            sla: '4–12 hour emergency response',
            compliance: 'Certified electrical and generator technicians.',
        },
    },
    {
        id: 'solar',
        title: 'Solar Systems',
        icon: Sun,
        summary:
            'End-to-end solar solutions: survey, design, installation, net-metering, and proactive maintenance.',
                bullets: ["Performance monitoring", "Battery & hybrid options", "Upgrades & expansion"],
            details: {
            deliverables: ['Performance monitoring', 'Battery & hybrid options', 'Upgrades & expansion'],
            typicalTimeline: '3–10 weeks',
            sla: 'Net-metering & subsidy guidance',
            compliance: 'Follows DISCOM regulations & safety standards.',
        },
    },
    {
        id: 'chemical-washing',
        title: 'Chemical Washing',
        icon: Sparkles,
        summary:
            'Specialized chemical cleaning for HVAC coils, RO systems & industrial equipment to restore efficiency.',
           bullets: ["Scale & rust removal", "Bio-growth control", "Energy cost reduction"],
            details: {
            deliverables: ['Scale & rust removal', 'Bio-growth control', 'Energy cost reduction'],
            typicalTimeline: '1–5 days',
            sla: 'Certified chemical handling experts',
            compliance: 'Follows hazardous material handling standards.',
        },
    },
];

export const FEATURES = [
    { icon: ShieldCheck, title: "Vetted Experts", text: "Hand-picked partners, trained & insured for safety and reliability." },
    { icon: Wrench, title: "Standardized Quality", text: "Documented SOPs & QA checks for consistent service delivery." },
    { icon: Phone, title: "Pan‑India Support", text: "Quick-response teams across major metros and beyond." },
];


