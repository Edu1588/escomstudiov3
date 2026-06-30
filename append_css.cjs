const fs = require('fs');

let content = fs.readFileSync('src/index.css', 'utf8');
const cssToAdd = `

/* NEW BRAND MESSAGE BRILLIANCE CSS */
:root {
  --paper: oklch(0.985 0.002 90);
  --ink: oklch(0.13 0 0);
  --rule: oklch(0.13 0 0 / 12%);
  --signal: #02c5ba;

  --background: var(--ink);
  --foreground: var(--paper);
}

@utility font-mono-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@utility display-mega {
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 0.88;
}

@utility hairline {
  border-top: 1px solid var(--ink);
}
`;

fs.writeFileSync('src/index.css', content + cssToAdd, 'utf8');
