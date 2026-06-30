import fs from 'fs';

let content = fs.readFileSync('rebuild_layouts_correctly.mjs', 'utf8');
content = content.replace("import { execSync } from 'child_process';", "");

fs.writeFileSync('rebuild_layouts_correctly.mjs', content, 'utf8');
