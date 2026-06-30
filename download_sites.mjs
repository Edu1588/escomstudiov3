import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzZmNGU0YThkNDUyMzRkMjJhNTZiZjQ2MGZjZWVhMGNjEgsSBxCCh-eE8AMYAZIBIwoKcHJvamVjdF9pZBIVQhMzOTQ3MjY5OTI0NDE4MzUyMjEy&filename=&opi=96797242',
    dest: 'public/site-belini/index.html'
  },
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzBjYTI3M2M0ZTA0MjRlMWFiN2ZjNDNhY2U2Y2RmOWUyEgsSBxCCh-eE8AMYAZIBIwoKcHJvamVjdF9pZBIVQhMyMDUwNTE3MTI1MTMyMDkxMDEw&filename=&opi=96797242',
    dest: 'public/site-giovana-lumertz/index.html'
  },
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzY2ZmViMjQwZjJjNDQ1NzU4YzRiZmMxZGQzOTIzNjI1EgsSBxCCh-eE8AMYAZIBIgoKcHJvamVjdF9pZBIUQhI1NTcwNjkwOTM4Mzg0NjEzNjk&filename=&opi=96797242',
    dest: 'public/site-austin-simply-fit/index.html'
  }
];

downloads.forEach((item) => {
  const dir = path.dirname(item.dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  https.get(item.url, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      fs.writeFileSync(item.dest, data);
      console.log(`Baixado: ${item.dest}`);
    });
  }).on('error', (err) => {
    console.error(`Erro ao baixar ${item.dest}:`, err.message);
  });
});
