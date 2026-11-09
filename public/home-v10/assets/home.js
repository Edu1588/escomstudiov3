(() => {
  'use strict';
  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = matchMedia('(min-width:1024px)');
  const workDesktop = matchMedia('(min-width:640px)');
  const lenis = !calm && window.Lenis ? new window.Lenis({lerp:.1,autoRaf:true,virtualScroll:wrapUpward}) : null;
  all('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
    if(link.classList.contains('skip-link'))return;
    const target=document.getElementById(link.hash.slice(1));
    if(!target||!lenis)return;
    if(menuOpen)setMenu(false);
    event.preventDefault();lenis.scrollTo(target,{duration:1.2});
  }));
  const header = one('#site-header');
  const menuButton = one('#menu-button');
  const menu = one('#site-menu');
  let menuOpen = false;
  let priorFocus = null;
  function setMenu(open) {
    menuOpen = open;
    if(open)lenis?.stop();else lenis?.start();
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    one('.menu-label', menuButton).textContent = open ? 'FECHAR' : 'MENU';
    menu.inert = !open;
    one('main').inert = open;
    one('footer').inert = open;
    if (open) { priorFocus = document.activeElement; one('a', menu).focus({preventScroll:true}); }
    else if (priorFocus) priorFocus.focus({preventScroll:true});
  }
  menuButton.addEventListener('click', () => setMenu(!menuOpen));
  one('#menu-backdrop').addEventListener('click', () => setMenu(false));
  all('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuOpen) setMenu(false);
    if (event.key === 'Tab' && menuOpen) {
      const focusable = all('a,button',header).filter(el => el.getClientRects().length);
      const current = focusable.indexOf(document.activeElement);
      if (event.shiftKey && current <= 0) { event.preventDefault(); focusable.at(-1).focus(); }
      if (!event.shiftKey && current === focusable.length - 1) { event.preventDefault(); focusable[0].focus(); }
    }
  });

  // Same two-layer timing recovered from the original's shipped homepage chunk.
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add(entry.target.matches('.reveal-mask') ? 'revealed' : 'visible');
    reveals.unobserve(entry.target);
  }), {threshold: .12});
  function splitHeadlines() {
    all('h1,h2').forEach(heading=>{
      const alreadyShown=Boolean(one('.revealed',heading));
      const text=heading.dataset.headline??heading.textContent.trim();heading.dataset.headline=text;
      heading.replaceChildren();
      const words=text.split(/\s+/).map(word=>{const el=document.createElement('span');el.style.display='inline-block';el.textContent=word;heading.append(el,document.createTextNode(' '));return el;});
      const lines=[];let top=-1;
      words.forEach(word=>{if(word.offsetTop!==top){top=word.offsetTop;lines.push([]);}lines.at(-1).push(word.textContent);});
      heading.replaceChildren();
      lines.forEach((line,i)=>{
        if(i)heading.append(document.createElement('br'));
        const mask=document.createElement('span');mask.className='reveal-mask'+(alreadyShown?' revealed':'');mask.style.setProperty('--line-delay',`${i*.1}s`);
        const inner=document.createElement('span');inner.textContent=line.join(' ');mask.append(inner);heading.append(mask);
        if(!alreadyShown)reveals.observe(mask);
      });
    });
  }
  splitHeadlines();
  document.fonts.ready.then(splitHeadlines);
  all('#numeros .grid-cols-1>div').forEach((el,i) => {el.classList.add('rise');el.style.transitionDelay = `${i*.11}s`;reveals.observe(el);});

  const metricsObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('rolled'); metricsObserver.unobserve(entry.target);
  }), {threshold:.7});
  all('.metric-value').forEach(value => {
    const text = value.dataset.value;
    value.replaceChildren();
    for (const char of text) {
      if (!/\d/.test(char)) {value.append(char); continue;}
      const digit = document.createElement('span'); digit.className = 'digit'; digit.setAttribute('aria-hidden','true');
      const strip = document.createElement('span'); strip.className = 'digit-strip'; strip.style.setProperty('--digit',String(10+Number(char)));
      for(let n=0;n<20;n++){const cell=document.createElement('span');cell.textContent=String(n%10);strip.append(cell);}
      digit.append(strip);value.append(digit);
    }
    metricsObserver.observe(value);
  });

  const process = one('#processo');
  const processStage = one('#processo>.relative');
  const rows = all('.process-step');
  const dot = one('.process-dot');
  const imageTrack = one('.process-images');
  let activeStep = -1;
  function setStep(index) {
    index = Math.max(0,Math.min(rows.length-1,index));
    if (index === activeStep) return;
    activeStep = index;
    rows.forEach((row,i) => {row.dataset.active=String(i===index);row.setAttribute('aria-pressed',String(i===index));});
    const delta = rows[index].offsetTop - rows[0].offsetTop;
    dot.style.transform = `translateY(${delta}px) rotate(${index*90}deg)`;
    if (imageTrack) imageTrack.style.transform = `translateY(-${index*100}%)`;
  }
  rows.forEach((row,i) => {
    function select() {
      if (!desktop.matches) return;
      const rect=processStage.getBoundingClientRect();
      const distance=processStage.offsetHeight-innerHeight;
      const progress=i===0?1/12:1/6+(5/6)/(rows.length-1)*(i-.5);
      const y=scrollY+rect.top+progress*distance;
      if(lenis)lenis.scrollTo(y,{duration:.2});else window.scrollTo({top:y,behavior:calm?'instant':'smooth'});
      setStep(i);
    }
    row.addEventListener('click',select);
    row.addEventListener('keydown',e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});
  });
  setStep(0);

  const projectLinks = all('#projetos nav button');
  const desktopCases = all('#projetos .work-gallery .project-card');
  const mobileCases = all('#projetos>.lg\\:hidden .project-card');
  const currentCases = () => workDesktop.matches ? desktopCases : mobileCases;
  projectLinks.forEach(button => button.addEventListener('click', () => {
    const card=currentCases().find(c=>c.dataset.case===button.dataset.caseTarget);
    if(card&&lenis)lenis.scrollTo(card,{duration:1.2});else card?.scrollIntoView({behavior:calm?'instant':'smooth',block:'start'});
  }));
  all('#faq button[aria-expanded]').forEach(button => {
    const panel=one('#'+button.getAttribute('aria-controls'));panel.inert=true;panel.setAttribute('aria-hidden','true');
    button.addEventListener('click', () => {
      const open=button.getAttribute('aria-expanded')!=='true';
      all('#faq button[aria-expanded]').forEach(other => {
        const active=other===button&&open;
        other.setAttribute('aria-expanded',String(active));
        const answer=one('#'+other.getAttribute('aria-controls'));
        answer.classList.toggle('open',active);answer.inert=!active;answer.setAttribute('aria-hidden',String(!active));
      });
    });
  });

  // Dual-color text resolution on hover; original labels stay available to assistive technology.
  const alphabet='<>/[]{}#+%_';
  const jobs=new WeakMap();
  function scramble(el) {
    if(calm)return;
    const original=el.dataset.original??el.textContent;
    el.dataset.original=original;el.setAttribute('aria-label',original);
    clearInterval(jobs.get(el));let frame=0;
    const timer=setInterval(()=>{
      const progress=frame++/18;
      el.textContent=[...original].map((c,i)=>c===' '||i/original.length<progress?c:alphabet[(frame+i*7)%alphabet.length]).join('');
      if(progress>=1){clearInterval(timer);el.textContent=original;}
    },24);
    jobs.set(el,timer);
  }
  all('[data-scramble]').forEach(el=>{
    const hit=el.closest('button')??el;
    hit.addEventListener('pointerenter',()=>scramble(el));hit.addEventListener('focus',()=>scramble(el));
  });
  const cursor=one('#project-cursor');
  all('[data-cursor-text]').forEach(a=>{
    a.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')cursor.classList.add('active');});
    a.addEventListener('pointerleave',()=>cursor.classList.remove('active'));
    a.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';});
  });
  let cyan=false;
  function toggleColor(){cyan=!cyan;document.documentElement.style.setProperty('--escom-brand',cyan?'#00e5ff':'#ff4d00');window.dispatchEvent(new CustomEvent('brand-color',{detail:cyan?[0,229,255]:[255,77,0]}));}
  one('#color-toggle').addEventListener('click',toggleColor);
  document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='c'&&!e.ctrlKey&&!e.metaKey&&!/INPUT|TEXTAREA/.test(e.target.tagName))toggleColor();});

  const contactForm=one('#contato-formulario');
  contactForm.addEventListener('submit',event=>{
    event.preventDefault();
    if(!contactForm.reportValidity())return;
    const data=new FormData(contactForm);
    const name=String(data.get('name')).trim();
    const email=String(data.get('email')).trim();
    const message=`Olá! Quero conversar sobre um projeto com a ESCOM.\n\nNome: ${name}\nE-mail: ${email}`;
    const url='https://wa.me/5513981062787?text='+encodeURIComponent(message);
    window.open(url,'_blank','noopener,noreferrer');
    const status=one('#contact-status');
    status.replaceChildren(document.createTextNode('Seu resumo está pronto. '));
    const next=document.createElement('a');next.href=url;next.target='_blank';next.rel='noopener noreferrer';next.textContent='Continuar no WhatsApp para enviar.';status.append(next);
  });
  const gridButton=one('#grid-toggle');
  function toggleGrid(){const active=one('#grid-overlay').classList.toggle('active');gridButton.setAttribute('aria-pressed',String(active));}
  gridButton.addEventListener('click',toggleGrid);
  document.addEventListener('keydown',event=>{if(event.key.toLowerCase()==='g'&&(event.ctrlKey||event.metaKey)){event.preventDefault();toggleGrid();}});


  const hero = one('#inicio');
  const footer = one('#site-footer');
  let heroContinuation;
  let sourceCanvas;
  let continuationCanvas;
  let continuationContext;
  let glassDisplacement;

  if (!calm) {
    heroContinuation = hero.cloneNode(true);
    heroContinuation.id = 'hero-continuation';
    heroContinuation.removeAttribute('tabindex');
    heroContinuation.setAttribute('aria-hidden', 'true');
    heroContinuation.inert = true;
    sourceCanvas = one('canvas', hero);
    continuationCanvas = one('canvas', heroContinuation);
    continuationCanvas.id = 'hero-continuation-canvas';
    continuationCanvas.removeAttribute('data-ascii-src');
    continuationContext = continuationCanvas.getContext('2d');
    const gap = document.createElement('div');
    gap.className = 'hero-loop-gap';
    gap.setAttribute('aria-hidden', 'true');
    footer.after(gap, heroContinuation);
    document.body.insertAdjacentHTML('beforeend', "<svg width=\"0\" height=\"0\" aria-hidden=\"true\" class=\"hero-glass-defs\" xmlns=\"http://www.w3.org/2000/svg\"><defs><filter id=\"hero-glass-filter\" x=\"-15%\" y=\"-15%\" width=\"130%\" height=\"130%\" color-interpolation-filters=\"sRGB\"><feTurbulence type=\"fractalNoise\" baseFrequency=\".013 .034\" numOctaves=\"2\" seed=\"8\" result=\"glass-map\"/><feDisplacementMap in=\"SourceGraphic\" in2=\"glass-map\" scale=\"0\" xChannelSelector=\"R\" yChannelSelector=\"G\"/></filter></defs></svg>");
    glassDisplacement = one('#hero-glass-filter feDisplacementMap');
    document.documentElement.classList.add('has-hero-loop');
    lenis?.resize();
  }

  function wrapUpward({deltaX, deltaY, event}) {
    if (!heroContinuation || menuOpen || scrollY > 1 || deltaY >= 0 ||
        Math.abs(deltaX) > -deltaY || event.ctrlKey || !event.cancelable) return;
    const seam = scrollY + heroContinuation.getBoundingClientRect().top;
    const step = Math.max(12, Math.min(innerHeight * .45, -deltaY));
    event.preventDefault();
    lenis.scrollTo(seam - step, {immediate:true});
    return false;
  }

  function continueAtHero() {
    if (!heroContinuation || menuOpen) return;
    const continuation = heroContinuation.getBoundingClientRect();
    if (continuation.top > innerHeight || continuation.bottom <= 0) return;

    const progress = 1 - Math.max(0, continuation.top) / innerHeight;
    const reveal = Math.min(1, progress / .88);
    const eased = reveal * reveal * (3 - 2 * reveal);
    heroContinuation.style.setProperty('--hero-entry-opacity', String(eased));
    heroContinuation.style.setProperty('--hero-entry-offset', (1 - eased) * 56 + 'px');
    heroContinuation.style.setProperty('--hero-entry-edge', (eased * 120 - 20) + '%');
    glassDisplacement.setAttribute('scale', String(Math.round(Math.sin(Math.PI * reveal) * 34)));

    if (sourceCanvas.width && sourceCanvas.height && continuationContext) {
      if (continuationCanvas.width !== sourceCanvas.width || continuationCanvas.height !== sourceCanvas.height) {
        continuationCanvas.width = sourceCanvas.width;
        continuationCanvas.height = sourceCanvas.height;
      }
      continuationContext.globalCompositeOperation = 'copy';
      continuationContext.drawImage(sourceCanvas, 0, 0);
      continuationCanvas.style.background = sourceCanvas.style.background;
    }

    const atPageEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    if (continuation.top > 1 && !atPageEnd) return;
    const destination = Math.max(0, scrollY + hero.getBoundingClientRect().top - continuation.top);
    if (lenis) lenis.scrollTo(destination, {immediate:true});
    else window.scrollTo({top:destination, behavior:'instant'});
  }

  const sections=all('main>div>section,footer[data-theme],#hero-continuation');
  let scheduled=false;
  function updateScroll(){
    scheduled=false;
    continueAtHero();
    header.classList.toggle('scrolled',scrollY>40);
    const theme=sections.find(sec=>{const r=sec.getBoundingClientRect();return r.top<65&&r.bottom>65;});
    if(theme&&!menuOpen)header.dataset.theme=theme.dataset.theme;
    const footerRect=one('#site-footer').getBoundingClientRect();
    header.classList.toggle('in-footer',footerRect.top<90&&footerRect.bottom>0&&!menuOpen);
    if(desktop.matches){
      const rect=processStage.getBoundingClientRect();
      if(rect.top<innerHeight&&rect.bottom>0){
        const progress=Math.max(0,Math.min(.999,-rect.top/Math.max(1,rect.height-innerHeight)));
        setStep(progress<1/6?0:Math.min(rows.length-1,Math.floor((progress-1/6)/(5/6)*(rows.length-1))+1));
      }
    }
    const cases=currentCases();
    const activationLine=Math.min(innerHeight*.5,Math.max(180,innerWidth*.3));
    const active=cases.findLast(card=>card.getBoundingClientRect().top<activationLine)??cases[0];
    projectLinks.forEach(b=>b.setAttribute('aria-current',String(b.dataset.caseTarget===active?.dataset.case)));
    if(workDesktop.matches){
      cases.forEach(card=>{
        const rect=card.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;
        const image=one('a>div',card);
        if(image&&!calm)image.style.transform=`translateY(${(innerHeight*.5-rect.top-rect.height*.5)*.055}px) scale(1.15)`;
      });
    }
  }
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});
  let resizeTimer;
  addEventListener('resize',()=>{activeStep=-1;updateScroll();clearTimeout(resizeTimer);resizeTimer=setTimeout(splitHeadlines,120);},{passive:true});
  document.fonts.ready.then(()=>{activeStep=-1;setStep(0);updateScroll();});
  updateScroll();
})();
