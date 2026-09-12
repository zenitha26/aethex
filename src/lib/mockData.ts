import { Product } from "../types/product";

export const CATEGORIES = [
  { id: "all", name: "All Products", count: 10 },
  { id: "automotive", name: "Automotive Hardware", count: 3, icon: "Shield" },
  { id: "acoustics", name: "Lossless Acoustics", count: 2, icon: "Tv" },
  { id: "power", name: "Power & Connectivity", count: 3, icon: "Cpu" },
  { id: "tools", name: "Precision Tools & EDC", count: 1, icon: "Wrench" },
  { id: "workspace", name: "Workspace & Ergonomics", count: 1, icon: "Laptop" },
];

export const mockProducts: Product[] = [
  {
    id: "aspor-a711",
    sku: "AET-A711-BLK",
    title: "ASPOR A711 360° Console Mount",
    subtitle: "Mechanical Cup-Holder Articulating Mount",
    category: "Automotive Hardware",
    description: "Engineered for uncompromising cockpit stability and driver sightline ergonomics. The ASPOR A711 locks seamlessly into standard cup holders, featuring full 360° rotation, 180° arm elevation, and rapid one-handed phone clamping.",
    price: 2990,
    original_price: 3990,
    currency: "LKR",
    rating: 4.9,
    reviewCount: 142,
    badge: "BEST SELLER",
    isTopDeal: true,
    isFastMoving: true,
    inStock: true,
    stock: 25,
    image_url: "/images/a711/cockpit_matte.jpg",
    gallery: [
      "/images/a711/cockpit_matte.jpg",
      "/images/a711/studio_hardware.jpg",
      "/images/a711/landscape_drive.jpg",
      "/images/a711/macro_base.jpg",
      "/images/a711/macro_arm.jpg",
    ],
    source: "aethex",
    variant_id: "aspor-a711-matte-black",
    variants: [
      { id: "aspor-a711-matte-black", title: "Carbon Matte Black", color: "Black", image_url: "/images/a711/cockpit_matte.jpg" },
    ],
    features: [
      { title: "360° Fluid Rotation", desc: "Precision ball joint for instant switch between vertical GPS navigation and wide radar mode." },
      { title: "180° Articulating Arm", desc: "Dual aluminum tension joints elevate phone up to 280mm into natural eye level." },
      { title: "Expanding Cup Base", desc: "Knurled dial expands 3 silicone-dampened lugs (65mm–95mm) into center console." },
      { title: "Universal Clamp", desc: "Spring-loaded silicone pads securely support devices from 4.0\" to 7.0\"." }
    ],
    specs: {
      "Rotation": "360° Free Ball Pivot",
      "Arm Arc": "180° Articulating Reach",
      "Base Bore": "65mm – 95mm Adjustable",
      "Phone Span": "4.0\" – 7.0\" Display Width",
      "Material": "Reinforced ABS + High-Tensile Polycarbonate",
      "Mounting": "Expanding Mechanical Lug",
      "Warranty": "7-Day Inspection Replacement"
    }
  },
  {
    id: "aethex-magdrive",
    sku: "AET-MDRV-CF",
    title: "AETHEX MagDrive Forged Carbon 15W Mount",
    subtitle: "Active Magnetic Qi2 Fast Charging Cockpit Dock",
    category: "Automotive Hardware",
    description: "Bespoke automotive wireless mount crafted from authentic forged carbon composite with 16-core N52 neodymium magnetic ring array and 15W Qi2 rapid thermal-dissipation charging.",
    price: 4850,
    original_price: 6200,
    currency: "LKR",
    rating: 5.0,
    reviewCount: 88,
    badge: "QI2 WIRELESS",
    isTopDeal: true,
    isFastMoving: true,
    inStock: true,
    stock: 15,
    image_url: "/images/products/magdrive-mount.jpg",
    gallery: [
      "/images/products/magdrive-mount.jpg",
      "/images/a711/studio_hardware.jpg",
    ],
    source: "aethex",
    features: [
      { title: "Forged Carbon Armor", desc: "Monocoque carbon construction provides extreme torsional rigidity with aerospace aesthetic." },
      { title: "15W Qi2 Fast Induction", desc: "Active cooling graphene layer prevents phone thermal throttling on long GPS drives." },
      { title: "N52 Neodymium Array", desc: "Provides 1.8kg holding force, resisting extreme g-forces and bumpy terrain." }
    ],
    specs: {
      "Material": "Authentic Forged Carbon + Anodized Aluminum",
      "Charging Standard": "Qi2 / MagSafe 15W Fast Induction",
      "Magnet Array": "16x N52 Neodymium Rare Earth Core",
      "Input Interface": "USB-C 9V/2.22A, 12V/1.67A",
      "Warranty": "1 Year Official Warranty"
    }
  },
  {
    id: "aethex-cockpit-hud",
    sku: "AET-HUD-TPMS",
    title: "AETHEX Cockpit HUD Barometric Telemetry Gauge",
    subtitle: "Precision Digital OLED Pressure & Cabin Sensor",
    category: "Automotive Hardware",
    description: "Military-grade digital pressure and temperature gauge featuring razor-sharp monochrome OLED telemetry, instant micro-bleeder valve, and braided stainless steel high-pressure line.",
    price: 3890,
    original_price: 4900,
    currency: "LKR",
    rating: 4.9,
    reviewCount: 63,
    badge: "PRECISION OLED",
    isTopDeal: false,
    isFastMoving: true,
    inStock: true,
    stock: 20,
    image_url: "/images/products/cockpit-hud.jpg",
    gallery: [
      "/images/products/cockpit-hud.jpg",
      "/images/a711/landscape_drive.jpg",
    ],
    source: "aethex",
    features: [
      { title: "0.01 Bar Accuracy", desc: "High-grade Swiss piezoresistive sensor calibrated for exact track and highway readings." },
      { title: "Monochrome OLED Readout", desc: "Anti-glare high-contrast screen readable in direct noon sunlight and night drives." },
      { title: "Braided Armor Hose", desc: "Flexible stainless steel reinforced conduit resists heat, abrasion, and oil." }
    ],
    specs: {
      "Measurement Range": "0 – 14.0 Bar (0 – 200 PSI)",
      "Sensor Type": "Piezoresistive Micro-Electro-Mechanical",
      "Display": "1.3-inch High Contrast Monochrome OLED",
      "Power": "Rechargeable Lithium-Polymer (USB-C)",
      "Warranty": "1 Year Official Warranty"
    }
  },
  {
    id: "aethex-ep10",
    sku: "AET-EP10-ANC",
    title: "AETHEX EP10 Wireless Hi-Fi Earbuds",
    subtitle: "Active Noise Cancelling & LDAC Lossless Codec",
    category: "Lossless Acoustics",
    description: "Lossless Hi-Fi auditory experience equipped with hybrid 42dB Active Noise Cancellation, custom 11mm graphene acoustic drivers, and ultra-low latency gaming audio streaming.",
    price: 5490,
    original_price: 7490,
    currency: "LKR",
    rating: 4.8,
    reviewCount: 96,
    badge: "HI-RES AUDIO",
    isTopDeal: true,
    isFastMoving: true,
    inStock: true,
    stock: 18,
    image_url: "/images/ep10/overview-1.jpg",
    gallery: [
      "/images/ep10/overview-1.jpg",
      "/images/ep10/overview-2.jpg",
      "/images/ep10/overview-3.jpg",
      "/images/ep10/overview-6.jpg",
      "/images/ep10/overview-8.jpg",
    ],
    source: "aethex",
    variant_id: "ep10-stealth-black",
    variants: [
      { id: "ep10-stealth-black", title: "Stealth Black", color: "Black", image_url: "/images/ep10/overview-1.jpg" },
      { id: "ep10-matte-white", title: "Matte White", color: "White", image_url: "/images/ep10/overview-2.jpg" }
    ],
    features: [
      { title: "Hybrid ANC 42dB", desc: "Dual feedforward & feedback mics cancel ambient engine, street, and air noise." },
      { title: "LDAC Lossless Audio", desc: "Streams 3x more audio data than ordinary SBC Bluetooth codecs for studio clarity." },
      { title: "36-Hour Playback", desc: "Up to 8 hours on single charge, plus 28 hours via wireless charging case." },
      { title: "IPX5 Water Resistant", desc: "Engineered to withstand heavy workouts and tropical rain conditions." }
    ],
    specs: {
      "Driver": "11mm Dynamic Graphene",
      "Bluetooth": "5.3 Ultra Low Latency (38ms)",
      "ANC Depth": "Up to 42dB Hybrid Cancellation",
      "Battery": "500mAh Case / 50mAh Buds",
      "Charging": "USB-C Fast Charge + Qi Wireless",
      "Warranty": "1 Year Official Warranty"
    }
  },
  {
    id: "aethex-apex-soundbar",
    sku: "AET-SNDB-160",
    title: "AETHEX Studio Soundbar System",
    subtitle: "160W RMS Spatial Cinema Acoustics",
    category: "Lossless Acoustics",
    description: "Architectural soundbar engineered for pure acoustic immersion. Features 4 tuned neodymium mid-frequency drivers, 2 silk dome tweeters, and downward-firing long-throw bass resonance.",
    price: 18500,
    original_price: 23000,
    currency: "LKR",
    rating: 4.9,
    reviewCount: 43,
    badge: "160W RMS",
    isTopDeal: true,
    isFastMoving: false,
    inStock: true,
    stock: 12,
    image_url: "/images/products/soundbar.jpg",
    gallery: [
      "/images/products/soundbar.jpg",
    ],
    source: "aethex",
    features: [
      { title: "Dolby Audio Decoding", desc: "Delivers crisp dialogue clarity and expansive room-filling cinematic acoustics." },
      { title: "Optical / HDMI ARC / Aux / BT", desc: "One-cable TV connection with seamless TV remote volume control." },
      { title: "Architectural Aluminum Body", desc: "Matte black brushed aluminum chassis with anti-vibration rubber dampeners." }
    ],
    specs: {
      "Power Output": "160 Watts RMS (320W Peak)",
      "Channels": "2.1 Spatial Sound Architecture",
      "Inputs": "HDMI ARC, Optical, Aux 3.5mm, USB, BT 5.3",
      "Dimensions": "Soundbar: 860 x 78 x 60 mm",
      "Warranty": "1 Year Full Replacement"
    }
  },
  {
    id: "ldnio-2500w-power-strip",
    sku: "LDN-2500W-PS",
    title: "LDNIO 2500W Multi-Port Fast Power Station",
    subtitle: "4 AC Outlets + 4 USB-A + 1 USB-C PD 30W",
    category: "Power & Connectivity",
    description: "The ultimate desktop and studio powering station. Features 4 universal AC outlets, 1 high-speed 30W USB-C Power Delivery port, and 4 Auto-ID USB-A ports with smart device detection.",
    price: 3450,
    original_price: 4200,
    currency: "LKR",
    rating: 4.8,
    reviewCount: 64,
    badge: "30W USB-C",
    isTopDeal: false,
    isFastMoving: true,
    inStock: true,
    stock: 22,
    image_url: "/images/products/power-station.jpg",
    gallery: [
      "/images/products/power-station.jpg",
    ],
    source: "thi",
    features: [
      { title: "30W USB-C Fast Charge", desc: "Directly powers modern iPhones, Samsung Galaxies, and tablets without bulky adapters." },
      { title: "Independent Master Switch", desc: "Durable silver-alloy contact switch with subtle monochromatic LED." },
      { title: "Overheating Protection", desc: "Intelligent thermal sensor cuts power automatically if internal heat exceeds 75°C." }
    ],
    specs: {
      "Input": "100-250V 50/60Hz 10A Max",
      "Total Power": "2500W Rated Capacity",
      "USB Ports": "1x USB-C PD 30W + 4x USB-A 18W",
      "Cord Length": "2.0 Meters Heavy-Duty",
      "Warranty": "1 Year Official Warranty"
    }
  },
  {
    id: "aspor-20000-powerbank",
    sku: "ASP-20K-PB",
    title: "ASPOR 20,000mAh Ultra-Slim Two-Way Power Bank",
    subtitle: "22.5W SuperCharge with Precision Digital Readout",
    category: "Power & Connectivity",
    description: "Airport TSA-approved 20,000mAh lithium-polymer battery pack with precision LED percentage readout, 22.5W Huawei SuperCharge / 20W PD support, and dual input/triple output convenience.",
    price: 4950,
    original_price: 6200,
    currency: "LKR",
    rating: 4.8,
    reviewCount: 77,
    badge: "20,000 MAH",
    isTopDeal: false,
    isFastMoving: true,
    inStock: true,
    stock: 19,
    image_url: "/images/products/powerbank.jpg",
    gallery: [
      "/images/products/powerbank.jpg",
    ],
    source: "thi",
    features: [
      { title: "Digital LED Gauge", desc: "Monochrome numeric display shows exact charge remaining down to 1%." },
      { title: "Tri-Device Simultaneous Charge", desc: "Power up two phones and a pair of earbuds at the exact same moment." },
      { title: "Airline Cabin Safe", desc: "Conforms to international IATA battery limits for unrestricted carry-on travel." }
    ],
    specs: {
      "Capacity": "20,000mAh / 74Wh Li-Polymer",
      "Max Output": "22.5W Fast Charging (QC 3.0 / PD)",
      "Input Ports": "USB-C + Micro-USB",
      "Output Ports": "2x USB-A + 1x USB-C Bi-directional",
      "Weight": "385 Grams",
      "Warranty": "1 Year Official Warranty"
    }
  },
  {
    id: "ldnio-65w-datacable",
    sku: "LDN-65W-CC",
    title: "LDNIO 65W GaN Type-C to Type-C Braided Cable (2M)",
    subtitle: "Zinc Alloy Connectors & 480Mbps Data Link",
    category: "Power & Connectivity",
    description: "Certified 65W fast-charging Type-C to Type-C cable with reinforced zinc-alloy connector housings, 480Mbps ultra-fast file transfer rate, and anti-fraying double nylon braiding.",
    price: 1450,
    original_price: 1950,
    currency: "LKR",
    rating: 4.9,
    reviewCount: 115,
    badge: "65W FAST",
    isTopDeal: true,
    isFastMoving: true,
    inStock: true,
    stock: 50,
    image_url: "/images/products/braided-cable.jpg",
    gallery: [
      "/images/products/braided-cable.jpg",
    ],
    source: "thi",
    features: [
      { title: "65W Fast Power Delivery", desc: "Charges laptops or flagship phones up to 60% in under 30 minutes." },
      { title: "E-Marker Smart Chip", desc: "Regulates current delivery safely to prevent device battery degradation." },
      { title: "30,000+ Bend Tested", desc: "High-density nylon weave jacket survives harsh bending and tension." }
    ],
    specs: {
      "Output": "20V/3.25A (65W Max)",
      "Transmission": "USB 2.0 (480Mbps)",
      "Length": "2.0 Meters",
      "Material": "Zinc Alloy + Braided Nylon",
      "Warranty": "6 Months Replacement"
    }
  },
  {
    id: "aethex-titanium-driver",
    sku: "AET-EDC-TOOL",
    title: "AETHEX Titanium EDC Precision Screwdriver Kit",
    subtitle: "Machined Grade-5 Titanium Handle with 48 S2 Steel Bits",
    category: "Precision Tools & EDC",
    description: "Machined from aerospace-grade titanium with high-torque knurled grip, silent ceramic bearing swivel cap, and 48 magnetic S2 alloy bits in a custom aluminum magnetic enclosure.",
    price: 6200,
    original_price: 7800,
    currency: "LKR",
    rating: 4.9,
    reviewCount: 52,
    badge: "TITANIUM",
    isTopDeal: true,
    isFastMoving: false,
    inStock: true,
    stock: 16,
    image_url: "/images/products/titanium-driver.jpg",
    gallery: [
      "/images/products/titanium-driver.jpg",
    ],
    source: "aethex",
    features: [
      { title: "Grade 5 Titanium Body", desc: "Lightweight, corrosion-proof handle with silent ceramic bearing top swivel." },
      { title: "48 CNC S2 Steel Bits", desc: "Hardened to 60 HRC for camera, electronics, drone, and automotive hardware repair." },
      { title: "Ejector Aluminum Vault", desc: "Push-to-release spring loaded case keeps every bit magnetically seated." }
    ],
    specs: {
      "Handle Material": "Ti-6Al-4V Grade 5 Titanium",
      "Bit Material": "S2 Hardened Alloy Steel (60 HRC)",
      "Case": "Anodized Matte Aluminum with Magnetic Retention",
      "Bit Count": "48 Specialized Micro Bits",
      "Warranty": "Lifetime Craftsmanship Guarantee"
    }
  },
  {
    id: "r8-g103-mouse",
    sku: "R8-G103-OPT",
    title: "R8 3D Wired Optical Ergonomic Mouse (G103)",
    subtitle: "Tactile Microswitches & 3200 DPI Precision Sensor",
    category: "Workspace & Ergonomics",
    description: "High-precision ergonomic productivity and gaming mouse with 4-stage DPI switching, durable tactile microswitches rated for 10 million clicks, and anti-slip ribbed textured grip.",
    price: 2100,
    original_price: 2850,
    currency: "LKR",
    rating: 4.7,
    reviewCount: 128,
    badge: "ERGONOMIC",
    isTopDeal: false,
    isFastMoving: true,
    inStock: true,
    stock: 40,
    image_url: "/images/products/mouse.jpg",
    gallery: [
      "/images/products/mouse.jpg",
    ],
    source: "thi",
    features: [
      { title: "Instant DPI Switching", desc: "Cycle between 1200 / 1600 / 2400 / 3200 DPI with one dedicated click." },
      { title: "High-Tension Microswitches", desc: "Crisp tactical actuation tested for over 10,000,000 continuous cycles." },
      { title: "Braided Shielded Cable", desc: "1.8m tangle-resistant braided cord with anti-interference ferrite core." }
    ],
    specs: {
      "DPI Range": "1200 – 3200 DPI Optical",
      "Interface": "Gold-Plated USB 2.0/3.0",
      "Cable Length": "1.8 Meters Braided",
      "Button Count": "6 Ergonomic Buttons",
      "Compatibility": "Windows / macOS / Linux",
      "Warranty": "6 Months Replacement"
    }
  }
];
