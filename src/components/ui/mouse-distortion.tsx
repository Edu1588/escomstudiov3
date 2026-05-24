import React, { useEffect, useRef } from 'react';

export const MouseDistortion = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    // Try WebGL 1
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true }) as WebGLRenderingContext 
            || canvas.getContext('experimental-webgl', { antialias: true, alpha: true }) as WebGLRenderingContext;

    if (!gl) {
      console.warn("WebGL not supported, falling back to static image");
      const img = document.createElement('img');
      img.src = 'https://res.cloudinary.com/djw0tqmiw/image/upload/v1779483539/upbk0qco7n4axl66yilf.png';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'center 30%';
      container.innerHTML = '';
      container.appendChild(img);
      return () => {
        if (img.parentNode) img.parentNode.removeChild(img);
      };
    }

    // Set real size
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Shaders
    const vsSource = `
      attribute vec2 aPosition;
      attribute vec2 aUv;
      varying vec2 vUv;
      void main() {
        vUv = aUv;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uImageRes;

      void main() {
        vec2 uv = vUv;
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        vec2 mouse = uMouse;
        
        float dist = length((uv - mouse) * aspect);
        
        float radius = 0.35;
        float strength = 0.01;
        
        vec2 distortedUv = uv;
        if (dist < radius) {
            float t = dist / radius;
            float smoothT = smoothstep(1.0, 0.0, t);
            vec2 dir = normalize(uv - mouse);
            distortedUv += dir * strength * smoothT * sin(dist * 12.0 - uTime * 4.0);
        }

        vec2 s = uResolution;
        vec2 i = uImageRes;
        float rs = s.x / s.y;
        float ri = i.x / i.y;
        
        vec2 newScale = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
        
        vec2 offset = vec2((newScale.x - s.x) / 2.0, (newScale.y - s.y) * 0.3) / newScale;
        vec2 finalUv = distortedUv * s / newScale + offset;

        // basic bounds check to avoid smearing outside texture
        if(finalUv.x < 0.0 || finalUv.x > 1.0 || finalUv.y < 0.0 || finalUv.y > 1.0) {
            gl_FragColor = vec4(0.0);
            return;
        }

        vec4 texColor = texture2D(uTexture, finalUv);
        
        float lightGlow = smoothstep(radius*0.5, 0.0, dist) * 0.03;
        texColor.rgb += vec3(lightGlow);

        gl_FragColor = texColor;
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource)!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)!;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Quad data
    const positions = new Float32Array([
      -1, -1,   0, 0,
       1, -1,   1, 0,
      -1,  1,   0, 1,
       1,  1,   1, 1,
    ]);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0);

    const aUv = gl.getAttribLocation(program, "aUv");
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 16, 8);

    // Uniforms
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uImageRes = gl.getUniformLocation(program, "uImageRes");
    const uTexture = gl.getUniformLocation(program, "uTexture");

    // Texture
    const texture = gl.createTexture();
    const image = new Image();
    image.crossOrigin = 'anonymous';
    let imageLoaded = false;
    
    // Default image res until loaded to avoid div 0
    gl.uniform2f(uImageRes, 1920, 1080);

    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform2f(uImageRes, image.width, image.height);
      imageLoaded = true;
    };
    image.src = 'https://res.cloudinary.com/djw0tqmiw/image/upload/v1779483539/upbk0qco7n4axl66yilf.png';

    // State
    const targetMouse = { x: 0.5, y: 0.5 };
    const currentMouse = { x: 0.5, y: 0.5 };
    let startTime = performance.now();
    let animationFrameId: number;

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', onResize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / height;
    };
    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (!imageLoaded) return;

      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;

      const time = (performance.now() - startTime) * 0.001;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
      gl.uniform2f(uResolution, width, height);
      gl.uniform1f(uTime, time);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uTexture, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      gl.deleteTexture(texture);
      gl.deleteBuffer(vbo);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1, pointerEvents: 'none' }}
    />
  );
};

