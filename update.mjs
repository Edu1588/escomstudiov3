import { readFileSync, writeFileSync } from 'fs';

let css = readFileSync('src/index.css', 'utf8');
css = css.replace(/@keyframes global-icon-float[\s\S]*?transform-origin: center;\r?\n\}/, `@keyframes icon-form-loop {
  0% { clip-path: inset(100% 0 0 0); opacity: 0; }
  10% { opacity: 1; }
  45% { clip-path: inset(0 0 0 0); }
  55% { clip-path: inset(0 0 0 0); }
  90% { opacity: 1; }
  100% { clip-path: inset(0 0 100% 0); opacity: 0; }
}

/* Apply to all SVG elements that act as icons, with size bump and float+glow effect */
body:not(.admin-page) svg.lucide,
body:not(.admin-page) .c-icon-box svg,
body:not(.admin-page) .process-icon svg,
body:not(.admin-page) .card-header > svg,
body:not(.admin-page) .card-icon svg,
body:not(.admin-page) .feature-item svg,
body:not(.admin-page) .tech-icon svg,
body:not(.admin-page) ul li svg,
body:not(.admin-page) .project-modal-item svg,
body:not(.admin-page) .card svg {
  animation: icon-form-loop 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transform-origin: center;
}`);
writeFileSync('src/index.css', css);

let adminHtml = readFileSync('admin/index.html', 'utf8');
adminHtml = adminHtml.replace('<body>', '<body class="admin-page bg-bg-dark text-white font-sans antialiased">');
writeFileSync('admin/index.html', adminHtml);
