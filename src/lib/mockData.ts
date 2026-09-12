import { Product } from "../types/product";

export const CATEGORIES = [
  { id: "all", name: "All Products", count: 11 },
  { id: "mobile-tablets", name: "Mobile & Tablets", count: 2, icon: "Smartphone" },
  { id: "computers-accessories", name: "Computers & Accessories", count: 2, icon: "Laptop" },
  { id: "tv-entertainment", name: "TV & Entertainment", count: 2, icon: "Tv" },
  { id: "home-appliances", name: "Home Appliances", count: 1, icon: "Home" },
  { id: "kitchen-appliances", name: "Kitchen Appliances", count: 1, icon: "Utensils" },
  { id: "power-tools-generators", name: "Power Tools & Generators", count: 1, icon: "Wrench" },
  { id: "cable-connectivity", name: "Cable & Connectivity", count: 2, icon: "Cpu" },
  { id: "automotive", name: "Automotive Hardware", count: 1, icon: "Shield" },
];

export const mockProducts: Product[] = [
  {
    id: "aspor-a711",
    title: "ASPOR A711 360° Console Mount",
    subtitle: "Mechanical Cup-Holder Articulating Mount",
    category: "Automotive Hardware",
    description: "Engineered for uncompromising stability and driver ergonomics. The ASPOR A711 locks seamlessly into standard cup holders, providing full 360-degree rotation, 180-degree arm adjustment, and complete single-handed phone release.",
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
      { title: "360° Rotation", desc: "Precision ball joint for instant switch between portrait navigation and landscape radar mode." },
      { title: "180° Articulating Arm", desc: "Dual aluminum tension joints elevate phone up to 280mm in driver sightline." },
      { title: "Expanding Cup Base", desc: "Knurled dial expands 3 silicone-dampened lugs (65mm–95mm) into center console." },
      { title: "Universal Clamp", desc: "Spring-loaded silicone pads securely support devices from 4.0\" to 7.0\"." }
    ],
    specs: {
      "Rotation": "360° Free Ball Pivot",
      "Arm Arc": "180° Articulating Reach",
      "Base Bore": "65mm – 95mm Adjustable",
      "Phone Span": "4.0\" – 7.0\" Display Width",
      "Material": "Reinforced ABS + Polycarbonate",
      "Mounting": "Expanding Mechanical Lug",
      "Warranty": "6 Months Replacement"
    }
  },
  {
    id: "aethex-ep10",
    title: "AETHEX EP10 Wireless Hi-Fi Earbuds",
    subtitle: "Active Noise Cancelling & LDAC Codec",
    category: "TV & Entertainment",
    description: "Lossless Hi-Fi auditory experience equipped with hybrid 42dB Active Noise Cancellation, custom 11mm graphene acoustic drivers, and low-latency gaming pass-through.",
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
    id: "r8-g103-mouse",
    title: "R8 3D Wired Optical Gaming Mouse (G103)",
    subtitle: "Ergonomic 3200 DPI Optical Engine",
    category: "Computers & Accessories",
    description: "High-precision ergonomic gaming and productivity mouse with 4-stage DPI switching, durable tactile microswitches rated for 10 million clicks, and anti-slip ribbed textured grip.",
    price: 2100,
    original_price: 2850,
    currency: "LKR",
    rating: 4.7,
    reviewCount: 128,
    badge: "POPULAR",
    isTopDeal: false,
    isFastMoving: true,
    inStock: true,
    stock: 40,
    image_url: "/images/ep10/overview-5.jpg",
    gallery: [
      "/images/ep10/overview-5.jpg",
      "/images/ep10/overview-7.jpg",
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
      "Button Count": "6 Programmable Buttons",
      "Compatibility": "Windows / macOS / Linux",
      "Warranty": "6 Months Replacement"
    }
  },
  {
    id: "ldnio-5m-extension",
    title: "LDNIO 5M Heavy-Duty Extension Cord",
    subtitle: "2500W Universal Surge-Protected Power Cord",
    category: "Cable & Connectivity",
    description: "Commercial-grade 5-meter extension cord built with 100% pure copper core wire, child-safety shutter protection, flame-retardant 850°C V0 shell, and 2500W overload protection.",
    price: 2875,
    original_price: 3500,
    currency: "LKR",
    rating: 4.9,
    reviewCount: 82,
    badge: "TOP DEAL",
    isTopDeal: true,
    isFastMoving: false,
    inStock: true,
    stock: 35,
    image_url: "/images/ep10/overview-4.jpg",
    gallery: [
      "/images/ep10/overview-4.jpg",
      "/images/ep10/overview-11.jpg",
    ],
    source: "thi",
    features: [
      { title: "5 Meter Cable Reach", desc: "Heavy-duty 3x0.75mm² copper cable ensures zero voltage drop across large rooms." },
      { title: "2500W Overload Circuit", desc: "Integrated smart breaker trips instantly to protect delicate appliances." },
      { title: "Child Safety Lock", desc: "Internal shutters prevent accidental insertion of objects into sockets." }
    ],
    specs: {
      "Rated Power": "2500W – 10A Max 250V",
      "Cable Length": "5.0 Meters Pure Copper",
      "Material": "850°C Fireproof PC Shell",
      "Outlets": "3 Universal Multi-Standard Sockets",
      "Warranty": "1 Year Official Warranty"
    }
  },
  {
    id: "ldnio-2500w-power-strip",
    title: "LDNIO 2500W Multi-Port Fast Power Strip",
    subtitle: "4 AC Outlets + 4 USB-A + 1 USB-C PD 30W",
    category: "Cable & Connectivity",
    description: "The ultimate desktop powering station. Features 4 universal AC outlets, 1 high-speed 30W USB-C Power Delivery port, and 4 Auto-ID USB-A ports with smart device detection.",
    price: 3450,
    original_price: 4200,
    currency: "LKR",
    rating: 4.8,
    reviewCount: 64,
    badge: "FAST CHARGE",
    isTopDeal: false,
    isFastMoving: true,
    inStock: true,
    stock: 22,
    image_url: "/images/ep10/overview-9.jpg",
    gallery: [
      "/images/ep10/overview-9.jpg",
      "/images/ep10/overview-10.jpg",
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
    id: "ldnio-65w-datacable",
    title: "LDNIO 65W PD Type-C High Speed Data Cable",
    subtitle: "Zinc Alloy Connector & Nylon Braided Cord (2M)",
    category: "Mobile & Tablets",
    description: "Certified 65W fast-charging Type-C to Type-C cable with reinforced zinc-alloy connector housings, 480Mbps ultra-fast file transfer rate, and anti-fraying double nylon braiding.",
    price: 1450,
    original_price: 1950,
    currency: "LKR",
    rating: 4.9,
    reviewCount: 115,
    badge: "HOT PICK",
    isTopDeal: true,
    isFastMoving: true,
    inStock: true,
    stock: 50,
    image_url: "/images/a711/isolated.jpg",
    gallery: [
      "/images/a711/isolated.jpg",
      "/images/ep10/overview-11.jpg",
    ],
    source: "thi",
    features: [
      { title: "65W Fast Power Delivery", desc: "Charges a modern laptop or flagship phone up to 60% in under 30 minutes." },
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
    id: "aspor-20000-powerbank",
    title: "ASPOR 20,000mAh Ultra-Slim Fast Power Bank",
    subtitle: "22.5W Two-Way SuperCharge with Digital Display",
    category: "Mobile & Tablets",
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
    image_url: "/images/ep10/overview-3.jpg",
    gallery: [
      "/images/ep10/overview-3.jpg",
      "/images/ep10/overview-8.jpg",
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
    id: "aethex-apex-soundbar",
    title: "AETHEX Studio Soundbar System",
    subtitle: "160W RMS Cinema Audio with Dedicated Subwoofer",
    category: "TV & Entertainment",
    description: "Engineered for pure acoustic immersion. Features 4 tuned neodymium mid-frequency drivers, 2 silk dome tweeters, and a separate downward-firing long-throw bass transducer.",
    price: 18500,
    original_price: 23000,
    currency: "LKR",
    rating: 4.9,
    reviewCount: 43,
    badge: "FLAGSHIP",
    isTopDeal: true,
    isFastMoving: false,
    inStock: true,
    stock: 12,
    image_url: "/images/ep10/overview-6.jpg",
    gallery: [
      "/images/ep10/overview-6.jpg",
      "/images/ep10/overview-7.jpg",
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
    id: "aethex-vortex-vacuum",
    title: "AETHEX Turbo Cordless Cyclone Vacuum",
    subtitle: "22,000Pa Brushless Motor with Multi-Stage HEPA 13",
    category: "Home Appliances",
    description: "Featherlight 1.2kg handheld cordless vacuum boasting an ultra-durable 100,000 RPM digital motor, motorized anti-tangle LED floor brush, and 45-minute fade-free runtime.",
    price: 14200,
    original_price: 17500,
    currency: "LKR",
    rating: 4.7,
    reviewCount: 39,
    badge: "22K PA",
    isTopDeal: false,
    isFastMoving: true,
    inStock: true,
    stock: 15,
    image_url: "/images/a711/macro_arm.jpg",
    gallery: [
      "/images/a711/macro_arm.jpg",
      "/images/a711/studio_hardware.jpg",
    ],
    source: "aethex",
    features: [
      { title: "22,000Pa Suction Power", desc: "Effortlessly extracts stubborn fine dust, pet hair, and debris from carpets and tiles." },
      { title: "0.3μm HEPA 13 Filtration", desc: "Traps 99.97% of airborne allergens, releasing pure filtered exhaust air." },
      { title: "LED Floor Illumination", desc: "Front LED headlamps expose hidden dust under beds and low furniture." }
    ],
    specs: {
      "Motor": "100,000 RPM Digital Brushless",
      "Suction Pressure": "22,000 Pa Max",
      "Battery Life": "Up to 45 Mins (Eco Mode)",
      "Dust Bin": "0.6 Liters One-Touch Dump",
      "Weight": "1.25 kg Ultralight Main Body",
      "Warranty": "1 Year Official Warranty"
    }
  },
  {
    id: "aethex-chef-pro-mixer",
    title: "AETHEX Precision Kitchen Blender & Mixer",
    subtitle: "1200W Commercial High-Speed Ice Crusher",
    category: "Kitchen Appliances",
    description: "Heavy-duty culinary blender equipped with 6-leaf surgical stainless steel blades, BPA-free 2.0L Tritan jar, and variable speed pulse dial for smoothies, nut butters, and spices.",
    price: 8900,
    original_price: 11500,
    currency: "LKR",
    rating: 4.8,
    reviewCount: 51,
    badge: "1200W POWER",
    isTopDeal: true,
    isFastMoving: false,
    inStock: true,
    stock: 14,
    image_url: "/images/a711/macro_base.jpg",
    gallery: [
      "/images/a711/macro_base.jpg",
      "/images/ep10/overview-10.jpg",
    ],
    source: "aethex",
    features: [
      { title: "1200W Pure Copper Motor", desc: "Pulverizes ice cubes, frozen fruits, and tough grains in under 15 seconds." },
      { title: "Laser-Cut Stainless Blades", desc: "Engineered 6-axis blade geometry creates a high-velocity vortex." },
      { title: "Safety Interlock System", desc: "Will not engage unless jar is locked securely onto motor base." }
    ],
    specs: {
      "Power": "1200W Continuous Peak",
      "Jar Capacity": "2.0 Liters Tritan Food-Grade",
      "Speed Control": "Stepless Dial + Pulse Switch",
      "Blade Material": "304 Stainless Steel 6-Leaf",
      "Warranty": "1 Year Official Warranty"
    }
  },
  {
    id: "aethex-pro-impact-drill",
    title: "AETHEX Industrial 21V Brushless Impact Drill",
    subtitle: "65Nm Torque Heavy-Duty Kit with Dual 4.0Ah Batteries",
    category: "Power Tools & Generators",
    description: "Job-site ready 21V cordless hammer impact driver with high-efficiency brushless motor, 25+3 clutch torque settings, 13mm all-metal ratcheting chuck, and heavy-duty carry case.",
    price: 16900,
    original_price: 21000,
    currency: "LKR",
    rating: 4.9,
    reviewCount: 34,
    badge: "DUAL BATTERY",
    isTopDeal: true,
    isFastMoving: false,
    inStock: true,
    stock: 8,
    image_url: "/images/a711/studio_hardware.jpg",
    gallery: [
      "/images/a711/studio_hardware.jpg",
      "/images/a711/hero.jpg",
    ],
    source: "aethex",
    features: [
      { title: "65Nm Max Torque", desc: "Effortlessly drills through concrete, masonry, hardwood, and thick steel plates." },
      { title: "Dual 4.0Ah Lithium Packs", desc: "Includes two high-capacity battery packs with rapid 45-minute smart charger." },
      { title: "All-Metal 13mm Chuck", desc: "Industrial keyless ratcheting chuck prevents bit slippage during high impacts." }
    ],
    specs: {
      "Voltage": "21V Max Lithium-Ion",
      "Torque": "65 Nm / 25+3 Positions",
      "Speed": "0-450 / 0-1650 RPM Dual Gear",
      "Chuck": "13mm (1/2\") All-Metal Ratchet",
      "Kit Includes": "Drill, 2x Batteries, Fast Charger, Case",
      "Warranty": "1 Year Commercial Warranty"
    }
  }
];
