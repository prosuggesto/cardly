/* Cardly Pro — App shell + Mes cartes + Personnalisation */

const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

// ---------- App shell ----------
function AppLayout({ navigate, params, children, tab, setTab, role, plan, trialExpired, onLogout, onUpgrade }) {
  const [menuOpen, setMenuOpen] = useStateP(false);
  const tabs = [
    { id: "cards", label: "Mes cartes", icon: <Icon.Card size={16} /> },
    { id: "customize", label: "Personnalisation carte", icon: <Icon.Brush size={16} /> },
    { id: "scan", label: "Personnalisation scan", icon: <Icon.QR size={16} /> },
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
  const [newType, setNewType] = useStateP("personal"); // 'personal' | 'enterprise'
  const [tags, setTags] = useStateP([
    { id: "tg-1", label: "Salon Immobilier 2026" },
    { id: "tg-2", label: "Réseau MEDEF" },
    { id: "tg-3", label: "Portes ouvertes" },
  ]);
  const [selectedTagId, setSelectedTagId] = useStateP(null);
  const [newTagInput, setNewTagInput] = useStateP("");
  const toast = useToast();

  const isAdmin = role === "admin";

  const createTag = () => {
    const v = newTagInput.trim();
    if (!v) return;
    const t = { id: "tg-" + Math.random().toString(36).slice(2, 6), label: v };
    setTags([...tags, t]);
    setSelectedTagId(t.id);
    setNewTagInput("");
  };

  const addCard = () => {
    if (!newName.trim()) return;
    const designs = window.CARDLY_DATA.cardDesigns;
    const designId = designs[(cards.length) % designs.length].id;
    const tag = tags.find(t => t.id === selectedTagId);
    const next = {
      ...window.CARDLY_DATA.cards[1],
      id: "card-" + Math.random().toString(36).slice(2, 6),
      type: newType,
      nom_carte: newName.trim(),
      design: designId,
      is_default: false,
      tag: tag ? tag.label : null,
    };
    setCards([...cards, next]);
    setShowAdd(false);
    setNewName("");
    setNewType("personal");
    setSelectedTagId(null);
    setNewTagInput("");
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

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={isAdmin ? "Nouvelle carte" : "Nouvelle carte personnelle"}>
        <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
          {isAdmin
            ? "Configurez votre carte. Vous pourrez personnaliser le design ensuite."
            : "Donnez un nom à votre nouvelle carte. Vous pourrez la personnaliser ensuite."}
        </p>
        <Field label="Nom de la carte" placeholder="Ex : Salons & événements" value={newName} onChange={(e) => setNewName(e.target.value)} />

        {isAdmin && (
          <div className="col gap-2" style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, color: "var(--ink-3)", fontWeight: 500, letterSpacing: "0.02em" }}>Type de carte</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { id: "enterprise", title: "Entreprise", desc: "Design partagé pour toute l'équipe.", icon: <Icon.Crown size={14} /> },
                { id: "personal", title: "Personnelle", desc: "Pour un événement ou un projet.", icon: <Icon.User size={14} /> },
              ].map(opt => {
                const sel = newType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setNewType(opt.id)}
                    className="card"
                    style={{
                      padding: 14, textAlign: "left", cursor: "pointer",
                      background: sel ? "linear-gradient(135deg, #fdf3df, #f1deb6)" : "var(--surface)",
                      borderColor: sel ? "var(--gold)" : "var(--line)",
                      borderWidth: sel ? 1.5 : 1,
                      transition: "all 150ms",
                    }}
                  >
                    <div className="row gap-2" style={{ alignItems: "center", marginBottom: 4 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 7,
                        background: sel ? "var(--gold)" : "var(--surface-2)",
                        color: sel ? "white" : "var(--ink-3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{opt.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{opt.title}</div>
                    </div>
                    <div className="dim" style={{ fontSize: 11.5, lineHeight: 1.4 }}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="col gap-2" style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "var(--ink-3)", fontWeight: 500, letterSpacing: "0.02em" }}>Étiquette événement <span className="dim" style={{ fontWeight: 400 }}>(optionnel)</span></div>
          <div className="row" style={{ flexWrap: "wrap", gap: 6 }}>
            {tags.map(t => {
              const sel = selectedTagId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTagId(sel ? null : t.id)}
                  className="chip"
                  style={{
                    cursor: "pointer", fontSize: 12,
                    background: sel ? "var(--ink)" : "var(--surface-2)",
                    color: sel ? "white" : "var(--ink)",
                    borderColor: sel ? "var(--ink)" : "var(--line)",
                  }}
                >
                  {sel && <Icon.Check size={11} />} {t.label}
                </button>
              );
            })}
          </div>
          <div className="row gap-2" style={{ marginTop: 4 }}>
            <input
              className="input"
              placeholder="Créer une nouvelle étiquette…"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); createTag(); } }}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-sm" onClick={createTag} disabled={!newTagInput.trim()}>
              <Icon.Plus size={12} /> Ajouter
            </button>
          </div>
        </div>

        <div className="row gap-3" style={{ justifyContent: "flex-end", marginTop: 20 }}>
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
  const [showStats, setShowStats] = useStateP(false);
  const isLocked = role === "collaborator" && card.type === "enterprise";
  return (
    <div className="card fade-up" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="col gap-1">
          <div className="row gap-2" style={{ alignItems: "center", flexWrap: "wrap" }}>
            <div className="serif" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>{card.nom_carte}</div>
            {card.type === "enterprise" && <span className="chip chip-gold">Entreprise</span>}
            {card.event && <span className="chip" style={{ background: "var(--surface-2)", color: "var(--ink-2)" }}>{card.event}</span>}
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
        <button className="btn btn-sm" style={{ flex: 1, minWidth: 120, justifyContent: "center" }} onClick={() => setShowStats(true)}>
          <Icon.Chart size={13} /> Stats
        </button>
      </div>

      {presenting && ReactDOM.createPortal(<PresentCardModal card={card} onClose={() => setPresenting(false)} />, document.body)}
      <CardStatsModal open={showStats} onClose={() => setShowStats(false)} card={card} />
    </div>
  );
}

function CardStatsModal({ open, onClose, card }) {
  if (!open) return null;
  // Deterministic-ish numbers per card so it feels real
  const seed = (card.id || "x").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (n, mod) => ((seed * 9301 + n * 49297) % mod);
  const saves = (card.leads != null ? card.leads : 32) + 10 + rng(1, 18);
  const channels = [
    { key: "mail", label: "Mail", icon: <Icon.Mail size={14} />, color: "#8a6d3b", clicks: 18 + rng(2, 30) },
    { key: "whatsapp", label: "WhatsApp", icon: <Icon.WhatsApp size={14} />, color: "#25d366", clicks: 14 + rng(3, 28) },
    { key: "instagram", label: "Instagram", icon: <Icon.Instagram size={14} />, color: "#c13584", clicks: 9 + rng(4, 22) },
    { key: "linkedin", label: "LinkedIn", icon: <Icon.Linkedin size={14} />, color: "#0a66c2", clicks: 6 + rng(5, 18) },
    { key: "website", label: "Site web", icon: <Icon.Globe size={14} />, color: "#1a1815", clicks: 4 + rng(6, 16) },
    { key: "crm", label: "CRM", icon: <Icon.User size={14} />, color: "#b8843e", clicks: 5 + rng(7, 14) },
  ];
  const totalClicks = channels.reduce((s, c) => s + c.clicks, 0);
  const max = Math.max(...channels.map(c => c.clicks));

  return (
    <Modal open={open} onClose={onClose} title={`Statistiques — ${card.nom_carte}`}>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>Performance des 30 derniers jours.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
        <div className="card" style={{ padding: 16, background: "linear-gradient(135deg, #fdf3df, #f1deb6)", borderColor: "var(--gold)" }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Enregistrements</div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1, letterSpacing: "-0.02em" }}>{saves}</div>
          <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>contacts ajoutés au répertoire</div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Clics totaux</div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1, letterSpacing: "-0.02em" }}>{totalClicks}</div>
          <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>tous canaux confondus</div>
        </div>
      </div>

      <div className="col gap-2" style={{ marginTop: 18 }}>
        <div className="eyebrow">Détail par canal</div>
        <div className="col gap-3" style={{ marginTop: 4 }}>
          {channels.map(ch => (
            <div key={ch.key} className="col gap-1">
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div className="row gap-2" style={{ alignItems: "center" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--surface-2)", color: ch.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{ch.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ch.label}</div>
                </div>
                <div className="serif" style={{ fontSize: 18 }}>{ch.clicks}</div>
              </div>
              <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(ch.clicks / max) * 100}%`, background: ch.color, borderRadius: 999, transition: "width 400ms" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row gap-3" style={{ justifyContent: "flex-end", marginTop: 20 }}>
        <button className="btn btn-sm" onClick={onClose}>Fermer</button>
      </div>
    </Modal>
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
                <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div className="col gap-1" style={{ flex: 1 }}>
                    <div className="serif" style={{ fontSize: 18, letterSpacing: "-0.01em" }}>{c.nom_carte}</div>
                    <div className="dim" style={{ fontSize: 12 }}>
                      {c.type === "enterprise" ? "Carte entreprise" : "Carte personnelle"} · {window.CARDLY_DATA.getDesign(c.design).label}
                    </div>
                  </div>
                  <div className="col gap-1" style={{ alignItems: "flex-end" }}>
                    {c.type === "enterprise" && <span className="chip chip-gold">Entreprise</span>}
                    {c.event && <span className="chip" style={{ background: "var(--surface-2)", color: "var(--ink-2)", fontSize: 11 }}>{c.event}</span>}
                  </div>
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
function CustomizationPage({ cardId, role, plan, trialExpired, onUpgrade, onBack, onValidate }) {
  const original = window.CARDLY_DATA.cards.find(c => c.id === cardId) || window.CARDLY_DATA.cards[0];
  const [card, setCard] = useStateP({ ...original, positions: { ...original.positions } });
  const [flipped, setFlipped] = useStateP(true);
  const [showAIModal, setShowAIModal] = useStateP(false);
  const [aiBlocked, setAIBlocked] = useStateP(false);
  const [aiLoading, setAILoading] = useStateP(false);
  const [aiPrompt, setAIPrompt] = useStateP("");
  const [logoUrl, setLogoUrl] = useStateP(null);
  const [frontImageUrl, setFrontImageUrl] = useStateP(null);
  const [backImageUrl, setBackImageUrl] = useStateP(null);
  const [fieldColors, setFieldColors] = useStateP({ name: "#2a241a", entreprise: "#2a241a", poste: "#b8843e", phone: "#2a241a", email: "#2a241a", web: "#2a241a" });
  const [applyAllColor, setApplyAllColor] = useStateP("#2a241a");
  const setFieldColor = (key, color) => setFieldColors(fc => ({ ...fc, [key]: color }));
  const [fieldSides, setFieldSides] = useStateP({ name: "recto", entreprise: "recto", poste: "recto", phone: "recto", email: "recto", web: "recto" });
  const setFieldSide = (key, side) => setFieldSides(fs => ({ ...fs, [key]: side }));
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
              frontImageUrl={frontImageUrl}
              backImageUrl={backImageUrl}
              fieldColors={fieldColors}
              fieldSides={fieldSides}
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
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div className="serif" style={{ fontSize: 17 }}>Champs visibles</div>
                <div className="row gap-2" style={{ alignItems: "center" }}>
                  <label style={{ position: "relative", width: 22, height: 22, borderRadius: 6, border: "1.5px solid var(--line-2)", overflow: "hidden", cursor: editable ? "pointer" : "not-allowed", flexShrink: 0, background: applyAllColor }}>
                    <input type="color" value={applyAllColor} disabled={!editable} onChange={(e) => setApplyAllColor(e.target.value)} style={{ opacity: 0, position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "pointer" }} />
                  </label>
                  <button className="btn btn-sm btn-ghost" disabled={!editable} style={{ fontSize: 12, padding: "4px 10px" }}
                    onClick={() => setFieldColors({ name: applyAllColor, entreprise: applyAllColor, poste: applyAllColor, phone: applyAllColor, email: applyAllColor, web: applyAllColor })}>
                    Appliquer à tous
                  </button>
                </div>
              </div>
              <div className="col gap-1">
                {[
                  ["afficher_prenom", "Prénom", "name"],
                  ["afficher_nom", "Nom", "name"],
                  ["afficher_entreprise", "Nom de l'entreprise", "entreprise"],
                  ["afficher_poste", "Poste", "poste"],
                  ["afficher_telephone", "Téléphone", "phone"],
                  ["afficher_email", "Email", "email"],
                  ["afficher_site_web", "Site web", "web"],
                ].map(([k, label, colorKey]) => (
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 4px", fontSize: 14, gap: 10,
                    borderTop: "1px solid var(--line)",
                    opacity: editable ? 1 : 0.6,
                  }}>
                    <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
                    <div className="row gap-2" style={{ alignItems: "center", flexShrink: 0 }}>
                      {colorKey && (
                        <label style={{ position: "relative", width: 20, height: 20, borderRadius: 5, border: "1.5px solid var(--line-2)", overflow: "hidden", cursor: editable ? "pointer" : "not-allowed", flexShrink: 0, background: fieldColors[colorKey] }}>
                          <input type="color" value={fieldColors[colorKey]} disabled={!editable} onChange={(e) => setFieldColor(colorKey, e.target.value)} style={{ opacity: 0, position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "pointer" }} />
                        </label>
                      )}
                      <button disabled={!editable} onClick={() => setField(k, !card[k])} style={{
                        background: "none", border: "none", padding: 0,
                        display: "inline-flex", alignItems: "center",
                        cursor: editable ? "pointer" : "not-allowed",
                      }}>
                        <span className={`toggle ${card[k] ? "on" : ""}`}></span>
                      </button>
                      {colorKey && (() => {
                        const side = fieldSides[colorKey] || "recto";
                        return (
                          <div style={{
                            display: "inline-flex",
                            border: "1px solid var(--line-2)",
                            borderRadius: 7,
                            overflow: "hidden",
                            fontSize: 11,
                            fontWeight: 500,
                            opacity: card[k] && editable ? 1 : 0.5,
                          }}>
                            <button
                              type="button"
                              disabled={!editable || !card[k]}
                              onClick={() => setFieldSide(colorKey, "recto")}
                              style={{
                                padding: "4px 9px",
                                background: side === "recto" ? "var(--ink)" : "transparent",
                                color: side === "recto" ? "white" : "var(--ink-3)",
                                border: "none",
                                cursor: editable && card[k] ? "pointer" : "not-allowed",
                                transition: "background 150ms",
                              }}
                            >Recto</button>
                            <button
                              type="button"
                              disabled={!editable || !card[k]}
                              onClick={() => setFieldSide(colorKey, "verso")}
                              style={{
                                padding: "4px 9px",
                                background: side === "verso" ? "var(--ink)" : "transparent",
                                color: side === "verso" ? "white" : "var(--ink-3)",
                                border: "none",
                                cursor: editable && card[k] ? "pointer" : "not-allowed",
                                transition: "background 150ms",
                              }}
                            >Verso</button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand actions */}
            <div className="card" style={{ padding: 20 }}>
              <div className="serif" style={{ fontSize: 17, marginBottom: 14 }}>Identité</div>
              <div className="col gap-3">
                <UploadZone disabled={!editable} onLogo={(url) => { setLogoUrl(url); setFlipped(true); }} hasLogo={!!logoUrl} onClear={() => setLogoUrl(null)} />
                <CardImageUpload
                  label="Image recto"
                  hint="Cette image sera appliquée sur le recto de votre carte."
                  disabled={!editable}
                  imageUrl={backImageUrl}
                  onChange={(url) => { setBackImageUrl(url); setFlipped(true); }}
                  onClear={() => setBackImageUrl(null)}
                />
                <CardImageUpload
                  label="Image verso"
                  hint="Cette image sera appliquée sur le verso de votre carte."
                  disabled={!editable}
                  imageUrl={frontImageUrl}
                  onChange={(url) => { setFrontImageUrl(url); setFlipped(false); }}
                  onClear={() => setFrontImageUrl(null)}
                />
                <button className="btn" disabled={!editable} onClick={onAIClick}>
                  <Icon.Sparkle size={14} /> Générer une image IA
                  {plan !== "team" && <span className="chip chip-gold" style={{ marginLeft: "auto", fontSize: 10 }}>Team</span>}
                </button>
                <button className="btn btn-primary" disabled={!editable} onClick={() => { toast.push("Modifications sauvegardées"); onValidate && onValidate(cardId); }}>
                  <Icon.Check size={14} /> Valider <Icon.ArrowRight size={13} />
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

function CardImageUpload({ label, hint, disabled, imageUrl, onChange, onClear }) {
  const [hover, setHover] = useStateP(false);
  const [name, setName] = useStateP(null);
  const handleFile = (file) => {
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => onChange && onChange(ev.target.result);
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
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ width: "100%", maxHeight: 80, objectFit: "cover", borderRadius: 8, marginBottom: 6 }} />
        ) : null}
        <div className="row gap-2" style={{ justifyContent: "center", marginBottom: 4 }}>
          <Icon.Upload size={16} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>{name || label}</span>
        </div>
        <div className="dim" style={{ fontSize: 12 }}>{imageUrl ? `Image appliquée · glissez pour remplacer.` : hint}</div>
      </label>
      {imageUrl && (
        <button className="btn btn-ghost btn-sm" onClick={onClear} style={{ alignSelf: "flex-start", fontSize: 12 }}>
          <Icon.X size={12} /> Retirer l'image
        </button>
      )}
    </div>
  );
}

// ---------- Personnalisation Scan ----------
function ScanCustomizationPage({ cardId, role, plan, trialExpired, onUpgrade, onBack }) {
  const cards = window.CARDLY_DATA.cards;
  const card = (cardId && cards.find(c => c.id === cardId)) || cards[0];
  const ent = window.CARDLY_DATA.entreprise;
  const toast = useToast();
  const [scanButtons, setScanButtons] = useStateP({
    contact: true,
    whatsapp: true,
    mail: true,
    instagram: true,
    linkedin: true,
    crm: true,
  });
  const [crmFields, setCrmFields] = useStateP({
    nom: true,
    prenom: true,
    societe: true,
    mail: true,
    tel: true,
  });
  const [flipped, setFlipped] = useStateP(false);
  const [crmModalOpen, setCrmModalOpen] = useStateP(false);
  const toggleBtn = (k) => setScanButtons(s => ({ ...s, [k]: !s[k] }));
  const toggleCrm = (k) => setCrmFields(f => ({ ...f, [k]: !f[k] }));

  return (
    <div className="col gap-6" style={{ position: "relative" }}>
      <div className="col gap-2">
        {onBack && (
          <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ alignSelf: "flex-start", marginBottom: 4, padding: "6px 10px" }}>
            <Icon.ArrowLeft size={13} /> Retour
          </button>
        )}
        <div className="eyebrow">Personnalisation scan</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>{card.nom_carte}</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Choisissez les actions disponibles lorsqu'on scanne votre carte.</p>
      </div>

      <div style={{ position: "relative" }}>
        {trialExpired && <LockedOverlay onUpgrade={onUpgrade} />}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28 }} className="cust-grid">
          {/* Scanned card preview — identique à PublicCardPage */}
          <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, background: "linear-gradient(180deg, #fffdf6, #f7f2e6)" }}>
            <Card3D card={card} width={360} float={true} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
            <div className="card" style={{ padding: 24, width: "100%", maxWidth: 380, background: "var(--surface)" }}>
              <div className="col gap-1" style={{ alignItems: "center", textAlign: "center", marginBottom: 18 }}>
                <div className="serif" style={{ fontSize: 26, letterSpacing: "-0.01em" }}>{card.prenom_affiche} {card.nom_affiche}</div>
                <div className="muted">{card.poste_affiche} · {ent.nom_entreprise}</div>
              </div>
              <div className="col gap-2" style={{ marginBottom: 16 }}>
                <div className="row gap-3" style={{ padding: "10px 14px", background: "var(--surface-2)", borderRadius: 10, fontSize: 14 }}>
                  <span className="dim"><Icon.Phone size={14} /></span>
                  <span>{card.telephone_affiche}</span>
                </div>
                <div className="row gap-3" style={{ padding: "10px 14px", background: "var(--surface-2)", borderRadius: 10, fontSize: 14 }}>
                  <span className="dim"><Icon.Mail size={14} /></span>
                  <span>{card.email_affiche}</span>
                </div>
                <div className="row gap-3" style={{ padding: "10px 14px", background: "var(--surface-2)", borderRadius: 10, fontSize: 14 }}>
                  <span className="dim"><Icon.Globe size={14} /></span>
                  <span>{card.site_web}</span>
                </div>
              </div>
              {scanButtons.contact && (
                <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}>
                  <Icon.User size={14} /> Enregistrer dans mes contacts
                </button>
              )}
              <div className="row gap-2" style={{ flexWrap: "wrap" }}>
                {scanButtons.whatsapp && (
                  <button className="btn btn-sm" style={{ flex: 1, minWidth: 130, justifyContent: "center" }}>
                    <Icon.WhatsApp size={13} /> WhatsApp
                  </button>
                )}
                {scanButtons.mail && (
                  <button className="btn btn-sm" style={{ flex: 1, minWidth: 110, justifyContent: "center" }}>
                    <Icon.Mail size={13} /> Email
                  </button>
                )}
                {scanButtons.crm && (
                  <button className="btn btn-sm btn-gold" style={{ flex: 1, minWidth: 140, justifyContent: "center" }} onClick={() => setCrmModalOpen(true)}>
                    <Icon.User size={13} /> Partager mes infos
                  </button>
                )}
                <button className="btn btn-sm" style={{ flex: 1, minWidth: 110, justifyContent: "center" }}>
                  <Icon.Globe size={13} /> Site web
                </button>
              </div>
              {(scanButtons.instagram || scanButtons.linkedin) && (
                <div className="row gap-3" style={{ justifyContent: "center", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                  {scanButtons.instagram && <Icon.Instagram size={46} />}
                  {scanButtons.linkedin && <Icon.Linkedin size={46} />}
                </div>
              )}
            </div>
          </div>

          {/* Panel */}
          <div className="col gap-4" style={{ justifyContent: "center" }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="serif" style={{ fontSize: 17, marginBottom: 14 }}>Actions disponibles</div>
              <div className="col gap-1">
                {[
                  ["contact", "Enregistrer au contact", <Icon.User size={14} />],
                  ["whatsapp", "WhatsApp", <Icon.WhatsApp size={14} />],
                  ["mail", "Email", <Icon.Mail size={14} />],
                ].map(([k, label, icon]) => (
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 4px", fontSize: 14, borderTop: "1px solid var(--line)",
                  }}>
                    <span className="row gap-2" style={{ alignItems: "center" }}>
                      <span style={{ opacity: 0.6 }}>{icon}</span>
                      {label}
                    </span>
                    <button onClick={() => toggleBtn(k)} style={{ background: "none", border: "none", padding: 0, display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                      <span className={`toggle ${scanButtons[k] ? "on" : ""}`}></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="serif" style={{ fontSize: 17, marginBottom: 14 }}>Réseaux sociaux</div>
              <p className="muted" style={{ fontSize: 12, marginTop: 0, marginBottom: 12 }}>Les liens Instagram / LinkedIn sont récupérés depuis votre profil. Activez ou masquez leur affichage sur la carte scannée.</p>
              <div className="col gap-1">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 4px", fontSize: 14, borderTop: "1px solid var(--line)" }}>
                  <span className="row gap-2" style={{ alignItems: "center" }}>
                    <Icon.Instagram size={24} />
                    Instagram
                  </span>
                  <button onClick={() => toggleBtn("instagram")} style={{ background: "none", border: "none", padding: 0, display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                    <span className={`toggle ${scanButtons.instagram ? "on" : ""}`}></span>
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 4px", fontSize: 14, borderTop: "1px solid var(--line)" }}>
                  <span className="row gap-2" style={{ alignItems: "center" }}>
                    <Icon.Linkedin size={24} />
                    LinkedIn
                  </span>
                  <button onClick={() => toggleBtn("linkedin")} style={{ background: "none", border: "none", padding: 0, display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                    <span className={`toggle ${scanButtons.linkedin ? "on" : ""}`}></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: scanButtons.crm ? 14 : 0 }}>
                <div className="serif" style={{ fontSize: 17 }}>CRM</div>
                <button onClick={() => toggleBtn("crm")} style={{ background: "none", border: "none", padding: 0, display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                  <span className={`toggle ${scanButtons.crm ? "on" : ""}`}></span>
                </button>
              </div>
              {scanButtons.crm && (
                <>
                  <p className="muted" style={{ fontSize: 12, marginTop: 0, marginBottom: 12 }}>Activez les champs demandés au visiteur lorsqu'il partage ses infos.</p>
                  <div className="col gap-1">
                    {[
                      ["nom", "Nom"],
                      ["prenom", "Prénom"],
                      ["societe", "Société"],
                      ["mail", "Email"],
                      ["tel", "Téléphone"],
                    ].map(([k, label]) => (
                      <div key={k} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 4px", fontSize: 14, borderTop: "1px solid var(--line)",
                      }}>
                        <span>{label}</span>
                        <button onClick={() => toggleCrm(k)} style={{ background: "none", border: "none", padding: 0, display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                          <span className={`toggle ${crmFields[k] ? "on" : ""}`}></span>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button className="btn btn-primary" onClick={() => toast.push("Personnalisation enregistrée")}>
              <Icon.Check size={14} /> Sauvegarder
            </button>
          </div>
        </div>
      </div>

      <CrmShareModal
        open={crmModalOpen}
        onClose={() => setCrmModalOpen(false)}
        fields={crmFields}
        onSubmit={() => { setCrmModalOpen(false); toast.push("Vos infos ont été partagées"); }}
        recipientName={`${card.prenom_affiche} ${card.nom_affiche}`}
      />
    </div>
  );
}
window.ScanCustomizationPage = ScanCustomizationPage;

function CrmShareModal({ open, onClose, fields, onSubmit, recipientName }) {
  const [data, setData] = useStateP({});
  const set = (k) => (e) => setData(d => ({ ...d, [k]: e.target.value }));
  const fieldList = [
    ["prenom", "Prénom", "text", "Lucas"],
    ["nom", "Nom", "text", "Martin"],
    ["societe", "Société", "text", "Immo Costa"],
    ["mail", "Email", "email", "vous@exemple.com"],
    ["tel", "Téléphone", "tel", "06 12 34 56 78"],
  ].filter(([k]) => fields[k]);
  return (
    <Modal open={open} onClose={onClose} title="Partager mes infos">
      <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>Renseignez vos coordonnées pour les transmettre à {recipientName || "votre interlocuteur"}.</p>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(data); }} className="col gap-3" style={{ marginTop: 12 }}>
        {fieldList.map(([k, label, type, placeholder]) => (
          <div key={k} className="col gap-1">
            <label style={{ fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</label>
            <input className="input" type={type} placeholder={placeholder} value={data[k] || ""} onChange={set(k)} required />
          </div>
        ))}
        {fieldList.length === 0 && (
          <p className="muted" style={{ fontSize: 13 }}>Aucun champ activé. Activez au moins un champ dans la configuration CRM.</p>
        )}
        <div className="row gap-3" style={{ justifyContent: "flex-end", marginTop: 8 }}>
          <button type="button" className="btn btn-sm" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn btn-gold btn-sm" disabled={fieldList.length === 0}>
            Envoyer <Icon.ArrowRight size={13} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
window.CrmShareModal = CrmShareModal;

window.CardListItem = CardListItem;
window.AddCardTile = AddCardTile;
