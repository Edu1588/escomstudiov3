import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const out = execSync('git log -p -10 index.html').toString();
writeFileSync('git_history.txt', out);
