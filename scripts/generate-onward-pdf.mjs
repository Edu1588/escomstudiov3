import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const REPORT_DIR = join(process.cwd(), 'reports');
mkdirSync(REPORT_DIR, { recursive: true });

const reportHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; background: #fff; line-height: 1.6; }

  /* === COVER === */
  .cover { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #1a1a1a 0%, #2a1a15 40%, #3d1a0a 100%); color: #fff; text-align: center; position: relative; overflow: hidden; page-break-after: always; }
  .cover::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at 30% 70%, rgba(246,51,4,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(252,117,84,0.08) 0%, transparent 50%); }
  .cover-badge { background: rgba(246,51,4,0.15); border: 1px solid rgba(246,51,4,0.3); color: #F63304; padding: 8px 24px; border-radius: 50px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 40px; position: relative; }
  .cover h1 { font-size: 48px; font-weight: 800; line-height: 1.1; margin-bottom: 16px; position: relative; }
  .cover h1 span { color: #F63304; }
  .cover h2 { font-size: 22px; font-weight: 300; color: rgba(255,255,255,0.7); margin-bottom: 60px; position: relative; }
  .cover-meta { position: relative; display: flex; gap: 40px; font-size: 13px; color: rgba(255,255,255,0.5); }
  .cover-meta div { display: flex; flex-direction: column; align-items: center; }
  .cover-meta strong { color: rgba(255,255,255,0.8); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
  .cover-line { width: 60px; height: 3px; background: #F63304; margin: 30px auto; position: relative; border-radius: 2px; }
  .cover-logo { width: 120px; height: 120px; border-radius: 16px; margin-bottom: 32px; position: relative; object-fit: cover; border: 2px solid rgba(246,51,4,0.3); }

  /* === PAGES === */
  .page { padding: 60px 70px; position: relative; break-before: page; }
  .page:first-of-type { break-before: auto; }
  .page::after { content: ''; position: absolute; bottom: 30px; left: 70px; right: 70px; height: 1px; background: linear-gradient(90deg, transparent, rgba(246,51,4,0.2), transparent); }
  .page-number { position: absolute; bottom: 15px; right: 70px; font-size: 11px; color: #999; }

  /* === IMAGE BLOCKS === */
  .img-block { page-break-inside: avoid; break-inside: avoid; margin: 20px 0; border-radius: 10px; overflow: hidden; position: relative; }
  .img-block img { width: 100%; display: block; }
  .img-block .caption { font-size: 11px; color: #888; padding: 8px 0; text-align: center; font-style: italic; }
  .img-hero { height: 220px; }
  .img-hero img { height: 100%; object-fit: cover; }
  .img-half { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .img-half .img-block { margin: 0; }

  /* === TYPOGRAPHY === */
  .section-tag { display: inline-block; background: rgba(246,51,4,0.1); color: #F63304; padding: 4px 14px; border-radius: 50px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; border: 1px solid rgba(246,51,4,0.2); }
  h2 { font-size: 32px; font-weight: 800; color: #0a0a0a; margin-bottom: 8px; line-height: 1.2; }
  h3 { font-size: 20px; font-weight: 700; color: #1a1a2e; margin: 24px 0 12px; }
  h4 { font-size: 15px; font-weight: 700; color: #333; margin: 16px 0 8px; }
  p { font-size: 14px; color: #444; margin-bottom: 12px; }
  .subtitle { font-size: 16px; color: #666; margin-bottom: 32px; line-height: 1.5; }

  /* === CARDS & BREAK CONTROL === */
  .card, .grid-2, .grid-3, .grid-4, .highlight-box, table, .bar-row, .stat-box, .img-block, .img-half, .cover { page-break-inside: avoid; break-inside: avoid; }
  .card { background: #f8f9fc; border-radius: 12px; padding: 24px; margin-bottom: 16px; border-left: 4px solid #F63304; }
  .card.warn { border-left-color: #ff5a00; }
  .card.danger { border-left-color: #ef4444; }
  .card.success { border-left-color: #10b981; }
  .card h4 { margin-top: 0; }

  /* === GRID === */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }

  /* === STAT BOXES === */
  .stat-box { background: linear-gradient(135deg, #1a1a1a, #2d1a12); color: #fff; border-radius: 12px; padding: 20px; text-align: center; }
  .stat-box .number { font-size: 36px; font-weight: 800; color: #F63304; line-height: 1; }
  .stat-box .label { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; }

  /* === TABLES === */
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
  th { background: #0a0a0a; color: #fff; padding: 12px 16px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  td { padding: 10px 16px; border-bottom: 1px solid #eee; }
  tr:nth-child(even) td { background: #f8f9fc; }
  tr:hover td { background: rgba(0,209,255,0.05); }

  /* === LISTS === */
  ul { padding-left: 20px; margin-bottom: 16px; }
  li { font-size: 14px; color: #444; margin-bottom: 6px; }
  li::marker { color: #F63304; }

  /* === BAR CHARTS === */
  .bar-row { display: flex; align-items: center; margin-bottom: 8px; }
  .bar-label { width: 160px; font-size: 12px; color: #555; text-align: right; padding-right: 12px; flex-shrink: 0; }
  .bar-track { flex: 1; height: 24px; background: #f0f0f5; border-radius: 6px; overflow: hidden; position: relative; }
  .bar-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; padding-left: 10px; font-size: 11px; color: #fff; font-weight: 600; }
  .bar-fill.cyan { background: linear-gradient(90deg, #F63304, #c42a03); }
  .bar-fill.orange { background: linear-gradient(90deg, #ff5a00, #cc4400); }
  .bar-fill.green { background: linear-gradient(90deg, #10b981, #059669); }
  .bar-fill.purple { background: linear-gradient(90deg, #8b5cf6, #6d28d9); }

  /* === SCORE === */
  .score-circle { width: 100px; height: 100px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 12px; }
  .score-circle .val { font-size: 32px; font-weight: 800; }
  .score-circle .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
  .score-low { background: rgba(239,68,68,0.1); border: 3px solid #ef4444; color: #ef4444; }
  .score-mid { background: rgba(246,51,4,0.1); border: 3px solid #F63304; color: #F63304; }
  .score-high { background: rgba(16,185,129,0.1); border: 3px solid #10b981; color: #10b981; }

  /* === TOC === */
  .toc-item { display: flex; align-items: baseline; padding: 12px 0; border-bottom: 1px solid #f0f0f5; }
  .toc-num { font-size: 28px; font-weight: 800; color: #F63304; width: 50px; flex-shrink: 0; }
  .toc-text { font-size: 16px; color: #333; font-weight: 500; }
  .toc-desc { font-size: 12px; color: #888; margin-top: 2px; }

  .highlight-box { background: linear-gradient(135deg, rgba(246,51,4,0.06), rgba(252,117,84,0.04)); border: 1px solid rgba(246,51,4,0.15); border-radius: 12px; padding: 24px; margin: 20px 0; }
  .highlight-box h4 { color: #0a0a0a; margin-top: 0; }

  .tag { display: inline-block; background: rgba(246,51,4,0.1); color: #c42a03; padding: 3px 10px; border-radius: 50px; font-size: 11px; margin: 2px 4px 2px 0; }
  .tag.warn { background: rgba(255,90,0,0.1); color: #cc4400; }
  .tag.danger { background: rgba(239,68,68,0.1); color: #dc2626; }
  .tag.success { background: rgba(16,185,129,0.1); color: #059669; }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <img src="https://static.wixstatic.com/media/0ec144_7cc13d8a244f4b388f49c244b574590e~mv2.jpg" alt="Onward Logo" class="cover-logo">
  <div class="cover-badge">Relatório Analítico Estratégico</div>
  <h1><span>Onward</span> Consultoria</h1>
  <div class="cover-line"></div>
  <h2>CFO sob Demanda & Assessoria M&A<br>Diagnóstico Completo de Presença Digital</h2>
  <div class="cover-meta">
    <div><strong>Data</strong>21 de Julho, 2026</div>
    <div><strong>CNPJ</strong>17.198.935/0001-27</div>
    <div><strong>Localização</strong>São Paulo, SP</div>
    <div><strong>Nicho</strong>Gestão & M&A</div>
  </div>
</div>

<!-- TOC -->
<div class="page">
  <span class="section-tag">Sumário</span>
  <h2>Índice</h2>
  <p class="subtitle">Navegue por cada seção deste relatório analítico.</p>
  <div class="toc-item"><div class="toc-num">01</div><div><div class="toc-text">Visão Geral da Empresa</div><div class="toc-desc">Identidade, fundadores, história e estrutura</div></div></div>
  <div class="toc-item"><div class="toc-num">02</div><div><div class="toc-text">Serviços e Proposta de Valor</div><div class="toc-desc">CFO sob Demanda e Assessoria M&A detalhadas</div></div></div>
  <div class="toc-item"><div class="toc-num">03</div><div><div class="toc-text">Análise de Mercado</div><div class="toc-desc">M&A no Brasil, dados de mercado e tendências</div></div></div>
  <div class="toc-item"><div class="toc-num">04</div><div><div class="toc-text">Análise Competitiva</div><div class="toc-desc">Mapeamento de concorrentes diretos e posicionamento</div></div></div>
  <div class="toc-item"><div class="toc-num">05</div><div><div class="toc-text">Diagnóstico de Presença Digital</div><div class="toc-desc">Avaliação completa da presença online atual</div></div></div>
  <div class="toc-item"><div class="toc-num">06</div><div><div class="toc-text">Auditoria do Website</div><div class="toc-desc">UX, conteúdo, SEO técnico, performance</div></div></div>
  <div class="toc-item"><div class="toc-num">07</div><div><div class="toc-text">Análise de Reputação e Reviews</div><div class="toc-desc">Avaliações, depoimentos e credibilidade online</div></div></div>
  <div class="toc-item"><div class="toc-num">08</div><div><div class="toc-text">Benchmarking Digital</div><div class="toc-desc">Comparativo com melhores práticas do setor</div></div></div>
  <div class="toc-item"><div class="toc-num">09</div><div><div class="toc-text">Análise SWOT</div><div class="toc-desc">Forças, Fraquezas, Oportunidades e Ameaças</div></div></div>
  <div class="toc-item"><div class="toc-num">10</div><div><div class="toc-text">Oportunidades de Crescimento</div><div class="toc-desc">Ações estratégicas para expansão digital</div></div></div>
  <div class="toc-item"><div class="toc-num">11</div><div><div class="toc-text">Roadmap de Implementação</div><div class="toc-desc">Plano de ação em 90 dias</div></div></div>
  <div class="toc-item"><div class="toc-num">12</div><div><div class="toc-text">Projeção de Resultados</div><div class="toc-desc">Estimativas de ROI e impacto</div></div></div>
  <div class="toc-item"><div class="toc-num">13</div><div><div class="toc-text">Conclusão e Próximos Passos</div><div class="toc-desc">Resumo executivo e recomendações finais</div></div></div>
  <span class="page-number">2</span>
</div>

<!-- PAGE 3: VISÃO GERAL -->
<div class="page">
  <span class="section-tag">Seção 01</span>
  <h2>Visão Geral da Empresa</h2>
  <p class="subtitle">Dados corporativos, fundadores e estrutura organizacional da Onward Consultoria.</p>

  <div class="img-block img-hero">
    <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1200&q=80" alt="Escritório corporativo">
    <div class="caption">Vila Olímpia, São Paulo — sede da Onward Consultoria</div>
  </div>

  <div class="grid-4">
    <div class="stat-box"><div class="number">2012</div><div class="label">Fundação</div></div>
    <div class="stat-box"><div class="number">13+</div><div class="label">Anos de Mercado</div></div>
    <div class="stat-box"><div class="number">25+</div><div class="label">Anos Exp. Fundador</div></div>
    <div class="stat-box"><div class="number">16+</div><div class="label">Setores Atendidos</div></div>
  </div>

  <h3>Dados Corporativos</h3>
  <div class="grid-2">
    <div class="card">
      <h4>Identificação</h4>
      <ul>
        <li><strong>Razão Social:</strong> Onward Consultoria Ltda</li>
        <li><strong>CNPJ:</strong> 17.198.935/0001-27</li>
        <li><strong>CNAE:</strong> 7020-4/00 — Consultoria em gestão empresarial</li>
        <li><strong>Situação:</strong> ATIVA (Receita Federal)</li>
        <li><strong>Porte:</strong> Empresa de pequeno porte (2-10 funcionários)</li>
      </ul>
    </div>
    <div class="card">
      <h4>Contato e Localização</h4>
      <ul>
        <li><strong>Endereço:</strong> Rua Olimpíadas 205, 4º Andar, Vila Olímpia, São Paulo-SP, CEP 04551-000</li>
        <li><strong>Telefone:</strong> (11) 3728-8634</li>
        <li><strong>E-mail:</strong> contato@onward.com.br</li>
        <li><strong>Website:</strong> www.onward.com.br</li>
        <li><strong>LinkedIn:</strong> linkedin.com/company/onward-consultoria (136 seguidores)</li>
      </ul>
    </div>
  </div>

  <h3>Fundador — Carlos Eduardo Letran Bueno</h3>
  <div class="card success">
    <h4>Perfil Executivo</h4>
    <ul>
      <li><strong>Cargos:</strong> Founder, CFO sob Demanda, M&A Advisor</li>
      <li><strong>Cidadania:</strong> Dupla (Brasil e Italia)</li>
      <li><strong>Idiomas:</strong> Português, Inglês, Espanhol, Francês, Italiano (5 idiomas)</li>
      <li><strong>Formação:</strong> Tecnologia em Processamento de Dados; Pós-graduação em Administração de Empresas; Pós-graduação em Finanças</li>
      <li><strong>Experiência Anterior:</strong> Portfolio Manager no Credit Suisse; Orinter; Flytour</li>
      <li><strong>Plataformas:</strong> Membro do Chiefs.Group (rede de executivos)</li>
    </ul>
  </div>

  <h3>Co-fundadora</h3>
  <div class="card">
    <h4>Angela Carlos de Alcantara Bueno</h4>
    <p>Sócia-administradora desde a fundação (11/10/2012). Responsável pela gestão administrativa e operacional da empresa.</p>
  </div>

  <span class="page-number">3</span>
</div>

<!-- PAGE 4: SERVIÇOS -->
<div class="page">
  <span class="section-tag">Seção 02</span>
  <h2>Serviços e Proposta de Valor</h2>
  <p class="subtitle">Análise detalhada das duas divisões de negócio: CFO sob Demanda e Assessoria M&A.</p>

  <h3>Divisão 1: CFO sob Demanda (Fractional CFO)</h3>
  <div class="grid-2">
    <div class="card">
      <h4>FP&A — Planejamento e Análise Financeira</h4>
      <ul>
        <li>Projeções financeiras e construção de cenários</li>
        <li>Análise de resultados e definição de KPIs</li>
        <li>Demonstrações financeiras padronizadas (IFRS/GAAP)</li>
        <li>Base analítica sólida para decisões estratégicas</li>
      </ul>
    </div>
    <div class="card">
      <h4>Gestão de Fluxo de Caixa e Capital de Giro</h4>
      <ul>
        <li>Controle e previsões de caixa com visibilidade real</li>
        <li>Estratégias para otimização do capital de giro</li>
        <li>Redução de custos financeiros e aumento da liquidez</li>
        <li>Estabilidade operacional para crescimento seguro</li>
      </ul>
    </div>
    <div class="card">
      <h4>Captação de Recursos e Relacionamento Institucional</h4>
      <ul>
        <li>Materiais financeiros completos e tecnicamente consistentes</li>
        <li>Estruturação de operações de crédito e financiamento</li>
        <li>Negociação de condições mais favoráveis com instituições</li>
        <li>Suporte para atrair investidores e parceiros estratégicos</li>
      </ul>
    </div>
    <div class="card">
      <h4>Governança, Automação e Controles</h4>
      <ul>
        <li>Implementação de ERP, BI e ferramentas de gestão</li>
        <li>Automação de processos financeiros e operacionais</li>
        <li>Controles internos robustos e redução de riscos</li>
        <li>Dados confiáveis para decisões rápidas e bem fundamentadas</li>
      </ul>
    </div>
  </div>

  <h3>Divisão 2: Assessoria em M&A (Fusões e Aquisições)</h3>
  <div class="card" style="border-left-color: #ff5a00;">
    <h4>Fluxo Completo de M&A</h4>
    <p style="font-size:13px; color:#666; margin-bottom:12px;">A Onward conduz o processo ponta a ponta, desde a identificação do target até o fechamento da operação:</p>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <span class="tag">Target Identification</span>
      <span class="tag">Valuation (DCF/Múltiplos)</span>
      <span class="tag">CIM/Teaser</span>
      <span class="tag">Abordagem de Mercado</span>
      <span class="tag">Due Diligence</span>
      <span class="tag">Negociação</span>
      <span class="tag">Due Diligence Jurídica</span>
      <span class="tag">Due Diligence Financeira</span>
      <span class="tag">Estruturação da Operação</span>
      <span class="tag">Data Room</span>
      <span class="tag">Closing</span>
    </div>
  </div>

  <h3>Análise de Pricing</h3>
  <table>
    <tr><th>Modelo</th><th>Custo Mensal Estimado (BR)</th><th>Modelo Onward</th></tr>
    <tr><td>CFO CLT (clássico)</td><td>R$ 34.000 – R$ 96.000</td><td>❌ Não aplicável</td></tr>
    <tr><td>CFO as a Service (fractional)</td><td>R$ 8.000 – R$ 30.000</td><td>✅ Modelo principal</td></tr>
    <tr><td>Projeto M&A (por projeto)</td><td>R$ 15.000 – R$ 80.000</td><td>✅ Assessoria pontual</td></tr>
    <tr><td>BPO Financeiro</td><td>R$ 2.000 – R$ 8.000</td><td>❌ Não oferecido</td></tr>
  </table>

  <span class="page-number">4</span>
</div>

<!-- PAGE 5: MERCADO -->
<div class="page">
  <span class="section-tag">Seção 03</span>
  <h2>Análise de Mercado</h2>
  <p class="subtitle">Panorama do mercado de M&A e consultoria de gestão empresarial no Brasil.</p>

  <div class="img-block img-hero">
    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" alt="Torres corporativas">
    <div class="caption">Mercado de M&A em recuperação — volume de R$ 234 bilhões em 2025</div>
  </div>

  <h3>Mercado de M&A no Brasil (2025-2026)</h3>
  <div class="grid-3">
    <div class="stat-box"><div class="number">R$ 234B</div><div class="label">Valor Total M&A 2025</div></div>
    <div class="stat-box"><div class="number">1.581</div><div class="label">Transações em 2025</div></div>
    <div class="stat-box"><div class="number">+10%</div><div class="label">Crescimento Previsto 2026</div></div>
  </div>

  <div class="card">
    <h4>Evolução do Mercado de M&A Brasil</h4>
    <div class="bar-row"><div class="bar-label">2021 (Pico)</div><div class="bar-track"><div class="bar-fill cyan" style="width:100%">R$ 482B</div></div></div>
    <div class="bar-row"><div class="bar-label">2022</div><div class="bar-track"><div class="bar-fill cyan" style="width:72%">R$ 348B</div></div></div>
    <div class="bar-row"><div class="bar-label">2023</div><div class="bar-track"><div class="bar-fill cyan" style="width:60%">R$ 289B</div></div></div>
    <div class="bar-row"><div class="bar-label">2024</div><div class="bar-track"><div class="bar-fill cyan" style="width:52%">R$ 250B</div></div></div>
    <div class="bar-row"><div class="bar-label">2025</div><div class="bar-track"><div class="bar-fill orange" style="width:49%">R$ 234B</div></div></div>
    <div class="bar-row"><div class="bar-label">2026E</div><div class="bar-track"><div class="bar-fill green" style="width:53%">R$ 258B (previsto)</div></div></div>
  </div>

  <h3>Setores que Mais Movimentam M&A</h3>
  <div class="card">
    <div class="bar-row"><div class="bar-label">Tecnologia</div><div class="bar-track"><div class="bar-fill cyan" style="width:40%">~40% dos deals</div></div></div>
    <div class="bar-row"><div class="bar-label">Serviços Financeiros</div><div class="bar-track"><div class="bar-fill orange" style="width:22%">+52% YoY</div></div></div>
    <div class="bar-row"><div class="bar-label">Energia/Renováveis</div><div class="bar-track"><div class="bar-fill green" style="width:18%">Alta demanda</div></div></div>
    <div class="bar-row"><div class="bar-label">Infraestrutura</div><div class="bar-track"><div class="bar-fill purple" style="width:15%">Concessões</div></div></div>
    <div class="bar-row"><div class="bar-label">Agro</div><div class="bar-track"><div class="bar-fill cyan" style="width:12%">Consolidação</div></div></div>
  </div>

  <h3>Mercado de Consultoria de Gestão (Brasil)</h3>
  <div class="grid-2">
    <div class="stat-box"><div class="number">US$ 7.44B</div><div class="label">TAM 2025</div></div>
    <div class="stat-box"><div class="number">US$ 9.29B</div><div class="label">TAM 2031E</div></div>
  </div>
  <div class="card">
    <h4>Crescimento por Segmento</h4>
    <div class="bar-row"><div class="bar-label">Consultoria Tech</div><div class="bar-track"><div class="bar-fill cyan" style="width:63%">CAGR 6.28%</div></div></div>
    <div class="bar-row"><div class="bar-label">Segmento PME</div><div class="bar-track"><div class="bar-fill orange" style="width:45%">CAGR 4.52%</div></div></div>
    <div class="bar-row"><div class="bar-label">Média do Mercado</div><div class="bar-track"><div class="bar-fill green" style="width:38%">CAGR 3.78%</div></div></div>
  </div>

  <span class="page-number">5</span>
</div>

<!-- PAGE 6: COMPETITORES -->
<div class="page">
  <span class="section-tag">Seção 04</span>
  <h2>Análise Competitiva</h2>
  <p class="subtitle">Mapeamento dos principais concorrentes no segmento de CFO sob Demanda e M&A em São Paulo.</p>

  <table>
    <tr><th>Concorrente</th><th>Foco</th><th>Tamanho</th><th>Diferencial</th><th>Ameaça</th></tr>
    <tr><td><strong>Triven</strong></td><td>CFO as a Service (squad)</td><td>50+ func.</td><td>Modelo squad (CFO+Controller+Analista)</td><td><span class="tag danger">Alta</span></td></tr>
    <tr><td><strong>Vista Consultants</strong></td><td>CFO on Demand</td><td>20+ func.</td><td>Rede de associados especializados</td><td><span class="tag warn">Média</span></td></tr>
    <tr><td><strong>Soul Finance</strong></td><td>CFO + BPO</td><td>10-20 func.</td><td>BPO financeiro incluso</td><td><span class="tag warn">Média</span></td></tr>
    <tr><td><strong>BO Brazil</strong></td><td>M&A Advisory</td><td>5-10 func.</td><td>Foco growth companies, 12+ deals</td><td><span class="tag warn">Média</span></td></tr>
    <tr><td><strong>Oporto Capital</strong></td><td>M&A middle market</td><td>10-20 func.</td><td>Boutique independente</td><td><span class="tag">Baixa</span></td></tr>
    <tr><td><strong>G2G Consultoria</strong></td><td>Fractional CFO + COO</td><td>1-10 func.</td><td>Escopo operacional mais amplo</td><td><span class="tag">Baixa</span></td></tr>
    <tr><td><strong>IGC Partners</strong></td><td>M&A (maior casa LatAm)</td><td>100+ func.</td><td>500+ transações, escala institucional</td><td><span class="tag">Baixa</span></td></tr>
  </table>

  <h3>Mapa de Posicionamento</h3>
  <div class="card">
    <p style="font-size:13px; margin-bottom:16px;"><strong>Eixo X:</strong> Escopo do serviço (CFO only → CFO + M&A) | <strong>Eixo Y:</strong> Tamanho da equipe (individual → institucional)</p>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
      <div style="background:rgba(0,209,255,0.08); border-radius:8px; padding:16px; border:1px dashed rgba(0,209,255,0.3);">
        <strong style="color:#F63304;">Quadrante Premium</strong>
        <p style="font-size:12px; color:#666;">CFO + M&A + Equipe<br>→ IGC, Caravel</p>
      </div>
      <div style="background:rgba(255,90,0,0.08); border-radius:8px; padding:16px; border:1px dashed rgba(255,90,0,0.3);">
        <strong style="color:#ff5a00;">⭐ Onward (Posicionamento Atual)</strong>
        <p style="font-size:12px; color:#666;">CFO + M&A + Equipe pequena<br>→ Nicho subatendido</p>
      </div>
      <div style="background:rgba(16,185,129,0.08); border-radius:8px; padding:16px; border:1px dashed rgba(16,185,129,0.3);">
        <strong style="color:#10b981;">Foco CFO</strong>
        <p style="font-size:12px; color:#666;">Fractional CFO only<br>→ Triven, Vista, Soul</p>
      </div>
      <div style="background:rgba(139,92,246,0.08); border-radius:8px; padding:16px; border:1px dashed rgba(139,92,246,0.3);">
        <strong style="color:#8b5cf6;">Foco M&A</strong>
        <p style="font-size:12px; color:#666;">M&A only, sem CFO<br>→ BO Brazil, Oporto</p>
      </div>
    </div>
  </div>

  <h3>Vantagem Competitiva da Onward</h3>
  <div class="highlight-box">
    <h4>Posicionamento Único no Mercado</h4>
    <p>A Onward ocupa um nicho raramente coberto: a intersecção entre <strong>Fractional CFO</strong> e <strong>Boutique M&A</strong>. A maioria das empresas de fractional CFO não faz M&A, e a maioria das boutiques de M&A não oferece serviço de CFO contínuo. Essa combinação é ao mesmo tempo uma vantagem (diferenciação) e um risco (dispersão de foco).</p>
  </div>

  <span class="page-number">6</span>
</div>

<!-- PAGE 7: PRESENÇA DIGITAL -->
<div class="page">
  <span class="section-tag">Seção 05</span>
  <h2>Diagnóstico de Presença Digital</h2>
  <p class="subtitle">Avaliação completa da presença online da Onward Consultoria em todos os canais.</p>

  <div class="img-block img-hero">
    <img src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80" alt="Reunião executiva">
    <div class="caption">Presença digital crítica — score 2.1/10 em todos os canais</div>
  </div>

  <div class="grid-3" style="margin-bottom:24px;">
    <div style="text-align:center;">
      <div class="score-circle score-low"><div class="val">2.1</div><div class="lbl">/ 10</div></div>
      <strong style="color:#ef4444;">Presença Digital</strong>
      <p style="font-size:12px; color:#888;">Muito abaixo do potencial</p>
    </div>
    <div style="text-align:center;">
      <div class="score-circle score-low"><div class="val">1.5</div><div class="lbl">/ 10</div></div>
      <strong style="color:#ef4444;">SEO & Visibilidade</strong>
      <p style="font-size:12px; color:#888;">Praticamente invisível no Google</p>
    </div>
    <div style="text-align:center;">
      <div class="score-circle score-mid"><div class="val">3.0</div><div class="lbl">/ 10</div></div>
      <strong style="color:#ff5a00;">Credibilidade Online</strong>
      <p style="font-size:12px; color:#888;">Boa no LinkedIn, fraco em outros</p>
    </div>
  </div>

  <h3>Status por Plataforma</h3>
  <table>
    <tr><th>Plataforma</th><th>Status</th><th>Avaliação</th><th>Impacto</th></tr>
    <tr><td><strong>Website</strong> (onward.com.br)</td><td><span class="tag warn">Ativo (Wix)</span></td><td>Site minimalista, single-page, sem blog</td><td><span class="tag danger">Crítico</span></td></tr>
    <tr><td><strong>Google My Business</strong></td><td><span class="tag danger">NÃO EXISTE</span></td><td>Sem listing no Google Maps</td><td><span class="tag danger">Crítico</span></td></tr>
    <tr><td><strong>LinkedIn (Empresa)</strong></td><td><span class="tag warn">Ativo</span></td><td>136 seguidores, +0.7% mensal</td><td><span class="tag warn">Baixo</span></td></tr>
    <tr><td><strong>LinkedIn (Fundador)</strong></td><td><span class="tag success">Ativo</span></td><td>Conteúdo thought leadership regular</td><td><span class="tag success">Bom</span></td></tr>
    <tr><td><strong>Instagram</strong></td><td><span class="tag danger">NÃO EXISTE</span></td><td>Sem presença visual</td><td><span class="tag warn">Moderado</span></td></tr>
    <tr><td><strong>Facebook</strong></td><td><span class="tag danger">NÃO EXISTE</span></td><td>—</td><td><span class="tag">Baixo</span></td></tr>
    <tr><td><strong>Twitter/X</strong></td><td><span class="tag danger">NÃO EXISTE</span></td><td>—</td><td><span class="tag">Baixo</span></td></tr>
    <tr><td><strong>YouTube</strong></td><td><span class="tag danger">NÃO EXISTE</span></td><td>—</td><td><span class="tag">Baixo</span></td></tr>
    <tr><td><strong>WhatsApp Business</strong></td><td><span class="tag danger">NÃO VISÍVEL</span></td><td>Sem botão no site</td><td><span class="tag danger">Crítico</span></td></tr>
  </table>

  <div class="card danger">
    <h4>Achado Crítico: Ausência Total de Google My Business</h4>
    <p>A empresa <strong>não possui listing no Google Maps</strong>. Para uma consultoria B2B localizada na Vila Olímpia (São Paulo), isso significa perda de visibilidade em buscas como "consultoria M&A São Paulo", "CFO sob demanda Vila Olímpia", etc. Estudos mostram que 46% de todas as buscas no Google têm intenção local. A ausência do GMB é a maior lacuna de crescimento da empresa.</p>
  </div>

  <span class="page-number">7</span>
</div>

<!-- PAGE 8: WEBSITE AUDIT -->
<div class="page">
  <span class="section-tag">Seção 06</span>
  <h2>Auditoria do Website</h2>
  <p class="subtitle">Análise técnica e de conteúdo do site atual onward.com.br.</p>

  <div class="grid-2">
    <div style="text-align:center;">
      <div class="score-circle score-low"><div class="val">2.5</div><div class="lbl">/ 10</div></div>
      <strong style="color:#ef4444;">Score Geral do Site</strong>
    </div>
    <div>
      <h4>Pontuação por Categoria</h4>
      <div class="bar-row"><div class="bar-label">Design/UX</div><div class="bar-track"><div class="bar-fill orange" style="width:40%">4/10</div></div></div>
      <div class="bar-row"><div class="bar-label">Conteúdo</div><div class="bar-track"><div class="bar-fill orange" style="width:30%">3/10</div></div></div>
      <div class="bar-row"><div class="bar-label">SEO Técnico</div><div class="bar-track"><div class="bar-fill" style="width:15%;background:#ef4444;">1.5/10</div></div></div>
      <div class="bar-row"><div class="bar-label">Performance</div><div class="bar-track"><div class="bar-fill orange" style="width:35%">3.5/10</div></div></div>
      <div class="bar-row"><div class="bar-label">Conversão</div><div class="bar-track"><div class="bar-fill" style="width:15%;background:#ef4444;">1.5/10</div></div></div>
    </div>
  </div>

  <h3>Problemas Identificados</h3>
  <div class="grid-2">
    <div class="card danger">
      <h4>Conteúdo Mínimo</h4>
      <ul>
        <li>Single-page sem seções claras</li>
        <li>Sem blog ou artigos</li>
        <li>Sem estudos de caso</li>
        <li>Sem depoimentos de clientes</li>
        <li>Sem FAQ</li>
      </ul>
    </div>
    <div class="card danger">
      <h4>SEO Inexistente</h4>
      <ul>
        <li>Sem meta descriptions otimizadas</li>
        <li>Sem headings H1/H2/H3 estruturados</li>
        <li>Sem schema markup (JSON-LD)</li>
        <li>Sem sitemap.xml</li>
        <li>Sem conteúdo indexável para Google</li>
      </ul>
    </div>
    <div class="card warn">
      <h4>UX e Design</h4>
      <ul>
        <li>Plataforma Wix (limitações técnicas)</li>
        <li>Sem CTA claro (botão de ação)</li>
        <li>Sem formulário de contato visível</li>
        <li>Sem WhatsApp button</li>
        <li>Sem chat ao vivo</li>
      </ul>
    </div>
    <div class="card warn">
      <h4>Conversão</h4>
      <ul>
        <li>Nenhum mecanismo de captura de leads</li>
        <li>Sem landing pages para serviços</li>
        <li>Sem lead magnet (ebook, guia, checklist)</li>
        <li>Sem prova social visível</li>
        <li>Sem urgência ou escassez</li>
      </ul>
    </div>
  </div>

  <h3>O que o site faz bem</h3>
  <div class="card success">
    <ul>
      <li>Apresenta os dois pilares de serviço (CFO + M&A) de forma clara</li>
      <li>Conteúdo detalhado sobre cada serviço com bullets específicos</li>
      <li>Design limpo e profissional (embora minimalista)</li>
      <li>Fundador com perfil robusto no LinkedIn e Chiefs.Group</li>
    </ul>
  </div>

  <span class="page-number">8</span>
</div>

<!-- PAGE 9: REPUTAÇÃO -->
<div class="page">
  <span class="section-tag">Seção 07</span>
  <h2>Análise de Reputação e Reviews</h2>
  <p class="subtitle">Avaliação da credibilidade online e depoimentos encontrados.</p>

  <h3>Avaliações Encontradas</h3>
  <div class="grid-3">
    <div class="stat-box"><div class="number">5.0</div><div class="label">LinkedIn Reviews (2)</div></div>
    <div class="stat-box"><div class="number">4.0</div><div class="label">mplrs.com (1)</div></div>
    <div class="stat-box"><div class="number" style="color:#ef4444;">—</div><div class="label">Google Reviews (0)</div></div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h4>LinkedIn — 5.0/5.0 (2 avaliações)</h4>
      <ul>
        <li><strong>Work-Life Balance:</strong> 5.0</li>
        <li><strong>Compensação:</strong> 5.0</li>
        <li><strong>Cultura:</strong> 5.0</li>
        <li><strong>Carreira:</strong> 5.0</li>
      </ul>
      <p style="font-size:12px; color:#888; margin-top:8px;">Apenas 2 avaliações — volume muito baixo para gerar confiança.</p>
    </div>
    <div class="card">
      <h4>mplrs.com — 4.0/5.0 (1 avaliação)</h4>
      <blockquote style="border-left:3px solid #F63304; padding-left:12px; font-style:italic; font-size:13px; color:#555; margin-top:8px;">
        "Company is concerned to employees welfare. Lovely team. Relaxed atmosphere."
      </blockquote>
      <p style="font-size:12px; color:#888; margin-top:8px;">Avaliação de funcionário, não de cliente. Pouco relevante para prospect.</p>
    </div>
  </div>

  <h3>Depoimentos de Clientes</h3>
  <div class="card danger">
    <h4>Nenhum depoimento público encontrado</h4>
    <p>A Onward Consultoria <strong>não exibe nenhum depoimento, case study ou logotipo de clientes</strong> no website. Para uma empresa que atua em M&A (setor que exige altíssima confiança), essa ausência é particularmente prejudicial. Prospectos não conseguem validar a experiência da empresa com terceiros.</p>
  </div>

  <h3>Impacto na Decisão de Compra</h3>
  <div class="card">
    <h4>Fatores de Decisão em Consultoria M&A (pesquisa B2B)</h4>
    <div class="bar-row"><div class="bar-label">Recomendação/Indicação</div><div class="bar-track"><div class="bar-fill cyan" style="width:85%">85% dos compradores</div></div></div>
    <div class="bar-row"><div class="bar-label">Reviews online</div><div class="bar-track"><div class="bar-fill orange" style="width:72%">72% consultam reviews</div></div></div>
    <div class="bar-row"><div class="bar-label">Cases de sucesso</div><div class="bar-track"><div class="bar-fill green" style="width:68%">68% querem ver cases</div></div></div>
    <div class="bar-row"><div class="bar-label">Conteúdo educativo</div><div class="bar-track"><div class="bar-fill purple" style="width:55%">55% avaliam expertise</div></div></div>
    <div class="bar-row"><div class="bar-label">Website profissional</div><div class="bar-track"><div class="bar-fill cyan" style="width:48%">48% julgam pela site</div></div></div>
  </div>

  <div class="highlight-box">
    <h4>Gap Crítico</h4>
    <p>A Onward atende apenas 1 dos 5 principais fatores de decisão (website profissional). Os 4 mais importantes (indicação, reviews, cases, conteúdo) estão completamente ausentes. Isso significa que a empresa depende quase exclusivamente de rede pessoal do fundador para gerar negócios.</p>
  </div>

  <span class="page-number">9</span>
</div>

<!-- PAGE 10: BENCHMARKING -->
<div class="page">
  <span class="section-tag">Seção 08</span>
  <h2>Benchmarking Digital</h2>
  <p class="subtitle">Comparação com melhores práticas do setor de consultoria financeira.</p>

  <h3>Comparativo com Melhores Práticas</h3>
  <table>
    <tr><th>Elemento</th><th>Melhor Prática</th><th>Onward Atual</th><th>Gap</th></tr>
    <tr><td>Google My Business</td><td>Listing otimizado com 20+ reviews</td><td>Não existe</td><td><span class="tag danger">-100%</span></td></tr>
    <tr><td>Website</td><td>Multi-page, blog, cases, FAQ</td><td>Single-page Wix</td><td><span class="tag danger">-80%</span></td></tr>
    <tr><td>LinkedIn Seguidores</td><td>500+ seguidores orgânicos</td><td>136 seguidores</td><td><span class="tag warn">-73%</span></td></tr>
    <tr><td>Conteúdo (Blog)</td><td>2+ artigos/mês, SEO-otimizados</td><td>Nenhum</td><td><span class="tag danger">-100%</span></td></tr>
    <tr><td>Depoimentos</td><td>5+ depoimentos com nome e foto</td><td>Nenhum público</td><td><span class="tag danger">-100%</span></td></tr>
    <tr><td>WhatsApp Button</td><td>Visível em todas as páginas</td><td>Não existe</td><td><span class="tag danger">-100%</span></td></tr>
    <tr><td>Lead Magnet</td><td>Ebook, guia ou calculadora</td><td>Nenhum</td><td><span class="tag danger">-100%</span></td></tr>
    <tr><td>Instagram</td><td>3+ posts/semana</td><td>Não existe</td><td><span class="tag danger">-100%</span></td></tr>
    <tr><td>Schema Markup</td><td>Organization + LocalBusiness</td><td>Nenhum</td><td><span class="tag danger">-100%</span></td></tr>
    <tr><td>Velocidade (Mobile)</td><td>LCP < 2.5s</td><td>Não testado (Wix)</td><td><span class="tag warn">?</span></td></tr>
  </table>

  <h3>Benchmark: Top 3 Competidores Digitais</h3>
  <div class="grid-3">
    <div class="card success">
      <h4>Triven</h4>
      <ul>
        <li>Website moderno e otimizado</li>
        <li>Conteúdo rico com blog</li>
        <li>Presença ativa no LinkedIn e Instagram</li>
        <li>Modelo de pricing transparente</li>
        <li>Lead magnet (calculadora de ROI)</li>
      </ul>
    </div>
    <div class="card">
      <h4>Apsis Consultoria</h4>
      <ul>
        <li>45 anos de mercado (desde 1980)</li>
        <li>Website multi-page com formulário</li>
        <li>Conteúdo sobre M&A e valuation</li>
        <li>Presença em Curitiba + outras cidades</li>
        <li>Case studies e logos de clientes</li>
      </ul>
    </div>
    <div class="card">
      <h4>Akurat Consultoria</h4>
      <ul>
        <li>Website com design premium</li>
        <li>Seção de equipe com fotos</li>
        <li>Logos de clientes visíveis</li>
        <li>Conteúdo sobre due diligence</li>
        <li>Presença no Instagram</li>
      </ul>
    </div>
  </div>

  <span class="page-number">10</span>
</div>

<!-- PAGE 11: SWOT -->
<div class="page">
  <span class="section-tag">Seção 09</span>
  <h2>Análise SWOT</h2>
  <p class="subtitle">Forças, Fraquezas, Oportunidades e Ameaças da Onward Consultoria.</p>

  <div class="grid-2">
    <div class="card success">
      <h4>💪 Forças (Strengths)</h4>
      <ul>
        <li>Fundador com 25+ anos de experiência em M&A</li>
        <li>Ex-Portfolio Manager no Credit Suisse (credibilidade institucional)</li>
        <li>Cidadania dupla Brasil/Itália + 5 idiomas (capacidade cross-border)</li>
        <li>Modelo dual único: CFO sob Demanda + M&A</li>
        <li>13+ anos de operação contínua (sustentabilidade)</li>
        <li>Atuação em 16+ setores (versatilidade)</li>
        <li>Localização premium: Vila Olímpia, São Paulo</li>
        <li>Perfil ativo no LinkedIn com conteúdo thought leadership</li>
      </ul>
    </div>
    <div class="card danger">
      <h4>😰 Fraquezas (Weaknesses)</h4>
      <ul>
        <li>Presença digital extremamente fraca (score 2.1/10)</li>
        <li>Sem Google My Business (invisível em buscas locais)</li>
        <li>Website minimalista sem conteúdo indexável</li>
        <li>Zero depoimentos ou cases de clientes públicos</li>
        <li>Sem blog, sem conteúdo SEO, sem lead magnets</li>
        <li>Time muito pequeno (2-10 funcionários)</li>
        <li>Sem presença no Instagram ou redes sociais visuais</li>
        <li>Sem mecanismos de captura de leads no site</li>
      </ul>
    </div>
    <div class="card" style="border-left-color: #10b981;">
      <h4>🚀 Oportunidades (Opportunities)</h4>
      <ul>
        <li>Mercado M&A Brasil previsto crescer +10% em 2026</li>
        <li>Segmento PME é o de maior CAGR (4.52%)</li>
        <li>Gap digital: nenhum concorrente domina SEO para "CFO sob demanda São Paulo"</li>
        <li>Cross-border M&A Europa-Brasil (capitalizar cidadania italiana)</li>
        <li>Conteúdo educativo pode posicionar Carlos como autoridade</li>
        <li>Google My Business pode gerar visibilidade imediata</li>
        <li>Parcerias com escritórios de advocacia e contabilidade</li>
        <li>Expansão para outros estados via presença digital</li>
      </ul>
    </div>
    <div class="card warn">
      <h4>⚠️ Ameaças (Threats)</h4>
      <ul>
        <li>Triven e outras fintechs de CFO crescem rapidamente</li>
        <li>Grandes casas (IGC, Caravel) podem subir para middle market</li>
        <li>Eleições 2026 podem frear atividade de M&A no H2</li>
        <li>Automação de FP&A via IA pode reduzir demanda por CFO fractional</li>
        <li>Concorrentes com orçamento maior para marketing digital</li>
        <li>Dependência excessiva da rede pessoal do fundador</li>
      </ul>
    </div>
  </div>

  <span class="page-number">11</span>
</div>

<!-- PAGE 12: OPORTUNIDADES -->
<div class="page">
  <span class="section-tag">Seção 10</span>
  <h2>Oportunidades de Crescimento</h2>
  <p class="subtitle">Ações estratégicas para alavancar a presença digital e gerar novos negócios.</p>

  <h3>Prioridade 1: Google My Business (Impacto Imediato)</h3>
  <div class="card success">
    <h4>Ação: Criar e otimizar listing no Google Maps</h4>
    <ul>
      <li>Cadastrar "Onward Consultoria" com endereço completo (Rua Olimpíadas 205, Vila Olímpia)</li>
      <li>Adicionar todas as categorias: "Consultoria em gestão empresarial", "Assessoria de fusões e aquisições"</li>
      <li>Fotos do escritório, equipe e logo</li>
      <li>Horário de funcionamento, WhatsApp, e-mail</li>
      <li>Meta: 20+ reviews de clientes nos primeiros 90 dias</li>
    </ul>
    <p style="font-size:13px; margin-top:8px;"><strong>ROI estimado:</strong> 300-500% em visibilidade orgânica local nos primeiros 6 meses.</p>
  </div>

  <h3>Prioridade 2: Website Profissional (Conversão)</h3>
  <div class="card" style="border-left-color:#8b5cf6;">
    <h4>Ação: Reconstruir site com foco em conversão</h4>
    <ul>
      <li>Multi-page: Home, Sobre, CFO sob Demanda, M&A, Cases, Blog, Contato</li>
      <li>Formulário de contato + WhatsApp button em todas as páginas</li>
      <li>Seção de cases (anônimos se necessário, mas com dados reais)</li>
      <li>Lead magnet: "Checklist: 10 Pontos para Preparar sua Empresa para M&A"</li>
      <li>Blog com 2 artigos/mês otimizados para SEO</li>
      <li>Schema markup (Organization + LocalBusiness + FAQPage)</li>
    </ul>
  </div>

  <h3>Prioridade 3: Conteúdo e Autoridade</h3>
  <div class="grid-2">
    <div class="card">
      <h4>LinkedIn + Blog</h4>
      <ul>
        <li>Amplificar posts do Carlos no LinkedIn para a empresa</li>
        <li>Publicar 2 artigos/mês no blog: "Como vender sua empresa", "Valuation para PMEs"</li>
        <li>Criar séries: "Erros fatais em M&A" (carrossel no LinkedIn)</li>
        <li>Newsletter mensal para base de contatos</li>
      </ul>
    </div>
    <div class="card">
      <h4>Instagram Business</h4>
      <ul>
        <li>Conteúdo: dicas financeiras, bastidores, dados de mercado</li>
        <li>Reels curtos com insights do fundador</li>
        <li>Stories com enquetes e perguntas</li>
        <li>Meta: 1.000 seguidores em 6 meses</li>
      </ul>
    </div>
  </div>

  <h3>Prioridade 4: Parcerias Estratégicas</h3>
  <div class="card">
    <h4>Rede de Referrals</h4>
    <ul>
      <li>Escritórios de advocacia corporativa (parceria para due diligence)</li>
      <li>Contadores e auditorias (referência cruzada para clientes)</li>
      <li>Family offices e investidores (deal flow compartilhado)</li>
      <li>Plataformas: Chiefs.Group, Executivos Brasil, 1000 Open Startups</li>
    </ul>
  </div>

  <span class="page-number">12</span>
</div>

<!-- PAGE 13: ROADMAP -->
<div class="page">
  <span class="section-tag">Seção 11</span>
  <h2>Roadmap de Implementação</h2>
  <p class="subtitle">Plano de ação estruturado em 90 dias para transformação digital.</p>

  <h3>Fase 1 — Fundações (Dias 1-30)</h3>
  <div class="card success">
    <h4>Semana 1-2: Presença Básica</h4>
    <ul>
      <li>Criar Google My Business completo</li>
      <li>Configurar WhatsApp Business com catálogo</li>
      <li>Criar Instagram Business + 9 posts iniciais</li>
      <li>Atualizar LinkedIn: banners, descrição, especialidades</li>
    </ul>
    <h4>Semana 3-4: Website MVP</h4>
    <ul>
      <li>Novo site multi-page (Next.js/React) com SEO técnico</li>
      <li>Formulário de contato + integração WhatsApp</li>
      <li>Páginas: Home, Sobre, CFO, M&A, Contato</li>
      <li>Lead magnet: "Guia Gratuito: Como Preparar sua Empresa para M&A"</li>
    </ul>
  </div>

  <h3>Fase 2 — Conteúdo (Dias 31-60)</h3>
  <div class="card" style="border-left-color:#ff5a00;">
    <h4>Semana 5-6: Conteúdo SEO</h4>
    <ul>
      <li>Blog: 4 artigos iniciais ("O que é CFO sob demanda", "Processo de M&A passo a passo", etc.)</li>
      <li>Schema markup implementado (Organization, LocalBusiness, FAQPage, Article)</li>
      <li>Sitemap.xml + robots.txt otimizados</li>
      <li>Google Search Console + Analytics configurados</li>
    </ul>
    <h4>Semana 7-8: Cases e Prova Social</h4>
    <ul>
      <li>Criar 3-5 estudos de caso (anônimos com dados reais)</li>
      <li>Coletar 5+ depoimentos de clientes satisfeitos</li>
      <li>Adicionar logos de clientes (com autorização)</li>
      <li>Publicar 8 posts no Instagram + 4 no LinkedIn</li>
    </ul>
  </div>

  <h3>Fase 3 — Aceleração (Dias 61-90)</h3>
  <div class="card" style="border-left-color:#8b5cf6;">
    <h4>Semana 9-10: Automação e Conversão</h4>
    <ul>
      <li>Implementar CRM (HubSpot free ou RD Station)</li>
      <li>Automação de e-mail: sequência de nutrição para leads</li>
      <li>Quiz interativo: "Sua empresa está pronta para M&A?"</li>
      <li>Landing page para cada serviço</li>
    </ul>
    <h4>Semana 11-12: Expansão</h4>
    <ul>
      <li>Campanha Google Ads ( Remarketing + "CFO sob demanda São Paulo")</li>
      <li>Parcerias: abordar 5 escritórios de advocacia + 5 contadores</li>
      <li>Evento webinar: "Tendências de M&A para PMEs em 2026"</li>
      <li>Meta: 50+ leads qualificados no pipeline</li>
    </ul>
  </div>

  <span class="page-number">13</span>
</div>

<!-- PAGE 14: PROJEÇÃO -->
<div class="page">
  <span class="section-tag">Seção 12</span>
  <h2>Projeção de Resultados</h2>
  <p class="subtitle">Estimativas de impacto e ROI das ações recomendadas.</p>

  <h3>Métricas Atuais vs. Projetadas (12 meses)</h3>
  <table>
    <tr><th>Métrica</th><th>Atual</th><th>6 Meses</th><th>12 Meses</th><th>Crescimento</th></tr>
    <tr><td>Seguidores LinkedIn</td><td>136</td><td>500</td><td>1.500</td><td><span class="tag success">+1.000%</span></td></tr>
    <tr><td>Seguidores Instagram</td><td>0</td><td>500</td><td>2.000</td><td><span class="tag success">Novo canal</span></td></tr>
    <tr><td>Tráfego orgânico (mensal)</td><td>~50 visitas</td><td>500 visitas</td><td>2.000 visitas</td><td><span class="tag success">+3.900%</span></td></tr>
    <tr><td>Leads qualificados/mês</td><td>~2 (rede pessoal)</td><td>10</td><td>30</td><td><span class="tag success">+1.400%</span></td></tr>
    <tr><td>Google Maps views/mês</td><td>0</td><td>1.000</td><td>3.000</td><td><span class="tag success">Novo canal</span></td></tr>
    <tr><td>Avaliações Google</td><td>0</td><td>15</td><td>40+</td><td><span class="tag success">Novo canal</span></td></tr>
    <tr><td>Artigos publicados</td><td>0</td><td>8</td><td>24</td><td><span class="tag success">Novo canal</span></td></tr>
    <tr><td>Conversão lead → cliente</td><td>~20% (rede)</td><td>8%</td><td>10%</td><td><span class="tag warn">Natural</span></td></tr>
  </table>

  <h3>Projeção Financeira</h3>
  <div class="grid-2">
    <div class="card">
      <h4>Investimento em Marketing Digital</h4>
      <div class="bar-row"><div class="bar-label">Website (dev + design)</div><div class="bar-track"><div class="bar-fill cyan" style="width:60%">R$ 8.000-15.000</div></div></div>
      <div class="bar-row"><div class="bar-label">Conteúdo (6 meses)</div><div class="bar-track"><div class="bar-fill orange" style="width:40%">R$ 6.000-12.000</div></div></div>
      <div class="bar-row"><div class="bar-label">Google Ads (6 meses)</div><div class="bar-track"><div class="bar-fill green" style="width:30%">R$ 5.000-10.000</div></div></div>
      <div class="bar-row"><div class="bar-label">CRM + Automação</div><div class="bar-track"><div class="bar-fill purple" style="width:15%">R$ 1.500-3.000</div></div></div>
      <p style="font-size:13px; margin-top:12px;"><strong>Total estimado (12 meses):</strong> R$ 20.500 – R$ 40.000</p>
    </div>
    <div class="card success">
      <h4>Retorno Esperado</h4>
      <div class="bar-row"><div class="bar-label">Mês 1-3</div><div class="bar-track"><div class="bar-fill orange" style="width:15%">2-3 novos clientes</div></div></div>
      <div class="bar-row"><div class="bar-label">Mês 4-6</div><div class="bar-track"><div class="bar-fill cyan" style="width:35%">5-8 novos clientes</div></div></div>
      <div class="bar-row"><div class="bar-label">Mês 7-12</div><div class="bar-track"><div class="bar-fill green" style="width:60%">12-20 novos clientes</div></div></div>
      <p style="font-size:13px; margin-top:12px;"><strong>Receita potencial adicional:</strong> R$ 180.000 – R$ 600.000/ano</p>
      <p style="font-size:12px; color:#10b981; font-weight:700;">ROI estimado: 450% – 1.500%</p>
    </div>
  </div>

  <div class="highlight-box">
    <h4>Nota Metodológica</h4>
    <p>Estes números são estimativas baseadas em benchmarks de consultorias financeiras similares no mercado brasileiro. O retorno real depende da qualidade da execução, do mercado macroeconômico e da capacidade de conversão da equipe comercial. O modelo assume ticket médio de R$ 15.000/mês (CFO fractional) e R$ 40.000/projeto (M&A).</p>
  </div>

  <span class="page-number">14</span>
</div>

<!-- PAGE 15: CONCLUSÃO -->
<div class="page">
  <span class="section-tag">Seção 13</span>
  <h2>Conclusão e Próximos Passos</h2>
  <p class="subtitle">Resumo executivo do diagnóstico e recomendações estratégicas.</p>

  <div class="grid-2">
    <div>
      <h3>Resumo Executivo</h3>
      <p>A Onward Consultoria possui <strong>uma das melhores propostas de valor</strong> do mercado brasileiro de consultoria financeira: a combinação única de Fractional CFO + M&A Advisory, sustentada por um fundador com 25+ anos de experiência e passagem pelo Credit Suisse.</p>
      <p>No entanto, essa proposta de valor <strong>não é comunicada ao mercado</strong>. A presença digital da empresa está em um nível crítico (score 2.1/10), com ausência de Google My Business, website minimalista, zero depoimentos de clientes e nenhum conteúdo de marketing.</p>
      <p>A boa notícia: <strong>o gap é a oportunidade</strong>. Como nenhum concorrente domina o espaço digital para "CFO sob demanda São Paulo", a Onward pode conquistar essa posição com investimento relativamente modesto em marketing digital.</p>
    </div>
    <div>
      <h3>Recomendações Finais</h3>
      <div class="card success">
        <h4>Ações Imediatas (esta semana)</h4>
        <ul>
          <li>Criar Google My Business</li>
          <li>Adicionar WhatsApp no site atual</li>
          <li>Coletar 3 depoimentos de clientes por e-mail</li>
        </ul>
      </div>
      <div class="card" style="border-left-color:#ff5a00;">
        <h4>Curto Prazo (30 dias)</h4>
        <ul>
          <li>Novo website profissional multi-page</li>
          <li>Instagram Business ativo</li>
          <li>Lead magnet + formulário de captura</li>
        </ul>
      </div>
      <div class="card" style="border-left-color:#8b5cf6;">
        <h4>Médio Prazo (90 dias)</h4>
        <ul>
          <li>Blog com conteúdo SEO</li>
          <li>CRM + automação de leads</li>
          <li>Parcerias com 10+ escritórios</li>
          <li>Meta: 30 leads qualificados/mês</li>
        </ul>
      </div>
    </div>
  </div>

  <h3>Visão Geral do Score</h3>
  <div class="grid-4">
    <div style="text-align:center;">
      <div class="score-circle score-low"><div class="val">2.1</div><div class="lbl">Digital</div></div>
    </div>
    <div style="text-align:center;">
      <div class="score-circle score-mid"><div class="val">7.5</div><div class="lbl">Serviços</div></div>
    </div>
    <div style="text-align:center;">
      <div class="score-circle score-low"><div class="val">1.5</div><div class="lbl">SEO</div></div>
    </div>
    <div style="text-align:center;">
      <div class="score-circle score-mid"><div class="val">8.0</div><div class="lbl">Credibilidade</div></div>
    </div>
  </div>

  <div class="highlight-box" style="text-align:center; margin-top:32px;">
    <h4 style="font-size:20px;">Potencial de Transformação</h4>
    <p style="font-size:15px;">Com investimento de R$ 20.000-40.000 em 12 meses, a Onward pode aumentar sua base de leads em <strong>1.400%</strong> e gerar receita adicional de <strong>R$ 180.000-600.000/ano</strong>.</p>
    <p style="font-size:13px; color:#888; margin-top:12px;">Preparado por: ESCOM Studio | Análise Estratégica para Onward Consultoria<br>Data: 21 de Julho de 2026 | Versão 1.0</p>
  </div>

  <span class="page-number">15</span>
</div>

<!-- PAGE 16: CTA FINAL ESCOM STUDIO -->
<div class="page" style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); color: #fff;">
  <span class="section-tag" style="background: rgba(246,51,4,0.15); color: #F63304;">Próximo Passo</span>
  <h2 style="color: #fff; font-size: 36px; margin-bottom: 12px;">Pronto para transformar a presença da Onward Consultoria?</h2>
  <p class="subtitle" style="color: rgba(255,255,255,0.7);">Desenvolvemos a nova landing page institucional de alta conversão para a Onward Consultoria com o ecossistema completo de captação de PMEs.</p>

  <div class="highlight-box" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(0,209,255,0.3); padding: 32px; border-radius: 16px; margin: 32px 0;">
    <h3 style="color: #F63304; font-size: 24px; margin-top: 0; margin-bottom: 16px;">Projeto Completo &amp; Proposta de Implantação</h3>
    <ul style="color: rgba(255,255,255,0.9); font-size: 15px; line-height: 1.8;">
      <li><strong>Landing Page Institucional Completa:</strong> 15 seções em Dark Mode Premium com Three.js e GSAP</li>
      <li><strong>Infraestrutura de Alta Performance:</strong> Hospedagem em Edge CDN global com tempo de carregamento &lt; 0.8s</li>
      <li><strong>Integração Comercial Direta:</strong> Captação automática no WhatsApp e sistema de agendamento de reuniões</li>
      <li><strong>Entrega Pronta e Configurada:</strong> Domínio personalizado, SSL e SEO inicial ativado</li>
    </ul>

    <div style="margin-top: 28px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span style="font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1.5px; display: block;">Investimento Único de Ativação</span>
        <strong style="font-size: 32px; color: #10b981;">R$ 990,00</strong>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1.5px; display: block;">Prazo de Liberação</span>
        <strong style="font-size: 20px; color: #fff;">Imediato</strong>
      </div>
    </div>
  </div>

  <div class="card" style="background: rgba(246,51,4,0.08); border-left-color: #F63304; color: #fff; padding: 24px; margin-top: 24px;">
    <h4 style="color: #F63304; font-size: 18px; margin-bottom: 8px;">Acessar Projeto no Ar &amp; Falar com a Equipe:</h4>
    <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 12px;">Visualizar o site em execução ao vivo:</p>
    <p style="font-size: 16px; font-weight: bold;"><a href="https://escomstudio.com.br/site-onward-consultoria" style="color: #F63304; text-decoration: underline;">https://escomstudio.com.br/site-onward-consultoria</a></p>
  </div>

  <p style="font-size: 12px; color: rgba(255,255,255,0.4); text-align: center; margin-top: 40px;">ESCOM Studio &copy; 2026 | Engenharia de Conversão &amp; Tecnologia de Prospecção</p>

  <span class="page-number">16</span>
</div>

</body>
</html>`;

(async () => {
  console.log('Gerando PDF da Onward Consultoria...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(reportHTML, { waitUntil: 'networkidle0' });

  const pdfPath = join(REPORT_DIR, 'Onward_Consultoria_Analise_Estrategica.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });

  // Também salvar na pasta public/reports para deploy e acesso público direto
  const publicReportsDir = join(process.cwd(), 'public', 'reports');
  mkdirSync(publicReportsDir, { recursive: true });
  const publicPdfPath = join(publicReportsDir, 'Onward_Consultoria_Analise_Estrategica.pdf');
  await page.pdf({
    path: publicPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  console.log(`PDF público gerado: ${publicPdfPath}`);

  await browser.close();
  console.log(`PDF gerado: ${pdfPath}`);
})();
