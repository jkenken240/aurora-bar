"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check,
  Clock3, MapPin, Menu, Music2, Quote, Sparkles, UtensilsCrossed, Wine, X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

const AuroraScene = dynamic(() => import("./AuroraScene"), { ssr: false });

const menuItems = [
  { name: "Ember Ribeye", note: "250g ribeye · burnt shallot · smoked jus", price: "₱1,250" },
  { name: "Coal-Roasted Chicken", note: "lemongrass glaze · charred corn · lime", price: "₱720" },
  { name: "Truffle Night Fries", note: "parmesan snow · herbs · roasted garlic", price: "₱390" },
  { name: "Northern Lights", note: "gin · calamansi · shiso · violet air", price: "₱420" },
  { name: "Midnight Bloom", note: "dark rum · cacao · cherry · smoke", price: "₱440" },
  { name: "Zero Hour", note: "pineapple · pandan · tonic · sea salt", price: "₱280" },
];

const moments = [
  { time: "5:30", title: "The first glow", text: "Doors open. The room is low, warm, and unhurried." },
  { time: "7:00", title: "Fire finds rhythm", text: "The kitchen builds its tempo around flame and sharing plates." },
  { time: "9:00", title: "The room listens", text: "Friday and Saturday sessions begin—close enough to feel every note." },
  { time: "11:30", title: "After midnight", text: "Final plates fade into slow pours, vinyl, and one last chorus." },
];

function Brand() {
  return <a className="brand" href="#top" aria-label="Aurora Bar home"><span className="brand-mark" aria-hidden="true" /><span>Aurora</span></a>;
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 42 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

export default function AuroraExperience() {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reserved, setReserved] = useState(false);
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let value = 0;
    const timer = window.setInterval(() => {
      value = Math.min(value + Math.ceil(Math.random() * 7), 100);
      setProgress(value);
      if (value >= 100) {
        window.clearInterval(timer);
        window.setTimeout(() => setLoading(false), 280);
      }
    }, reducedMotion ? 12 : 48);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")) && !reducedMotion);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [reducedMotion]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const onPointer = (event: PointerEvent) => {
      if (cursor.current) cursor.current.style.transform = `translate3d(${event.clientX - 192}px, ${event.clientY - 192}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReserved(true);
  };

  return (
    <div className="aurora-site" id="top">
      <AnimatePresence>
        {loading && (
          <motion.div className="loader" role="progressbar" aria-label="Loading Aurora Bar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.65 }}>
            <div className="loader-inner">
              <div className="loader-head"><span className="loader-name">Aurora</span><span className="loader-count">{String(progress).padStart(3, "0")}%</span></div>
              <div className="loader-track"><motion.div className="loader-progress" animate={{ scaleX: progress / 100 }} /></div>
              <p className="loader-caption">Warming the room · tuning the stage</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scene-shell" aria-hidden="true">{webgl ? <AuroraScene /> : <div className="scene-fallback" />}</div>
      <div className="noise" aria-hidden="true" />
      <div className="cursor-aura" ref={cursor} aria-hidden="true" />

      <div className="site-content">
        <header className={`topbar ${scrolled ? "scrolled" : ""}`}>
          <Brand />
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#story">Story</a><a href="#menu">Menu</a><a href="#sessions">Sessions</a><a href="#visit">Visit</a>
          </nav>
          <div className="nav-meta"><span className="live-dot" aria-hidden="true" /><span>Live every weekend</span></div>
          <button className="menu-toggle" type="button" aria-label="Open navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div className="mobile-menu" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mobile-menu-head"><Brand /><button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={22} /></button></div>
              <nav aria-label="Mobile navigation">
                {["Story", "Menu", "Sessions", "Visit", "Reserve"].map((item, index) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)}><span>0{index + 1}</span>{item}<ArrowUpRight /></a>)}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <main>
          <section className="hero" aria-labelledby="hero-title">
            <motion.div className="hero-copy" initial={{ opacity: 0, y: 40 }} animate={{ opacity: loading ? 0 : 1, y: loading ? 40 : 0 }} transition={{ duration: reducedMotion ? 0 : 1.1, delay: 0.15 }}>
              <p className="eyebrow">Food · Spirits · Live sound</p>
              <h1 id="hero-title"><span className="aurora-word">Aurora</span><span className="bar-word">Bar</span></h1>
            </motion.div>
            <motion.div className="hero-bottom" initial={{ opacity: 0 }} animate={{ opacity: loading ? 0 : 1 }} transition={{ delay: reducedMotion ? 0 : 0.8, duration: 0.8 }}>
              <p className="hero-note"><strong>Where dinner drifts into midnight.</strong><br />Fire-led plates, luminous pours, and live music every Friday and Saturday.</p>
              <a className="scroll-orbit" href="#story" aria-label="Explore Aurora Bar"><ArrowDown size={18} /></a>
              <div className="hero-actions"><a className="text-cta" href="#menu">Explore menu <ArrowUpRight size={15} /></a><a className="primary-cta" href="#reserve"><CalendarDays size={15} /> Reserve a table</a></div>
            </motion.div>
          </section>

          <section className="intro-slice" id="story" aria-labelledby="intro-title">
            <Reveal><span className="intro-kicker">The room after dark</span><h2 id="intro-title">A little wild.<br />Beautifully <em>composed.</em></h2></Reveal>
            <Reveal className="intro-detail" delay={0.1}><p>Aurora is built around the glow between dinner and the night ahead—open-fire cooking, seasonal cocktails, and close-up performances that turn a table into the best seat in the room.</p><a className="text-cta" href="#menu">Meet the kitchen <ArrowUpRight size={15} /></a></Reveal>
          </section>

          <section className="story-panel" aria-label="Our story">
            <motion.div className="story-image" initial={reducedMotion ? false : { clipPath: "inset(12% 0 12% 0)" }} whileInView={reducedMotion ? undefined : { clipPath: "inset(0% 0 0% 0)" }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
              <Image unoptimized src="/images/aurora-hero.webp" alt="Warm interior of Aurora Bar with the live stage in the distance" fill sizes="(max-width: 900px) 100vw, 55vw" />
              <span className="image-index">A / 01</span>
            </motion.div>
            <Reveal className="story-copy">
              <span className="section-number">01 · Our story</span>
              <h3>Designed around a feeling, not a theme.</h3>
              <p>We took the colors of an aurora—not the spectacle, but the quiet shift—and translated them into glass, light, food, and sound. Everything changes gently as the night unfolds.</p>
              <dl className="story-facts"><div><dt>36</dt><dd>intimate seats</dd></div><div><dt>02</dt><dd>live nights weekly</dd></div><div><dt>01</dt><dd>room, always evolving</dd></div></dl>
            </Reveal>
          </section>

          <section className="menu-section" id="menu" aria-labelledby="menu-title">
            <Reveal className="section-head"><span className="section-number">02 · Signature menu</span><h2 id="menu-title">Fire in the kitchen.<br /><em>Light in the glass.</em></h2><p>Comforting ingredients, sharpened by flame, smoke, acid, and a little midnight imagination.</p></Reveal>
            <div className="menu-stage">
              <motion.div className="menu-image" whileInView={reducedMotion ? undefined : { y: [30, 0] }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
                <Image unoptimized src="/images/aurora-food.webp" alt="Aurora Bar signature ribeye, charred vegetables, truffle fries, and cocktail" fill sizes="(max-width: 900px) 100vw, 48vw" />
                <div className="menu-image-label"><Sparkles size={14} /> Made for the whole table</div>
              </motion.div>
              <div className="menu-list">
                {menuItems.map((item, index) => <Reveal key={item.name} className="menu-item" delay={index * 0.04}><span className="menu-index">0{index + 1}</span><div><h3>{item.name}</h3><p>{item.note}</p></div><span className="menu-price">{item.price}</span></Reveal>)}
              </div>
            </div>
            <p className="menu-footnote"><UtensilsCrossed size={14} /> Vegetarian and dietary adaptations are available. Ask our team when booking.</p>
          </section>

          <section className="timeline-section" aria-labelledby="timeline-title">
            <Reveal className="timeline-intro"><span className="section-number">03 · Your night</span><h2 id="timeline-title">From first light<br />to <em>last call.</em></h2></Reveal>
            <div className="timeline-line" aria-label="An evening at Aurora">
              {moments.map((moment, index) => <Reveal className="timeline-moment" delay={index * 0.09} key={moment.time}><span className="timeline-time">{moment.time}<sup>PM</sup></span><span className="timeline-dot" aria-hidden="true" /><h3>{moment.title}</h3><p>{moment.text}</p></Reveal>)}
            </div>
          </section>

          <section className="sessions-section" id="sessions" aria-labelledby="sessions-title">
            <div className="session-image"><Image unoptimized src="/images/aurora-band.webp" alt="Soul and jazz trio performing live at Aurora Bar" fill sizes="100vw" /></div>
            <div className="session-overlay" />
            <Reveal className="session-content"><span className="session-icon"><Music2 /></span><span className="section-number">Weekend sessions</span><h2 id="sessions-title">The band is close.<br />The night is <em>closer.</em></h2><p>Friday: soul, R&amp;B and slow grooves.<br />Saturday: jazz, neo-soul and spontaneous sets.</p><div className="session-meta"><span><Clock3 /> First set 9:00 PM</span><span><Wine /> Kitchen until 11:30 PM</span></div><a className="primary-cta light" href="#reserve">Book a session table <ArrowRight size={15} /></a></Reveal>
          </section>

          <section className="gallery-section" aria-labelledby="gallery-title">
            <Reveal className="gallery-head"><span className="section-number">04 · In the room</span><h2 id="gallery-title">Come for dinner.<br /><em>Stay for the shift.</em></h2></Reveal>
            <div className="gallery-grid">
              <figure className="gallery-a"><Image unoptimized src="/images/aurora-food.webp" alt="Aurora signature plates and cocktails on dark stone" fill sizes="(max-width: 700px) 100vw, 48vw" /><figcaption>Fire, smoke, and sharing plates</figcaption></figure>
              <figure className="gallery-b"><Image unoptimized src="/images/aurora-band.webp" alt="Live vocalist performing during a weekend session" fill sizes="(max-width: 700px) 100vw, 30vw" /><figcaption>Weekend sessions, up close</figcaption></figure>
              <figure className="gallery-c"><Image unoptimized src="/images/aurora-hero.webp" alt="Polished stone bar and velvet seating inside Aurora" fill sizes="(max-width: 700px) 100vw, 30vw" /><figcaption>A room that changes with you</figcaption></figure>
            </div>
          </section>

          <section className="testimonials" aria-labelledby="testimonials-title">
            <span className="section-number">05 · Heard around the room</span>
            <h2 id="testimonials-title" className="sr-only">Guest testimonials</h2>
            <Quote className="quote-mark" aria-hidden="true" />
            <Reveal><blockquote>“You arrive for a drink and suddenly it’s midnight. The food is confident, the sound is intimate, and the room feels completely alive.”</blockquote><p className="quote-by">Mara L. <span>· Friday regular</span></p></Reveal>
            <div className="micro-quotes"><p>“The ribeye deserves its own encore.”<span>— Paolo R.</span></p><p>“Our new favorite date-night room.”<span>— Nina &amp; Jules</span></p></div>
          </section>

          <section className="visit-section" id="visit" aria-labelledby="visit-title">
            <div className="map-card" aria-label="Stylized map to Aurora Bar"><div className="map-grid" /><div className="map-route" /><div className="map-marker"><span className="brand-mark" /><strong>Aurora</strong></div><span className="map-road road-a">Orion Lane</span><span className="map-road road-b">Polaris Street</span></div>
            <Reveal className="visit-copy"><span className="section-number">06 · Find the glow</span><h2 id="visit-title">Meet us after dark.</h2><div className="visit-address"><MapPin /><p>27 Orion Lane, Poblacion<br />Makati City, Philippines</p></div><div className="hours"><div><span>Tue—Thu</span><strong>5:30 PM—12:00 AM</strong></div><div><span>Fri—Sat</span><strong>5:30 PM—2:00 AM</strong></div><div><span>Sun—Mon</span><strong>Closed</strong></div></div><p className="fiction-note">Aurora Bar and this address are fictional, created as a portfolio experience.</p></Reveal>
          </section>

          <section className="reserve-section" id="reserve" aria-labelledby="reserve-title">
            <Reveal className="reserve-intro"><span className="section-number">07 · Reservations</span><h2 id="reserve-title">Your table is<br /><em>waiting in the glow.</em></h2><p>For the full experience, book after 8:30 PM on Friday or Saturday. The first set begins at 9.</p></Reveal>
            <div className="form-shell">
              {reserved ? (
                <motion.div className="form-success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} role="status"><span><Check /></span><h3>Request staged.</h3><p>This is a portfolio demo, so no reservation was sent. The interaction is working exactly as a real booking flow would.</p><button type="button" className="text-cta" onClick={() => setReserved(false)}>Make another selection <ArrowRight size={15} /></button></motion.div>
              ) : (
                <form className="reservation-form" onSubmit={submitReservation}>
                  <label><span>Name</span><input name="name" autoComplete="name" placeholder="Your name" required /></label>
                  <label><span>Email</span><input type="email" name="email" autoComplete="email" placeholder="you@email.com" required /></label>
                  <div className="form-row"><label><span>Date</span><input type="date" name="date" required /></label><label><span>Time</span><select name="time" defaultValue="20:30" required><option value="18:00">6:00 PM</option><option value="19:30">7:30 PM</option><option value="20:30">8:30 PM</option><option value="21:30">9:30 PM</option><option value="22:30">10:30 PM</option></select></label></div>
                  <label><span>Party size</span><select name="guests" defaultValue="2" required>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label>
                  <label><span>Anything we should know?</span><textarea name="notes" rows={3} placeholder="Celebration, dietary needs, preferred seating…" /></label>
                  <button className="reserve-submit" type="submit">Request a table <ArrowUpRight /></button>
                  <p className="form-note">Demo form · No personal information is transmitted or stored.</p>
                </form>
              )}
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="footer-top"><Brand /><p>Food · Spirits · Live sound<br />Every Friday and Saturday night.</p><a href="#reserve">Reserve <ArrowUpRight /></a></div>
          <div className="footer-word">AURORA</div>
          <div className="footer-bottom"><span>© 2026 Aurora Bar — Fictional portfolio concept</span><div><a href="#menu">Menu</a><a href="#sessions">Sessions</a><a href="#visit">Visit</a></div><a href="#top">Back to top <ArrowUpRight /></a></div>
        </footer>
      </div>
    </div>
  );
}
