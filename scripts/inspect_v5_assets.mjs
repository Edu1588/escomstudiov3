import fs from 'fs';
const html = fs.readFileSync('public/home-v5/index.html', 'utf8');

const headStyles = [...html.matchAll(/<link rel="stylesheet"[^>]*>/g)].map(m => m[0]);
console.log('Stylesheets:', headStyles);

const scripts = [...html.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*>/g)].map(m => m[1]);
console.log('External scripts:', scripts);

const inlineScripts = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1].slice(0, 80));
console.log('Inline scripts snippets:', inlineScripts);
