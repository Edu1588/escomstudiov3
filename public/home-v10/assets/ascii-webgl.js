/* Local WebGL reconstruction of the observed ASCII, depth-parallax and gooey
   hover behavior. The source textures remain ordinary local PNG assets. */
(() => {
  'use strict';
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const instances = [];
  const scriptBase = new URL('../', document.currentScript.src);
  const localTextures = location.protocol === 'file:' ? new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=new URL('assets/ascii-local-textures.js',scriptBase).href;
    script.onload=()=>resolve(window.homeV10AsciiTextures);
    script.onerror=()=>reject(new Error('Texturas locais indisponíveis'));
    document.head.append(script);
  }) : Promise.resolve(null);
  async function loadTexture(path){
    const textures=await localTextures;
    return loadImage(textures?.[path] ?? new URL(path,scriptBase).href);
  }
  const vertex = `attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
  const fragment = `precision highp float;
    varying vec2 vUv;
    uniform sampler2D uImage,uDepth,uAtlas;
    uniform vec2 uResolution,uImageSize,uMouse,uOffset,uOrigin,uClick;
    uniform float uCell,uHover,uTime,uReveal,uColorMix,uRipple,uHasDepth,uFit,uParallax;
    uniform vec3 uColor,uDark;
    float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    vec2 imageUv(vec2 uv){vec2 ratio=uResolution/uImageSize;float scale=mix(min(ratio.x,ratio.y),max(ratio.x,ratio.y),uFit);return (uv-.5)*uResolution/(uImageSize*scale)+.5;}
    vec4 photo(vec2 uv){vec2 p=imageUv(uv);if(p.x<0.||p.y<0.||p.x>1.||p.y>1.)return vec4(0.);return texture2D(uImage,p);}
    void main(){
      vec2 grid=uResolution/uCell;
      vec2 center=(floor(vUv*grid)+.5)/grid;
      vec2 imagePoint=imageUv(center);
      float depth=uHasDepth>.5?texture2D(uDepth,clamp(imagePoint,0.,1.)).r:.5;
      vec2 shifted=center+uOffset*depth*uParallax;
      vec4 pixel=photo(shifted);
      if(pixel.a<.08){gl_FragColor=vec4(0.);return;}
      float l=dot(pow(max(pixel.rgb,vec3(0.)),vec3(2.2)),vec3(.299,.587,.114));
      l=pow(smoothstep(0.,1.,l),1.3);
      vec2 aspect=vec2(uResolution.x/uResolution.y,1.);
      float dist=distance(vUv*aspect,uMouse*aspect);
      float organic=sin(vUv.y*45.+uTime*.8)*.007+sin(vUv.x*39.-uTime)*.006;
      float goo=0.;
      if(uHover>.001)goo=1.-smoothstep(.13*uHover,.19*uHover,dist+organic);
      float index=floor(18.*l);
      if(goo>.01)index=mod(index+floor(noise(floor(vUv*grid)+floor(uTime*9.))*19.*l*goo),19.);
      vec2 tile=vec2(mod(index,16.),15.-floor(index/16.));
      vec2 letterUv=(tile+fract(vUv*grid))/16.;
      float glyph=texture2D(uAtlas,letterUv).a;
      float alpha=glyph*smoothstep(.08,.28,pixel.a);
      float revealDistance=distance(vUv,uOrigin);
      float reveal=1.-smoothstep(uReveal*1.5-.05,uReveal*1.5+.05,revealDistance+noise(floor(vUv*grid))*.04);
      vec3 ink=mix(uDark,uColor,l);
      ink=mix(ink,pixel.rgb,uColorMix);
      float ring=exp(-pow(distance(vUv*aspect,uClick*aspect)-uRipple,2.)*220.)*max(0.,1.-uRipple);
      ink+=ring*.42;
      vec4 original=photo(vUv+uOffset*depth*uParallax);
      float blend=smoothstep(.05,.75,goo)*(1.-smoothstep(0.,.25,uColorMix));
      vec3 rgb=mix(ink,original.rgb,blend);
      alpha=mix(alpha,original.a,blend)*reveal;
      gl_FragColor=vec4(rgb*alpha,alpha);
    }`;

  function compile(gl, type, text) {
    const shader=gl.createShader(type);gl.shaderSource(shader,text);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  function loadImage(url) {
    return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Não foi possível carregar '+url));image.src=url;});
  }
  function texture(gl, image, slot) {
    const value=gl.createTexture();gl.activeTexture(gl.TEXTURE0+slot);gl.bindTexture(gl.TEXTURE_2D,value);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    return value;
  }
  function makeAtlas() {
    const atlas=document.createElement('canvas');atlas.width=atlas.height=1024;
    const ctx=atlas.getContext('2d');ctx.clearRect(0,0,1024,1024);ctx.fillStyle='#fff';
    ctx.font='54px "Cascadia Mono",Consolas,monospace';ctx.textAlign='center';ctx.textBaseline='middle';
    [..." .:,'-^=*+?!|0#X%WM@"].forEach((char,i)=>ctx.fillText(char,i%16*64+32,Math.floor(i/16)*64+32));
    return atlas;
  }
  function fallback(canvas,image) {
    const context=canvas.getContext('2d');
    if(!context)return;
    const source=document.createElement('canvas'),sample=source.getContext('2d',{willReadFrequently:true});
    let points=[],rect,mouse=null,originalColors=false,scale=1,dx=0,dy=0;
    function draw(){
      if(!rect)return;context.clearRect(0,0,rect.width,rect.height);context.font='7px Consolas,monospace';
      points.forEach(point=>{context.fillStyle=originalColors?point.original:point.color;context.fillText(point.char,point.x,point.y);});
      if(mouse&&!originalColors){context.save();context.beginPath();context.arc(mouse.x,mouse.y,110,0,Math.PI*2);context.clip();context.drawImage(image,dx,dy,image.width*scale,image.height*scale);context.restore();}
    }
    function resize(){
      rect=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;context.setTransform(dpr,0,0,dpr,0,0);
      const ratios=[rect.width/image.width,rect.height/image.height];scale=canvas.dataset.asciiFit==='cover'?Math.max(...ratios):Math.min(...ratios);dx=(rect.width-image.width*scale)/2;dy=(rect.height-image.height*scale)/2;
      const w=Math.max(1,Math.ceil(rect.width/7)),h=Math.max(1,Math.ceil(rect.height/7));source.width=w;source.height=h;sample.clearRect(0,0,w,h);sample.drawImage(image,dx/7,dy/7,image.width*scale/7,image.height*scale/7);
      const pixels=sample.getImageData(0,0,w,h).data;points=[];
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(pixels[i+3]<25)continue;const l=Math.pow((pixels[i]*.299+pixels[i+1]*.587+pixels[i+2]*.114)/255,2);const char=" .:,'-^=*+?!|0#X%WM@"[Math.floor(l*18)];if(char!==' ')points.push({x:x*7,y:y*7,char,original:`rgba(${pixels[i]},${pixels[i+1]},${pixels[i+2]},${pixels[i+3]/255})`,color:`rgba(255,107,74,${l})`});}
      draw();
    }
    canvas.addEventListener('pointermove',event=>{rect=canvas.getBoundingClientRect();mouse={x:event.clientX-rect.left,y:event.clientY-rect.top};draw();},{passive:true});
    canvas.addEventListener('pointerleave',()=>{mouse=null;draw();});
    if(canvas.id==='ascii-canvas')canvas.addEventListener('click',()=>{originalColors=!originalColors;draw();});
    new ResizeObserver(resize).observe(canvas);resize();canvas.dataset.asciiFallback='2d';
  }
  async function create(canvas) {
    const src=canvas.dataset.asciiSrc;
    const image=await loadTexture(src);
    const depth=canvas.dataset.asciiDepth?await loadTexture(canvas.dataset.asciiDepth):image;
    const gl=canvas.getContext('webgl',{alpha:true,antialias:false,preserveDrawingBuffer:true,powerPreference:'low-power'});
    if(!gl){fallback(canvas,image);return;}
    const program=gl.createProgram();
    gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const names=['uImage','uDepth','uAtlas','uResolution','uImageSize','uMouse','uOffset','uOrigin','uClick','uCell','uHover','uTime','uReveal','uColorMix','uRipple','uHasDepth','uFit','uParallax','uColor','uDark'];
    const uniforms=Object.fromEntries(names.map(name=>[name,gl.getUniformLocation(program,name)]));
    const atlas=makeAtlas();texture(gl,image,0);texture(gl,depth,1);const atlasTexture=texture(gl,atlas,2);
    gl.uniform1i(uniforms.uImage,0);gl.uniform1i(uniforms.uDepth,1);gl.uniform1i(uniforms.uAtlas,2);
    gl.uniform2f(uniforms.uImageSize,image.width,image.height);gl.uniform1f(uniforms.uHasDepth,canvas.dataset.asciiDepth?1:0);
    gl.uniform1f(uniforms.uFit,canvas.dataset.asciiFit==='cover'?1:0);
    gl.uniform1f(uniforms.uParallax,Number(canvas.dataset.asciiParallax??.12));
    gl.uniform3f(uniforms.uDark,26/255,10/255,46/255);
    const origin=(canvas.dataset.asciiOrigin??'.2,.65').split(',').map(Number);
    gl.uniform2f(uniforms.uOrigin,origin[0],origin[1]);
    const state={canvas,gl,program,uniforms,visible:false,started:0,last:0,width:0,height:0,dpr:1,hover:0,targetHover:0,x:-2,y:-2,tx:-2,ty:-2,offsetX:0,offsetY:0,targetOffsetX:0,targetOffsetY:0,mode:canvas.id==='ascii-canvas'?0:.7,colorMix:canvas.id==='ascii-canvas'?0:.7,clickAt:-10000,clickX:-2,clickY:-2,color:[1,.42,.29]};
    function size(){
      const rect=canvas.getBoundingClientRect();state.width=rect.width;state.height=rect.height;state.dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.max(1,Math.round(rect.width*state.dpr));canvas.height=Math.max(1,Math.round(rect.height*state.dpr));gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform2f(uniforms.uResolution,canvas.width,canvas.height);gl.uniform1f(uniforms.uCell,Number(canvas.dataset.asciiCell??7)*state.dpr);
      const now = performance.now();
      if (canvas.id === 'ascii-canvas' && rect.bottom <= 0) {
        if (!state.started) state.started = now - 1700;
        draw(state, now);
      } else if (calm) draw(state, now);
    }
    new ResizeObserver(size).observe(canvas);size();
    new IntersectionObserver(entries=>{state.visible=entries[0].isIntersecting;if(state.visible&&!state.started)state.started=performance.now();if(calm&&state.visible)draw(state,performance.now());},{rootMargin:'60px'}).observe(canvas);
    const area=canvas.id==='ascii-canvas'?document.getElementById('inicio'):canvas;
    function pointer(event){
      const rect=canvas.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width,y=1-(event.clientY-rect.top)/rect.height;
      const inside=x>=0&&x<=1&&y>=0&&y<=1;
      state.tx=x;state.ty=y;state.targetHover=inside?1:0;
      state.targetOffsetX=(Math.max(0,Math.min(1,x))-.5)*.6;state.targetOffsetY=(Math.max(0,Math.min(1,y))-.5)*.4;
      if(calm){state.x=x;state.y=y;state.hover=state.targetHover;draw(state,performance.now());}
    }
    area.addEventListener('pointermove',pointer,{passive:true});
    area.addEventListener('pointerleave',()=>{state.targetHover=0;state.targetOffsetX=state.targetOffsetY=0;if(calm){state.hover=0;draw(state,performance.now());}});
    canvas.addEventListener('click',event=>{const rect=canvas.getBoundingClientRect();state.mode=state.mode?0:1;state.clickX=(event.clientX-rect.left)/rect.width;state.clickY=1-(event.clientY-rect.top)/rect.height;state.clickAt=performance.now();if(calm)draw(state,state.clickAt);});
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();canvas.style.background=`center/contain no-repeat url("${image.src}")`;state.visible=false;});
    document.fonts.ready.then(()=>{gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,atlasTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,makeAtlas());if(calm)draw(state,performance.now());});
    instances.push(state);
  }
  function draw(state,time){
    const {gl,program,uniforms:u}=state;
    gl.useProgram(program);
    const smooth=calm?1:.16;
    state.hover+=(state.targetHover-state.hover)*smooth;
    if(state.x===-2&&state.targetHover){state.x=state.tx;state.y=state.ty;}
    state.x+=(state.tx-state.x)*smooth;state.y+=(state.ty-state.y)*smooth;
    state.offsetX+=(state.targetOffsetX-state.offsetX)*.06;state.offsetY+=(state.targetOffsetY-state.offsetY)*.06;
    state.colorMix+=(state.mode-state.colorMix)*.08;
    gl.uniform2f(u.uMouse,state.x,state.y);gl.uniform2f(u.uOffset,calm?0:state.offsetX,calm?0:state.offsetY);
    gl.uniform1f(u.uHover,state.hover);gl.uniform1f(u.uTime,calm?0:time/1000);
    gl.uniform1f(u.uReveal,calm?1:Math.min(1,(time-state.started)/1700));gl.uniform1f(u.uColorMix,calm?state.mode:state.colorMix);
    gl.uniform2f(u.uClick,state.clickX,state.clickY);gl.uniform1f(u.uRipple,(time-state.clickAt)/1400);
    gl.uniform3fv(u.uColor,state.color);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,6);
    state.canvas.dataset.hoverActive=String(state.targetHover>0);
  }
  let last=0;
  function tick(time){
    if(!document.hidden&&time-last>32){for(const state of instances)if(state.visible)draw(state,time);last=time;}
    if(!calm)requestAnimationFrame(tick);
  }
  document.querySelectorAll('canvas[data-ascii-src]').forEach(canvas=>create(canvas).catch(error=>{console.error('ASCII:',error.message);canvas.style.background=`center/contain no-repeat url("${new URL(canvas.dataset.asciiSrc,scriptBase).href}")`;}));
  addEventListener('brand-color',event=>{instances.forEach(state=>{state.color=event.detail.map(c=>c/255);if(calm)draw(state,performance.now());});});
  if(!calm)requestAnimationFrame(tick);
})();
