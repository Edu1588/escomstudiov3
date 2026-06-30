import fs from 'fs';

let content = fs.readFileSync('rebuild_layouts_correctly.mjs', 'utf8');

// The file currently has: execSync('node build_elizabete_v2.mjs', {stdio: 'inherit'});
content = content.replace("execSync('node build_elizabete_v2.mjs', {stdio: 'inherit'});", "execSync('node build_elizabete_v3.mjs', {stdio: 'inherit'});");

fs.writeFileSync('rebuild_layouts_correctly.mjs', content, 'utf8');
