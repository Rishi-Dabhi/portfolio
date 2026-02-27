"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";

/* ─── Data ───────────────────────────────── */

const skills = [
  "Python", "C++", "C", "Java", "JavaScript", "TypeScript",
  "Rust", "React", "Next.js", "Django", "FastAPI", "Spring Boot",
  "TensorFlow", "PyTorch", "scikit-learn", "Docker",
  "PostgreSQL", "MongoDB", "Neo4j", "Azure", "Git", "CI/CD",
  "Agile Methodologies", "FPGA", "Agentic AI", "LangGraph",
];

const skillsRow1 = skills.slice(0, Math.ceil(skills.length / 2));
const skillsRow2 = skills.slice(Math.ceil(skills.length / 2));

const shredParticles = [
  { w: 4, h: 14, delay: 0, dur: 1.5, y: 8, rot: 45 },
  { w: 3, h: 10, delay: 0.22, dur: 1.8, y: 16, rot: -30 },
  { w: 5, h: 18, delay: 0.44, dur: 1.3, y: 25, rot: 60 },
  { w: 2, h: 8, delay: 0.66, dur: 2.0, y: 33, rot: -75 },
  { w: 6, h: 12, delay: 0.88, dur: 1.4, y: 42, rot: 20 },
  { w: 3, h: 16, delay: 1.1, dur: 1.7, y: 50, rot: -50 },
  { w: 4, h: 11, delay: 1.32, dur: 1.6, y: 58, rot: 80 },
  { w: 5, h: 20, delay: 1.54, dur: 1.2, y: 67, rot: -15 },
  { w: 2, h: 9, delay: 1.76, dur: 1.9, y: 75, rot: 55 },
  { w: 7, h: 13, delay: 1.98, dur: 1.5, y: 83, rot: -40 },
  { w: 3, h: 15, delay: 2.2, dur: 1.3, y: 90, rot: 70 },
  { w: 4, h: 10, delay: 2.42, dur: 1.6, y: 95, rot: -65 },
];

const projects = [
  {
    title: "RentRadar",
    stack: ["FastAPI", "LangGraph", "Next.js"],
    summary:
      "AI-powered property valuation with market insights, sustainability metrics, and geospatial heatmaps.",
  },
  {
    title: "MultiMind AI",
    stack: ["React", "FastAPI", "Neo4j", "Stripe"],
    summary:
      "Multi-LLM platform with council workflow, graph persistence, secure auth, and subscriptions.",
  },
  {
    title: "E-Commerce Platform",
    stack: ["Spring Boot", "React", "PostgreSQL"],
    summary:
      "Full-stack commerce app with manager dashboard, secure CRUD workflows, and checkout flow.",
  },
  {
    title: "CMS Automation Testing",
    stack: ["Python", "Docker", "CI/CD"],
    summary:
      "Automated validation for 200+ FPGA boards; reduced test duration by 40%.",
  },
  {
    title: "Remote Motion Tracking",
    stack: ["Python", "Raspberry Pi", "UDP/TCP"],
    summary:
      "Distributed motion-tracking system with remote capture and networked processing.",
  },
  {
    title: "TrustIt-AI",
    stack: ["FastAPI", "React", "Agentic AI"],
    summary:
      "Fact-checking agent system with automated query generation and cross-reference analysis.",
  },
  {
    title: "Skin Disease Classifier",
    stack: ["TensorFlow", "Vue.js", "Flask"],
    summary:
      "CNN-based skin-disease classification system with a Vue.js frontend and Flask backend.",
  },
  {
    title: "AI Calorie Tracker",
    stack: ["Next.js", "TypeScript", "MongoDB", "LLaVA"],
    summary:
      "AI-powered calorie-tracking web app using Hugging Face’s LLaVA vision-language model.",
  },
  {
    title: "Multiplayer Chess",
    stack: ["React", "FastAPI", "WebSockets"],
    summary:
      "Real-time multiplayer chess with WebSocket sync, legal move validation, and multi-room support.",
  },
  {
    title: "Banking & Marketing Software",
    stack: ["Java", "Swing", "OOP"],
    summary:
      "GUI-based banking and marketing system with customer onboarding, account management, and integrated payments.",
  },
  {
    title: "Oven Control System",
    stack: ["C", "PIC16F1937", "MPLAB"],
    summary:
      "Microcontroller-based oven control with temperature sensing, door detection, keypad/LCD interface, and sensor integration.",
  },
  {
    title: "Project Retriever",
    stack: ["Arduino", "mBlock", "Robotics"],
    summary:
      "Fully autonomous robot that detects, picks up, and retrieves objects within a defined area using Makeblock kit.",
  },
];

const experience = [
  {
    role: "Software Engineer",
    company: "CERN",
    period: "Jul 2024 — Sep 2024",
    bullets: [
      "Built ANN pipeline (TensorFlow/Keras) with 93% accuracy in 5-class jet classification.",
      "Optimized FPGA deployment using HLS4ML and reduced resource usage by 30%.",
      "Automated validation for 200+ FPGA boards; reduced test duration by 40%.",
    ],
  },
  {
    role: "Software Engineering Intern",
    company: "Johnson Controls",
    period: "Jul 2023 — Jun 2024",
    bullets: [
      "Developed performance-critical C++ software with Jenkins-based CI workflows.",
      "Built Python network analysis tooling that reduced manual log review by ~70%.",
    ],
  },
  {
    role: "Summer Research Intern",
    company: "Brunel University London",
    period: "Jun 2022 — Sept 2022",
    bullets: [
      "Developed an ML pipeline to process and analyze a large text corpus for emotion prediction and \
      topic modelling using NLTK, LDA and clustering.",
      "Implemented an emotion prediction model achieving 86% accuracy.",
    ],
  }
];

/* ─── Animation helpers ──────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 28 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, amount: 0.2 } as const,
  transition: { duration: 0.55, ease: "easeOut" as const },
};

/* ─── Spotlight Card ─────────────────────── */

function ProjectCard({
  number,
  title,
  stack,
  summary,
  index,
}: {
  number: string;
  title: string;
  stack: string[];
  summary: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rawRx = useMotionValue(0);
  const rawRy = useMotionValue(0);
  const rx = useSpring(rawRx, { stiffness: 180, damping: 22 });
  const ry = useSpring(rawRy, { stiffness: 180, damping: 22 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rawRx.set(-(y - rect.height / 2) / 20);
    rawRy.set((x - rect.width / 2) / 20);
    mouseX.set(x);
    mouseY.set(y);
  }

  function onLeave() {
    rawRx.set(0);
    rawRy.set(0);
  }

  const spotlight = useMotionTemplate`radial-gradient(
    300px circle at ${mouseX}px ${mouseY}px,
    rgba(30, 232, 135, 0.06),
    transparent 80%
  )`;

  return (
    <motion.article
      ref={ref}
      className="project-card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        transformPerspective: 800,
      }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <motion.div className="project-spotlight" style={{ background: spotlight }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <span className="project-number">{number}</span>
        <h3 className="project-title">{title}</h3>
        <div className="project-stack">
          {stack.map((tag) => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>
        <p className="project-summary">{summary}</p>
      </div>
    </motion.article>
  );
}

/* ─── Page ───────────────────────────────── */

const INITIAL_PROJECTS = 6;
const LOAD_STEP = 3;

export default function Home() {
  const { scrollYProgress } = useScroll();
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PROJECTS);

  const showMore = () =>
    setVisibleCount((c) => Math.min(c + LOAD_STEP, projects.length));
  const showLess = () => setVisibleCount(INITIAL_PROJECTS);

  return (
    <>
      {/* Background effects */}
      <div className="bg-grid" />
      <motion.div className="bg-glow bg-glow--1" style={{ y: glowY }} />
      <div className="bg-glow bg-glow--2" />
      <div className="bg-glow bg-glow--3" />

      <Navbar />

      <main>
        {/* ─── Hero ──────────────────────── */}
        <section className="hero" id="home">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="hero-label">
                <span className="pulse-dot" />
                Software Engineer
              </p>
            </motion.div>

            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              Hi, I'm Rishi Dabhi ...
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
            >
              Software Engineer with industry experience at{" "}
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>CERN</strong>{" "}
              and{" "}
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>
                Johnson Controls
              </strong>
              , building production-grade full-stack, Agentic AI and ML systems.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a href="#projects" className="btn btn-primary">
                View Projects ↓
              </a>
              <Link
                href="https://github.com/Rishi-Dabhi"
                className="btn btn-secondary"
                target="_blank"
              >
                GitHub ↗
              </Link>
              <Link
                href="https://www.linkedin.com/in/rishi-dabhi-9099b0199/"
                className="btn btn-secondary"
                target="_blank"
              >
                LinkedIn ↗
              </Link>
              <Link
                href="https://leetcode.com/u/TarnishedSoul/"
                className="btn btn-secondary"
                target="_blank"
              >
                LeetCode ↗
              </Link>
            </motion.div>

            <div className="scroll-hint">
              <span>Scroll</span>
              <div className="scroll-hint-line" />
            </div>
          </div>
        </section>

        {/* ─── About ─────────────────────── */}
        <section className="section" id="about">
          <div className="container">
            <motion.div className="section-header" {...fadeUp}>
              <span className="section-number">01</span>
              <h2 className="section-title">About</h2>
            </motion.div>

            <motion.p className="about-text" {...fadeUp}>
              I&apos;m a <strong>Graduate Computer Systems Engineer</strong> with
              a First-Class Honours degree from Brunel University London. I
              specialize in building <strong>AI-powered applications</strong>,
              scalable backend systems, and intuitive full-stack experiences -
              from neural networks deployed on FPGAs to production-ready web
              platforms.
            </motion.p>

            <div className="about-stats">
              {[
                { value: "1st Class", label: "Brunel University" },
                { value: "CERN", label: "Research Institute" },
                { value: "Johnson Controls", label: "HVAC" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="stat-card"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                >
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ─── Skills ────────────────────── */}
        <section className="section" id="skills">
          <div className="container">
            <motion.div className="section-header" {...fadeUp}>
              <span className="section-number">02</span>
              <h2 className="section-title">Tech Stack</h2>
              <p className="section-subtitle">
                Languages, frameworks, and tools I work with daily.
              </p>
            </motion.div>
          </div>

          {/* Full-width marquee area */}
          <div className="marquee-container">
            {/* Shred particles — left edge */}
            <div className="shred-edge shred-edge--left">
              {shredParticles.map((p, i) => (
                <div
                  key={i}
                  className="shred-particle shred-left"
                  style={
                    {
                      "--w": `${p.w}px`,
                      "--h": `${p.h}px`,
                      "--delay": `${p.delay}s`,
                      "--dur": `${p.dur}s`,
                      "--y": `${p.y}%`,
                      "--rot": `${p.rot}deg`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            {/* Shred particles — right edge */}
            <div className="shred-edge shred-edge--right">
              {shredParticles.map((p, i) => (
                <div
                  key={i}
                  className="shred-particle shred-right"
                  style={
                    {
                      "--w": `${p.w}px`,
                      "--h": `${p.h}px`,
                      "--delay": `${p.delay + 0.1}s`,
                      "--dur": `${p.dur}s`,
                      "--y": `${p.y}%`,
                      "--rot": `${-p.rot}deg`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            {/* Row 1 — scrolls left */}
            <div className="marquee-row">
              <div className="marquee-track marquee-forward">
                {[...skillsRow1, ...skillsRow1, ...skillsRow1].map(
                  (skill, i) => (
                    <span key={`a-${i}`} className="skill-chip">
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Row 2 — scrolls right */}
            <div className="marquee-row">
              <div className="marquee-track marquee-reverse">
                {[...skillsRow2, ...skillsRow2, ...skillsRow2].map(
                  (skill, i) => (
                    <span key={`b-${i}`} className="skill-chip">
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ─── Experience ────────────────── */}
        <section className="section" id="experience">
          <div className="container">
            <motion.div className="section-header" {...fadeUp}>
              <span className="section-number">03</span>
              <h2 className="section-title">Experience</h2>
            </motion.div>

            <div className="experience-list">
              {experience.map((job, i) => (
                <motion.article
                  key={job.company}
                  className="experience-card"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                >
                  <div className="exp-header">
                    <div>
                      <h3 className="exp-role">{job.role}</h3>
                      <span className="exp-company">{job.company}</span>
                    </div>
                    <span className="exp-period">{job.period}</span>
                  </div>
                  <ul className="exp-bullets">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ─── Education ─────────────────── */}
        <section className="section" id="education">
          <div className="container">
            <motion.div className="section-header" {...fadeUp}>
              <span className="section-number">04</span>
              <h2 className="section-title">Education</h2>
            </motion.div>

            <motion.article
              className="education-card"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="edu-degree">
                BEng. (Honours) Computer System Engineering
              </h3>
              <p className="edu-school">Brunel University London</p>
              <div className="edu-meta">
                <span className="edu-badge">First Class Honours</span>
                <span className="edu-period">Sept 2021 — June 2025</span>
              </div>
            </motion.article>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ─── Projects ──────────────────── */}
        <section className="section" id="projects">
          <div className="container">
            <motion.div className="section-header" {...fadeUp}>
              <span className="section-number">05</span>
              <h2 className="section-title">Projects</h2>
              <p className="section-subtitle">
                A selection of things I&apos;ve built.
              </p>
            </motion.div>

            <div className="projects-grid">
              {projects.slice(0, visibleCount).map((project, i) => (
                <ProjectCard
                  key={project.title}
                  number={String(i + 1).padStart(2, "0")}
                  title={project.title}
                  stack={project.stack}
                  summary={project.summary}
                  index={i}
                />
              ))}
            </div>

            <div className="projects-actions">
              {visibleCount < projects.length && (
                <motion.button
                  className="btn btn-primary"
                  onClick={showMore}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Load More
                </motion.button>
              )}
              {visibleCount > INITIAL_PROJECTS && (
                <motion.button
                  className="btn btn-secondary"
                  onClick={showLess}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Show Less
                </motion.button>
              )}
            </div>
          </div>
        </section>

        {/* ─── Contact ───────────────────── */}
        <section className="contact-section" id="contact">
          <div className="container">
            <motion.h2
              className="contact-heading"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              Let&apos;s build something{" "}
              <span className="gradient-text">together</span>
            </motion.h2>

            <motion.p
              className="contact-description"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Open to full-time software engineering roles and select contract
              work. Let&apos;s talk.
            </motion.p>

            <motion.div
              className="contact-cta"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              <Link href="mailto:rishi4636@gmail.com" className="btn btn-primary">
                Get in Touch →
              </Link>
              <Link
                href="https://www.linkedin.com/in/rishi-dabhi-9099b0199/"
                className="btn btn-secondary"
                target="_blank"
              >
                LinkedIn ↗
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ─── Footer ──────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <p className="footer-text">
              © {new Date().getFullYear()} Rishi Dabhi
            </p>
            <ul className="footer-links">
              <li>
                <Link href="https://github.com/Rishi-Dabhi" className="footer-link" target="_blank">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="https://www.linkedin.com/in/rishi-dabhi-9099b0199/" className="footer-link" target="_blank">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="mailto:rishi4636@gmail.com" className="footer-link">
                  Email
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
