"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

interface Project {
  id: string
  title: string
  year: string
  role: string
  description: string
  image: string
  thumb: string
}

const projects: Project[] = [
  {
    id: "01",
    title: "BITMEX",
    year: "2023",
    role: "Head of Design & Brand",
    description: "BitMEX is one of the key leader in centralized exchange, founded in 2014. As head of Design, I helped reposition their brand strategy.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200",
    thumb: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "02",
    title: "DEFICHAIN",
    year: "2020",
    role: "Lead Product Designer",
    description: "DefiScan is an ERC-20 explorer solution for DeFiMetachain the ethereum blockchain solution for Defichain.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200",
    thumb: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "03",
    title: "TYME BANK",
    year: "2021",
    role: "Lead Product Designer",
    description: "One of the fastest digital bank in SEA and Africa, Tyme Bank is an ambitious young bank. I worked as a lead product designer, focusing on their investment product suite and branding.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
    thumb: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=100"
  }
]

export default function ProjectShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth scroll progress for animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const index = Math.min(
        Math.floor(latest * projects.length),
        projects.length - 1
      )
      setActiveIndex(index)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <section 
      ref={containerRef} 
      className="relative bg-black" 
      style={{ height: `${projects.length * 100}vh` }}
      id="projetos"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row">
        {/* Left Bar - Navigation & Counter */}
        <div className="w-12 md:w-24 h-full flex flex-col justify-center gap-6 py-12 px-4 border-r border-white/5 z-40 bg-black">
          <div className="flex flex-col gap-8 w-full justify-center h-full">
            {projects.map((p, i) => {
              const isActive = activeIndex === i;
              return (
                <div 
                  key={p.id}
                  className="relative flex justify-center items-center"
                >
                  {/* Progress border indicator */}
                  <div className={`absolute -left-4 w-[2px] h-full transition-all duration-300 ${isActive ? 'bg-white' : 'bg-transparent'}`} />
                  
                  <div
                    className={`w-10 h-14 transition-all duration-500 overflow-hidden cursor-pointer ${
                      isActive ? 'grayscale-0 opacity-100 scale-110 border border-white/20' : 'grayscale opacity-30 hover:opacity-60 scale-100 border border-transparent'
                    }`}
                    onClick={() => {
                        const sectionHeight = containerRef.current?.offsetHeight || 0;
                        const targetScroll = (i / projects.length) * sectionHeight;
                        window.scrollTo({ top: containerRef.current?.offsetTop! + targetScroll, behavior: 'smooth' });
                    }}
                  >
                    <img src={p.thumb || p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Display Area */}
        <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden bg-black">
          
          {/* Project Title (Bottom Left Desktop) */}
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-30 pointer-events-none flex flex-col gap-2">
            <div className="font-rajdhani text-[12px] md:text-[14px] font-bold tracking-widest text-white/50 flex items-center gap-2">
              <span className="text-white">{projects[activeIndex].id}</span>
              <span className="text-white/20">/</span>
              <span>{projects.length.toString().padStart(2, '0')}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={projects[activeIndex].title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-6xl md:text-[120px] lg:text-[160px] font-sans font-black text-white leading-[0.85] tracking-tighter uppercase drop-shadow-2xl"
              >
                {projects[activeIndex].title}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Center Image Canvas */}
          <div className="flex-1 relative bg-black flex items-center justify-center p-0 md:p-0 overflow-hidden">
             <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {projects.map((project, i) => {
                  return (
                    <ProjectImage 
                      key={project.id}
                      project={project}
                      index={i}
                      progress={smoothProgress}
                      total={projects.length}
                    />
                  )
                })}
             </div>
          </div>

          {/* Right Content Area (Fixed text structure, dynamic content) */}
          <div className="w-full md:w-[320px] xl:w-[400px] h-full bg-black border-l border-white/5 p-12 flex flex-col justify-start pt-32 gap-16 z-20 relative">
             <div className="space-y-4">
                <span className="font-rajdhani text-[12px] text-white/50 uppercase tracking-[0.4em] font-medium">Year</span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={projects[activeIndex].year}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-4xl font-rajdhani font-semibold text-white tracking-widest"
                  >
                    {projects[activeIndex].year}
                  </motion.p>
                </AnimatePresence>
             </div>

             <div className="space-y-4">
                <span className="font-rajdhani text-[12px] text-white/50 uppercase tracking-[0.4em] font-medium">Role</span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={projects[activeIndex].role}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-xl font-rajdhani font-light text-white/90 tracking-wide"
                  >
                    {projects[activeIndex].role}
                  </motion.p>
                </AnimatePresence>
             </div>

             <div className="space-y-4 mt-12">
                <span className="font-rajdhani text-[12px] text-white/50 uppercase tracking-[0.4em] font-medium">Description</span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={projects[activeIndex].description}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[15px] font-rajdhani font-light text-white/70 leading-relaxed tracking-wider"
                  >
                    {projects[activeIndex].description}
                  </motion.p>
                </AnimatePresence>
             </div>

             <div className="mt-auto">
                <a href="#" className="inline-flex items-center gap-3 text-white font-rajdhani font-medium tracking-widest uppercase hover:text-white/70 transition-all group">
                   All projects <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectImage({ 
  project, 
  index, 
  progress, 
  total 
}: { 
  project: Project, 
  index: number, 
  progress: any, 
  total: number,
  key?: React.Key
}) {
  const xOffset = useTransform(progress, (v: any) => {
    const val = Number(v);
    const floatIndex = val * (total - 1);
    const dt = floatIndex - index;
    // Enter from bottom right, Leave to top left
    return `${-dt * 70}%`;
  })
  
  const yOffset = useTransform(progress, (v: any) => {
    const val = Number(v);
    const floatIndex = val * (total - 1);
    const dt = floatIndex - index;
    return `${-dt * 70}%`;
  })

  // Scales -> when Active (dt=0), scale = 1. When leaving or entering, scale shrinks down.
  const combinedScale = useTransform(progress, (v: any) => {
    const val = Number(v);
    const floatIndex = val * (total - 1);
    const dt = floatIndex - index;
    const absDt = Math.min(1, Math.abs(dt));
    return 1 - (absDt * 0.3); // Shrinks to 0.7
  })

  const combinedOpacity = useTransform(progress, (v: any) => {
    const val = Number(v);
    const floatIndex = val * (total - 1);
    const dt = floatIndex - index;
    const absDt = Math.abs(dt);
    if (absDt < 1) return 1;
    return Math.max(0, 1 - (absDt - 1) * 2); // fades out between 1 and 1.5
  })

  const zIndexVal = useTransform(progress, (v: any) => {
    const val = Number(v);
    const floatIndex = val * (total - 1);
    const dt = floatIndex - index;
    // The closer dt is to 0, the higher the z-index
    return 50 - Math.floor(Math.abs(dt) * 10);
  })

  return (
    <motion.div
      style={{
        zIndex: zIndexVal,
        position: "absolute",
        inset: 0,
        opacity: combinedOpacity,
        pointerEvents: "none",
      }}
      className="w-full h-full flex items-center justify-center p-8 md:p-16 lg:p-24 overflow-hidden"
    >
      <motion.div 
        style={{
          scale: combinedScale,
          x: xOffset,
          y: yOffset,
          transformOrigin: "center center"
        }}
        className="relative w-full max-w-lg lg:max-w-xl aspect-[4/5] overflow-hidden shadow-xl"
      >
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover" 
        />
      </motion.div>
    </motion.div>
  )
}
