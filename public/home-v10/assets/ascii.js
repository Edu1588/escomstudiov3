(() => {
  'use strict';
  const canvas=document.getElementById('ascii-canvas');
  if(!canvas)return;
  const host=canvas.parentElement;
  const context=canvas.getContext('2d',{alpha:true});
  const source=document.createElement('canvas');
  const sample=source.getContext('2d',{willReadFrequently:true});
  if(!context||!sample)return;
  const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const image=new Image();image.src=new URL('../images/portrait.png',document.currentScript.src).href;
  const glyphs=" .:,'-^=*+?!|0#X%WM@";
  let width=0,height=0,cols=0,rows=0,pixels=null,visible=true,last=0,frame=0;
  let color=[255,77,0],showOriginal=false,clickTime=-10000,clickX=.5,clickY=.5;
  const revealStart=performance.now();
  const pointer={x:-1000,y:-1000,tx:-1000,ty:-1000};
  function resize(){
    const rect=host.getBoundingClientRect();width=rect.width;height=rect.height;
    const dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;context.setTransform(dpr,0,0,dpr,0,0);
    cols=Math.max(1,Math.floor(width/5));rows=Math.max(1,Math.floor(height/7.6));source.width=cols;source.height=rows;
    sample.clearRect(0,0,cols,rows);
    if(!image.complete||!image.naturalWidth)return;
    // Account for non-square character cells when sampling the original portrait texture.
    const scale=Math.min(width/image.width,height/image.height);
    const dw=image.width*scale/5,dh=image.height*scale/7.6;
    sample.drawImage(image,(cols-dw)/2,(rows-dh)/2,dw,dh);pixels=sample.getImageData(0,0,cols,rows).data;
    draw(performance.now());
  }
  function draw(time){
    if(!pixels)return;
    pointer.x+=(pointer.tx-pointer.x)*.12;pointer.y+=(pointer.ty-pointer.y)*.12;
    context.clearRect(0,0,width,height);context.font='500 6.7px GeistMono,monospace';context.textBaseline='top';
    const cw=width/cols,ch=height/rows;
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const idx=(y*cols+x)*4,a=pixels[idx+3]/255;if(a<.1)continue;
      const linear=(Math.pow(pixels[idx]/255,2.2)*.299+Math.pow(pixels[idx+1]/255,2.2)*.587+Math.pow(pixels[idx+2]/255,2.2)*.114);
      const luminance=Math.pow(linear*linear*(3-2*linear),1.3);
      const px=x*cw,py=y*ch,dist=Math.hypot(px-pointer.x,py-pointer.y);
      const interaction=Math.max(0,1-dist/125);
      const reveal=calm?1:Math.min(1,(time-revealStart)/1800);
      const normalizedDistance=Math.hypot(x/cols-.5,y/rows-.5)/.71;
      if(normalizedDistance>reveal)continue;
      const radialDistance=Math.hypot(x/cols-clickX,y/rows-clickY);
      const ripple=calm?0:Math.exp(-Math.pow(radialDistance-(time-clickTime)/1400,2)*180)*Math.max(0,1-(time-clickTime)/1800);
      const gi=Math.min(glyphs.length-1,Math.floor((luminance+interaction*.18)*(glyphs.length-1)));
      const rgb=color.map(c=>Math.round(18+(c-18)*luminance+ripple*85));
      const blend=Math.min(1,interaction*2.5);
      const originalHere=showOriginal?1-blend:blend;
      if(originalHere>.05){
        context.fillStyle=`rgba(${pixels[idx]},${pixels[idx+1]},${pixels[idx+2]},${a*originalHere})`;
        context.fillRect(px,py,cw+.3,ch+.3);
      }
      context.fillStyle=`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a*(1-originalHere)})`;
      context.fillText(glyphs[gi],px,py);
    }
    frame++;
  }
  function tick(time){if(visible&&!document.hidden&&time-last>48){draw(time);last=time;}if(!calm)requestAnimationFrame(tick);}
  image.addEventListener('load',resize);
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(host);
  host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect();pointer.tx=e.clientX-r.left;pointer.ty=e.clientY-r.top;if(calm)draw(performance.now());});
  host.addEventListener('pointerleave',()=>{pointer.tx=-1000;pointer.ty=-1000;});
  host.addEventListener('click',e=>{const r=host.getBoundingClientRect();clickX=(e.clientX-r.left)/r.width;clickY=(e.clientY-r.top)/r.height;clickTime=performance.now();showOriginal=!showOriginal;draw(clickTime);});
  addEventListener('brand-color',e=>{color=e.detail;draw(performance.now());});
  document.fonts.ready.then(resize);
  if(!calm)requestAnimationFrame(tick);
})();
