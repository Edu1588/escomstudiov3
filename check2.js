import fs from 'fs';
import { execSync } from 'child_process';

const files = fs.readdirSync('.').filter(f => f.startsWith('check_sc_') && f.endsWith('.js'));
for (const f of files) {
  try {
    execSync(`node -c ${f}`);
  } catch (e) {
    console.error(`Error in ${f}`);
  }
}
console.log('Done checking.');
