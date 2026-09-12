import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import Image from "next/image";

import Link from "next/link";

const ARCHIVE_ITEMS = [
  {
    date: "09.2026",
    title: "ASPOR A711 360° HOLDER",
    status: "ACTIVE FLAGSHIP DROP",
    desc: "Engineered for vehicle cup wells (65–95mm). 360° ball swivel, 180° articulating arm, universal 4–7\" smartphone fit. Official Drop 01.",
    image: "/images/a711/cockpit_matte.jpg",
    link: "/products/aspor-a711",
    active: true,
  },
  {
    date: "Q4.2026",
    title: "AETHEX MAG-COCKPIT PRO",
    status: "IN DEVELOPMENT",
    desc: "Next-generation Qi2 magnetic induction charging cockpit mount with active cooling vents.",
    image: "/images/a711/studio_hardware.jpg",
    active: false,
  },
  {
    date: "Q1.2027",
    title: "AETHEX AERO-CLIP 01",
    status: "VAULTED BLUEPRINT",
    desc: "Ultra-low-profile CNC machined anodized aluminum automotive magnetic clamp.",
    image: "/images/a711/landscape_drive.jpg",
    active: false,
  }
];

export default function ArchivePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#111111] pt-32 pb-24 px-8 lg:px-16 font-sans">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-24 space-y-6">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block">
              AETHEX AUTOMOTIVE REGISTRY
            </span>
            <h1 className="text-5xl md:text-7xl font-light tracking-[0.2em] leading-none uppercase text-[#111111]">
              HARDWARE ARCHIVE
            </h1>
          </div>

          {/* Timeline Grid */}
          <div className="relative border-l border-gray-200 pl-8 md:pl-16 space-y-24">
            {ARCHIVE_ITEMS.map((item) => (
              <div key={item.title} className="relative group">
                
                {/* Timeline circle indicator */}
                <div className="absolute -left-[37px] md:-left-[69px] top-1.5 w-2 h-2 rounded-full bg-gray-300 group-hover:bg-black transition-colors duration-500" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Date & Status */}
                  <div className="md:col-span-3 space-y-2">
                    <span className="text-2xl font-mono tracking-widest block font-bold text-[#111111]">
                      {item.date}
                    </span>
                    <span className="text-[9px] font-mono tracking-wider bg-gray-100 border border-gray-200 px-2.5 py-1 inline-block text-gray-700 font-semibold uppercase">
                      {item.status}
                    </span>
                  </div>

                  {/* Mid Column: Details */}
                  <div className="md:col-span-5 space-y-4">
                    <h3 className="text-xl font-medium tracking-wide uppercase text-[#111111]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                    {item.active && item.link && (
                      <div className="pt-2">
                        <Link href={item.link} className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-black hover:underline uppercase">
                          ENTER DROP &rarr;
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Mini image preview */}
                  <div className="md:col-span-4 flex justify-end">
                    <div className="w-40 h-28 bg-[#F9F9F9] border border-gray-200 relative overflow-hidden flex items-center justify-center p-2 rounded-xl shadow-xs group-hover:shadow-md transition-all duration-700">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </>
  );
}
