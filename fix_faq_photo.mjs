import fs from 'fs';

const filePath = 'E:/ANTIGRAVITY/ESCOM_STUDIO/build_elizabete_v3.mjs';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Extrair a seção FAQ
const faqStart = content.indexOf('        <section class="py-24 bg-gray-50" id="faq">');
const faqEndStr = '        </section>\n\n        <!-- Sobre a Dra Elizabete -->';
const faqEnd = content.indexOf(faqEndStr);

if (faqStart !== -1 && faqEnd !== -1) {
    const faqSection = content.substring(faqStart, faqEnd + 19); // 19 is length of "        </section>\n\n"
    
    // Remover o FAQ do local atual
    content = content.replace(faqSection, '');
    
    // Inserir o FAQ antes do </main>
    content = content.replace('    </main>', faqSection + '    </main>');
    console.log('FAQ movido com sucesso para o final.');
} else {
    console.log('FAQ não encontrado ou já movido.');
}

// 2. Trocar a imagem do médico masculino por uma profissional feminina
// URL antiga (masculina): https://images.unsplash.com/photo-1622253692010-333f2da6031d
// Nova URL (feminina): https://images.unsplash.com/photo-1559839734-2b71ea197ec2
content = content.replace(
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Arquivo build_elizabete_v3.mjs atualizado com sucesso.');
