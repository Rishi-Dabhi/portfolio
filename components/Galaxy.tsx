"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Galaxy() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;

    function updatePosition() {
      frame = 0;
      const bounds = element!.getBoundingClientRect();
      const offset = motionPreference.matches ? 0 : Math.max(-18, Math.min(18, (window.innerHeight * 0.5 - bounds.top - bounds.height * 0.5) * 0.055));
      element!.style.setProperty("--galaxy-offset", `${offset.toFixed(2)}px`);
    }
    function schedulePosition() {
      if (visible && !frame) frame = requestAnimationFrame(updatePosition);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      element.dataset.visible = String(visible);
      if (visible) schedulePosition();
    }, { rootMargin: "80px" });
    observer.observe(element);
    window.addEventListener("scroll", schedulePosition, { passive: true });
    window.addEventListener("resize", schedulePosition, { passive: true });
    motionPreference.addEventListener("change", updatePosition);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedulePosition);
      window.removeEventListener("resize", schedulePosition);
      motionPreference.removeEventListener("change", updatePosition);
    };
  }, []);

  return (
    <div
      ref={scene}
      className="galaxy-interlude container"
      aria-hidden="true"
      style={{ position: "relative", height: "clamp(240px, 32vw, 420px)", overflow: "hidden", background: "transparent" }}
    >
      <div className="galaxy-parallax" style={{ position: "absolute", inset: 0 }}>
        <Image
          src="/galaxy/spiral.svg"
          alt=""
          width={1200}
          height={420}
          unoptimized
          className="galaxy-artwork"
          style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", background: "transparent", animationDuration: "90s" }}
          onError={event => { event.currentTarget.style.visibility = "hidden"; }}
        />
      </div>
      <span className="galaxy-registration galaxy-registration-left" />
      <span className="galaxy-registration galaxy-registration-right" />
    </div>
  );
}
