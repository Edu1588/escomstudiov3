class Starfield {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = {
            starColor: options.starColor || 'rgba(255,255,255,1)',
            bgColor: options.bgColor || 'rgba(0,0,0,1)',
            speed: options.speed || 1,
            quantity: options.quantity || 512,
            opacity: options.opacity || 0.1,
            warpFactor: options.warpFactor || 10,
            hyperspace: options.hyperspace || false,
            mouseAdjust: options.mouseAdjust || false,
            easing: options.easing || 1
        };
        this.sd = { w: 0, h: 0, x: 0, y: 0, z: 0, star: { arr: [], colorRatio: 0 }, cw: 0, ch: 0 };
        this.cursor = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.running = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        if(this.options.mouseAdjust) {
            window.addEventListener('mousemove', (e) => {
                this.cursor.x = e.clientX;
                this.cursor.y = e.clientY;
            });
        }
    }
    bigBang() {
        this.sd.star.arr = Array.from({ length: this.options.quantity }, () => [
            Math.random() * this.sd.w * 2 - this.sd.x * 2,
            Math.random() * this.sd.h * 2 - this.sd.y * 2,
            Math.round(Math.random() * this.sd.z),
            0, 0, 0, 0, true
        ]);
    }
    resize() {
        let parent = this.canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        this.sd.w = parent.clientWidth;
        this.sd.h = parent.clientHeight;
        this.sd.x = this.sd.w / 2;
        this.sd.y = this.sd.h / 2;
        this.sd.z = (this.sd.w + this.sd.h) / 2;
        this.sd.star.colorRatio = 1 / this.sd.z;
        this.canvas.width = this.sd.w * dpr;
        this.canvas.height = this.sd.h * dpr;
        this.ctx.scale(dpr, dpr);
        if (!this.sd.star.arr.length) {
            this.bigBang();
        } else {
            const rw = this.sd.w / this.sd.cw || 1;
            const rh = this.sd.h / this.sd.ch || 1;
            const ratio = this.options.quantity / 2;
            this.sd.star.arr.forEach(star => {
                star[0] *= rw;
                star[1] *= rh;
                star[3] = this.sd.x + (star[0] / star[2]) * ratio;
                star[4] = this.sd.y + (star[1] / star[2]) * ratio;
            });
        }
        this.sd.cw = this.sd.w;
        this.sd.ch = this.sd.h;
    }
    update() {
        this.mouse.x = (this.cursor.x - this.sd.x) / this.options.easing;
        this.mouse.y = (this.cursor.y - this.sd.y) / this.options.easing;
        const compSpeed = this.options.hyperspace ? this.options.speed * this.options.warpFactor : this.options.speed;
        const ratio = this.options.quantity / 2;
        this.sd.star.arr.forEach(star => {
            star[7] = true;
            star[5] = star[3];
            star[6] = star[4];
            star[0] += this.mouse.x >> 4;
            if (star[0] > this.sd.x << 1) { star[0] -= this.sd.w << 1; star[7] = false; }
            if (star[0] < -this.sd.x << 1) { star[0] += this.sd.w << 1; star[7] = false; }
            star[1] += this.mouse.y >> 4;
            if (star[1] > this.sd.y << 1) { star[1] -= this.sd.h << 1; star[7] = false; }
            if (star[1] < -this.sd.y << 1) { star[1] += this.sd.h << 1; star[7] = false; }
            star[2] -= compSpeed;
            if (star[2] > this.sd.z) { star[2] -= this.sd.z; star[7] = false; }
            if (star[2] < 0) { star[2] += this.sd.z; star[7] = false; }
            star[3] = this.sd.x + (star[0] / star[2]) * ratio;
            star[4] = this.sd.y + (star[1] / star[2]) * ratio;
        });
    }
    draw() {
        this.ctx.fillStyle = this.options.hyperspace ? `rgba(0,0,0,${this.options.opacity})` : this.options.bgColor;
        if(this.options.hyperspace && this.options.bgColor !== 'rgba(0,0,0,1)' && this.options.bgColor !== '#000000') {
           this.ctx.fillStyle = this.options.bgColor.replace('1)', `${this.options.opacity})`);
        }
        this.ctx.fillRect(0, 0, this.sd.w, this.sd.h);
        this.ctx.strokeStyle = this.options.starColor;
        this.sd.star.arr.forEach(star => {
            if (star[5] > 0 && star[5] < this.sd.w && star[6] > 0 && star[6] < this.sd.h && star[7]) {
                this.ctx.lineWidth = (1 - this.sd.star.colorRatio * star[2]) * 2;
                this.ctx.beginPath();
                this.ctx.moveTo(star[5], star[6]);
                this.ctx.lineTo(star[3], star[4]);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        });
    }
    animate() {
        if(!this.running) return;
        this.update();
        this.draw();
        this.rafId = requestAnimationFrame(() => this.animate());
    }
    start() {
        if(this.running) return;
        this.running = true;
        this.cursor.x = this.sd.x;
        this.cursor.y = this.sd.y;
        this.animate();
    }
    stop() {
        this.running = false;
        cancelAnimationFrame(this.rafId);
    }
}
window.Starfield = Starfield;
