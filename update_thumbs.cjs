const fs = require('fs');

const urls = [
  "https://mistyrose-flamingo-188104.hostingersite.com/wp-content/uploads/2026/04/GOLONI.mp4",
  "https://mistyrose-flamingo-188104.hostingersite.com/wp-content/uploads/2026/04/MOA_HERO.mp4",
  "https://image.mux.com/MSctoqC17nNR00ZSv5l7fTur9QOwcJHC01uL02uOFs1Vvs/animated.webp?width=640&fps=15",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://image.mux.com/1tb5PLrFcCkmoBqvflyFoYir9gXKn9njA0002dKgM5hLg/animated.webp?width=640&fps=15",
  "https://image.mux.com/8v3ptTfh02ifW501AE0101Oc9likenmSljCmutT2xXSEzEk/animated.webp?width=640&fps=15",
  "https://image.mux.com/QDrrVBt5kubevo3zVWgncIEn02hXQmkaNooo6X02xQsr8/animated.webp?width=640&fps=15",
  "https://mistyrose-flamingo-188104.hostingersite.com/wp-content/uploads/2026/04/GOLONI.mp4"
];

let content = fs.readFileSync('index.html', 'utf8');

const regex = /<video class="w-full h-full object-cover" autoplay loop muted playsinline src="https:\/\/res\.cloudinary\.com\/djw0tqmiw\/video\/upload\/[^"]+\.mp4"><\/video>/g;

let count = 0;
content = content.replace(regex, (match) => {
  if (count >= urls.length) return match;
  const url = urls[count];
  count++;
  if (url.endsWith('.mp4')) {
    return `<video class="w-full h-full object-cover" autoplay loop muted playsinline src="${url}"></video>`;
  } else {
    return `<img class="w-full h-full object-cover" src="${url}" />`;
  }
});

fs.writeFileSync('index.html', content, 'utf8');
console.log('Replaced', count, 'thumbnails');
