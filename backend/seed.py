"""Idempotent seed script to populate curated Indian Standards and initial Procurement Analyses."""

import asyncio
from datetime import datetime
from lib.db import client, db, ensure_indexes
from seed_extra import EXTRA_STANDARDS

STANDARDS_DATA = [
    {
        "id": "std-is-10322-5-3",
        "code": "IS 10322 (Part 5/Sec 3): 2012",
        "title": "Luminaires - Particular Requirements - Luminaires for Road and Street Lighting",
        "category": "Electrotechnical",
        "technical_committee": "ETD 24 Illumination Engineering and Luminaires",
        "ics_code": "29.140.40",
        "status": "current",
        "reaffirmation_year": 2022,
        "gazetted_date": "2012-08-15",
        "qco_mandatory": True,
        "scope": "Specifies requirements for road and street lighting luminaires for use with tungsten filament, tubular fluorescent and other discharge lamps, and LED light sources on supply voltages not exceeding 1000 V. Covers mechanical construction, thermal endurance, ingress protection (IP66/IP65), wind resistance, and vibration withstand.",
        "why_recommended_template": "Directly governs mechanical construction, IP66 optical sealing, thermal management, and vibration testing for outdoor municipal and highway luminaires.",
        "key_clauses": [
            {
                "clause_no": "Clause 6.2",
                "clause_title": "Degree of Ingress Protection",
                "requirement_summary": "Luminaires shall have a degree of protection against ingress of dust, solid objects and moisture not less than IP65 or IP66.",
                "test_method": "IS/IEC 60529 Dust Chamber and High-Pressure Water Jet Test",
                "tolerance_limit": "Zero dust penetration into optical chamber; zero water penetration into live electrical terminals.",
            },
            {
                "clause_no": "Clause 9.1",
                "clause_title": "Thermal Endurance & Operating Temp",
                "requirement_summary": "Operates under elevated ambient temperatures up to 45°C/50°C without component degradation.",
                "test_method": "IS 10322 (Part 1) Clause 12.1 Heating Chamber Test",
                "tolerance_limit": "Winding and capacitor temperature rise <= 60°C above maximum rated ambient.",
            },
            {
                "clause_no": "Clause 12.3",
                "clause_title": "Impact Resistance (IK Rating)",
                "requirement_summary": "Housing and optical lens must withstand mechanical shock impacts without shattering or breach.",
                "test_method": "Spring hammer / pendulum impact test per IS/IEC 62262",
                "tolerance_limit": "IK08 rating (5.0 Joules impact energy) withstand with zero fragmentation.",
            },
            {
                "clause_no": "Clause 14.2",
                "clause_title": "Earthing and Terminal Clearances",
                "requirement_summary": "Protective earthing terminal must be brass or corrosion-resistant alloy with locking washer.",
                "test_method": "Earth continuity resistance test at 25 A current",
                "tolerance_limit": "Earth continuity resistance <= 0.5 Ohm.",
            },
        ],
        "test_methods": [
            {"name": "Ingress Protection (IP66) Test", "method_standard": "IS/IEC 60529: 2001", "frequency": "Type Test & Lot Verification", "mandatory": True},
            {"name": "Thermal Endurance Cycling Test", "method_standard": "IS 10322 (Part 1) Clause 12", "frequency": "Type Test (500 hrs)", "mandatory": True},
            {"name": "Vibration and Windage Test", "method_standard": "IS 10322 (Part 5/Sec 3)", "frequency": "Type Test", "mandatory": True},
            {"name": "Dielectric Voltage Withstand Test", "method_standard": "IS 10322 (Part 1)", "frequency": "Routine Test (100% units)", "mandatory": True},
        ],
        "amendments": [
            {"amendment_no": "Amendment No. 1", "date": "2016-04-10", "summary": "Incorporated specific requirements for solid-state LED luminaires and CCT tolerances.", "status": "Active"},
            {"amendment_no": "Amendment No. 2", "date": "2021-11-20", "summary": "Updated surge protection test references to 10kV SPD and enhanced IK08 criteria.", "status": "Active"},
        ],
        "related_standards": [
            {"code": "IS 16107 (Part 2/Sec 1): 2012", "title": "LED Luminaires - Performance Requirements", "relation_type": "Complementary Performance Standard"},
            {"code": "IS 15885 (Part 2/Sec 13): 2012", "title": "Electronic Controlgear for LED Modules", "relation_type": "Sub-component Safety Standard"},
            {"code": "IS/IEC 60529: 2001", "title": "Degrees of Protection Provided by Enclosures (IP Code)", "relation_type": "Test Method Standard"},
        ],
        "keywords": ["street lighting", "led luminaire", "roadway lighting", "ip66", "ik08", "illumination", "outdoor lighting", "cct", "thd", "etd 24"],
    },
    {
        "id": "std-is-16107-2-1",
        "code": "IS 16107 (Part 2/Sec 1): 2012",
        "title": "Single-Capped LED Lamps and Luminaires - Performance Requirements",
        "category": "Electrotechnical",
        "technical_committee": "ETD 24 Illumination Engineering",
        "ics_code": "29.140.40",
        "status": "current",
        "reaffirmation_year": 2023,
        "gazetted_date": "2012-09-01",
        "qco_mandatory": True,
        "scope": "Specifies the performance requirements for LED luminaires for general lighting services, including luminous flux, luminaire efficacy, correlated colour temperature (CCT), colour rendering index (CRI), chromaticity coordinates, lumen maintenance (L70), and life testing.",
        "why_recommended_template": "Specifies photometric performance benchmarks including luminous efficacy (>120 lm/W), color rendering index (CRI > 70), and lumen maintenance (L70 at 50,000 hours).",
        "key_clauses": [
            {
                "clause_no": "Clause 7.2",
                "clause_title": "Initial Luminous Efficacy",
                "requirement_summary": "The measured initial luminous efficacy shall not be less than the declared rating (e.g. >= 120 lm/W).",
                "test_method": "Integrating sphere spectroradiometer or Goniophotometer test per IS 16106",
                "tolerance_limit": "Minimum 90% of declared value across all sample test batches.",
            },
            {
                "clause_no": "Clause 8.3",
                "clause_title": "Colour Rendering Index (CRI) and CCT",
                "requirement_summary": "General Colour Rendering Index (Ra) shall be >= 70 for road lighting, CCT tolerance within 5-step MacAdam ellipse.",
                "test_method": "Spectral power distribution measurement",
                "tolerance_limit": "CRI Ra >= 70; CCT within declared nominal bin +/- 350K.",
            },
            {
                "clause_no": "Clause 9.1",
                "clause_title": "Lumen Maintenance (L70 Life)",
                "requirement_summary": "LED luminaire shall maintain at least 70% of initial lumen output at rated life (50,000 hours).",
                "test_method": "Accelerated 6,000-hour operational life burn-in test per IES LM-80 / TM-21",
                "tolerance_limit": "Depreciation <= 30% at rated operating hours.",
            },
        ],
        "test_methods": [
            {"name": "Photometric Luminous Flux Test", "method_standard": "IS 16106: 2012", "frequency": "Type & Batch Test", "mandatory": True},
            {"name": "Lumen Maintenance Accelerated Test", "method_standard": "IS 16107 / LM-80", "frequency": "Type Test (6,000 hrs)", "mandatory": True},
        ],
        "amendments": [
            {"amendment_no": "Amendment No. 1", "date": "2019-02-15", "summary": "Aligned test methodology with revised CIE and IES standards for solid state lighting.", "status": "Active"}
        ],
        "related_standards": [
            {"code": "IS 10322 (Part 5/Sec 3): 2012", "title": "Road and Street Lighting Luminaires", "relation_type": "Safety Standard Pair"},
            {"code": "IS 16103 (Part 1): 2012", "title": "LED Modules for General Lighting", "relation_type": "Component Specification"},
        ],
        "keywords": ["luminous efficacy", "lumens per watt", "cri", "cct", "macadam ellipse", "lumen maintenance", "l70", "led performance"],
    },
    {
        "id": "std-is-15885-2-13",
        "code": "IS 15885 (Part 2/Sec 13): 2012",
        "title": "Lamp Controlgear - Particular Requirements for DC or AC Supplied Electronic Controlgear for LED Modules",
        "category": "Electrotechnical",
        "technical_committee": "ETD 24 Illumination Engineering",
        "ics_code": "29.140.99",
        "status": "current",
        "reaffirmation_year": 2022,
        "gazetted_date": "2012-07-20",
        "qco_mandatory": True,
        "scope": "Specifies safety requirements for electronic controlgear (LED drivers) for use on DC supplies up to 250 V and AC supplies up to 1000 V at 50 Hz/60 Hz. Covers insulation resistance, overvoltage withstand, short circuit protection, and thermal protection.",
        "why_recommended_template": "Mandates electrical safety, overvoltage withstand (up to 380V), galvanic isolation, and short-circuit protection for LED drivers.",
        "key_clauses": [
            {
                "clause_no": "Clause 14.1",
                "clause_title": "Abnormal Operating Conditions",
                "requirement_summary": "Driver shall withstand 120% continuous overvoltage and shorted output terminals without flame or dielectric failure.",
                "test_method": "Short-circuit and 380V overvoltage test for 4 hours",
                "tolerance_limit": "No smoke, fire, or live part exposure; auto-recovery upon fault removal.",
            },
            {
                "clause_no": "Clause 17.2",
                "clause_title": "Dielectric Strength and High Voltage Withstand",
                "requirement_summary": "Insulation between input and output must withstand 2.5 kV AC RMS for 60 seconds.",
                "test_method": "High-voltage breakdown tester",
                "tolerance_limit": "Zero flashover, zero dielectric breakdown (leakage current < 5mA).",
            },
        ],
        "test_methods": [
            {"name": "Dielectric Withstand Voltage Test", "method_standard": "IS 15885 (Part 1)", "frequency": "Routine Test (100%)", "mandatory": True},
            {"name": "Overvoltage & Surge Immunity Test", "method_standard": "IS 15885 / IS 16107", "frequency": "Type Test", "mandatory": True},
        ],
        "amendments": [],
        "related_standards": [
            {"code": "IS 16104: 2012", "title": "Electronic Controlgear for LED Modules - Performance Requirements", "relation_type": "Performance Complement"},
            {"code": "IS 10322 (Part 5/Sec 3): 2012", "title": "Road Lighting Luminaires", "relation_type": "Parent Luminaire Standard"},
        ],
        "keywords": ["led driver", "electronic controlgear", "overvoltage", "short circuit protection", "power factor", "surge protection", "thd"],
    },
    {
        "id": "std-is-1786-2008",
        "code": "IS 1786: 2008",
        "title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement - Specification",
        "category": "Civil Engineering",
        "technical_committee": "CED 54 Concrete Reinforcement Sectional Committee",
        "ics_code": "77.140.15",
        "status": "current",
        "reaffirmation_year": 2023,
        "gazetted_date": "2008-05-12",
        "qco_mandatory": True,
        "scope": "Covers the requirements of deformed steel bars and wires for use as reinforcement in concrete in the following strength grades: Fe 415, Fe 415D, Fe 500, Fe 500D, Fe 550, Fe 550D, Fe 600, and Fe 650. Details chemical limits, Carbon Equivalent (CE), mechanical yield strength, elongation, rebend tests, and mandatory ISI embossed marking.",
        "why_recommended_template": "The premier mandatory Indian Standard for Thermo-Mechanically Treated (TMT) steel reinforcement bars specifying chemical limits, tensile tolerances, bend/rebend tests, and ISI marking.",
        "key_clauses": [
            {
                "clause_no": "Clause 4.2",
                "clause_title": "Chemical Composition Limits",
                "requirement_summary": "For Fe 550D: Carbon max 0.25%, Sulphur max 0.040%, Phosphorus max 0.040%, combined S+P max 0.075%. Carbon Equivalent CE max 0.42%.",
                "test_method": "Optical Emission Spectrometer / Chemical Analysis per IS 228",
                "tolerance_limit": "Strict adherence to ladle analysis with max 0.005% product variation tolerance.",
            },
            {
                "clause_no": "Clause 8.1",
                "clause_title": "Mechanical Properties & Tensile Limits",
                "requirement_summary": "0.2% Proof Stress min 550 N/mm², Tensile strength min 600 N/mm² (TS/YS ratio >= 1.08), Elongation min 14.5%, Total uniform elongation (AgT) >= 5.0%.",
                "test_method": "Tensile Testing Machine per IS 1608 (Part 1)",
                "tolerance_limit": "Zero negative tolerance below specified proof stress values.",
            },
            {
                "clause_no": "Clause 8.3",
                "clause_title": "Rebend Test After Ageing",
                "requirement_summary": "Specimen bent through 135°, immersed in boiling water for 30 minutes, cooled, and bent back through 157.5° without cracking.",
                "test_method": "Mandrel bend test fixture per IS 1599",
                "tolerance_limit": "Zero visible rupture or transverse cracking at outer bent zone.",
            },
            {
                "clause_no": "Clause 9.3",
                "clause_title": "Embossed Standard Marking",
                "requirement_summary": "Manufacturer logo, grade designation (Fe 550D), and nominal diameter shall be embossed on every meter run.",
                "test_method": "Visual and dimensional inspection of bar ribs",
                "tolerance_limit": "Embossing interval not exceeding 1.5 meters.",
            },
        ],
        "test_methods": [
            {"name": "Tensile & Proof Stress Test", "method_standard": "IS 1608 (Part 1): 2018", "frequency": "Every Cast / 50 Tonnes", "mandatory": True},
            {"name": "Bend and Rebend Test", "method_standard": "IS 1599: 2019", "frequency": "Every Cast / Lot", "mandatory": True},
            {"name": "Chemical & Carbon Equivalent Spectrometry", "method_standard": "IS 228 (Relevant Parts)", "frequency": "Every Ladle / Heat", "mandatory": True},
            {"name": "Deformation (Rib Geometry & Area Ar)", "method_standard": "IS 1786 Annex A", "frequency": "Every Rolling Batch", "mandatory": True},
        ],
        "amendments": [
            {"amendment_no": "Amendment No. 1", "date": "2012-08-20", "summary": "Introduced Fe 550D and Fe 600 grades with strict ductility and AgT elongation criteria.", "status": "Active"},
            {"amendment_no": "Amendment No. 2", "date": "2017-06-15", "summary": "Revised maximum Carbon Equivalent formula and added automated optical rib profile verification.", "status": "Active"},
            {"amendment_no": "Amendment No. 3", "date": "2021-03-30", "summary": "Added Fe 650 high-yield grade and strengthened anti-corrosion epoxy coating interface rules.", "status": "Active"},
        ],
        "related_standards": [
            {"code": "IS 456: 2000", "title": "Plain and Reinforced Concrete - Code of Practice", "relation_type": "Design Code Pair"},
            {"code": "IS 13920: 2016", "title": "Ductile Design and Detailing of RC Structures", "relation_type": "Seismic Code Complement"},
            {"code": "IS 2062: 2011", "title": "Hot Rolled Medium and High Tensile Structural Steel", "relation_type": "Structural Steel Sibling"},
        ],
        "keywords": ["tmt rebars", "fe 500d", "fe 550d", "steel bars", "proof stress", "elongation", "rebend test", "carbon equivalent", "concrete reinforcement"],
    },
    {
        "id": "std-is-456-2000",
        "code": "IS 456: 2000",
        "title": "Plain and Reinforced Concrete - Code of Practice",
        "category": "Civil Engineering",
        "technical_committee": "CED 2 Cement and Concrete Sectional Committee",
        "ics_code": "91.100.30",
        "status": "current",
        "reaffirmation_year": 2021,
        "gazetted_date": "2000-10-01",
        "qco_mandatory": False,
        "scope": "The mother standard for structural concrete engineering in India. Deals with general structural use of plain and reinforced concrete, detailing of reinforcement, durability requirements for various environmental exposure classes, mix proportioning, and quality assurance.",
        "why_recommended_template": "Governs design criteria for reinforcement detailing, development length, clear cover for bridge environments, and maximum permissible bar spacing.",
        "key_clauses": [
            {
                "clause_no": "Clause 26.2",
                "clause_title": "Development Length of Reinforcement Bars",
                "requirement_summary": "Calculates development length (Ld) based on bar diameter, design bond stress (Tau_bd), and steel grade.",
                "test_method": "Bond pullout test per IS 2770",
                "tolerance_limit": "Bond stress Tau_bd increased by 60% for deformed bars conforming to IS 1786.",
            },
            {
                "clause_no": "Clause 26.4",
                "clause_title": "Nominal Concrete Cover to Reinforcement",
                "requirement_summary": "Specifies minimum clear cover (e.g. 45mm to 75mm for Severe/Extreme marine/bridge exposure).",
                "test_method": "Electromagnetic cover meter scan",
                "tolerance_limit": "Tolerance on nominal cover +10mm / -0mm.",
            },
        ],
        "test_methods": [
            {"name": "Compressive Strength of Concrete Cubes", "method_standard": "IS 516 (Part 1/Sec 1): 2021", "frequency": "Every 50m³ concrete batch", "mandatory": True},
        ],
        "amendments": [
            {"amendment_no": "Amendment No. 5", "date": "2019-07-01", "summary": "Updated environmental exposure classifications and durability criteria for high performance concrete.", "status": "Active"}
        ],
        "related_standards": [
            {"code": "IS 1786: 2008", "title": "High Strength Deformed Steel Bars", "relation_type": "Material Standard"},
            {"code": "IS 269: 2015", "title": "Ordinary Portland Cement - Specification", "relation_type": "Binder Material Standard"},
        ],
        "keywords": ["concrete", "rcc", "clear cover", "development length", "durability", "exposure class", "compressive strength"],
    },
    {
        "id": "std-is-2062-2011",
        "code": "IS 2062: 2011",
        "title": "Hot Rolled Medium and High Tensile Structural Steel - Specification",
        "category": "Civil Engineering",
        "technical_committee": "MTD 4 Steel Sectional Committee",
        "ics_code": "77.140.01",
        "status": "current",
        "reaffirmation_year": 2021,
        "gazetted_date": "2011-11-15",
        "qco_mandatory": True,
        "scope": "Covers the requirements of steel plates, sections, flats, bars, etc. for use in structural work, bridge girders, transmission towers, and industrial buildings. Designations include E 250, E 275, E 300, E 350, E 410, E 450, E 550, and E 650 with sub-qualities A, BR, B0, and C.",
        "why_recommended_template": "Governs hot-rolled structural steel sections, plates, and girders, defining minimum yield stress, impact Charpy V-notch energy at sub-zero temperatures, and weldability.",
        "key_clauses": [
            {
                "clause_no": "Clause 8.1",
                "clause_title": "Tensile and Yield Properties",
                "requirement_summary": "Specifies minimum yield strength (250 to 650 MPa) and tensile strength depending on designated grade and thickness.",
                "test_method": "Tensile testing per IS 1608 (Part 1)",
                "tolerance_limit": "Zero negative tolerance on minimum yield strength.",
            },
            {
                "clause_no": "Clause 8.2",
                "clause_title": "Charpy V-Notch Impact Energy",
                "requirement_summary": "For sub-qualities B0 and C: minimum 27 Joules impact energy at 0°C and -20°C / -40°C.",
                "test_method": "Charpy Impact Test per IS 1757",
                "tolerance_limit": "Average of three specimens >= 27 Joules.",
            },
        ],
        "test_methods": [
            {"name": "Tensile Testing of Structural Steel", "method_standard": "IS 1608 (Part 1)", "frequency": "Every Heat / Rolling Lot", "mandatory": True},
            {"name": "Charpy V-Notch Impact Test", "method_standard": "IS 1757 (Part 1): 2020", "frequency": "Every Heat for Quality B/C", "mandatory": True},
        ],
        "amendments": [],
        "related_standards": [
            {"code": "IS 800: 2007", "title": "General Construction in Steel - Code of Practice", "relation_type": "Design Standard Pair"},
        ],
        "keywords": ["structural steel", "is 2062", "e250", "e350", "e410", "charpy impact", "girders", "plates", "weldability"],
    },
    {
        "id": "std-is-2925-1984",
        "code": "IS 2925: 1984",
        "title": "Specification for Industrial Safety Helmets",
        "category": "Safety & Fire",
        "technical_committee": "CHD 8 Occupational Safety and Health Sectional Committee",
        "ics_code": "13.340.20",
        "status": "current",
        "reaffirmation_year": 2020,
        "gazetted_date": "1984-06-30",
        "qco_mandatory": True,
        "scope": "Specifies requirements for industrial safety helmets intended to protect the head from falling objects and other mechanical impacts, electrical hazards, and flames in mines, factories, ports, and construction sites.",
        "why_recommended_template": "Mandatory standard for industrial safety helmets defining shell strength, shock absorption (<= 5.0 kN), penetration resistance, electrical insulation, and chin strap retention.",
        "key_clauses": [
            {
                "clause_no": "Clause 7.1",
                "clause_title": "Shock Absorption Test",
                "requirement_summary": "Transmitted force to headform shall not exceed 5.0 kN when 5.0 kg striker is dropped from 1.0 meter.",
                "test_method": "Calibrated piezoelectric load cell headform drop tower",
                "tolerance_limit": "Max peak transmitted force <= 5.0 kN.",
            },
            {
                "clause_no": "Clause 7.2",
                "clause_title": "Penetration Resistance",
                "requirement_summary": "A 3.0 kg conical striker dropped from 1.0 meter shall not pierce the shell to touch the headform.",
                "test_method": "Drop test rig with electric contact sensor",
                "tolerance_limit": "Zero electrical contact with underlying headform.",
            },
            {
                "clause_no": "Clause 7.3",
                "clause_title": "Electrical Resistance (Dielectric Proof)",
                "requirement_summary": "When immersed and subjected to 2,000 V AC for 1 minute, leakage current shall not exceed 3.0 mA.",
                "test_method": "High voltage AC leakage tester",
                "tolerance_limit": "Leakage current <= 3.0 mA; zero breakdown.",
            },
            {
                "clause_no": "Clause 7.4",
                "clause_title": "Flame Retardancy",
                "requirement_summary": "When exposed to Bunsen flame for 10 seconds, the shell material shall self-extinguish within 5 seconds.",
                "test_method": "Direct flame impingement burner",
                "tolerance_limit": "Afterflame time <= 5.0 seconds.",
            },
        ],
        "test_methods": [
            {"name": "Shock Absorption Drop Test", "method_standard": "IS 2925 Clause 7.1", "frequency": "Batch Testing (Sampling)", "mandatory": True},
            {"name": "Dielectric Proof Voltage Test", "method_standard": "IS 2925 Clause 7.3", "frequency": "Batch Testing", "mandatory": True},
            {"name": "Flame Retardancy Test", "method_standard": "IS 2925 Clause 7.4", "frequency": "Type & Lot Sampling", "mandatory": True},
        ],
        "amendments": [
            {"amendment_no": "Amendment No. 1", "date": "1991-03-15", "summary": "Updated testing parameters for high-temperature operating conditions up to 50°C.", "status": "Active"},
            {"amendment_no": "Amendment No. 2", "date": "2002-09-01", "summary": "Added modern polymer formulations and chin strap release load tolerances.", "status": "Active"},
        ],
        "related_standards": [
            {"code": "IS 3521 (Part 1): 2021", "title": "Full Body Fall Arrest Harness", "relation_type": "PPE Suite Complement"},
            {"code": "IS 15298 (Part 2): 2016", "title": "Safety Footwear", "relation_type": "PPE Suite Complement"},
        ],
        "keywords": ["safety helmet", "hard hat", "shock absorption", "penetration resistance", "dielectric insulation", "flame retardant", "chd 8"],
    },
    {
        "id": "std-is-3521-1-2021",
        "code": "IS 3521 (Part 1): 2021",
        "title": "Personal Fall Arrest Systems - Full Body Harness",
        "category": "Safety & Fire",
        "technical_committee": "CHD 8 Occupational Safety and Health Sectional Committee",
        "ics_code": "13.340.60",
        "status": "current",
        "reaffirmation_year": 2023,
        "gazetted_date": "2021-04-15",
        "qco_mandatory": True,
        "scope": "Specifies requirements, test methods, instructions for general use, marking, packaging and maintenance for full body harnesses used in personal fall arrest systems. Webbing breaking strength >= 22 kN.",
        "why_recommended_template": "Comprehensive specification for full body fall arrest harnesses, webbing tensile strength (min 22 kN), dynamic drop testing with 100 kg mannequin, and corrosion-resistant metal fittings.",
        "key_clauses": [
            {
                "clause_no": "Clause 4.3",
                "clause_title": "Static Strength of Assembly",
                "requirement_summary": "Harness assembly must withstand 15 kN static tensile pull for 3 minutes without structural rupture.",
                "test_method": "Hydraulic static pull bench with torso dummy",
                "tolerance_limit": "Zero webbing rupture; hardware slippage <= 20mm.",
            },
            {
                "clause_no": "Clause 5.1",
                "clause_title": "Dynamic Performance Drop Test",
                "requirement_summary": "100 kg articulated torso dummy dropped 4.0 meters shall remain suspended with angle of body <= 50° to vertical.",
                "test_method": "Dynamic drop test tower with quick release latch",
                "tolerance_limit": "Torso dummy retained securely without release; zero buckle failure.",
            },
        ],
        "test_methods": [
            {"name": "Dynamic Drop Test (100kg dummy)", "method_standard": "IS 3521 (Part 1)", "frequency": "Type Test", "mandatory": True},
            {"name": "Static Pull Test (15 kN)", "method_standard": "IS 3521 (Part 1)", "frequency": "Batch Testing", "mandatory": True},
        ],
        "amendments": [],
        "related_standards": [
            {"code": "IS 2925: 1984", "title": "Industrial Safety Helmets", "relation_type": "PPE Suite Complement"},
            {"code": "IS 3521 (Part 2): 2021", "title": "Lanyards and Energy Absorbers", "relation_type": "Sub-system Standard"},
        ],
        "keywords": ["fall arrest", "full body harness", "safety belt", "d-ring", "dynamic drop test", "static pull test", "scaffolding safety"],
    },
    {
        "id": "std-is-4984-2016",
        "code": "IS 4984: 2016",
        "title": "High Density Polyethylene (HDPE) Pipes for Water Supply - Specification",
        "category": "Water & Utilities",
        "technical_committee": "CED 50 Plastic Piping Systems Sectional Committee",
        "ics_code": "23.040.20",
        "status": "current",
        "reaffirmation_year": 2021,
        "gazetted_date": "2016-08-01",
        "qco_mandatory": True,
        "scope": "Covers requirements for high density polyethylene (HDPE) pipes from 16mm to 1000mm nominal diameter for water supply intended for human consumption. Covers material grades PE 63, PE 80, and PE 100 with pressure ratings from PN 2.5 to PN 20.",
        "why_recommended_template": "The definitive Indian Standard for HDPE potable water pipes regulating raw material resin grades (PE 63, PE 80, PE 100), dimensional tolerances, hydraulic pressure tests, and toxicological safety for drinking water.",
        "key_clauses": [
            {
                "clause_no": "Clause 4.1",
                "clause_title": "Virgin Raw Material Grade",
                "requirement_summary": "Only virgin PE-100 or PE-80 resin compound shall be used. Addition of recycled or post-consumer plastic is strictly barred.",
                "test_method": "Density and Carbon Black Dispersion per IS 2530",
                "tolerance_limit": "Carbon black 2.0% to 2.5%; uniform dispersion grade <= 3.",
            },
            {
                "clause_no": "Clause 8.1",
                "clause_title": "Hydrostatic Strength Test (165h & 1000h)",
                "requirement_summary": "Pipes must withstand induced hoop stress of 5.4 MPa at 80°C for 165 hours without rupture or weeping.",
                "test_method": "Thermostatic hot water bath pressure station",
                "tolerance_limit": "Zero burst, zero weeping across all test specimens.",
            },
            {
                "clause_no": "Clause 10.1",
                "clause_title": "Identification and Marking for Potable Water",
                "requirement_summary": "Pipes shall be black with minimum 3 longitudinal blue co-extruded stripes and meter-by-meter marking.",
                "test_method": "Visual and ink-rub durability test",
                "tolerance_limit": "Indelible identification marking every 1.0 meter.",
            },
        ],
        "test_methods": [
            {"name": "Long-term Hydrostatic Pressure Test (80°C)", "method_standard": "IS 4984 Clause 8.1", "frequency": "Type & Routine Batch Test", "mandatory": True},
            {"name": "Oxidation Induction Time (OIT at 200°C)", "method_standard": "IS 4984 Table 3", "frequency": "Raw Material Batch Test", "mandatory": True},
            {"name": "Melt Flow Rate (MFR) Verification", "method_standard": "IS 2530", "frequency": "Every Consignment", "mandatory": True},
        ],
        "amendments": [
            {"amendment_no": "Amendment No. 1", "date": "2019-10-15", "summary": "Added enhanced wall thickness tolerances for large diameter trenchless installation.", "status": "Active"}
        ],
        "related_standards": [
            {"code": "IS 7634 (Part 2): 2012", "title": "Laying and Jointing of PE Pipes", "relation_type": "Installation Code of Practice"},
            {"code": "IS 8329: 2000", "title": "Ductile Iron Pipes for Water", "relation_type": "Alternative Material Standard"},
        ],
        "keywords": ["hdpe pipe", "pe 100", "potable water", "water supply", "pn 10", "hydrostatic test", "jal jeevan mission", "blue stripe"],
    },
    {
        "id": "std-is-1180-1-2014",
        "code": "IS 1180 (Part 1): 2014",
        "title": "Outdoor Type Oil Immersed Distribution Transformers up to and including 2 500 kVA, 33 kV - Specification",
        "category": "Electrotechnical",
        "technical_committee": "ETD 16 Transformers Sectional Committee",
        "ics_code": "29.180",
        "status": "current",
        "reaffirmation_year": 2021,
        "gazetted_date": "2014-04-30",
        "qco_mandatory": True,
        "scope": "Specifies requirements for outdoor type, three-phase, 50 Hz, oil-immersed distribution transformers of ratings up to and including 2500 kVA for use on systems with nominal voltages up to 33 kV. Mandates maximum permissible loss levels at 50% and 100% load corresponding to BEE Star Ratings.",
        "why_recommended_template": "The supreme mandatory standard for distribution transformers in India, stipulating maximum total loss limits at 50% and 100% load, short circuit withstand capabilities, and BEE Star labeling.",
        "key_clauses": [
            {
                "clause_no": "Clause 6.8",
                "clause_title": "Energy Efficiency & Maximum Total Losses",
                "requirement_summary": "Total losses at 50% and 100% load shall not exceed values specified in Table 3 for Energy Efficiency Level 1, 2, or 3.",
                "test_method": "Precision Power Analyzer measurement per IS 2026 (Part 1)",
                "tolerance_limit": "Zero positive tolerance allowed on guaranteed total loss ceiling.",
            },
            {
                "clause_no": "Clause 9.1",
                "clause_title": "Temperature Rise Limits",
                "requirement_summary": "Winding temperature rise shall not exceed 45°C by resistance method, and top oil temperature rise shall not exceed 40°C.",
                "test_method": "Full-load temperature rise run in thermal test cell",
                "tolerance_limit": "Max top oil rise <= 40°C; winding rise <= 45°C.",
            },
            {
                "clause_no": "Clause 21.3",
                "clause_title": "Dynamic Short-Circuit Withstand Capability",
                "requirement_summary": "Transformer must withstand thermal and dynamic effects of external short circuits on all secondary terminals.",
                "test_method": "Short-circuit testing at CPRI / ERDA high power testing laboratory",
                "tolerance_limit": "Zero structural deformation, reactances within +/- 5% post-test.",
            },
        ],
        "test_methods": [
            {"name": "No-load & Full-load Loss Measurement", "method_standard": "IS 2026 (Part 1)", "frequency": "Routine Test (100% units)", "mandatory": True},
            {"name": "Dynamic Short-Circuit Test", "method_standard": "IS 2026 (Part 5)", "frequency": "Type Test from CPRI/ERDA", "mandatory": True},
            {"name": "Lightning Impulse Voltage Withstand Test", "method_standard": "IS 2026 (Part 3)", "frequency": "Type Test", "mandatory": True},
        ],
        "amendments": [
            {"amendment_no": "Amendment No. 1", "date": "2016-09-01", "summary": "Integrated Bureau of Energy Efficiency (BEE) Star Rating labels with mandatory BIS marking.", "status": "Active"},
            {"amendment_no": "Amendment No. 2", "date": "2021-02-18", "summary": "Revised maximum loss levels for 16 kVA, 25 kVA, 63 kVA, 100 kVA, and 250 kVA ratings.", "status": "Active"},
        ],
        "related_standards": [
            {"code": "IS 335: 2018", "title": "Insulating Mineral Oils for Transformers", "relation_type": "Dielectric Medium Standard"},
            {"code": "IS 2026 (Part 1): 2011", "title": "Power Transformers - General", "relation_type": "Mother Transformer Standard"},
        ],
        "keywords": ["distribution transformer", "11kv transformer", "250 kva", "bee star rating", "loss limits", "crgo core", "short circuit withstand", "is 1180"],
    },
    {
        "id": "std-is-335-2018",
        "code": "IS 335: 2018",
        "title": "Uninhibited and Inhibited Mineral Insulating Oils - Specification",
        "category": "Electrotechnical",
        "technical_committee": "ETD 3 Fluids for Electrotechnical Applications",
        "ics_code": "29.040.10",
        "status": "current",
        "reaffirmation_year": 2023,
        "gazetted_date": "2018-03-25",
        "qco_mandatory": True,
        "scope": "Specifies requirements for mineral insulating oils for use in transformers, switchgear and similar electrical equipment where oil is required as an insulant and heat transfer medium. Breakdown voltage >= 30 kV.",
        "why_recommended_template": "Governs dielectric breakdown voltage, moisture content (< 30 ppm), and oxidation stability of transformer cooling oil.",
        "key_clauses": [
            {
                "clause_no": "Clause 5.1",
                "clause_title": "Dielectric Breakdown Voltage (BDV)",
                "requirement_summary": "Electric strength of new untreated oil shall be >= 30 kV RMS, and after treatment >= 70 kV RMS.",
                "test_method": "Automatic oil BDV test vessel with 2.5mm spherical electrode gap per IS 6792",
                "tolerance_limit": "Minimum 30 kV unconditioned; minimum 70 kV treated.",
            },
        ],
        "test_methods": [
            {"name": "Dielectric Breakdown Voltage (BDV)", "method_standard": "IS 6792", "frequency": "Every Drum / Tanker Lot", "mandatory": True},
            {"name": "Water Content by Karl Fischer Titration", "method_standard": "IS 13567", "frequency": "Every Lot", "mandatory": True},
        ],
        "amendments": [],
        "related_standards": [
            {"code": "IS 1180 (Part 1): 2014", "title": "Distribution Transformers", "relation_type": "Application Parent"},
        ],
        "keywords": ["transformer oil", "insulating oil", "breakdown voltage", "bdv", "dielectric fluid", "karl fischer"],
    },
]

INITIAL_ANALYSES = [
    {
        "id": "analysis-led-street-lighting-01",
        "title": "Municipal LED Street Lighting & Roadway Luminaires",
        "sector": "Electrotechnical & Smart Infrastructure",
        "department": "Electrotechnical Department (ETD), BIS",
        "conformity_scheme": "Scheme-II · Compulsory Registration Scheme (CRS)",
        "source_type": "pdf_upload",
        "document_name": "LED_Street_Lighting_Requirement.pdf",
        "raw_text": "Procurement and installation of energy-efficient outdoor LED Street Light Luminaires (70W and 120W) with cast aluminum pressure die-cast housing for urban arterial and collector road illumination.\nTechnical Requirements:\n1. Luminaire efficacy >= 120 Lumens/Watt at CCT 5000K, CRI > 70.\n2. Ingress protection rating IP66 optical and driver compartment.\n3. Impact resistance minimum IK08.\n4. Input voltage 140V to 280V AC, THD < 10%, Power factor > 0.95.\n5. Surge protection device 10 kV/10 kA.\n6. Comply with mandatory BIS QCO Orders.",
        "created_at": "2026-09-06T10:30:00Z",
        "status": "completed",
        "extracted_intelligence": {
            "product_identified": "Outdoor LED Roadway Luminaires & Street Lighting Systems",
            "purpose": "Municipal arterial and collector roadway illumination, energy reduction, and automated switching",
            "target_operating_environment": "Outdoor harsh environmental conditions (IP66, -10°C to +50°C, ambient humidity 10-95%)",
            "keywords": ["LED Street Lighting", "Roadway Luminaire", "Optical Ingress IP66", "Total Harmonic Distortion", "Surge Protection 10kV", "CCT 5000K", "BIS QCO 2021"],
            "technical_parameters": [
                {"parameter": "Luminaire Efficacy", "value": ">= 120 Lumens/Watt", "specified_in_spec": True, "benchmark_is_norm": "Conforms to IS 16107 Part 2/Sec 1", "status": "specified"},
                {"parameter": "Ingress Protection Rating", "value": "IP66 Optical & Driver Compartment", "specified_in_spec": True, "benchmark_is_norm": "IS 10322 Part 5/Sec 3 Clause 6.2", "status": "specified"},
                {"parameter": "Correlated Color Temp (CCT)", "value": "5000K (Cool Day White)", "specified_in_spec": True, "benchmark_is_norm": "IS 16103 Clause 4.1", "status": "specified"},
                {"parameter": "Total Harmonic Distortion (THD)", "value": "< 10%", "specified_in_spec": True, "benchmark_is_norm": "IS 15885 Part 2/Sec 13", "status": "specified"},
                {"parameter": "Surge Protection Level", "value": "10 kV / 10 kA", "specified_in_spec": True, "benchmark_is_norm": "IS 16107 / IEEE C62.41", "status": "specified"},
                {"parameter": "Operating Voltage Range", "value": "140V to 280V AC (withstand 380V)", "specified_in_spec": True, "benchmark_is_norm": "IS 15885 Part 2/Sec 13", "status": "specified"},
                {"parameter": "Impact Resistance Rating", "value": "IK08 Toughened Glass", "specified_in_spec": True, "benchmark_is_norm": "IS 10322 (Part 1)", "status": "specified"},
                {"parameter": "Driver Operating Case Temp (Tc)", "value": "Max 75°C at 45°C ambient", "specified_in_spec": False, "benchmark_is_norm": "IS 15885 (Part 2/Sec 13)", "status": "missing_recommended"},
            ]
        },
        "recommendations": [
            {
                "standard_code": "IS 10322 (Part 5/Sec 3): 2012",
                "standard_title": "Luminaires - Particular Requirements - Luminaires for Road and Street Lighting",
                "relevance_score": 98,
                "status": "current",
                "category": "Electrotechnical",
                "technical_committee": "ETD 24 Illumination Engineering",
                "qco_mandatory": True,
                "why_recommended": "Directly governs mechanical construction, IP66 optical sealing, thermal management, and vibration testing for outdoor municipal and highway luminaires.",
                "evidence_clauses": [
                    {"clause_no": "Clause 6.2", "clause_name": "Degree of Ingress Protection", "matched_requirement": "IP66 Optical and Driver Compartment", "evidence_text": "Luminaires for road lighting shall have a minimum degree of protection against ingress of dust and moisture not less than IP65/IP66 as per IS/IEC 60529."},
                    {"clause_no": "Clause 9.1", "clause_name": "Thermal Endurance & Overheating", "matched_requirement": "Continuous duty under ambient 45°C", "evidence_text": "The luminaire shall be subjected to thermal endurance testing at rated voltage and elevated temperature +10°C above maximum rated ambient."},
                    {"clause_no": "Clause 12.3", "clause_name": "Impact Resistance (IK Rating)", "matched_requirement": "Minimum IK08 Toughened Glass diffuser", "evidence_text": "Optical covers and glass panes must withstand impact energy of 5.0 Joules without fragmentation or seal compromise."}
                ],
                "related_standards_summary": ["IS 16107 (Part 2/Sec 1): 2012", "IS 15885 (Part 2/Sec 13): 2012", "IS/IEC 60529: 2001"]
            },
            {
                "standard_code": "IS 16107 (Part 2/Sec 1): 2012",
                "standard_title": "Single-Capped LED Lamps and Luminaires - Performance Requirements",
                "relevance_score": 94,
                "status": "current",
                "category": "Electrotechnical",
                "technical_committee": "ETD 24 Illumination Engineering",
                "qco_mandatory": True,
                "why_recommended": "Specifies photometric performance benchmarks including luminous efficacy (>120 lm/W), color rendering index (CRI > 70), and lumen maintenance (L70 at 50,000 hours).",
                "evidence_clauses": [
                    {"clause_no": "Clause 7.2", "clause_name": "Initial Luminous Efficacy", "matched_requirement": "120 Lumens/Watt minimum", "evidence_text": "The measured luminous efficacy of the luminaire shall not be less than 90 percent of the rated luminous efficacy declared by manufacturer."},
                    {"clause_no": "Clause 8.4", "clause_name": "Lumen Maintenance & Accelerated Life", "matched_requirement": "50,000 burning hours lifespan", "evidence_text": "Lumen depreciation shall not drop below 70 percent of initial flux (L70B50) after operating for 6,000 hours continuous life test."}
                ],
                "related_standards_summary": ["IS 16103 (Part 1): 2012", "IS 16108: 2012"]
            },
            {
                "standard_code": "IS 15885 (Part 2/Sec 13): 2012",
                "standard_title": "Lamp Controlgear - Particular Requirements for DC or AC Supplied Electronic Controlgear for LED Modules",
                "relevance_score": 91,
                "status": "current",
                "category": "Electrotechnical",
                "technical_committee": "ETD 24 Illumination Engineering",
                "qco_mandatory": True,
                "why_recommended": "Mandates electrical safety, overvoltage withstand (up to 380V), galvanic isolation, and short-circuit protection for LED drivers.",
                "evidence_clauses": [
                    {"clause_no": "Clause 14.1", "clause_name": "Abnormal Operating Conditions", "matched_requirement": "Overvoltage withstand & short-circuit protection", "evidence_text": "The controlgear shall not impair safety when operated at 120% rated supply voltage or when output terminals are short-circuited."},
                    {"clause_no": "Clause 17.2", "clause_name": "Dielectric Strength & Insulation", "matched_requirement": "High voltage breakdown safety", "evidence_text": "Insulation between live parts and protective earth shall withstand test voltage of 2.5 kV AC RMS for 1 minute without breakdown."}
                ],
                "related_standards_summary": ["IS 16104: 2012", "IS 302 (Part 1): 2008"]
            }
        ],
        "gap_analysis": {
            "readiness_score": 88,
            "compliance_rating": "High Readiness (Minor Clause Additions Recommended)",
            "missing_parameters": [
                {
                    "parameter": "Driver Operating Thermal Cutoff (Tc Point)",
                    "severity": "High",
                    "impact": "Unspecified max case temperature (Tc) risks premature driver semiconductor failure under high ambient Indian summer conditions.",
                    "recommended_clause": "IS 15885 (Part 2/Sec 13) Clause 11.2",
                    "suggested_text": "The LED driver case temperature (Tc) shall not exceed 75°C when tested inside the enclosed luminaire at an ambient operating temperature of 45°C."
                },
                {
                    "parameter": "Corrosion Resistance & Salt Spray Duration",
                    "severity": "Medium",
                    "impact": "For outdoor coastal or urban polluted environments, lack of salt spray test specification leads to rapid powder coating peeling.",
                    "recommended_clause": "IS 10322 (Part 5/Sec 3) Annex D / ASTM B117",
                    "suggested_text": "The die-cast aluminum housing shall undergo minimum 500 hours of neutral salt spray testing (NSS) without blister formation or paint adhesion loss."
                }
            ],
            "ambiguity_flags": [
                {
                    "term": "High quality pressure die cast housing",
                    "issue": "Subjective adjective 'high quality' is non-verifiable and legally challengeable in public procurement audits.",
                    "fix_suggestion": "Replace with 'Pressure die-cast Aluminum alloy Grade LM6 conforming to IS 617 with minimum wall thickness of 2.2mm'."
                }
            ],
            "qco_compliance_alerts": [
                {
                    "order_name": "Electronics and Information Technology Goods (Requirement for Compulsory Registration) Order, 2021",
                    "requirement": "All LED Luminaires and Controlgear must be registered under BIS CRS (Compulsory Registration Scheme).",
                    "legal_mandate": "Mandatory under Ministry of Electronics and Information Technology (MeitY) Notification. Bidders without valid BIS Registration R-Number must be disqualified at technical bid stage."
                }
            ],
            "recommended_spec_amendment": "4.8.1 COMPLIANCE WITH INDIAN STANDARDS:\nThe complete luminaire assembly, including LED light source, optical diffuser, and electronic controlgear, shall strictly conform to IS 10322 (Part 5/Sec 3): 2012, IS 16107 (Part 2/Sec 1): 2012, and IS 15885 (Part 2/Sec 13): 2012 with up-to-date amendments.\n4.8.2 MANDATORY BIS CERTIFICATION:\nBidders shall submit a valid BIS CRS Registration Certificate and Type Test Report from a NABL/BIS-accredited testing laboratory with test results not older than 18 months from bid closing date.\n4.8.3 ENVIRONMENTAL DURABILITY:\nHousing must be LM6 alloy powder-coated with minimum 500-hour Salt Spray withstand (ASTM B117/IS 10322). Optical chamber and driver enclosure shall strictly certify IP66 ingress protection per IS/IEC 60529."
        }
    },
    {
        "id": "analysis-tmt-steel-02",
        "title": "High-Strength TMT Rebars for Highway Bridges & Flyovers",
        "sector": "Civil Engineering & Structural",
        "department": "Civil Engineering Department (CED), BIS",
        "conformity_scheme": "Scheme-I · ISI Mark (Steel Products QCO)",
        "source_type": "text",
        "document_name": "TMT_Reinforcement_Bars_Requirement.pdf",
        "raw_text": "Supply of Thermo-Mechanically Treated (TMT) High Strength Deformed Steel Reinforcement Bars Grade Fe 550D conforming to Indian Standards for construction of RCC Piers, Abutments, and Deck Slabs for 4-lane elevated bridge corridor.\nTechnical Requirements:\n1. Nominal sizes required: 12mm, 16mm, 20mm, 25mm, and 32mm diameter.\n2. Grade: Fe 550D with high ductility suitable for seismic zone IV and V design criteria.\n3. Yield Stress min 550 N/mm²; Tensile strength min 600 N/mm² (TS/YS ratio >= 1.08).\n4. Elongation percentage min 14.5% and Total Elongation at Max Force (AgT) >= 5%.\n5. Carbon Equivalent (CE) max 0.42%.\n6. Possess valid BIS Certification License with embossed ISI mark.",
        "created_at": "2026-09-05T14:15:00Z",
        "status": "completed",
        "extracted_intelligence": {
            "product_identified": "High Strength Deformed TMT Reinforcement Steel Bars (Fe 550D)",
            "purpose": "Heavy infrastructure RCC structural framing, highway bridges, seismic-resistant piers and deck slabs",
            "target_operating_environment": "Seismic Zone IV/V high ductile requirement, atmospheric exposure Class Extreme/Severe",
            "keywords": ["TMT Rebars", "IS 1786 Fe 550D", "Yield Stress 550 MPa", "Ductility AgT >= 5%", "Carbon Equivalent 0.42%", "BIS ISI Marking"],
            "technical_parameters": [
                {"parameter": "Steel Grade & Designation", "value": "Fe 550D (High Ductility)", "specified_in_spec": True, "benchmark_is_norm": "IS 1786:2008 Clause 4.1", "status": "specified"},
                {"parameter": "0.2% Proof Stress (Yield Strength)", "value": "Minimum 550 N/mm²", "specified_in_spec": True, "benchmark_is_norm": "IS 1786:2008 Table 3", "status": "specified"},
                {"parameter": "Tensile / Yield Ratio (TS/YS)", "value": ">= 1.08 minimum", "specified_in_spec": True, "benchmark_is_norm": "IS 1786:2008 Clause 8.1", "status": "specified"},
                {"parameter": "Total Elongation at Max Force (AgT)", "value": ">= 5.0%", "specified_in_spec": True, "benchmark_is_norm": "IS 1786:2008 Table 3", "status": "specified"},
                {"parameter": "Maximum Carbon Equivalent (CE)", "value": "0.42% max", "specified_in_spec": True, "benchmark_is_norm": "IS 1786:2008 Clause 4.2", "status": "specified"},
                {"parameter": "Rebend Test After Ageing Verification", "value": "135° bend followed by boiling water & 157.5° rebend", "specified_in_spec": False, "benchmark_is_norm": "IS 1786:2008 Clause 8.3", "status": "missing_recommended"}
            ]
        },
        "recommendations": [
            {
                "standard_code": "IS 1786: 2008",
                "standard_title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement - Specification",
                "relevance_score": 99,
                "status": "current",
                "category": "Civil Engineering",
                "technical_committee": "CED 54 Concrete Reinforcement",
                "qco_mandatory": True,
                "why_recommended": "The premier mandatory Indian Standard for Thermo-Mechanically Treated (TMT) steel reinforcement bars specifying chemical limits, tensile tolerances, bend/rebend tests, and ISI marking.",
                "evidence_clauses": [
                    {"clause_no": "Clause 4.2", "clause_name": "Chemical Composition & Carbon Equivalent", "matched_requirement": "Carbon Equivalent <= 0.42%", "evidence_text": "For Fe 550D, Carbon (C) max 0.25%, Sulphur (S) max 0.040%, Phosphorus (P) max 0.040%, and combined S+P max 0.075%. Carbon Equivalent shall not exceed 0.42%."},
                    {"clause_no": "Clause 8.1", "clause_name": "Mechanical Properties & Ductility", "matched_requirement": "Yield Stress 550 MPa, Elongation 14.5%", "evidence_text": "Fe 550D requires 0.2% proof stress min 550.0 N/mm², Tensile strength min 600.0 N/mm² (ratio min 1.08), and elongation min 14.5%."},
                    {"clause_no": "Clause 9.3", "clause_name": "Mandatory ISI Marking on Bars", "matched_requirement": "Embossed ISI mark on every meter run", "evidence_text": "Every bar shall carry manufacturer identity, brand, nominal size, and standard mark embossed at intervals not greater than 1.5 meters."}
                ],
                "related_standards_summary": ["IS 456: 2000", "IS 2062: 2011", "IS 1608 (Part 1): 2018"]
            },
            {
                "standard_code": "IS 456: 2000",
                "standard_title": "Plain and Reinforced Concrete - Code of Practice",
                "relevance_score": 92,
                "status": "current",
                "category": "Civil Engineering",
                "technical_committee": "CED 2 Cement and Concrete",
                "qco_mandatory": False,
                "why_recommended": "Governs design criteria for reinforcement detailing, development length, clear cover for bridge environments, and maximum permissible bar spacing.",
                "evidence_clauses": [
                    {"clause_no": "Clause 26.2", "clause_name": "Development Length of Bars", "matched_requirement": "Anchor length in structural piers", "evidence_text": "Development length Ld shall be computed based on design bond stress values given in Table 21 for deformed bars."}
                ],
                "related_standards_summary": ["IS 1786: 2008", "IS 13920: 2016"]
            }
        ],
        "gap_analysis": {
            "readiness_score": 92,
            "compliance_rating": "High Readiness (Minor Sampling Guidance Needed)",
            "missing_parameters": [
                {
                    "parameter": "Mandatory Rebend Test After Ageing",
                    "severity": "High",
                    "impact": "Without explicit rebend test verification (135° bend followed by boiling water ageing and 157.5° reverse bend), brittle fracture risk increases under field bending.",
                    "recommended_clause": "IS 1786:2008 Clause 8.3 & Table 4",
                    "suggested_text": "Rebend test specimen shall be bent through 135°, aged in boiling water (100°C) for 30 minutes, cooled, and bent back through 157.5° without any visible rupture or cracking."
                }
            ],
            "ambiguity_flags": [
                {
                    "term": "Primary producer steel",
                    "issue": "'Primary producer' is a commercial trade term with varying definitions across state departments.",
                    "fix_suggestion": "Specify: 'Steel manufactured from virgin iron ore / BF-BOF or Corex-EAF integrated route with secondary vacuum degassing (LF-VD)'."
                }
            ],
            "qco_compliance_alerts": [
                {
                    "order_name": "Steel and Steel Products (Quality Control) Order, 2020",
                    "requirement": "Manufacture, sale, and public procurement of steel rebars without BIS Standard Mark (ISI mark) is prohibited by central law.",
                    "legal_mandate": "Ministry of Steel QCO Gazette S.O. 1673(E). Non-BIS certified steel cannot be accepted on government infrastructure works."
                }
            ],
            "recommended_spec_amendment": "3.4.1 INDIAN STANDARD COMPLIANCE:\nAll reinforcement steel shall strictly conform to IS 1786: 2008 Grade Fe 550D (High Ductility). Secondary or re-rolled steel from scrap without BIS license is strictly prohibited.\n3.4.2 MANDATORY MECHANICAL CRITERIA:\nYield Strength (0.2% proof stress) >= 550 N/mm², Ultimate Tensile Strength >= 600 N/mm², TS/YS ratio >= 1.08, Elongation >= 14.5%, Total Uniform Elongation (AgT) >= 5.0%.\n3.4.3 QUALITY ASSURANCE:\nManufacturer Test Certificates (MTC) showing lot-wise chemical analysis and Carbon Equivalent (<= 0.42%) along with embossed ISI mark shall be submitted for every consignment prior to unloading."
        }
    },
    {
        "id": "analysis-ppe-safety-03",
        "title": "Industrial Safety Helmets & Fall Arrest Harnesses for Mines",
        "sector": "Occupational Safety & Mining",
        "department": "Production & General Engineering Department (PGD), BIS",
        "conformity_scheme": "Scheme-I · ISI Mark (PPE Quality Control Order)",
        "source_type": "text",
        "document_name": "Industrial_Safety_PPE_Requirement.pdf",
        "raw_text": "Procurement of High-Density Polymer Industrial Safety Helmets with 6-point textile cradle suspension and Full Body Fall Arrest Harnesses for hazardous underground coal mines and open-cast ore processing plants.\nTechnical Requirements:\n1. Safety Helmets: Non-metallic high-impact shell (HDPE/ABS), electrically non-conducting (Class E/G), adjustable nape strap.\n2. Shock absorption test: Transmitted force <= 5.0 kN.\n3. Penetration resistance: Conical striker 3.0 kg drop from 1.0 meter.\n4. Fall Arrest Harness: High-tenacity webbing with breaking strength >= 22 kN, dorsal D-ring.\n5. BIS Standard Mark under mandatory PPE QCO.",
        "created_at": "2026-08-31T09:00:00Z",
        "status": "completed",
        "extracted_intelligence": {
            "product_identified": "Personal Protective Equipment (Industrial Helmets & Fall Arrest Harness)",
            "purpose": "Head protection against falling objects and full-body fall prevention for mining/industrial personnel",
            "target_operating_environment": "Heavy industrial plants, underground mines, elevated scaffolding operations",
            "keywords": ["Industrial Safety Helmet", "Full Body Harness", "IS 2925", "IS 3521", "Impact Absorption 5kN", "Electrical Insulation Class E", "BIS QCO PPE"],
            "technical_parameters": [
                {"parameter": "Helmet Shell Material", "value": "High-Density Polymer (ABS / HDPE)", "specified_in_spec": True, "benchmark_is_norm": "IS 2925:1984 Clause 5.1", "status": "specified"},
                {"parameter": "Impact Shock Absorption", "value": "Transmitted force <= 5.0 kN", "specified_in_spec": True, "benchmark_is_norm": "IS 2925:1984 Clause 7.1", "status": "specified"},
                {"parameter": "Penetration Resistance", "value": "Conical striker 3kg drop 1.0m", "specified_in_spec": True, "benchmark_is_norm": "IS 2925:1984 Clause 7.2", "status": "specified"},
                {"parameter": "Harness Webbing Breaking Strength", "value": "Minimum 22 kN", "specified_in_spec": True, "benchmark_is_norm": "IS 3521 (Part 1): 2021", "status": "specified"}
            ]
        },
        "recommendations": [
            {
                "standard_code": "IS 2925: 1984",
                "standard_title": "Specification for Industrial Safety Helmets",
                "relevance_score": 97,
                "status": "current",
                "category": "Safety & Fire",
                "technical_committee": "CHD 8 Occupational Safety",
                "qco_mandatory": True,
                "why_recommended": "Mandatory standard for industrial safety helmets defining shell strength, shock absorption (<= 5.0 kN), penetration resistance, electrical insulation, and chin strap retention.",
                "evidence_clauses": [
                    {"clause_no": "Clause 7.1", "clause_name": "Shock Absorption Test", "matched_requirement": "Transmitted force <= 5.0 kN", "evidence_text": "When tested with a 5.0 kg drop striker falling from 1.0 meter onto the crown, the maximum force transmitted to the headform shall not exceed 5.0 kN."},
                    {"clause_no": "Clause 7.3", "clause_name": "Electrical Resistance Test", "matched_requirement": "Non-conducting dielectric performance", "evidence_text": "When subjected to an alternating voltage of 2,000 V RMS for 1 minute, the leakage current shall not exceed 3.0 mA."}
                ],
                "related_standards_summary": ["IS 3521 (Part 1): 2021", "IS 15298 (Part 2): 2016"]
            },
            {
                "standard_code": "IS 3521 (Part 1): 2021",
                "standard_title": "Personal Fall Arrest Systems - Full Body Harness",
                "relevance_score": 95,
                "status": "current",
                "category": "Safety & Fire",
                "technical_committee": "CHD 8 Occupational Safety",
                "qco_mandatory": True,
                "why_recommended": "Comprehensive specification for full body fall arrest harnesses, webbing tensile strength (min 22 kN), dynamic drop testing with 100 kg mannequin, and corrosion-resistant metal fittings.",
                "evidence_clauses": [
                    {"clause_no": "Clause 4.3", "clause_name": "Static Strength Test", "matched_requirement": "Webbing strength >= 22 kN", "evidence_text": "The harness assembly when subjected to static tensile load of 15 kN for 3 minutes shall show no tear or slippage through adjusters greater than 20mm."}
                ],
                "related_standards_summary": ["IS 3521 (Part 2): 2021", "IS 15683: 2018"]
            }
        ],
        "gap_analysis": {
            "readiness_score": 85,
            "compliance_rating": "Moderate Gaps (Safety Flame & Retention Clauses Needed)",
            "missing_parameters": [
                {
                    "parameter": "Chin Strap Anchorage Release / Strength",
                    "severity": "High",
                    "impact": "Excessive chin strap retention strength poses strangulation risk; inadequate strength causes helmet ejection during initial impact.",
                    "recommended_clause": "IS 2925:1984 Clause 7.5",
                    "suggested_text": "Chin strap anchorage shall withstand 150 N load without detachment, but must release between 150 N and 250 N to eliminate strangulation hazard."
                }
            ],
            "ambiguity_flags": [
                {
                    "term": "Heavy duty safety harness",
                    "issue": "'Heavy duty' is imprecise and allows non-compliant uncertified commercial safety belts.",
                    "fix_suggestion": "Replace with 'Full Body Harness Class A (Fall Arrest) with front and dorsal attachment points conforming to IS 3521 (Part 1): 2021'."
                }
            ],
            "qco_compliance_alerts": [
                {
                    "order_name": "Personal Protective Equipment (Quality Control) Order, 2021",
                    "requirement": "Industrial safety helmets and safety harnesses must carry genuine BIS Standard Mark (ISI mark).",
                    "legal_mandate": "Department for Promotion of Industry and Internal Trade (DPIIT) notification. Procurement of non-BIS certified PPE is illegal for public and industrial operations."
                }
            ],
            "recommended_spec_amendment": "2.1.1 MANDATORY BIS COMPLIANCE:\nIndustrial safety helmets shall strictly conform to IS 2925: 1984 with valid ISI certification. Full body fall arrest harnesses shall conform to IS 3521 (Part 1): 2021.\n2.1.2 MARKING & TRACEABILITY:\nEach helmet shell and harness label must be indelibly marked with BIS License Number (CM/L-XXXXXXXXXX), batch number, and manufacturing date.\n2.1.3 FLAME & IMPACT CRITERIA:\nHelmets must be certified for Flame Retardancy (self-extinguish <= 5s per IS 2925) and Chin Strap dynamic release between 150N and 250N."
        }
    }
]


async def seed():
    print("Seeding database with authentic Indian Standards and sample procurement analyses...")
    
    # 1. Upsert Standards
    all_standards = STANDARDS_DATA + EXTRA_STANDARDS
    for std in all_standards:
        await db.standards.update_one({"code": std["code"]}, {"$set": std}, upsert=True)
    print(f"Upserted {len(all_standards)} Indian Standards.")

    # 2. Upsert Analyses
    for analysis in INITIAL_ANALYSES:
        await db.analyses.update_one({"id": analysis["id"]}, {"$set": analysis}, upsert=True)
    print(f"Upserted {len(INITIAL_ANALYSES)} Procurement Analyses.")

    # 3. Apply indexes
    await ensure_indexes()
    print("Database indexes successfully ensured.")


if __name__ == "__main__":
    asyncio.run(seed())
