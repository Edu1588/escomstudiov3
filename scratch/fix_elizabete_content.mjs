import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/template-elizabete/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Substituir cores do Tailwind de roxo para Azul Tiffany/Ciano
const oldColors = `"colors": {
                        "implart": {
                            "900": "#3B0764",
                            "800": "#581C87",
                            "700": "#6B21A8",
                            "600": "#7E22CE",
                            "500": "#9333EA",
                            "400": "#A855F7",
                            "50": "#FAF5FF"
                        }
                    }`;

const newColors = `"colors": {
                        "implart": {
                            "900": "#00363a",
                            "800": "#004d40",
                            "700": "#006064",
                            "600": "#00838f",
                            "500": "#00acc1",
                            "400": "#26c6da",
                            "50": "#e0f7fa"
                        }
                    }`;

// Tenta substituição do bloco de cores
if (html.includes('900: \'#3B0764\'') || html.includes('900: "#3B0764"')) {
  html = html.replace(/900:\s*['"]#3B0764['"]/g, '900: "#00363a"');
  html = html.replace(/800:\s*['"]#581C87['"]/g, '800: "#004d40"');
  html = html.replace(/700:\s*['"]#6B21A8['"]/g, '700: "#006064"');
  html = html.replace(/600:\s*['"]#7E22CE['"]/g, '600: "#00838f"');
  html = html.replace(/500:\s*['"]#9333EA['"]/g, '500: "#00acc1"');
  html = html.replace(/400:\s*['"]#A855F7['"]/g, '400: "#26c6da"');
  html = html.replace(/50:\s*['"]#FAF5FF['"]/g, '50: "#e0f7fa"');
  console.log("Cores substituídas com sucesso!");
} else {
  // Fallback se estiver de outra forma
  html = html.replace(/#3B0764/g, '#00363a');
  html = html.replace(/#581C87/g, '#004d40');
  html = html.replace(/#6B21A8/g, '#006064');
  html = html.replace(/#7E22CE/g, '#00838f');
  html = html.replace(/#9333EA/g, '#00acc1');
  html = html.replace(/#A855F7/g, '#26c6da');
  html = html.replace(/#FAF5FF/g, '#e0f7fa');
  console.log("Cores substituídas por substituição global de hexadecimais.");
}

// 2. Substituir textos institucionais e técnicos
// Substituições exatas de termos
const replacements = [
  { old: "Clínica ImplArt", new: "Dra. Elizabete De Marchi" },
  { old: "ImplArt", new: "Dra. Elizabete De Marchi" },
  { old: "Implantes Dentários e Odontologia Digital", new: "Biomedicina Estética Avançada" },
  { old: "implantes dentarios, clinica odontologica, day clinic, odontologia digital, zircônia, protese dentaria, clinica implart, dentista sao paulo, roberto markarian", new: "biomedicina estetica, harmonizacao facial, preenchimento labial, botox curitiba, fios de pdo, dra elizabete de marchi, batel curitiba" },
  { old: "Avenida Paulista, 2006", new: "Av. Sete de Setembro, 5402" },
  { old: "Avenida Paulista 2006", new: "Av. Sete de Setembro 5402" },
  { old: "São Paulo", new: "Curitiba" },
  { old: "SP", new: "PR" },
  { old: "01310-200", new: "80240-000" },
  { old: "+551132624750", new: "+5541996655769" },
  { old: "(11) 3262-4750", new: "(41) 99665-5769" },
  { old: "Dr. Roberto Markarian", new: "Dra. Elizabete De Marchi" },
  { old: "Roberto Markarian", new: "Dra. Elizabete De Marchi" },
  { old: "dentista", new: "biomédica esteta" },
  { old: "Dentista", new: "Biomédica Esteta" },
  { old: "odontologia digital", new: "estética avançada" },
  { old: "Odontologia Digital", new: "Estética Avançada" },
  { old: "Day Clinic", new: "Estética Avançada" },
  { old: "day clinic", new: "procedimentos rápidos" },
  { old: "implantes dentários", new: "procedimentos estéticos" },
  { old: "Implantes Dentários", new: "Procedimentos Estéticos" },
  { old: "implante dentário", new: "procedimento estético" },
  { old: "Implante Dentário", new: "Procedimento Estético" },
  { old: "coroas de Zircônia", new: "tratamentos com Botox e preenchimento" },
  { old: "coroas de zircônia", new: "fios de PDO e bioestimuladores" },
  { old: "reabilitações em Zircônia 3D", new: "rejuvenescimento facial natural" },
  { old: "dossie-clinica-implart.pdf", new: "dossie.pdf" }
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
  html = html.replace(regex, r.new);
});

// 3. Modificar especialidades/cards de serviços específicos
// Substituir títulos e textos de serviços de implantes para injetáveis estéticos
html = html.replace("Implantes Dentários", "Toxina Botulínica");
html = html.replace("Próteses e Zircônia", "Preenchimento Labial");
html = html.replace("Estética e Facetas", "Fios de PDO & Colágeno");
html = html.replace("Tecnologia 3D", "Bioestimuladores");

// Ajustes extras de conteúdo nos cards
html = html.replace("coroas computadorizadas em zircônia", "aplicação precisa de toxina botulínica para rugas");
html = html.replace("Day Clinic de implantes e próteses", "harmonização facial sutil e natural de alto padrão");
html = html.replace("laboratório digital próprio com scanners", "protocolos de bioestimuladores para rejuvenescimento facial");

fs.writeFileSync(filePath, html, 'utf8');
console.log("Template customizado para a Dra. Elizabete De Marchi criado com sucesso!");
