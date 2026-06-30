import fs from 'fs';
import { execSync } from 'child_process';

// 1. Restaurar o arquivo do Passo 35 (que contem o truncamento limpo)
console.log("Executando extract_code.mjs para carregar a base do Passo 35...");
execSync("node extract_code.mjs", { stdio: 'inherit' });

// 2. Ler o arquivo restaurado
const filePath = 'src/baseproposta/BaseProposta.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 3. Encontrar a segunda ocorrencia de "SERVIÇOS INCLUSOS"
const targetStr = '<h4 className="text-gray-400 font-bold mb-2 font-mono text-xs">SERVIÇOS INCLUSOS</h4>';
const index = content.lastIndexOf(targetStr);

if (index === -1) {
  console.error("Não foi possível encontrar a tag de SERVIÇOS INCLUSOS do PDF no arquivo.");
  process.exit(1);
}

console.log("Encontrado SERVIÇOS INCLUSOS do PDF no caractere:", index);

// Cortar o conteúdo até logo após essa tag
const headerContent = content.substring(0, index + targetStr.length);

// Anexar o final correto reconstruído logicamente
const finalReconstructedContent = headerContent + `
                 {proposal.selectedServices.map((s: any) => (
                   <p key={s.id} className="text-sm text-gray-300 font-mono mb-1">{s.name}</p>
                 ))}
                 <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '16px auto' }}></div>
              </div>
            )}
            
            <p className="text-4xl text-[#2EFF00] font-black leading-none mb-2">R$ {totalValueSplit[0]},{totalValueSplit[1] || '00'}</p>
            <p className="text-sm text-gray-400 mt-2">Essa Proposta com esse valor promocional é válida por 3 dias.</p>
        </div>

        {/* Since it's a PDF, links might still be clickable on digital viewers */}
        <p className="text-center font-bold mb-4">Gostou? Clique abaixo para começarmos!</p>
        <a href={\`https://wa.me/\${phone}?text=\${wppText}\`} target="_blank" rel="noreferrer" className="block w-full text-center p-4 bg-[#2EFF00] text-black font-bold mb-4" style={{ textDecoration: 'none', borderRadius: '5px' }}>
            QUERO FECHAR COM VOCÊ
        </a>
        <p className="text-center mt-6 text-sm text-gray-400">Ainda Ficou com alguma dúvida?</p>
        <a href={\`https://wa.me/\${phone}?text=\${encodeURIComponent("Olá ESCOM STUDIO, tive uma dúvida sobre a proposta.")}\`} target="_blank" rel="noreferrer" className="block w-full text-center p-4 bg-[#111] text-[#2EFF00] font-bold" style={{ border: '1px solid #2EFF00', textDecoration: 'none', borderRadius: '5px' }}>
            Clique aqui para me chamar no WhatsApp
        </a>

        <div className="text-center mt-12 text-xs text-gray-500 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p>© 2026 Todos os direitos reservados.</p>
            <p className="mt-2">ESCOM STUDIO LTDA | CNPJ: 48.298.795/0001-92</p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(filePath, finalReconstructedContent, 'utf-8');
console.log("BaseProposta.tsx original reconstruído com sucesso de forma íntegra!");
console.log("Número total de linhas:", finalReconstructedContent.split('\n').length);
