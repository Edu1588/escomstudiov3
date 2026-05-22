
      // Initialize Lenis Smooth Scroll
      const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
      });

      // Connect Lenis to GSAP ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time)=>{
          lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Ensure ScrollTrigger positions are perfectly calculated
      window.addEventListener('load', () => {
          setTimeout(() => {
              ScrollTrigger.refresh();
          }, 100);
      });

      // Initial Load Reveal -> Called after video
      function playHeroReveal() {
          const heroContent = document.getElementById('hero-content');
          const scrollInd = document.getElementById('hero-scroll-indicator');
          heroContent.classList.remove('opacity-0');
          scrollInd.classList.remove('opacity-0');

          const heroLines = document.querySelectorAll('.masked-line span');
          gsap.fromTo(heroLines,
              { yPercent: 100, opacity: 0 },
              {
                  yPercent: 0,
                  opacity: 1,
                  duration: 1.2,
                  stagger: 0.2,
                  ease: "power4.out",
                  delay: 0.2
              }
          );

          const heroFades = document.querySelectorAll('.hero-fade');
          gsap.fromTo(heroFades,
              { y: 30, opacity: 0 },
              {
                  y: 0,
                  opacity: 1,
                  duration: 1,
                  stagger: 0.1,
                  ease: "power3.out",
                  delay: 0.6
              }
          );
      }

      // Stars Background Logic
      const starsContainer = document.getElementById('hero-stars');
      if (starsContainer) {
          function generateStars(count, size, duration) {
              const layer = document.createElement('div');
              layer.className = 'absolute top-0 left-0 w-full animate-stars';
              layer.style.height = '2000px';
              layer.style.animation = `stars-scroll ${duration}s linear infinite`;

              let shadows = [];
              for (let i = 0; i < count; i++) {
                  const x = Math.floor(Math.random() * window.innerWidth);
                  const y = Math.floor(Math.random() * 2000);
                  shadows.push(`${x}px ${y}px #fff`);
              }
              const boxShadowObj = shadows.join(', ');

              const star1 = document.createElement('div');
              star1.className = 'absolute bg-transparent rounded-full';
              star1.style.width = `${size}px`;
              star1.style.height = `${size}px`;
              star1.style.boxShadow = boxShadowObj;

              const star2 = document.createElement('div');
              star2.className = 'absolute bg-transparent rounded-full top-[2000px]';
              star2.style.width = `${size}px`;
              star2.style.height = `${size}px`;
              star2.style.boxShadow = boxShadowObj;

              layer.appendChild(star1);
              layer.appendChild(star2);
              starsContainer.appendChild(layer);
          }

          // Create multiple layers for parallax
          generateStars(400, 1, 50);
          generateStars(150, 2, 100);
          generateStars(50, 3, 150);
          
          // Mouse move parallax effect
          document.addEventListener('mousemove', (e) => {
              const x = (e.clientX - window.innerWidth / 2) * -0.05;
              const y = (e.clientY - window.innerHeight / 2) * -0.05;
              gsap.to(starsContainer, { x: x, y: y, duration: 1, ease: "power2.out" });
          });
      }

      // Video Intro Logic
      const introVideo = document.getElementById('hero-intro-video');
      const loopImage = document.getElementById('hero-background-image');

      if (introVideo && loopImage) {
          let hasRevealed = false;
          const performReveal = (hideVideo = true) => {
              if (hasRevealed) return;
              hasRevealed = true;
              if (hideVideo && introVideo) introVideo.classList.add('opacity-0');
              if (loopImage) loopImage.classList.remove('opacity-0');
              playHeroReveal();
          };

          const playPromise = introVideo.play();
          if (playPromise !== undefined) {
              playPromise.catch(error => {
                  console.log("Intro video autoplay failed or blocked.");
                  // Fallback: Reveal texts instantly, but don't hide the video completely unless it's done
                  performReveal(false);
              });
          }
          introVideo.addEventListener('ended', () => performReveal(true));
          
          setTimeout(() => performReveal(false), 4000);
      } else {
          playHeroReveal();
      }

      // Hero Image Sequence Canvas on Scroll
      const heroSeqCanvas = document.getElementById('hero-sequence-canvas');
      if (heroSeqCanvas) {
          const context = heroSeqCanvas.getContext("2d");
          heroSeqCanvas.width = window.innerWidth;
          heroSeqCanvas.height = window.innerHeight;

          window.addEventListener("resize", () => {
              heroSeqCanvas.width = window.innerWidth;
              heroSeqCanvas.height = window.innerHeight;
              if (frameImages[scrollFrames.frame] && frameImages[scrollFrames.frame].complete) {
                  renderSeqFrame(scrollFrames.frame);
              }
          });

          const scrollFrames = { frame: 0 };
          const frameImages = [];
          
          // Start from frame 4 up to 26
          const startFrame = 4;
          const endFrame = 26;
          const totalFrames = endFrame - startFrame + 1;

          for (let i = startFrame; i <= endFrame; i++) {
              const img = new Image();
              img.src = `https://eionstudio.com.br/wp-content/uploads/2026/05/ezgif-frame-${i.toString().padStart(3, '0')}-2.png`;
              frameImages.push(img);
          }

          function renderSeqFrame(index) {
              const idx = Math.floor(index);
              if (frameImages[idx] && frameImages[idx].complete) {
                  const img = frameImages[idx];
                  const canvasRatio = heroSeqCanvas.width / heroSeqCanvas.height;
                  const imgRatio = img.width / img.height;
                  
                  let drawWidth = heroSeqCanvas.width;
                  let drawHeight = heroSeqCanvas.height;
                  let offsetX = 0;
                  let offsetY = 0;

                  if (canvasRatio > imgRatio) {
                      drawHeight = heroSeqCanvas.width / imgRatio;
                      offsetY = (heroSeqCanvas.height - drawHeight) / 2;
                  } else {
                      drawWidth = heroSeqCanvas.height * imgRatio;
                      offsetX = (heroSeqCanvas.width - drawWidth) / 2;
                  }
                  
                  context.clearRect(0, 0, heroSeqCanvas.width, heroSeqCanvas.height);
                  context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
              }
          }

          frameImages[0].onload = () => renderSeqFrame(0);

          gsap.to(heroSeqCanvas, {
              opacity: 1,
              scrollTrigger: {
                  trigger: "#hero-scroll-space",
                  start: "top bottom",
                  end: "top top",
                  scrub: true
              }
          });

          gsap.to(scrollFrames, {
              frame: totalFrames - 1,
              snap: "frame",
              ease: "none",
              scrollTrigger: {
                  trigger: "#hero-scroll-space",
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5
              },
              onUpdate: () => renderSeqFrame(scrollFrames.frame)
          });

          gsap.to("#hero-content", {
              scale: 0.85,
              opacity: 0,
              y: -100,
              scrollTrigger: {
                  trigger: "#hero-scroll-space",
                  start: "top top",
                  end: "center top",
                  scrub: true
              }
          });
      }

      // Gallery Item Scroll Reveal (Scale & Color)
      const galleryItems = document.querySelectorAll('.gallery-item');
      galleryItems.forEach(item => {
          const img = item.querySelector('img');
          
          gsap.fromTo(item, 
              { scale: 0.6, opacity: 0.3, borderRadius: "64px" },
              {
                  scale: 1,
                  borderRadius: "16px",
                  opacity: 1,
                  scrollTrigger: {
                      trigger: item,
                      start: "top 95%",
                      end: "center 60%",
                      scrub: true,
                      invalidateOnRefresh: true
                  }
              }
          );
          
          gsap.fromTo(img, 
              { filter: "grayscale(100%) brightness(0.4)", scale: 1.3 },
              {
                  filter: "grayscale(0%) brightness(1)", 
                  scale: 1,
                  scrollTrigger: {
                      trigger: item,
                      start: "top 95%",
                      end: "center 60%",
                      scrub: true,
                      invalidateOnRefresh: true
                  }
              }
          );
      });

      // Section Bars Reveal
      gsap.to(".section-bar", {
          scrollTrigger: {
              trigger: "#hero-scroll-space",
              start: "bottom bottom",
              end: "bottom top",
              scrub: true
          },
          scaleY: 1,
          ease: "none",
          stagger: 0.05
      });

      // Scroll Masked Reveal (animate text in statement)
      const scrollMaskedLines = document.querySelectorAll('.scroll-masked-line span');
      if(scrollMaskedLines.length) {
          const tl = gsap.timeline({
              scrollTrigger: {
                  trigger: '#statement',
                  start: "top center", // Trigger when reaching center of viewport
                  toggleActions: "play none none reverse"
              }
          });
          
          tl.fromTo(scrollMaskedLines,
              { y: 60, opacity: 0 },
              {
                  y: 0,
                  opacity: 1,
                  duration: 1.2,
                  stagger: 0.2,
                  ease: "power3.out"
              }
          );
      }

      // Floating Action Buttons Visibility
      const fabContainer = document.getElementById('fab-container');
      
      ScrollTrigger.create({
          trigger: '#statement',
          start: "top center", // when top of statement hits center of viewport
          onEnter: () => fabContainer.classList.replace('opacity-0', 'opacity-100') || fabContainer.classList.remove('pointer-events-none'),
          onLeaveBack: () => fabContainer.classList.replace('opacity-100', 'opacity-0') || fabContainer.classList.add('pointer-events-none')
      });

      // Scroll to top functionality
      document.getElementById('scrollToTop').addEventListener('click', () => {
          lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      });

      // ScrollTrigger: In-view Cascade (Fade Up)
      const fadeUpElements = document.querySelectorAll('.fade-up');
      fadeUpElements.forEach((el) => {
          gsap.to(el, {
              scrollTrigger: {
                  trigger: el,
                  start: "top 85%",
                  once: true
              },
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out"
          });
      });

      // ScrollTrigger: Journey Line
      gsap.to('.progress-line', {
          scrollTrigger: {
              trigger: '.journey-steps',
              start: "top center",
              end: "bottom center",
              scrub: 1
          },
          scaleY: 1,
          transformOrigin: "top"
      });

      // Counter Animation
      const counterElement = document.getElementById('counter-anos');
      if (counterElement) {
          gsap.fromTo(counterElement, 
              { innerHTML: 0 }, 
              { 
                  innerHTML: 15, 
                  duration: 2, 
                  snap: { innerHTML: 1 }, 
                  ease: "power2.out",
                  scrollTrigger: {
                      trigger: counterElement,
                      start: "top 90%",
                      once: true
                  }
              }
          );
      }

      // Magnetic Buttons (Awwwards Style)
      const magneticElements = document.querySelectorAll('.magnetic');
      magneticElements.forEach((el) => {
          el.addEventListener('mousemove', (e) => {
              const position = el.getBoundingClientRect();
              const x = e.clientX - position.left - position.width / 2;
              const y = e.clientY - position.top - position.height / 2;

              gsap.to(el, {
                  x: x * 0.3,
                  y: y * 0.3,
                  duration: 0.5,
                  ease: "power3.out"
              });
          });

          el.addEventListener('mouseleave', () => {
              gsap.to(el, {
                  x: 0,
                  y: 0,
                  duration: 0.7,
                  ease: "elastic.out(1, 0.3)"
              });
          });
      });
    