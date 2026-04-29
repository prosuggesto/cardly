/* Cardly Pro — Dashboard, Code secret, Subscription, Public card pages */

const { useState: useStateD } = React;

// ---------- Dashboard ----------
function DashboardPage({ role, trialExpired, onUpgrade }) {
  const [collabs, setCollabs] = useStateD(window.CARDLY_DATA.collaborators);
  const [statsCollab, setStatsCollab] = useStateD(null);
  const toast = useToast();
  const active = collabs.filter(c => c.statut === "actif").sort((a,b) => b.leads - a.leads);
  const pending = collabs.filter(c => c.statut === "en_attente");

  const accept = (id) => { setCollabs(c => c.map(x => x.id === id ? { ...x, statut: "actif" } : x)); toast.push("Collaborateur accepté"); };
  const refuse = (id) => { setCollabs(c => c.filter(x => x.id !== id)); toast.push("Demande refusée"); };
  const remove = (id) => { setCollabs(c => c.map(x => x.id === id ? { ...x, statut: "inactif", leads: 0 } : x)); toast.push("Accès supprimé"); };

  return (
    <div className="col gap-6">
      <div className="col gap-2">
        <div className="eyebrow">Dashboard · Avril 2026</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Performance équipe</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Chaque clic sur « Enregistrer dans mes contacts » est comptabilisé comme un lead généré.</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 16 }}>
        <div className="row gap-3" style={{ flexWrap: "wrap" }}>
          <select className="select" style={{ width: "auto" }} defaultValue="01">
            {["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"].map((m, i) => (
              <option key={m} value={String(i+1).padStart(2,"0")}>{m}</option>
            ))}
          </select>
          <select className="select" style={{ width: "auto" }} defaultValue="2026">
            <option>2025</option><option>2026</option>
          </select>
          <span className="dim" style={{ alignSelf: "center" }}>→</span>
          <select className="select" style={{ width: "auto" }} defaultValue="04">
            {["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"].map((m, i) => (
              <option key={m} value={String(i+1).padStart(2,"0")}>{m}</option>
            ))}
          </select>
          <select className="select" style={{ width: "auto" }} defaultValue="2026">
            <option>2025</option><option>2026</option>
          </select>
          <select className="select" style={{ flex: 1, minWidth: 160 }} defaultValue="all">
            <option value="all">Toute l'équipe</option>
            {active.map(c => <option key={c.id}>{c.prenom} {c.nom}</option>)}
          </select>
          <select className="select" style={{ flex: 1, minWidth: 180 }} defaultValue="all">
            <option value="all">Tous les événements</option>
            <option>Salon Immobilier 2026</option>
            <option>Réseau MEDEF</option>
            <option>Portes ouvertes</option>
            <option>Sans étiquette</option>
          </select>
          <button className="btn btn-primary btn-sm">Filtrer</button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <Metric label="Total leads ce mois" value="142" delta="+24 vs mois dernier" trend="up" />
        <Metric label="Meilleur collaborateur" value={active[0] ? `${active[0].prenom} ${active[0].nom[0]}.` : "—"} delta={active[0] ? `${active[0].leads} leads` : ""} trend="neutral" />
        <Metric label="Collaborateurs actifs" value={`${active.length}`} delta={`sur ${collabs.length}`} trend="neutral" />
      </div>

      {/* Top 3 podium */}
      <div className="card" style={{ padding: 24 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="serif" style={{ fontSize: 18 }}>Top 3 du mois</div>
          <div className="dim" style={{ fontSize: 12 }}>Classement des interactions générées</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {active.slice(0, 3).map((c, i) => (
            <div key={c.id} className="col gap-3" style={{
              padding: 20,
              background: i === 0 ? "linear-gradient(180deg, #fffaf0, #f5edd9)" : "var(--surface-2)",
              border: i === 0 ? "1px solid #ecd5a8" : "1px solid var(--line)",
              borderRadius: 14, alignItems: "center", textAlign: "center",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: i === 0 ? "linear-gradient(135deg, var(--gold-2), var(--gold))" : i === 1 ? "var(--ink-4)" : "var(--surface-3)",
                color: i < 2 ? "white" : "var(--ink-3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 600,
              }}>{i === 0 ? <Icon.Crown size={18} /> : `#${i+1}`}</div>
              <div className="serif" style={{ fontSize: 18 }}>{c.prenom} {c.nom}</div>
              <div className="dim" style={{ fontSize: 12 }}>{c.poste}</div>
              <div className="serif" style={{ fontSize: 32, lineHeight: 1, color: i === 0 ? "var(--gold)" : "var(--ink)" }}>{c.leads}</div>
              <div className="dim" style={{ fontSize: 11 }}>leads ce mois</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending requests — admin only */}
      {role === "admin" && pending.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <div className="serif" style={{ fontSize: 18 }}>Demandes collaborateurs</div>
            <span className="chip">{pending.length} en attente</span>
          </div>
          <div className="col gap-2">
            {pending.map(c => (
              <div key={c.id} className="row" style={{ justifyContent: "space-between", padding: "12px 14px", background: "var(--surface-2)", borderRadius: 10, flexWrap: "wrap", gap: 12 }}>
                <div className="row gap-3">
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                    {c.prenom[0]}{c.nom[0]}
                  </div>
                  <div className="col">
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{c.prenom} {c.nom}</div>
                    <div className="dim" style={{ fontSize: 12 }}>{c.poste} · {c.email}</div>
                  </div>
                </div>
                <div className="row gap-2">
                  <button className="btn btn-sm" onClick={() => refuse(c.id)}><Icon.X size={13} /> Refuser</button>
                  <button className="btn btn-primary btn-sm" onClick={() => accept(c.id)}><Icon.Check size={13} /> Accepter</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="row" style={{ justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--line)" }}>
          <div className="serif" style={{ fontSize: 18 }}>Collaborateurs</div>
          <span className="dim" style={{ fontSize: 12 }}>{collabs.length} membres</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Collaborateur", "Poste", "Statut", "Leads", "Action contact", "Dernier clic", role === "admin" ? "Actions" : ""].filter(Boolean).map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontWeight: 500, color: "var(--ink-3)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {collabs.map(c => (
                <tr key={c.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div className="row gap-3">
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                        {c.prenom[0]}{c.nom[0]}
                      </div>
                      <div className="col" style={{ lineHeight: 1.3 }}>
                        <div style={{ fontWeight: 500 }}>{c.prenom} {c.nom}</div>
                        <div className="dim" style={{ fontSize: 12 }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--ink-3)" }}>{c.poste}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span className={`pill ${c.statut === "actif" ? "pill-good" : c.statut === "en_attente" ? "pill-warn" : "pill-mute"}`}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                      {c.statut === "actif" ? "Actif" : c.statut === "en_attente" ? "En attente" : "Inactif"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}><span className="serif" style={{ fontSize: 18 }}>{c.leads}</span></td>
                  <td style={{ padding: "14px 20px" }}>
                    <button
                      type="button"
                      onClick={() => setStatsCollab(c)}
                      title="Voir le détail par canal"
                      style={{
                        background: "transparent", border: 0, padding: 0, cursor: "pointer",
                        display: "inline-flex", alignItems: "center", gap: 6,
                        color: "var(--ink)", borderBottom: "1px dashed var(--ink-4)",
                      }}
                    >
                      <span className="serif" style={{ fontSize: 18 }}>{Math.round(c.leads * 1.4)}</span>
                      <Icon.ChevronRight size={12} />
                    </button>
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--ink-3)", fontSize: 12 }}>{c.last_click}</td>
                  {role === "admin" && (
                    <td style={{ padding: "14px 20px" }}>
                      {c.statut === "actif" && (
                        <button className="btn btn-ghost btn-sm" onClick={() => remove(c.id)}><Icon.Trash size={13} /></button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CollabStatsModal collab={statsCollab} onClose={() => setStatsCollab(null)} />
    </div>
  );
}
window.DashboardPage = DashboardPage;

function CollabStatsModal({ collab, onClose }) {
  if (!collab) return null;
  const seed = (collab.id || "x").split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const rng = (n, mod) => ((seed * 9301 + n * 49297) % mod);
  const totalActions = Math.round(collab.leads * 1.4);
  const channels = [
    { key: "mail", label: "Mail", icon: <Icon.Mail size={14} />, color: "#8a6d3b", weight: 28 + rng(1, 12) },
    { key: "whatsapp", label: "WhatsApp", icon: <Icon.WhatsApp size={14} />, color: "#25d366", weight: 24 + rng(2, 14) },
    { key: "instagram", label: "Instagram", icon: <Icon.Instagram size={14} />, color: "#c13584", weight: 14 + rng(3, 12) },
    { key: "linkedin", label: "LinkedIn", icon: <Icon.Linkedin size={14} />, color: "#0a66c2", weight: 10 + rng(4, 10) },
    { key: "website", label: "Site web", icon: <Icon.Globe size={14} />, color: "#1a1815", weight: 6 + rng(5, 10) },
    { key: "crm", label: "CRM", icon: <Icon.User size={14} />, color: "#b8843e", weight: 8 + rng(6, 10) },
  ];
  const totalW = channels.reduce((s, c) => s + c.weight, 0);
  const withClicks = channels.map(c => ({ ...c, clicks: Math.max(1, Math.round(totalActions * (c.weight / totalW) * 1.6)) }));
  const totalClicks = withClicks.reduce((s, c) => s + c.clicks, 0);
  const max = Math.max(...withClicks.map(c => c.clicks));

  return (
    <Modal open={!!collab} onClose={onClose} title={`Détail — ${collab.prenom} ${collab.nom}`}>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>{collab.poste} · 30 derniers jours</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 8 }}>
        <div className="card" style={{ padding: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Leads</div>
          <div className="serif" style={{ fontSize: 26, lineHeight: 1, letterSpacing: "-0.02em" }}>{collab.leads}</div>
        </div>
        <div className="card" style={{ padding: 14, background: "linear-gradient(135deg, #fdf3df, #f1deb6)", borderColor: "var(--gold)" }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Action add contact</div>
          <div className="serif" style={{ fontSize: 26, lineHeight: 1, letterSpacing: "-0.02em" }}>{totalActions}</div>
          <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>clics sur le bouton</div>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Clics canaux</div>
          <div className="serif" style={{ fontSize: 26, lineHeight: 1, letterSpacing: "-0.02em" }}>{totalClicks}</div>
        </div>
      </div>

      <div className="col gap-2" style={{ marginTop: 18 }}>
        <div className="eyebrow">Détail par canal</div>
        <div className="col gap-3" style={{ marginTop: 4 }}>
          {withClicks.map(ch => (
            <div key={ch.key} className="col gap-1">
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div className="row gap-2" style={{ alignItems: "center" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--surface-2)", color: ch.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{ch.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ch.label}</div>
                </div>
                <div className="row gap-2" style={{ alignItems: "baseline" }}>
                  <span className="dim" style={{ fontSize: 11 }}>{Math.round((ch.clicks / totalClicks) * 100)}%</span>
                  <span className="serif" style={{ fontSize: 18 }}>{ch.clicks}</span>
                </div>
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

// ---------- Code secret ----------
function SecretCodePage({ role }) {
  const [code, setCode] = useStateD(window.CARDLY_DATA.entreprise.code_secret);
  const [showConfirm, setShowConfirm] = useStateD(false);
  const toast = useToast();
  const regen = () => {
    const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    setCode(`CARDLY-${seg()}`);
    setShowConfirm(false);
    toast.push("Nouveau code généré");
  };

  if (role === "collaborator") {
    return (
      <div className="col gap-6" style={{ alignItems: "center" }}>
        <div className="col gap-2" style={{ alignItems: "center", textAlign: "center" }}>
          <div className="eyebrow">Code secret</div>
          <h1 className="serif" style={{ fontSize: 36, margin: 0, letterSpacing: "-0.02em" }}>Vous êtes rattaché à</h1>
          <div className="serif" style={{ fontSize: 32, color: "var(--gold)", fontStyle: "italic" }}>{window.CARDLY_DATA.entreprise.nom_entreprise}</div>
          <p className="muted" style={{ marginTop: 12, maxWidth: 480 }}>Seul un administrateur peut régénérer le code secret de votre entreprise.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col gap-6">
      <div className="col gap-2">
        <div className="eyebrow">Administration</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Code secret entreprise</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Transmettez ce code à vos collaborateurs pour qu'ils puissent rejoindre votre espace Cardly Pro.</p>
      </div>

      <div className="card" style={{ padding: 40, textAlign: "center", background: "linear-gradient(180deg, #fffdf6 0%, #f7f2e6 100%)", maxWidth: 560 }}>
        <div className="logo-mark" style={{ width: 52, height: 52, fontSize: 22, margin: "0 auto 18px" }}>C</div>
        <div className="dim" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Code secret</div>
        <div className="mono" style={{ fontSize: 40, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 20 }}>{code}</div>
        <div className="row gap-2" style={{ justifyContent: "center" }}>
          <button className="btn btn-sm" onClick={() => { navigator.clipboard?.writeText(code); toast.push("Code copié"); }}><Icon.Copy size={13} /> Copier le code</button>
          <button className="btn btn-sm" onClick={() => setShowConfirm(true)}><Icon.Refresh size={13} /> Régénérer</button>
        </div>
      </div>

      <div className="card" style={{ padding: 18, background: "#fff8eb", borderColor: "#f0d99c", maxWidth: 560 }}>
        <div className="row gap-3">
          <div style={{ color: "var(--gold)" }}>⚠</div>
          <div className="col" style={{ fontSize: 13 }}>
            <div style={{ fontWeight: 500 }}>Attention</div>
            <div className="muted">Si vous régénérez le code, l'ancien ne pourra plus être utilisé par de nouveaux collaborateurs. Ceux déjà rattachés ne sont pas impactés.</div>
          </div>
        </div>
      </div>

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Régénérer le code ?">
        <p className="muted" style={{ marginTop: 0 }}>Cette action est définitive. L'ancien code <span className="mono">{code}</span> ne pourra plus être utilisé.</p>
        <div className="row gap-3" style={{ justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-sm" onClick={() => setShowConfirm(false)}>Annuler</button>
          <button className="btn btn-primary btn-sm" onClick={regen}>Confirmer</button>
        </div>
      </Modal>
    </div>
  );
}
window.SecretCodePage = SecretCodePage;

// ---------- Subscription ----------
function SubscriptionPage({ plan, onSetPlan }) {
  return (
    <div className="col gap-8">
      <div className="col gap-2">
        <div className="eyebrow">Abonnement</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Votre plan Cardly Pro</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Plan actuel : <strong className="serif">{plan === "team" ? "Team" : plan === "solo" ? "Solo" : "Enterprise"}</strong>. Vous pouvez changer à tout moment.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "stretch" }}>
        <PricingCard
          name="Solo" price="9€" period="/mois"
          tagline="Pour indépendants et commerciaux solo."
          features={["1 utilisateur", "Carte digitale personnelle", "QR code personnel", "Statistiques personnelles", "Personnalisation basique", "Essai gratuit 7 jours"]}
          excluded={["Pas de génération IA", "Pas de compte équipe"]}
          cta={plan === "solo" ? "Plan actuel" : "Choisir Solo"}
          onCta={() => onSetPlan("solo")}
        />
        <PricingCard
          featured
          name="Team" price="49,99€" period="/mois"
          tagline="Pour entreprises jusqu'à 10 collaborateurs."
          features={["Jusqu'à 10 collaborateurs", "Carte entreprise", "Cartes personnelles", "Dashboard équipe", "Validation collaborateurs", "Statistiques par collaborateur", "Génération IA", "Import logo", "Personnalisation avancée", "Essai gratuit 7 jours"]}
          cta={plan === "team" ? "Plan actuel" : "Choisir Team"}
          onCta={() => onSetPlan("team")}
        />
        <PricingCard
          name="Enterprise" price="Sur devis" period=""
          tagline="Pour équipes de plus de 10 collaborateurs."
          features={["Plus de 10 collaborateurs", "Design personnalisé", "Accompagnement", "Support prioritaire", "Conditions sur mesure"]}
          contactPhone="07 67 56 92 24" contactEmail="contact.cardly@gmail.com"
          cta="Contacter Cardly Pro"
          onCta={() => window.location.href = "mailto:contact.cardly@gmail.com"}
        />
      </div>
    </div>
  );
}
window.SubscriptionPage = SubscriptionPage;

// ---------- Public scanned card page ----------
function PublicCardPage({ navigate, params }) {
  const cardId = params.get("id") || "card-001";
  const inactive = params.get("inactive") === "1";
  const card = window.CARDLY_DATA.cards.find(c => c.id === cardId) || window.CARDLY_DATA.cards[0];
  const me = window.CARDLY_DATA.profileMe;
  const ent = window.CARDLY_DATA.entreprise;
  const toast = useToast();
  const [savedCount, setSavedCount] = useStateD(0);
  const [flipped, setFlipped] = useStateD(false);
  const [crmModalOpen, setCrmModalOpen] = useStateD(false);

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", paddingBottom: 60 }}>
      <div className="hero-bg" />
      <div className="container row" style={{ height: 64, justifyContent: "space-between" }}>
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }}><Logo size="sm" /></a>
        <div className="chip">Carte scannée</div>
      </div>

      <div className="container col" style={{ alignItems: "center", paddingTop: 32, gap: 28, maxWidth: 540, margin: "0 auto" }}>
        {inactive && (
          <div className="card" style={{ padding: 16, background: "#f6e2dd", borderColor: "#e3b5aa", textAlign: "center", width: "100%" }}>
            <div style={{ fontWeight: 500, color: "var(--bad)" }}>Cette carte n'est pas active.</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Le propriétaire doit activer son abonnement pour permettre les actions.</div>
          </div>
        )}

        <Card3D card={card} width={Math.min(380, window.innerWidth - 60)} float={true} flipped={flipped} onFlip={() => setFlipped(!flipped)} />

        <div className="card" style={{ padding: 24, width: "100%" }}>
          <div className="col gap-1" style={{ alignItems: "center", textAlign: "center", marginBottom: 18 }}>
            <div className="serif" style={{ fontSize: 26, letterSpacing: "-0.01em" }}>{card.prenom_affiche} {card.nom_affiche}</div>
            <div className="muted">{card.poste_affiche} · {ent.nom_entreprise}</div>
          </div>
          <div className="col gap-2" style={{ marginBottom: 16 }}>
            <ContactRow icon={<Icon.Phone size={14} />} label={card.telephone_affiche} />
            <ContactRow icon={<Icon.Mail size={14} />} label={card.email_affiche} />
            <ContactRow icon={<Icon.Globe size={14} />} label={card.site_web} />
          </div>
          <button
            disabled={inactive}
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}
            onClick={() => { setSavedCount(savedCount + 1); toast.push("Contact prêt à être enregistré."); }}
          >
            <Icon.User size={14} /> Enregistrer dans mes contacts
          </button>
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            <button
              disabled={inactive}
              className="btn btn-sm"
              style={{ flex: 1, minWidth: 130, justifyContent: "center" }}
              onClick={() => {
                window.open(`https://wa.me/?text=${encodeURIComponent("Bonjour, voici mon contact suite à notre échange.")}`, "_blank");
                toast.push("WhatsApp ouvert", { icon: <Icon.WhatsApp size={13}/> });
              }}
            >
              <Icon.WhatsApp size={13} /> WhatsApp
            </button>
            <button disabled={inactive} className="btn btn-sm" style={{ flex: 1, minWidth: 110, justifyContent: "center" }} onClick={() => toast.push("Email préparé")}>
              <Icon.Mail size={13} /> Email
            </button>
            <button disabled={inactive} className="btn btn-sm btn-gold" style={{ flex: 1, minWidth: 140, justifyContent: "center" }} onClick={() => setCrmModalOpen(true)}>
              <Icon.User size={13} /> Partager mes infos
            </button>
            <button disabled={inactive} className="btn btn-sm" style={{ flex: 1, minWidth: 110, justifyContent: "center" }} onClick={() => toast.push("Site ouvert")}>
              <Icon.Globe size={13} /> Site web
            </button>
            {card.rdv_actif && card.rdv_url && (
              <button disabled={inactive} className="btn btn-sm" style={{ flex: 1, minWidth: 130, justifyContent: "center" }} onClick={() => { window.open(card.rdv_url, "_blank"); toast.push("Calendrier ouvert"); }}>
                <Icon.Calendar size={13} /> Prendre RDV
              </button>
            )}
          </div>
          <div className="row gap-3" style={{ justifyContent: "center", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); if (!inactive) toast.push("Instagram ouvert"); }} style={{ opacity: inactive ? 0.4 : 1, pointerEvents: inactive ? "none" : "auto", display: "flex", cursor: "pointer" }} title="Instagram">
              <Icon.Instagram size={46} />
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); if (!inactive) toast.push("LinkedIn ouvert"); }} style={{ opacity: inactive ? 0.4 : 1, pointerEvents: inactive ? "none" : "auto", display: "flex", cursor: "pointer" }} title="LinkedIn">
              <Icon.Linkedin size={46} />
            </a>
          </div>
        </div>

        <div className="dim" style={{ fontSize: 12, textAlign: "center" }}>
          Propulsé par <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ color: "var(--ink)", textDecoration: "underline" }}>Cardly Pro</a> · La carte de visite qui ne finit pas dans une poche.
        </div>
      </div>

      <CrmShareModal
        open={crmModalOpen}
        onClose={() => setCrmModalOpen(false)}
        fields={{ nom: true, prenom: true, societe: true, mail: true, tel: true }}
        onSubmit={() => { setCrmModalOpen(false); toast.push("Vos infos ont été envoyées"); }}
        recipientName={`${card.prenom_affiche} ${card.nom_affiche}`}
      />
    </div>
  );
}
function ContactRow({ icon, label }) {
  return (
    <div className="row gap-3" style={{ padding: "10px 14px", background: "var(--surface-2)", borderRadius: 10, fontSize: 14 }}>
      <span className="dim">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
window.PublicCardPage = PublicCardPage;
