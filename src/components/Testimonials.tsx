import { motion } from "motion/react";
import { TextEffect } from '@/components/ui/text-effect';
import { TestimonialsColumn } from "./ui/testimonials-columns-1";

const testimonials = [
  {
    text: "Design sofisticado aliado a uma estratégia de negócio impecável. Recomendo fortemente.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Mariana Costa",
    role: "Diretora de Marketing",
  },
  {
    text: "Trabalho de altíssimo nível. A infraestrutura integrada facilitou muito nossa operação.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "André Santos",
    role: "Founder, StartupX",
  },
  {
    text: "A ESCOM transformou completamente nossa presença digital. O foco em conversão trouxe resultados imediatos.",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    name: "Ricardo Silva",
    role: "CEO, TechFlow",
  },
  {
    text: "A melhor decisão tecnológica que tomamos este ano. Suporte e qualidade nota 10.",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    name: "Sofia Reis",
    role: "Business Lead",
  },
  {
    text: "Inovação e entrega real. O sistema centralizou tudo o que precisávamos.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Julia Lopes",
    role: "Marketing Manager",
  },
  {
    text: "Performance impecável. O site carrega instantaneamente e converte muito mais.",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    name: "Felipe Melo",
    role: "Product Owner",
  },
  {
    text: "Nossa operação agora é contínua, sem paradas ou lentidão. Incrível suporte técnico.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Gabriel Martins",
    role: "Head of Growth",
  },
  {
    text: "Os layouts propostos não apenas parecem ótimos, mas convertem usuários em clientes rapidamente.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Aline Ferreira",
    role: "E-commerce Manager",
  },
  {
    text: "Comunicação clara e prazos sempre cumpridos. Sem dúvida a agência mais séria que já contratamos.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Caio Mendes",
    role: "CTO",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
  return (
    <section className="py-32 px-6 bg-black text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="container mx-auto z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(20px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-24"
        >
          <div className="inline-block px-4 py-1 border border-primary/20 rounded-none mb-8 bg-primary/5">
            <span className="font-mono text-[10px] tracking-widest text-primary uppercase">[ TESTEMUNHOS ]</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black font-tech uppercase leading-tight mb-5">
            O QUE DIZEM NOSSOS PARCEIROS
          </h2>
          <TextEffect preset="blur" per="word" as="p" className="text-center font-mono text-[11px] text-white/50 tracking-widest uppercase">
            Veja o impacto de integrar design estratégico e engenharia de conversão.
          </TextEffect>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
