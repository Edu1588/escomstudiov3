import fs from 'fs';

try {
  let html = fs.readFileSync('public/template-clinica/index.html', 'utf8');
  
  // Trocar Verde Ciano pelo Violeta Premium da Implart
  html = html.replace(/#00BFA5/g, '#6B21A8'); 
  html = html.replace(/#00A690/g, '#581C87'); 
  html = html.replace(/rgba\(0, 191, 165/g, 'rgba(107, 33, 168');
  
  // Para os botões primários
  html = html.replace(/--primary-color: #00BFA5;/g, '--primary-color: #6B21A8;');
  html = html.replace(/--primary-hover: #00A690;/g, '--primary-hover: #581C87;');
  
  // Substituir imagens genéricas pela imagem real extraída do SEO Meta da Implart
  html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1606811841689-23dfddce3e95[^"'\s]+/g, 'https://www.implart.com.br/wp-content/uploads/2019/09/zirconia_protese_total_40kb.jpg');
  html = html.replace(/https:\/\/images\.unsplash\.com\/photo-[^"'\s]+/g, 'https://www.implart.com.br/wp-content/uploads/2019/09/zirconia_protese_total_40kb.jpg');
  
  fs.writeFileSync('public/template-clinica/index.html', html);
  console.log("Cores atualizadas para o Roxo/Violeta ImplArt e Imagens injetadas com sucesso!");
} catch (e) {
  console.log(e.message);
}
