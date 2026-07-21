---
name: escom-site-builder
description: Framework de engenharia de conversão para geração de landing pages de alta performance. Utiliza análise de nicho real, copywriting persuasivo e arquitetura de 15 seções obrigatórias (Bloco A de aprovação, Bloco B com 9+ seções do cliente, Bloco C institucional).
---

# ESCOM Site Builder Framework v2.0

## Visão Geral
Este framework define o padrão de engenharia de conversão para todas as landing pages geradas pela ESCOM Studio. Cada site deve ser uma peça de alta conversão, com copy persuasiva, design dark mode premium e animações de alto impacto.

## Stack Técnica Obrigatória
- **Tailwind CSS** (via CDN) para estilização
- **GSAP + ScrollTrigger** para animações de scroll
- **Three.js** para canvas 3D interativos no hero
- **Lenis** para smooth scrolling
- **Framer Motion** (quando aplicável em React)
- **Google Fonts**: Playfair Display (títulos) + Plus Jakarta Sans (corpo)
- **Font Awesome 6** para ícones

## Regras Estritas de Copy
1. É **TERMINANTEMENTE PROIBIDO** o uso de travessões ou meia-riscas (— ou -) em qualquer parte do texto
2. Toda copy deve ser moldada a partir dos dados REAIS da empresa
3. Vieses cognitivos obrigatórios: Ancoragem, Escassez, Autoridade, Prova Social
4. Tom: Profissional, premium, direto ao ponto

## Hierarquia de Ordem das Seções (ESTRITA)

1. **TOPO ABSOLUTO**: Seção 1 (Tarja de Urgência - Banner fixo do prazo da oferta)
2. **CORPO PRINCIPAL (FOCO 100% NA EMPRESA DO CLIENTE)**:
   - Header Institucional da Empresa (Logo e Menu da empresa)
   - Hero Section (Canvas Three.js 3D + Promessa forte da empresa)
   - Agitação do Problema
   - A Solução
   - Diferenciais Competitivos
   - Como Funciona
   - Prova Social / Depoimentos
   - Sobre a Empresa
   - FAQ
   - CTA Final do Cliente
3. **RODAPÉ DE PROSPECÇÃO & APROVAÇÃO (SEÇÕES ESCOM STUDIO NO FIM DO SITE)**:
   - Chamada para a Análise Estratégica & Dossiê Técnico (Visualizar Análise)
   - Investimento Único (R$ 990) & Expansões Tecnológicas (Upsell)
   - Apresentação ESCOM Studio & Footer de Aceite / Confidencialidade

## Fases de Geração

### FASE 1: Análise de Nicho e Dados Reais
Antes de gerar qualquer conteúdo, analisar profundamente:
- Nicho exato de mercado
- Perfil do público-alvo
- Dor principal a ser resolvida
- Diferenciais competitivos reais

### FASE 2: Arquitetura da Informação e Copywriting
Criar a copy e a estrutura arquitetural seguindo a hierarquia de 15 seções

### FASE 3: Validação e Auto-Correção (QA Interno)
Antes de finalizar, auditar:
1. Não há travessões ou meia-riscas na copy?
2. O Bloco B possui 9 seções distintas focadas no cliente?
3. Heurísticas de Nielsen estão aplicadas?
4. Vieses cognitivos estão aplicados corretamente?
5. A linguagem de design é High-End (GSAP, Three.js, Tailwind)?

## Relatório de QA ESCOM
Ao final de cada geração, incluir um bloco confirmando:
- Auto-validação realizada
- Principais gatilhos cognitivos aplicados
- Conformidade com as 15 seções obrigatórias
