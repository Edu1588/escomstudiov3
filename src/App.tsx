/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { logPageView } from "./lib/analytics";

// Components
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HeroV2 from "./components/HeroV2";
import Stats from "./components/Stats";
import Services from "./components/Services";
import ServicesV2 from "./components/ServicesV2";
import Infrastructure from "./components/Infrastructure";
import ValueProposition from "./components/ValueProposition";
import CostAnalysis from "./components/CostAnalysis";
import PortfolioGrid from "./components/PortfolioGrid";
import ProjectShowcase from "./components/ProjectShowcase";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import AboutV2 from "./components/AboutV2";
import FAQV2 from "./components/FAQV2";

// New Components
import ThumbCarousel from "./components/ThumbCarousel";
import DataDrivenProjects from "./components/DataDrivenProjects";
import AbsoluteControl from "./components/AbsoluteControl";
import FAQ from "./components/FAQ";
import BackToTop from "./components/BackToTop";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<"v1" | "v2">("v1");

  useEffect(() => {
    logPageView("HOME");
  }, []);

  return (
    <main className="relative">
      <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <div className="flex flex-col">
          {version === "v1" && <Navbar />}
          
          {version === "v1" ? (
            <>
              <Hero />
              <Stats />
              <Services />
              <ThumbCarousel />
              <DataDrivenProjects />
              <AbsoluteControl />
              
              <CostAnalysis />
              <Testimonials />
              <ValueProposition />

              <section className="py-32 px-6 bg-black relative border-t border-white/5" id="sobre">
                 <div className="container mx-auto max-w-4xl text-center">
                    <div className="inline-block px-4 py-1 border border-primary/20 rounded-md mb-8">
                       <span className="font-mono text-[10px] tracking-widest text-primary uppercase">[ MANIFESTO ]</span>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black font-tech mb-8 uppercase leading-tight">O PODER DA <br /> ENGENHARIA DIGITAL</h2>
                    <p className="text-white/40 font-mono text-[11px] tracking-[0.2em] leading-relaxed mb-16 uppercase font-bold max-w-3xl mx-auto">
                      A ESCOM desenvolve sistemas que operam em harmonia com seus objetivos comerciais. Unimos design estratégico e infraestrutura inteligente para transformar sua presença online em um sistema funcional de crescimento sustentável.
                    </p>
                    <div className="flex justify-center">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        className="w-20 h-20 rounded-full border border-primary/20 flex items-center justify-center hover:border-primary transition-all duration-700 cursor-pointer bg-primary/5"
                      >
                        <ArrowUpRight size={40} className="text-primary" />
                      </motion.div>
                    </div>
                 </div>
              </section>

              <Contact />
              <FAQ />
              <Footer />
            </>
          ) : (
            <>
              <HeroV2 />
              <ServicesV2 />
              <AbsoluteControl />
              <ProjectShowcase />
              <DataDrivenProjects />
              <CostAnalysis />
              <ValueProposition />
              <Testimonials />
              <FAQV2 />
              <Contact />
              <Footer />
            </>
          )}

          <BackToTop />
          
          {/* Version Toggle Switch - Discrete floating button */}
          <button 
            onClick={() => setVersion(version === "v1" ? "v2" : "v1")}
            className="fixed bottom-10 left-10 z-[150] bg-white/5 hover:bg-primary/20 border border-white/10 rounded-full px-6 py-2 transition-all flex items-center gap-3 group overflow-hidden"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[8px] tracking-[0.3em] text-white/40 group-hover:text-primary transition-colors uppercase font-bold">
              SWITCH_TO_{version === "v1" ? "V2" : "V1"}
            </span>
          </button>
        </div>
      )}


      {/* Global CSS */}
      <style>{`
        /* Remove italics global */
      `}</style>
    </main>
  );
}

