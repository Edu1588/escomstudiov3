const fs = require('fs');

const originalVideos = [
  "https://res.cloudinary.com/djw0tqmiw/video/upload/v1779824400/yqeskrttuawrsj9zcf0d.mp4",
  "https://res.cloudinary.com/djw0tqmiw/video/upload/v1779824400/biayyjpzidhjetnytavb.mp4",
  "https://res.cloudinary.com/djw0tqmiw/video/upload/v1779824400/yqeskrttuawrsj9zcf0d.mp4",
  "https://res.cloudinary.com/djw0tqmiw/video/upload/v1779824400/yqeskrttuawrsj9zcf0d.mp4",
  "https://res.cloudinary.com/djw0tqmiw/video/upload/v1779824400/fubvmghpobclz2wvnnlp.mp4",
  "https://res.cloudinary.com/djw0tqmiw/video/upload/v1779824400/d8h6liduvxqjbjnrjigv.mp4",
  "https://res.cloudinary.com/djw0tqmiw/video/upload/v1779824400/ldhfftupzjfowoslbmse.mp4",
  "https://res.cloudinary.com/djw0tqmiw/video/upload/v1779824400/thjguiaphttpaxrmyo4r.mp4"
];

const newCarouselThumbs = [
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

// 1. Revert Services Videos (which were replaced by update_thumbs earlier)
// Since they might be either <video src="...mp4"> or <img src="..."> now, we look for them in the "service-item-body-content" context.
// Wait, they are in <div class="aspect-video rounded-[3px] overflow-hidden bg-black border border-white/10 relative">
// We replace the innerHTML of that div.
let vCount = 0;
content = content.replace(/(<div class="aspect-video rounded-\[3px\] overflow-hidden bg-black border border-white\/10 relative">\s*)(<video.*?<\/video>|<img.*?>)(\s*<\/div>)/g, (match, prefix, tag, suffix) => {
  if (vCount < 8) {
    const url = originalVideos[vCount];
    vCount++;
    return prefix + `<video class="w-full h-full object-cover" autoplay loop muted playsinline src="${url}"></video>` + suffix;
  }
  return match;
});
console.log('Reverted', vCount, 'service videos');

// 2. Now replace the Carousel Cards (in #carouselTrack)
// The cards have `<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style="background-image: url('...');"></div>`
let cCount = 0;
content = content.replace(/<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style="background-image: url\('[^']+'\);"><\/div>/g, (match) => {
  if (cCount < newCarouselThumbs.length) {
    const url = newCarouselThumbs[cCount];
    cCount++;
    if (url.endsWith('.mp4')) {
      return `<video class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" autoplay loop muted playsinline src="${url}"></video>`;
    } else {
      return `<img class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${url}" />`;
    }
  }
  return match;
});
console.log('Updated', cCount, 'carousel items');

fs.writeFileSync('index.html', content, 'utf8');
