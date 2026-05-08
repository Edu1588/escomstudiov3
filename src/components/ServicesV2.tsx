import { DynamicFrameLayout } from "@/components/ui/dynamic-frame-layout";

export default function ServicesV2() {
  const services = [
    {
      id: 1,
      title: "UI/UX DESIGN",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
      defaultPos: { x: 0, y: 0, w: 4, h: 4 },
      mediaSize: 1.1,
    },
    {
      id: 2,
      title: "BRANDING & ESTRATÉGIA",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800",
      defaultPos: { x: 4, y: 0, w: 4, h: 4 },
      mediaSize: 1.1,
    },
    {
      id: 3,
      title: "WEB DESIGN PERFORMANCE",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
      defaultPos: { x: 8, y: 0, w: 4, h: 4 },
      mediaSize: 1.1,
    },
    {
      id: 4,
      title: "DESIGN SAAS & DASHBOARDS",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      defaultPos: { x: 0, y: 4, w: 4, h: 4 },
      mediaSize: 1.1,
    },
    {
      id: 5,
      title: "DIREÇÃO CRIATIVA",
      image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800",
      defaultPos: { x: 4, y: 4, w: 4, h: 4 },
      mediaSize: 1.1,
    },
    {
      id: 6,
      title: "MVP & PRODUTOS",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
      defaultPos: { x: 8, y: 4, w: 4, h: 4 },
      mediaSize: 1.1,
    },
    {
      id: 7,
      title: "ECOMMERCE",
      image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800",
      defaultPos: { x: 0, y: 8, w: 4, h: 4 },
      mediaSize: 1.1,
    },
    {
      id: 8,
      title: "MARKETING DIGITAL",
      image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=800",
      defaultPos: { x: 4, y: 8, w: 4, h: 4 },
      mediaSize: 1.1,
    },
    {
      id: 9,
      title: "APP DEVELOPMENT",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
      defaultPos: { x: 8, y: 8, w: 4, h: 4 },
      mediaSize: 1.1,
    },
  ];

  return (
    <section className="py-32 bg-black relative overflow-hidden w-full" id="serviços-v2">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16">
          <div className="flex flex-col">
            <div className="px-3 py-1 border border-[#00e300]/20 rounded-none mb-8 inline-block self-start">
              <span className="font-rajdhani text-[10px] tracking-widest text-[#00e300] uppercase font-bold">[ NOSSOS_SERVIÇOS ]</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9] font-rajdhani m-0">
              O QUE<br />FAZEMOS
            </h2>
          </div>
          <div className="mt-8 md:mt-0 md:max-w-md pb-2">
            <p className="font-rajdhani text-sm md:text-lg font-light text-white/70 tracking-wide leading-relaxed">
              Design com propósito comercial e infraestrutura tecnológica integrada para máxima performance.
            </p>
          </div>
        </div>
      </div>

      <div className="relative aspect-square md:aspect-video w-full border-y border-white/5 overflow-hidden bg-black mt-8">
        <DynamicFrameLayout 
          frames={services} 
          className="w-full h-full" 
          hoverSize={6}
          gapSize={2}
          showFrames={false}
        />
      </div>
    </section>
  );
}
