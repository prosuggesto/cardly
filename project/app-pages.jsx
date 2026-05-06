/* Cardly Pro — Dashboard, Code secret, Subscription, Public card pages */

const { useState: useStateD, useEffect: useEffectD } = React;

// ---------- Metric card (shared) ----------
function Metric({ label, value, delta, trend }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>{label}</div>
      <div className="serif" style={{ fontSize: 36, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
      {delta && <div className="dim" style={{ fontSize: 12, marginTop: 6, color: trend === "up" ? "var(--good)" : "var(--ink-3)" }}>{delta}</div>}
    </div>
  );
}

// ---------- Dashboard ----------
function DashboardPage({ role, trialExpired, onUpgrade }) {
  const { entreprise } = useCardlySession();
  const [members, setMembers] = useStateD([]);
  const [leadsMap, setLeadsMap] = useStateD({});   // userId → total_leads for current month
  const [pageLoading, setPageLoading] = useStateD(true);
  const toast = useToast();

  const now = new Date();
  const moisLabel = now.toLocaleString("fr-FR", { month: "long", year: "numeric" });
  const moisNum = now.getMonth() + 1;
  const anneeNum = now.getFullYear();

  useEffectD(() => {
    if (!entreprise?.id) { setPageLoading(false); return; }
    Promise.all([
      window.CardlyAPI.getMembers(entreprise.id),
      window.CardlyAPI.getLogsLeads(entreprise.id, { mois: moisNum, annee: anneeNum }),
    ]).then(([membRes, logsRes]) => {
      if (!membRes.error && membRes.data) {
        setMembers(membRes.data.map(m => ({
          id: m.id,
          user_id: m.user_id,
          prenom: m.profiles?.prenom || "—",
          nom:    m.profiles?.nom    || "",
          email:  m.profiles?.email  || "",
          poste:  m.profiles?.poste  || "",
          statut: m.statut === 'active' ? "actif" : m.statut === 'pending' ? "en_attente" : "inactif",
          leads: 0,                      // filled from logs below
          last_click: "—",
        })));
      }
      if (!logsRes.error && logsRes.data) {
        // Aggregate leads per user
        const map = {};
        logsRes.data.forEach(log => {
          map[log.user_id] = (map[log.user_id] || 0) + log.total_leads;
        });
        setLeadsMap(map);
      }
      setPageLoading(false);
    });
  }, [entreprise]);

  // Merge leads into members
  const enriched = members.map(m => ({ ...m, leads: leadsMap[m.user_id] || 0 }));
  const active  = enriched.filter(c => c.statut === "actif").sort((a, b) => b.leads - a.leads);
  const pending = enriched.filter(c => c.statut === "en_attente");
  const totalLeads = active.reduce((s, c) => s + c.leads, 0);

  const accept = async (memberId) => {
    const { error } = await window.CardlyAPI.acceptMember(memberId);
    if (error) { toast.push("Erreur : " + error.message, { icon: <Icon.X size={14}/> }); return; }
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, statut: "actif" } : m));
    toast.push("Collaborateur accepté");
  };
  const remove = async (memberId) => {
    const { error } = await window.CardlyAPI.removeMember(memberId);
    if (error) { toast.push("Erreur : " + error.message, { icon: <Icon.X size={14}/> }); return; }
    setMembers(prev => prev.filter(m => m.id !== memberId));
    toast.push("Accès supprimé");
  };

  if (pageLoading) return (
    <div className="col" style={{ alignItems: "center", padding: 80, gap: 16 }}>
      <Spinner size={40} />
      <div className="dim">Chargement du dashboard…</div>
    </div>
  );

  return (
    <div className="col gap-6">
      <div className="col gap-2">
        <div className="eyebrow">Dashboard · {moisLabel}</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Performance équipe</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Chaque clic sur « Enregistrer dans mes contacts » est comptabilisé comme un lead généré.</p>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <Metric label="Total leads ce mois" value={String(totalLeads)} delta="leads générés" trend="up" />
        <Metric label="Meilleur collaborateur" value={active[0] ? `${active[0].prenom} ${(active[0].nom||"")[0] || ""}.` : "—"} delta={active[0] ? `${active[0].leads} leads` : ""} trend="neutral" />
        <Metric label="Collaborateurs actifs" value={`${active.length}`} delta={`sur ${enriched.length}`} trend="neutral" />
      </div>

      {/* Top 3 podium */}
      {active.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="serif" style={{ fontSize: 18 }}>Top 3 du mois</div>
            <div className="dim" style={{ fontSize: 12 }}>Classement des leads générés</div>
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
      )}

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
                    {(c.prenom[0]||"")}{(c.nom[0]||"")}
                  </div>
                  <div className="col">
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{c.prenom} {c.nom}</div>
                    <div className="dim" style={{ fontSize: 12 }}>{c.poste} · {c.email}</div>
                  </div>
                </div>
                <div className="row gap-2">
                  <button className="btn btn-sm" onClick={() => remove(c.id)}><Icon.X size={13} /> Refuser</button>
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
          <span className="dim" style={{ fontSize: 12 }}>{enriched.length} membres</span>
        </div>
        {enriched.length === 0 ? (
          <div className="col" style={{ alignItems: "center", padding: 40, gap: 8 }}>
            <div className="dim">Aucun collaborateur pour l'instant.</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "var(--surface-2)" }}>
                  {["Collaborateur", "Poste", "Statut", "Leads", "Progression", role === "admin" ? "Actions" : ""].filter(Boolean).map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontWeight: 500, color: "var(--ink-3)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enriched.map(c => (
                  <tr key={c.id} style={{ borderTop: "1px solid var(--line)" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div className="row gap-3">
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                          {(c.prenom[0]||"")}{(c.nom[0]||"")}
                        </div>
                        <div className="col" style={{ lineHeight: 1.3 }}>
                          <div style={{ fontWeight: 500 }}>{c.prenom} {c.nom}</div>
                          <div className="dim" style={{ fontSize: 12 }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--ink-3)" }}>{c.poste || "—"}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span className={`pill ${c.statut === "actif" ? "pill-good" : c.statut === "en_attente" ? "pill-warn" : "pill-mute"}`}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                        {c.statut === "actif" ? "Actif" : c.statut === "en_attente" ? "En attente" : "Inactif"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}><span className="serif" style={{ fontSize: 18 }}>{c.leads}</span></td>
                    <td style={{ padding: "14px 20px", minWidth: 120 }}>
                      <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min(100, totalLeads > 0 ? (c.leads / Math.max(...enriched.map(x => x.leads), 1)) * 100 : 0)}%`, background: "linear-gradient(90deg, var(--gold-2), var(--gold))", borderRadius: 999 }} />
                      </div>
                    </td>
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
        )}
      </div>
    </div>
  );
}
window.DashboardPage = DashboardPage;

// ---------- Code secret ----------
function SecretCodePage({ role }) {
  const { entreprise, membership, refreshMembership } = useCardlySession();
  const [code, setCode] = useStateD(null);
  const [showConfirm, setShowConfirm] = useStateD(false);
  const [regen, setRegen] = useStateD(false);
  const toast = useToast();

  useEffectD(() => {
    if (entreprise?.code_secret) setCode(entreprise.code_secret);
  }, [entreprise]);

  const handleRegen = async () => {
    if (!entreprise?.id) return;
    setRegen(true);
    const { data, error } = await window.CardlyAPI.regenerateCode(entreprise.id);
    setRegen(false);
    if (error) { toast.push("Erreur : " + error.message, { icon: <Icon.X size={14}/> }); return; }
    setCode(data.code_secret);
    setShowConfirm(false);
    refreshMembership();
    toast.push("Nouveau code généré");
  };

  if (role === "collaborator") {
    return (
      <div className="col gap-6" style={{ alignItems: "center" }}>
        <div className="col gap-2" style={{ alignItems: "center", textAlign: "center" }}>
          <div className="eyebrow">Code secret</div>
          <h1 className="serif" style={{ fontSize: 36, margin: 0, letterSpacing: "-0.02em" }}>Vous êtes rattaché à</h1>
          <div className="serif" style={{ fontSize: 32, color: "var(--gold)", fontStyle: "italic" }}>{entreprise?.nom_entreprise || "—"}</div>
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
        {code ? (
          <div className="mono" style={{ fontSize: 40, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 20 }}>{code}</div>
        ) : (
          <div style={{ marginBottom: 20 }}><Spinner size={32} /></div>
        )}
        <div className="row gap-2" style={{ justifyContent: "center" }}>
          <button className="btn btn-sm" onClick={() => { navigator.clipboard?.writeText(code); toast.push("Code copié"); }} disabled={!code}><Icon.Copy size={13} /> Copier le code</button>
          <button className="btn btn-sm" onClick={() => setShowConfirm(true)} disabled={!code}><Icon.Refresh size={13} /> Régénérer</button>
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
          <button className="btn btn-primary btn-sm" disabled={regen} onClick={handleRegen}>
            {regen ? <><Spinner size={14} /> Régénération…</> : "Confirmer"}
          </button>
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
          onCta={() => onSetPlan && onSetPlan("solo")}
        />
        <PricingCard
          featured
          name="Team" price="49,99€" period="/mois"
          tagline="Pour entreprises jusqu'à 10 collaborateurs."
          features={["Jusqu'à 10 collaborateurs", "Carte entreprise", "Cartes personnelles", "Dashboard équipe", "Validation collaborateurs", "Statistiques par collaborateur", "Génération IA", "Import logo", "Personnalisation avancée", "Essai gratuit 7 jours"]}
          cta={plan === "team" ? "Plan actuel" : "Choisir Team"}
          onCta={() => onSetPlan && onSetPlan("team")}
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
  const carteUuid = params.get("id");
  const [card, setCard] = useStateD(null);
  const [cardLoading, setCardLoading] = useStateD(true);
  const [notFound, setNotFound] = useStateD(false);
  const [flipped, setFlipped] = useStateD(false);
  const [crmOpen, setCrmOpen] = useStateD(false);
  const toast = useToast();
  const inactive = card && card.statut !== 'active';

  // Load carte by UUID + owner's profile
  useEffectD(() => {
    if (!carteUuid) { setNotFound(true); setCardLoading(false); return; }
    window.CardlyAPI.getCarteByUuid(carteUuid).then(async ({ data: dbCarte, error }) => {
      if (error || !dbCarte) { setNotFound(true); setCardLoading(false); return; }
      // Load owner profile
      const { data: ownerProfile } = await window.CardlyAPI.getProfile(dbCarte.collaborateur_id);
      setCard(mapCarteFromDB(dbCarte, ownerProfile));
      setCardLoading(false);
      // Track scan
      window.CardlyAPI.trackAction(carteUuid, 'scan');
    });
  }, [carteUuid]);

  const track = (action) => window.CardlyAPI.trackAction(carteUuid, action);

  if (cardLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <Spinner size={44} />
      <div className="dim">Chargement de la carte…</div>
    </div>
  );

  if (notFound || !card) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, padding: 32 }}>
      <div className="hero-bg" />
      <Logo size="md" />
      <div className="card" style={{ padding: 40, textAlign: "center", maxWidth: 440 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <h2 className="serif" style={{ fontSize: 26, margin: "0 0 10px" }}>Carte introuvable</h2>
        <p className="muted" style={{ margin: "0 0 20px" }}>Cette carte n'existe pas ou n'est plus active.</p>
        <button className="btn btn-primary btn-sm" onClick={() => navigate("/")}>Découvrir Cardly Pro</button>
      </div>
    </div>
  );

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
            <div className="muted">{card.poste_affiche}{card.entreprise_affiche ? ` · ${card.entreprise_affiche}` : ""}</div>
          </div>
          <div className="col gap-2" style={{ marginBottom: 16 }}>
            {card.afficher_telephone && card.telephone_affiche && <ContactRow icon={<Icon.Phone size={14} />} label={card.telephone_affiche} href={`tel:${card.telephone_affiche}`} />}
            {card.afficher_email    && card.email_affiche    && <ContactRow icon={<Icon.Mail size={14} />}  label={card.email_affiche}    href={`mailto:${card.email_affiche}`} />}
            {card.afficher_site_web && card.site_web         && <ContactRow icon={<Icon.Globe size={14} />} label={card.site_web}          href={card.site_web.startsWith("http") ? card.site_web : `https://${card.site_web}`} />}
          </div>
          <button
            disabled={inactive}
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}
            onClick={() => { track('clic_add_contact'); setCrmOpen(true); }}
          >
            <Icon.User size={14} /> Enregistrer dans mes contacts
          </button>
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            <button
              disabled={inactive}
              className="btn btn-sm"
              style={{ flex: 1, minWidth: 130, justifyContent: "center" }}
              onClick={() => {
                track('clic_whatsapp');
                const tel = card.telephone_affiche?.replace(/\s/g, '');
                window.open(`https://wa.me/${tel || ""}`, "_blank");
                toast.push("WhatsApp ouvert", { icon: <Icon.WhatsApp size={13}/> });
              }}
            >
              <Icon.WhatsApp size={13} /> WhatsApp
            </button>
            <button disabled={inactive} className="btn btn-sm" style={{ flex: 1, minWidth: 110, justifyContent: "center" }}
              onClick={() => { track('clic_mail'); if (card.email_affiche) window.location.href = `mailto:${card.email_affiche}`; toast.push("Email préparé"); }}>
              <Icon.Mail size={13} /> Email
            </button>
            <button disabled={inactive} className="btn btn-sm" style={{ flex: 1, minWidth: 110, justifyContent: "center" }}
              onClick={() => { track('clic_site_web'); if (card.site_web) window.open(card.site_web.startsWith("http") ? card.site_web : `https://${card.site_web}`, "_blank"); toast.push("Site ouvert"); }}>
              <Icon.Globe size={13} /> Site web
            </button>
          </div>
        </div>

        <div className="dim" style={{ fontSize: 12, textAlign: "center" }}>
          Propulsé par <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ color: "var(--ink)", textDecoration: "underline" }}>Cardly Pro</a> · La carte de visite qui ne finit pas dans une poche.
        </div>
      </div>

      {/* CRM contact form */}
      <Modal open={crmOpen} onClose={() => setCrmOpen(false)} title="Enregistrer ce contact">
        <CRMForm carteUuid={carteUuid} onClose={() => setCrmOpen(false)} onSuccess={() => { setCrmOpen(false); toast.push("Contact enregistré !"); }} />
      </Modal>
    </div>
  );
}

function ContactRow({ icon, label, href }) {
  const inner = (
    <div className="row gap-3" style={{ padding: "10px 14px", background: "var(--surface-2)", borderRadius: 10, fontSize: 14, flex: 1 }}>
      <span className="dim">{icon}</span>
      <span>{label}</span>
    </div>
  );
  if (href) return <a href={href} style={{ textDecoration: "none", color: "inherit", display: "flex" }} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{inner}</a>;
  return inner;
}

function CRMForm({ carteUuid, onClose, onSuccess }) {
  const [form, setForm] = useStateD({});
  const [loading, setLoading] = useStateD(false);
  const [error, setError] = useStateD(null);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await window.CardlyAPI.saveCRMContact(carteUuid, {
        nom: form.nom, prenom: form.prenom,
        mail: form.mail, tel: form.tel,
        prospect_entreprise_nom: form.entreprise,
      });
      if (res.error) throw new Error(res.error);
      onSuccess();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="col gap-3">
      <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>Laissez vos coordonnées pour que ce professionnel puisse vous recontacter.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="field"><label>Prénom</label><input className="input" placeholder="Emma" onChange={set("prenom")} /></div>
        <div className="field"><label>Nom</label><input className="input" placeholder="Laurent" onChange={set("nom")} /></div>
      </div>
      <div className="field"><label>Email</label><input className="input" type="email" placeholder="emma@exemple.fr" onChange={set("mail")} /></div>
      <div className="field"><label>Téléphone</label><input className="input" placeholder="06 ..." onChange={set("tel")} /></div>
      <div className="field"><label>Entreprise <span className="dim">(optionnel)</span></label><input className="input" placeholder="Votre société" onChange={set("entreprise")} /></div>
      {error && <div style={{ padding: "10px 14px", borderRadius: 10, fontSize: 13, background: "#f6e2dd", border: "1px solid #e3b5aa", color: "#8b2e20" }}>{error}</div>}
      <div className="row gap-3" style={{ justifyContent: "flex-end", marginTop: 8 }}>
        <button type="button" className="btn btn-sm" onClick={onClose}>Annuler</button>
        <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
          {loading ? <><Spinner size={14} /> Envoi…</> : <><Icon.Check size={13} /> Enregistrer</>}
        </button>
      </div>
    </form>
  );
}

window.PublicCardPage = PublicCardPage;
