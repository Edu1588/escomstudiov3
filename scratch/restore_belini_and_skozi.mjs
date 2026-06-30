import https from 'https';
import fs from 'fs';
import path from 'path';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      // Se for redirecionamento, segue o redirecionamento
      if ([301, 302, 307, 308].includes(response.statusCode) && response.headers.location) {
        file.close();
        fs.unlinkSync(dest); // deleta o arquivo vazio criado
        
        let redirectUrl = response.headers.location;
        if (redirectUrl.startsWith('/')) {
          const parsedUrl = new URL(url);
          redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
        }
        
        console.log(`[REDIRECT] Seguindo para: ${redirectUrl}`);
        downloadFile(redirectUrl, dest).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (Status Code: ${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`[DOWNLOAD] Baixado com sucesso: ${url} -> ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log("Iniciando a restauração das bases limpas dos templates...");
  try {
    // 1. Restaurar Clínica Belini (usando a URL de diretório direta que retorna 200)
    await downloadFile(
      'https://www.escomstudio.com.br/template-belini/',
      './public/template-belini/index.html'
    );

    // 2. Restaurar Skoziê Closet
    await downloadFile(
      'https://www.escomstudio.com.br/template-skozi-closet/',
      './public/template-skozi-closet/index.html'
    );

    console.log("Restauração de bases da Vercel concluída com sucesso!");
  } catch (err) {
    console.error("Falha ao restaurar arquivos:", err.message);
    process.exit(1);
  }
}

run();
