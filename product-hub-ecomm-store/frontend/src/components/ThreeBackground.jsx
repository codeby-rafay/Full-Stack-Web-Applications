import { useEffect, useRef } from "react";

export default function ThreeBackground({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    }
    resize();

    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const WARM = [
      "#f97316",
      "#fb923c",
      "#fdba74",
      "#fbbf24",
      "#fde68a",
      "#ea580c",
      "#d97706",
    ];

    class Orb {
      constructor() {
        this.reset(true);
      }
      reset() {
        const W = canvas.width,
          H = canvas.height;
        this.x = rand(0, W);
        this.y = rand(0, H);
        this.r = rand(70, 160) * dpr;
        this.vx = rand(-0.12, 0.12) * dpr;
        this.vy = rand(-0.1, 0.1) * dpr;
        this.alpha = rand(0.06, 0.14);
        this.color = pick(["#f97316", "#fbbf24", "#fb923c"]);
        this.pOff = rand(0, Math.PI * 2);
        this.pSpd = rand(0.003, 0.007);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        const W = canvas.width,
          H = canvas.height;
        if (this.x < -this.r) this.x = W + this.r;
        if (this.x > W + this.r) this.x = -this.r;
        if (this.y < -this.r) this.y = H + this.r;
        if (this.y > H + this.r) this.y = -this.r;
      }
      draw(t) {
        const pulse =
          1 + Math.sin(t * 0.001 * this.pSpd * 1000 + this.pOff) * 0.15;
        const r = this.r * pulse;
        const g = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          r,
        );
        g.addColorStop(0, this.color + "66");
        g.addColorStop(0.5, this.color + "28");
        g.addColorStop(1, this.color + "00");
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
      }
    }

    class Particle {
      constructor() {
        this.reset(true);
      }
      reset(init) {
        const W = canvas.width,
          H = canvas.height;
        this.x = rand(0, W);
        this.y = init ? rand(0, H) : H + rand(5, 20);
        this.r = rand(1.2, 4) * dpr;
        this.vy = rand(-0.6, -1.8) * dpr;
        this.vx = rand(-0.2, 0.2) * dpr;
        this.alpha = rand(0.3, 0.85);
        this.fade = rand(0.001, 0.003);
        this.color = pick(WARM);
        this.w = rand(0, Math.PI * 2);
        this.ws = rand(0.015, 0.035);
        this.wa = rand(0.3, 0.9) * dpr;
      }
      update() {
        this.w += this.ws;
        this.x += this.vx + Math.sin(this.w) * this.wa;
        this.y += this.vy;
        this.alpha -= this.fade;
        if (this.y < -10 || this.alpha <= 0) this.reset(false);
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    class Ring {
      constructor(off) {
        this.reset();
        this.r = this.maxR * (off || 0);
      }
      reset() {
        const W = canvas.width,
          H = canvas.height;
        this.x = rand(W * 0.05, W * 0.95);
        this.y = rand(H * 0.05, H * 0.95);
        this.r = rand(5, 15) * dpr;
        this.maxR = rand(55, 130) * dpr;
        this.spd = rand(0.4, 1.0) * dpr;
        this.alpha = rand(0.12, 0.3);
        this.color = pick(["#f97316", "#fb923c", "#fbbf24"]);
        this.lw = rand(0.8, 2) * dpr;
      }
      update() {
        this.r += this.spd;
        this.alpha -= 0.0018;
        if (this.r > this.maxR || this.alpha <= 0) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lw;
        ctx.stroke();
        ctx.restore();
      }
    }

    class Shape {
      constructor(i) {
        const W = canvas.width,
          H = canvas.height;
        this.type = ["bag", "tag", "star", "diamond", "hex"][i % 5];
        this.x = rand(W * 0.03, W * 0.97);
        this.y = rand(H * 0.05, H * 0.95);
        this.baseY = this.y;
        this.size = rand(14, 34) * dpr;
        this.rot = rand(0, Math.PI * 2);
        this.rs = rand(-0.012, 0.012);
        this.fa = rand(10, 26) * dpr;
        this.fs = rand(0.3, 0.9);
        this.fo = rand(0, Math.PI * 2);
        this.alpha = rand(0.1, 0.22);
        this.color = pick([
          "#f97316",
          "#ea580c",
          "#fb923c",
          "#fbbf24",
          "#d97706",
        ]);
      }
      update(t) {
        this.rot += this.rs;
        this.y = this.baseY + Math.sin(t * 0.001 * this.fs + this.fo) * this.fa;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2 * dpr;
        const s = this.size;
        if (this.type === "bag") {
          ctx.beginPath();
          ctx.roundRect(-s * 0.5, -s * 0.25, s, s * 0.85, s * 0.12);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, -s * 0.25, s * 0.22, Math.PI, 0);
          ctx.stroke();
        } else if (this.type === "tag") {
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.5);
          ctx.lineTo(s * 0.38, -s * 0.12);
          ctx.lineTo(s * 0.38, s * 0.42);
          ctx.lineTo(-s * 0.38, s * 0.42);
          ctx.lineTo(-s * 0.38, -s * 0.12);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, -s * 0.12, s * 0.09, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.55)";
          ctx.fill();
        } else if (this.type === "star") {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const o = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const inn = o + Math.PI / 5;
            if (i === 0)
              ctx.moveTo(Math.cos(o) * s * 0.5, Math.sin(o) * s * 0.5);
            else ctx.lineTo(Math.cos(o) * s * 0.5, Math.sin(o) * s * 0.5);
            ctx.lineTo(Math.cos(inn) * s * 0.2, Math.sin(inn) * s * 0.2);
          }
          ctx.closePath();
          ctx.fill();
        } else if (this.type === "diamond") {
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.5);
          ctx.lineTo(s * 0.36, 0);
          ctx.lineTo(0, s * 0.5);
          ctx.lineTo(-s * 0.36, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI * 2) / 6 - Math.PI / 6;
            if (i === 0)
              ctx.moveTo(Math.cos(a) * s * 0.46, Math.sin(a) * s * 0.46);
            else ctx.lineTo(Math.cos(a) * s * 0.46, Math.sin(a) * s * 0.46);
          }
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    class Ribbon {
      constructor() {
        this.reset(true);
      }
      reset(init) {
        const W = canvas.width,
          H = canvas.height;
        this.x = rand(0, W);
        this.y = init ? rand(0, H) : H + 30;
        this.w = rand(2, 5) * dpr;
        this.h = rand(20, 55) * dpr;
        this.vy = rand(-0.4, -1.2) * dpr;
        this.vx = rand(-0.25, 0.25) * dpr;
        this.rot = rand(0, Math.PI * 2);
        this.rs = rand(-0.045, 0.045);
        this.alpha = rand(0.12, 0.38);
        this.color = pick(WARM);
      }
      update() {
        this.y += this.vy;
        this.x += this.vx;
        this.rot += this.rs;
        this.alpha -= 0.0008;
        if (this.y < -60 || this.alpha <= 0) this.reset(false);
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = this.color;
        const w = this.w,
          h = this.h;
        ctx.beginPath();
        ctx.moveTo(-w * 0.5, -h * 0.5);
        ctx.bezierCurveTo(
          w * 1.8,
          -h * 0.25,
          -w * 1.8,
          h * 0.25,
          w * 0.5,
          h * 0.5,
        );
        ctx.bezierCurveTo(
          -w * 0.5,
          h * 0.5,
          -w * 0.5,
          -h * 0.5,
          -w * 0.5,
          -h * 0.5,
        );
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    const orbs = Array.from({ length: 6 }, () => new Orb());
    const particles = Array.from({ length: 110 }, () => new Particle());
    const rings = Array.from({ length: 9 }, (_, i) => new Ring(i / 9));
    const shapes = Array.from({ length: 20 }, (_, i) => new Shape(i));
    const ribbons = Array.from({ length: 28 }, () => new Ribbon());

    let raf;
    function loop(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach((o) => {
        o.update();
        o.draw(t);
      });
      rings.forEach((r) => {
        r.update();
        r.draw();
      });
      ribbons.forEach((r) => {
        r.update();
        r.draw();
      });
      shapes.forEach((s) => {
        s.update(t);
        s.draw();
      });
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    function handleResize() {
      resize();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
