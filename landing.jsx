/* Cardly Pro — Landing page */

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
    name:       { x: 68, y: 28 },
    entreprise: { x: 60, y: 86 },  // bas de la carte (face recto avec art)
    poste:      { x: 68, y: 47 },
    phone:      { x: 68, y: 60 },
    email:      { x: 68, y: 69 },
    web:        { x: 68, y: 78 },
    logoRecto:  { x: 17, y: 84 },  // logo sur le recto (face non-flipped)
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
              Cardly Pro remplace la carte de visite papier par une carte digitale 3D, interactive et mesurable. Vos prospects scannent, enregistrent votre contact, et vous suivez les interactions générées par vos équipes.
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
                fieldSides={{ name: "verso", entreprise: "recto", poste: "verso", phone: "verso", email: "verso", web: "verso" }}
                fieldSizes={{ entreprise: 1.15 }}
                fieldColors={{ entreprise: "#2a241a" }}
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
  const designs = window.CARDLY_DATA.cardDesigns;
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
          eyebrow="Pourquoi Cardly"
          title="Une carte papier se donne. Une carte digitale convertit."
          subtitle="Une carte de visite classique dépend de la mémoire du prospect. Cardly Pro transforme ce moment en action immédiate : scanner, enregistrer, contacter."
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
          subtitle="Cardly Pro transforme une interaction physique en relation digitale. Le prospect ne repart pas seulement avec votre nom : il peut enregistrer votre contact, ouvrir une conversation et garder un lien direct avec vous."
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
  const collabs = window.CARDLY_DATA.collaborators;
  return (
    <section style={{ padding: "120px 0", position: "relative" }}>
      <div className="container col gap-10">
        <SectionHeader
          eyebrow="Dashboard"
          title="Suivez les performances de vos équipes."
          subtitle="Cardly Pro permet aux entreprises de visualiser quels collaborateurs génèrent le plus d'interactions grâce à leurs cartes digitales."
        />

        <div className="card" style={{ padding: 24, maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          {/* tab-bar */}
          <div className="row" style={{ justifyContent: "space-between", paddingBottom: 16, borderBottom: "1px solid var(--line)", marginBottom: 20 }}>
            <div className="row gap-3" style={{ alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--good)" }} />
              <div className="serif" style={{ fontSize: 18 }}>Performance équipe</div>
            </div>
            <div className="row gap-2">
              <div className="chip">Avril 2026</div>
              <div className="chip">Toute l'équipe</div>
            </div>
          </div>
          {/* metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
            <Metric label="Total leads" value="142" delta="+24 ce mois" trend="up" />
            <Metric label="Clics enregistrer" value="98" delta="+18%" trend="up" />
            <Metric label="Top collaborateur" value="Emma L." delta="42 leads" trend="neutral" />
            <Metric label="Collaborateurs actifs" value="3" delta="sur 4" trend="neutral" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }} className="dash-grid">
            {/* chart */}
            <div className="col gap-4" style={{ padding: 20, border: "1px solid var(--line)", borderRadius: 16, background: "var(--surface-2)" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="serif" style={{ fontSize: 16 }}>Leads par jour</div>
                <div className="dim" style={{ fontSize: 12 }}>30 derniers jours</div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 130 }}>
                {[40, 60, 35, 80, 55, 70, 90, 65, 100, 75, 88, 95, 70, 110, 85, 95, 120, 100, 90, 130, 110, 95, 140, 115, 105, 125, 100, 130, 110, 142].map((h, i) => (
                  <div key={i} className="bar" style={{ height: `${h * 0.6}%`, flex: 1, opacity: 0.4 + (i / 30) * 0.6 }} />
                ))}
              </div>
            </div>
            {/* leaderboard */}
            <div className="col gap-3" style={{ padding: 20, border: "1px solid var(--line)", borderRadius: 16 }}>
              <div className="serif" style={{ fontSize: 16 }}>Classement</div>
              {collabs.filter(c => c.statut === "actif").sort((a,b) => b.leads - a.leads).map((c, i) => (
                <div key={c.id} className="row gap-3" style={{ justifyContent: "space-between" }}>
                  <div className="row gap-3">
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: i === 0 ? "var(--gold)" : i === 1 ? "var(--ink-4)" : "var(--surface-3)",
                      color: i < 2 ? "white" : "var(--ink-3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 600,
                    }}>{i+1}</div>
                    <div className="col">
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{c.prenom} {c.nom}</div>
                      <div className="dim" style={{ fontSize: 12 }}>{c.poste}</div>
                    </div>
                  </div>
                  <div className="serif" style={{ fontSize: 18 }}>{c.leads}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) { .dash-grid { grid-template-columns: 1fr !important; } }
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
            cta="Contacter Cardly Pro"
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
    { q: "Est-ce que Cardly Pro remplace vraiment une carte papier ?", a: "Oui. L'objectif est de proposer une alternative plus moderne, plus écologique et surtout plus mesurable qu'une carte papier." },
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
          <div className="dim" style={{ fontSize: 12 }}>© 2026 Cardly Pro · Tous droits réservés</div>
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
      <DashboardPreview />
      <PricingSection navigate={navigate} />
      <FAQSection />
      <Footer navigate={navigate} />
    </div>
  );
}
window.LandingPage = LandingPage;
