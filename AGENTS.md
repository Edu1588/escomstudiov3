# ESCOM STUDIO — Agent Engineering Guidelines

## Leitura Obrigatória de Entrada
Qualquer IA ou agente que assuma este projeto DEVE ler imediatamente antes de codificar:
1. **[`CONTEXTO_PROJETO.md`](./CONTEXTO_PROJETO.md)**: Visão geral da Home ativa, stack, arquitetura, regras estritas de design da linha e comandos de execução.
2. **[`docs/diario.md`](./docs/diario.md)**: Histórico completo de alterações, decisões do dono e pendências.

## Mandatory Skill Activation (Matt Pocock Skills)
Em qualquer nova solicitação, comando de código, refatoração, criação de features ou resolução de bugs, o assistente DEVE obrigatoriamente acionar e seguir as diretrizes do conjunto de skills do Matt Pocock (`mattpocock/skills`):

1. **`implement` & `tdd`**: Implementação com testes e validação rigorosa orientada a engenharia real.
2. **`wayfinder`**: Localização e mapeamento cirúrgico de arquivos e arquitetura antes de qualquer alteração.
3. **`code-review` & `improve-codebase-architecture`**: Revisão estrita de tipagem TypeScript, modularização e integridade de código.
4. **`diagnosing-bugs`**: Análise de causa-raiz sem suposições precipitadas.
5. **`grill-me` / `to-spec`**: Especificação clara e alinhamento de requisitos técnicos.

## Regras Globais
- **Língua**: Sempre responder em Português do Brasil.
- **Engenharia Real**: Sem código improvisado (*no vibe coding*), com validação de build, typesafe estrito e verificação em runtime.
