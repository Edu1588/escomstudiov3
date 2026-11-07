class SwiperSlider extends HTMLElement {
  constructor() {
    super();
    this.swiper = null;
    this._initialized = false;
  }

  connectedCallback() {
    if (this._initialized) return;

    const container = this.querySelector('.swiper');
    if (!container) return;

    this.waitForSwiper().then(() => {
      this.init(container);
      this._initialized = true;
    });
  }

  waitForSwiper() {
    if (window.Swiper) return Promise.resolve();

    return new Promise(resolve => {
      const i = setInterval(() => {
        if (window.Swiper) {
          clearInterval(i);
          resolve();
        }
      }, 16);
    });
  }

  init(container) {
    // ❗ NO modules aquí
    this.swiper = new window.Swiper(container, {
      slidesPerView: 1.25,
	  centeredSlides: false,
	  loop: false,
	  speed: 250,
	  
	  navigation: {
		  nextEl: this.querySelector('.swiper-button-next'),
		  prevEl: this.querySelector('.swiper-button-prev'),
	  },
	  
	  pagination: {
		  el: this.querySelector('.swiper-pagination'),
		  clickable: true,
	  },
	  
	  breakpoints: {
		  640: {
			  slidesPerView: 1.25,
			  speed: 250
		  },
		  768: {
			  slidesPerView: 2.5,
			  speed: 400
		  }
	  }
    });
  }

  disconnectedCallback() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
      this._initialized = false;
    }
  }
}

if (!customElements.get('swiper-slider')) {
  customElements.define('swiper-slider', SwiperSlider);
}
