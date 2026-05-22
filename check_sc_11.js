
      // Make modal display flex when visible
      const modal = document.getElementById('contact-modal');
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            if (modal.classList.contains('hidden')) {
              modal.style.display = 'none';
            } else {
              modal.style.display = 'flex';
            }
          }
        });
      });
      observer.observe(modal, { attributes: true });

      document.getElementById('contact-modal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('modal-name').value;
        const email = document.getElementById('modal-email').value;
        const phone = document.getElementById('modal-phone').value;
        const message = document.getElementById('modal-message').value;
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando...';
        
        document.getElementById('modal-success-msg').classList.add('hidden');
        document.getElementById('modal-error-msg').classList.add('hidden');

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, message })
          });
          
          if (!res.ok) throw new Error('Request failed');
          
          document.getElementById('modal-success-msg').classList.remove('hidden');
          setTimeout(() => {
            document.getElementById('contact-modal').classList.add('hidden');
            e.target.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }, 2000);
        } catch (error) {
          console.error(error);
          document.getElementById('modal-error-msg').classList.remove('hidden');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    