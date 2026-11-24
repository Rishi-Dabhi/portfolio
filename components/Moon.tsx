"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_position;
  void main() {
    v_position = a_position;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// An orthographic ray/sphere intersection gives each pixel a true 3D surface
// normal. LROC albedo + LOLA relief are sampled in lunar longitude/latitude.
const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 v_position;
  uniform sampler2D u_color;
  uniform sampler2D u_height;
  uniform float u_progress;
  uniform float u_rotation;
  const float PI = 3.14159265359;

  void main() {
    vec2 p = v_position / 0.975;
    float radius = dot(p, p);
    if (radius > 1.0) discard;
    vec3 normal = vec3(p, sqrt(max(0.0, 1.0 - radius)));
    float rotation = -0.025 + u_progress * 0.035 + u_rotation;
    vec2 uv = vec2(0.5 + atan(normal.x, normal.z) / (2.0 * PI) + rotation,
                   0.5 + asin(normal.y) / PI);
    vec3 albedo = texture2D(u_color, uv).rgb;
    vec2 texel = vec2(1.0 / 1024.0, 1.0 / 512.0);
    float dx = texture2D(u_height, uv + vec2(texel.x, 0.0)).r
             - texture2D(u_height, uv - vec2(texel.x, 0.0)).r;
    float dy = texture2D(u_height, uv + vec2(0.0, texel.y)).r
             - texture2D(u_height, uv - vec2(0.0, texel.y)).r;
    vec3 tangent = normalize(vec3(normal.z, 0.0, -normal.x));
    vec3 bitangent = cross(normal, tangent);
    vec3 reliefNormal = normalize(normal - 1.4 * dx * tangent - 1.4 * dy * bitangent);

    float phase = mix(0.045, 2.12, u_progress);
    vec3 sunlight = normalize(vec3(-sin(phase), 0.12, cos(phase)));
    float incidence = max(dot(reliefNormal, sunlight), 0.0);
    float emission = max(normal.z, 0.015);
    // A diffuse/Lommel-Seeliger blend suits the Moon's rough, powdery surface.
    float reflected = 0.35 * incidence + 0.65 * incidence / (incidence + emission + 0.001);
    vec3 linearColor = pow(albedo, vec3(2.2));
    vec3 lit = pow(linearColor * (0.0015 + reflected * 1.55), vec3(1.0 / 2.2));
    float edge = 1.0 - smoothstep(0.992, 1.0, radius);
    gl_FragColor = vec4(lit, edge);
  }
`;

type MoonRenderer = { draw: (progress: number, rotation: number) => void; dispose: () => void };

function createRenderer(canvas: HTMLCanvasElement): MoonRenderer | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  const anisotropy = gl.getExtension("EXT_texture_filter_anisotropic");

  const shaders: WebGLShader[] = [];
  const textures: WebGLTexture[] = [];
  const images: HTMLImageElement[] = [];
  let disposed = false;
  let loaded = 0;
  let lastProgress = 0;
  let lastRotation = 0;
  let lastDrawn = -1;
  let lastDrawnRotation = -1;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;

  function dispose() {
    disposed = true;
    images.forEach(image => { image.onload = null; image.onerror = null; });
    textures.forEach(texture => gl!.deleteTexture(texture));
    shaders.forEach(shader => gl!.deleteShader(shader));
    if (buffer) gl!.deleteBuffer(buffer);
    if (program) gl!.deleteProgram(program);
  }

  try {
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) throw new Error("Shader unavailable");
      shaders.push(shader);
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error("Moon shader compilation failed");
      return shader;
    }
    program = gl.createProgram();
    if (!program) throw new Error("WebGL program unavailable");
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Moon shader linking failed");
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const phase = gl.getUniformLocation(program, "u_progress");
    const longitude = gl.getUniformLocation(program, "u_rotation");

    function draw(progress: number, rotation: number) {
      lastProgress = progress;
      lastRotation = rotation;
      if (disposed || loaded !== 2 || !program || gl!.isContextLost()) return;
      // Match high-density displays instead of stretching a lower-resolution disc.
      const resolution = Math.min(1536, Math.max(128, Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 3))));
      const resized = canvas.width !== resolution || canvas.height !== resolution;
      if (!resized && lastDrawn === progress && lastDrawnRotation === rotation) return;
      if (resized) {
        canvas.width = resolution;
        canvas.height = resolution;
      }
      gl!.viewport(0, 0, resolution, resolution);
      gl!.useProgram(program);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(phase, progress);
      gl!.uniform1f(longitude, rotation);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      lastDrawn = progress;
      lastDrawnRotation = rotation;
      canvas.dataset.renderer = "webgl";
    }

    const colorMap = gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 4096
      ? "/moon/lroc-color-4k.jpg"
      : "/moon/lroc-color-2k.jpg";
    [colorMap, "/moon/lola-height-1k.jpg"].forEach((source, unit) => {
      const texture = gl.createTexture();
      if (!texture) throw new Error("Moon texture unavailable");
      textures.push(texture);
      const image = new Image();
      images.push(image);
      image.onload = () => {
        if (disposed || !program) return;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // Keep oblique surface detail clear near the curved edge of the Moon.
        if (anisotropy) {
          gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,
            Math.min(8, gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
        }
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.useProgram(program);
        gl.uniform1i(gl.getUniformLocation(program, unit === 0 ? "u_color" : "u_height"), unit);
        loaded += 1;
        draw(lastProgress, lastRotation);
      };
      image.onerror = () => { canvas.dataset.renderer = "fallback"; };
      image.src = source;
    });
    return { draw, dispose };
  } catch {
    dispose();
    return null;
  }
}

export default function Moon() {
  const orb = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = orb.current;
    const surface = canvas.current;
    const atlas = element?.closest<HTMLElement>(".celestial-atlas");
    if (!element || !surface || !atlas) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer = createRenderer(surface);
    let frame = 0;
    let start = 0;
    let distance = 220;
    let visible = false;
    let layoutDirty = true;
    let progress = 0;
    let rotation = 0;
    let lastTime: number | null = null;
    let lastPaint = -Infinity;
    let reducedMotion = motionPreference.matches;

    function update(time: number) {
      frame = 0;
      // A preference change can reach a queued frame before its change event.
      if (reducedMotion !== motionPreference.matches) {
        reducedMotion = motionPreference.matches;
        layoutDirty = true;
      }
      const spinning = visible && !document.hidden && !reducedMotion;
      // Rotate the mapped terrain once every 90 seconds; sunlight stays fixed.
      if (spinning && lastTime !== null) rotation = (rotation + (time - lastTime) / 90_000) % 1;
      lastTime = spinning ? time : null;
      const changed = layoutDirty;
      if (layoutDirty) {
        layoutDirty = false;
        const raw = reducedMotion ? 1 : Math.max(0, Math.min(1, (window.scrollY - start) / distance));
        progress = raw * raw * (3 - 2 * raw);
        // Both the chart and the target use the same 760-unit SVG coordinate space.
        // The canvas has a 2.5% margin, so its final visible radius is exactly 43.
        const finalScale = (86 / 760) / (0.46 * 0.975);
        element!.style.left = `${50 + (510 / 760 * 100 - 50) * progress}%`;
        element!.style.top = `${50 + (235 / 760 * 100 - 50) * progress}%`;
        element!.style.transform = `translate(-50%, -50%) scale(${1 + (finalScale - 1) * progress})`;
        element!.style.setProperty("--moon-progress", String(progress));
        element!.dataset.progress = progress.toFixed(3);
        atlas!.style.setProperty("--moon-progress", String(progress));
      }
      // Limit GPU work to 30fps while retaining immediate scroll updates.
      if (changed || time - lastPaint >= 1000 / 30) {
        renderer?.draw(progress, rotation);
        element!.style.setProperty("--moon-texture-position", `${50 + rotation * 200}%`);
        element!.dataset.rotation = rotation.toFixed(5);
        lastPaint = time;
      }
      if (spinning) schedule();
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function invalidate() { layoutDirty = true; schedule(); }
    function visibilityChanged() { lastTime = null; invalidate(); }
    function measure() {
      const bounds = atlas!.getBoundingClientRect();
      start = Math.max(0, bounds.top + window.scrollY - window.innerHeight * 0.55);
      distance = Math.max(165, Math.min(220, bounds.width * 0.27));
      invalidate();
    }
    function contextLost(event: Event) { event.preventDefault(); surface!.dataset.renderer = "fallback"; }
    function contextRestored() { renderer?.dispose(); renderer = createRenderer(surface!); invalidate(); }
    const observer = new ResizeObserver(measure);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visibilityChanged();
    });
    observer.observe(atlas);
    visibilityObserver.observe(element);
    document.addEventListener("visibilitychange", visibilityChanged);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    motionPreference.addEventListener("change", measure);
    surface.addEventListener("webglcontextlost", contextLost);
    surface.addEventListener("webglcontextrestored", contextRestored);
    measure();
    // Font loading changes the chart's position on small screens.
    let active = true;
    document.fonts.ready.then(() => { if (active) measure(); });

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", visibilityChanged);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", measure);
      motionPreference.removeEventListener("change", measure);
      surface.removeEventListener("webglcontextlost", contextLost);
      surface.removeEventListener("webglcontextrestored", contextRestored);
      renderer?.dispose();
    };
  }, []);

  return (
    <div ref={orb} className="moon-orb" aria-hidden="true">
      <canvas ref={canvas} className="moon-surface" data-renderer="fallback" />
      <span className="moon-fallback" />
    </div>
  );
}
