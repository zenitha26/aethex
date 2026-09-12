"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "../types/product";

export default function ProductTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState("Overview");
  
  const isEP10 = product.title.toLowerCase().includes("ep10");
  
  const tabs = ["Overview", "Specs", "FAQ", "Reviews"];

  return (
    <div className="mt-24 w-full">
      {/* Tabs Header */}
      <div className="flex space-x-8 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-lg font-medium whitespace-nowrap transition-colors relative ${
              activeTab === tab ? "text-white" : "text-white/40 hover:text-white/80"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="min-h-[400px]">
        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {isEP10 ? (
              <div className="space-y-12 max-w-5xl mx-auto">
                <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h3 className="text-4xl font-display font-bold text-white">Lossless Hi-Fi Sound</h3>
                  <p className="text-white/60 text-xl max-w-2xl mx-auto">Experience every musical detail with LDAC audio codec tech. Designed for the ultimate auditory experience.</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Feature 1 */}
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.04] transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Hi-Res Audio</h4>
                    <p className="text-white/60">LDAC codec support for 3x more data transmission than standard Bluetooth codecs, delivering high-resolution audio.</p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.04] transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
                      <span className="text-2xl">🔋</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">55H Playback</h4>
                    <p className="text-white/60">Enjoy up to 12 hours of listening on a single charge, extended to 55 hours with the charging case.</p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.04] transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Bluetooth 6.0</h4>
                    <p className="text-white/60">The latest Bluetooth V6.0 ensures a stable, ultra-low latency (58ms) connection for gaming and video.</p>
                  </div>

                  {/* Feature 4 */}
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.04] transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
                      <span className="text-2xl">🎧</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">10mm Dynamic Drivers</h4>
                    <p className="text-white/60">Large titanium-coated drivers provide deep, punchy bass and crystal clear highs for immersive sound.</p>
                  </div>

                  {/* Feature 5 */}
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.04] transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                    <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mb-6">
                      <span className="text-2xl">💧</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">IP55 Water Resistant</h4>
                    <p className="text-white/60">Sweat and splash resistant design makes them perfect for workouts and outdoor activities.</p>
                  </div>

                  {/* Feature 6 */}
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.04] transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600">
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-6">
                      <span className="text-2xl">📱</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">App Control</h4>
                    <p className="text-white/60">Customize EQ settings, check battery life, and find your earbuds using the Baseus smart app.</p>
                  </div>
                </div>

                {/* Overview Images for EP10 Pro */}
                <div className="flex flex-col gap-8 w-full items-center pt-16">
                  {[
                    "/images/ep10/overview-1.jpg",
                    "/images/ep10/overview-2.jpg",
                    "/images/ep10/overview-3.jpg",
                    "/images/ep10/overview-4.jpg",
                    "/images/ep10/overview-5.jpg",
                    "/images/ep10/overview-6.jpg",
                    "/images/ep10/overview-7.jpg",
                    "/images/ep10/overview-8.jpg",
                    "/images/ep10/overview-9.jpg",
                    "/images/ep10/overview-10.jpg",
                    "/images/ep10/overview-11.jpg"
                  ].map((src, i) => (
                    <img 
                      key={i} 
                      src={src} 
                      alt={`EP10 Pro Overview ${i + 1}`} 
                      className="w-full max-w-5xl h-auto rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700" 
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-white/60">
                <p>{product.description || "More details coming soon."}</p>
              </div>
            )}
          </div>
        )}

        {/* Specs Tab */}
        {activeTab === "Specs" && (
          <div className="animate-in fade-in duration-500 text-white/80">
            {isEP10 ? (
              <div className="space-y-16">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3">Audio</h4>
                      <ul className="space-y-2 list-disc list-inside text-white/60">
                        <li>Driver Unit: 10 mm dynamic</li>
                        <li>Frequency Response Range: 20 Hz – 40 kHz</li>
                        <li>Audio Codec: SBC, AAC, LDAC</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3">Connectivity</h4>
                      <ul className="space-y-2 list-disc list-inside text-white/60">
                        <li>Connection Mode: Bluetooth</li>
                        <li>Bluetooth Version: V6.0</li>
                        <li>Multipoint Connection: Yes</li>
                        <li>Low Latency: 58 ms</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3">Battery</h4>
                      <ul className="space-y-2 list-disc list-inside text-white/60">
                        <li>Battery Capacity: 60 mAh/ 0.231 Wh (per earbud), 600 mAh/ 2.22 Wh (charging case)</li>
                        <li>Playback Time: Approx. 12 hours (with volume at 50%, Bass Boost and Spatial Audio off)</li>
                        <li>Playback Time with Charging Case: Approx. 55 hours</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3">ANC & General</h4>
                      <ul className="space-y-2 list-disc list-inside text-white/60">
                        <li>Transparency Mode: Yes</li>
                        <li>Water Resistance: IP55</li>
                        <li>Baseus App Support: Yes</li>
                        <li>Product Materials: ABS + PC</li>
                        <li>Weight: Approx. 53 g</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* FAQ Under Specs */}
                <div className="pt-10 border-t border-white/10 space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                    <h4 className="text-lg font-bold text-white mb-2">How do I pair the earbuds?</h4>
                    <p className="text-white/60">Open the charging case and the earbuds will automatically enter pairing mode. Select "Baseus Bass EP10 Pro" in your device's Bluetooth settings.</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                    <h4 className="text-lg font-bold text-white mb-2">Is the case compatible with wireless charging?</h4>
                    <p className="text-white/60">No, the case charges via the included USB-C cable.</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                    <h4 className="text-lg font-bold text-white mb-2">Can I use one earbud at a time?</h4>
                    <p className="text-white/60">Yes, both earbuds support seamless switching and can be used independently.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white/60">
                <p>Specifications for this product will be updated shortly.</p>
              </div>
            )}
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === "FAQ" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            {isEP10 ? (
              <>
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                  <h4 className="text-lg font-bold text-white mb-2">How do I pair the earbuds?</h4>
                  <p className="text-white/60">Open the charging case and the earbuds will automatically enter pairing mode. Select "Baseus Bass EP10 Pro" in your device's Bluetooth settings.</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                  <h4 className="text-lg font-bold text-white mb-2">Is the case compatible with wireless charging?</h4>
                  <p className="text-white/60">No, the case charges via the included USB-C cable.</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                  <h4 className="text-lg font-bold text-white mb-2">Can I use one earbud at a time?</h4>
                  <p className="text-white/60">Yes, both earbuds support seamless switching and can be used independently.</p>
                </div>
              </>
            ) : (
              <div className="text-white/60">
                <p>No frequently asked questions available for this product yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "Reviews" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Customer Reviews</h3>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors font-medium">
                Write a Review
              </button>
            </div>
            
            {/* Space to add images and etc under reviews */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h4 className="text-xl font-bold text-white">Share your experience</h4>
              <p className="text-white/60 max-w-md mx-auto">
                Be the first to review this product. You can upload photos of your product to help other customers.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <div className="w-24 h-24 bg-white/5 rounded-xl border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 transition">
                  <span className="text-white/40">+ Image</span>
                </div>
                <div className="w-24 h-24 bg-white/5 rounded-xl border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 transition">
                  <span className="text-white/40">+ Image</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
