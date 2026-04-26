/* Cardly Pro — App shell + Mes cartes + Personnalisation */

const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

// ---------- App shell ----------
function AppLayout({ navigate, params, children, tab, setTab, role, plan, trialExpired, onLogout, onUpgrade }) {
  const [menuOpen, setMenuOpen] = useStateP(false);
  const tabs = [
    { id: "cards", label: "Mes cartes", icon: <Icon.Card size={16} /> },
    { id: "customize", label: "Personnalisation", icon: <Icon.Brush size={16} /> },
    { id: "dashboard", label: "Dashboard", icon: <Icon.Chart size={16} /> },
    { id: "secret", label: "Code secret", icon: <Icon.Key size={16} />, adminOnly: false },
    { id: "subscription", label: "Abonnement", icon: <Icon.Crown size={16} /> },
  ];
  const visibleTabs = tabs;
  const tabLabel = visibleTabs.find(t => t.id === tab)?.label || "";
  const me = window.CARDLY_DATA.profileMe;
  const ent = window.CARDLY_DATA.entreprise;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(251,250,247,0.85)",
        backdropFilter: "blur(16px) saturate(140%)",
        WebkitBackdropFilter: "blur(16px) saturate(140%)",
        borderBottom: "1px solid var(--line)",
      }}>
        <div className="container-wide row" style={{ height: 64, justifyContent: "space-between" }}>
          <div className="row gap-3">
            <button className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(true)} style={{ padding: 8 }}>
              <Icon.Menu size={20} />
            </button>
            <div style={{ width: 1, height: 24, background: "var(--line)" }} className="hide-md" />
            <div className="row gap-2 hide-md"><Logo size="sm" /></div>
          </div>
          <div className="serif hide-md" style={{ fontSize: 17, letterSpacing: "-0.01em" }}>{tabLabel}</div>
          <div className="row gap-3">
            <div className="chip chip-jade hide-md">
              <span className="chip-dot"></span>
              {plan === "team" ? "Team" : plan === "solo" ? "Solo" : "Enterprise"}
            </div>
            <div className="row gap-2" style={{ alignItems: "center" }}>
              <div className="col hide-md" style={{ alignItems: "flex-end", lineHeight: 1.2 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{me.prenom} {me.nom}</div>
                <div className="dim" style={{ fontSize: 11 }}>{ent.nom_entreprise}</div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--gold-2), var(--gold))",
                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 600,
              }}>{me.prenom[0]}{me.nom[0]}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Burger drawer */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{
            position: "fixed", inset: 0, background: "rgba(20,15,5,0.4)",
            zIndex: 100, animation: "fade-in 200ms ease",
          }} />
          <aside style={{
            position: "fixed", top: 0, left: 0, bottom: 0, width: 300, zIndex: 101,
            background: "var(--surface)", borderRight: "1px solid var(--line)",
            padding: 24, display: "flex", flexDirection: "column", gap: 24,
            animation: "slidein 250ms ease",
          }}>
            <style>{`@keyframes slidein { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <Logo size="md" />
              <button className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)} style={{ padding: 6 }}><Icon.X size={18} /></button>
            </div>
            <div className="card" style={{ padding: 14, background: "var(--surface-2)" }}>
              <div className="row gap-2">
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--gold-2), var(--gold))",
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600,
                }}>{me.prenom[0]}{me.nom[0]}</div>
                <div className="col" style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{me.prenom} {me.nom}</div>
                  <div className="dim" style={{ fontSize: 12 }}>{role === "admin" ? "Admin · " : ""}{ent.nom_entreprise}</div>
                </div>
              </div>
            </div>
            <nav className="col gap-1" style={{ flex: 1 }}>
              {visibleTabs.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setMenuOpen(false); }} style={{
                  display: "flex", gap: 12, alignItems: "center", padding: "12px 14px",
                  borderRadius: 10, fontSize: 14, textAlign: "left",
                  background: tab === t.id ? "var(--surface-2)" : "transparent",
                  fontWeight: tab === t.id ? 500 : 400,
                  color: tab === t.id ? "var(--ink)" : "var(--ink-3)",
                }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </nav>
            <button className="btn btn-ghost" onClick={onLogout} style={{ justifyContent: "flex-start" }}>
              <Icon.Logout size={16} /> Déconnexion
            </button>
          </aside>
        </>
      )}

      <main className="container-wide" style={{ paddingTop: 32, paddingBottom: 80 }}>
        {trialExpired && tab !== "subscription" && tab !== "secret" && (
          <div className="card fade-up" style={{ padding: 16, marginBottom: 20, background: "linear-gradient(135deg, #fffaf0, #fdf3df)", borderColor: "#ecd5a8" }}>
            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div className="row gap-3">
                <Icon.Lock size={18} />
                <div className="col">
                  <div style={{ fontWeight: 500 }}>Votre essai gratuit est terminé</div>
                  <div className="dim" style={{ fontSize: 12 }}>Choisissez un abonnement pour réactiver vos QR codes.</div>
                </div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={onUpgrade}>Choisir un abonnement <Icon.ArrowRight size={13} /></button>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
window.AppLayout = AppLayout;

// ---------- Mes cartes ----------
function MyCardsPage({ onCustomize, onShareCard, role, trialExpired, onUpgrade }) {
  const [cards, setCards] = useStateP(window.CARDLY_DATA.cards);
  const [showAdd, setShowAdd] = useStateP(false);
  const [newName, setNewName] = useStateP("");
  const toast = useToast();

  const addCard = () => {
    if (!newName.trim()) return;
    const designs = window.CARDLY_DATA.cardDesigns;
    const designId = designs[(cards.length) % designs.length].id;
    const next = {
      ...window.CARDLY_DATA.cards[1],
      id: "card-" + Math.random().toString(36).slice(2, 6),
      type: "personal",
      nom_carte: newName.trim(),
      design: designId,
      is_default: false,
    };
    setCards([...cards, next]);
    setShowAdd(false);
    setNewName("");
    toast.push("Carte créée");
  };

  return (
    <div className="col gap-6" style={{ position: "relative" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div className="col gap-2">
          <div className="eyebrow">Espace · {window.CARDLY_DATA.entreprise.nom_entreprise}</div>
          <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Mes cartes</h1>
          <p className="muted" style={{ margin: 0, fontSize: 15 }}>Retrouvez vos cartes digitales et partagez-les en un scan.</p>
        </div>
        <div className="row gap-2">
          <div className="chip chip-gold"><Icon.Sparkle size={11} /> 7 jours d'essai · 4 jours restants</div>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        {trialExpired && <LockedOverlay onUpgrade={onUpgrade} />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
          {cards.map(c => <CardListItem key={c.id} card={c} onCustomize={onCustomize} onShare={onShareCard} role={role} />)}
          <AddCardTile onClick={() => setShowAdd(true)} />
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nouvelle carte personnelle">
        <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>Donnez un nom à votre nouvelle carte. Vous pourrez la personnaliser ensuite.</p>
        <Field label="Nom de la carte" placeholder="Ex : Salons & événements" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <div className="row gap-3" style={{ justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-sm" onClick={() => setShowAdd(false)}>Annuler</button>
          <button className="btn btn-primary btn-sm" onClick={addCard}>Créer la carte</button>
        </div>
      </Modal>
    </div>
  );
}
window.MyCardsPage = MyCardsPage;

function Field({ label, ...rest }) {
  return (
    <div className="field"><label>{label}</label><input className="input" {...rest} /></div>
  );
}

function CardListItem({ card, onCustomize, onShare, role }) {
  const toast = useToast();
  const [presenting, setPresenting] = useStateP(false);
  const isLocked = role === "collaborator" && card.type === "enterprise";
  return (
    <div className="card fade-up" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="col gap-1">
          <div className="row gap-2" style={{ alignItems: "center" }}>
            <div className="serif" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>{card.nom_carte}</div>
            {card.is_default && <span className="chip chip-gold">Défaut</span>}
          </div>
          <div className="dim" style={{ fontSize: 12 }}>{card.type === "enterprise" ? "Carte entreprise" : "Carte personnelle"} · {window.CARDLY_DATA.getDesign(card.design).label}</div>
        </div>
        <div className="row gap-1">
          <button className="btn btn-ghost btn-sm" onClick={() => onCustomize(card.id)} title="Personnaliser"><Icon.Brush size={14} /></button>
          <button className="btn btn-ghost btn-sm" onClick={() => onShare(card.id)} title="Aperçu public"><Icon.QR size={14} /></button>
        </div>
      </div>

      <button
        onClick={() => setPresenting(true)}
        style={{ display: "flex", justifyContent: "center", padding: "8px 0", background: "transparent", border: 0, cursor: "pointer" }}
        title="Présenter au client"
      >
        <Card3D card={card} width={320} float={true} />
      </button>

      {isLocked && (
        <div className="chip" style={{ alignSelf: "flex-start", background: "var(--surface-2)" }}>
          <Icon.Lock size={11} /> Design géré par votre admin
        </div>
      )}

      <div className="row gap-2" style={{ flexWrap: "wrap" }}>
        <button className="btn btn-primary btn-sm" style={{ flex: 1, minWidth: 140, justifyContent: "center" }} onClick={() => setPresenting(true)}>
          <Icon.QR size={13} /> Présenter au client
        </button>
        <button className="btn btn-sm" style={{ flex: 1, minWidth: 120, justifyContent: "center" }} onClick={() => toast.push("WhatsApp ouvert", { icon: <Icon.WhatsApp size={13}/> })}>
          <Icon.WhatsApp size={13} /> WhatsApp
        </button>
      </div>

      {presenting && ReactDOM.createPortal(<PresentCardModal card={card} onClose={() => setPresenting(false)} />, document.body)}
    </div>
  );
}

function PresentCardModal({ card, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(20, 18, 14, 0.78)", backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, animation: "fade-in 200ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          maxWidth: 880, width: "100%", padding: 40,
          display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 36,
          background: "linear-gradient(180deg, #fffdf6, #f6efde)",
          position: "relative", animation: "fade-up 280ms cubic-bezier(.2,.8,.2,1) both",
        }}
      >
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm"
          style={{ position: "absolute", top: 16, right: 16, padding: 6 }}
          title="Fermer"
        ><Icon.X size={16} /></button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Card3D card={card} width={420} float={true} />
        </div>

        <div className="col gap-4" style={{ justifyContent: "center" }}>
          <div className="col gap-1">
            <div className="eyebrow">Présenter à votre client</div>
            <div className="serif" style={{ fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{card.nom_carte}</div>
            <div className="dim" style={{ fontSize: 13 }}>Approchez l'écran de votre client. Il scanne le QR ou tient son téléphone près de la carte.</div>
          </div>

          <div style={{
            background: "white", padding: 16, borderRadius: 16,
            border: "1px solid var(--line)", boxShadow: "var(--shadow-1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            alignSelf: "flex-start",
          }}>
            <FakeQR seed={card.id} size={180} />
          </div>

          <div className="row gap-2" style={{ alignItems: "center" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--gold-3)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Icon.Sparkle size={16} />
            </div>
            <div className="col" style={{ gap: 2 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>NFC actif</div>
              <div className="dim" style={{ fontSize: 12 }}>Le client peut aussi approcher son téléphone de votre carte physique.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FakeQR({ seed = "x", size = 180 }) {
  // deterministic pseudo-QR pattern
  const N = 21;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 0xffffffff; };
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const isFinder = (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
    if (isFinder) continue;
    if (rand() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#1a1815"/>);
  }
  const Finder = ({ tx, ty }) => (
    <g transform={`translate(${tx},${ty})`}>
      <rect x="0" y="0" width="7" height="7" fill="#1a1815"/>
      <rect x="1" y="1" width="5" height="5" fill="white"/>
      <rect x="2" y="2" width="3" height="3" fill="#1a1815"/>
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges">
      {cells}
      <Finder tx={0} ty={0} />
      <Finder tx={N - 7} ty={0} />
      <Finder tx={0} ty={N - 7} />
    </svg>
  );
}

function AddCardTile({ onClick }) {
  return (
    <button onClick={onClick} className="card" style={{
      padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 14, minHeight: 460, border: "1.5px dashed var(--line-2)",
      background: "transparent", cursor: "pointer", transition: "all 200ms",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.background = "var(--surface-2)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: "var(--surface-2)", border: "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}><Icon.Plus size={22} /></div>
      <div className="serif" style={{ fontSize: 18 }}>Ajouter une carte</div>
      <div className="dim" style={{ fontSize: 13, textAlign: "center", maxWidth: 220 }}>Créez une carte personnelle pour un événement ou un projet précis.</div>
    </button>
  );
}

// ---------- Personnalisation : sélecteur ----------
function CustomizePickerPage({ onPick, role, trialExpired, onUpgrade }) {
  const cards = window.CARDLY_DATA.cards;
  return (
    <div className="col gap-6" style={{ position: "relative" }}>
      <div className="col gap-2">
        <div className="eyebrow">Personnalisation</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Quelle carte souhaitez-vous personnaliser&nbsp;?</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Sélectionnez une carte pour modifier son design, ses champs et la position des éléments sur le verso.</p>
      </div>
      <div style={{ position: "relative" }}>
        {trialExpired && <LockedOverlay onUpgrade={onUpgrade} />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
          {cards.map(c => {
            const locked = role === "collaborator" && c.type === "enterprise";
            return (
              <button
                key={c.id}
                onClick={() => onPick(c.id)}
                className="card fade-up"
                style={{
                  padding: 22, textAlign: "left", cursor: "pointer",
                  display: "flex", flexDirection: "column", gap: 16,
                  background: "linear-gradient(180deg, #fffdf6, #f7f2e6)",
                  transition: "transform 200ms, box-shadow 200ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
              >
                <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div className="col gap-1">
                    <div className="serif" style={{ fontSize: 18, letterSpacing: "-0.01em" }}>{c.nom_carte}</div>
                    <div className="dim" style={{ fontSize: 12 }}>
                      {c.type === "enterprise" ? "Carte entreprise" : "Carte personnelle"} · {window.CARDLY_DATA.getDesign(c.design).label}
                    </div>
                  </div>
                  {c.is_default && <span className="chip chip-gold">Défaut</span>}
                </div>
                <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                  <Card3D card={c} width={260} float={true} />
                </div>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center", paddingTop: 4, borderTop: "1px solid var(--line)" }}>
                  {locked ? (
                    <span className="chip" style={{ background: "var(--surface-2)" }}><Icon.Lock size={11}/> Design verrouillé</span>
                  ) : (
                    <span className="dim" style={{ fontSize: 12 }}>Cliquez pour personnaliser</span>
                  )}
                  <span className="row gap-1" style={{ fontSize: 13, fontWeight: 500, color: "var(--gold-deep)" }}>
                    <Icon.Brush size={13}/> Personnaliser <Icon.ArrowRight size={12}/>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
window.CustomizePickerPage = CustomizePickerPage;

// ---------- Personnalisation ----------
function CustomizationPage({ cardId, role, plan, trialExpired, onUpgrade, onBack }) {
  const original = window.CARDLY_DATA.cards.find(c => c.id === cardId) || window.CARDLY_DATA.cards[0];
  const [card, setCard] = useStateP({ ...original, positions: { ...original.positions } });
  const [flipped, setFlipped] = useStateP(true);
  const [showAIModal, setShowAIModal] = useStateP(false);
  const [aiBlocked, setAIBlocked] = useStateP(false);
  const [aiLoading, setAILoading] = useStateP(false);
  const [aiPrompt, setAIPrompt] = useStateP("");
  const [logoUrl, setLogoUrl] = useStateP(null);
  const toast = useToast();
  const isAdminOnEnterprise = card.type === "enterprise" && role === "collaborator";
  const editable = !isAdminOnEnterprise;

  const designs = window.CARDLY_DATA.cardDesigns;
  const setField = (k, v) => setCard(c => ({ ...c, [k]: v }));
  const movePos = (key, pos) => setCard(c => ({ ...c, positions: { ...c.positions, [key]: pos } }));

  const onAIClick = () => {
    if (plan !== "team") { setAIBlocked(true); return; }
    setShowAIModal(true);
  };
  const runAI = () => {
    setAILoading(true);
    setTimeout(() => {
      setAILoading(false);
      setShowAIModal(false);
      toast.push("Visuel généré", { icon: <Icon.Sparkle size={14}/> });
    }, 1800);
  };

  return (
    <div className="col gap-6" style={{ position: "relative" }}>
      <div className="col gap-2">
        {onBack && (
          <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ alignSelf: "flex-start", marginBottom: 4, padding: "6px 10px" }}>
            <Icon.ArrowLeft size={13} /> Toutes mes cartes
          </button>
        )}
        <div className="eyebrow">Personnalisation</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>{card.nom_carte}</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Glissez les éléments sur le verso pour les replacer. Activez ou masquez chaque champ.</p>
      </div>

      <div style={{ position: "relative" }}>
        {trialExpired && <LockedOverlay onUpgrade={onUpgrade} />}

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28 }} className="cust-grid">
          {/* Card preview */}
          <div className="card" style={{ padding: 36, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, background: "linear-gradient(180deg, #fffdf6, #f7f2e6)", alignSelf: "stretch" }}>
            {isAdminOnEnterprise && (
              <div className="card" style={{ padding: 14, background: "var(--surface-2)", borderColor: "var(--line)", fontSize: 13, color: "var(--ink-3)", textAlign: "center" }}>
                Cette carte est gérée par votre entreprise. Vous pouvez l'utiliser avec vos informations, mais seul un administrateur peut modifier son design.
              </div>
            )}
            <Card3D
              card={card}
              flipped={flipped}
              onFlip={() => setFlipped(!flipped)}
              width={420}
              editable={editable}
              onMove={movePos}
              float={false}
              logoUrl={logoUrl}
            />
            <div className="row gap-2">
              <button className="btn btn-sm" onClick={() => setFlipped(!flipped)}><Icon.Refresh size={13}/> Tester le flip</button>
            </div>
          </div>

          {/* Panel */}
          <div className="col gap-4">
            {/* Designs */}
            <div className="card" style={{ padding: 20 }}>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
                <div className="serif" style={{ fontSize: 17 }}>Modèle</div>
                <span className="chip">{window.CARDLY_DATA.getDesign(card.design).label}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {designs.map(d => (
                  <button key={d.id} disabled={!editable} onClick={() => setField("design", d.id)} style={{
                    aspectRatio: "1.6/1", borderRadius: 10,
                    background: d.front ? `url(${d.front}) center/cover` : (d.bg || "linear-gradient(135deg,#fff,#f6f3ec)"),
                    border: card.design === d.id ? "2px solid var(--gold)" : "1px solid var(--line)",
                    boxShadow: card.design === d.id ? "0 0 0 3px rgba(184,138,62,0.15)" : "none",
                    cursor: editable ? "pointer" : "not-allowed",
                    opacity: editable ? 1 : 0.5,
                    transition: "all 150ms",
                  }} title={d.label} />
                ))}
              </div>
            </div>

            {/* Visibility toggles */}
            <div className="card" style={{ padding: 20 }}>
              <div className="serif" style={{ fontSize: 17, marginBottom: 14 }}>Champs visibles</div>
              <div className="col gap-1">
                {[
                  ["afficher_prenom", "Prénom"],
                  ["afficher_nom", "Nom"],
                  ["afficher_entreprise", "Nom de l'entreprise"],
                  ["afficher_poste", "Poste"],
                  ["afficher_telephone", "Téléphone"],
                  ["afficher_email", "Email"],
                  ["afficher_site_web", "Site web"],
                ].map(([k, label]) => (
                  <button key={k} disabled={!editable} onClick={() => setField(k, !card[k])} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 4px", fontSize: 14,
                    borderTop: "1px solid var(--line)",
                    cursor: editable ? "pointer" : "not-allowed",
                    opacity: editable ? 1 : 0.6,
                  }}>
                    <span>{label}</span>
                    <span className={`toggle ${card[k] ? "on" : ""}`}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand actions */}
            <div className="card" style={{ padding: 20 }}>
              <div className="serif" style={{ fontSize: 17, marginBottom: 14 }}>Identité</div>
              <div className="col gap-3">
                <UploadZone disabled={!editable} onLogo={(url) => { setLogoUrl(url); setFlipped(true); }} hasLogo={!!logoUrl} onClear={() => setLogoUrl(null)} />
                <button className="btn" disabled={!editable} onClick={onAIClick}>
                  <Icon.Sparkle size={14} /> Générer une image IA
                  {plan !== "team" && <span className="chip chip-gold" style={{ marginLeft: "auto", fontSize: 10 }}>Team</span>}
                </button>
                <button className="btn btn-primary" disabled={!editable} onClick={() => toast.push("Modifications sauvegardées")}>
                  <Icon.Check size={14} /> Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={showAIModal} onClose={() => setShowAIModal(false)} title="Générer un visuel par IA">
        <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>Décrivez le visuel idéal pour le recto de votre carte.</p>
        <textarea className="textarea" placeholder="Exemple : carte blanche premium avec reflets dorés, relief subtil, style luxe immobilier" value={aiPrompt} onChange={(e) => setAIPrompt(e.target.value)} />
        <div className="row gap-3" style={{ justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-sm" onClick={() => setShowAIModal(false)}>Annuler</button>
          <button className="btn btn-gold btn-sm" onClick={runAI} disabled={aiLoading}>
            {aiLoading ? "Génération…" : "Générer le visuel"}
            <Icon.Sparkle size={13} />
          </button>
        </div>
        {aiLoading && (
          <div style={{
            marginTop: 14, height: 6, borderRadius: 999, overflow: "hidden",
            background: "var(--surface-2)",
          }}>
            <div style={{
              height: "100%", width: "40%",
              background: "linear-gradient(90deg, var(--gold-2), var(--gold))",
              animation: "shimmer 1.4s linear infinite",
              backgroundSize: "200% 100%",
            }} />
          </div>
        )}
      </Modal>

      <Modal open={aiBlocked} onClose={() => setAIBlocked(false)} title="Fonctionnalité Team">
        <p className="muted" style={{ marginTop: 0 }}>La génération IA est disponible avec le plan Team. Passez à Team pour générer des visuels uniques par IA.</p>
        <div className="row gap-3" style={{ justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-sm" onClick={() => setAIBlocked(false)}>Plus tard</button>
          <button className="btn btn-gold btn-sm" onClick={() => { setAIBlocked(false); onUpgrade(); }}>
            Voir les plans <Icon.ArrowRight size={13} />
          </button>
        </div>
      </Modal>

      <style>{`@media (max-width: 900px) { .cust-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
window.CustomizationPage = CustomizationPage;

function UploadZone({ disabled, onLogo, hasLogo, onClear }) {
  const [hover, setHover] = useStateP(false);
  const [name, setName] = useStateP(null);
  const handleFile = (file) => {
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => onLogo && onLogo(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="col gap-2">
      <label
        onDragOver={(e) => { e.preventDefault(); setHover(true); }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => { e.preventDefault(); setHover(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          padding: 18, border: `1.5px dashed ${hover ? "var(--gold)" : "var(--line-2)"}`,
          borderRadius: 12, background: hover ? "var(--surface-2)" : "transparent",
          textAlign: "center", cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1, transition: "all 150ms",
        }}
      >
        <input type="file" hidden accept="image/*" disabled={disabled} onChange={(e) => handleFile(e.target.files[0])} />
        <div className="row gap-2" style={{ justifyContent: "center", marginBottom: 6 }}>
          <Icon.Upload size={16} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>{name ? name : "Importer mon logo"}</span>
        </div>
        <div className="dim" style={{ fontSize: 12 }}>{hasLogo ? "Logo visible sur le verso · glissez-le pour le replacer." : "Glissez votre logo ici ou cliquez pour importer."}</div>
      </label>
      {hasLogo && (
        <button className="btn btn-ghost btn-sm" onClick={onClear} style={{ alignSelf: "flex-start", fontSize: 12 }}>
          <Icon.X size={12} /> Retirer le logo
        </button>
      )}
    </div>
  );
}

window.CardListItem = CardListItem;
window.AddCardTile = AddCardTile;
