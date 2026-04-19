class Particle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#94a3b8';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.canvas.width) this.x = 0;
        else if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        else if (this.y < 0) this.y = this.canvas.height;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = 0.4;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = window.innerWidth < 768 ? 40 : 80;
        this.init();
        this.animate();

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.particles = [];
            this.init();
        });
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas, this.ctx));
        }
    }

    connect() {
        let opacityValue = 1;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                let dx = this.particles[a].x - this.particles[b].x;
                let dy = this.particles[a].y - this.particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    opacityValue = 1 - (distance/150);
                    this.ctx.strokeStyle = this.particles[a].color;
                    this.ctx.globalAlpha = opacityValue * 0.2;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();
        }
        this.connect();
        requestAnimationFrame(this.animate.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
