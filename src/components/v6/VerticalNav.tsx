import { useEffect, useState } from "react";

export function VerticalNav() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  const menu = [
    { id: "top", label: "START" },
    { id: "solucoes", label: "SOLUTIONS" },
    { id: "processo", label: "PROCESS" },
    { id: "projetos", label: "WORK" },
    { id: "sobre", label: "STUDIO" },
    { id: "insights", label: "AUDIENCE" },
    { id: "diagnostico", label: "DIAGNOSIS" },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 z-40 hidden xl:flex flex-col pointer-events-none mix-blend-difference text-[#ECECE3]">
      {/* 4-square icon (like Pear's logo in the corner) */}
      <div className="absolute left-[8vw] top-[10vh] grid grid-cols-2 gap-[2px] opacity-80">
        <div className="w-1.5 h-1.5 bg-current"></div>
        <div className="w-1.5 h-1.5 bg-current"></div>
        <div className="w-1.5 h-1.5 bg-current"></div>
        <div className="w-1.5 h-1.5 bg-current"></div>
      </div>
      
      {/* Left & Right vertical lines */}
      <div className="absolute left-[8vw] top-0 bottom-0 border-l border-current opacity-30" />
      <div className="fixed right-[8vw] top-0 bottom-0 border-r border-current opacity-30 pointer-events-none mix-blend-difference text-[#ECECE3] z-40 hidden xl:block" />
      
      <div className="flex-1 flex flex-col justify-center w-64 relative z-10 space-y-12">
        {menu.map((item) => {
          const isActive = item.id === activeSection;
          return (
            <div key={item.id} className="relative flex items-center transition-all duration-500 h-4">
              {/* Horizontal line extending outwards */}
              <div 
                className={`absolute left-[8vw] h-px bg-current transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'w-8 opacity-100' : 'w-2 opacity-50'}`}
              />
              <span 
                className={`absolute left-[calc(8vw+3rem)] font-mono text-[9px] uppercase tracking-[0.2em] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'opacity-100 translate-x-0 font-bold' : 'opacity-0 -translate-x-2'}`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
