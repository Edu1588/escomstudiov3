import { TextSplitter } from '../lib/textsplitter.js';

const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let lastOrientation = window.orientation;
//spitText animations based on Maonoela Ilic article: https://tympanus.net/codrops/2024/06/19/hover-animations-for-terminal-like-typography/
class FadeInBlock extends HTMLElement {
    connectedCallback() {
        this.animate();
    }

    animate() {
        if (!window.gsap) return;

        window.gsap.from(this.children, {
       y: 120,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".parallax",
        start: "top 80%",
        scrub: true,
        //markers:true
      },
        });

    }
}

customElements.define('fade-in-block', FadeInBlock);

class Ajaxlink extends HTMLElement {
    constructor() {
    super();
    this.container = document.getElementById("page-content");
    this.addEventListener('click',this.ajaxLoad.bind(this));
    
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<style>a {color: inherit; text-decoration: none;} </style>`;
        const anchor = document.createElement('a');
        anchor.setAttribute('href', this.getAttribute('href'));
        anchor.innerHTML = `<slot></slot>`;
        anchor.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.button === 1) return; 
            e.preventDefault();
        });
        shadow.appendChild(anchor);
    }

    async ajaxLoad(){
        var that =  this;
        const url = that.getAttribute("href");
        const isInternal =
        url &&
        !url.startsWith("http") &&
        !url.startsWith("mailto:") &&
        !url.startsWith("#");

        if (!url) return;
        if (url.startsWith("#")) {
            document.body.classList.remove('menu--opened');
            const targetEl = document.querySelector(url);
            if (targetEl) {
                if (window.lenis) window.lenis.scrollTo(targetEl);
                else targetEl.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
        if (!isInternal) {
            document.body.classList.remove('menu--opened');
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }
        document.body.classList.remove('menu--opened');
        // fade--out
        document.body.classList.remove('page--in');
        document.body.classList.add("fade--out");

        await new Promise((r) => setTimeout(r, 400));
        const res = await fetch(url);
        const text = await res.text();

        // format  HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const newContent = doc.getElementById("page-content");
        const inPage = doc.body.getAttribute('data-page');
        const bodyClass = [...doc.body.classList].find(cls => cls.startsWith('body--'));
        const newTitle = doc.querySelector("title");
        if (newTitle) {
            document.title = newTitle.textContent;
        }
        const newDescription = doc.querySelector('meta[name="description"]');
        if (newDescription) {
            let currentDescription = document.querySelector('meta[name="description"]');
            
            if (!currentDescription) {
                currentDescription = document.createElement("meta");
                currentDescription.setAttribute("name", "description");
                document.head.appendChild(currentDescription);
            }

            currentDescription.setAttribute(
                "content",
                newDescription.getAttribute("content") || ""
            );
        }
        if(window.interactiveLogo){
            window.interactiveLogo.destroy();
            //window.interactiveLogo = null;
        }
        if(window.scrollFrames){
            window.scrollFrames.destroy();
            //window.interactiveLogo = null;
        }
        
        // change content
        this.container.innerHTML = newContent.innerHTML;
          document.dispatchEvent(
            new CustomEvent('ajaxLoaded', {
                detail: { url }
                })
            );
		let heroHeight = document.querySelector('.hero__description')?.offsetHeight ?? 0;
        document.querySelector('html').style.setProperty('--hero-height', heroHeight + 'px');
        window.lenis.resize();
        window.lenis.scrollTo(0, {immediate:true, duration: 0});
        window.ScrollTrigger.refresh();
       
        checkhero();
        resetBodyBack(bodyClass);
        document.body.setAttribute('data-page', inPage);
        setTimeout(() => {
            document.body.classList.add('page--in');
            document.dispatchEvent(new CustomEvent('page--in'));
            if(document.querySelector('.h-logo--center')){
            window.interactiveLogo = new InteractiveLogo({
                selector: '.h-logo--center',
                ease: 0.1,
                intensity: 1
            }).init();
            const homeMorph = document.querySelector('.home-morph-wrp')
           // window.scrollFrames = new ScrollFrames(homeMorph);
           // window.scrollFrames.init()
            }  
                 
        }, 400);
        // fade-in
        document.body.classList.remove("fade--out");
        history.pushState({ajax: true}, "", url);
         updateActiveMenu()
        }
    }

customElements.define('a-link', Ajaxlink);

class CrossHair extends HTMLElement {
  constructor() {
    super();

    this.options = {
      thickness: parseInt(this.getAttribute('thickness')) || 1,
      duration: parseFloat(this.getAttribute('duration')) || 0.15,
      ease: this.getAttribute('ease') || 'power2.out',
      zIndex: parseInt(this.getAttribute('z')) || 9999
    };
    
  }

  connectedCallback() {
    this.createElements();
    this.bindEvents();
  }

  disconnectedCallback() {
    this.removeEvents();
  }

  createElements() {
    this.container = document.createElement('div');
    this.vertical = document.createElement('div');
    this.horizontal = document.createElement('div');
    this.container.classList.add('container');
    this.vertical.classList.add('line', 'vertical');
    this.horizontal.classList.add('line', 'horizontal');
    this.cx = document.createElement('div');
    this.cx.classList.add('number-right')    
    this.cy = document.createElement('div');
    this.cy.classList.add('number-bottom');
    this.point = document.createElement('div');
    this.point.classList.add('cross-point')     
    this.container.append(this.vertical, this.horizontal, this.cx, this.cy, this.point);
    

    this.append(this.container);
    
  }

  bindEvents() {
    this.onEnter = () => {
      this.active = true;
      window.gsap.to(this.container, { opacity: 1, duration: 0.1 });
    };

    this.onLeave = () => {
      this.active = false;
      window.gsap.to(this.container, { opacity: 0, duration: 0.1 });
    };

    this.onMove = (e) => {
        const rect = this.getBoundingClientRect();

        const paddingRem = 4;
        const remToPx = parseFloat(
            getComputedStyle(document.documentElement).fontSize
        );
        const padding = paddingRem * remToPx;

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // SOLO límite derecho e inferior
        const maxX = rect.width - padding;
        const maxY = rect.height - padding;

        const limitedX = Math.min(x, maxX);
        const limitedY = Math.min(y, maxY);

        window.gsap.to(this.vertical, {
            x: limitedX,
            duration: this.options.duration,
            ease: this.options.ease
        });

        window.gsap.to(this.horizontal, {
            y: limitedY,
            duration: this.options.duration,
            ease: this.options.ease
        });

        window.gsap.to([this.cx, this.cy, this.point], {
            x: limitedX,
            y: limitedY,
            duration: this.options.duration,
            ease: this.options.ease
        });

        this.cx.innerHTML = 'X: '+ limitedX.toFixed(0);
        this.cy.innerHTML = 'Y: ' +limitedY.toFixed(0);
    };

    this.addEventListener('mouseenter', this.onEnter);
    this.addEventListener('mouseleave', this.onLeave);
    this.addEventListener('mousemove', this.onMove);
  }

  removeEvents() {
    this.removeEventListener('mouseenter', this.onEnter);
    this.removeEventListener('mouseleave', this.onLeave);
    this.removeEventListener('mousemove', this.onMove);
  }
}

customElements.define('cross-hair', CrossHair);

class CrossImage extends HTMLElement {
  constructor() {
    super();

    this.options = {
      ease: this.getAttribute('ease') || 'power2.out',
      thickness: parseInt(this.getAttribute('thickness')) || 1
    };

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  connectedCallback() {
 this.waitForGSAP().then(() => {

      if (this._initialized) return;
      this.cacheElements();
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onResize);
      this._initialized = true;
      this.init();
      this.onScroll(); // estado inicial
    });
  }

  async waitForGSAP() {
    if (window.gsap) return;

    return new Promise(resolve => {
      const i = setInterval(() => {
        if (window.gsap) {
          clearInterval(i);
          resolve();
        }
      }, 16); // 1 frame
    });
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }

  cacheElements() {
    this.img = this.querySelector('.crossimg');
    this.imgtag = this.querySelector('img');
    this.cross = this.querySelector('.cross');
    this.vertical = this.querySelector('.vertical');
    this.horizontal = this.querySelector('.horizontal');
    this.numberR = this.querySelector('.number-right');
    this.numberB = this.querySelector('.number-bottom');
    this.point = this.querySelector('.cross-point');
  }

  init() {
    gsap.set(this.img, {
      clipPath: 'inset(1rem)'
    });

    gsap.set([this.vertical, this.horizontal, this.numberR, this.numberB, this.point], {
      x: 0,
      y: 0
    });
  }
    onResize() {
    const mobile = isMobile();
    if (mobile && !checkOrientation()) return;
    this.onScroll();
    }

  onScroll() {
    const rect = this.getBoundingClientRect();
    const vh = window.innerHeight;

    // NUEVOS LÍMITES
    const start = vh * 0.80; // 10% inferior
    const end = vh * 0.05;   // 25% superior

    let progress = (start - rect.top) / (start - end);
    progress = gsap.utils.clamp(0, 1, progress);

    // --- MAPEO VISUAL ---
    const rem = Math.round(parseFloat(
        getComputedStyle(document.documentElement).fontSize
    ));
    const endOffsetPx = 3 * rem;
    const height = this.img.offsetHeight;
    const width = this.img.offsetWidth;
    const pend = endOffsetPx / height;
    const endOffsetPercentX = (endOffsetPx / height) * 100;
    const endOffsetPercentY = (endOffsetPx / width) * 100;
    const margin = rem*1.25;
    const x = rect.width * progress - margin;
    const y = rect.height * progress;

    const maxRevealY = 100 - endOffsetPercentY;
    const maxRevealX = 100 - endOffsetPercentX;
    const right = gsap.utils.clamp(0, 100, 100 - progress * maxRevealY);
    const bottom = gsap.utils.clamp(0, 100, 100 - progress * maxRevealX);
    const totalHeight = this.offsetHeight;
    const maxTravelY = totalHeight - endOffsetPx;
    const totalWidth = this.offsetWidth;
    const maxTravelX = totalWidth - endOffsetPx ;
    this.numberR.innerHTML='X: ' + x.toFixed(0);
    this.numberB.innerHTML='Y: ' + y.toFixed(0);

    const yt = gsap.utils.clamp(
    -1,
    maxTravelY-1.25*rem,
    (progress * maxTravelY)-1.25*rem
    );
    const xt = gsap.utils.clamp(
    -1,
    maxTravelX-1.25*rem,
    (progress * maxTravelX)-1.25*rem
    );
    
    gsap.to(this.vertical, {
        x:xt,
        duration: 0.1,
        ease: this.options.ease
    });

    gsap.to(this.horizontal, {
        y:yt,
        duration: 0.1,
        ease: this.options.ease
    });

    gsap.to([this.numberR, this.numberB, this.point], {
        y:yt,
        x:xt,
        duration: 0.1,
        ease: this.options.ease
    });

    gsap.to(this.imgtag,{
        scale:(2 - progress * 1),
        duration: 0.1,
        ease: this.options.ease
    })
    const iniclip = (window.innerWidth >1024)?'1.25rem':'1rem';

    gsap.to(this.img, {
         clipPath: `inset(
                ${iniclip} 
                calc(${right}% + ${rem*1.25}px)
                calc(${bottom}% + ${rem*1.25}px)
                ${iniclip} 
            )`,
        duration: 0.1,
        ease: this.options.ease
    });
    }
}

customElements.define('cross-image', CrossImage);

class CrossImageMouse extends HTMLElement {
  constructor() {
    super();

    this.threshold = 0.1; // 10%
    this.active = false;

    this.options = {
      duration: parseFloat(this.getAttribute('duration')) || 0.15,
      ease: this.getAttribute('ease') || 'power2.out',
      thickness: parseInt(this.getAttribute('thickness')) || 1
    };

  }

  connectedCallback() {
    this.cacheElements();
    this.bindEvents();
  }

  disconnectedCallback() {
    this.removeEvents();
  }

  
  cacheElements() {
    this.img = this.querySelector('img');
    this.cross = this.querySelector('.cross');
    this.vertical = this.querySelector('.vertical');
    this.horizontal = this.querySelector('.horizontal');
  }


  bindEvents() {
    this.onEnter = () => {
      //this.active = true;
      //gsap.to(this.cross, { opacity: 1, duration: 0.2 });
    };

    this.onLeave = () => {
      //this.active = false;
        let rect2 = this.getBoundingClientRect();
        let xP = rect2.width/10;
        let yP = rect2.height/10;
       window.gsap.to(this.vertical, { x:xP, duration: 0.5, ease: this.options.ease});
        window.gsap.to(this.horizontal, { y:yP, duration: 0.5, ease: this.options.ease});

      window.gsap.to(this.img, {
        clipPath: 'inset(0 90% 90% 0)',
        duration: 0.5,
         ease: this.options.ease
      });
    };

    this.onMove = (e) => {
      //if (!this.active || !this.img) return;

      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = x / rect.width;
      const py = y / rect.height;
        
      // Umbral del 10%
      if (px < this.threshold && py < this.threshold) return;

      window.gsap.to(this.vertical, {
        x,
        duration: this.options.duration,
        ease: this.options.ease
      });

      window.gsap.to(this.horizontal, {
        y,
        duration: this.options.duration,
        ease: this.options.ease
      });

      const right = gsap.utils.clamp(0,90,100 - px * 100);
      const bottom = gsap.utils.clamp(0,90,100 - py * 100);

      window.gsap.to(this.img, {
        clipPath: `inset(0 ${right}% ${bottom}% 0)`,
        duration: this.options.duration,
        ease: this.options.ease
      });
    };

    this.addEventListener('mouseenter', this.onEnter);
    this.addEventListener('mouseleave', this.onLeave);
    this.addEventListener('mousemove', this.onMove);
  }

  removeEvents() {
    this.removeEventListener('mouseenter', this.onEnter);
    this.removeEventListener('mouseleave', this.onLeave);
    this.removeEventListener('mousemove', this.onMove);
  }
}

customElements.define('cross-image-mouse', CrossImageMouse);

class AnimatedTitle extends HTMLElement {
  constructor() {
    super();
    this._hasAnimated = false;
    this.onScroll = this.onScroll.bind(this);
    this.onView = this.onView.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  connectedCallback() {
 this.waitForGSAP().then(() => {

      if (this._initialized) return;
        this.rect = this.getBoundingClientRect();    
        const content = this.querySelector('.content');
        if (!content) return;
        this.textElement = content;
        this.originalText = content.textContent.trim();
        this.textElement.style.opacity=0;
        /*content.textContent = '';

        this.buildLetters(content);*/
        
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onResize, { passive: true });

        this.splitText();
        let that = this;
        let dis = window.innerHeight/4;
        if(isElementVisible(this, dis)){
            setTimeout(function(){that.onView()},1000); // check inicial
        }
        
       
    });
  }

  async waitForGSAP() {
    if (window.gsap) return;

    return new Promise(resolve => {
      const i = setInterval(() => {
        if (window.gsap) {
          clearInterval(i);
          resolve();
        }
      }, 16); // 1 frame
    });
  
  }
  splitText() {
    // Split text for animation and store the reference.
    this.splitter = new TextSplitter(this.textElement, {
      splitTypeTypes: 'words, chars'
    });

    // Save the initial state of each character
    this.originalChars = this.splitter.getChars().map(char => char.innerHTML);
    
  }
  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll);
  }

  buildLetters(container) {
    const fragment = document.createDocumentFragment();

    [...this.originalText].forEach((char) => {
      const letterWrapper = document.createElement('span');
      letterWrapper.className = 'letter-mask';

      const letter = document.createElement('span');
      letter.className = 'letter';
      letter.textContent = char === ' ' ? '\u00A0' : char;

      letterWrapper.appendChild(letter);
      fragment.appendChild(letterWrapper);
    });

    container.appendChild(fragment);
  }

   onResize() {
    const mobile = isMobile();
    if (mobile && !checkOrientation()) return;
    this.onScroll();
    }
  onView(){
    let dis = window.innerHeight/4;
        if(isElementVisible(this, 0)){
		this.querySelector('.c__header').classList.remove('hide');
        let that =  this;
        setTimeout(function(){that.querySelector('.content').style.opacity=1;},1000)
        this.hasAnimated = true;
        this.animate();
    }
  }
  onScroll() {
    if (this.hasAnimated) return;
    let dis = window.innerHeight/4;
    if(isElementVisible(this, dis)){
		this.querySelector('.c__header').classList.remove('hide');
        this.textElement.style.opacity=1;
        this.hasAnimated = true;
        this.animate();
    }
   
    
  }

  animate() {
         if(!this.splitter){ return}
            
    // Reset any ongoing animations
        this.reset();
        
        // Query all individual characters in the line for animation.
        const chars = this.splitter.getChars();
   
        chars.forEach((char, position) => {
        let initialHTML = char.innerHTML;
        let repeatCount = 0;
        
        gsap.fromTo(char, {
            opacity: 0
        },
        {
            duration: 0.03,
            onStart: () => {
            // Set --opa to 1 at the start of the animation
            gsap.set(char, { '--opa': 1 });
            },
            onComplete: () => {
            gsap.set(char, {innerHTML: initialHTML, delay: 0.03})
            },
            repeat: 3,
            onRepeat: () => {
            repeatCount++;
            if (repeatCount === 1) {
                // Set --opa to 0 after the first repeat
                gsap.set(char, { '--opa': 0 });
            }
            },
            repeatRefresh: true,
            repeatDelay: 0.04,
            delay: (position+1)*0.07,
            innerHTML: () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
            opacity: 1
        });
        });
    }

    reset() {
        // Reset the text to its original state
       
        const chars = this.splitter.getChars();
        chars.forEach((char, index) => {
        gsap.killTweensOf(char); // Ensure no ongoing animations
        char.innerHTML = this.originalChars[index];
        });
        
    }

}

customElements.define('animated-title', AnimatedTitle);
class AnimatedHeroTitle extends HTMLElement {
  constructor() {
    super();
    this._hasAnimated = false;
    //this.onScroll = this.onScroll.bind(this);
    this.onPageIn = this.onPageIn.bind(this)
  }

  connectedCallback() {
 this.waitForGSAP().then(() => {

      if (this._initialized) return;
        this.rect = this.getBoundingClientRect();    
        const content = this.querySelector('.content');
        if (!content) return;
        this.textElement = content;
        this.originalText = content.textContent.trim();
        this.textElement.style.opacity=0;
        /*content.textContent = '';

        this.buildLetters(content);*/
        this.onScroll(); // check inicial
        document.addEventListener("page--in", this.onPageIn, { passive: true });

        this.splitText();
       
    });
  }

  async waitForGSAP() {
    if (window.gsap) return;

    return new Promise(resolve => {
      const i = setInterval(() => {
        if (window.gsap) {
          clearInterval(i);
          resolve();
        }
      }, 16); // 1 frame
    });
  
  }
  splitText() {
    // Split text for animation and store the reference.
    this.splitter = new TextSplitter(this.textElement, {
      splitTypeTypes: 'words, chars'
    });

    // Save the initial state of each character
    this.originalChars = this.splitter.getChars().map(char => char.innerHTML);
    
  }
  disconnectedCallback() {
    //window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener("page--in", this.onPageIn);
  }
  	


  onPageIn(){
     this.animate()
  }

  buildLetters(container) {
    const fragment = document.createDocumentFragment();

    [...this.originalText].forEach((char) => {
      const letterWrapper = document.createElement('span');
      letterWrapper.className = 'letter-mask';

      const letter = document.createElement('span');
      letter.className = 'letter';
      letter.textContent = char === ' ' ? '\u00A0' : char;

      letterWrapper.appendChild(letter);
      fragment.appendChild(letterWrapper);
    });

    container.appendChild(fragment);
  }

  onScroll() {
    if (this.hasAnimated) return;
    let dis = window.innerHeight/4;
    if(isElementVisible(this, dis) || this.getBoundingClientRect().top < 0){

		this.querySelector('.c__header').classList.remove('hide');
        this.textElement.style.opacity=1;
        this.hasAnimated = true;
        this.animate();
    }
   
    
  }

  animate() {
         if(!this.splitter){ return}
            
    // Reset any ongoing animations
        this.reset();
        
        // Query all individual characters in the line for animation.
        const chars = this.splitter.getChars();
   
        chars.forEach((char, position) => {
        let initialHTML = char.innerHTML;
        let repeatCount = 0;
        
        gsap.fromTo(char, {
            opacity: 0
        },
        {
            duration: 0.03,
            onStart: () => {
            // Set --opa to 1 at the start of the animation
            gsap.set(char, { '--opa': 1 });
            },
            onComplete: () => {
            gsap.set(char, {innerHTML: initialHTML, delay: 0.03})
            },
            repeat: 3,
            onRepeat: () => {
            repeatCount++;
            if (repeatCount === 1) {
                // Set --opa to 0 after the first repeat
                gsap.set(char, { '--opa': 0 });
            }
            },
            repeatRefresh: true,
            repeatDelay: 0.04,
            delay: (position+1)*0.07,
            innerHTML: () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
            opacity: 1
        });
        });
    }

    reset() {
        // Reset the text to its original state
       
        const chars = this.splitter.getChars();
        chars.forEach((char, index) => {
        gsap.killTweensOf(char); // Ensure no ongoing animations
        char.innerHTML = this.originalChars[index];
        });
        
    }

}

customElements.define('animated-herotitle', AnimatedHeroTitle);


class LineText extends HTMLElement {

  constructor() {
    super();

    this._hasAnimated = false;
    this._initialized = false;

    this.split = null;
    this.container = null;
    this.timers = [];

    this.handleResize = debounce(this.handleResize.bind(this), 150);
    this.onScroll = this.onScroll.bind(this);
  }

  connectedCallback() {

    this.waitForGSAP().then(() => {

      if (this._initialized) return;
      this._initialized = true;

      this.container = this.querySelector(".line__container");
      if (!this.container) return;

      document.fonts.ready.then(() => {

        this.build();

        // 🔑 iOS safe: esperar layout real
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.onScroll();
          });
        });

        window.addEventListener("resize", this.handleResize);
        window.addEventListener("scroll", this.onScroll, { passive: true });

      });

    });

  }

  disconnectedCallback() {

    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.onScroll);

    this.clearTimers();
    this.destroy();

  }

  async waitForGSAP() {
    if (window.gsap) return;

    return new Promise(resolve => {
      const i = setInterval(() => {
        if (window.gsap) {
          clearInterval(i);
          resolve();
        }
      }, 16);
    });
  }

  build() {

    this.clearTimers();
    this.destroy();

    this.splitLines();

    this._hasAnimated = false;
    this.classList.remove('animated');

  }

  destroy() {

    if (this.split) {
      this.split.revert();
      this.split = null;
    }

  }

  clearTimers() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }

  splitLines() {

    this.split = new TextSplitter(this.container, {
      splitTypeTypes: "lines",
    });

    this.split.splitText.lines.forEach(line => {

      line.innerHTML = line.textContent;

      line.style.display = "block";
      line.style.position = "relative";
      line.style.overflow = "hidden";

      const inner = document.createElement("div");
      inner.className = "line--inner";
      inner.innerHTML = line.innerHTML;

      line.innerHTML = "";
      line.appendChild(inner);

      const mask = document.createElement("div");
      mask.classList.add("line--mask");
      line.appendChild(mask);

    });

  }

  getLines() {
    if (!this.split) return [];
    return this.split.splitText.lines;
  }

  onScroll() {

    if (this._hasAnimated) return;

    const lines = this.getLines();
    if (!lines.length) return;

    if (isElementVisible(this, window.innerHeight * 0.25)) {

      this._hasAnimated = true;
      this.classList.add('animated');

      this.animateLines();

    }

  }

  animateLines() {

    const lines = this.getLines();
    if (!lines.length) return;

    lines.forEach((line, i) => {
      const t = setTimeout(() => {
        line.classList.add('animated--line');
      }, i * 100); // 👈 mismo stagger que tenías (0.1s)

      this.timers.push(t);
    });

  }

  handleResize() {

    const mobile = isMobile();
    if (mobile && !checkOrientation()) return;

    this.build();

    requestAnimationFrame(() => {
      this.onScroll();
    });

  }

}

customElements.define("line-text", LineText);


class HeroTitle extends HTMLElement {
  constructor() {
	super();
	this._hasAnimated = false;
	this.split = null;
	this.container = null;

	this.handleResize = this.handleResize.bind(this);
    this.onPageIn = this.onPageIn.bind(this);
	
  }

  connectedCallback() {
    this.waitForGSAP().then(() => {

        this.container = this.querySelector("h1");
        if (!this.container) return;

        document.fonts.ready.then(() => {
        this.splitLines();

        window.addEventListener("resize", this.handleResize);
        document.addEventListener("page--in", this.onPageIn, { passive: true });
        setTimeout(this.onPageIn,1200)
        }); 
        
        });
  }

  async waitForGSAP() {
    if (window.gsap) return;

    return new Promise(resolve => {
      const i = setInterval(() => {
        if (window.gsap) {
          clearInterval(i);
          resolve();
        }
      }, 16); // 1 frame
    });
  
  }

  disconnectedCallback() {
	window.removeEventListener("resize", this.handleResize);
	document.removeEventListener("page--in", this.onPageIn);
	this.kill();
  }

  handleResize() {
     
    const mobile = isMobile();
    if (mobile && !checkOrientation()) return;
	this.splitLines();
    
	if (this._hasAnimated && this.split) {
	  gsap.set(this.getLineInners(), { visibility: "visible", opacity:1 });
	}
  }

  onPageIn(){
     this.animateLines();
     this._hasAnimated = true;
  }

  splitLines() {
	if (this.split) this.split.revert();

	this.split = new TextSplitter(this.container, {
	  splitTypeTypes: "lines",
	});

	// Envolver cada línea con .line--inner (máscara)
	this.split.splitText.lines.forEach(line => {
	  if (line.querySelector(".line--inner")) return;

	  const inner = document.createElement("div");
	  inner.classList.add("line--inner");

	  inner.innerHTML = line.innerHTML;
	  line.innerHTML = "";
	  line.appendChild(inner);
	  const mask = document.createElement("div");
	  mask.classList.add("line--mask");
      line.appendChild(mask);      

	  // Asegurar máscara
	  line.style.overflow = "hidden";
	});

	// Estado inicial: texto oculto debajo
	window.gsap.set(this.getLineInners(), {
	  opacity:0,
	});
  }

  getLineInners() {
	if (!this.split) return [];
	return this.split.splitText.lines.map(
	  line => line.querySelector(".line--inner")
	);
  }


  animateLines() {

	if (!this.split) return;
    
	window.gsap.to(this.getLineInners(), {
	  duration: 1,
	  stagger: {    
        each: 0.1,
        onStart(index) {
         let parent = this._targets[0].parentNode;
         parent.classList.add('animated--line')
        },
        },
        
	  ease: window.CustomEase
		? window.CustomEase.create("reveal", "0.53, 0, 0, 1")
		: "power3.out",

	});
  }

  kill() {
	if (this.split) {
	  this.split.revert();
	  this.split = null;
	}
  }
}

customElements.define("hero-title", HeroTitle);

class ToggleBox extends HTMLElement {
  constructor() {
    super();
    this.container = this.closest('div');
    this.summary = null;
    this.details = null;
    this.isOpen = false;
    this.height = 0;

    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.container = this.closest('div');
    this.summary = this.querySelector('.toggle__header');
    this.details = this.querySelector('.toggle__content');

    if (!this.summary || !this.details) return;

    this.details.style.overflow = 'hidden';
    this.details.style.height = '0px';

    this._measureHeight();

    this.summary.addEventListener('click', this.handleClick);
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    if (this.summary) {
      this.summary.removeEventListener('click', this.handleClick);
    }
    window.removeEventListener('resize', this.handleResize);
  }

  handleClick() {
    this.toggle();
  }

  handleResize() {
    const mobile = isMobile();
    if (mobile && !checkOrientation()) return;

    this._measureHeightRes();

    if (this.isOpen) {
      this.details.style.height = `${this.height}px`;
    } else {
      this.details.style.height = '0px';
    }

    window.lenis?.resize();
    window.ScrollTrigger?.refresh();
  }

  _measureHeight(){

    // Necesitamos forzar el cálculo sin mostrarlo
    this.details.style.maxHeight = 'none';
    this.details.style.visibility = 'hidden';
    //this.details.style.position = 'absolute';
    this.height = this.details.scrollHeight;
    this.dataset.h = this.height;

    // Restaurar estado cerrado
    this.details.style.height = '0px';
    this.details.style.visibility = '';
    this.details.style.position = '';
  }


  _measureHeightRes() {
    const wasOpen = this.isOpen;

    this.details.style.height = 'auto';
    this.details.style.visibility = 'hidden';
    //this.details.style.position = 'absolute';
    this.details.style.pointerEvents = 'none';

    this.height = this.details.scrollHeight;
    this.dataset.h = this.height;

    this.details.style.visibility = '';
    this.details.style.position = '';
    this.details.style.pointerEvents = '';

    this.details.style.height = wasOpen ? `${this.height}px` : '0px';
  }

  open() {
    this.container?.querySelectorAll('toggle-box').forEach((e) => {
      if (e !== this) e.close();
    });

    this._measureHeight();

    this.classList.add('is-open');
    this.details.style.height = `${this.height}px`;
    this.isOpen = true;

    setTimeout(function () {
      window.ScrollTrigger?.refresh();
    }, 600);
  }

  close() {
    this.classList.remove('is-open');
    this.details.style.height = '0px';
    this.isOpen = false;

    setTimeout(function () {
      window.ScrollTrigger?.refresh();
    }, 600);
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }
}

customElements.define('toggle-box', ToggleBox);

class animatedNumber extends HTMLElement {
  constructor() {
	super();

	this._hasAnimated = false;
	this.container = null;
    this.number=''

	this.handleResize = this.handleResize.bind(this);

  }


  connectedCallback() {
    this.waitForGSAP().then(() => {

      if (this._initialized) return;
        this.container = this.querySelector(".number__container");
        this.number= this.container.querySelector('.number');
        if (!this.container) return;

 
        this.animateNumber();
        ScrollTrigger.refresh();
        window.addEventListener("resize", this.handleResize);

    });
  }

  async waitForGSAP() {
    if (window.gsap) return;

    return new Promise(resolve => {
      const i = setInterval(() => {
        if (window.gsap) {
          clearInterval(i);
          resolve();
        }
      }, 16); // 1 frame
    });
  
  }

 

  disconnectedCallback() {
	window.removeEventListener("resize", this.handleResize);
	this.kill();
  }

  handleResize() {
    const mobile = isMobile();
    if (mobile && !checkOrientation()) return;
 
	if (this._hasAnimated ) {
	  gsap.set(this.number, { visibility: "visible", xPercent:100 });
	}
  }


  animateNumber() {
      gsap.set(this.number, {
    yPercent: -100 // o -100 según dirección
  });

    window.gsap.to(this.number, {
    yPercent: 0,
    ease: "none", // importante con scrub
    scrollTrigger: {
        trigger: this.container,
        start: "top bottom",
        end: "top center",
        scrub: true,
        //markers: true
    }
    });
  }

  kill() {
	
  }
}

customElements.define("animated-number", animatedNumber);

class floatTitle extends HTMLElement {
  constructor() {
    super();

    this.container = null;
    this.text = null;
    this.tween = null;
    this.st = null;

    this.handleResize = this.handleResize.bind(this);
  }

  connectedCallback() {
    this.waitForGSAP().then(() => {
      if (this._initialized) return;
      this._initialized = true;

      this.container = this.closest('.float__default__media');
      this.text = this.querySelector('.text__float--wrp');

      if (!this.container || !this.text) return;
     if(!isMobile()){
      this.setupAnimation();

      window.addEventListener("resize", this.handleResize);
     }
    });
  }

  async waitForGSAP() {
    if (window.gsap) return;
    return new Promise(resolve => {
      const i = setInterval(() => {
        if (window.gsap) {
          clearInterval(i);
          resolve();
        }
      }, 16);
    });
  }

  setupAnimation() {
    // limpiar anterior
    this.kill();

    const margin = (window.innerWidth > 680) ? 20 : 16;
    const bottom = 0.6 * window.innerHeight - margin;
    let pinned = (window.innerWidth > 680)? true: false;
    let trigger2 = this.text.closest('.float__title--trigger');
    gsap.set(this.text, { y: 0 });
    var that = this; 
    this.tween = gsap.to(this.text, {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: trigger2,
        start: "top 50%",
        endTrigger: this.container,
        end: "bottom 50%",
        //pin: pinned,
        scrub: true,
        //markers:true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate:(self)=>{
            that.style.top= gsap.utils.clamp(50, 100,(100 - self.progress*100))+'%'
        },

        onEnter: () => {
          that.classList.add('float--on');
           that.style.top='100%';
        },
        onRefresh: (self) => {
          if (self.isActive) {
            that.classList.add('float--on');
            const content = that.querySelector('.content');
            if (content) content.style.opacity = '1';
            that.style.top= gsap.utils.clamp(50, 100,(100 - self.progress*100))+'%'
          }
        },

      }
    });

    this.st = this.tween.scrollTrigger;
  }

  handleResize() {
    const mobile = isMobile();
    if (mobile && !checkOrientation()) return;
    this.setupAnimation();

    window.lenis?.resize();
    ScrollTrigger.refresh();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.handleResize);
    this.kill();
  }

  kill() {
    if (this.st) {
      this.st.kill();
      this.st = null;
    }
    if (this.tween) {
      this.tween.kill();
      this.tween = null;
    }
  }
}

customElements.define("float-subtitle", floatTitle);

class ContactForm extends HTMLElement {
  constructor() {
	super();
	this.currentStep = 1;
	this.loadedAt = Date.now();
    this.closeModal = this.closeModal.bind(this);
  }

  connectedCallback() {
	this.form = this.querySelector("form");
	this.steps = this.querySelectorAll(".form__step");
    this.modal= this.querySelector("#mail_modal");
    this.modalClose= this.modal.querySelector(".close__modal");
    this.backClose= this.modal.querySelector(".contact__modal__back");
    this.submitButton = this.form.querySelector("button[type='submit']");
    
    this.modalClose.addEventListener('click', this.closeModal);
    this.backClose.addEventListener('click', this.closeModal);

	this.bindNavigation();
	this.bindSubmit();

	requestAnimationFrame(() => {
	  this.setMaxHeight();
	});


	window.addEventListener("resize", () => {
        const mobile = isMobile();
        if (mobile && !checkOrientation()) return;
	    this.setMaxHeight();
	});
  }

  setMaxHeight() {
	const inners = this.querySelectorAll(".form__step__inner");
	let max = 0;

	inners.forEach(el => {
	  const h = el.offsetHeight;
	  if (h > max) max = h;
	});

	this.style.height = max + "px";
    window.lenis?.resize();
    ScrollTrigger.refresh();
  }

  bindNavigation() {
	this.querySelectorAll(".next__step--button").forEach(btn => {
	  btn.addEventListener("click", () => {
		if (this.validateStep(this.currentStep)) {
		  this.goToStep(this.currentStep + 1);
		}
	  });
	});

	this.querySelectorAll(".prev__step--button").forEach(btn => {
	  btn.addEventListener("click", () => {
		this.goToStep(this.currentStep - 1);
	  });
	});
  }

  goToStep(step) {
	if (step < 1 || step > this.steps.length) return;

	this.steps.forEach(s => s.classList.remove("active"));
	this.querySelector(`.form__step[data-step="${step}"]`)
	  .classList.add("active");

	this.currentStep = step;
  }

  validateStep(step) {
	this.clearErrors();

	if (step === 1) return this.validateStep1();
	if (step === 2) return this.validateStep2();
	if (step === 3) return this.validateStep3();

	return true;
  }

  validateStep1() {
	let valid = true;

	const name = this.form.querySelector("#name");
	const email = this.form.querySelector("#email");

	if (!name.value.trim()) {
	  this.showError(".name__error");
	  valid = false;
	}

	if (!email.value.trim()) {
	  this.showError(".email__error1");
	  valid = false;
	} else if (!this.validateEmail(email.value)) {
	  this.showError(".email__error2");
	  valid = false;
	}

	return valid;
  }

  validateStep2() {
	let valid = true;

	const profile = this.form.querySelector("input[name='profile']:checked");
	const solutions = this.form.querySelectorAll("input[name='solutions[]']:checked");

	if (!profile) {
	  this.showError(".profile__error");
	  valid = false;
	}

	if (solutions.length === 0) {
	  this.showError(".solutions__error");
	  valid = false;
	}

	return valid;
  }

  validateStep3() {
	let valid = true;

	const rgpd = this.form.querySelector("input[name='rgpd']");
	const message = this.form.querySelector("#message");
	
	if (!message.value.trim()) {
	  this.showError(".message__error");
	  valid = false;
	}

	if (!rgpd.checked) {
	  this.showError(".acceptance__error");
	  valid = false;
	}

	return valid;
  }

  validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showError(selector) {
	const el = this.form.querySelector(selector);
	if (el) el.classList.add("active");
  }

  clearErrors() {
	this.form.querySelectorAll(".input--error")
	  .forEach(e => e.classList.remove("active"));

	this.form.querySelectorAll(".has-error")
	  .forEach(e => e.classList.remove("has-error"));
  }

  bindSubmit() {
	this.form.addEventListener("submit", async (e) => {
     this.submitButton.classList.add('disabled');

	  e.preventDefault();
       

	  if (!this.validateStep(3)) return;
      this.modal.classList.add('show');
      this.modal.classList.add('sending');

	  const formData = new FormData(this.form);

	  const data = {
		...Object.fromEntries(formData),
		solutions: formData.getAll("solutions[]"),
		rgpd: formData.get("rgpd") === "on",
		submittedAt: this.loadedAt
	  };

	  const res = await fetch("/api/contact", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	  });

	  if (res.ok) {
        this.modal.classList.add('success');
        this.modal.classList.remove('sending');
		//alert("Mensaje enviado correctamente");
		this.form.reset();
		this.goToStep(1);
	  } else {
        this.modal.classList.add('error');
        this.modal.classList.remove('sending');
		//alert("Error enviando formulario");
	  }
	});
  }

  closeModal(){
 
    this.modal.classList.remove('show');
    this.submitButton.classList.remove('disabled');
  }
}

customElements.define("contact-form", ContactForm);

class RequestDocForm extends HTMLElement {
  constructor() {
    super();
    this.loadedAt = Date.now();
    this.closeModal = this.closeModal.bind(this);
  }

  connectedCallback() {
    this.form = this.querySelector("form");
    this.submitButton = this.form.querySelector("button[type='submit']");
    this.modalClose= this.querySelector(".close--modal");
    this.modalClose.addEventListener('click', this.closeModal);


    if (!this.form) {
      console.warn("No form inside component");
      return;
    }


    this.form.setAttribute("novalidate", "true");
    this.bindSubmit();
   
  }

  validateStep() {
	let valid = true;

	const name = this.form.querySelector("#name");
	const email = this.form.querySelector("#email");
    const rgpd = this.form.querySelector("input[name='rgpd']");

	if (!name.value.trim()) {
	  this.showError(".name__error");
	  valid = false;
	}

	if (!email.value.trim()) {
	  this.showError(".email__error1");
	  valid = false;
	} else if (!this.validateEmail(email.value)) {
	  this.showError(".email__error2");
	  valid = false;
	}
    if (!rgpd.checked) {
	  this.showError(".acceptance__error");
	  valid = false;
	}

	return valid;
  }

  validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showError(selector) {
	const el = this.form.querySelector(selector);
	if (el) el.classList.add("active");
  }

  clearErrors() {
	this.form.querySelectorAll(".input--error")
	  .forEach(e => e.classList.remove("active"));

	this.form.querySelectorAll(".has-error")
	  .forEach(e => e.classList.remove("has-error"));
  }

  disconnectedCallback() {
    if (this.form) {
      this.form.removeEventListener("submit", this.onSubmit);
    }
  }

   bindSubmit() {
	this.form.addEventListener("submit", async (e) => {
     
	  e.preventDefault();
      if (!this.validateStep()) return;
      this.submitButton.classList.add('disabled');
      this.classList.add('sending');
      this.classList.add('show');
      const formData = new FormData(this.form);

	  const data = {
		...Object.fromEntries(formData),
		rgpd: formData.get("rgpd") === "on",
		submittedAt: this.loadedAt
	  };

	  const res = await fetch("/api/request-doc", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	  });

	  if (res.ok) {
        this.classList.add('success');
        this.classList.remove('sending');
		//alert("Mensaje enviado correctamente");
		this.form.reset();
	  } else {
        this.classList.add('error');
        this.classList.remove('sending');
        this.form.reset();
		//alert("Error enviando formulario");
	  }

      return false;
  })
   }

    closeModal(){
    let that = this;
    setTimeout(function(){
        that.classList.remove('show');
        that.classList.remove('success');
        that.classList.remove('error');
    },500);
    this.submitButton.classList.remove('disabled');
    let parent= this.closest('.modal--container');
    parent.classList.remove('open--modal');
    
  }

}

customElements.define("request-doc-form", RequestDocForm);


class PanelMorph extends HTMLElement {

  connectedCallback() {

    this.waitForGSAP().then(() => {

      this.section = this.querySelector("[data-panel-morph]") || this
      this.svg = this.section.querySelector(".panel-graphic")
      this.parent = this.closest("section")
      this.desc1 = this.section.querySelectorAll(".panel__description")

      if(!this.svg) return

      this.handleResize = debounce(() => {
        const mobile = isMobile();
        if (mobile && !checkOrientation()) return;
        this.buildAnimation()
      },150)

      this.buildAnimation()

      window.addEventListener("resize",this.handleResize)

    })

  }

  disconnectedCallback(){
    window.removeEventListener("resize",this.handleResize)
    this.destroyAnimation()
  }

  destroyAnimation(){

    if(this.tl){
      this.tl.kill()
      this.tl = null
    }

    ScrollTrigger.getAll().forEach(st=>{
      if(st.trigger === this.section) st.kill()
    })

    gsap.killTweensOf(this.svg)

  }

  buildAnimation(){

    this.destroyAnimation()

    const { section, svg, parent, desc1 } = this

    gsap.set(["#L1","#L3"],{
      transformOrigin:"50% 50%"
    })

    gsap.set(desc1,{opacity:0})

    const shapes = Array.from(svg.querySelectorAll("[data-el]"))

    this.tl = gsap.timeline({
      defaults:{ease:"none"},
      scrollTrigger:{
        trigger:section,
        start:"top top",
        end:"bottom bottom",
        scrub:true,
        invalidateOnRefresh:true,
        refreshPriority:1,
        anticipatePin:1,
        fastScrollEnd:true,
        snap:"labels",
        onEnter:()=>{
          parent?.classList.add("panel--in")
        },
        onUpdate:(self)=>{
          if(self.progress > 0.165){
            parent?.classList.add("text--in")
          }
        }
      }
    })

    const tl = this.tl

    tl.add("step1")

    shapes.forEach(shape=>{

      const type = shape.dataset.el

      if((type==="polygon" || type==="polyline") && shape.dataset.finalPoints){

        tl.to(shape,{
          attr:{
            points:shape.dataset.finalPoints
          },
          duration:1
        },"step1")

      }

      if(type==="line"){

        tl.to(shape,{
          attr:{
            x1:shape.dataset.finalX1,
            y1:shape.dataset.finalY1,
            x2:shape.dataset.finalX2,
            y2:shape.dataset.finalY2
          },
          duration:1
        },"step1")

      }

    })

    tl.add("step2")

    tl.to({}, {duration:0.1})

    tl.add("step3")


    const vb = svg.viewBox.baseVal
    const rect = svg.getBoundingClientRect()

    const ratio = rect.width / vb.width

    const despl =
      window.innerHeight > window.innerWidth
        ? rect.width * 0.30 / ratio
        : rect.width * 0.30 / ratio


    tl.to("#L1",{
      x:-despl,
      duration:2
    })

    .to("#L3",{
      x:despl,
      duration:2
    },"<")

    .add("step4")


    tl.to(desc1,{
      opacity:1,
      duration:0.5
    })

    .add("step5")


    tl.to({}, {duration:0.5})

    .add("step6")


    requestAnimationFrame(()=>{

      const st = tl.scrollTrigger
      if(!st) return

      if(window.scrollY >= st.end) tl.progress(1).pause()
      if(window.scrollY <= st.start) tl.progress(0).pause()

    })

    ScrollTrigger.refresh()

  }



  async waitForGSAP(){

    if(window.gsap) return

    return new Promise(resolve=>{

      const i = setInterval(()=>{

        if(window.gsap){

          clearInterval(i)
          resolve()

        }

      },16)

    })

  }

}

customElements.define("panel-morph-component",PanelMorph)



class frameMorph extends HTMLElement{

  connectedCallback(){
    
    const section = this.querySelector("[data-draw]")
    const svg = section.querySelector("svg")

    if(!svg) return

    const shapes = svg.querySelectorAll("line,path,polyline,polygon")

    shapes.forEach(shape => {

      const length = shape.getTotalLength()

      gsap.set(shape,{
        strokeDasharray:length,
        strokeDashoffset:length
      })

    })

    gsap.to(shapes,{
      strokeDashoffset:0,
      ease:"none",
      scrollTrigger:{
        trigger:section,
        start:"top top",
        end:"75% bottom",
        scrub:1,
        //markers: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin:1,
        fastScrollEnd:true,
      }
    })

  }

}

customElements.define("frame-morph-component",frameMorph)

  class RobotMorphComponent extends HTMLElement {
    connectedCallback() {
        this.waitForGSAP().then(() => {
        this.section = this.querySelector("[data-robot-morph]");
        this.svg = this.section?.querySelector(".robot__container");
        this.sierra = this.svg?.querySelector("#Sierra");
        this.text = this.section?.querySelector(".morph__text--desktop");
        this.panel =  this.querySelector('.robot__panel');
        this.separator = this.querySelector('.robot__panel__separator');

        this.distance = window.innerHeight *0.80;
        if(isMobile()){
        this.panel.style.top=this.distance +'px';
        this.panel.style.height=window.innerHeight *0.035 +'px';
        this.svg.style.height = window.innerHeight *0.5 + 'px';
        this.separator.style.height = window.innerHeight *0.135 + 'px';
        this.separator.style.top = window.innerHeight *0.885 + 'px';
        }

        if (!this.section || !this.svg) return;

        this.handleResize = debounce(() => {
            const mobile = isMobile();
            if (mobile && !checkOrientation()) return;
            this.buildAnimation();
        }, 150);

        this.buildAnimation();
        window.addEventListener("resize", this.handleResize);
        })
    }

    disconnectedCallback() {
      window.removeEventListener("resize", this.handleResize);
      this.destroyAnimation();
    }

    destroyAnimation() {
      if (this.tl) {
        this.tl.kill();
        this.tl = null;
      }

      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === this.section) st.kill();
      });

      gsap.killTweensOf(this.svg);
    }

    async waitForGSAP() {
        if (window.gsap) return;
        return new Promise((resolve) => {
        const i = setInterval(() => {
            if (window.gsap) {
            clearInterval(i);
            resolve();
            }
        }, 16);
        });
    }
    

    buildAnimation() {
      this.destroyAnimation();

      const { section, svg, sierra, text } = this;
      const vh = window.innerHeight;
      const vh1 =this.querySelector('.robot-morph__inner').getBoundingClientRect().height;
      const vw = window.innerWidth;
      const vr = svg.getBoundingClientRect().width;
      const wr = svg.getBoundingClientRect().height;
      const sw= sierra.getBoundingClientRect().width;


      var startrotate;

      gsap.set(svg, {
        y: vh * 0.65 -wr,
        x: 0.3*vw - vr + sw*0.75,
      });

      this.tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          //markers: true,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          anticipatePin: 1,
          fastScrollEnd: true,

        },
      });

       this.tl.to(svg, {
        duration: 0.5,
        onStart: () => {
            sierra?.classList.remove("rotation");
            sierra?.classList.remove("rotation2")
        },
      });

      this.tl.to(svg, {
        duration: 1,
        onStart: () => {
          sierra?.classList.add("rotation");
          startrotate=window.setTimeout(function(){sierra?.classList.add("rotation2")},1200)
        },
        onReverseComplete: () => {
            sierra?.classList.remove("rotation");
            sierra?.classList.remove("rotation2")
            window.clearTimeout(startrotate);
        },
      });
      
      this.tl.to(svg, {
        y: this.distance - wr +sw/5,
        duration: 1,
      });

      this.tl.to(svg, {
        x: vw * 1, 
        duration: 4,

      });
    if(window.innerWidth >640){
        this.tl.to(text, {
        opacity:0,
        duration: 1,
      }, 2.5);
    }

      ScrollTrigger.refresh();
    }

  }

  customElements.define("robot-morph-component", RobotMorphComponent);

class HomeGraph extends HTMLElement {

  connectedCallback() {

    this.waitForGSAP().then(() => {

      this.section = this.querySelector("[data-home-morph]");
      this.svg = this.section?.querySelector("svg");
      this.parent = this.closest("section");

      if (!this.section || !this.svg) return;

      this.handleResize = debounce(() => {
        this.buildAnimation();
      }, 150);

      this.buildAnimation();

      window.addEventListener("resize", this.handleResize);

    });

  }

  disconnectedCallback() {

    window.removeEventListener("resize", this.handleResize);
    this.destroyAnimation();

  }

  destroyAnimation() {

    if (this.tl) {
      this.tl.kill();
      this.tl = null;
    }

    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === this.section) st.kill();
    });

    gsap.killTweensOf(this.svg.querySelectorAll("*"));

  }

  async waitForGSAP() {

    if (window.gsap && window.ScrollTrigger) return;

    return new Promise((resolve) => {

      const i = setInterval(() => {

        if (window.gsap && window.ScrollTrigger) {
          clearInterval(i);
          resolve();
        }

      }, 16);

    });

  }

  buildAnimation() {

    this.destroyAnimation();

    const { section, svg, parent } = this;

    const shapes = svg.querySelectorAll("line,path,polyline,polygon");


    shapes.forEach(shape => {

      const length = shape.getTotalLength();

      gsap.set(shape, {
        clearProps: "transform",
        strokeDasharray: length,
        strokeDashoffset: length
      });

    });

    const vb = svg.viewBox.baseVal;
    const rect = svg.getBoundingClientRect();

    const ratio = rect.width / vb.width;
    const dist = (rect.width * 0.24) / ratio;

    this.tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "75% bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        fastScrollEnd: true,

        onLeave: () => {
          parent?.classList.add('text--in');
        },
        onEnterBack: () => {
          parent?.classList.remove('text--in');
        },
        onEnter: () => {
          parent?.classList.remove('text--in');
        }
      }
    });

    const tl = this.tl;

    shapes.forEach((el, i) => {

      const dir = (i === 0) ? 0 : (i === 1 ? -1 : 1);

      // draw
      tl.to(el, {
        strokeDashoffset: 0,
        duration: 1
      }, 0);

      // movimiento 1
      tl.to(el, {
        x: dist * 0.75 * dir,
        duration: 0.5
      }, ">");

      // movimiento 2
      tl.to(el, {
        x: dist * dir,
        duration: 0.5
      }, ">");

    });

    ScrollTrigger.refresh();

  }


}

customElements.define("home-graph", HomeGraph);

class SystemGraph extends HTMLElement {

  connectedCallback() {

    this.waitForGSAP().then(() => {

      this.section = this.querySelector("[data-system-morph]");
      this.svg = this.section?.querySelector("svg");
      this.parent = this.closest("section");

      if (!this.section || !this.svg) return;

      this.handleResize = debounce(() => {
        const mobile = isMobile();
        if (mobile && !checkOrientation()) return;
        this.buildAnimation();
      }, 150);

      this.buildAnimation();

      window.addEventListener("resize", this.handleResize);

    });

  }

  disconnectedCallback() {

    window.removeEventListener("resize", this.handleResize);
    this.destroyAnimation();

  }

  destroyAnimation() {

    if (this.tl) {
      this.tl.kill();
      this.tl = null;
    }

    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === this.section) st.kill();
    });

    gsap.killTweensOf(this.svg);

  }

  async waitForGSAP() {

    if (window.gsap && window.ScrollTrigger) return;

    return new Promise((resolve) => {

      const i = setInterval(() => {

        if (window.gsap && window.ScrollTrigger) {
          clearInterval(i);
          resolve();
        }

      }, 16);

    });

  }

  buildAnimation() {

    this.destroyAnimation();

    const { section, svg } = this;

    const left = svg.querySelectorAll('.wall--left');
    const right = svg.querySelectorAll('.wall--right');
    const external = svg.querySelectorAll('.wall--window');
    const internal = svg.querySelectorAll('.wall--door');
    const close = svg.querySelectorAll('.wall--close');

    // medir una sola vez
    const up = left[0].getBoundingClientRect().height ;

    // reset inicial
    gsap.set([left, right, external, internal, close], {
      y: -up,
      opacity:0
    });

    this.tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        //markers: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        snap:"labels",
      }
    });

    const tl = this.tl;
    tl.add("step0")
    // LEFT
    tl.to(left, {
      opacity: 1,
      duration: 0.3,
      stagger: 0.2
    });

    tl.to(left, {
      y: 0,
      duration: 1
    });

    tl.add("step1")

    // RIGHT
    tl.to(right, {
      opacity: 1,
      duration: 0.3,
      stagger: 0.2
    });

    tl.to(right, {
      y: 0,
      duration: 1
    });
    tl.add("step2")
    // EXTERNAL
    tl.to(external, {
      opacity: 1,
      duration: 0.3,
      stagger: 0.2
    });

    tl.to(external, {
      y: 0,
      duration: 1
    });
    tl.add("step3")
    // INTERNAL
    tl.to(internal, {
      opacity: 1,
      duration: 0.3,
      stagger: 0.2
    });

    tl.to(internal, {
      y: 0,
      duration: 1
    });
    tl.add("step4")
    // CLOSE
    tl.to(close, {
      opacity: 1,
      duration: 0.3,
      stagger: 0.2
    });

    tl.to(close, {
      y: 0,
      duration: 1
    });
    tl.add("step5")
    tl.to({}, {duration:0.5})
    ScrollTrigger.refresh();

  }


}

customElements.define("system-morph-component", SystemGraph);

class VideoPlayerElement extends HTMLElement {
    connectedCallback() {
      const trigger = this.querySelector(
        ".video__player__trigger",
      );
      const dialogId = trigger?.dataset.dialogId;
      if (!trigger || !dialogId) return;

      const dialogModal = document.getElementById(dialogId);
      if (!dialogModal) return;

      const innerDialog =
        dialogModal.querySelector("dialog");
      const iframe = dialogModal.querySelector(
        ".video__player__iframe",
      );
      const videoEl = dialogModal.querySelector(
        ".video__player__native",
      );

      const openPlayer = () => {
        if (iframe) iframe.src = iframe.dataset.src ?? "";
        document.body.classList.add("body--no-scroll");
        window.lenis?.stop();
        innerDialog?.showModal();
        dialogModal.classList.add("dialog--open");
        if (videoEl) videoEl.play().catch(() => {});
      };

      const closePlayer = (e) => {
        e.preventDefault()
        document.body.classList.remove("body--no-scroll");
        window.lenis?.start();
        innerDialog?.close();
        dialogModal.classList.remove("dialog--open");
        if (iframe) iframe.src = "";
        if (videoEl) {

          videoEl.pause();
          videoEl.currentTime = 0;
        }

      };

      // Cleanup al cerrar (Escape, backdrop, botón cierre)
      innerDialog?.addEventListener("click", closePlayer);

      trigger.addEventListener("click", openPlayer);
    }
  }


    customElements.define("video-player", VideoPlayerElement);

class StackFilter extends HTMLElement {

  connectedCallback() {

    const filterBtns = this.querySelectorAll(".section__filters [data-filter]");
    const stackItems = this.querySelectorAll(".stack__item");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        stackItems.forEach((item) => {

          const tags = (item.dataset.tags || "")
            .split(",")
            .map((t) => t.trim());

          if (filter === "all" || tags.includes(filter)) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });

        if (window.lenis) window.lenis.resize();
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });

  }
}

customElements.define("stack-filter", StackFilter);

/*
class ScrollVideo extends HTMLElement {
  constructor() {
    super()

    this.video = null
    this.st = null

    this.proxy = { t: 0 }
    this.target = 0
    this.raf = null
    this.pos = this.dataset.pos

    this.handleResize = this.handleResize.bind(this)
    this.update = this.update.bind(this)
  }

  connectedCallback() {
    this.waitForGSAP().then(() => {
      if (this._initialized) return
      this._initialized = true

      this.video = this.querySelector('video')
      if (!this.video) return

      this.video.muted = true
      this.video.playsInline = true
      this.video.load()

      this.video.addEventListener('loadedmetadata', () => {
        this.setup()
      })

      window.addEventListener('resize', this.handleResize)
    })
  }

  disconnectedCallback() {
    this.destroy()
    window.removeEventListener('resize', this.handleResize)
  }

  async waitForGSAP() {
    if (window.gsap && window.ScrollTrigger) return

    return new Promise(resolve => {
      const i = setInterval(() => {
        if (window.gsap && window.ScrollTrigger) {
          clearInterval(i)
          resolve()
        }
      }, 16)
    })
  }

  setup() {
    const duration = this.video.duration
    if (!duration || isNaN(duration)) return

    const pos =  this.pos;

    const scstart=(pos == 'prefooter')?"top bottom": "top top"
    const scend=(pos == 'prefooter')?"bottom top": "bottom bottom"

    this.destroy()
    let tl = gsap.timeline({
    scrollTrigger: {
        trigger: this,
        start: scstart,
        end: scend,
        //markers:true,
        scrub: true,
        onEnter:()=>{
            if (pos !== 'prefooter'){
            document.body.classList.add('header--graph');
            }
        },
        onLeave:()=>{
             if (pos !== 'prefooter'){
            document.body.classList.remove('header--graph');
            }
        },
        onEnterBack:()=>{
             if (pos !== 'prefooter'){
            document.body.classList.add('header--graph');
            }
        },
        onLeaveBack:()=>{
             if (pos !== 'prefooter'){
            document.body.classList.remove('header--graph');
            }
        }
        
    }
    })


    tl.to(this.video, {
        currentTime:this.video.duration, 
        duration:this.video.duration
    },0)

  }

  update() {
    if (!this.video) return

    // interpolación (ease manual)
    this.proxy.t += (this.target - this.proxy.t) * 0.1

    // evitar seeks micro innecesarios
    if (Math.abs(this.video.currentTime - this.proxy.t) > 0.01) {
      this.video.currentTime = this.target
    }

    this.raf = requestAnimationFrame(this.update)
  }

  handleResize() {
    const mobile = isMobile();
    if (mobile && !checkOrientation()) return;
    ScrollTrigger.refresh()
  }

  destroy() {
    if (this.st) {
      this.st.kill()
      this.st = null
    }

    if (this.raf) {
      cancelAnimationFrame(this.raf)
      this.raf = null
    }
  }
}

customElements.define('scroll-video', ScrollVideo) 
*/
class ScrollFrames extends HTMLElement {
  constructor() {
    super()
    this.frameCount = parseInt(this.dataset.frames || 100)
    this.images = new Array(parseInt(this.dataset.frames || 100))
    this.path = this.dataset.path
    this.pathLow = this.dataset.pathlow
    this.currentFrame = 0
    this.pos = this.dataset.pos
  }

  connectedCallback() {
    this.waitForGSAP().then(() => {
        this.canvas = this.querySelector('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.loadImage(0).then(() => {
            console.log('render');
        this.render()
        })

        this.setupScroll()
        this.preloadInBackground()
        
    })
  }

  async waitForGSAP() {

    if (window.gsap && window.ScrollTrigger) return;

    return new Promise((resolve) => {

      const i = setInterval(() => {

        if (window.gsap && window.ScrollTrigger) {
          clearInterval(i);
          resolve();
        }

      }, 16);

    });
    
  }

  loadImage(index) {
    if (this.images[index]) return Promise.resolve(this.images[index])
  
    const img = new Image()
    const frame = String(index + 1).padStart(4, '0')
    img.src = this.path.replace('%04d', frame)
    img.fetchPriority = 'high'
  
    return img.decode()
      .then(() => {
        this.images[index] = img
        return img
      })
      .catch(() => {
        // fallback Safari viejo
        return new Promise(resolve => {
          img.onload = () => {
            this.images[index] = img
            resolve(img)
          }
        })
      })
  }


preloadInBackground() {
  let i = 1
  const delay = 20 // ajusta este valor (ms)
  const loadNext = () => {
    if (i >= this.frameCount) return
    this.loadImage(i)
    i++
    setTimeout(loadNext, delay)
  }
  setTimeout(loadNext, delay)
}



  setupScroll() {
    this.obj = { frame: 0 }

    const pos = this.pos
    const scstart = (pos == 'prefooter') ? "top bottom" : "top top"
    const scend = (pos == 'prefooter') ? "bottom top" : "bottom bottom"

    gsap.to(this.obj, {
      frame: this.frameCount - 1,
      ease: "none",
      scrollTrigger: {
        trigger: this,
        start: scstart,
        end: scend,
        scrub: true,
        onEnter: () => {
          if (pos !== 'prefooter') document.body.classList.add('header--graph')
        },
        onLeave: () => {
          if (pos !== 'prefooter') document.body.classList.remove('header--graph')
        },
        onEnterBack: () => {
          if (pos !== 'prefooter') document.body.classList.add('header--graph')
        },
        onLeaveBack: () => {
          if (pos !== 'prefooter') document.body.classList.remove('header--graph')
        }
      },
      onUpdate: async () => {
        const frame = Math.round(this.obj.frame)

        if (!this.images[frame]) {
          await this.loadImage(frame)
        }

        this.currentFrame = frame
        this.render()
      }
    })
  }





  render() {
    const img = this.images[this.currentFrame]
    if (!img) return

    this.canvas.width = img.width
    this.canvas.height = img.height
    this.ctx.imageSmoothingEnabled = true
    this.ctx.imageSmoothingQuality = 'high'
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(img, 0, 0)
  }
}

customElements.define('scroll-frames', ScrollFrames)

/******************Fin de cursor elements **********************/

window.addEventListener('DOMContentLoaded', function(){
    // console.log('loaded');
    document.querySelector('.menu__trigger').addEventListener('click', function(){
        document.body.classList.add('menu--opened');
    })
    document.querySelector('.menu__close').addEventListener('click', function(){
        document.body.classList.remove('menu--opened');
         closeSubmenu()

    })
    document.querySelector('.menu__back').addEventListener('click', function(){
        document.body.classList.remove('menu--opened');
         closeSubmenu()
    })
   checkhero();
  
})

window.addEventListener('load', function(){
    
    
    let headerHeight = document.querySelector('header').offsetHeight;
    document.querySelector('html').style.setProperty('--header-height', headerHeight + 'px');

    let heroHeight = document.querySelector('.hero__description')?.offsetHeight ?? 0;
    document.querySelector('html').style.setProperty('--hero-height', heroHeight + 'px');

    const watcher = (() => {

        const verificar = () => {
            if (typeof window.gsap !== 'undefined') {
                accordion();
                parallaxing();
				parallaxingHero();
                playVideo();
                footerParallax();
                checkModal();
                animateHide();
                initHistoryNavigation();
                updateActiveMenu();
                setTimeout(function(){document.body.classList.add('preload--out')}, 200);
                setTimeout(function(){
                    document.body.classList.add('page--in')
                    document.dispatchEvent(
                        new CustomEvent('page--in')
                    );
                    ScrollTrigger.refresh();
                },400);
                gopanel();
                if(document.querySelector('.h-logo--center')){

                window.interactiveLogo = new InteractiveLogo({
                    selector: '.h-logo--center',
                    ease: 0.1,
                    intensity: 1
                });
                const homeMorph = document.querySelector('.home-morph-wrp')
                //window.scrollFrames = new ScrollFrames(homeMorph);
                //window.scrollFrames.init()
                }
                const prefooterMorph = document.querySelector('.prefooter__back')
                //window.footerFrames = new ScrollFrames(prefooterMorph);
                //window.footerFrames.init()
                if(document.querySelector('.values__container toggle-box')){
                    document.querySelector('.values__container toggle-box .toggle__header').click();
                }
            } else {
                requestAnimationFrame(verificar);
            }
        };
        requestAnimationFrame(verificar);
    })();
 
})

document.addEventListener('ajaxLoaded', (e) => {
    playVideo()
    parallaxing();
	parallaxingHero();
    gopanel();
    checkModal();
    animateHide();
    if(document.querySelector('.values__container toggle-box')){
        document.querySelector('.values__container toggle-box .toggle__header').click();
    }
});

let lastScrollTop = 0;
const delta = 5; // scroll gap

window.addEventListener('scroll', function(){
    playVideo();
    headerPosition();
    checkhero();
    const footer = document.querySelector('footer');
    if(isElementVisible(footer)){
        document.body.classList.add('footer--in')
    }else{
        document.body.classList.remove('footer--in')
    }
    animateHide()
    //headerColor();
})



function isElementVisible(el, dist =0) {
	var rect     = el.getBoundingClientRect(),
	vWidth   = window.innerWidth || doc.documentElement.clientWidth,
	vHeight  = window.innerHeight || doc.documentElement.clientHeight,
	topHe=(rect.height > vHeight)?rect.height:vHeight;
    
    if(window.getComputedStyle(el).display === 'none'){
        return false;
    }
    
   
	// Return false if it's not in the viewport
	if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight-dist) {
      
		return false;
	}
	// Return true if any of its four corners are visible
	return true;
}

function accordion(){

    const submenus = document.querySelectorAll('.has__submenu ul');
    const items = document.querySelectorAll('.has__submenu');

    if(submenus.length === 0) return;

    function calculateHeights(){
        submenus.forEach(function(e){
            e.style.height = 'auto';
            let hitem = e.offsetHeight;
            e.setAttribute('data-height', hitem);

            if(!e.closest('.item--open')){
                e.style.height = 0;
            } else {
                e.style.height = hitem + 'px';
            }
        });

        window.lenis?.resize();
        window.ScrollTrigger?.refresh();
    }

   
    calculateHeights();

    items.forEach(function(e){
        e.addEventListener('click', function(){
            let parent = e;

            setTimeout(function(){
                window.lenis?.resize(); 
                window.ScrollTrigger?.refresh();
            },640);

            if(parent.classList.contains('item--open')){
                parent.classList.remove('item--open');
                parent.querySelector('ul').style.height = 0;

            } else {
                parent.classList.add('item--open');
                let g = parent.querySelector('ul').getAttribute('data-height');
                parent.querySelector('ul').style.height = g + 'px';
            }
        })
    });

   
    const onResize = debounce(() => {
        const mobile = isMobile();
        if (mobile && !checkOrientation()) return;
        calculateHeights();
    }, 250);

    document.addEventListener('ajaxLoaded', function(){
        items.forEach(function(e){
            e.classList.remove('item--open');
            e.querySelector('ul').style.height = 0;
        })
    })

    window.addEventListener('resize', onResize);
}

function closeSubmenu(){
    document.querySelectorAll('.has__submenu').forEach(function(e,i){
		let parent = e;
        if(parent.classList.contains('item--open')){
            parent.classList.remove('item--open');
            parent.querySelector('.has__submenu ul').style.height=0;
        }
    })
}

function parallaxing(){
    let parallaximg = document.querySelectorAll('.image--parallax');
	
   if(parallaximg){

        parallaximg.forEach(function(img, i){
        let parent=img.closest('.parallax__container');
        let dist = img.offsetHeight - parent.offsetHeight;
        let gap = document.querySelector('header').offsetHeight;

		window.gsap.set(img,{y: - dist});
        
        window.gsap.to(img, {
            scrollTrigger: {
                trigger:parent,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                //markers:true,
                invalidateOnRefresh: true,
                anticipatePin:1,
                fastScrollEnd:true
            },
            y: (dist-gap),
			transformOrigin: "top",
            ease: "none",
            onComplete: () => {
                //ScrollTrigger.refresh();
            }
        	});
    	})

    }

}

function parallaxingHero(){
	let parallaximg = document.querySelectorAll('.hero--parallax');
	
	if (parallaximg && parallaximg.length) {

		parallaximg.forEach(function(img, i){
			let parent = img.closest('.hero__parallax__container');
			let dist = img.offsetHeight - parent.offsetHeight;
			let gap = document.querySelector('header').offsetHeight;

			window.gsap.set(img, { y: -dist, opacity: 1 });

			window.gsap.to(img, {
				scrollTrigger: {
					trigger: parent,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true,
					invalidateOnRefresh: true,
					anticipatePin: 1,
					fastScrollEnd: true
				},
				y: (dist - gap),
				transformOrigin: "top",
				ease: "none"
			});

			window.gsap.to(img, {
				scrollTrigger: {
					trigger: parent,
					start: 'top top',
					end: 'bottom top',
					scrub: true,
					invalidateOnRefresh: true,
					fastScrollEnd: true
				},
				opacity: 0,
				ease: "none"
			});
		});
	}
}

function playVideo(){
    document.querySelectorAll('video:not(.video__player__native)').forEach(function(e){
        let dist = (window.innerWidth > 640)? -100 : 0;
        if(isElementVisible(e, dist)){
            const p = e.play();
            if(p !== undefined){
                p.catch(function(){});
            }
        }else{
            e.pause();
        }
    })
}

function headerPosition() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Top: hasta 10px de scroll
  if (scrollTop <= 10) {
	document.body.classList.add('scroll--top');
  } else {
	document.body.classList.remove('scroll--top');
  }

  // scroll gap
  if (Math.abs(scrollTop - lastScrollTop) <= delta) return;

  if (scrollTop > lastScrollTop) {
	// Scroll down
	document.body.classList.add('scroll--down');
	document.body.classList.remove('scroll--up');
  } else {
	// Scroll up
	document.body.classList.add('scroll--up');
	document.body.classList.remove('scroll--down');
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

/*function headerColor() {
  const header = document.querySelector('header')
  const headerH = header.getBoundingClientRect().height

  const sections = document.querySelectorAll(
    'section.bg--orange, section.bg--white, section.bg--black'
  )

  let activeSection = null
  let minDistance = Infinity

  sections.forEach(section => {
    const rect = section.getBoundingClientRect()

    // zona de decisión: justo debajo del header
    const distance = Math.abs(rect.top - headerH)

    if (rect.bottom > headerH && rect.top < window.innerHeight) {
      if (distance < minDistance) {
        minDistance = distance
        activeSection = section
      }
    }
  })

  if (!activeSection) return

   header.classList.remove('header--orange', 'header--white', 'header--black')

  if (activeSection.classList.contains('bg--orange')) {
    header.classList.add('header--orange')
  } else if (activeSection.classList.contains('bg--white')) {
    header.classList.add('header--white')
  } else if (activeSection.classList.contains('bg--black')) {
    header.classList.add('header--black')
  }
}*/

function footerParallax() {
 let img = document.querySelector('.footer__logo');
 if (!img) return;

 let startTrigger = document.querySelector('.enerblock__window');
 let parallax = document.querySelector('.footer__parallax');
 let over = document.querySelector('.footer__over');
 let footerLogo = document.querySelector('.footer__logo').getBoundingClientRect().height;
 let subfooter = document.querySelector('.subfooter').getBoundingClientRect().height;

 //if (!startTrigger ||!footer || !parallax || !over) return;
 over.style.height = footerLogo + subfooter + 'px';

const onResize = debounce(() => {
    const mobile = isMobile();
    if (mobile && !checkOrientation()) return;
    footerLogo = document.querySelector('.footer__logo').getBoundingClientRect().height;
    subfooter = document.querySelector('.subfooter').getBoundingClientRect().height;
    over.style.height = footerLogo + subfooter + 'px';
}, 250);
 window.addEventListener('resize', onResize)
 // Estados iniciales
 window.gsap.set(parallax, {
  yPercent: -50
 });

 window.gsap.set(over, {
  opacity: 1
 });

  const scrollConfig = {
  trigger: startTrigger,
  start: "top bottom",
  end: "bottom bottom",
  scrub: true,
  invalidateOnRefresh: true,
  anticipatePin: 1,
  fastScrollEnd: true,
  //markers: true
 };

 // Parallax del contenedor
 window.gsap.to(parallax, {
  yPercent: 0,
  ease: "none",
  scrollTrigger: scrollConfig
 });

 // Fade del overlay
 window.gsap.to(over, {
  opacity: 0,
  ease: "none",
  scrollTrigger: scrollConfig
 });
}

function gopanel(){
    window.scrollYs=[]
    if(document.querySelector('.stack__container') != null){
        const start = document.querySelector('.stack__container').getBoundingClientRect().top + window.scrollY
        document.querySelectorAll('.panel--scroll').forEach(title => {
            let panel = title.closest('.stack__item');
            let h = document.querySelector('header').offsetHeight;
            let order = panel.getAttribute('data-order');
            let dist = (panel.getBoundingClientRect().height -(1.20*h))* (order-1) + start;
            let par = {'order':order, 'dist':dist}
            window.scrollYs.push(par);
            title.addEventListener('click', () => {
                const panel = title.closest('.stack__item')
                if (!panel) return
                
                const panelOrder = panel.getAttribute('data-order');
                const dist = window.scrollYs.find(o => o.order === panelOrder)?.dist

                lenis.scrollTo(dist, {
                duration: 1.2,
                easing: (t) => 1 - Math.pow(1 - t, 3) // easeOutCubic
                })
            })
        })

        function onResizeStack(){
            if(!document.querySelector('.stack__container')) return;
            this.window.scrollYs=[];
            const start = document.querySelector('.stack__container').getBoundingClientRect().top + window.scrollY
            document.querySelectorAll('.panel--scroll').forEach(title => {
                let panel = title.closest('.stack__item');
                let h = document.querySelector('header').offsetHeight;
                let order = panel.getAttribute('data-order');
                let dist = (panel.getBoundingClientRect().height -(1.20*h))* (order-1) + start;
                let par = {'order':order, 'dist':dist}
                window.scrollYs.push(par); 
                
            })
        }
        const debouncedResize = debounce(onResizeStack, 300);
        window.addEventListener('resize', debouncedResize)
    }
}

function debounce(fn, delay = 250) {
  let timeoutId;

  return function (...args) {
    const context = this;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

function checkhero(){
    const header = document.querySelector('header');
    if(document.querySelector('.hero--white')){
        const hero = document.querySelector('.hero--white');
        
        if(isElementVisible(hero)){
            header.classList.add('header--white');
        }else{
            header.classList.remove('header--white');
        }
    }else{
        header.classList.remove('header--white');
    }
}

function resetBodyBack(bodyClass) {
  const toRemove = [...document.body.classList].filter(cls => cls.startsWith('body--'));
  document.body.classList.remove(...toRemove);
  document.body.classList.add(bodyClass);
}

function animateHide(){
    
	var h=window.innerHeight;
	var w=window.innerWidth;
	var dist = (w > 681)?200:80;
	document.querySelectorAll('.hide').forEach(function(el,i){
		if(isElementVisible(el, dist)){
			if(el.classList.contains('hide')){el.classList.remove('hide');}
		}
	});
		
}


function checkModal(){
   document.querySelectorAll('.download--modal').forEach(function(e){
        e.addEventListener('click', function(){
            let parent= e.closest('.modal--container');
            parent.classList.add('open--modal');
        })
    })
}

function touchdevice(){
	var isTouchDevice = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0))

	if (isTouchDevice) {
			return true;
		} else {
			return false;
		}	
}

function isMobileBrowse(){
	const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function isMobile(){
	if(isMobileBrowse() && touchdevice()){
		return true;
	}else{
		return false;
	}
}

let lastVH = window.innerHeight;

function checkOrientation(){
    let currentOrientation=window.orientation;
    if(typeof currentOrientation !== 'undefined' && currentOrientation !== lastOrientation) {
            lastOrientation = currentOrientation;
        return true;
    }
    return false;
}

/* Home logo */
class InteractiveLogo {
  constructor(options = {}) {
	this.svgSelector = options.selector || '.h-logo--center';
	this.ease = options.ease || 0.08;
	this.intensity = options.intensity || 1;

	this.zone = document.querySelector('#interactive--logo');
	this.continer = document.querySelector(this.svgSelector);

	if (!this.zone || !this.continer) return;

	this.targetX = 0;
	this.targetY = 0;
	this.currentX = 0;
	this.currentY = 0;

	this.onMouseMove = this.onMouseMove.bind(this);
	this.onMouseLeave = this.onMouseLeave.bind(this);
	this.onResize = this.onResize.bind(this);

	this.verticalLine1 = document.querySelector('.h-line--left');
	this.verticalLine2 = document.querySelector('.h-line--right');
	this.horizontalLine1 = document.querySelector('.h-line--top');
	this.horizontalLine2 = document.querySelector('.h-line--bottom');

	this._tick = null;
	this._layout = null;

	this.init();
  }

  init() {
	this.collectStates();
	this.setupPolygons();
	this._layout = this.computeLayout(); 
	this.bindEvents();
  }

  onResize() {
	this.collectStates();
	this.setupPolygons();
	this._layout = this.computeLayout(); 
  }

  parsePoints(points) {
	return points.trim().split(/[\s,]+/).map(Number);
  }

  collectStates() {
	const stateNames = ['center', 'left', 'right', 'top', 'bottom'];
	this.states = {};

	stateNames.forEach(state => {
	  this.states[state] = {};
	  let svg;

	  if (state === 'center') {
		svg = document.querySelector(this.svgSelector);
	  } else {
		const template = document.querySelector(`#logo-${state}`);
		if (!template) return;
		svg = template.content.querySelector('svg');
	  }

	  if (!svg) return;

	  svg.querySelectorAll('polygon').forEach(poly => {
		const id = poly.getAttribute('id');
		this.states[state][id] =
		  this.parsePoints(poly.getAttribute('points'));
	  });
	});
  }

  setupPolygons() {
	this.svg = document.querySelector(this.svgSelector);
	if (!this.svg) return;

	this.polygons = {};

	this.svg.querySelectorAll('polygon').forEach(poly => {
	  const id = poly.getAttribute('id');
	  this.polygons[id] = poly;
	});
  }

  bindEvents() {
	window.addEventListener('resize', this.onResize);
	this.zone.addEventListener('mousemove', this.onMouseMove);
	this.zone.addEventListener('mouseleave', this.onMouseLeave);

	this.animate();
  }

  onMouseMove(e) {
	const rect = this.zone.getBoundingClientRect();
	const cx = rect.left + rect.width / 2;
	const cy = rect.top + rect.height / 2;

	this.targetX = ((e.clientX - cx) / (rect.width / 2)) * this.intensity;
	this.targetY = ((e.clientY - cy) / (rect.height / 2)) * this.intensity;

	this.targetX = gsap.utils.clamp(-1, 1, this.targetX);
	this.targetY = gsap.utils.clamp(-1, 1, this.targetY);
  }

  onMouseLeave() {
	this.targetX = 0;
	this.targetY = 0;
  }

  blend(nx, ny) {
	if (!this.states || !this.states.center) return null;

	const result = {};

	const leftW = Math.max(0, -nx);
	const rightW = Math.max(0, nx);
	const topW = Math.max(0, -ny);
	const bottomW = Math.max(0, ny);

	for (const id in this.states.center) {
	  const base = this.states.center[id];
	  const left = this.states.left[id];
	  const right = this.states.right[id];
	  const top = this.states.top[id];
	  const bottom = this.states.bottom[id];

	  result[id] = base.map((val, i) =>
		val
		+ leftW * ((left?.[i] ?? val) - val)
		+ rightW * ((right?.[i] ?? val) - val)
		+ topW * ((top?.[i] ?? val) - val)
		+ bottomW * ((bottom?.[i] ?? val) - val)
	  );
	}

	return result;
  }

  computeLayout() {
	const herocont = document.querySelector('.hero__logo');
	const header = document.querySelector('header');
	if (!herocont || !header || !this.zone || !this.continer || !this.svg) return null;

	const w = this.zone.getBoundingClientRect().width;
	const wsv = this.continer.getBoundingClientRect().width;

	const pt = parseInt(window.getComputedStyle(herocont).paddingTop, 10) || 0;
	const iniV = w / 2 - wsv / 2;
	const iniH = pt;

	return {
	  iniV,
	  iniH
	};
  }

  animate() {
	if (this._tick) return;

	this._tick = () => {
	  if (!this.polygons || !this.svg) return;

	  this.currentX += (this.targetX - this.currentX) * this.ease;
	  this.currentY += (this.targetY - this.currentY) * this.ease;

	  const blended = this.blend(this.currentX, this.currentY);
	  if (!blended) return;

	  for (const id in blended) {
		this.polygons[id]?.setAttribute('points', blended[id].join(' '));
	  }


	  if (this._layout && this.verticalLine1 && this.verticalLine2 && this.horizontalLine1 && this.horizontalLine2) {
		const scaleX = this.getScaleFactorX();
		const scaleY = this.getScaleFactorY();

		const desTotalX  = this._layout.iniV + Math.round(this.getLeftEdgeFromB() * scaleX);
		const desTotalXm = this._layout.iniV + Math.round(this.getRightEdgeFromB() * scaleX);
		const desTotalY  = this._layout.iniH + Math.round(this.getTopEdgeFromA() * scaleY);
		const desTotalYm = this._layout.iniH + Math.round(this.getBottomEdgeFromC() * scaleY);

		this.verticalLine1.style.transform = `translateX(${desTotalX}px)`;
		this.verticalLine2.style.transform = `translateX(${desTotalXm - 1}px)`;
		this.horizontalLine1.style.transform = `translateY(${desTotalY + 0.5}px)`;
		this.horizontalLine2.style.transform = `translateY(${desTotalYm + 0.5}px)`;
	  }
	};

	gsap.ticker.add(this._tick);
  }

  getLeftEdgeFromB() {
	const poly = this.polygons?.['B'];
	if (!poly) return 0;

	const points = poly.getAttribute('points').trim().split(/[\s,]+/).map(Number);
	let minX = Infinity;

	for (let i = 0; i < points.length; i += 2) minX = Math.min(minX, points[i]);
	return minX === Infinity ? 0 : minX;
  }

  getRightEdgeFromB() {
	const poly = this.polygons?.['B'];
	if (!poly) return 0;

	const points = poly.getAttribute('points').trim().split(/[\s,]+/).map(Number);
	let maxX = -Infinity;

	for (let i = 0; i < points.length; i += 2) maxX = Math.max(maxX, points[i]);
	return maxX === -Infinity ? 0 : maxX;
  }

  getTopEdgeFromA() {
	const poly = this.polygons?.['A'];
	if (!poly) return 0;

	const points = poly.getAttribute('points').trim().split(/[\s,]+/).map(Number);
	let minY = Infinity;

	for (let i = 1; i < points.length; i += 2) minY = Math.min(minY, points[i]);
	return minY === Infinity ? 0 : minY;
  }

  getBottomEdgeFromC() {
	const poly = this.polygons?.['C'];
	if (!poly) return 0;

	const points = poly.getAttribute('points').trim().split(/[\s,]+/).map(Number);
	let maxY = -Infinity;

	for (let i = 1; i < points.length; i += 2) maxY = Math.max(maxY, points[i]);
	return maxY === -Infinity ? 0 : maxY;
  }

  getScaleFactorX() {
	const rect = this.svg.getBoundingClientRect();
	const viewBoxWidth = this.svg.viewBox.baseVal.width;
	return rect.width / viewBoxWidth;
  }

  getScaleFactorY() {
	const rect = this.svg.getBoundingClientRect();
	const viewBoxHeight = this.svg.viewBox.baseVal.height;
	return rect.height / viewBoxHeight;
  }

  destroy() {
	if (this.zone) {
	  this.zone.removeEventListener('mousemove', this.onMouseMove);
	  this.zone.removeEventListener('mouseleave', this.onMouseLeave);
	}

	window.removeEventListener('resize', this.onResize);

	if (this._tick) {
	  gsap.ticker.remove(this._tick);
	  this._tick = null;
	}

	gsap.killTweensOf(this);

	this.states = null;
	this.polygons = null;
	this.svg = null;
	this.zone = null;
	this._layout = null;
  }
}
/*
class ScrollFrames {
  static instances = []
  static selector = '.scroll-frames'

  static initAll(selector = ScrollFrames.selector) {
    ScrollFrames.selector = selector

    document.querySelectorAll(selector).forEach(el => {
      const instance = new ScrollFrames(el)
      instance.init()
      ScrollFrames.instances.push(instance)
    })
  }

  static destroyAll() {
    ScrollFrames.instances.forEach(i => i.destroy())
    ScrollFrames.instances = []
  }

  constructor(el) {
    this.element = el.querySelector('scroll-frames')

    this.frameCount = parseInt(this.element.dataset.frames || 100)
    this.images = new Array(this.frameCount)
    this.loader = new ImageLoaderQueue(2)

    this.path = this.element.dataset.path
    this.pos = this.element.dataset.pos

    this.currentFrame = 0
    this.obj = { frame: 0 }

    this.canvas = el.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')

    this._destroyed = false
  }

  async init() {

    await this.waitForGSAP()
    for(let i=0; i<20; i++){
     await this.loadImage(i)
    }



    this.render()
    this.setupScroll()

    if (!this.isSafari()) {
      this.preloadInBackground()
    }
  }

  destroy() {
    this._destroyed = true

    // 🔥 matar ScrollTrigger
    if (this.tween) {
      this.tween.kill()
      this.tween = null
    }

    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === this.el) {
        st.kill()
      }
    })

    // limpiar RAF si lo usas en futuro
    if (this._raf) {
      cancelAnimationFrame(this._raf)
      this._raf = null
    }

    // limpiar imágenes (liberar memoria en Safari importante)
    this.images = []

    // limpiar canvas
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  }

  waitForGSAP() {
    if (window.gsap && window.ScrollTrigger) return Promise.resolve()

    return new Promise(resolve => {
      const i = setInterval(() => {
        if (window.gsap && window.ScrollTrigger) {
          clearInterval(i)
          resolve()
        }
      }, 16)
    })
  }

loadImage(index) {
  if (this.images[index]) return Promise.resolve(this.images[index])

  return this.loader.add(() => {
    return new Promise((resolve) => {
      const img = new Image()
      const frame = String(index + 1).padStart(4, '0')

      img.src = this.path.replace('%04d', frame)

      img.onload = () => {
        this.images[index] = img
        resolve(img)
      }
    })
  })
}

  ensureFrame(frame) {
    const range = 3

    for (let i = frame - range; i <= frame + range; i++) {
      if (i < 0 || i >= this.frameCount) continue
      if (!this.images[i]) this.loadImage(i)
    }
  }

  setupScroll() {
    const pos = this.pos
    const scstart = (pos === 'prefooter') ? "top bottom" : "top top"
    const scend = (pos === 'prefooter') ? "bottom top" : "bottom bottom"

    this.tween = gsap.to(this.obj, {
      frame: this.frameCount - 1,
      ease: "none",
      scrollTrigger: {
        trigger: this.element,
        start: scstart,
        end: scend,
        scrub: true,
        onEnter: () => {
          if (pos !== 'prefooter') document.body.classList.add('header--graph')
        },
        onLeave: () => {
          if (pos !== 'prefooter') document.body.classList.remove('header--graph')
        },
        onEnterBack: () => {
          if (pos !== 'prefooter') document.body.classList.add('header--graph')
        },
        onLeaveBack: () => {
          if (pos !== 'prefooter') document.body.classList.remove('header--graph')
        }
      },
      onUpdate: () => {
        if (this._destroyed) return

        const frame = Math.round(this.obj.frame)

        this.ensureFrame(frame)

        if (!this.images[frame]) {
         this.loadImage(frame)
        }

        this.currentFrame = frame
        this.render()
      }
    })
  }

  render() {
    let img = this.images[this.currentFrame]
    if (!img) {
      for (let i = this.currentFrame; i >= 0; i--) {
        if (this.images[i]) {
          img = this.images[i]
          break
        }
      }
    }

    if (!img) return

    this.canvas.width = img.width
    this.canvas.height = img.height

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(img, 0, 0)
   
  }

  preloadInBackground() {
    let i = 20
    const delay = 60

    const loadNext = () => {
      if (this._destroyed) return
      if (i >= this.frameCount) return

      this.loadImage(i)
      i++

      setTimeout(loadNext, delay)
    }

    setTimeout(loadNext, delay)
  }
}

class ImageLoaderQueue {
  constructor(max = 20) {
    this.max = max
    this.running = 0
    this.queue = []
  }

  add(task) {
    return new Promise(resolve => {
      this.queue.push(() => task().then(resolve))
      this.next()
    })
  }

  next() {
    if (this.running >= this.max) return
    if (!this.queue.length) return

    const job = this.queue.shift()
    this.running++

    job().finally(() => {
      this.running--
      this.next()
    })
  }
}




/*********History */
async function loadUrlAjax(url, { replaceState = false} ) {
    var container = document.getElementById("page-content")
    // fade out
    document.body.classList.remove("page--in");
    document.body.classList.add("fade--out");

    await new Promise((r) => setTimeout(r, 400));

    const res = await fetch(url, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    const text = await res.text();

    const parser = new DOMParser();
    
    const doc = parser.parseFromString(text, "text/html");
    const inPage = doc.body.getAttribute('data-page');
    const newContent = doc.getElementById("page-content");
    if (!newContent) {
        // fallback duro: si no hay #page-content, navega normal
        window.location.href = url;
        return;
    }

    // title
    const newTitle = doc.querySelector("title");
    if (newTitle) document.title = newTitle.textContent;

    // meta description
    const newDescription = doc.querySelector('meta[name="description"]');
    if (newDescription) {
        let currentDescription = document.querySelector('meta[name="description"]');
        if (!currentDescription) {
        currentDescription = document.createElement("meta");
        currentDescription.setAttribute("name", "description");
        document.head.appendChild(currentDescription);
        }
        currentDescription.setAttribute("content", newDescription.getAttribute("content") || "");
    }

    const bodyClass = [...doc.body.classList].find((cls) => cls.startsWith("body--"));
 

    if (window.interactiveLogo) window.interactiveLogo.destroy();
    if (window.scrollFrames) window.scrollFrames.destroy();


    container.innerHTML = newContent.innerHTML;

    // (re)aparece
    document.body.classList.remove("fade--out");
    document.body.classList.add("page--in");

    document.dispatchEvent(
        new CustomEvent("ajaxLoaded", {
        detail: { url },
        })
    );
    let heroHeight = document.querySelector('.hero__description')?.offsetHeight ?? 0;
    document.querySelector('html').style.setProperty('--hero-height', heroHeight + 'px');
    window.lenis.resize();
    window.lenis.scrollTo(0, {immediate:true, duration: 0});
    window.ScrollTrigger.refresh();
    checkhero();
    resetBodyBack(bodyClass);
    document.body.setAttribute('data-page', inPage);
    setTimeout(() => {
        document.body.classList.add('page--in');
        document.dispatchEvent(new CustomEvent('page--in'));
        if(document.querySelector('.h-logo--center')){
        window.interactiveLogo = new InteractiveLogo({
            selector: '.h-logo--center',
            ease: 0.1,
            intensity: 1
        });
        const homeMorph = document.querySelector('.home-morph-wrp')
        //window.scrollFrames = new ScrollFrames(homeMorph);
        //window.scrollFrames.init()

        }  
        
        window.ScrollTrigger.refresh();
    }, 300);
    // fade-in
    document.body.classList.remove("fade--out");
    if (replaceState) {
        history.replaceState({ ajax: true }, "", url);
        updateActiveMenu()
    }
}

function initHistoryNavigation() {
  // estado inicial (para que el primer back también tenga state coherente)
  history.replaceState({ ajax: true }, "", window.location.href);

  window.addEventListener("popstate", async (event) => {
    // Cuando el user hace back/forward, la URL ya cambió
    const url = window.location.href;

    // Si tu router depende de "this", asegúrate que apunta al componente correcto
    await loadUrlAjax(url, { replaceState: true });
  });
}

function updateActiveMenu() {
  const links = document.querySelectorAll('a-link'); 
  const currentPath = window.location.pathname.replace(/\/$/, '');

  links.forEach(link => {
    const href = link.getAttribute('href')?.replace(/\/$/, '');

    if (!href) return;

    // match exacto
    if (href === currentPath) {
      link.classList.add('current');
    } else {
      link.classList.remove('current');
    }
  });
}
