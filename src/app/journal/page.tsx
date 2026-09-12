import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import Link from "next/link";
import Image from "next/image";

const JOURNAL_ISSUES = [
  {
    id: "issue-03",
    title: "ISSUE 03",
    subtitle: "STRUCTURAL ANATOMY OF TEXTURES",
    date: "06.2026",
    readTime: "04 MIN",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" // Architectural concrete detail
  },
  {
    id: "issue-02",
    title: "ISSUE 02",
    subtitle: "THE ARCHITECTURE OF IMPACT AND CUSHION",
    date: "03.2026",
    readTime: "06 MIN",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" // Shadow abstract
  },
  {
    id: "issue-01",
    title: "ISSUE 01",
    subtitle: "VOID METAPHOR AND DISRUPTION MANIFESTO",
    date: "01.2026",
    readTime: "08 MIN",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" // High contrast skyscraper detail
  }
];

export default function JournalPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#111111] pt-32 pb-24 px-8 lg:px-16 font-sans">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-24 space-y-6">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block">
              AETHEX JOURNAL
            </span>
            <h1 className="text-5xl md:text-7xl font-light tracking-[0.2em] leading-none uppercase text-[#111111]">
              THE JOURNAL
            </h1>
          </div>

          {/* Magazine Issues Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {JOURNAL_ISSUES.map((issue) => (
              <div 
                key={issue.id}
                className="group flex flex-col justify-between h-full border-t border-gray-200 pt-8"
              >
                <div>
                  {/* Image cover frame */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F9F9F9] border border-gray-200 rounded-2xl mb-8 shadow-xs group-hover:shadow-md transition-shadow">
                    <Image
                      src={issue.image}
                      alt={issue.subtitle}
                      fill
                      priority={issue.id === "issue-03"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover grayscale group-hover:scale-[1.01] transition-transform duration-1000"
                    />
                  </div>

                  {/* Micro Meta */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">
                    <span>{issue.date}</span>
                    <span>{issue.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-medium tracking-wide uppercase mb-2 text-[#111111]">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-gray-600 tracking-wider uppercase font-normal leading-relaxed">
                    {issue.subtitle}
                  </p>
                </div>

                <div className="mt-8">
                  <span className="inline-flex items-center text-xs font-mono font-bold tracking-widest text-black hover:underline uppercase cursor-pointer">
                    Read Issue &rarr;
                  </span>
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
