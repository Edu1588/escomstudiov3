
(() => {
  const track = document.getElementById('testimonials-track');
  if (!track) return;
  const section = track.closest('section');
  const cards = [...track.children];
  const count = section.querySelector('[data-testimonial-count]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1;
  let requested = null;
  const center = () => track.getBoundingClientRect().left + track.clientWidth / 2;

  function update() {
    const midpoint = center();
    const distance = card => {
      const box = card.getBoundingClientRect();
      return Math.abs(box.left + box.width / 2 - midpoint);
    };
    const next = cards.indexOf(cards.reduce((a, b) => distance(a) <= distance(b) ? a : b));
    if (next === active) return;
    cards[active]?.classList.remove('is-entering');
    active = next;
    cards[active].classList.add('is-entering');
    count.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
  }

  function move(step) {
    requested = ((requested ?? active) + step + cards.length) % cards.length;
    const box = cards[requested].getBoundingClientRect();
    track.scrollTo({left: track.scrollLeft + box.left + box.width / 2 - center(), behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }

  section.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => move(Number(button.dataset.step))));
  track.addEventListener('scroll', update, {passive: true});
  track.addEventListener('scrollend', () => { requested = null; update(); });
  track.addEventListener('pointerdown', () => { requested = null; }, {passive: true});
  track.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  new ResizeObserver(update).observe(track);
  update();
})();
