/* Cartalis — App shell + Mes cartes + Personnalisation */

const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

// ---------- App shell ----------
function AppLayout({ navigate, params, children, tab, setTab, role, plan, trialExpired, onLogout, onUpgrade }) {
  const [menuOpen, setMenuOpen] = useStateP(false);
  const tabs = [
    { id: "cards", label: "Mes cartes", icon: <Icon.Card size={16} /> },
    { id: "customize", label: "Personnalisation carte", icon: <Icon.Brush size={16} /> },
    { id: "dashboard", label: "Dashboard", icon: <Icon.Chart size={16} /> },
    { id: "crm", label: "CRM", icon: <Icon.Database size={16} /> },
    { id: "secret", label: "Mon compte", icon: <Icon.User size={16} /> },
    { id: "feedback", label: "Idée ou problème", icon: <Icon.Sparkle size={16} /> },
    { id: "nfc", label: "Support NFC", icon: <Icon.Nfc size={16} /> },
    { id: "subscription", label: "Abonnement", icon: <Icon.Crown size={16} /> },
  ];
  const visibleTabs = tabs;
  const tabLabel = visibleTabs.find(t => t.id === tab)?.label || "";
  const me = window.CARTALIS_DATA.profileMe;
  const ent = window.CARTALIS_DATA.entreprise;

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
                  <div className="dim" style={{ fontSize: 12 }}>{role === "admin" ? "Chef · " : role === "manager" ? "Responsable · " : ""}{ent.nom_entreprise}</div>
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
  const [cards, setCards] = useStateP([]);
  const [loadingCards, setLoadingCards] = useStateP(true);
  const [showAdd, setShowAdd] = useStateP(false);
  const [creating, setCreating] = useStateP(false);
  const [newName, setNewName] = useStateP("");
  const [newType, setNewType] = useStateP("personnel"); // 'personnel' | 'entreprise'
  const [tags, setTags] = useStateP([]);
  const [selectedTagId, setSelectedTagId] = useStateP(null);
  const [newTagInput, setNewTagInput] = useStateP("");
  const toast = useToast();

  const isAdmin = role === "admin" || role === "manager";

  // Chargement réel depuis Supabase à chaque montage
  useEffectP(() => {
    const userId = window.CARTALIS_DATA?.profileMe?.id;
    const entrepriseId = window.CARTALIS_DATA?.entreprise?.id;
    if (!window.CardlyAPI || !userId || !entrepriseId) { setLoadingCards(false); return; }
    window.CardlyAPI.getMyCartes(userId, entrepriseId)
      .then(({ data }) => {
        const profile = window.CARTALIS_DATA?.profileMe;
        const entreprise = window.CARTALIS_DATA?.entreprise;
        const mapped = (data || []).map(c => window.CardlyAPI.mapCarteFromDB(c, profile, entreprise));
        setCards(mapped);
        window.CARTALIS_DATA.cards = mapped;
      })
      .catch(() => {})
      .finally(() => setLoadingCards(false));
  }, []);

  // Chargement des événements depuis Supabase
  useEffectP(() => {
    const entrepriseId = window.CARTALIS_DATA?.entreprise?.id;
    if (!window.CardlyAPI || !entrepriseId) return;
    window.CardlyAPI.getEvenements(entrepriseId).then(({ data }) => {
      if (!data) return;
      setTags(data.map(ev => ({ id: ev.evenement_uuid, label: ev.evenement_name, evenement_uuid: ev.evenement_uuid })));
    }).catch(() => {});
  }, []);

  const createTag = async () => {
    const v = newTagInput.trim();
    if (!v) return;
    const entrepriseId = window.CARTALIS_DATA?.entreprise?.id;
    // Optimiste : ajouter immédiatement avec un ID temporaire
    const tempId = "tg-" + Math.random().toString(36).slice(2, 6);
    const tempTag = { id: tempId, label: v, evenement_uuid: null };
    setTags(prev => [...prev, tempTag]);
    setSelectedTagId(tempId);
    setNewTagInput("");
    // Persistance en base
    if (window.CardlyAPI && entrepriseId) {
      try {
        const { data: ev, error } = await window.CardlyAPI.createEvenement(entrepriseId, v);
        if (!error && ev) {
          setTags(prev => prev.map(t => t.id === tempId
            ? { id: ev.evenement_uuid, label: ev.evenement_name, evenement_uuid: ev.evenement_uuid }
            : t
          ));
          setSelectedTagId(ev.evenement_uuid);
        }
      } catch (_) {}
    }
  };

  const addCard = async () => {
    if (!newName.trim()) return;
    const userId = window.CARTALIS_DATA?.profileMe?.id;
    const entrepriseId = window.CARTALIS_DATA?.entreprise?.id;
    if (!window.CardlyAPI || !userId || !entrepriseId) { toast.push("Connexion requise"); return; }
    const tag = tags.find(t => t.id === selectedTagId);
    setCreating(true);
    try {
      // Récupère le design immoblier-bleu pour l'écrire directement en DB
      const defaultDesign = (window.CARTALIS_DATA?.cardDesigns || []).find(d => d.id === 'design-immoblier-bleu')
        || window.CARTALIS_DATA?.cardDesigns?.[0] || {};

      const { data: newCarte, error } = await window.CardlyAPI.createCarte({
        collaborateur_id: userId,
        entreprise_id: entrepriseId,
        type_card: newType,
        card_name: newName.trim(),
        evenement_name: tag ? tag.label : null,
        evenement_uuid: tag?.evenement_uuid || null,
        statut: 'active',
        // ── Config identique au mockup iPhone de la landing page ──
        // Positions exactes (SCAN_CARD_DATA)
        prenom_x:         57.7706770270831,   prenom_y:         19.33460308118465,
        nom_x:            57.7706770270831,   nom_y:            19.33460308118465,
        nom_entreprise_x: 47.063215515592084, nom_entreprise_y: 50.7604620755852,
        poste_x:          57.197057416883915, poste_y:          31.197713989721958,
        telephone_x:      70,                 telephone_y:      60,
        email_x:          70,                 email_y:          70,
        site_web_x:       44.57755728227542,  site_web_y:       64.7528528713908,
        logo_recto_x:     46.10719255709519,  logo_recto_y:     29.372629375965424,
        logo_verso_x:     23.162641553169696, logo_verso_y:     21.463871364811073,
        // Côtés : nom/poste/tel/email sur verso, entreprise/web sur recto
        prenom_side:         'verso',
        nom_side:            'verso',
        nom_entreprise_side: 'recto',
        poste_side:          'verso',
        telephone_side:      'verso',
        email_side:          'verso',
        site_web_side:       'recto',
        // Tailles (name 1.75×, entreprise 2.5×)
        prenom_size:         175,
        nom_size:            175,
        nom_entreprise_size: 250,
        poste_size:          100,
        telephone_size:      100,
        email_size:          100,
        site_web_size:       100,
        // Polices (mockup landing)
        prenom_police:         'serif',
        nom_police:            'serif',
        nom_entreprise_police: 'playfair',
        poste_police:          'Inter',
        telephone_police:      'cinzel',
        email_police:          'playfair',
        site_web_police:       'Inter',
        // Couleurs crème (#f3f0ed, même que le mockup)
        prenom_couleur:         '#f3f0ed',
        nom_couleur:            '#f3f0ed',
        nom_entreprise_couleur: '#f3f0ed',
        poste_couleur:          '#f3f0ed',
        telephone_couleur:      '#f3f0ed',
        email_couleur:          '#f3f0ed',
        site_web_couleur:       '#f3f0ed',
        // Tous les champs texte désactivés par défaut — l'utilisateur les active manuellement
        afficher_prenom:         false,
        afficher_nom:            false,
        afficher_nom_entreprise: false,
        afficher_poste:          false,
        afficher_telephone:      false,
        afficher_email:          false,
        afficher_site_web:       false,
        // Logo sur les deux faces
        afficher_logo_recto: true,
        afficher_logo_verso: true,
        // Design par défaut
        image_verso: defaultDesign.front || null,
        image_recto: defaultDesign.back  || null,
      });
      if (error) throw error;
      const profile = window.CARTALIS_DATA?.profileMe;
      const entreprise = window.CARTALIS_DATA?.entreprise;
      const mapped = window.CardlyAPI.mapCarteFromDB(newCarte, profile, entreprise);
      const next = [...cards, mapped];
      setCards(next);
      window.CARTALIS_DATA.cards = next;
      setShowAdd(false);
      setNewName(""); setNewType("personnel"); setSelectedTagId(null); setNewTagInput("");
      toast.push("Carte créée ✓");
      // Redirection immédiate vers la personnalisation
      onCustomize && onCustomize(mapped.id);
    } catch (err) {
      toast.push("Erreur : " + (err.message || "impossible de créer la carte"));
    } finally { setCreating(false); }
  };

  const deleteCard = async (cardId) => {
    try {
      const { error } = await window.CardlyAPI.deleteCarte(cardId);
      if (error) throw error;
      const next = cards.filter(c => c.id !== cardId);
      setCards(next);
      window.CARTALIS_DATA.cards = next;
      toast.push("Carte supprimée");
    } catch (err) {
      toast.push("Erreur : " + (err.message || "suppression impossible"));
    }
  };

  return (
    <div className="col gap-6" style={{ position: "relative" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div className="col gap-2">
          <div className="eyebrow">Espace · {window.CARTALIS_DATA?.entreprise?.nom_entreprise || '—'}</div>
          <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Mes cartes</h1>
          <p className="muted" style={{ margin: 0, fontSize: 15 }}>Retrouvez vos cartes digitales et partagez-les en un scan.</p>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        {trialExpired && <LockedOverlay onUpgrade={onUpgrade} />}
        {loadingCards ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--ink-4)", fontSize: 14 }}>Chargement…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 24 }}>
            {cards.map(c => <CardListItem key={c.id} card={c} onCustomize={onCustomize} onShare={onShareCard} onDelete={deleteCard} role={role} />)}
            <AddCardTile onClick={() => setShowAdd(true)} />
          </div>
        )}
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
                { id: "entreprise", title: "Entreprise", desc: "Design partagé pour toute l'équipe.", icon: <Icon.Crown size={14} /> },
                { id: "personnel", title: "Personnelle", desc: "Pour un événement ou un projet.", icon: <Icon.User size={14} /> },
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
            <button type="button" className="btn btn-sm" onClick={createTag}>
              <Icon.Plus size={12} /> Ajouter
            </button>
          </div>
        </div>

        <div className="row gap-3" style={{ justifyContent: "flex-end", marginTop: 20 }}>
          <button className="btn btn-sm" onClick={() => setShowAdd(false)} disabled={creating}>Annuler</button>
          <button className="btn btn-primary btn-sm" onClick={addCard} disabled={creating || !newName.trim()}>
            {creating ? "Création…" : "Créer la carte"}
          </button>
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

function CardListItem({ card, onCustomize, onShare, onDelete, role }) {
  const toast = useToast();
  const [presenting, setPresenting] = useStateP(false);
  const [showStats, setShowStats] = useStateP(false);
  const [confirmDel, setConfirmDel] = useStateP(false);
  const [deleting, setDeleting] = useStateP(false);
  const isLocked = role === "collaborator" && card.type === "entreprise";

  const handleDelete = async () => {
    setDeleting(true);
    try { await onDelete(card.id); }
    finally { setDeleting(false); setConfirmDel(false); }
  };

  return (
    <div className="card fade-up" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="col gap-1">
          <div className="row gap-2" style={{ alignItems: "center", flexWrap: "wrap" }}>
            <div className="serif" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>{card.nom_carte}</div>
            {card.type === "entreprise" && <span className="chip chip-gold">Entreprise</span>}
            {card.event && <span className="chip" style={{ background: "var(--surface-2)", color: "var(--ink-2)" }}>{card.event}</span>}
          </div>
          <div className="dim" style={{ fontSize: 12 }}>{card.type === "entreprise" ? "Carte entreprise" : "Carte personnelle"}</div>
        </div>
        <div className="row gap-1">
          <button className="btn btn-ghost btn-sm" onClick={() => onCustomize(card.id)} title="Personnaliser"><Icon.Brush size={14} /></button>
          <button className="btn btn-ghost btn-sm" onClick={() => onShare(card.id)} title="Aperçu public"><Icon.QR size={14} /></button>
          <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDel(true)} title="Supprimer" style={{ color: "#c0392b" }}><Icon.X size={14} /></button>
        </div>
      </div>
      {confirmDel && (
        <div className="card" style={{ padding: "12px 16px", background: "#fff5f5", borderColor: "#f5c6c6", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Supprimer <em>{card.nom_carte}</em> ? Cette action est irréversible.</div>
          <div className="row gap-2">
            <button className="btn btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setConfirmDel(false)} disabled={deleting}>Annuler</button>
            <button className="btn btn-sm" style={{ flex: 1, justifyContent: "center", background: "#c0392b", color: "white", border: "none" }} onClick={handleDelete} disabled={deleting}>
              {deleting ? "Suppression…" : "Oui, supprimer"}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setPresenting(true)}
        style={{ display: "flex", justifyContent: "center", padding: "8px 0", background: "transparent", border: 0, cursor: "pointer" }}
        title="Présenter au client"
      >
        <Card3D card={card} width={320} float={true} frontImageUrl={card.frontImageUrl} backImageUrl={card.backImageUrl} />
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
  const scans = Math.round(saves * 1.2);
  const channels = [
    { key: "scans", label: "Scans", icon: <Icon.QR size={14} />, color: "#6b5b4f", clicks: scans },
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
  const toast = useToast();
  const design = window.CARTALIS_DATA.cardDesigns.find(d => d.front === card.frontImageUrl)
    || { front: card.frontImageUrl || null, back: card.backImageUrl || null };
  const [flipped, setFlipped] = useStateP(false);

  const shareLink = () => {
    const url = window.location.origin + window.location.pathname + `#/card?id=${card.id}`;
    if (navigator.share) {
      navigator.share({ title: card.nom_carte, url });
    } else {
      navigator.clipboard?.writeText(url);
      toast.push("Lien copié dans le presse-papiers");
    }
  };

  const downloadJpeg = () => {
    if (!design.front && !design.back) { toast.push("Aucune image disponible pour ce design"); return; }
    const base = card.nom_carte.replace(/\s+/g, "-").toLowerCase();
    const downloadImg = (src, filename) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.download = filename;
        link.href = canvas.toDataURL("image/jpeg", 0.92);
        link.click();
      };
      img.onerror = () => toast.push(`Impossible de télécharger : ${filename}`);
      img.src = src;
    };
    if (design.front) downloadImg(design.front, `${base}-recto.jpg`);
    if (design.back)  downloadImg(design.back,  `${base}-verso.jpg`);
    toast.push("Téléchargement en cours…");
  };

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
          <div onClick={() => setFlipped(f => !f)} style={{ cursor: "pointer", display: "inline-block" }}>
            <Card3D card={card} width={420} float={true} flipped={flipped} frontImageUrl={card.frontImageUrl} backImageUrl={card.backImageUrl} />
          </div>
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

          {/* Share + Download */}
          <div className="row gap-2" style={{ marginTop: 4 }}>
            <button className="btn btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={shareLink}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
              </svg>
              Partager le lien
            </button>
            <button className="btn btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={downloadJpeg}>
              <Icon.Download size={13} />
              Télécharger JPEG
            </button>
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
  const cards = window.CARTALIS_DATA.cards;
  return (
    <div className="col gap-6" style={{ position: "relative" }}>
      <div className="col gap-2">
        <div className="eyebrow">Personnalisation</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Quelle carte souhaitez-vous personnaliser&nbsp;?</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Sélectionnez une carte pour modifier son design, ses champs et la position des éléments sur le verso.</p>
      </div>
      <div style={{ position: "relative" }}>
        {trialExpired && <LockedOverlay onUpgrade={onUpgrade} />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 440px))", gap: 22 }}>
          {cards.map(c => {
            const locked = role === "collaborator" && c.type === "entreprise";
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
                      {c.type === "entreprise" ? "Carte entreprise" : "Carte personnelle"}
                    </div>
                  </div>
                  <div className="col gap-1" style={{ alignItems: "flex-end" }}>
                    {c.type === "entreprise" && <span className="chip chip-gold">Entreprise</span>}
                    {c.event && <span className="chip" style={{ background: "var(--surface-2)", color: "var(--ink-2)", fontSize: 11 }}>{c.event}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                  <Card3D card={c} width={260} float={true} frontImageUrl={c.frontImageUrl} backImageUrl={c.backImageUrl} />
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

// ---------- DesignThumb — thumbnail avec shimmer + fondu ----------
// - IntersectionObserver sur le wrapper : la CSS background ne se charge que
//   lorsque la vignette entre dans la zone visible du conteneur.
// - img détecteur sans loading="lazy" (display:none bloque le lazy natif) :
//   récupère l'image depuis le cache dès que la CSS background est chargée,
//   déclenche setLoaded → shimmer disparaît en 250 ms.
function DesignThumb({ design, selected, editable, onSelect }) {
  const [inView, setInView]   = useStateP(!design.front); // pas d'image → déjà "visible"
  const [loaded, setLoaded]   = useStateP(!design.front);
  const wrapRef = useRefP(null);

  useEffectP(() => {
    if (!design.front) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      // root null = viewport ; fonctionne car le panneau de personnalisation
      // est dans le viewport et les vignettes hors-scroll sont hors écran
      { rootMargin: "120px 0px", threshold: 0 }
    );
    if (wrapRef.current) io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      {/* bouton sans enfants — layout identique à l'original */}
      <button
        disabled={!editable}
        onClick={() => onSelect(design.id)}
        title={design.label}
        style={{
          display: "block", width: "100%",
          aspectRatio: "1.6/1", borderRadius: 10,
          // CSS background ne se charge que lorsque inView est true
          background: inView && design.front
            ? `url(${design.front}) center/cover`
            : (design.bg || "linear-gradient(135deg,#fff,#f6f3ec)"),
          border: selected ? "2px solid var(--gold)" : "1px solid var(--line)",
          boxShadow: selected ? "0 0 0 3px rgba(184,138,62,0.15)" : "none",
          cursor: editable ? "pointer" : "not-allowed",
          opacity: editable ? 1 : 0.5,
          transition: "all 150ms",
        }}
      />
      {/* shimmer : affiché tant que !loaded, disparaît en 250 ms */}
      {design.front && (
        <>
          <div style={{
            position: "absolute", inset: 0, borderRadius: 10, pointerEvents: "none",
            background: "linear-gradient(90deg,rgba(184,138,62,0.06) 25%,rgba(184,138,62,0.14) 50%,rgba(184,138,62,0.06) 75%)",
            backgroundSize: "200% 100%",
            animation: loaded ? "none" : "shimmer 1.4s ease-in-out infinite",
            opacity: loaded ? 0 : 1,
            transition: "opacity 250ms ease",
          }} />
          {/* img détecteur : PAS de loading="lazy" (display:none le bloquerait) */}
          {inView && !loaded && (
            <img src={design.front} alt="" decoding="async"
              onLoad={() => setLoaded(true)} style={{ display: "none" }} />
          )}
        </>
      )}
    </div>
  );
}

// ---------- Personnalisation ----------
function CustomizationPage({ cardId, role, plan, trialExpired, onUpgrade, onBack, onValidate }) {
  const DEF_COLORS = { name: "#f3f0ed", entreprise: "#f3f0ed", poste: "#f3f0ed", phone: "#f3f0ed", email: "#f3f0ed", web: "#f3f0ed" };
  const DEF_SIDES  = { name: "recto",   entreprise: "recto",   poste: "recto",   phone: "recto",   email: "recto",   web: "recto" };
  const DEF_SIZES  = { name: 1,         entreprise: 1,         poste: 0.9,       phone: 0.8,       email: 0.8,       web: 0.8 };
  const DEF_FONTS  = { name: "default", entreprise: "default", poste: "default", phone: "default", email: "default", web: "default" };
  const DEF_DECOS  = { name: {},        entreprise: {},        poste: {},        phone: {},        email: {},        web: {} };

  // Lit depuis le cache global (peut être vide si short-circuit du restore de session)
  const original = (window.CARTALIS_DATA.cards || []).find(c => c.id === cardId)
    || (window.CARTALIS_DATA.cards || [])[0] || null;

  const [card, setCard] = useStateP(original ? { ...original, positions: { ...(original.positions || {}) } } : null);
  const [cardLoading, setCardLoading] = useStateP(!original);
  const [flipped, setFlipped] = useStateP(false);
  const [showAIModal, setShowAIModal] = useStateP(false);
  const [aiBlocked, setAIBlocked] = useStateP(false);
  const [aiLoading, setAILoading] = useStateP(false);
  const [aiPrompt, setAIPrompt] = useStateP("");
  const [logoUrl, setLogoUrl] = useStateP(original?.logoUrl || null);
  const [frontImageUrl, setFrontImageUrl] = useStateP(original?.frontImageUrl || null);
  const [backImageUrl, setBackImageUrl] = useStateP(original?.backImageUrl || null);
  const [fieldColors, setFieldColors] = useStateP(original?.fieldColors || DEF_COLORS);
  const [applyAllColor, setApplyAllColor] = useStateP((original?.fieldColors?.name) || "#f3f0ed");
  const setFieldColor = (key, color) => setFieldColors(fc => ({ ...fc, [key]: color }));
  const [fieldSides, setFieldSides] = useStateP(original?.fieldSides || DEF_SIDES);
  const setFieldSide = (key, side) => setFieldSides(fs => ({ ...fs, [key]: side }));
  const [fieldSizes, setFieldSizes] = useStateP(original?.fieldSizes || DEF_SIZES);
  const bumpFieldSize = (key, delta) => setFieldSizes(fs => ({ ...fs, [key]: Math.max(0.5, Math.min(3, Math.round(((fs[key] || 1) + delta) * 10) / 10)) }));
  const [fieldFonts, setFieldFonts] = useStateP(original?.fieldFonts || DEF_FONTS);
  const setFieldFont = (key, font) => setFieldFonts(ff => ({ ...ff, [key]: font }));
  const [fieldDecorations, setFieldDecorations] = useStateP(original?.fieldDecorations || DEF_DECOS);
  const toggleFieldDecoration = (key, prop) => setFieldDecorations(d => ({ ...d, [key]: { ...d[key], [prop]: !d[key]?.[prop] } }));
  const [logoSide, setLogoSide] = useStateP(original?.logoSide || "both"); // "recto" | "verso" | "both"
  const [logoSizeRecto, setLogoSizeRecto] = useStateP(original?.logoSizeRecto || 1);
  const [logoSizeVerso, setLogoSizeVerso] = useStateP(original?.logoSizeVerso || 1);
  // selectedDesignId: dérivé des images stockées — permet de surligner la vignette active
  const [selectedDesignId, setSelectedDesignId] = useStateP(() => {
    const initFront = original?.frontImageUrl || null;
    if (!initFront) return null;
    return (window.CARTALIS_DATA.cardDesigns || []).find(d => d.front === initFront)?.id || null;
  });
  const [saving, setSaving] = useStateP(false);
  const [sizeDrafts, setSizeDrafts] = useStateP({});
  const [logoSizeRectoDraft, setLogoSizeRectoDraft] = useStateP(undefined);
  const [logoSizeVersoDraft, setLogoSizeVersoDraft] = useStateP(undefined);
  // Ces hooks doivent rester ici (avant tout return conditionnel) — règles des hooks React
  const cardPreviewRef = useRefP(null);
  const [downloading, setDownloading] = useStateP(false);

  // Toujours rafraîchir depuis la DB — évite les données obsolètes après navigation
  useEffectP(() => {
    if (!cardId || !window.CardlyAPI) { setCardLoading(false); return; }
    window.CardlyAPI.getCarteByUuid(cardId)
      .then(({ data, error }) => {
        if (!error && data) {
          const profile = window.CARTALIS_DATA?.profileMe;
          const entreprise = window.CARTALIS_DATA?.entreprise;
          const mapped = window.CardlyAPI.mapCarteFromDB(data, profile, entreprise);
          setCard({ ...mapped, positions: { ...(mapped.positions || {}) } });
          setLogoUrl(mapped.logoUrl || null);
          setFrontImageUrl(mapped.frontImageUrl || null);
          setBackImageUrl(mapped.backImageUrl || null);
          setFieldColors(mapped.fieldColors || DEF_COLORS);
          setApplyAllColor((mapped.fieldColors?.name) || "#f3f0ed");
          setFieldSides(mapped.fieldSides || DEF_SIDES);
          setFieldSizes(mapped.fieldSizes || DEF_SIZES);
          setFieldFonts(mapped.fieldFonts || DEF_FONTS);
          setLogoSide(mapped.logoSide || "both");
          setLogoSizeRecto(mapped.logoSizeRecto || 1);
          setLogoSizeVerso(mapped.logoSizeVerso || 1);
          setSelectedDesignId(
            (window.CARTALIS_DATA.cardDesigns || []).find(d => d.front === mapped.frontImageUrl)?.id || null
          );
          // Mettre à jour le cache global
          const existing = (window.CARTALIS_DATA.cards || []).some(c => c.id === mapped.id);
          window.CARTALIS_DATA.cards = existing
            ? (window.CARTALIS_DATA.cards || []).map(c => c.id === mapped.id ? mapped : c)
            : [...(window.CARTALIS_DATA.cards || []), mapped];
        }
      })
      .catch(() => {})
      .finally(() => setCardLoading(false));
  }, [cardId]);
  const FONT_OPTIONS = [
    { value: "default",    label: "Défaut" },
    { value: "display",    label: "Display" },
    { value: "playfair",   label: "Playfair" },
    { value: "cinzel",     label: "Cinzel" },
    { value: "lora",       label: "Lora" },
    { value: "serif",      label: "Serif" },
    { value: "raleway",    label: "Raleway" },
    { value: "montserrat", label: "Montserrat" },
    { value: "sans",       label: "Sans" },
    { value: "mono",       label: "Mono" },
    { value: "dancing",    label: "Dancing" },
    { value: "script",     label: "Script" },
  ];
  const toast = useToast();

  // Afficher un spinner pendant le chargement initial ou si carte introuvable
  if (cardLoading) return (
    <div className="col gap-4" style={{ alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <div className="muted" style={{ fontSize: 15 }}>Chargement de la carte…</div>
    </div>
  );
  if (!card) return (
    <div className="col gap-4" style={{ alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      {onBack && <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon.ArrowLeft size={13} /> Retour</button>}
      <div className="muted" style={{ fontSize: 15 }}>Carte introuvable.</div>
    </div>
  );

  const isAdminOnEnterprise = card.type === "entreprise" && role === "collaborator";
  const editable = !isAdminOnEnterprise;

  const downloadFace = async (side) => {
    const container = cardPreviewRef.current;
    if (!container || !window.html2canvas) { toast.push("Export non disponible"); return; }
    const front = container.querySelector('.card-face:not(.card-face-back)');
    const back  = container.querySelector('.card-face-back');
    const card3d = container.querySelector('.card-3d');
    if (!front || !back || !card3d) return;
    setDownloading(true);
    // Flatten card + isolate target face
    card3d.style.transform = 'none';
    if (side === 'recto') {
      back.style.visibility = 'hidden';
    } else {
      front.style.visibility = 'hidden';
      back.style.transform = 'rotateY(0deg)';
    }
    await new Promise(r => setTimeout(r, 80));
    try {
      const canvas = await window.html2canvas(card3d, {
        scale: 8, backgroundColor: null, useCORS: true, allowTaint: true,
        logging: false,
      });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${(card.nom_carte || 'carte').replace(/\s+/g,'-')}-${side}.png`;
      a.click();
      toast.push(`${side === 'recto' ? 'Recto' : 'Verso'} téléchargé`, { icon: <Icon.Check size={14}/> });
    } catch(e) {
      toast.push('Erreur lors de l\'export');
    } finally {
      card3d.style.transform = '';
      front.style.visibility = '';
      back.style.visibility = '';
      back.style.transform  = '';
      setDownloading(false);
    }
  };


  const saveToLanding = (slot) => {
    const config = {
      logoUrl, logoSide, logoSizeRecto, logoSizeVerso,
      fieldSides, fieldSizes, fieldFonts, fieldColors, fieldDecorations,
      frontImageUrl, backImageUrl,
      card: { ...card },
    };
    const key = slot === "hero" ? "cardly_landing_hero" : "cardly_landing_mockup";
    localStorage.setItem(key, JSON.stringify(config));
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
      .then(() => toast.push("✅ Config copiée ! Colle-la à Claude", { icon: <Icon.Check size={14}/> }))
      .catch(() => toast.push("💾 Sauvegardé dans localStorage"));
  };
  const designs = window.CARTALIS_DATA.cardDesigns;
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
          <div className="card" style={{ padding: 36, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, background: "linear-gradient(180deg, #fffdf6, #f7f2e6)", alignSelf: "stretch" }} ref={cardPreviewRef}>
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
              fieldSizes={fieldSizes}
              fieldFonts={fieldFonts}
              fieldDecorations={fieldDecorations}
              logoSide={logoSide}
              logoSizeRecto={logoSizeRecto}
              logoSizeVerso={logoSizeVerso}
            />
            <div className="row gap-2" style={{ flexWrap: "wrap", justifyContent: "center" }}>
              <button className="btn btn-sm" onClick={() => setFlipped(!flipped)}><Icon.Refresh size={13}/> Tester le flip</button>
              <button className="btn btn-sm" onClick={() => saveToLanding("hero")} style={{ gap: 5, background: "linear-gradient(135deg,#b88a3e,#d4a853)", color: "#fff", border: "none", fontWeight: 600 }}>
                ✨ Carte principale
              </button>
              <button className="btn btn-sm" onClick={() => saveToLanding("mockup")} style={{ gap: 5, background: "linear-gradient(135deg,#2a241a,#4a3f2e)", color: "#fff", border: "none", fontWeight: 600 }}>
                📱 Mockup iPhone
              </button>
            </div>
          </div>

          {/* Panel */}
          <div className="col gap-4">
            {/* Designs */}
            <div className="card" style={{ padding: 20 }}>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
                <div className="serif" style={{ fontSize: 17 }}>Modèle</div>
                <span className="chip">
                  {designs.find(d => d.id === selectedDesignId)?.label || 'Personnalisé'}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, maxHeight: 280, overflowY: "auto", paddingRight: 4 }}>
                {designs.map(d => (
                  <DesignThumb
                    key={d.id}
                    design={d}
                    selected={selectedDesignId === d.id}
                    editable={editable}
                    onSelect={(id) => {
                      const picked = designs.find(x => x.id === id);
                      if (!picked) return;
                      setSelectedDesignId(id);
                      setFrontImageUrl(picked.front || null);
                      setBackImageUrl(picked.back || null);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Visibility toggles */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "0 4px" }}>
                <div className="serif" style={{ fontSize: 17 }}>Champs visibles</div>
                <div className="row gap-2" style={{ alignItems: "center", flexShrink: 0, position: "relative" }}>
                  <label style={{ position: "relative", width: 20, height: 20, borderRadius: 5, border: "1.5px solid var(--line-2)", overflow: "hidden", cursor: editable ? "pointer" : "not-allowed", flexShrink: 0, background: applyAllColor }}>
                    <input type="color" value={applyAllColor} disabled={!editable} onChange={(e) => setApplyAllColor(e.target.value)} style={{ opacity: 0, position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "pointer" }} />
                  </label>
                  {/* Invisible clones of per-field controls — guarantees identical layout/widths */}
                  <button aria-hidden="true" tabIndex={-1} style={{ background: "none", border: "none", padding: 0, display: "inline-flex", alignItems: "center", visibility: "hidden" }}>
                    <span className="toggle on"></span>
                  </button>
                  <div aria-hidden="true" style={{ display: "inline-flex", border: "1px solid var(--line-2)", borderRadius: 7, overflow: "hidden", fontSize: 11, fontWeight: 500, visibility: "hidden" }}>
                    <button tabIndex={-1} style={{ padding: "4px 9px", background: "var(--ink)", color: "white", border: "none" }}>Recto</button>
                    <button tabIndex={-1} style={{ padding: "4px 9px", background: "transparent", color: "var(--ink-3)", border: "none" }}>Verso</button>
                  </div>
                  <div aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--line-2)", borderRadius: 7, overflow: "hidden", fontSize: 11, visibility: "hidden" }}>
                    <input type="number" defaultValue={100} className="no-spinner" tabIndex={-1} readOnly style={{ width: 34, padding: "3px 4px", fontSize: 11, textAlign: "center", background: "transparent", border: "none", outline: "none", fontVariantNumeric: "tabular-nums" }} />
                    <span style={{ fontSize: 10, color: "var(--ink-3)", paddingRight: 5 }}>%</span>
                  </div>
                  <div aria-hidden="true" style={{ display: "inline-flex", border: "1px solid var(--line-2)", borderRadius: 7, overflow: "hidden", visibility: "hidden" }}>
                    <button tabIndex={-1} style={{ padding: "3px 6px", border: "none", fontSize: 11, lineHeight: 1 }}><strong>G</strong></button>
                    <button tabIndex={-1} style={{ padding: "3px 6px", border: "none", fontSize: 11, lineHeight: 1 }}><em>I</em></button>
                    <button tabIndex={-1} style={{ padding: "3px 6px", border: "none", fontSize: 11, lineHeight: 1 }}><span style={{ textDecoration: "underline" }}>S</span></button>
                  </div>
                  <select aria-hidden="true" tabIndex={-1} className="input" style={{ padding: "3px 4px", fontSize: 11, height: 26, width: 86, visibility: "hidden" }}>
                    <option>Défaut</option>
                  </select>
                  {/* "Appliquer à tous" positioned absolutely to the right of the color box */}
                  <button
                    type="button"
                    disabled={!editable}
                    onClick={() => setFieldColors({ name: applyAllColor, entreprise: applyAllColor, poste: applyAllColor, phone: applyAllColor, email: applyAllColor, web: applyAllColor })}
                    className="btn btn-sm btn-ghost"
                    style={{
                      position: "absolute",
                      left: 32,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 12,
                      padding: "4px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
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
                      {colorKey && (
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid var(--line-2)",
                          borderRadius: 7,
                          overflow: "hidden",
                          fontSize: 11,
                          opacity: card[k] && editable ? 1 : 0.5,
                        }}>
                          <input
                            type="number"
                            min={0}
                            max={300}
                            step={1}
                            className="no-spinner"
                            disabled={!editable || !card[k]}
                            value={sizeDrafts[colorKey] !== undefined ? sizeDrafts[colorKey] : Math.round((fieldSizes[colorKey] || 1) * 100)}
                            onChange={(e) => {
                              const txt = e.target.value;
                              setSizeDrafts(d => ({ ...d, [colorKey]: txt }));
                              if (txt === "") return;
                              const v = parseInt(txt, 10);
                              if (isNaN(v)) return;
                              const clamped = Math.max(0, Math.min(300, v));
                              setFieldSizes(fs => ({ ...fs, [colorKey]: clamped / 100 }));
                            }}
                            onBlur={() => {
                              setSizeDrafts(d => { const next = { ...d }; delete next[colorKey]; return next; });
                            }}
                            style={{ width: 34, padding: "3px 4px", fontSize: 11, textAlign: "center", background: "transparent", border: "none", outline: "none", fontVariantNumeric: "tabular-nums" }}
                            title="Taille (%)"
                          />
                          <span style={{ fontSize: 10, color: "var(--ink-3)", paddingRight: 5 }}>%</span>
                        </div>
                      )}
                      {colorKey && (() => {
                        const deco = fieldDecorations[colorKey] || {};
                        const active = { background: "var(--ink)", color: "white" };
                        const inactive = { background: "transparent", color: "var(--ink-3)" };
                        const btn = (prop, label, extraStyle = {}) => (
                          <button
                            key={prop}
                            type="button"
                            disabled={!editable || !card[k]}
                            onClick={() => toggleFieldDecoration(colorKey, prop)}
                            style={{
                              padding: "3px 6px", border: "none", cursor: editable && card[k] ? "pointer" : "not-allowed",
                              fontSize: 11, transition: "background 150ms", lineHeight: 1,
                              ...(deco[prop] ? active : inactive), ...extraStyle,
                            }}
                          >{label}</button>
                        );
                        return (
                          <div style={{ display: "inline-flex", border: "1px solid var(--line-2)", borderRadius: 7, overflow: "hidden", opacity: card[k] && editable ? 1 : 0.5 }}>
                            {btn("bold", <strong>G</strong>)}
                            {btn("italic", <em style={{ fontStyle: "italic" }}>I</em>)}
                            {btn("underline", <span style={{ textDecoration: "underline" }}>S</span>)}
                          </div>
                        );
                      })()}
                      {colorKey && (
                        <select
                          disabled={!editable || !card[k]}
                          value={fieldFonts[colorKey] || "default"}
                          onChange={(e) => setFieldFont(colorKey, e.target.value)}
                          className="input"
                          style={{ padding: "3px 4px", fontSize: 11, height: 26, width: 86, opacity: card[k] && editable ? 1 : 0.5 }}
                          title="Police"
                        >
                          {FONT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      )}
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
                {logoUrl && (
                  <div className="col gap-2" style={{ padding: "4px 0" }}>
                    <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13 }}>Affichage du logo</span>
                      <div style={{ display: "inline-flex", border: "1px solid var(--line-2)", borderRadius: 7, overflow: "hidden", fontSize: 11, fontWeight: 500 }}>
                        {[
                          { id: "recto", label: "Recto" },
                          { id: "verso", label: "Verso" },
                          { id: "both", label: "Les deux" },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setLogoSide(opt.id)}
                            style={{
                              padding: "4px 10px",
                              background: logoSide === opt.id ? "var(--ink)" : "transparent",
                              color: logoSide === opt.id ? "white" : "var(--ink-3)",
                              border: "none",
                              cursor: "pointer",
                              transition: "background 150ms",
                            }}
                          >{opt.label}</button>
                        ))}
                      </div>
                    </div>
                    {(logoSide === "recto" || logoSide === "both") && (
                      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13 }}>Taille recto</span>
                        <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--line-2)", borderRadius: 7, overflow: "hidden" }}>
                          <input
                            type="number"
                            min={0}
                            max={300}
                            step={1}
                            className="no-spinner"
                            value={logoSizeRectoDraft !== undefined ? logoSizeRectoDraft : Math.round(logoSizeRecto * 100)}
                            onChange={(e) => {
                              const txt = e.target.value;
                              setLogoSizeRectoDraft(txt);
                              if (txt === "") return;
                              const v = parseInt(txt, 10);
                              if (isNaN(v)) return;
                              const clamped = Math.max(0, Math.min(300, v));
                              setLogoSizeRecto(clamped / 100);
                            }}
                            onBlur={() => setLogoSizeRectoDraft(undefined)}
                            style={{ width: 48, padding: "4px 4px", fontSize: 12, textAlign: "center", background: "transparent", border: "none", outline: "none", fontVariantNumeric: "tabular-nums" }}
                          />
                          <span style={{ fontSize: 11, color: "var(--ink-3)", paddingRight: 8 }}>%</span>
                        </div>
                      </div>
                    )}
                    {(logoSide === "verso" || logoSide === "both") && (
                      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13 }}>Taille verso</span>
                        <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--line-2)", borderRadius: 7, overflow: "hidden" }}>
                          <input
                            type="number"
                            min={0}
                            max={300}
                            step={1}
                            className="no-spinner"
                            value={logoSizeVersoDraft !== undefined ? logoSizeVersoDraft : Math.round(logoSizeVerso * 100)}
                            onChange={(e) => {
                              const txt = e.target.value;
                              setLogoSizeVersoDraft(txt);
                              if (txt === "") return;
                              const v = parseInt(txt, 10);
                              if (isNaN(v)) return;
                              const clamped = Math.max(0, Math.min(300, v));
                              setLogoSizeVerso(clamped / 100);
                            }}
                            onBlur={() => setLogoSizeVersoDraft(undefined)}
                            style={{ width: 48, padding: "4px 4px", fontSize: 12, textAlign: "center", background: "transparent", border: "none", outline: "none", fontVariantNumeric: "tabular-nums" }}
                          />
                          <span style={{ fontSize: 11, color: "var(--ink-3)", paddingRight: 8 }}>%</span>
                        </div>
                      </div>
                    )}
                    <p className="muted" style={{ fontSize: 11, margin: 0 }}>
                      Glissez le logo sur chaque face pour fixer sa position. Les positions et tailles sont indépendantes entre recto et verso.
                    </p>
                  </div>
                )}
                <CardImageUpload
                  label="Image recto"
                  hint="Format JPEG uniquement · dimensions optimales : 1050 × 660 px"
                  disabled={!editable}
                  imageUrl={backImageUrl}
                  onChange={(url) => { setBackImageUrl(url); setFlipped(true); }}
                  onClear={() => setBackImageUrl(null)}
                />
                <CardImageUpload
                  label="Image verso"
                  hint="Format JPEG uniquement · dimensions optimales : 1050 × 660 px"
                  disabled={!editable}
                  imageUrl={frontImageUrl}
                  onChange={(url) => { setFrontImageUrl(url); setFlipped(false); }}
                  onClear={() => setFrontImageUrl(null)}
                />
                <button className="btn" disabled={!editable} onClick={onAIClick}>
                  <Icon.Sparkle size={14} /> Générer une image IA
                  {plan !== "team" && <span className="chip chip-gold" style={{ marginLeft: "auto", fontSize: 10 }}>Team</span>}
                </button>
                <button className="btn btn-primary" disabled={!editable || saving} onClick={async () => {
                  if (!window.CardlyAPI || !cardId) return;
                  setSaving(true);
                  try {
                    const dbData = window.CardlyAPI.carteToDBUpdate(card, { fieldColors, fieldSides, fieldSizes, fieldFonts, fieldDecorations, logoUrl, logoSide, logoSizeRecto, logoSizeVerso, frontImageUrl, backImageUrl });
                    const { error } = await window.CardlyAPI.updateCarte(cardId, dbData);
                    if (error) { toast.push("Erreur : " + error.message); return; }
                    const updatedCard = { ...card, fieldColors, fieldSides, fieldSizes, fieldFonts, fieldDecorations, logoUrl, logoSide, logoSizeRecto, logoSizeVerso, frontImageUrl, backImageUrl };
                    window.CARTALIS_DATA.cards = (window.CARTALIS_DATA.cards || []).map(c => c.id === cardId ? updatedCard : c);
                    toast.push("Modifications sauvegardées ✓");
                    onValidate && onValidate(cardId);
                  } finally { setSaving(false); }
                }}>
                  {saving ? "Sauvegarde…" : <><Icon.Check size={14} /> Valider <Icon.ArrowRight size={13} /></>}
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

      <style>{`
        @media (max-width: 900px) { .cust-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 860px) { .account-grid { grid-template-columns: 1fr !important; } }
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .no-spinner { -moz-appearance: textfield; appearance: textfield; }
      `}</style>
    </div>
  );
}
window.CustomizationPage = CustomizationPage;

// ---------- convertToWebP — conversion client-side avant upload Supabase ----------
// Convertit n'importe quel format (PNG, JPEG, HEIC…) en WebP via canvas.
// - Résolution d'origine préservée (aucun redimensionnement)
// - Qualité 0.88 : bon équilibre taille/qualité pour des images de carte
// - Retourne { dataUrl, blob, webpName } → dataUrl pour la préview React,
//   blob + webpName directement utilisables pour supabase.storage.from(…).upload(webpName, blob)
// - Fallback transparent si le navigateur ne supporte pas l'export WebP
async function convertToWebP(file, quality = 0.88) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossible de lire le fichier"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Impossible de décoder l'image"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            // Fallback : navigateur sans export WebP (très rare) → on garde le fichier d'origine
            if (!blob) { resolve({ dataUrl: e.target.result, blob: file, webpName: file.name }); return; }
            const webpName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const r2 = new FileReader();
            r2.onload = (ev) => resolve({ dataUrl: ev.target.result, blob, webpName });
            r2.readAsDataURL(blob);
          },
          "image/webp",
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function UploadZone({ disabled, onLogo, hasLogo, onClear }) {
  const [hover, setHover] = useStateP(false);
  const [name, setName] = useStateP(null);
  const [converting, setConverting] = useStateP(false);

  const handleFile = async (file) => {
    if (!file) return;
    setConverting(true);
    try {
      const { dataUrl, webpName } = await convertToWebP(file);
      setName(webpName);
      onLogo && onLogo(dataUrl);
    } catch {
      // Fallback si canvas échoue (ex : image corrompue)
      const reader = new FileReader();
      reader.onload = (ev) => { setName(file.name); onLogo && onLogo(ev.target.result); };
      reader.readAsDataURL(file);
    } finally {
      setConverting(false);
    }
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
        <input type="file" hidden accept="image/png,image/svg+xml,image/jpeg,.png,.svg,.jpg,.jpeg" disabled={disabled} onChange={(e) => handleFile(e.target.files[0])} />
        <div className="row gap-2" style={{ justifyContent: "center", marginBottom: 6 }}>
          <Icon.Upload size={16} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {converting ? "Conversion WebP…" : (name ? name : "Importer mon logo")}
          </span>
        </div>
        <div className="dim" style={{ fontSize: 12 }}>
          {hasLogo
            ? "Logo importé · converti en WebP · choisissez son côté et sa taille ci-dessous."
            : "PNG avec fond transparent recommandé · min. 400 × 400 px"}
        </div>
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
  const [converting, setConverting] = useStateP(false);

  const handleFile = async (file) => {
    if (!file) return;
    setConverting(true);
    try {
      const { dataUrl, webpName } = await convertToWebP(file);
      setName(webpName);
      onChange && onChange(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => { setName(file.name); onChange && onChange(ev.target.result); };
      reader.readAsDataURL(file);
    } finally {
      setConverting(false);
    }
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
        <input type="file" hidden accept="image/jpeg,.jpg,.jpeg" disabled={disabled} onChange={(e) => handleFile(e.target.files[0])} />
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ width: "100%", maxHeight: 80, objectFit: "cover", borderRadius: 8, marginBottom: 6 }} />
        ) : null}
        <div className="row gap-2" style={{ justifyContent: "center", marginBottom: 4 }}>
          <Icon.Upload size={16} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {converting ? "Conversion WebP…" : (name || label)}
          </span>
        </div>
        <div className="dim" style={{ fontSize: 12 }}>
          {converting ? "Optimisation en cours…" : (imageUrl ? "Image appliquée · WebP · glissez pour remplacer." : hint)}
        </div>
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
  const ent = window.CARTALIS_DATA.entreprise;
  const toast = useToast();

  // Initialise depuis le cache global si disponible, sinon null (chargée via DB ensuite)
  const initCard = (cardId && (window.CARTALIS_DATA.cards || []).find(c => c.id === cardId))
    || (window.CARTALIS_DATA.cards || [])[0] || null;

  const [card, setCard] = useStateP(initCard);
  const [cardLoading, setCardLoading] = useStateP(true);

  const [scanButtons, setScanButtons] = useStateP(initCard?.scanButtons || {
    contact: true, whatsapp: true, mail: true, instagram: true, linkedin: true, crm: true, rdv: false,
  });
  const [rdvUrl, setRdvUrl] = useStateP(initCard?.rdvUrl || "");
  const [crmFields, setCrmFields] = useStateP(initCard?.crmFields || {
    nom: true, prenom: true, societe: true, mail: true, tel: true,
  });
  const [flipped, setFlipped] = useStateP(false);
  const [crmModalOpen, setCrmModalOpen] = useStateP(false);
  const [saving, setSaving] = useStateP(false);
  const toggleBtn = (k) => setScanButtons(s => ({ ...s, [k]: !s[k] }));
  const toggleCrm = (k) => setCrmFields(f => ({ ...f, [k]: !f[k] }));

  // Toujours rafraîchir la carte depuis la DB pour éviter les données obsolètes
  useEffectP(() => {
    if (!cardId || !window.CardlyAPI) { setCardLoading(false); return; }
    window.CardlyAPI.getCarteByUuid(cardId)
      .then(({ data, error }) => {
        if (!error && data) {
          const profile = window.CARTALIS_DATA?.profileMe;
          const entreprise = window.CARTALIS_DATA?.entreprise;
          const mapped = window.CardlyAPI.mapCarteFromDB(data, profile, entreprise);
          setCard(mapped);
          setScanButtons(mapped.scanButtons || {
            contact: true, whatsapp: true, mail: true, instagram: true, linkedin: true, crm: true, rdv: false,
          });
          setRdvUrl(mapped.rdvUrl || "");
          setCrmFields(mapped.crmFields || { nom: true, prenom: true, societe: true, mail: true, tel: true });
          // Mettre à jour le cache global
          const existing = (window.CARTALIS_DATA.cards || []).some(c => c.id === mapped.id);
          window.CARTALIS_DATA.cards = existing
            ? (window.CARTALIS_DATA.cards || []).map(c => c.id === mapped.id ? mapped : c)
            : [...(window.CARTALIS_DATA.cards || []), mapped];
        }
      })
      .catch(() => {})
      .finally(() => setCardLoading(false));
  }, [cardId]);

  const handleSaveScan = async () => {
    if (!window.CardlyAPI || !card?.id) return;
    setSaving(true);
    try {
      const dbData = window.CardlyAPI.scanConfigToDBUpdate(scanButtons, rdvUrl, crmFields);
      const { error } = await window.CardlyAPI.updateCarte(card.id, dbData);
      if (error) { toast.push("Erreur : " + error.message); return; }
      const updatedCard = { ...card, scanButtons: { ...scanButtons }, rdvUrl, crmFields: { ...crmFields } };
      window.CARTALIS_DATA.cards = (window.CARTALIS_DATA.cards || []).map(c => c.id === card.id ? updatedCard : c);
      toast.push("Personnalisation enregistrée ✓");
    } finally { setSaving(false); }
  };

  if (cardLoading) return (
    <div className="col gap-6" style={{ alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <div className="muted" style={{ fontSize: 15 }}>Chargement de la carte…</div>
    </div>
  );
  if (!card) return (
    <div className="col gap-6" style={{ alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      {onBack && <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon.ArrowLeft size={13} /> Retour</button>}
      <div className="muted" style={{ fontSize: 15 }}>Carte introuvable.</div>
    </div>
  );

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
            <div onClick={() => setFlipped(f => !f)} style={{ cursor: "pointer", display: "inline-block" }}>
              <Card3D card={card} width={360} float={true} flipped={flipped} frontImageUrl={card.frontImageUrl} backImageUrl={card.backImageUrl} />
            </div>
            <div className="card" style={{ padding: 24, width: "100%", maxWidth: 440, background: "var(--surface)" }}>
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
                  <button className="btn btn-sm" style={{ flex: 1, minWidth: 140, justifyContent: "center" }} onClick={() => setCrmModalOpen(true)}>
                    <Icon.User size={13} /> Partager mes infos
                  </button>
                )}
                <button className="btn btn-sm" style={{ flex: 1, minWidth: 110, justifyContent: "center" }}>
                  <Icon.Globe size={13} /> Site web
                </button>
                {scanButtons.rdv && (
                  <button className="btn btn-sm" style={{ flex: 1, minWidth: 130, justifyContent: "center" }}>
                    <Icon.Calendar size={13} /> Prendre RDV
                  </button>
                )}
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
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: scanButtons.rdv ? 14 : 0 }}>
                <div className="row gap-2" style={{ alignItems: "center" }}>
                  <Icon.Calendar size={16} />
                  <div className="serif" style={{ fontSize: 17 }}>Rendez-vous</div>
                </div>
                <button onClick={() => toggleBtn("rdv")} style={{ background: "none", border: "none", padding: 0, display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                  <span className={`toggle ${scanButtons.rdv ? "on" : ""}`}></span>
                </button>
              </div>
              {scanButtons.rdv && (
                <>
                  <p className="muted" style={{ fontSize: 12, marginTop: 0, marginBottom: 12 }}>Lien vers votre calendrier de réservation (Calendly, Cal.com, Google Agenda…). Le bouton « Prendre RDV » apparaîtra sur la carte scannée.</p>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://calendly.com/votre-lien"
                    value={rdvUrl}
                    onChange={(e) => setRdvUrl(e.target.value)}
                    style={{ width: "100%", fontSize: 13 }}
                  />
                </>
              )}
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

            <button className="btn btn-primary" disabled={saving} onClick={handleSaveScan}>
              {saving ? "Sauvegarde…" : <><Icon.Check size={14} /> Sauvegarder</>}
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
