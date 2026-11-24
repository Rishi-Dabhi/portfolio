"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Galaxy from "@/components/Galaxy";
import StarryBackground, { CelestialBackground } from "@/components/StarryBackground";
import { experience, projects } from "@/components/portfolio-data";

const socials = [
  { name: "GitHub", href: "https://github.com/Rishi-Dabhi" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/rishi-dabhi-9099b0199/" },
  { name: "LeetCode", href: "https://leetcode.com/u/TarnishedSoul/" },
];
const skillGroups = [
  { title: "The languages", skills: "Python, C++, C, Java, JavaScript, TypeScript, Rust" },
  { title: "The applications", skills: "React, Next.js, Django, FastAPI, Spring Boot" },
  { title: "The intelligence", skills: "TensorFlow, PyTorch, scikit-learn, Agentic AI, LangGraph" },
  { title: "The foundations", skills: "PostgreSQL, MongoDB, Neo4j, Docker, Azure, Git, CI/CD, FPGA, Agile methodologies" },
];

function StarMark({ className = "" }: { className?: string }) {
  return <svg className={`star-mark ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m16 0 3.4 12.6L32 16l-12.6 3.4L16 32l-3.4-12.6L0 16l12.6-3.4Z" fill="currentColor" /></svg>;
}

function ProjectArtwork({ type }: { type: "property" | "intelligence" | "commerce" }) {
  if (type === "property") {
    return (
      <div className="project-art property-art" aria-hidden="true">
        <svg viewBox="0 0 800 520" fill="none" className="contour-map">
          <g stroke="currentColor" strokeWidth=".7">{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-80 + i * 5} ${50 + i * 34}C130 ${-140 + i * 29},250 ${270 + i * 18},410 ${140 + i * 16}S600 ${-30 + i * 32},900 ${100 + i * 30}`} />)}</g>
          <g stroke="currentColor" opacity=".6"><path d="M260 130 502 230 450 391 210 280Z" /><path d="m260 130 80 201m162-101-275-11" /></g>
          <circle cx="383" cy="260" r="92" stroke="currentColor" strokeDasharray="3 8" /><circle cx="383" cy="260" r="48" stroke="currentColor" />
          <circle cx="383" cy="260" r="8" fill="currentColor" /><path d="M383 238v-30m0 104v-30m-22-22h-30m104 0h-30" stroke="currentColor" />
        </svg>
        <div className="art-masthead"><span>RentRadar</span><span>Property intelligence</span></div>
        <span className="art-large-type">A clearer<br /><em>view.</em></span>
        <span className="art-footnote">Market insights · Geospatial analysis</span>
        <div className="map-coordinate"><span>Location</span><strong>meets intelligence.</strong></div>
      </div>
    );
  }
  if (type === "intelligence") {
    return (
      <div className="project-art intelligence-art" aria-hidden="true">
        <div className="art-masthead"><span>MultiMind</span><span>Artificial intelligence</span></div>
        <svg viewBox="0 0 560 420" fill="none" className="mind-art">
          <g stroke="currentColor" strokeWidth=".7">{[0,30,60,90,120,150].map(angle => <ellipse key={angle} cx="280" cy="205" rx="132" ry="50" transform={`rotate(${angle} 280 205)`} />)}</g>
          <circle cx="280" cy="205" r="5" fill="currentColor" /><circle cx="280" cy="205" r="157" stroke="currentColor" strokeWidth=".5" strokeDasharray="1 10" />
        </svg>
        <span className="mind-art-caption">Different minds.<br /><em>A shared perspective.</em></span>
        <span className="art-footnote">Council workflows · Connected knowledge</span>
      </div>
    );
  }
  return (
    <div className="project-art commerce-art" aria-hidden="true">
      <div className="art-masthead"><span>The commerce project</span><span>Full-stack development</span></div>
      <div className="commerce-composition"><span className="composition-line" /><span className="sculpture sculpture-one" /><span className="sculpture sculpture-two" /><span className="sculpture sculpture-three" /></div>
      <span className="commerce-art-caption">Considered.<br /><em>Connected.</em></span>
      <span className="art-footnote">From the first browse to the final checkout.</span>
    </div>
  );
}

export default function Home() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <CelestialBackground />
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <section className="hero container" id="home" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-rule" /> Software engineer & curious mind</p>
            <h1 id="hero-heading"><span>Rishi</span><em>Dabhi<span className="name-period">.</span></em></h1>
            <div className="hero-description"><p>Finding the connections.<br />Building what comes next.</p><p>Graduate Software Engineer at <strong>Sage.</strong><br />Previously CERN & Johnson Controls.</p></div>
            <a href="#projects" className="work-link"><span className="link-orbit"><StarMark /></span><span>Discover my work</span></a>
          </div>
          <div className="hero-art"><StarryBackground /><p className="atlas-caption"><span>A fascination with the celestial.</span><em>A practice rooted in engineering.</em></p></div>
          <div className="hero-bottom"><span>Full-stack development &nbsp; / &nbsp; AI & machine learning</span><a href="#about">A little more about me</a></div>
        </section>

        <div className="career-strip"><div className="container career-strip-inner"><span className="strip-label">A few places<br />along the way</span><span className="company-sage">Sage<small>The current chapter</small></span><span className="company-cern">CERN</span><span className="company-johnson">Johnson Controls</span><span className="company-brunel">Brunel University<br /><em>London</em></span></div></div>

        <Galaxy />

        <section className="section container" id="projects" aria-labelledby="projects-heading">
          <div className="section-heading"><div><p className="eyebrow">Selected explorations</p><h2 id="projects-heading">Things I’ve<br /><em>put into the world.</em></h2></div><p>A collection of applications, experiments,<br />and problems worth spending time on.</p></div>
          <article className="project-feature">
            <ProjectArtwork type="property" />
            <div className="project-detail"><div><span className="project-category">AI & property technology</span><h3>RentRadar</h3><p>{projects[0].summary}</p></div><ul className="tags" aria-label="Technologies">{projects[0].stack.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
          </article>
          <div className="project-pair">{projects.slice(1, 3).map((project, index) => (
            <article className="project-secondary" key={project.title}>
              <ProjectArtwork type={index === 0 ? "intelligence" : "commerce"} />
              <div className="project-detail"><span className="project-category">{index === 0 ? "Multi-model AI platform" : "End-to-end web application"}</span><h3>{project.title}</h3><p>{project.summary}</p><ul className="tags" aria-label="Technologies">{project.stack.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
            </article>
          ))}</div>
          <div id="project-archive" className="project-archive" hidden={!expanded}>{projects.slice(3).map(project => <article className="archive-row" key={project.title}><h3>{project.title}</h3><div><p>{project.summary}</p><ul className="tags" aria-label="Technologies">{project.stack.map(tag => <li key={tag}>{tag}</li>)}</ul></div></article>)}</div>
          <div className="archive-toggle"><span>There’s more in the notebook.</span><button type="button" aria-expanded={expanded} aria-controls="project-archive" onClick={() => setExpanded(!expanded)}>{expanded ? "Close the archive" : `Open the project archive (${projects.length})`}<span aria-hidden="true">{expanded ? "−" : "+"}</span></button></div>
        </section>

        <section className="experience-section" id="experience" aria-labelledby="experience-heading"><div className="container experience-layout">
          <div className="experience-intro"><p className="eyebrow">The path so far</p><h2 id="experience-heading">Every chapter,<br /><em>something learned.</em></h2><p>Research labs, engineering teams, and a new beginning at Sage.</p><div className="chapter-ornament" aria-hidden="true"><span /><StarMark /><span /></div></div>
          <div className="experience-list">
            <article className="experience-item current-role"><div className="experience-meta"><span className="current-label">The current chapter</span><span>Present</span></div><p className="experience-company">Sage</p><h3>Graduate Software Engineer</h3><p className="role-description">Continuing my journey in software engineering.</p></article>
            {experience.map(job => <article className="experience-item" key={job.company}><div className="experience-meta"><span>{job.company}</span><span>{job.period}</span></div><h3>{job.role}</h3><ul className="experience-bullets">{job.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></article>)}
          </div>
        </div></section>

        <section className="section container about-layout" id="about" aria-labelledby="about-heading">
          <div className="about-heading"><p className="eyebrow">Beyond the code</p><h2 id="about-heading">A little<br /><em>closer to home.</em></h2><div className="about-seal" aria-hidden="true"><StarMark /><span>Always a student<br />of something.</span></div></div>
          <div className="about-body"><p className="about-lead">I like understanding how things work.<br /><em>Then seeing what else they could become.</em></p><p>I’m Rishi, a Graduate Software Engineer at Sage and a First-Class Computer Systems Engineering graduate from Brunel University London.</p><p>My work has taken me from neural networks on FPGAs at CERN to full-stack applications and agentic AI. Outside those systems, I’m drawn to the celestial: the stars, the patterns, and the sense that there’s always more to understand.</p><div className="education" id="education"><span className="education-label">Education</span><div><h3>BEng. Computer System Engineering</h3><p>Brunel University London · 2021–2025</p><span>First Class Honours</span></div></div></div>
          <div className="toolkit" id="skills"><div className="toolkit-heading"><p className="eyebrow">Tools of the trade</p><p>The things I build with.</p></div><div className="toolkit-grid">{skillGroups.map(group => <div className="skill-group" key={group.title}><h3>{group.title}</h3><p>{group.skills}</p></div>)}</div></div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-heading"><div className="container"><div className="contact-top"><p className="eyebrow">Our paths might cross</p><StarMark /></div><h2 id="contact-heading">Something<br /><em>on your mind?</em></h2><div className="contact-bottom"><p>A project, a question, or a conversation<br />about something interesting.</p><a className="contact-email" href="mailto:rishi4636@gmail.com">Let’s talk<span className="email-underline" /></a></div><a className="email-address" href="mailto:rishi4636@gmail.com">rishi4636@gmail.com</a></div></section>
      </main>
      <footer className="container footer"><a href="#home" className="footer-brand">Rishi <em>Dabhi.</em></a><span>A small corner of the internet.</span><ul>{socials.map(social => <li key={social.name}><a href={social.href} target="_blank" rel="noopener noreferrer">{social.name}</a></li>)}</ul><div className="footer-bottom"><span>© {new Date().getFullYear()} Rishi Dabhi</span><a href="#home">Back to the beginning</a><span>Moon imagery: <a href="https://svs.gsfc.nasa.gov/4720/" target="_blank" rel="noopener noreferrer">NASA SVS</a></span></div></footer>
    </>
  );
}
