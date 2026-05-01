/* Cartalis — Landing page */

const { useState: useStateL, useEffect: useEffectL } = React;

function PublicHeader({ navigate }) {
  const [scrolled, setScrolled] = useStateL(false);
  useEffectL(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(251,250,247,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      transition: "all 200ms",
    }}>
      <div className="container row" style={{ height: 72, justifyContent: "space-between" }}>
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }}><Logo size="md" /></a>
        <nav className="row gap-8 hide-md" style={{ fontSize: 14 }}>
          <a href="#features" className="muted" style={{ transition: "color 150ms" }}>Fonctionnement</a>
          <a href="#why" className="muted">Avantages</a>
          <a href="#pricing" className="muted">Tarifs</a>
          <a href="#faq" className="muted">FAQ</a>
        </nav>
        <div className="row gap-3">
          <button className="btn btn-ghost btn-sm hide-md" onClick={() => navigate("/auth?mode=login")}>Se connecter</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/auth?mode=signup")}>S'inscrire</button>
        </div>
      </div>
    </header>
  );
}

// Simple SVG monogram logo for the demo card
const STUDIO_LOGO_URL = "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="24" fill="#2a241a"/>
    <text x="24" y="32" font-family="Georgia,serif" font-size="26" fill="#f1deb6" text-anchor="middle" font-weight="400">S</text>
  </svg>`
);

// Logo for the phone scan mockup card
const SCAN_LOGO_URL = "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#1a3055"/>
    <text x="24" y="31" font-family="Georgia,serif" font-size="20" fill="#e8d9c0" text-anchor="middle" font-weight="400">AL</text>
  </svg>`
);

const HERO_CARD = {
  id: "card-chinois-demo",
  design: "design-blossom",
  nom_affiche: "Moreau",
  prenom_affiche: "Élise",
  entreprise_affiche: "Studio Solange",
  poste_affiche: "Directrice artistique",
  telephone_affiche: "06 18 43 72 95",
  email_affiche: "elise@studiosolange.fr",
  site_web: "studiosolange.fr",
  afficher_nom: true,
  afficher_prenom: true,
  afficher_entreprise: true,
  afficher_poste: true,
  afficher_telephone: true,
  afficher_email: true,
  afficher_site_web: true,
  positions: {
    name:       { x: 50, y: 24 },
    entreprise: { x: 50, y: 40 },
    poste:      { x: 50, y: 51 },
    phone:      { x: 50, y: 63 },
    email:      { x: 50, y: 73 },
    web:        { x: 50, y: 83 },
    logoRecto:  { x: 15, y: 80 },
  },
};

function HeroSection({ navigate }) {
  const [heroFlipped, setHeroFlipped] = useStateL(false);
  const [imgsReady, setImgsReady] = useStateL(false);

  useEffectL(() => {
    let loaded = 0;
    const srcs = ["assets/card-chinois-recto.png", "assets/card-chinois-verso.png"];
    const onLoad = () => { loaded++; if (loaded >= srcs.length) setImgsReady(true); };
    srcs.forEach(src => {
      const img = new Image();
      img.onload = onLoad;
      img.onerror = onLoad; // don't block on error
      img.src = src;
    });
  }, []);

  return (
    <section style={{ position: "relative", paddingTop: 60, paddingBottom: 100, overflow: "hidden" }}>
      <div className="hero-bg" />
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="hero-grid">
          <div className="col gap-6 fade-up">
            <div className="chip chip-gold" style={{ alignSelf: "flex-start" }}>
              <Icon.Sparkle size={12} />
              <span>Nouveau · Cartes 3D génératives</span>
            </div>
            <h1 className="serif" style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.02,
              margin: 0,
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}>
              Transformez chaque<br/>rencontre en{" "}
              <span style={{ fontStyle: "italic", color: "var(--gold)" }}>opportunité</span><br/>commerciale.
            </h1>
            <p className="muted" style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 520, margin: 0, textWrap: "pretty" }}>
              Cartalis remplace la carte de visite papier par une carte digitale 3D, interactive et mesurable. Vos prospects scannent, enregistrent votre contact, et vous suivez les interactions générées par vos équipes.
            </p>
            <div className="row gap-3" style={{ marginTop: 8 }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/auth?mode=signup")}>
                Créer ma carte <Icon.ArrowRight size={16} />
              </button>
              <button className="btn btn-lg" onClick={() => navigate("/app")}>Voir la démo</button>
            </div>
            <div className="row gap-6" style={{ marginTop: 20 }}>
              <div className="col gap-1">
                <div className="serif" style={{ fontSize: 28 }}>7 jours</div>
                <div className="dim" style={{ fontSize: 12 }}>Essai gratuit</div>
              </div>
              <div style={{ width: 1, background: "var(--line)" }} />
              <div className="col gap-1">
                <div className="serif" style={{ fontSize: 28 }}>+340%</div>
                <div className="dim" style={{ fontSize: 12 }}>De prospects qualifiés</div>
              </div>
              <div style={{ width: 1, background: "var(--line)" }} />
              <div className="col gap-1">
                <div className="serif" style={{ fontSize: 28 }}>0</div>
                <div className="dim" style={{ fontSize: 12 }}>App à installer</div>
              </div>
            </div>
          </div>

          {/* Hero card visual */}
          <div style={{ position: "relative", height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              position: "absolute", width: 420, height: 420, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(244,220,175,0.5), transparent 70%)",
              filter: "blur(20px)",
            }} />
            {/* Skeleton shown while images load */}
            {!imgsReady && (
              <div style={{
                width: 420, aspectRatio: "1.75/1", borderRadius: 20,
                background: "linear-gradient(90deg, rgba(184,138,62,0.08) 25%, rgba(184,138,62,0.18) 50%, rgba(184,138,62,0.08) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.4s ease-in-out infinite",
                zIndex: 1, position: "relative",
              }} />
            )}
            <div
              onClick={() => setHeroFlipped(f => !f)}
              onMouseEnter={() => setHeroFlipped(true)}
              onMouseLeave={() => setHeroFlipped(false)}
              style={{
                cursor: "pointer", position: "relative", zIndex: 1,
                opacity: imgsReady ? 1 : 0,
                transition: "opacity 400ms ease",
                position: imgsReady ? "relative" : "absolute",
              }}
            >
              <Card3D
                card={HERO_CARD}
                width={420}
                float={true}
                showQR={false}
                flipped={heroFlipped}
                frontImageUrl="assets/card-chinois-recto.png"
                backImageUrl="assets/card-chinois-verso.png"
                logoUrl={STUDIO_LOGO_URL}
                logoSide="recto"
                logoSizeRecto={0.52}
                fieldSides={{ name: "verso", entreprise: "verso", poste: "verso", phone: "verso", email: "verso", web: "verso" }}
                fieldSizes={{ name: 1.7, entreprise: 1.0, poste: 0.82, phone: 0.78, email: 0.78, web: 0.78 }}
                fieldFonts={{ name: "display", entreprise: "display" }}
                fieldColors={{ name: "#1a150e", entreprise: "#b88a3e", poste: "#6a5a4a", phone: "#3a2f22", email: "#3a2f22", web: "#3a2f22" }}
              />
            </div>
            {/* Flip hint */}
            <div style={{
              position: "absolute", bottom: "2%", left: "50%", transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "var(--ink-3)", opacity: 0.7,
              pointerEvents: "none",
              animation: "float-soft 4s ease-in-out infinite",
            }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5"/>
              </svg>
              Cliquez pour retourner
            </div>
            {/* Badges always rendered above the 3D card */}
            <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
              <FloatingBadge style={{ top: "8%", left: "-2%", pointerEvents: "auto" }} delay={0}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f8a5f" }}></span>
                QR scanné
              </FloatingBadge>
              <FloatingBadge style={{ top: "20%", right: "-4%", pointerEvents: "auto" }} delay={1.5}>
                <Icon.User size={12} />
                +1 contact enregistré
              </FloatingBadge>
              <FloatingBadge style={{ bottom: "22%", left: "-6%", pointerEvents: "auto" }} delay={2.5}>
                <Icon.WhatsApp size={12} /> WhatsApp ouvert
              </FloatingBadge>
              <FloatingBadge style={{ bottom: "8%", right: "0%", pointerEvents: "auto" }} delay={1}>
                <Icon.Sparkle size={12} /> Lead généré
              </FloatingBadge>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-grid > div:nth-child(2) { height: 420px !important; }
        }
      `}</style>
    </section>
  );
}

// ---------- CarouselSection — infinite auto-scroll strip ----------
function CarouselSection() {
  const designs = window.CARTALIS_DATA.cardDesigns;
  // Duplicate for seamless loop (translateX -50% = exactly one set)
  const doubled = [...designs, ...designs];
  const stripRef = React.useRef(null);

  const pause  = () => { if (stripRef.current) stripRef.current.style.animationPlayState = "paused";  };
  const resume = () => { if (stripRef.current) stripRef.current.style.animationPlayState = "running"; };

  return (
    <section id="features" style={{ padding: "100px 0 80px", overflow: "hidden" }} className="section-bg-soft">
      {/* Header centré */}
      <div className="container col gap-2" style={{ marginBottom: 48 }}>
        <SectionHeader
          eyebrow="Designs"
          title="Des cartes digitales qui marquent les esprits."
          subtitle="Choisissez un design, ajoutez vos informations, partagez votre carte en un scan."
        />
      </div>

      {/* Bande pleine largeur avec masque de fondu sur les bords */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
          maskImage:        "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
        }}
      >
        <div
          ref={stripRef}
          style={{
            display: "flex",
            gap: 20,
            width: "max-content",
            animation: "carousel-scroll 65s linear infinite",
            willChange: "transform",
          }}
        >
          {doubled.map((d, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: 300,
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 6px 28px rgba(42,36,26,0.13)",
                transition: "transform 300ms ease, box-shadow 300ms ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.04) translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(42,36,26,0.22)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 28px rgba(42,36,26,0.13)";
              }}
            >
              <img
                src={d.front}
                alt={d.label}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", aspectRatio: "1.6/1", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes carousel-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function WhySection() {
  const items = [
    { t: "Plus jamais une carte perdue", d: "Votre contact reste accessible en quelques secondes. Le prospect scanne, consulte vos informations et peut vous enregistrer immédiatement." },
    { t: "Un passage à l'action plus rapide", d: "Au lieu d'espérer qu'un prospect vous rappelle, vous l'orientez directement vers une action : enregistrer le contact, ouvrir WhatsApp ou visiter votre site." },
    { t: "Un outil mesurable", d: "Chaque interaction peut être suivie : scans, clics, contacts enregistrés. Vous savez enfin quelles cartes et quels collaborateurs génèrent le plus d'activité." },
    { t: "Une image plus premium", d: "Une carte 3D digitale donne une image moderne, professionnelle et mémorable dès le premier contact." },
  ];
  return (
    <section id="why" style={{ padding: "120px 0" }}>
      <div className="container col gap-10">
        <SectionHeader
          eyebrow="Pourquoi Cartalis"
          title="Une carte papier se donne. Une carte digitale convertit."
          subtitle="Une carte de visite classique dépend de la mémoire du prospect. Cartalis transforme ce moment en action immédiate : scanner, enregistrer, contacter."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {items.map((it, i) => (
            <div key={i} className="card" style={{ padding: 28 }}>
              <div className="serif" style={{ fontSize: 24, color: "var(--gold)", marginBottom: 12 }}>0{i+1}</div>
              <h3 className="serif" style={{ fontSize: 20, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{it.t}</h3>
              <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.6, textWrap: "pretty" }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConversionTimeline() {
  const steps = [
    { n: "01", t: "Le commercial montre sa carte 3D", d: "Une présentation moderne et mémorable." },
    { n: "02", t: "Le prospect scanne le QR code", d: "Pas d'app, juste un scan rapide." },
    { n: "03", t: "Page contact premium", d: "Toutes les infos en un coup d'œil." },
    { n: "04", t: "Clic « Enregistrer le contact »", d: "Le contact est ajouté immédiatement." },
    { n: "05", t: "Le clic est comptabilisé", d: "Lead enregistré dans le dashboard." },
    { n: "06", t: "L'équipe suit les performances", d: "Visualisez qui convertit le mieux." },
  ];
  return (
    <section style={{ padding: "120px 0" }} className="section-bg-mid">
      <div className="container col gap-10">
        <SectionHeader
          eyebrow="Conversion"
          title="Une carte de visite qui ne se contente pas d'être jolie. Elle convertit."
          subtitle="Cartalis transforme une interaction physique en relation digitale. Le prospect ne repart pas seulement avec votre nom : il peut enregistrer votre contact, ouvrir une conversation et garder un lien direct avec vous."
        />
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {steps.map((s, i) => (
            <div key={i} className="col gap-3" style={{ position: "relative" }}>
              <div className="row gap-3" style={{ alignItems: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "var(--surface)", border: "1px solid var(--line)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500,
                  boxShadow: "var(--shadow-1)",
                }}>{s.n}</div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--line-2), transparent)" }} />
                )}
              </div>
              <div className="serif" style={{ fontSize: 18, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{s.t}</div>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const collabs = window.CARTALIS_DATA.collaborators;
  const active = collabs.filter(c => c.statut === "actif").sort((a, b) => b.leads - a.leads);

  const sectionRef = React.useRef(null);
  const [vis, setVis] = useStateL(false);
  const [hoveredDay, setHoveredDay] = useStateL(null);
  const [kpi1, setKpi1] = useStateL(0);
  const [kpi2, setKpi2] = useStateL(0);
  const [kpi3, setKpi3] = useStateL(0);
  const [kpi4, setKpi4] = useStateL(0);

  useEffectL(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffectL(() => {
    if (!vis) return;
    const go = (setter, target, delay) => {
      setTimeout(() => {
        let s = null, r;
        const fn = (ts) => {
          if (!s) s = ts;
          const p = Math.min((ts - s) / 1050, 1);
          setter(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) r = requestAnimationFrame(fn);
        };
        r = requestAnimationFrame(fn);
      }, delay);
    };
    go(setKpi1, 142, 0);
    go(setKpi2, 198, 120);
    go(setKpi3, 74, 240);
    go(setKpi4, 3, 360);
  }, [vis]);

  // ── SVG area chart ──
  const dailyData = [4,3,5,4,7,6,8,5,4,7,9,6,5,8,10,7,6,9,11,8,7,10,12,9,8,11,10,13,12,14];
  const cW = 560, cH = 110, pX = 6, pY = 8;
  const maxD = Math.max(...dailyData);
  const pts = dailyData.map((v, i) => ({
    x: pX + (i / (dailyData.length - 1)) * (cW - pX * 2),
    y: pY + (1 - v / maxD) * (cH - pY * 2),
    val: v, day: i + 1,
  }));
  function buildPath(pp) {
    if (pp.length < 2) return "";
    let d = `M ${pp[0].x.toFixed(1)},${pp[0].y.toFixed(1)}`;
    for (let i = 1; i < pp.length; i++) {
      const a = pp[i-1], b = pp[i];
      const mx = (a.x + b.x) / 2;
      d += ` C ${mx.toFixed(1)},${a.y.toFixed(1)} ${mx.toFixed(1)},${b.y.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
    }
    return d;
  }
  const linePath = buildPath(pts);
  const areaPath = linePath + ` L ${cW - pX},${cH} L ${pX},${cH} Z`;

  // ── Donut chart ──
  const eventData = [
    { label: "Salon Immobilier", color: "#b8843e", value: 58, pct: 41 },
    { label: "Réseau MEDEF",     color: "#c9a050", value: 47, pct: 33 },
    { label: "Portes ouvertes",  color: "#d4b878", value: 23, pct: 16 },
    { label: "Sans étiquette",   color: "#ddd0ad", value: 14, pct: 10 },
  ];
  const r = 44, dcx = 64, dcy = 64, circ = 2 * Math.PI * r;
  const donutSegs = eventData.map((e, i) => {
    const cumFrac = eventData.slice(0, i).reduce((s, x) => s + x.value, 0) / 142;
    return { ...e, dashLen: (e.value / 142) * circ, cumOffset: -(cumFrac * circ) };
  });

  // ── Sparklines ──
  function sp(vals) {
    const mx = Math.max(...vals), mn = Math.min(...vals), rng = mx - mn || 1;
    return buildPath(vals.map((v, i) => ({
      x: (i / (vals.length - 1)) * 68,
      y: 22 - ((v - mn) / rng) * 19 - 1,
    })));
  }

  const barColors = ["linear-gradient(90deg,#b8843e,#d4a855)","linear-gradient(90deg,#c9a050,#dbb86a)","linear-gradient(90deg,#d4b878,#e4cb96)"];
  const FADE = (delay) => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 480ms ease ${delay}ms, transform 480ms ease ${delay}ms`,
  });

  return (
    <section ref={sectionRef} style={{ padding: "120px 0", position: "relative" }}>
      <div className="container col gap-10">
        <SectionHeader
          eyebrow="Dashboard"
          title="Suivez les performances de vos équipes."
          subtitle="Cartalis permet aux entreprises de visualiser quels collaborateurs génèrent le plus d'interactions grâce à leurs cartes digitales."
        />

        <div className="card" style={{ padding: 28, maxWidth: 1100, margin: "0 auto", width: "100%", boxShadow: "0 12px 56px rgba(0,0,0,0.10)" }}>

          {/* Header bar */}
          <div className="row" style={{ justifyContent: "space-between", paddingBottom: 18, borderBottom: "1px solid var(--line)", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
            <div className="row gap-3" style={{ alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--good)", boxShadow: "0 0 0 3px rgba(45,122,79,0.15)" }}/>
              <div className="serif" style={{ fontSize: 17 }}>Performance des membres</div>
            </div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              <div className="chip">Jan 2026 → Avr 2026</div>
              <div className="chip">Tous les membres</div>
              <div className="chip">Tous les événements</div>
            </div>
          </div>

          {/* KPI cards */}
          <div className="dash-kpi" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Leads ce mois",   val: kpi1, sfx: "",   delta: "↑ +20.3%", sp: sp([88,100,112,118,142]) },
              { label: "Total scans",      val: kpi2, sfx: "",   delta: "↑ +15.1%", sp: sp([142,155,168,185,198]) },
              { label: "Taux conversion",  val: kpi3, sfx: "%",  delta: "↑ +3 pts",  sp: sp([68,71,70,73,74]) },
              { label: "Membres actifs",   val: kpi4, sfx: "/4", delta: "Équipe active", sp: sp([2,3,3,3,3]) },
            ].map((k, i) => (
              <div key={i} style={{
                padding: "16px 18px", borderRadius: 14,
                background: "var(--surface-2)", border: "1px solid var(--line)",
                position: "relative", overflow: "hidden",
                ...FADE(i * 70),
              }}>
                <svg viewBox="0 0 68 24" style={{ position: "absolute", right: 6, bottom: 6, width: 68, height: 24, opacity: 0.18, pointerEvents: "none" }}>
                  <path d={k.sp} fill="none" stroke="#b8843e" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-3)", marginBottom: 8 }}>{k.label}</div>
                <div className="serif" style={{ fontSize: 34, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 6 }}>{k.val}{k.sfx}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--good,#2d7a4f)" }}>{k.delta}</div>
              </div>
            ))}
          </div>

          {/* Area chart */}
          <div style={{ padding: "18px 18px 12px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--line)", marginBottom: 18, ...FADE(300) }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div className="serif" style={{ fontSize: 15 }}>Évolution des leads</div>
                <div className="dim" style={{ fontSize: 11, marginTop: 1 }}>Avril 2026 · 30 jours</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="serif" style={{ fontSize: 22, letterSpacing: "-0.02em", lineHeight: 1 }}>142</div>
                <div style={{ fontSize: 11, color: "var(--good,#2d7a4f)", fontWeight: 500 }}>↑ +24 vs mars</div>
              </div>
            </div>

            <div style={{
              clipPath: vis ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 1300ms cubic-bezier(0.25,0.1,0.25,1) 380ms",
            }}>
              <svg viewBox={`0 0 ${cW} ${cH + 8}`} style={{ width: "100%", height: 110, display: "block", overflow: "visible" }}
                onMouseLeave={() => setHoveredDay(null)}>
                <defs>
                  <linearGradient id="dpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b8843e" stopOpacity="0.20"/>
                    <stop offset="90%" stopColor="#b8843e" stopOpacity="0.01"/>
                  </linearGradient>
                </defs>
                {[0,0.33,0.66,1].map((f, gi) => {
                  const gy = pY + (1 - f) * (cH - pY * 2);
                  return <line key={gi} x1={pX} y1={gy} x2={cW-pX} y2={gy} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 6" opacity="0.8"/>;
                })}
                <path d={areaPath} fill="url(#dpGrad)"/>
                <path d={linePath} fill="none" stroke="#b8843e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                {pts.map((p, i) => (
                  <g key={i}>
                    <rect x={p.x - 10} y={0} width={20} height={cH} fill="transparent" style={{ cursor: "crosshair" }} onMouseEnter={() => setHoveredDay(i)}/>
                    {hoveredDay === i && (
                      <g>
                        <line x1={p.x} y1={pY} x2={p.x} y2={cH - pY} stroke="#b8843e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5"/>
                        <circle cx={p.x} cy={p.y} r={4.5} fill="white" stroke="#b8843e" strokeWidth="2.5"/>
                        <circle cx={p.x} cy={p.y} r={2} fill="#b8843e"/>
                        <rect x={Math.max(2, Math.min(p.x - 26, cW - 60))} y={p.y - 31} width={52} height={24} rx={6} fill="#1a1815" opacity="0.9"/>
                        <text x={Math.max(2, Math.min(p.x - 26, cW - 60)) + 26} y={p.y - 15} textAnchor="middle" fill="white" fontSize="10.5" fontWeight="600" fontFamily="system-ui">{p.val} leads</text>
                        <text x={Math.max(2, Math.min(p.x - 26, cW - 60)) + 26} y={p.y - 3} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="9" fontFamily="system-ui">{p.day} avr</text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: pX, paddingRight: pX, marginTop: 3 }}>
              {["1 avr","8 avr","15 avr","22 avr","30 avr"].map((l,i) => (
                <div key={i} className="dim" style={{ fontSize: 10 }}>{l}</div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }} className="dash-grid">

            {/* Barchart membres */}
            <div style={{ padding: 20, borderRadius: 14, border: "1px solid var(--line)", background: "var(--surface-2)", ...FADE(450) }}>
              <div className="serif" style={{ fontSize: 15, marginBottom: 2 }}>Performance membres</div>
              <div className="dim" style={{ fontSize: 11, marginBottom: 18 }}>Leads générés · classement</div>
              <div className="col gap-5">
                {active.map((c, i) => {
                  const pct = (c.leads / (active[0]?.leads || 1)) * 100;
                  return (
                    <div key={c.id}>
                      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div className="row gap-3" style={{ alignItems: "center" }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                            background: i === 0 ? "linear-gradient(135deg,#b8843e,#d4a855)" : "var(--surface-3)",
                            color: i === 0 ? "white" : "var(--ink-3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, fontWeight: 700,
                          }}>
                            {i === 0 ? <Icon.Crown size={11}/> : `#${i+1}`}
                          </div>
                          <div className="col" style={{ gap: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{c.prenom} {c.nom}</div>
                            <div className="dim" style={{ fontSize: 10 }}>{c.poste}</div>
                          </div>
                        </div>
                        <div className="row gap-1" style={{ alignItems: "baseline" }}>
                          <span className="serif" style={{ fontSize: 20 }}>{c.leads}</span>
                          <span className="dim" style={{ fontSize: 10 }}>leads</span>
                        </div>
                      </div>
                      <div style={{ height: 7, background: "var(--surface)", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: vis ? `${pct}%` : "0%",
                          background: barColors[i] || barColors[2],
                          borderRadius: 999,
                          transition: `width 950ms cubic-bezier(0.34,1.56,0.64,1) ${600 + i * 130}ms`,
                        }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donut + Top 3 */}
            <div style={{ padding: 20, borderRadius: 14, border: "1px solid var(--line)", ...FADE(580) }}>
              <div className="serif" style={{ fontSize: 15, marginBottom: 2 }}>Répartition événements</div>
              <div className="dim" style={{ fontSize: 11, marginBottom: 14 }}>142 leads · Avr 2026</div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <svg viewBox="0 0 128 128" style={{ width: 96, height: 96, transform: "rotate(-90deg)" }}>
                    <circle cx={dcx} cy={dcy} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={15}/>
                    {donutSegs.map((seg, i) => (
                      <circle key={i} cx={dcx} cy={dcy} r={r} fill="none"
                        stroke={seg.color} strokeWidth={15} strokeLinecap="butt"
                        strokeDasharray={`${vis ? seg.dashLen : 0} ${circ}`}
                        strokeDashoffset={seg.cumOffset}
                        style={{ transition: `stroke-dasharray 900ms cubic-bezier(0.34,1.56,0.64,1) ${680 + i * 100}ms` }}
                      />
                    ))}
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div className="serif" style={{ fontSize: 18, lineHeight: 1 }}>142</div>
                    <div className="dim" style={{ fontSize: 9 }}>leads</div>
                  </div>
                </div>
                <div className="col gap-2" style={{ flex: 1 }}>
                  {eventData.map((e, i) => (
                    <div key={i} className="row" style={{ alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color, flexShrink: 0 }}/>
                      <div className="col" style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 500 }}>{e.label}</div>
                        <div className="dim" style={{ fontSize: 9 }}>{e.pct}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
                <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>Top 3 du mois</div>
                  <div className="dim" style={{ fontSize: 10 }}>Leads générés</div>
                </div>
                <div className="col gap-2">
                  {active.slice(0, 3).map((c, i) => (
                    <div key={c.id} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "9px 12px",
                      background: i === 0 ? "linear-gradient(90deg,#fffaf0,var(--surface))" : "var(--surface-2)",
                      border: i === 0 ? "1px solid #ecd5a8" : "1px solid var(--line)",
                      borderRadius: 10, justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                          background: i === 0 ? "linear-gradient(135deg,var(--gold-2),var(--gold))" : i === 1 ? "var(--ink-4)" : "var(--surface-3)",
                          color: i < 2 ? "white" : "var(--ink-3)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, fontWeight: 600,
                        }}>{i === 0 ? <Icon.Crown size={11}/> : `#${i+1}`}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{c.prenom} {c.nom}</div>
                          <div className="dim" style={{ fontSize: 10 }}>{c.poste}</div>
                        </div>
                      </div>
                      <div className="serif" style={{ fontSize: 18, color: i === 0 ? "var(--gold)" : "var(--ink)" }}>{c.leads}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
          .dash-kpi  { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  );
}

// ---------- ScanPreviewSection — ce que le prospect voit après le scan ----------
const SCAN_CARD_DATA = {
  id: "scan-demo",
  design: "design-mon-fugi-vangog",
  nom_affiche: "Bernard",
  prenom_affiche: "Sophie",
  entreprise_affiche: "Agence Lumière",
  poste_affiche: "Consultante senior",
  telephone_affiche: "06 45 78 23 91",
  email_affiche: "s.bernard@agence-lumiere.fr",
  site_web: "agence-lumiere.fr",
  afficher_nom: true, afficher_prenom: true, afficher_entreprise: true,
  afficher_poste: true, afficher_telephone: true, afficher_email: true, afficher_site_web: true,
  positions: {
    name:       { x: 50, y: 26 },
    entreprise: { x: 50, y: 41 },
    poste:      { x: 50, y: 52 },
    phone:      { x: 50, y: 65 },
    email:      { x: 50, y: 75 },
    web:        { x: 50, y: 85 },
    logoVerso:  { x: 50, y: 13 },
  },
};

function ScanPreviewSection() {
  const [scanFlipped, setScanFlipped] = useStateL(false);
  const scrollRef = React.useRef(null);
  const scanDesign = window.CARTALIS_DATA.cardDesigns.find(d => d.id === "design-mon-fugi-vangog")
    || window.CARTALIS_DATA.cardDesigns[0];

  // Auto-flip la carte toutes les 3 s
  useEffectL(() => {
    const t = setInterval(() => setScanFlipped(f => !f), 3000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll fluide haut ↔ bas pour révéler les icônes sociales
  useEffectL(() => {
    let dir = 1;
    let raf;
    let last = 0;
    const step = (ts) => {
      if (ts - last > 20) { // ~50 fps max
        last = ts;
        if (scrollRef.current) {
          const el = scrollRef.current;
          el.scrollTop += dir * 0.8;
          if (el.scrollTop >= el.scrollHeight - el.clientHeight - 2) dir = -1;
          else if (el.scrollTop <= 0) dir = 1;
        }
      }
      raf = requestAnimationFrame(step);
    };
    // Démarre après 1.2 s pour laisser le temps de voir la position initiale
    const t = setTimeout(() => { raf = requestAnimationFrame(step); }, 1200);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section style={{ padding: "120px 0" }} className="section-bg-soft">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="scan-grid">

          {/* Left — explication */}
          <div className="col gap-8 fade-up">
            <SectionHeader
              eyebrow="Expérience prospect"
              title="Ce que voit votre prospect après le scan."
              subtitle="Aucune application à installer. Une page instantanée avec toutes vos coordonnées et les actions clés."
              align="left"
            />
            <div className="col gap-5">
              {[
                { icon: Icon.User,     t: "Enregistrement en 1 clic",  d: "Le prospect ajoute votre contact directement dans son carnet d'adresses." },
                { icon: Icon.WhatsApp, t: "WhatsApp instantané",        d: "Lance une conversation WhatsApp sans saisir de numéro." },
                { icon: Icon.Chart,    t: "Chaque action mesurée",      d: "Scans, clics, contacts enregistrés — tout est visible dans votre dashboard." },
              ].map(({ icon: Ic, t, d }, i) => (
                <div key={i} className="row gap-4" style={{ alignItems: "flex-start" }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                    background: "var(--surface)", border: "1px solid var(--line)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "var(--shadow-1)",
                  }}><Ic size={18} /></div>
                  <div className="col gap-1">
                    <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.01em" }}>{t}</div>
                    <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — phone flottant et légèrement penché */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              transform: "rotate(-4deg) perspective(900px) rotateY(6deg)",
              animation: "float-soft 6s ease-in-out infinite",
              filter: "drop-shadow(0 28px 60px rgba(0,0,0,0.22))",
            }}>
              <div style={{
                width: 290, borderRadius: 44,
                border: "10px solid #1a1a1a",
                outline: "1px solid #333",
                background: "var(--bg)",
                overflow: "hidden", position: "relative",
              }}>
                {/* notch */}
                <div style={{
                  position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                  width: 86, height: 24, background: "#1a1a1a", borderRadius: "0 0 16px 16px", zIndex: 10,
                }} />
                {/* status bar */}
                <div style={{ height: 36, background: "var(--bg)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 20px 4px", fontSize: 10, color: "var(--ink-3)" }}>
                  <span>9:41</span><span style={{ letterSpacing: 1 }}>●●●</span>
                </div>
                {/* scrollable content */}
                <div
                  ref={scrollRef}
                  style={{ padding: "4px 14px 24px", overflowY: "scroll", maxHeight: 540, scrollbarWidth: "none" }}
                >
                  {/* mini header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "var(--ink-3)" }}>← Retour</div>
                    <div className="chip" style={{ fontSize: 10, padding: "2px 8px" }}>Carte scannée</div>
                  </div>

                  {/* carte 3D avec flip auto */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                    <Card3D
                      card={SCAN_CARD_DATA}
                      design={scanDesign}
                      width={242}
                      float={false}
                      flipped={scanFlipped}
                      showQR={false}
                      logoUrl={SCAN_LOGO_URL}
                      logoSide="verso"
                      logoSizeVerso={0.45}
                      fieldSides={{ name: "verso", entreprise: "verso", poste: "verso", phone: "verso", email: "verso", web: "verso" }}
                      fieldSizes={{ name: 1.5, entreprise: 0.95, poste: 0.82, phone: 0.75, email: 0.75, web: 0.75 }}
                      fieldFonts={{ name: "display", entreprise: "display" }}
                      fieldColors={{ name: "#1a150e", entreprise: "#b88a3e", poste: "#6a5a4a", phone: "#2a241a", email: "#2a241a", web: "#2a241a" }}
                    />
                  </div>

                  {/* name + title */}
                  <div style={{ textAlign: "center", marginBottom: 12 }}>
                    <div className="serif" style={{ fontSize: 17, letterSpacing: "-0.01em" }}>
                      {SCAN_CARD_DATA.prenom_affiche} {SCAN_CARD_DATA.nom_affiche}
                    </div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                      {SCAN_CARD_DATA.poste_affiche} · {SCAN_CARD_DATA.entreprise_affiche}
                    </div>
                  </div>

                  {/* contact rows */}
                  <div className="col gap-2" style={{ marginBottom: 12 }}>
                    {[
                      { icon: <Icon.Phone size={11}/>, t: SCAN_CARD_DATA.telephone_affiche },
                      { icon: <Icon.Mail  size={11}/>, t: SCAN_CARD_DATA.email_affiche },
                      { icon: <Icon.Globe size={11}/>, t: SCAN_CARD_DATA.site_web },
                    ].map(({ icon, t }, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "var(--surface-2)", borderRadius: 8, fontSize: 11 }}>
                        <span className="dim">{icon}</span><span>{t}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA principal */}
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 12, padding: "10px 14px", marginBottom: 8 }}>
                    <Icon.User size={12} /> Enregistrer dans mes contacts
                  </button>

                  {/* boutons secondaires */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[
                      { ic: Icon.WhatsApp, t: "WhatsApp" },
                      { ic: Icon.Mail,     t: "Email" },
                      { ic: Icon.User,     t: "Partager mes infos" },
                      { ic: Icon.Globe,    t: "Site web" },
                    ].map(({ ic: Ic, t }, i) => (
                      <button key={i} className="btn btn-sm" style={{ justifyContent: "center", fontSize: 11 }}>
                        <Ic size={11} /> {t}
                      </button>
                    ))}
                  </div>

                  {/* réseaux sociaux */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                    <Icon.Instagram size={36} />
                    <Icon.Linkedin size={36} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) { .scan-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function Metric({ label, value, delta, trend }) {
  return (
    <div style={{ padding: 18, border: "1px solid var(--line)", borderRadius: 14, background: "var(--surface)" }}>
      <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>{label}</div>
      <div className="serif" style={{ fontSize: 28, lineHeight: 1, marginBottom: 6, letterSpacing: "-0.01em" }}>{value}</div>
      <div style={{ fontSize: 12, color: trend === "up" ? "var(--good)" : "var(--ink-4)" }}>{delta}</div>
    </div>
  );
}
window.Metric = Metric;

function PricingSection({ navigate }) {
  return (
    <section id="pricing" style={{ padding: "120px 0" }} className="section-bg-soft">
      <div className="container col gap-10">
        <SectionHeader
          eyebrow="Tarifs"
          title="Choisissez l'offre adaptée à votre activité."
          subtitle="Tous les plans incluent 7 jours d'essai gratuit. Sans engagement."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "stretch" }}>
          <PricingCard
            name="Solo" price="9€" period="/mois"
            tagline="Pour indépendants et commerciaux solo."
            features={[
              "1 carte digitale 3D",
              "QR code personnel",
              "Bouton enregistrer le contact",
              "Bouton WhatsApp",
              "Personnalisation basique",
              "Statistiques personnelles",
              "Essai gratuit 7 jours",
            ]}
            excluded={["Génération IA non incluse"]}
            cta="Commencer en solo"
            onCta={() => navigate("/auth?mode=signup&plan=solo")}
          />
          <PricingCard
            featured
            name="Team" price="49,99€" period="/mois"
            tagline="Pour entreprises jusqu'à 10 collaborateurs."
            features={[
              "Jusqu'à 10 collaborateurs",
              "Carte entreprise partagée",
              "Cartes personnelles",
              "Dashboard équipe",
              "Validation des collaborateurs",
              "Code secret entreprise",
              "Statistiques par collaborateur",
              "Personnalisation avancée",
              "Génération d'image IA",
              "Import logo",
              "Essai gratuit 7 jours",
            ]}
            cta="Créer mon équipe"
            onCta={() => navigate("/auth?mode=signup&plan=team")}
          />
          <PricingCard
            name="Enterprise" price="Sur devis" period=""
            tagline="Pour équipes de plus de 10 collaborateurs."
            features={[
              "Nombre de collaborateurs personnalisé",
              "Accompagnement personnalisé",
              "Design sur mesure",
              "Support prioritaire",
              "Conditions adaptées",
            ]}
            contactPhone="07 67 56 92 24"
            contactEmail="contact.cardly@gmail.com"
            cta="Contacter Cartalis"
            onCta={() => window.location.href = "mailto:contact.cardly@gmail.com"}
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({ name, price, period, tagline, features, excluded, cta, onCta, featured, contactPhone, contactEmail }) {
  return (
    <div className="card" style={{
      padding: 32,
      position: "relative",
      ...(featured ? {
        border: "1.5px solid var(--gold)",
        boxShadow: "var(--shadow-3)",
        background: "linear-gradient(180deg, #fffaf0 0%, var(--surface) 100%)",
      } : {}),
      display: "flex", flexDirection: "column", gap: 18,
    }}>
      {featured && (
        <div className="chip chip-gold" style={{ position: "absolute", top: -12, left: 24 }}>
          <Icon.Star size={11} fill="currentColor" /> Le plus populaire
        </div>
      )}
      <div className="col gap-2">
        <div className="serif" style={{ fontSize: 22 }}>{name}</div>
        <div className="dim" style={{ fontSize: 13 }}>{tagline}</div>
      </div>
      <div className="row gap-1" style={{ alignItems: "baseline" }}>
        <div className="serif" style={{ fontSize: 44, lineHeight: 1, letterSpacing: "-0.02em" }}>{price}</div>
        {period && <div className="dim" style={{ fontSize: 14 }}>{period}</div>}
      </div>
      <div style={{ height: 1, background: "var(--line)" }} />
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {features.map((f, i) => (
          <li key={i} className="row gap-2" style={{ fontSize: 14, alignItems: "flex-start" }}>
            <Icon.Check size={14} /> <span>{f}</span>
          </li>
        ))}
        {excluded && excluded.map((f, i) => (
          <li key={i} className="row gap-2" style={{ fontSize: 14, alignItems: "flex-start", color: "var(--ink-4)" }}>
            <Icon.X size={14} /> <span>{f}</span>
          </li>
        ))}
      </ul>
      {(contactPhone || contactEmail) && (
        <div className="col gap-1" style={{ fontSize: 13, color: "var(--ink-3)" }}>
          {contactPhone && <div className="row gap-2"><Icon.Phone size={12}/>{contactPhone}</div>}
          {contactEmail && <div className="row gap-2"><Icon.Mail size={12}/>{contactEmail}</div>}
        </div>
      )}
      <button className={featured ? "btn btn-gold" : "btn btn-primary"} onClick={onCta} style={{ width: "100%", justifyContent: "center" }}>
        {cta} <Icon.ArrowRight size={14} />
      </button>
    </div>
  );
}
window.PricingCard = PricingCard;

function FAQSection() {
  const items = [
    { q: "Est-ce que Cartalis remplace vraiment une carte papier ?", a: "Oui. L'objectif est de proposer une alternative plus moderne, plus écologique et surtout plus mesurable qu'une carte papier." },
    { q: "Le prospect doit-il installer une application ?", a: "Non. Le prospect scanne simplement le QR code et arrive sur une page web." },
    { q: "Puis-je personnaliser ma carte ?", a: "Oui. Vous pouvez modifier les informations affichées, importer un logo, changer certains éléments visuels et, selon votre plan, générer un visuel par IA." },
    { q: "Comment fonctionne le compte entreprise ?", a: "Le chef d'entreprise obtient un code secret qu'il transmet à ses collaborateurs. Les collaborateurs s'inscrivent avec ce code, puis le chef valide leur accès." },
    { q: "Que se passe-t-il après l'essai gratuit ?", a: "Après 7 jours, les cartes restent visibles dans l'espace utilisateur, mais elles sont floutées et le QR code n'est plus actif tant qu'un abonnement n'est pas choisi." },
  ];
  const [open, setOpen] = useStateL(0);
  return (
    <section id="faq" style={{ padding: "120px 0" }}>
      <div className="container-narrow col gap-10">
        <SectionHeader eyebrow="Questions" title="On répond à tout, simplement." />
        <div className="card" style={{ padding: 8, overflow: "hidden" }}>
          {items.map((it, i) => (
            <div key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid var(--line)" : "none" }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{
                  width: "100%", padding: "20px 24px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  textAlign: "left",
                }}
              >
                <span className="serif" style={{ fontSize: 18, letterSpacing: "-0.01em" }}>{it.q}</span>
                <span style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 200ms" }}>
                  <Icon.ChevronDown size={18} />
                </span>
              </button>
              {open === i && (
                <div className="muted fade-in" style={{ padding: "0 24px 24px", fontSize: 15, lineHeight: 1.6, maxWidth: 640 }}>
                  {it.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ navigate }) {
  return (
    <footer style={{ padding: "60px 0 40px", borderTop: "1px solid var(--line)" }}>
      <div className="container col gap-6">
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div className="col gap-3" style={{ maxWidth: 360 }}>
            <Logo size="md" />
            <div className="muted" style={{ fontSize: 14 }}>La carte de visite qui ne finit pas dans une poche.</div>
          </div>
          <div className="row gap-8" style={{ flexWrap: "wrap" }}>
            <a href="#features" className="muted" style={{ fontSize: 14 }}>Fonctionnement</a>
            <a href="#pricing" className="muted" style={{ fontSize: 14 }}>Tarifs</a>
            <a href="mailto:contact.cardly@gmail.com" className="muted" style={{ fontSize: 14 }}>Contact</a>
            <a href="#/auth?mode=login" onClick={(e) => {e.preventDefault(); navigate("/auth?mode=login");}} className="muted" style={{ fontSize: 14 }}>Connexion</a>
          </div>
        </div>
        <div className="divider" />
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div className="dim" style={{ fontSize: 12 }}>© 2026 Cartalis · Tous droits réservés</div>
          <div className="dim" style={{ fontSize: 12 }}>contact.cardly@gmail.com · 07 67 56 92 24</div>
        </div>
      </div>
    </footer>
  );
}

function LandingPage({ navigate }) {
  return (
    <div>
      <PublicHeader navigate={navigate} />
      <HeroSection navigate={navigate} />
      <CarouselSection />
      <WhySection />
      <ConversionTimeline />
      <ScanPreviewSection />
      <DashboardPreview />
      <PricingSection navigate={navigate} />
      <FAQSection />
      <Footer navigate={navigate} />
    </div>
  );
}
window.LandingPage = LandingPage;
