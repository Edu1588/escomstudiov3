import fs from 'fs';

const novaEntrada = [
  '## 04/11/2026: Réplica Enerblock com Identidade ESCOM Studio, Hero 3D Oficial, Módulos Isométricos e Linha Guiada',
  '',
  '* **Réplica da Home Enerblock (https://enerblock.net/en/) adaptada para a ESCOM Studio:**',
  '  * Cores convertidas de Vermelho/Laranja (#FF5949) para Ciano Elétrico (#00E5FF).',
  '  * Copy, portfólio, depoimentos, metodologia e pilares atualizados com os dados reais da ESCOM Studio (crescimento digital, Next.js, automações, IA, tráfego e BI).',
  '  * Servido localmente na porta 3000 via `npx tsx server.ts` em http://localhost:3000/ e http://localhost:3000/en/.',
  '* **Hero 3D Oficial da ESCOM integrado no Hero do Enerblock:**',
  '  * Robô agachado (`robo-agachado.glb`), borboleta voando com rastro de partículas (`floresta.glb` -> `butterfly_6`), chão molhado reflexivo com shader customizado (`Reflector` + `SHADER_CHAO_MOLHADO`), galpão industrial em wireframe blueprint ciano ao fundo (`galpao.glb`), névoa escura e iluminação ciano.',
  '  * Compilado via `scripts/escom-hero-blueprint-entry.ts` para `public/js/escom-hero-blueprint.js` com Three.js embutido.',
  '* **6 Módulos 3D Isométricos em Blueprint em "O que fazemos" (#solucoes):**',
  '  * Criado `public/js/escom-service-animations.js` com cenas Three.js procedurais em wireframe isométrico ciano para cada serviço (01 Sites, 02 Branding, 03 Automação, 04 IA, 05 Tráfego, 06 Estratégia).',
  '* **Linha Fluida & Ortogonal que Acompanha a Rolagem (`public/js/escom-fio-pagina.js`):**',
  '  * Referência estudada via Puppeteer: https://dakshgajjar.com/.',
  '  * **Regras de desenho estritas:**',
  '    * **Zero tracejado prévio:** O caminho futuro não tem linha pontilhada/tracejada; ele é revelado dinamicamente via `stroke-dashoffset` à medida que o scroll avança, com anel e miolo luminoso na ponta.',
  '    * **Seguir retas reais da arquitetura:** Quando há uma reta ou divisória de grid (ex: x = 730px na vertical ou y = 1851px e divisórias dos cards na horizontal), a linha **corre 100% reta na reta** (`L x y`).',
  '    * **Quinas de 90° com cantos arredondados:** Transições entre retas verticais e horizontais são feitas com arcos de 90° (`A 20 20 ...`).',
  '    * **Nunca cortar textos na diagonal nem cruzar seções indivisas:** A linha não passa no meio de títulos nem atravessa blocos de texto; ela viaja pelas divisórias reais do layout.',
  '* **Build e Sincronização entre Ambientes:**',
  '  * Script gerador: `scripts/build_escom_enerblock_home.mjs`.',
  '  * Sincroniza HTML, CSS e scripts automaticamente entre:',
  '    * `E:/ANTIGRAVITY/ESCOM_STUDIO/public`',
  '    * `E:/ANTIGRAVITY/EDU/ESCOM_STUDIO/public`',
  '    * `G:/Meu Drive/ARQUIVOS/ANTIGRAVITY/ESCOM_STUDIO/public`',
  '* **Correção do Preloader Legado:** Desativada a classe `.preload` (`display: none !important`), que cobria a tela inteira de ciano sólido em caso de falha da transição antiga.',
  '* **Status:** Rodando 100% local em http://localhost:3000/, verificado visualmente e sem erros de console.',
  '',
  ''
].join('\r\n');

const paths = [
  'G:/Meu Drive/ARQUIVOS/ANTIGRAVITY/ESCOM_STUDIO/docs/diario.md',
  'E:/ANTIGRAVITY/ESCOM_STUDIO/docs/diario.md',
  'E:/ANTIGRAVITY/EDU/ESCOM_STUDIO/docs/diario.md'
];

for (const p of paths) {
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    const idx = content.indexOf('## ');
    if (idx !== -1) {
      content = content.slice(0, idx) + novaEntrada + content.slice(idx);
      fs.writeFileSync(p, content, 'utf8');
      console.log('Atualizado com sucesso:', p);
    }
  }
}
