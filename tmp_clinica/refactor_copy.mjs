import fs from 'fs';

const filePath = 'public/template-clinica/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// Hero Section
content = content.replace(
  /Transforme seu Sorriso com <span class="text-gradient">Excelência<\/span> e Tecnologia/gi,
  'Seu Implante Definitivo com <span class="text-gradient">Odontologia Digital<\/span> em 1 Dia'
);
content = content.replace(
  /Especialistas em implantes e estética dental em um ambiente de luxo projetado para o seu conforto absoluto e resultados extraordinários./gi,
  'Na ImplArt, aliamos Centro Radiológico Próprio, Laboratório 3D e Cirurgia Guiada sem cortes para entregar seu sorriso renovado com Carga Imediata (Day Clinic).'
);

// Services Section
content = content.replace(/Odontologia Estética Avançada/g, 'Implantes de Carga Imediata');
content = content.replace(/Facetas de porcelana e lentes de contato dental criadas digitalmente para transformar sua aparência com total naturalidade./g, 'Planejamento digital com cirurgia guiada sem cortes para que você saia com dentes fixos no mesmo dia (Day Clinic).');

content = content.replace(/Implantes Computadorizados/g, 'Centro Radiológico e Laboratório 3D');
content = content.replace(/Reabilitação oral completa utilizando tecnologia guiada por computador, garantindo cirurgias minimamente invasivas e precisão milimétrica./g, 'Raio-X panorâmico, tomografias computadorizadas e impressoras 3D integradas. Planejamento e execução de alto nível sem precisar sair da clínica.');

content = content.replace(/Harmonização Facial/g, 'Odontologia Digital & Scanners');
content = content.replace(/Procedimentos estéticos de alta performance para equilibrar as proporções do seu rosto e destacar a beleza natural do seu sorriso./g, 'Moldagens confortáveis e rápidas, sem massinhas incômodas. Utilizamos scanners intraorais para um design do sorriso com precisão suíça.');

content = content.replace(/Agende sua Avaliação Premium/g, 'Agendar Avaliação com Tomografia');

// About Section
content = content.replace(/A ImplArt nasceu com um propósito único:/g, 'Nossa expertise em Reabilitação Oral nasceu com um propósito:');
content = content.replace(/Elevar o padrão da odontologia no Brasil. Fundada por uma equipe de especialistas com formação internacional, nossa clínica não é apenas um espaço de tratamento, mas um refúgio de luxo dedicado à sua saúde e estética./g, 'Tornar os implantes dentários previsíveis, indolores e tecnológicos. Somos pioneiros no Brasil em unificar atendimento, radiologia e prótese em um só lugar de altíssimo padrão, reduzindo meses de espera para apenas alguns dias.');

// CTA Final
content = content.replace(/Pronto para sua Transformação?/g, 'Pronto para seu Novo Sorriso Fixo?');
content = content.replace(/Descubra a diferença de ser atendido por uma equipe focada na perfeição. Sua jornada para o sorriso ideal começa aqui./g, 'O melhor investimento da sua vida exige a melhor infraestrutura. Fale agora com nossa equipe e agende sua primeira análise digital.');

fs.writeFileSync(filePath, content);
console.log('Copywriters da ESCOM agiram: Refatoração de textos concluída com foco em Day Clinic, Implantes e Laboratório Próprio da Implart!');
