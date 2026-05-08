import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');
const script = `
        // Contact Form Submission
        const contactForm = document.getElementById('contact-form');
        if(contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = document.getElementById('c-submit');
                const originalText = btn.innerText;
                btn.innerText = "ENVIANDO...";
                btn.disabled = true;

                const name = document.getElementById('c-name').value;
                const email = document.getElementById('c-email').value;
                const phone = document.getElementById('c-whatsapp').value;
                const message = document.getElementById('c-message').value;

                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, phone, message })
                    });

                    const data = await response.json();
                    if (data.success) {
                        btn.innerText = "ENVIADO COM SUCESSO!";
                        btn.style.background = "var(--neon)";
                        btn.style.color = "var(--bg-dark)";
                        contactForm.reset();
                    } else { throw new Error('Erro'); }
                } catch (error) {
                    btn.innerText = "ERRO AO ENVIAR. CONTATE-NOS VIA EMAIL.";
                }
                setTimeout(() => { btn.innerText = originalText; btn.style.background = ""; btn.style.color = ""; btn.disabled = false; }, 4000);
            });
        }
`;
html = html.replace('initLottie();\n        }', 'initLottie();\n        }\n' + script);
fs.writeFileSync('index.html', html);
