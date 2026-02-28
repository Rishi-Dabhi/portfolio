"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─── Types ──────────────────────────────── */

interface Star {
  x: number;
  y: number;
  z: number; // depth layer 0‑1 (0 = far, 1 = near)
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  driftX: number;
  driftY: number;
}

interface GalaxyStar {
  angle: number;    // position along spiral
  dist: number;     // distance from center
  offset: number;   // perpendicular scatter
  size: number;
  alpha: number;
  color: string;
}

interface Galaxy {
  x: number;
  y: number;
  radius: number;       // overall size
  rotation: number;     // base rotation angle
  rotSpeed: number;     // rotation speed
  arms: number;         // number of spiral arms
  tightness: number;    // how tightly wound
  coreColor: string;
  armColor: string;
  dustColor: string;
  stars: GalaxyStar[];
  parallax: number;     // scroll parallax factor
  tilt: number;         // elliptical tilt (0 = face-on, close to 1 = edge-on)
}

/* ─── Palette keyed to scroll progress ──── */

const PALETTES = [
  // 0 – 0.15  Deep indigo sky (hero)
  { bg: [5, 7, 12], accent: [30, 232, 135], nebula: "rgba(60,90,220,0.04)" },
  // 0.15 – 0.35  Cosmic teal (about / skills)
  { bg: [4, 10, 18], accent: [16, 200, 160], nebula: "rgba(30,200,160,0.035)" },
  // 0.35 – 0.55  Deep space (experience)
  { bg: [3, 6, 14], accent: [80, 140, 255], nebula: "rgba(80,140,255,0.03)" },
  // 0.55 – 0.75  Aurora green (education / projects)
  { bg: [4, 8, 10], accent: [30, 232, 135], nebula: "rgba(30,232,135,0.035)" },
  // 0.75 – 1.0  Warm nebula (contact / footer)
  { bg: [8, 5, 14], accent: [160, 100, 255], nebula: "rgba(160,100,255,0.03)" },
];

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function getPalette(progress: number) {
  const segments = PALETTES.length - 1;
  const scaled = progress * segments;
  const idx = Math.min(Math.floor(scaled), segments - 1);
  const t = scaled - idx;
  const a = PALETTES[idx];
  const b = PALETTES[idx + 1];
  return {
    bg: lerpColor(a.bg as [number, number, number], b.bg as [number, number, number], t),
    accent: lerpColor(a.accent as [number, number, number], b.accent as [number, number, number], t),
    nebula: a.nebula, // snap
  };
}

/* ─── Component ──────────────────────────── */

const STAR_COUNT = 420;
const NEBULA_COUNT = 5;
const GALAXY_COUNT = 3;
const GALAXY_STARS_PER = 280;

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const galaxiesRef = useRef<Galaxy[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const scrollRef = useRef(0);
  const frameRef = useRef(0);
  const dimRef = useRef({ w: 0, h: 0 });

  /* ── Create stars ── */
  const generateStars = useCallback((w: number, h: number): Star[] => {
    const stars: Star[] = [];
    const colors = [
      "255,255,255",
      "200,220,255",
      "255,230,200",
      "180,210,255",
      "30,232,135",
    ];
    for (let i = 0; i < STAR_COUNT; i++) {
      const z = Math.random();
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h * 3, // stars across 3× viewport for scrolling
        z,
        radius: 0.4 + z * 1.6,
        baseAlpha: 0.25 + z * 0.65,
        twinkleSpeed: 0.3 + Math.random() * 2.5,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return stars;
  }, []);

  /* ── Create nebulae ── */
  const generateNebulae = useCallback((w: number, h: number): Nebula[] => {
    const neb: Nebula[] = [];
    const colors = [
      "30,232,135",
      "80,140,255",
      "160,100,255",
      "16,200,160",
      "60,90,220",
    ];
    for (let i = 0; i < NEBULA_COUNT; i++) {
      neb.push({
        x: Math.random() * w,
        y: Math.random() * h * 3,
        radius: 150 + Math.random() * 350,
        color: colors[i % colors.length],
        alpha: 0.012 + Math.random() * 0.025,
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.1,
      });
    }
    return neb;
  }, []);

  /* ── Create galaxies ── */
  const generateGalaxies = useCallback((w: number, h: number): Galaxy[] => {
    const galaxies: Galaxy[] = [];
    const configs = [
      // Large galaxy upper-right area
      { xFrac: 0.75, yFrac: 0.3, size: 220, arms: 2, tilt: 0.35, core: "200,220,255", arm: "140,170,255", dust: "60,80,180" },
      // Medium galaxy left-center
      { xFrac: 0.18, yFrac: 1.2, size: 160, arms: 3, tilt: 0.5, core: "255,230,200", arm: "255,200,150", dust: "180,100,60" },
      // Small galaxy bottom-right
      { xFrac: 0.65, yFrac: 2.1, size: 130, arms: 2, tilt: 0.2, core: "180,200,255", arm: "120,160,255", dust: "80,60,160" },
    ];

    for (let g = 0; g < GALAXY_COUNT; g++) {
      const cfg = configs[g];
      const stars: GalaxyStar[] = [];
      const starColors = [
        "255,255,255",
        "200,220,255",
        "255,230,200",
        cfg.arm,
        cfg.core,
      ];

      for (let i = 0; i < GALAXY_STARS_PER; i++) {
        const armIdx = Math.floor(Math.random() * cfg.arms);
        const armAngle = (armIdx / cfg.arms) * Math.PI * 2;
        const dist = Math.random();
        const spiralAngle = dist * 3.5; // how far along the spiral
        const scatter = (Math.random() - 0.5) * 2 * (0.08 + dist * 0.15);

        stars.push({
          angle: armAngle + spiralAngle,
          dist: dist * cfg.size,
          offset: scatter * cfg.size,
          size: 0.3 + Math.random() * 1.2 * (1 - dist * 0.5),
          alpha: 0.3 + Math.random() * 0.6 * (1 - dist * 0.3),
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }

      galaxies.push({
        x: w * cfg.xFrac,
        y: h * cfg.yFrac,
        radius: cfg.size,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: 0.02 + Math.random() * 0.03,
        arms: cfg.arms,
        tightness: 0.3 + Math.random() * 0.2,
        coreColor: cfg.core,
        armColor: cfg.arm,
        dustColor: cfg.dust,
        stars,
        parallax: 0.3 + g * 0.2,
        tilt: cfg.tilt,
      });
    }
    return galaxies;
  }, []);

  /* ── Spawn shooting star ── */
  const spawnShooting = useCallback((w: number, h: number): ShootingStar => {
    const angle = Math.PI / 6 + Math.random() * (Math.PI / 4);
    const speed = 4 + Math.random() * 6;
    return {
      x: Math.random() * w,
      y: Math.random() * h * 0.4 - scrollRef.current * 0.5,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 40 + Math.random() * 40,
      size: 1 + Math.random() * 1.5,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    /* ── Resize ── */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimRef.current = { w, h };

      // regenerate on resize
      starsRef.current = generateStars(w, h);
      nebulaeRef.current = generateNebulae(w, h);
      galaxiesRef.current = generateGalaxies(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Scroll ── */
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ── Animation loop ── */
    let raf: number;
    let lastShoot = 0;

    const draw = (time: number) => {
      const { w, h } = dimRef.current;
      const progress = scrollRef.current;
      const palette = getPalette(progress);

      // Background gradient
      const bg = palette.bg;
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `rgb(${bg[0]},${bg[1]},${bg[2]})`);
      grad.addColorStop(1, `rgb(${Math.max(0, bg[0] - 2)},${Math.max(0, bg[1] - 2)},${Math.max(0, bg[2] - 3)})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const t = time * 0.001;
      const scrollOffset = progress * h * 2; // parallax scroll range

      /* ── Nebulae ── */
      for (const neb of nebulaeRef.current) {
        const ny = neb.y - scrollOffset * 0.3 + Math.sin(t * 0.2 + neb.x) * 20;
        const nx = neb.x + Math.sin(t * neb.driftX) * 30;
        const visible = ny > -neb.radius && ny < h + neb.radius;
        if (!visible) continue;

        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, neb.radius);
        g.addColorStop(0, `rgba(${neb.color},${neb.alpha * (0.6 + 0.4 * Math.sin(t * 0.3))})`);
        g.addColorStop(0.5, `rgba(${neb.color},${neb.alpha * 0.3})`);
        g.addColorStop(1, `rgba(${neb.color},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(nx - neb.radius, ny - neb.radius, neb.radius * 2, neb.radius * 2);
      }

      /* ── Galaxies ── */
      for (const gal of galaxiesRef.current) {
        const gy = gal.y - scrollOffset * gal.parallax;
        const gx = gal.x;

        // Skip if not visible
        if (gy < -gal.radius * 2 || gy > h + gal.radius * 2) continue;

        const rot = gal.rotation + t * gal.rotSpeed;
        const cosT = Math.cos(gal.tilt * 0.8); // elliptical compression

        ctx.save();
        ctx.translate(gx, gy);

        // Galactic core glow (multi-layered)
        const coreSize = gal.radius * 0.35;
        const core1 = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize);
        core1.addColorStop(0, `rgba(${gal.coreColor},0.15)`);
        core1.addColorStop(0.3, `rgba(${gal.coreColor},0.06)`);
        core1.addColorStop(0.7, `rgba(${gal.armColor},0.02)`);
        core1.addColorStop(1, `rgba(${gal.armColor},0)`);
        ctx.fillStyle = core1;
        ctx.beginPath();
        ctx.ellipse(0, 0, coreSize, coreSize * cosT, rot * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Bright inner core
        const innerCore = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize * 0.3);
        innerCore.addColorStop(0, `rgba(255,255,255,0.12)`);
        innerCore.addColorStop(0.5, `rgba(${gal.coreColor},0.06)`);
        innerCore.addColorStop(1, `rgba(${gal.coreColor},0)`);
        ctx.fillStyle = innerCore;
        ctx.beginPath();
        ctx.ellipse(0, 0, coreSize * 0.3, coreSize * 0.3 * cosT, rot * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Spiral arm dust lanes (drawn as arcs)
        ctx.globalAlpha = 0.025 + 0.015 * Math.sin(t * 0.2);
        for (let arm = 0; arm < gal.arms; arm++) {
          const baseAngle = (arm / gal.arms) * Math.PI * 2 + rot;
          const pts = 60;
          ctx.beginPath();
          for (let p = 0; p < pts; p++) {
            const frac = p / pts;
            const r = frac * gal.radius;
            const spiralAngle = baseAngle + frac * 3.5;
            const px = Math.cos(spiralAngle) * r;
            const py = Math.sin(spiralAngle) * r * cosT;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = `rgba(${gal.armColor},0.5)`;
          ctx.lineWidth = 8 + Math.sin(t * 0.3 + arm) * 3;
          ctx.filter = "blur(6px)";
          ctx.stroke();

          // Second thinner brighter line
          ctx.strokeStyle = `rgba(${gal.coreColor},0.3)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.filter = "none";
        ctx.globalAlpha = 1;

        // Dust halo around arms
        for (let arm = 0; arm < gal.arms; arm++) {
          const baseAngle = (arm / gal.arms) * Math.PI * 2 + rot;
          for (let d = 0; d < 8; d++) {
            const frac = 0.2 + (d / 8) * 0.7;
            const r = frac * gal.radius;
            const spiralAngle = baseAngle + frac * 3.5;
            const dx = Math.cos(spiralAngle) * r + (Math.random() - 0.5) * 30;
            const dy = Math.sin(spiralAngle) * r * cosT + (Math.random() - 0.5) * 20;
            const dustR = 20 + Math.random() * 40;
            const dustG = ctx.createRadialGradient(dx, dy, 0, dx, dy, dustR);
            dustG.addColorStop(0, `rgba(${gal.dustColor},0.018)`);
            dustG.addColorStop(1, `rgba(${gal.dustColor},0)`);
            ctx.fillStyle = dustG;
            ctx.fillRect(dx - dustR, dy - dustR, dustR * 2, dustR * 2);
          }
        }

        // Galaxy stars along spiral arms
        for (const gs of gal.stars) {
          const angle = gs.angle + rot;
          const sx = Math.cos(angle) * gs.dist + Math.cos(angle + Math.PI / 2) * gs.offset;
          const sy = (Math.sin(angle) * gs.dist + Math.sin(angle + Math.PI / 2) * gs.offset) * cosT;

          const twinkle = 0.6 + 0.4 * Math.sin(t * (1.5 + gs.dist * 0.01) + gs.angle);
          const a = gs.alpha * twinkle;

          // Glow for brighter galaxy stars
          if (gs.size > 0.9) {
            const gr = gs.size * 3;
            const gg = ctx.createRadialGradient(sx, sy, 0, sx, sy, gr);
            gg.addColorStop(0, `rgba(${gs.color},${a * 0.4})`);
            gg.addColorStop(1, `rgba(${gs.color},0)`);
            ctx.fillStyle = gg;
            ctx.fillRect(sx - gr, sy - gr, gr * 2, gr * 2);
          }

          ctx.beginPath();
          ctx.arc(sx, sy, gs.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${gs.color},${a})`;
          ctx.fill();
        }

        ctx.restore();
      }

      /* ── Stars ── */
      const accent = palette.accent;
      for (const star of starsRef.current) {
        const parallax = 0.2 + star.z * 0.8; // far stars move slower
        const sy = star.y - scrollOffset * parallax;

        // wrap vertically
        const totalH = h * 3;
        const wrappedY = ((sy % totalH) + totalH) % totalH - h;
        if (wrappedY < -4 || wrappedY > h + 4) continue;

        const twinkle = Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.baseAlpha * (0.5 + 0.5 * twinkle);

        // Blend star color toward current accent slightly
        ctx.beginPath();
        ctx.arc(star.x, wrappedY, star.radius, 0, Math.PI * 2);

        // Glow for larger/nearer stars
        if (star.z > 0.7 && star.radius > 1.2) {
          const glowRadius = star.radius * 3;
          const glow = ctx.createRadialGradient(
            star.x, wrappedY, 0,
            star.x, wrappedY, glowRadius
          );
          glow.addColorStop(0, `rgba(${star.color},${alpha * 0.9})`);
          glow.addColorStop(0.4, `rgba(${star.color},${alpha * 0.2})`);
          glow.addColorStop(1, `rgba(${star.color},0)`);
          ctx.fillStyle = glow;
          ctx.fillRect(
            star.x - glowRadius,
            wrappedY - glowRadius,
            glowRadius * 2,
            glowRadius * 2
          );
          ctx.beginPath();
          ctx.arc(star.x, wrappedY, star.radius, 0, Math.PI * 2);
        }

        ctx.fillStyle = `rgba(${star.color},${alpha})`;
        ctx.fill();
      }

      /* ── Accent glow that follows scroll ── */
      const glowX = w * (0.3 + 0.4 * Math.sin(t * 0.1));
      const glowY = h * 0.4;
      const accentGlow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 400);
      accentGlow.addColorStop(0, `rgba(${accent[0]},${accent[1]},${accent[2]},0.03)`);
      accentGlow.addColorStop(1, `rgba(${accent[0]},${accent[1]},${accent[2]},0)`);
      ctx.fillStyle = accentGlow;
      ctx.fillRect(glowX - 400, glowY - 400, 800, 800);

      /* ── Shooting stars ── */
      if (time - lastShoot > 3000 + Math.random() * 5000) {
        shootingRef.current.push(spawnShooting(w, h));
        lastShoot = time;
      }

      shootingRef.current = shootingRef.current.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const lifeRatio = s.life / s.maxLife;
        const a = lifeRatio < 0.15 ? lifeRatio / 0.15 : 1 - (lifeRatio - 0.15) / 0.85;

        // Trail
        const tailLen = 30;
        const g = ctx.createLinearGradient(
          s.x, s.y,
          s.x - s.vx * tailLen * 0.3,
          s.y - s.vy * tailLen * 0.3
        );
        g.addColorStop(0, `rgba(255,255,255,${a * 0.8})`);
        g.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - s.vx * tailLen * 0.3,
          s.y - s.vy * tailLen * 0.3
        );
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a * 0.9})`;
        ctx.fill();

        return s.life < s.maxLife;
      });

      /* ── Subtle grid overlay tied to accent ── */
      ctx.strokeStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},0.015)`;
      ctx.lineWidth = 0.5;
      const gridSize = 64;
      const gridOffY = -(scrollOffset * 0.08) % gridSize;
      for (let gx = 0; gx < w; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = gridOffY; gy < h; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      frameRef.current = raf;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [generateStars, generateNebulae, generateGalaxies, spawnShooting]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
