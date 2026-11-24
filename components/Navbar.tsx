"use client";

import { useRef, useState } from "react";

const links = [
  { href: "#projects", label: "Selected work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  function closeMenu() { setOpen(false); }

  return (
    <header className="site-header">
      <nav className="container navbar" aria-label="Main navigation" onKeyDown={event => {
        if (event.key === "Escape" && open) { closeMenu(); menuButton.current?.focus(); }
      }}>
        <a href="#home" className="nav-brand" aria-label="Rishi Dabhi, home" onClick={closeMenu}>rd<span>.</span></a>
        <span className="nav-note">A personal portfolio</span>
        <button ref={menuButton} type="button" className="menu-toggle" aria-expanded={open} aria-controls="navigation-links" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}<span aria-hidden="true">{open ? "−" : "+"}</span></button>
        <ul id="navigation-links" className={`nav-links${open ? " is-open" : ""}`}>{links.map(link => <li key={link.href}><a href={link.href} onClick={closeMenu}>{link.label}</a></li>)}<li className="mobile-contact"><a href="#contact" onClick={closeMenu}>Get in touch</a></li></ul>
        <a className="nav-contact" href="#contact">Get in touch<span className="contact-mark" aria-hidden="true" /></a>
      </nav>
    </header>
  );
}
