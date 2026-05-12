/* Cartalis — Dashboard, Code secret, Subscription, Public card pages */

const { useState: useStateD } = React;

// ---------- FilterSelect — liquid glass dropdown ----------
function FilterSelect({ value, onChange, options, btnStyle }) {
  const [open, setOpen] = useStateD(false);
  const ref = React.useRef(null);
  const current = options.find(o => o.value === value) || options[0];

  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const glass = {
    background: "rgba(255,255,255,0.45)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.65)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)",
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          ...glass, display: "inline-flex", alignItems: "center", gap: 8,
          padding: "9px 14px", borderRadius: 14, cursor: "pointer",
          fontSize: 13, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap",
          height: 44, ...btnStyle,
        }}
      >
        {current?.label}
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: 0.45, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 180ms", flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div style={{
          ...glass, position: "absolute", top: "calc(100% + 6px)", left: 0,
          borderRadius: 16, overflow: "hidden", minWidth: "100%", zIndex: 200,
          animation: "fade-up 150ms ease both",
        }}>
          {options.map((o, i) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                width: "100%", padding: "10px 14px", whiteSpace: "nowrap",
                background: value === o.value ? "rgba(0,0,0,0.07)" : "transparent",
                border: "none", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.55)" : "none",
                cursor: "pointer", fontSize: 13,
                fontWeight: value === o.value ? 600 : 400, color: "var(--ink)",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = value === o.value ? "rgba(0,0,0,0.07)" : "transparent"}
            >
              {o.label}
              {value === o.value && (
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- CRM ----------
function CrmPage({ role }) {
  const [allContacts, setAllContacts] = useStateD([]);
  const [loading, setLoading] = useStateD(true);
  const collabs = (window.CARTALIS_DATA.collaborators || []).filter(c => c.statut === "actif");
  const entrepriseId = window.CARTALIS_DATA?.entreprise?.id;
  const toast = useToast();

  const [filterMembre, setFilterMembre] = useStateD("all");
  const [filterEvent, setFilterEvent] = useStateD("all");
  const [search, setSearch] = useStateD("");

  const canManage = role === "admin" || role === "manager";

  const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const now = new Date();
  const currentMonthLabel = MONTHS_FR[now.getMonth()];
  const currentYear = now.getFullYear();

  // Charge les vrais contacts depuis Supabase
  React.useEffect(() => {
    if (!window.CardlyAPI || !entrepriseId) { setLoading(false); return; }
    (async () => {
      try {
        const { data, error } = await window.CardlyAPI.getCRMContacts(entrepriseId);
        if (error) throw error;

        const formatDate = (iso) => {
          if (!iso) return '—';
          const d = new Date(iso);
          return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
        };

        // Cherche le nom du membre dans la liste cached des collaborateurs
        const getMembreInfo = (collaborateurId) => {
          if (!collaborateurId) return { nom: '—', id: null };
          const collab = (window.CARTALIS_DATA.collaborators || []).find(c => c.id === collaborateurId);
          if (!collab) return { nom: '—', id: collaborateurId };
          return { nom: `${collab.prenom || ''} ${collab.nom || ''}`.trim() || '—', id: collaborateurId };
        };

        const mapped = (data || []).map(c => {
          // La jointure cartes peut être un objet unique ou null selon la FK
          const carte = Array.isArray(c.cartes) ? c.cartes[0] : c.cartes;
          const membre = getMembreInfo(carte?.collaborateur_id || c.collaborateur_id);
          return {
            id: c.id,
            prenom: c.prenom || '—',
            nom: c.nom || '—',
            email: c.mail || c.email || '—',
            tel: c.tel || '—',
            entreprise: c.prospect_entreprise_nom || '—',
            membre: membre.nom,
            membre_id: membre.id,
            event: carte?.evenement_name || c.evenement_name || '—',
            date: formatDate(c.created_at),
            created_at: c.created_at,
          };
        });

        setAllContacts(mapped);
      } catch (err) {
        console.error('[CRM] fetch failed:', err);
        toast.push("Erreur de chargement des contacts");
      } finally {
        setLoading(false);
      }
    })();
  }, [entrepriseId]);

  const events = [...new Set(allContacts.map(c => c.event).filter(e => e && e !== '—'))];

  const filtered = allContacts.filter(c => {
    const matchMembre = filterMembre === "all" || c.membre_id === filterMembre;
    const matchEvent = filterEvent === "all" || c.event === filterEvent;
    const q = search.toLowerCase();
    const matchSearch = !q || [c.nom, c.prenom, c.email, c.entreprise, c.membre].some(f => f && f.toLowerCase().includes(q));
    return matchMembre && matchEvent && matchSearch;
  });

  // Contacts du mois en cours
  const thisMonthCount = allContacts.filter(c => {
    if (!c.created_at) return false;
    const d = new Date(c.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Meilleur membre (par nombre de contacts dans ce CRM)
  const membreScores = {};
  allContacts.forEach(c => { if (c.membre_id) membreScores[c.membre_id] = (membreScores[c.membre_id] || 0) + 1; });
  const topMembreId = Object.keys(membreScores).sort((a, b) => membreScores[b] - membreScores[a])[0];
  const topMembre = collabs.find(c => c.id === topMembreId);

  const exportCSV = () => {
    const headers = ["Prénom", "Nom", "Email", "Téléphone", "Entreprise", "Membre", "Événement", "Date"];
    const rows = filtered.map(c => [c.prenom, c.nom, c.email, c.tel, c.entreprise, c.membre, c.event, c.date]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "contacts-crm.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const COLS = ["Prénom", "Nom", "Email", "Téléphone", "Entreprise", canManage ? "Membre" : null, "Événement", "Date"].filter(Boolean);

  return (
    <div className="col gap-6">
      <div className="col gap-2">
        <div className="eyebrow">CRM · {currentMonthLabel} {currentYear}</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px,4vw,40px)", margin: 0, letterSpacing: "-0.02em" }}>Contacts</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Leads collectés via le bouton « Partager mes infos » sur les cartes scannées.</p>
      </div>

      {/* Toolbar */}
      <div className="row gap-3" style={{ flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="input"
          style={{ minWidth: 180, maxWidth: 280, fontSize: 13 }}
          placeholder="Rechercher un contact…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {canManage && (
          <FilterSelect
            value={filterMembre}
            onChange={setFilterMembre}
            options={[{ value: "all", label: "Tous les membres" }, ...collabs.map(c => ({ value: c.id, label: `${c.prenom} ${c.nom}` }))]}
          />
        )}
        <FilterSelect
          value={filterEvent}
          onChange={setFilterEvent}
          options={[{ value: "all", label: "Tous les événements" }, ...events.map(ev => ({ value: ev, label: ev }))]}
        />
        <button className="btn btn-sm" onClick={exportCSV} style={{ whiteSpace: "nowrap", marginLeft: "auto" }}>
          <Icon.Download size={13} /> Exporter CSV
        </button>
      </div>

      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
        <Metric label="Total contacts" value={loading ? "…" : String(allContacts.length)} delta={`${filtered.length} affiché${filtered.length > 1 ? "s" : ""}`} trend="neutral" />
        <Metric label="Ce mois" value={loading ? "…" : String(thisMonthCount)} delta={`${currentMonthLabel} ${currentYear}`} trend={thisMonthCount > 0 ? "up" : "neutral"} />
        {canManage && <Metric label="Top membre" value={topMembre ? `${topMembre.prenom} ${topMembre.nom[0]}.` : "—"} delta={topMembreId ? `${membreScores[topMembreId]} contact${membreScores[topMembreId] > 1 ? "s" : ""}` : "Aucun contact"} trend="neutral" />}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="row" style={{ justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
          <div className="serif" style={{ fontSize: 16 }}>Tous les contacts</div>
          <span className="dim" style={{ fontSize: 12 }}>{filtered.length} entrée{filtered.length > 1 ? "s" : ""}</span>
        </div>
        {loading ? (
          <div className="col" style={{ alignItems: "center", padding: "48px 24px" }}>
            <div className="dim" style={{ fontSize: 14 }}>Chargement des contacts…</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: "var(--surface-2)" }}>
                  {COLS.map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "11px 20px", fontWeight: 500, color: "var(--ink-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={COLS.length} style={{ padding: "32px 20px", textAlign: "center", color: "var(--ink-4)", fontSize: 13 }}>
                    {allContacts.length === 0 ? "Aucun contact reçu pour l'instant — les prospects verront ce CRM après avoir cliqué « Partager mes infos »." : "Aucun contact correspond à vos filtres."}
                  </td></tr>
                ) : filtered.map(c => (
                  <tr key={c.id} style={{ borderTop: "1px solid var(--line)" }}>
                    <td style={{ padding: "13px 20px", fontWeight: 500 }}>{c.prenom}</td>
                    <td style={{ padding: "13px 20px", fontWeight: 500 }}>{c.nom}</td>
                    <td style={{ padding: "13px 20px" }}>
                      {c.email !== '—'
                        ? <a href={`mailto:${c.email}`} style={{ color: "var(--ink)", textDecoration: "none", borderBottom: "1px dashed var(--line-2)" }}>{c.email}</a>
                        : <span className="dim">—</span>}
                    </td>
                    <td style={{ padding: "13px 20px", color: "var(--ink-3)" }}>{c.tel}</td>
                    <td style={{ padding: "13px 20px", color: "var(--ink-3)" }}>{c.entreprise}</td>
                    {canManage && (
                      <td style={{ padding: "13px 20px" }}>
                        {c.membre !== '—' ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--surface-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600 }}>
                              {c.membre.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0,2)}
                            </span>
                            {c.membre}
                          </span>
                        ) : <span className="dim">—</span>}
                      </td>
                    )}
                    <td style={{ padding: "13px 20px" }}>
                      <span className="chip" style={{ fontSize: 11, padding: "3px 8px" }}>{c.event}</span>
                    </td>
                    <td style={{ padding: "13px 20px", color: "var(--ink-4)", fontSize: 12 }}>{c.date}</td>
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
window.CrmPage = CrmPage;

// ---------- Dashboard ----------
function DashboardPage({ role, trialExpired, onUpgrade }) {
  const [collabs, setCollabs] = useStateD([]);
  const [loading, setLoading] = useStateD(true);
  const [totalLeads, setTotalLeads] = useStateD(0);
  const [statsCollab, setStatsCollab] = useStateD(null);
  const toast = useToast();
  const canManage = role === "admin" || role === "manager";
  const entrepriseId = window.CARTALIS_DATA?.entreprise?.id;

  const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const monthOpts = MONTHS.map((m, i) => ({ value: String(i+1).padStart(2,"0"), label: m }));
  const yearOpts = [{ value: "2025", label: "2025" }, { value: "2026", label: "2026" }];
  const now = new Date();
  const [mDebut, setMDebut] = useStateD(String(now.getMonth() + 1).padStart(2, "0"));
  const [yDebut, setYDebut] = useStateD(String(now.getFullYear()));
  const [mFin, setMFin] = useStateD(String(now.getMonth() + 1).padStart(2, "0"));
  const [yFin, setYFin] = useStateD(String(now.getFullYear()));
  const [fMembre, setFMembre] = useStateD("all");
  const [fEvent, setFEvent] = useStateD("all");
  const [events, setEvents] = useStateD([]);

  // Charge la liste des événements de l'entreprise (pour le filtre)
  React.useEffect(() => {
    if (!window.CardlyAPI || !entrepriseId) return;
    (async () => {
      try {
        const { data } = await window.CardlyAPI.getEvenements(entrepriseId);
        setEvents(data || []);
      } catch (_) {}
    })();
  }, [entrepriseId]);

  const loadData = async (mois, annee, evenementUuid) => {
    if (!window.CardlyAPI || !entrepriseId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [{ data: members }, { data: logs }] = await Promise.all([
        window.CardlyAPI.getMembers(entrepriseId),
        window.CardlyAPI.getLogsLeads(entrepriseId, { mois, annee, evenementUuid: evenementUuid && evenementUuid !== 'all' ? evenementUuid : undefined }),
      ]);
      // Agrège les leads par user
      const lMap = {};
      (logs || []).forEach(l => {
        if (!lMap[l.user_id]) lMap[l.user_id] = {
          total_leads: 0, total_scan: 0, total_clic_mail: 0,
          total_clic_instagram: 0, total_clic_linkedin: 0, total_clic_site_web: 0,
          total_clic_whatsapp: 0, total_clic_add_contact: 0, total_clic_crm: 0,
        };
        const s = lMap[l.user_id];
        s.total_leads            += l.total_leads            || 0;
        s.total_scan             += l.total_scan             || 0;
        s.total_clic_mail        += l.total_clic_mail        || 0;
        s.total_clic_instagram   += l.total_clic_instagram   || 0;
        s.total_clic_linkedin    += l.total_clic_linkedin    || 0;
        s.total_clic_site_web    += l.total_clic_site_web    || 0;
        s.total_clic_whatsapp    += l.total_clic_whatsapp    || 0;
        s.total_clic_add_contact += l.total_clic_add_contact || 0;
        s.total_clic_crm         += l.total_clic_crm         || 0;
      });
      setTotalLeads(Object.values(lMap).reduce((s, v) => s + v.total_leads, 0));
      setCollabs((members || []).map(m => ({
        id: m.user_id,
        memberId: m.id,
        prenom: m.profiles?.prenom || '—',
        nom: m.profiles?.nom || '',
        email: m.profiles?.email || '',
        poste: m.profiles?.poste || '',
        leads: lMap[m.user_id]?.total_leads || 0,
        stats: lMap[m.user_id] || null,
        statut: m.statut === 'active' ? 'actif' : 'en_attente',
        role_membre: (m.role === 'owner' || m.role === 'admin') ? 'responsable' : 'collaborateur',
        last_click: '—',
      })));
    } catch (err) {
      console.error('[Dashboard]', err);
      toast.push("Erreur de chargement");
    }
    setLoading(false);
  };

  React.useEffect(() => { loadData(mDebut, yDebut); }, []);

  const active = collabs.filter(c => c.statut === 'actif').sort((a, b) => b.leads - a.leads);
  const tableMembers = collabs.filter(c => c.statut !== 'en_attente');
  const pending = collabs.filter(c => c.statut === 'en_attente');

  const accept = async (id) => {
    const m = collabs.find(c => c.id === id);
    if (!m) return;
    const { error } = await window.CardlyAPI.acceptMember(m.memberId);
    if (error) { toast.push("Erreur : " + error.message); return; }
    setCollabs(prev => prev.map(x => x.id === id ? { ...x, statut: 'actif' } : x));
    toast.push("Membre accepté ✓");
  };
  const refuse = async (id) => {
    const m = collabs.find(c => c.id === id);
    if (!m) return;
    await window.CardlyAPI.removeMember(m.memberId);
    setCollabs(prev => prev.filter(x => x.id !== id));
    toast.push("Demande refusée");
  };
  const remove = async (id) => {
    const m = collabs.find(c => c.id === id);
    if (!m) return;
    await window.CardlyAPI.removeMember(m.memberId);
    setCollabs(prev => prev.filter(x => x.id !== id));
    toast.push("Accès supprimé");
  };
  const toggleRole = async (id) => {
    const m = collabs.find(c => c.id === id);
    if (!m) return;
    const newDbRole = m.role_membre === 'responsable' ? 'member' : 'admin';
    await window.CardlyAPI.updateMemberRole(m.memberId, newDbRole);
    setCollabs(prev => prev.map(x => x.id === id ? { ...x, role_membre: newDbRole === 'admin' ? 'responsable' : 'collaborateur' } : x));
    toast.push("Rôle mis à jour");
  };

  const monthLabel = MONTHS[parseInt(mDebut, 10) - 1];

  return (
    <div className="col gap-6">
      <div className="col gap-2">
        <div className="eyebrow">Dashboard · {monthLabel} {yDebut}</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Performance des membres</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Chaque clic sur « Enregistrer dans mes contacts » est comptabilisé comme un lead généré.</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 16, width: "fit-content" }}>
        <div className="row gap-3" style={{ flexWrap: "wrap", alignItems: "center" }}>
          <FilterSelect value={mDebut} onChange={setMDebut} options={monthOpts} btnStyle={{ minWidth: 110 }} />
          <FilterSelect value={yDebut} onChange={setYDebut} options={yearOpts} btnStyle={{ minWidth: 80 }} />
          <span className="dim" style={{ alignSelf: "center" }}>→</span>
          <FilterSelect value={mFin} onChange={setMFin} options={monthOpts} btnStyle={{ minWidth: 110 }} />
          <FilterSelect value={yFin} onChange={setYFin} options={yearOpts} btnStyle={{ minWidth: 80 }} />
          {active.length > 0 && (
            <FilterSelect
              value={fMembre}
              onChange={setFMembre}
              options={[{ value: "all", label: "Tous les membres" }, ...active.map(c => ({ value: c.id, label: `${c.prenom} ${c.nom}` }))]}
            />
          )}
          <FilterSelect
            value={fEvent}
            onChange={setFEvent}
            options={[
              { value: "all", label: "Tous les événements" },
              ...events.map(ev => ({ value: ev.evenement_uuid, label: ev.evenement_name })),
            ]}
          />
          <button className="btn btn-primary btn-sm" onClick={() => loadData(mDebut, yDebut, fEvent)}>
            {loading ? "…" : "Filtrer"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="col" style={{ alignItems: "center", padding: "60px 0" }}>
          <div className="dim" style={{ fontSize: 14 }}>Chargement des données…</div>
        </div>
      ) : (
        <>
          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <Metric
              label="Total leads ce mois"
              value={String(totalLeads)}
              delta={totalLeads === 0 ? "Aucune donnée pour ce mois" : `${monthLabel} ${yDebut}`}
              trend={totalLeads > 0 ? "up" : "neutral"}
            />
            <Metric
              label="Meilleur membre"
              value={active[0] ? `${active[0].prenom} ${active[0].nom[0]}.` : "—"}
              delta={active[0] && active[0].leads > 0 ? `${active[0].leads} leads` : "Aucun lead ce mois"}
              trend="neutral"
            />
            <Metric
              label="Membres actifs"
              value={String(active.length)}
              delta={`sur ${collabs.length} membre${collabs.length > 1 ? "s" : ""}`}
              trend="neutral"
            />
          </div>

          {/* Demandes en attente */}
          {canManage && pending.length > 0 && (
            <div className="card" style={{ padding: 24, border: "1px solid #ecd5a8", background: "linear-gradient(135deg, #fffdf7, #fdf5e4)" }}>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
                <div className="serif" style={{ fontSize: 18 }}>Demandes membres</div>
                <span className="chip">{pending.length} en attente</span>
              </div>
              <div className="col gap-2">
                {pending.map(c => (
                  <div key={c.id} className="row" style={{ justifyContent: "space-between", padding: "12px 14px", background: "rgba(255,255,255,0.7)", borderRadius: 10, flexWrap: "wrap", gap: 12 }}>
                    <div className="row gap-3">
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                        {(c.prenom[0] || '?')}{(c.nom[0] || '?')}
                      </div>
                      <div className="col">
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{c.prenom} {c.nom}</div>
                        <div className="dim" style={{ fontSize: 12 }}>{c.poste ? `${c.poste} · ` : ""}{c.email}</div>
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

          {/* Top 3 — uniquement si au moins un lead */}
          {active.filter(c => c.leads > 0).length > 0 ? (
            <div className="card" style={{ padding: 24 }}>
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div className="serif" style={{ fontSize: 18 }}>Top 3 du mois</div>
                <div className="dim" style={{ fontSize: 12 }}>Classement des leads générés</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                {active.filter(c => c.leads > 0).slice(0, 3).map((c, i) => (
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
          ) : collabs.length > 0 && (
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <div className="dim" style={{ fontSize: 14 }}>Aucun lead enregistré pour cette période. Le podium apparaîtra dès que des cartes auront été scannées.</div>
            </div>
          )}

          {/* Tableau membres */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="row" style={{ justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--line)" }}>
              <div className="serif" style={{ fontSize: 18 }}>Membres</div>
              <span className="dim" style={{ fontSize: 12 }}>{tableMembers.length} membre{tableMembers.length > 1 ? "s" : ""}</span>
            </div>
            {tableMembers.length === 0 ? (
              <div className="col" style={{ alignItems: "center", padding: "48px 24px", gap: 10 }}>
                <div className="dim" style={{ fontSize: 14, textAlign: "center" }}>
                  {collabs.length === 0
                    ? "Aucun membre dans votre équipe pour l'instant."
                    : "Tous les membres sont en attente de validation."}
                </div>
                {collabs.length === 0 && (
                  <div className="dim" style={{ fontSize: 12, textAlign: "center", maxWidth: 360 }}>
                    Partagez votre code secret à vos collaborateurs pour qu'ils puissent rejoindre votre espace.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "var(--surface-2)" }}>
                      {["Membre", "Poste", "Rôle", "Leads", "Clics canaux", canManage ? "Gestion" : ""].filter(Boolean).map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontWeight: 500, color: "var(--ink-3)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableMembers.map(c => {
                      const isResp = c.role_membre === "responsable";
                      const s = c.stats || {};
                      const totalClics = (s.total_clic_mail || 0) + (s.total_clic_instagram || 0) + (s.total_clic_linkedin || 0) + (s.total_clic_site_web || 0) + (s.total_clic_whatsapp || 0) + (s.total_clic_crm || 0);
                      return (
                        <tr key={c.id} style={{ borderTop: "1px solid var(--line)" }}>
                          <td style={{ padding: "14px 20px" }}>
                            <div className="row gap-3">
                              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                                {(c.prenom[0] || '?')}{(c.nom[0] || '?')}
                              </div>
                              <div className="col" style={{ lineHeight: 1.3 }}>
                                <div style={{ fontWeight: 500 }}>{c.prenom} {c.nom}</div>
                                <div className="dim" style={{ fontSize: 12 }}>{c.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px", color: "var(--ink-3)" }}>{c.poste || <span className="dim">—</span>}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <span className={`pill ${isResp ? "pill-good" : "pill-mute"}`}>
                              {isResp ? <Icon.Crown size={11} /> : <Icon.User size={11} />}
                              {isResp ? "Responsable" : "Collaborateur"}
                            </span>
                          </td>
                          <td style={{ padding: "14px 20px" }}>
                            <span className="serif" style={{ fontSize: 18 }}>{c.leads}</span>
                          </td>
                          <td style={{ padding: "14px 20px" }}>
                            <button type="button" onClick={() => setStatsCollab(c)} title="Voir le détail par canal"
                              style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink)", borderBottom: "1px dashed var(--ink-4)" }}>
                              <span className="serif" style={{ fontSize: 18 }}>{totalClics}</span>
                              <Icon.ChevronRight size={12} />
                            </button>
                          </td>
                          {canManage && (
                            <td style={{ padding: "14px 20px" }}>
                              <div className="row gap-1">
                                <button className="btn btn-ghost btn-sm" onClick={() => toggleRole(c.id)} title={isResp ? "Rétrograder" : "Promouvoir"}>
                                  {isResp ? <Icon.User size={13} /> : <Icon.Crown size={13} />}
                                </button>
                                <button className="btn btn-ghost btn-sm" onClick={() => remove(c.id)} title="Supprimer l'accès">
                                  <Icon.Trash size={13} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <CollabStatsModal collab={statsCollab} onClose={() => setStatsCollab(null)} />
    </div>
  );
}
window.DashboardPage = DashboardPage;

function CollabStatsModal({ collab, onClose }) {
  if (!collab) return null;
  const s = collab.stats || {};
  const totalLeads = s.total_leads || 0;
  const totalAddContact = s.total_clic_add_contact || 0;
  const scans = s.total_scan || 0;
  const channels = [
    { key: "scans",     label: "Scans",     icon: <Icon.QR size={14} />,       color: "#6b5b4f", clicks: scans,                    isScans: true },
    { key: "mail",      label: "Mail",      icon: <Icon.Mail size={14} />,      color: "#8a6d3b", clicks: s.total_clic_mail      || 0 },
    { key: "whatsapp",  label: "WhatsApp",  icon: <Icon.WhatsApp size={14} />,  color: "#25d366", clicks: s.total_clic_whatsapp  || 0 },
    { key: "instagram", label: "Instagram", icon: <Icon.Instagram size={14} />, color: "#c13584", clicks: s.total_clic_instagram || 0 },
    { key: "linkedin",  label: "LinkedIn",  icon: <Icon.Linkedin size={14} />,  color: "#0a66c2", clicks: s.total_clic_linkedin  || 0 },
    { key: "website",   label: "Site web",  icon: <Icon.Globe size={14} />,     color: "#1a1815", clicks: s.total_clic_site_web  || 0 },
    { key: "crm",       label: "CRM",       icon: <Icon.User size={14} />,      color: "#b8843e", clicks: s.total_clic_crm       || 0 },
  ];
  const totalClicks = channels.filter(c => !c.isScans).reduce((sum, c) => sum + c.clicks, 0);
  const max = Math.max(...channels.map(c => c.clicks), 1);

  return (
    <Modal open={!!collab} onClose={onClose} title={`Détail — ${collab.prenom} ${collab.nom}`}>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>{collab.poste || "Collaborateur"} · Période sélectionnée</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 8 }}>
        <div className="card" style={{ padding: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Leads</div>
          <div className="serif" style={{ fontSize: 26, lineHeight: 1, letterSpacing: "-0.02em" }}>{totalLeads}</div>
        </div>
        <div className="card" style={{ padding: 14, background: "linear-gradient(135deg, #fdf3df, #f1deb6)", borderColor: "var(--gold)" }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Add contact</div>
          <div className="serif" style={{ fontSize: 26, lineHeight: 1, letterSpacing: "-0.02em" }}>{totalAddContact}</div>
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
          {channels.map(ch => (
            <div key={ch.key} className="col gap-1">
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div className="row gap-2" style={{ alignItems: "center" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--surface-2)", color: ch.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{ch.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ch.label}</div>
                </div>
                <div className="row gap-2" style={{ alignItems: "baseline" }}>
                  {!ch.isScans && totalClicks > 0 && <span className="dim" style={{ fontSize: 11 }}>{Math.round((ch.clicks / totalClicks) * 100)}%</span>}
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

// ---------- Mon compte ----------
function SecretCodePage({ role, plan, onUpgrade }) {
  const [code, setCode] = useStateD(window.CARTALIS_DATA.entreprise.code_secret);
  const [showRegenConfirm, setShowRegenConfirm] = useStateD(false);
  // manageModal steps: null | "choice" | "cancel-confirm" | "cancel-reason" | "cancel-done"
  const [manageStep, setManageStep] = useStateD(null);
  const [cancelReason, setCancelReason] = useStateD(null);
  const [saving, setSaving] = useStateD(false);
  const toast = useToast();

  const meInit = window.CARTALIS_DATA.profileMe;
  const entInit = window.CARTALIS_DATA.entreprise;
  const [profile, setProfile] = useStateD({
    prenom: meInit.prenom,
    nom: meInit.nom,
    email: meInit.email,
    telephone: meInit.telephone,
    poste: meInit.poste,
    site_web: meInit.site_web || "",
    instagram: meInit.instagram || "",
    linkedin: meInit.linkedin || "",
    nom_entreprise: entInit.nom_entreprise,
  });
  const setField = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const [langue, setLangue] = useStateD("fr");

  const canManage = role === "admin" || role === "manager";

  // Sauvegarde réelle : profil → table profiles ; nom_entreprise (admin) → table entreprises
  const saveProfile = async () => {
    if (saving) return;
    setSaving(true);
    try {
      let uid = meInit.id;
      if (window.sb) {
        const { data: { user } } = await window.sb.auth.getUser();
        if (user?.id) uid = user.id;
      }
      if (!uid) throw new Error('Utilisateur non authentifié.');
      if (!window.CardlyAPI) throw new Error('Service indisponible.');

      // 1) Mise à jour du profil
      const { error: pErr } = await window.CardlyAPI.upsertProfile(uid, {
        prenom:    profile.prenom    || null,
        nom:       profile.nom       || null,
        email:     profile.email     || null,
        telephone: profile.telephone || null,
        poste:     profile.poste     || null,
        site_web:  profile.site_web  || null,
        instagram: profile.instagram || null,
        linkedin:  profile.linkedin  || null,
        nom_entreprise: profile.nom_entreprise || null,
      });
      if (pErr) throw pErr;

      // 2) Mise à jour du nom d'entreprise (admin uniquement)
      if (canManage && entInit.id && profile.nom_entreprise && profile.nom_entreprise !== entInit.nom_entreprise) {
        const { error: eErr } = await window.sb.from('entreprises')
          .update({ nom_entreprise: profile.nom_entreprise })
          .eq('id', entInit.id);
        if (eErr) throw eErr;
        window.CARTALIS_DATA.entreprise.nom_entreprise = profile.nom_entreprise;
      }

      // 3) Mise à jour du cache local
      Object.assign(window.CARTALIS_DATA.profileMe, {
        prenom:    profile.prenom,
        nom:       profile.nom,
        email:     profile.email,
        telephone: profile.telephone,
        poste:     profile.poste,
        site_web:  profile.site_web,
        instagram: profile.instagram,
        linkedin:  profile.linkedin,
      });

      toast.push("Informations mises à jour");
    } catch (err) {
      console.error('[Cardly] saveProfile failed:', err);
      toast.push("Erreur : " + (err.message || "impossible d'enregistrer"));
    } finally { setSaving(false); }
  };

  const regen = () => {
    const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    setCode(`CARDLY-${seg()}`);
    setShowRegenConfirm(false);
    toast.push("Nouveau code généré");
  };

  const PLAN_LABELS = { solo: "Solo — 9€/mois", team: "Team — 49,99€/mois", enterprise: "Enterprise — Sur devis" };
  const PLAN_DESC = {
    solo: ["1 utilisateur", "Carte personnelle", "QR code", "Stats personnelles"],
    team: ["Jusqu'à 10 membres", "Cartes entreprise", "Dashboard", "Génération IA", "Personnalisation avancée"],
    enterprise: ["Membres illimités", "Design personnalisé", "Support prioritaire", "Accompagnement dédié"],
  };
  const RENEWAL_DATE = "28/05/2026";

  const CANCEL_REASONS = [
    "Trop cher pour mon usage",
    "Je n'utilise pas assez les fonctionnalités",
    "Je passe sur une solution concurrente",
    "Mon équipe ne l'utilise pas",
    "Problème technique non résolu",
    "Je n'ai plus besoin de cartes digitales",
  ];

  const profileFields = [
    { k: "prenom", label: "Prénom" },
    { k: "nom", label: "Nom" },
    { k: "email", label: "Email" },
    { k: "telephone", label: "Téléphone" },
    { k: "poste", label: "Poste" },
    ...(canManage ? [{ k: "nom_entreprise", label: "Nom entreprise" }] : []),
    { k: "site_web", label: "Site web" },
    { k: "instagram", label: "Instagram" },
    { k: "linkedin", label: "LinkedIn" },
  ];

  return (
    <div className="col gap-6">
      <div className="col gap-2">
        <div className="eyebrow">Compte</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Mon compte</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15 }}>Gérez vos informations personnelles et votre abonnement.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: canManage ? "1fr 1.4fr" : "1fr", gap: 24, alignItems: "start" }} className="account-grid">

        {/* Left — code secret */}
        {canManage && (
          <div className="col gap-4">
            <div className="card" style={{ padding: 32, textAlign: "center", background: "linear-gradient(180deg, #fffdf6 0%, #f7f2e6 100%)" }}>
              <div className="logo-mark" style={{ width: 48, height: 48, fontSize: 20, margin: "0 auto 16px" }}>C</div>
              <div className="dim" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Code secret</div>
              <div className="mono" style={{ fontSize: 34, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 18 }}>{code}</div>
              <p className="muted" style={{ fontSize: 12, marginBottom: 16, marginTop: 0 }}>Transmettez ce code à vos membres pour rejoindre votre espace.</p>
              <div className="row gap-2" style={{ justifyContent: "center" }}>
                <button className="btn btn-sm" onClick={() => { navigator.clipboard?.writeText(code); toast.push("Code copié"); }}><Icon.Copy size={13} /> Copier</button>
                <button className="btn btn-sm" onClick={() => setShowRegenConfirm(true)}><Icon.Refresh size={13} /> Régénérer</button>
              </div>
            </div>
            <div className="card" style={{ padding: 16, background: "#fff8eb", borderColor: "#f0d99c" }}>
              <div className="row gap-3">
                <div style={{ color: "var(--gold)", flexShrink: 0 }}>⚠</div>
                <div className="col" style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 500 }}>Attention</div>
                  <div className="muted">Régénérer invalide l'ancien code pour les nouveaux membres. Ceux déjà rattachés ne sont pas impactés.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right — profile + plan */}
        <div className="col gap-4">
          {/* Profile fields */}
          <div className="card" style={{ padding: 24 }}>
            <div className="serif" style={{ fontSize: 17, marginBottom: 18 }}>Informations personnelles</div>
            <div className="field-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {profileFields.map(({ k, label }) => (
                <div key={k} className="field" style={{ margin: 0 }}>
                  <label style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>{label}</label>
                  <input className="input" style={{ fontSize: 13 }} value={profile[k] || ""} onChange={(e) => setField(k, e.target.value)} />
                </div>
              ))}
            </div>
            {/* Language selector — liquid glass iOS style */}
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Langue de l'interface</div>
              <LangPicker value={langue} onChange={setLangue} />
            </div>

            <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-primary btn-sm" onClick={saveProfile} disabled={saving}>
                <Icon.Check size={13} /> {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>

          {/* Plan */}
          <div className="card" style={{ padding: 24 }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div className="serif" style={{ fontSize: 17 }}>Abonnement</div>
              <span className="chip chip-gold" style={{ fontSize: 11 }}>{plan === "team" ? "Team" : plan === "solo" ? "Solo" : "Enterprise"}</span>
            </div>
            <div className="row gap-3" style={{ alignItems: "baseline", marginBottom: 6, flexWrap: "wrap" }}>
              <div style={{ fontSize: 14 }}><strong>{PLAN_LABELS[plan] || plan}</strong></div>
              <div className="muted" style={{ fontSize: 12 }}>· Renouvellement le {RENEWAL_DATE}</div>
            </div>
            <div className="muted" style={{ fontSize: 12, marginBottom: 18 }}>
              {(PLAN_DESC[plan] || []).join(" · ")}
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => setManageStep("choice")}><Icon.Crown size={13} /> Gérer l'abonnement</button>
          </div>
        </div>
      </div>

      {/* Regen confirm modal */}
      <Modal open={showRegenConfirm} onClose={() => setShowRegenConfirm(false)} title="Régénérer le code ?">
        <p className="muted" style={{ marginTop: 0 }}>Cette action est définitive. L'ancien code <span className="mono">{code}</span> ne pourra plus être utilisé.</p>
        <div className="row gap-3" style={{ justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-sm" onClick={() => setShowRegenConfirm(false)}>Annuler</button>
          <button className="btn btn-primary btn-sm" onClick={regen}>Confirmer</button>
        </div>
      </Modal>

      {/* Gérer l'abonnement — step 1: choice */}
      <Modal open={manageStep === "choice"} onClose={() => setManageStep(null)} title="Gérer l'abonnement">
        <p className="muted" style={{ marginTop: 0, marginBottom: 20, fontSize: 14 }}>Que souhaitez-vous faire avec votre abonnement {plan === "team" ? "Team" : plan === "solo" ? "Solo" : "Enterprise"} ?</p>
        <div className="col gap-3">
          <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={() => { setManageStep(null); onUpgrade(); }}>
            <Icon.Crown size={14} /> Voir les plans — Upgrade
          </button>
          <button className="btn" style={{ justifyContent: "center", color: "var(--bad, #c0392b)", borderColor: "var(--bad, #c0392b)" }} onClick={() => setManageStep("cancel-confirm")}>
            Annuler mon abonnement
          </button>
        </div>
      </Modal>

      {/* Step 2: cancel confirmation — show what they lose */}
      <Modal open={manageStep === "cancel-confirm"} onClose={() => setManageStep(null)} title="Annuler l'abonnement ?">
        <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>Êtes-vous sûr de vouloir annuler ? Vous perdrez l'accès à :</p>
        <div className="col gap-2" style={{ marginBottom: 20 }}>
          {(PLAN_DESC[plan] || []).map((f, i) => (
            <div key={i} className="row gap-2" style={{ fontSize: 13, color: "var(--ink-2)", alignItems: "center" }}>
              <span style={{ color: "var(--bad, #c0392b)", fontSize: 16, lineHeight: 1 }}>✕</span>
              {f}
            </div>
          ))}
        </div>
        <p className="muted" style={{ fontSize: 12, marginBottom: 20 }}>Votre abonnement restera actif jusqu'au {RENEWAL_DATE}.</p>
        <div className="row gap-3" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-sm" onClick={() => setManageStep("choice")}>Retour</button>
          <button className="btn btn-sm" style={{ background: "var(--bad, #c0392b)", color: "white", border: "none" }} onClick={() => setManageStep("cancel-reason")}>
            Oui, annuler
          </button>
        </div>
      </Modal>

      {/* Step 3: reason */}
      <Modal open={manageStep === "cancel-reason"} onClose={() => setManageStep(null)} title="Pourquoi nous quittez-vous ?">
        <p className="muted" style={{ marginTop: 0, fontSize: 14, marginBottom: 16 }}>Aidez-nous à nous améliorer. Choisissez la raison principale :</p>
        <div className="col gap-2" style={{ marginBottom: 20 }}>
          {CANCEL_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setCancelReason(r)}
              className="card"
              style={{
                padding: "10px 14px", textAlign: "left", cursor: "pointer", fontSize: 13,
                background: cancelReason === r ? "var(--surface-2)" : "var(--surface)",
                borderColor: cancelReason === r ? "var(--ink)" : "var(--line)",
                borderWidth: cancelReason === r ? 1.5 : 1,
                transition: "all 120ms",
              }}
            >
              <div className="row gap-2" style={{ alignItems: "center" }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                  border: cancelReason === r ? "4px solid var(--ink)" : "1.5px solid var(--line-2)",
                  background: "white",
                  transition: "all 120ms",
                }} />
                {r}
              </div>
            </button>
          ))}
        </div>
        <div className="row gap-3" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-sm" onClick={() => setManageStep("cancel-confirm")}>Retour</button>
          <button
            className="btn btn-sm"
            style={{ background: "var(--bad, #c0392b)", color: "white", border: "none", opacity: cancelReason ? 1 : 0.5 }}
            disabled={!cancelReason}
            onClick={() => setManageStep("cancel-done")}
          >
            Confirmer l'annulation
          </button>
        </div>
      </Modal>

      {/* Step 4: done */}
      <Modal open={manageStep === "cancel-done"} onClose={() => setManageStep(null)} title="">
        <div className="col gap-4" style={{ alignItems: "center", textAlign: "center", padding: "8px 0 16px" }}>
          <div style={{ fontSize: 40 }}>👋</div>
          <div className="serif" style={{ fontSize: 22 }}>Abonnement annulé</div>
          <p className="muted" style={{ fontSize: 13, margin: 0, maxWidth: 360 }}>
            Votre abonnement <strong>{plan === "team" ? "Team" : plan === "solo" ? "Solo" : "Enterprise"}</strong> a bien été annulé.
            Vous conservez l'accès jusqu'au <strong>{RENEWAL_DATE}</strong>. Merci d'avoir utilisé Cartalis.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => { setManageStep(null); setCancelReason(null); onUpgrade(); }}>
            <Icon.Crown size={14} /> Voir les autres plans
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setManageStep(null); setCancelReason(null); }}>
            Fermer
          </button>
        </div>
      </Modal>
    </div>
  );
}
window.SecretCodePage = SecretCodePage;

// ---------- LangPicker — liquid glass iOS dropdown ----------
function LangPicker({ value, onChange }) {
  const [open, setOpen] = useStateD(false);
  const ref = React.useRef(null);

  const LANGS = [
    { code: "fr", flag: "🇫🇷", label: "Français" },
    { code: "en", flag: "🇬🇧", label: "English" },
    { code: "es", flag: "🇪🇸", label: "Español" },
  ];
  const current = LANGS.find(l => l.code === value) || LANGS[0];

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const glassBase = {
    background: "rgba(255,255,255,0.45)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.65)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)",
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          ...glassBase,
          display: "inline-flex", alignItems: "center", gap: 9,
          padding: "9px 16px 9px 12px",
          borderRadius: 14, cursor: "pointer",
          fontSize: 14, fontWeight: 500, color: "var(--ink)",
          minWidth: 160,
          transition: "box-shadow 150ms, background 150ms",
        }}
      >
        <span style={{ flex: 1, textAlign: "left" }}>{current.label}</span>
        {/* Chevron */}
        <svg
          width={13} height={13} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: 0.5, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          ...glassBase,
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          borderRadius: 16, overflow: "hidden",
          minWidth: 160, zIndex: 100,
          animation: "fade-up 150ms ease both",
        }}>
          {LANGS.map(({ code, flag, label }, i) => (
            <button
              key={code}
              onClick={() => { onChange(code); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "11px 16px",
                background: value === code ? "rgba(0,0,0,0.07)" : "transparent",
                border: "none",
                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.55)" : "none",
                cursor: "pointer",
                fontSize: 13.5, fontWeight: value === code ? 600 : 400,
                color: "var(--ink)",
                transition: "background 100ms",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = value === code ? "rgba(0,0,0,0.07)" : "transparent"}
            >
              {label}
              {value === code && (
                <svg style={{ marginLeft: "auto", color: "var(--ink)" }} width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Feedback page ----------
function FeedbackPage() {
  const me = window.CARTALIS_DATA.profileMe;

  // step: "choose" | "confirm" | "chat"
  const [step, setStep] = useStateD("choose");
  const [category, setCategory] = useStateD(null); // "problem" | "idea"

  // Contact editable (not saved to profile)
  const [contactEmail, setContactEmail] = useStateD(me.email || "");
  const [contactPhone, setContactPhone] = useStateD(me.telephone || "");

  // Chat
  const [messages, setMessages] = useStateD([]);
  const [input, setInput] = useStateD("");
  const [sent, setSent] = useStateD(false);
  const [sending, setSending] = useStateD(false);
  const bottomRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const introFor = (cat) => cat === "problem"
    ? "🐛 Bonjour " + (me.prenom || '') + " ! Décrivez le problème que vous avez rencontré — nous vous recontacterons dans les 48h sur " + (contactEmail || me.email || '') + "."
    : "💡 Bonjour " + (me.prenom || '') + " ! Quelle idée souhaitez-vous partager ? On lit tout.";

  // Mapping entre valeurs UI ("idea"/"problem") et valeurs DB autorisées par
  // la contrainte CHECK mes_idees_categorie_check.
  const uiCatToDb = (cat) => cat === "problem" ? "problemes_rencontres" : "mes_idees";
  const dbCatToUi = (cat) => cat === "problemes_rencontres" ? "problem" : "idea";

  // Charge l'historique des messages utilisateur depuis la DB (RLS : sender='user' uniquement).
  // Les bulles bot (intro + accusé) sont régénérées côté UI pour garder le contexte.
  React.useEffect(() => {
    if (!me.id || !window.CardlyAPI) return;
    (async () => {
      try {
        const { data } = await window.CardlyAPI.getIdees(me.id);
        if (data && data.length) {
          const lastCat = dbCatToUi(data[data.length - 1].categorie);
          const reconstructed = [{ from: "cardly", text: introFor(lastCat) }];
          data.forEach((r, i) => {
            reconstructed.push({ from: "user", text: r.message });
            // Insère un accusé après chaque message utilisateur, sauf après le dernier (on l'ajoute après pour matcher l'envoi en cours)
            if (i < data.length - 1) {
              reconstructed.push({ from: "cardly", text: "Merci pour votre retour ! 🙏 On prend bonne note et on revient vers vous si nécessaire." });
            }
          });
          reconstructed.push({ from: "cardly", text: "Merci pour votre retour ! 🙏 On prend bonne note et on revient vers vous si nécessaire." });
          setMessages(reconstructed);
          setCategory(lastCat);
          setStep("chat");
          setSent(true);
        }
      } catch (err) {
        console.error('[Cardly] getIdees failed:', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openChat = (cat) => {
    setMessages([{ from: "cardly", text: introFor(cat) }]);
    setStep("chat");
    setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 150);
  };

  const chooseCategory = (cat) => {
    setCategory(cat);
    if (cat === "problem") {
      setStep("confirm");
    } else {
      openChat("idea");
    }
  };

  const confirmContact = () => { openChat("problem"); };

  const send = async () => {
    const txt = input.trim();
    if (!txt || sending) return;
    setMessages(m => [...m, { from: "user", text: txt }]);
    setInput("");
    setSent(true);
    setSending(true);
    // Persister le message utilisateur en DB (RLS : sender='user' obligatoire)
    // On récupère l'auth.uid() en direct plutôt que de se fier au cache profileMe,
    // au cas où la session aurait été restaurée mais pas le cache local.
    try {
      let uid = me.id;
      if (window.sb) {
        const { data: { user } } = await window.sb.auth.getUser();
        if (user?.id) uid = user.id;
      }
      if (!uid) throw new Error('Utilisateur non authentifié.');
      if (!window.CardlyAPI) throw new Error('Service indisponible.');

      const { data, error } = await window.CardlyAPI.sendMessage(uid, {
        message: txt,
        categorie: uiCatToDb(category || 'idea'),
        mail: contactEmail,
        telephone: contactPhone,
      });
      if (error) {
        console.error('[Cardly] sendMessage RLS/DB error:', error);
        setMessages(m => [...m, { from: "cardly", text: "⚠️ Impossible d'enregistrer votre message (" + (error.message || error.code || 'erreur inconnue') + "). Réessayez plus tard." }]);
        setSending(false);
        return;
      }
      console.log('[Cardly] message saved:', data);
    } catch (err) {
      console.error('[Cardly] sendMessage threw:', err);
      setMessages(m => [...m, { from: "cardly", text: "⚠️ " + (err.message || 'Erreur réseau.') }]);
      setSending(false);
      return;
    }
    setSending(false);
    setTimeout(() => {
      setMessages(m => [...m, { from: "cardly", text: "Merci pour votre retour ! 🙏 On prend bonne note et on revient vers vous si nécessaire." }]);
    }, 800);
  };

  React.useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* shared card avatar */
  const CardAvatar = () => (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: "linear-gradient(135deg, var(--gold-2), var(--gold))",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0,
    }}>C</div>
  );

  const BubbleAvatar = ({ side }) => side === "cardly" ? (
    <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, var(--gold-2), var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white" }}>C</div>
  ) : (
    <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--ink)" }}>{me.prenom[0]}{me.nom[0]}</div>
  );

  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div className="hero-bg" />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520 }}>
        {/* Header */}
        <div className="col gap-2" style={{ alignItems: "center", textAlign: "center", marginBottom: 32 }}>
          <div className="chip" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            <Icon.Sparkle size={12} /> Idée ou problème · Cartalis
          </div>
          <h1 className="serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Aidez-nous à<br/>construire mieux.
          </h1>
          <p className="muted" style={{ fontSize: 15, margin: 0 }}>
            Une fonctionnalité manquante, un bug, une suggestion — tout compte.
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ borderRadius: 22, overflow: "hidden", padding: 0, background: "linear-gradient(135deg, #fdfbf3 0%, #f5edd9 100%)", position: "relative", boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}>
          <img src="assets/card-back.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            {/* Card header bar */}
            <div className="row gap-3" style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.07)", alignItems: "center" }}>
              <CardAvatar />
              <div className="col" style={{ lineHeight: 1.3 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Cartalis</div>
                <div className="dim" style={{ fontSize: 12 }}>Équipe produit · répond sous 48h</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--good, #2d7a4f)", flexShrink: 0, whiteSpace: "nowrap" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--good, #2d7a4f)", display: "inline-block", flexShrink: 0 }} />
                En ligne
              </div>
            </div>

            {/* ── STEP 1 : Choix de catégorie ── */}
            {step === "choose" && (
              <div style={{ padding: "28px 24px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ margin: "0 0 6px", fontSize: 13.5, color: "var(--ink-2)", textAlign: "center" }}>
                  De quoi souhaitez-vous nous parler ?
                </p>
                {[
                  {
                    cat: "problem",
                    emoji: "🐛",
                    title: "Problème rencontré",
                    sub: "Un bug, un dysfonctionnement ou une erreur — on vous recontacte.",
                  },
                  {
                    cat: "idea",
                    emoji: "💡",
                    title: "Une idée pour améliorer Cartalis",
                    sub: "Une fonctionnalité manquante, une suggestion — on lit tout.",
                  },
                ].map(({ cat, emoji, title, sub }) => (
                  <button
                    key={cat}
                    onClick={() => chooseCategory(cat)}
                    style={{
                      padding: "16px 20px", borderRadius: 14,
                      border: "1.5px solid var(--line)", background: "white",
                      cursor: "pointer", textAlign: "left",
                      display: "flex", flexDirection: "column", gap: 5,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#ae863d"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(174,134,61,0.13)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{emoji} {title}</span>
                    <span style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.45 }}>{sub}</span>
                  </button>
                ))}
              </div>
            )}

            {/* ── STEP 2 : Confirmation coordonnées (problème seulement) ── */}
            {step === "confirm" && (
              <div style={{ padding: "28px 24px 32px", display: "flex", flexDirection: "column", gap: 22 }}>
                <div>
                  <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600 }}>🐛 Problème rencontré</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
                    Vérifiez vos coordonnées — on vous recontactera directement dessus.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--ink-3)", display: "block", marginBottom: 5, fontWeight: 500 }}>Email</label>
                    <input
                      className="input"
                      style={{ width: "100%", fontSize: 13.5, borderRadius: 10, padding: "9px 13px", background: "white", border: "1px solid var(--line)", boxSizing: "border-box" }}
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--ink-3)", display: "block", marginBottom: 5, fontWeight: 500 }}>Téléphone</label>
                    <input
                      className="input"
                      style={{ width: "100%", fontSize: 13.5, borderRadius: 10, padding: "9px 13px", background: "white", border: "1px solid var(--line)", boxSizing: "border-box" }}
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                    />
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-4)", fontStyle: "italic" }}>
                  Ces informations ne mettent pas à jour votre profil.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn" style={{ flex: 1, fontSize: 13.5 }} onClick={() => setStep("choose")}>
                    ← Retour
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 2, fontSize: 13.5 }}
                    onClick={confirmContact}
                    disabled={!contactEmail.trim()}
                  >
                    Valider — décrire le problème
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 : Chat ── */}
            {step === "chat" && (
              <>
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12, minHeight: 200, maxHeight: 340, overflowY: "auto" }}>
                  {messages.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                      {m.from === "cardly" && <BubbleAvatar side="cardly" />}
                      <div style={{
                        maxWidth: "78%", padding: "10px 14px",
                        borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: m.from === "user" ? "var(--ink)" : "white",
                        color: m.from === "user" ? "white" : "var(--ink)",
                        fontSize: 13.5, lineHeight: 1.55,
                        boxShadow: m.from === "cardly" ? "0 1px 6px rgba(0,0,0,0.07)" : "none",
                      }}>{m.text}</div>
                      {m.from === "user" && <BubbleAvatar side="user" />}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}>
                  <input
                    ref={inputRef}
                    className="input"
                    style={{ flex: 1, fontSize: 13.5, borderRadius: 22, padding: "10px 16px", background: "white", border: "1px solid var(--line)" }}
                    placeholder={sent ? "Envoyer un autre message…" : category === "problem" ? "Décrivez votre problème…" : "Tapez votre idée ou suggestion…"}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") send(); }}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ borderRadius: "50%", width: 40, height: 40, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    onClick={send}
                    disabled={!input.trim() || sending}
                  >
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="muted" style={{ textAlign: "center", fontSize: 12, marginTop: 16 }}>
          Vos messages sont transmis directement à l'équipe Cartalis.
        </p>
      </div>
    </div>
  );
}
window.FeedbackPage = FeedbackPage;

// ---------- Subscription ----------
function SubscriptionPage({ plan, onSetPlan }) {
  return (
    <div className="col gap-8">
      <div className="col gap-2">
        <div className="eyebrow">Abonnement</div>
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>Votre plan Cartalis</h1>
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
          cta="Contacter Cartalis"
          onCta={() => window.location.href = "mailto:contact.cardly@gmail.com"}
        />
      </div>
    </div>
  );
}
window.SubscriptionPage = SubscriptionPage;

// ---------- Public scanned card page ----------
// ── Helpers pour la page publique (vCard, normalisation tel, messages) ──
function normalizePhoneForWA(phone) {
  if (!phone) return '';
  // Strip spaces, dashes, parens, dots; keep digits and leading "+"
  let p = phone.replace(/[\s\-\(\)\.]/g, '');
  if (p.startsWith('+')) p = p.slice(1);
  else if (p.startsWith('00')) p = p.slice(2);
  else if (p.startsWith('0')) p = '33' + p.slice(1); // assume French local format
  return p.replace(/\D/g, ''); // any remaining non-digits gone
}

function downloadVCard(card) {
  const esc = (s) => String(s || '').replace(/([,;\\])/g, '\\$1');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc((card.prenom_affiche || '') + ' ' + (card.nom_affiche || '')).trim()}`,
    `N:${esc(card.nom_affiche)};${esc(card.prenom_affiche)};;;`,
    card.entreprise_affiche ? `ORG:${esc(card.entreprise_affiche)}` : null,
    card.poste_affiche ? `TITLE:${esc(card.poste_affiche)}` : null,
    card.telephone_affiche ? `TEL;TYPE=CELL:${esc(card.telephone_affiche)}` : null,
    card.email_affiche ? `EMAIL;TYPE=INTERNET:${esc(card.email_affiche)}` : null,
    card.site_web ? `URL:${esc(card.site_web.startsWith('http') ? card.site_web : 'https://' + card.site_web)}` : null,
    'END:VCARD',
  ].filter(Boolean).join('\r\n');
  const blob = new Blob([lines], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(card.prenom_affiche || 'contact')}-${(card.nom_affiche || '')}.vcf`.replace(/\s+/g, '_');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const PUBLIC_WA_MESSAGE  = "Bonjour, j'ai bien pris votre contact et je serais ravi(e) que vous me recontactiez. Merci !";
const PUBLIC_MAIL_SUBJECT = "Contact suite à notre échange";
const PUBLIC_MAIL_BODY    = "Bonjour,\n\nJ'ai bien pris votre contact et je serais ravi(e) que vous me recontactiez.\n\nMerci !";

function PublicCardPage({ navigate, params }) {
  const cardId = params.get("id") || "";
  const nfcUuid = params.get("nfc") || "";
  const inactive = params.get("inactive") === "1";
  const toast = useToast();
  const [savedCount, setSavedCount] = useStateD(0);
  const [flipped, setFlipped] = useStateD(false);
  const [crmModalOpen, setCrmModalOpen] = useStateD(false);
  // État : on tente d'abord le cache local, puis un fetch frais depuis la DB
  const [card, setCard] = useStateD(() =>
    cardId ? (window.CARTALIS_DATA.cards.find(c => c.id === cardId) || null) : null
  );
  const ent = window.CARTALIS_DATA.entreprise;

  const { useEffect: useEffectPub } = React;
  const scanTrackedRef = React.useRef(false);
  useEffectPub(() => {
    if (!window.CardlyAPI || !window.sb) return;
    if (!cardId && !nfcUuid) return;
    // Toujours faire un fetch frais : c'est une page publique, on veut
    // les dernières infos (notamment entreprise.website qui peut avoir
    // été oublié dans le cache du LoginForm).
    (async () => {
      try {
        // Si on a un nfc_uuid : on le résout d'abord en carte_uuid via la fonction publique.
        let effectiveCardId = cardId;
        if (!effectiveCardId && nfcUuid) {
          const { data: resolved, error: resErr } = await window.CardlyAPI.resolveNFC(nfcUuid);
          if (resErr || !resolved) {
            console.error('[Cardly] resolveNFC failed:', resErr);
            return;
          }
          effectiveCardId = resolved;
        }
        if (!effectiveCardId) return;
        const { data: raw } = await window.CardlyAPI.getCarteByUuid(effectiveCardId);
        if (!raw) return;
        // Charger le profil du propriétaire de la carte
        const { data: profile } = raw.collaborateur_id
          ? await window.CardlyAPI.getProfile(raw.collaborateur_id)
          : { data: null };
        // Charger l'entreprise (avec website)
        let entrepriseData = null;
        if (raw.entreprise_id) {
          const { data: ent } = await window.sb
            .from('entreprises')
            .select('id, nom_entreprise, plan, website')
            .eq('id', raw.entreprise_id)
            .single();
          entrepriseData = ent;
        }
        const mapped = window.CardlyAPI.mapCarteFromDB(raw, profile, entrepriseData);
        setCard(mapped);

        // SCAN tracking : dès que la page publique a chargé une carte
        // valide, on incrémente +1 scan (une seule fois par mount, garde
        // contre les re-runs de useEffect en strict mode / hot reload).
        if (!scanTrackedRef.current && mapped?.id && !inactive) {
          scanTrackedRef.current = true;
          window.CardlyAPI.trackAction(mapped.id, 'scan');
        }
      } catch (err) {
        console.error('[Cardly] PublicCardPage fetch failed:', err);
      }
    })();
  }, [cardId, nfcUuid]);

  if (!card) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="dim" style={{ fontSize: 14 }}>Chargement de la carte…</div>
      </div>
    );
  }

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

        <div onClick={() => setFlipped(f => !f)} style={{ cursor: "pointer", display: "inline-block" }}>
          <Card3D card={card} width={Math.min(380, window.innerWidth - 60)} float={true} flipped={flipped} frontImageUrl={card.frontImageUrl} backImageUrl={card.backImageUrl} />
        </div>

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
            onClick={() => {
              // Fire the trackAction BEFORE triggering the vCard download.
              // On iOS the .vcf download hands off to the Contacts app and
              // suspends the browser tab → a pending fetch can get killed.
              // (Combined with keepalive:true in CardlyAPI.trackAction this
              //  is a belt-and-suspenders fix.)
              if (window.CardlyAPI?.trackAction) window.CardlyAPI.trackAction(card.id, 'clic_add_contact');
              downloadVCard(card);
              setSavedCount(savedCount + 1);
              toast.push("Contact ajouté à votre carnet");
            }}
          >
            <Icon.User size={14} /> Enregistrer dans mes contacts
          </button>
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            <button
              disabled={inactive || !card.telephone_affiche}
              className="btn btn-sm"
              style={{ flex: 1, minWidth: 130, justifyContent: "center" }}
              onClick={() => {
                const phone = normalizePhoneForWA(card.telephone_affiche);
                if (!phone) { toast.push("Numéro non disponible"); return; }
                // window.location.href (not window.open _blank) → no leftover
                // about:blank tab on iOS when WhatsApp app intercepts the URL.
                if (window.CardlyAPI?.trackAction) window.CardlyAPI.trackAction(card.id, 'clic_whatsapp');
                window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(PUBLIC_WA_MESSAGE)}`;
              }}
            >
              <Icon.WhatsApp size={13} /> WhatsApp
            </button>
            <button
              disabled={inactive || !card.email_affiche}
              className="btn btn-sm"
              style={{ flex: 1, minWidth: 110, justifyContent: "center" }}
              onClick={() => {
                if (!card.email_affiche) { toast.push("Email non disponible"); return; }
                if (window.CardlyAPI?.trackAction) window.CardlyAPI.trackAction(card.id, 'clic_mail');
                window.location.href = `mailto:${encodeURIComponent(card.email_affiche)}?subject=${encodeURIComponent(PUBLIC_MAIL_SUBJECT)}&body=${encodeURIComponent(PUBLIC_MAIL_BODY)}`;
              }}
            >
              <Icon.Mail size={13} /> Email
            </button>
            <button disabled={inactive} className="btn btn-sm" style={{ flex: 1, minWidth: 140, justifyContent: "center" }} onClick={() => setCrmModalOpen(true)}>
              <Icon.User size={13} /> Partager mes infos
            </button>
            <button
              disabled={inactive || !card.site_web}
              className="btn btn-sm"
              style={{ flex: 1, minWidth: 110, justifyContent: "center" }}
              onClick={() => {
                if (!card.site_web) { toast.push("Site non disponible"); return; }
                const url = card.site_web.startsWith('http') ? card.site_web : 'https://' + card.site_web;
                if (window.CardlyAPI?.trackAction) window.CardlyAPI.trackAction(card.id, 'clic_site_web');
                window.open(url, "_blank");
              }}
            >
              <Icon.Globe size={13} /> Site web
            </button>
            {card.scanButtons?.rdv && card.rdvUrl && (
              <button disabled={inactive} className="btn btn-sm" style={{ flex: 1, minWidth: 130, justifyContent: "center" }} onClick={() => { window.open(card.rdvUrl, "_blank"); toast.push("Calendrier ouvert"); }}>
                <Icon.Calendar size={13} /> Prendre RDV
              </button>
            )}
          </div>
          <div className="row gap-3" style={{ justifyContent: "center", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
            <a
              href={card.instagram_url ? (card.instagram_url.startsWith('http') ? card.instagram_url : 'https://' + card.instagram_url) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (inactive || !card.instagram_url) { e.preventDefault(); if (!card.instagram_url) toast.push("Instagram non renseigné"); return; }
                if (window.CardlyAPI?.trackAction) window.CardlyAPI.trackAction(card.id, 'clic_instagram');
              }}
              style={{ opacity: inactive || !card.instagram_url ? 0.4 : 1, pointerEvents: inactive ? "none" : "auto", display: "flex", cursor: card.instagram_url ? "pointer" : "default" }}
              title="Instagram"
            >
              <Icon.Instagram size={46} />
            </a>
            <a
              href={card.linkedin_url ? (card.linkedin_url.startsWith('http') ? card.linkedin_url : 'https://' + card.linkedin_url) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (inactive || !card.linkedin_url) { e.preventDefault(); if (!card.linkedin_url) toast.push("LinkedIn non renseigné"); return; }
                if (window.CardlyAPI?.trackAction) window.CardlyAPI.trackAction(card.id, 'clic_linkedin');
              }}
              style={{ opacity: inactive || !card.linkedin_url ? 0.4 : 1, pointerEvents: inactive ? "none" : "auto", display: "flex", cursor: card.linkedin_url ? "pointer" : "default" }}
              title="LinkedIn"
            >
              <Icon.Linkedin size={46} />
            </a>
          </div>
        </div>

        <div className="dim" style={{ fontSize: 12, textAlign: "center" }}>
          Propulsé par <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ color: "var(--ink)", textDecoration: "underline" }}>Cartalis</a> · La carte de visite qui ne finit pas dans une poche.
        </div>
      </div>

      <CrmShareModal
        open={crmModalOpen}
        onClose={() => setCrmModalOpen(false)}
        fields={card.crmFields || { nom: true, prenom: true, societe: true, mail: true, tel: true }}
        onSubmit={(data) => {
          // Instantaneous UX: close modal + toast immediately, then fire the
          // CRM save in the background. Double-submit is already blocked by
          // CrmShareModal's internal submittingRef guard.
          setCrmModalOpen(false);
          toast.push("Vos infos ont été envoyées");
          (async () => {
            try {
              if (window.CardlyAPI?.saveCRMContact) {
                await window.CardlyAPI.saveCRMContact(card.id, {
                  nom: data.nom,
                  prenom: data.prenom,
                  mail: data.mail,
                  tel: data.tel,
                  prospect_entreprise_nom: data.societe,
                });
              }
              if (window.CardlyAPI?.trackAction) window.CardlyAPI.trackAction(card.id, 'clic_crm');
            } catch (err) {
              console.error('[Cardly] saveCRMContact failed:', err);
              toast.push("Erreur d'envoi — réessayez");
            }
          })();
        }}
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

// ---------- Card picker (dropdown stylé liquid-glass) ----------
function CardPicker({ value, onChange, options, placeholder = "Sélectionner…" }) {
  const [open, setOpen] = useStateD(false);
  const ref = React.useRef(null);
  const current = options.find(o => o.value === value);

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const glassBase = {
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.65)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: 360 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          ...glassBase,
          display: "inline-flex", alignItems: "center", gap: 9,
          padding: "11px 16px", width: "100%",
          borderRadius: 14, cursor: "pointer",
          fontSize: 14, fontWeight: 500, color: "var(--ink)",
        }}
      >
        <span style={{ flex: 1, textAlign: "left", color: current ? "var(--ink)" : "var(--ink-3)" }}>
          {current ? current.label : placeholder}
        </span>
        <svg
          width={13} height={13} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: 0.5, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div style={{
          ...glassBase,
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          borderRadius: 16, overflow: "hidden",
          zIndex: 100, maxHeight: 280, overflowY: "auto",
          animation: "fade-up 150ms ease both",
        }}>
          {options.length === 0 ? (
            <div style={{ padding: "12px 16px", fontSize: 13, color: "var(--ink-3)" }}>Aucune carte disponible</div>
          ) : options.map((opt, i) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "11px 16px",
                background: value === opt.value ? "rgba(0,0,0,0.07)" : "transparent",
                border: "none",
                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.55)" : "none",
                cursor: "pointer",
                fontSize: 13.5, fontWeight: value === opt.value ? 600 : 400,
                color: "var(--ink)", textAlign: "left",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = value === opt.value ? "rgba(0,0,0,0.07)" : "transparent"}
            >
              <span style={{ flex: 1 }}>{opt.label}</span>
              {value === opt.value && (
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Support NFC ----------
function NFCSupportPage() {
  const { useState: useStateN, useEffect: useEffectN } = React;
  const [copied, setCopied] = useStateN(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useStateN(false);
  const [nfcRow, setNfcRow] = useStateN(null);    // ligne nfc_cards en DB
  const [loading, setLoading] = useStateN(true);
  const [linking, setLinking] = useStateN(false);
  const toast = useToast();
  const cards = window.CARTALIS_DATA.cards;
  const me = window.CARTALIS_DATA.profileMe;
  const ent = window.CARTALIS_DATA.entreprise;

  // Construit le lien NFC depuis l'origine actuelle (Vercel) + nfc_uuid
  const nfcLink = nfcRow?.nfc_uuid
    ? `${window.location.origin}${window.location.pathname}#/card?nfc=${nfcRow.nfc_uuid}`
    : "";
  const selectedCard = nfcRow?.carte_uuid || (cards[0] && cards[0].id) || "";

  // Au montage : récupère / crée la ligne nfc_cards de l'utilisateur
  useEffectN(() => {
    if (!window.CardlyAPI || !me.id || !ent.id) { setLoading(false); return; }
    (async () => {
      try {
        const { data } = await window.CardlyAPI.getNFCCards(me.id, ent.id);
        let row = (data && data[0]) || null;
        if (!row) {
          // Pas encore de NFC pour ce user → on en crée une, liée à la première carte si dispo
          const firstCarte = cards[0]?.id || null;
          const { data: created, error: cErr } = await window.CardlyAPI.createNFCCard(me.id, ent.id, firstCarte);
          if (cErr) { console.error('[Cardly] createNFCCard failed:', cErr); }
          else row = created;
        }
        setNfcRow(row);
      } catch (err) {
        console.error('[Cardly] NFC fetch failed:', err);
      } finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedCard = async (carteUuid) => {
    if (!nfcRow?.id || linking) return;
    setLinking(true);
    const prev = nfcRow;
    setNfcRow({ ...prev, carte_uuid: carteUuid });
    try {
      const { error } = await window.CardlyAPI.linkNFCCard(nfcRow.id, carteUuid);
      if (error) throw error;
      toast.push("Carte associée mise à jour");
    } catch (err) {
      console.error('[Cardly] linkNFCCard failed:', err);
      setNfcRow(prev);
      toast.push("Erreur : " + (err.message || "impossible d'associer la carte"));
    } finally { setLinking(false); }
  };

  const regenerate = async () => {
    if (!nfcRow?.id) return;
    try {
      const { data, error } = await window.CardlyAPI.regenerateNFCCard(nfcRow.id);
      if (error) throw error;
      setNfcRow(data);
      setShowRegenerateConfirm(false);
      toast.push("Lien régénéré");
    } catch (err) {
      console.error('[Cardly] regenerateNFCCard failed:', err);
      toast.push("Erreur : " + (err.message || "impossible de régénérer"));
    }
  };

  const copyLink = () => {
    if (!nfcLink) return;
    navigator.clipboard?.writeText(nfcLink);
    setCopied(true);
    toast.push("Lien NFC copié", { icon: <Icon.Copy size={14} /> });
    setTimeout(() => setCopied(false), 2000);
  };

  const STEPS = [
    "Achetez une carte NFC, un sticker NFC ou un badge NFC compatible.",
    "Téléchargez l'application gratuite NFC Tools.",
    "Ouvrez NFC Tools et allez dans \"Écrire\".",
    "Choisissez \"Ajouter un enregistrement\".",
    "Sélectionnez \"URL\".",
    "Collez votre lien NFC Cartalis.",
    "Appuyez sur \"Écrire\".",
    "Approchez votre carte NFC du téléphone.",
    "C'est terminé.",
  ];

  return (
    <div className="col gap-6 fade-up" style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Header */}
      <div className="col gap-2">
        <h1 className="serif" style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: 0, letterSpacing: "-0.02em" }}>
          Support NFC
        </h1>
        <p className="dim" style={{ fontSize: 15, margin: 0 }}>
          Utilisez votre carte Cartalis avec n'importe quel support NFC compatible.
        </p>
      </div>

      {/* Explanatory banner */}
      <div style={{
        background: "linear-gradient(135deg, #fffaf0, #fdf3df)",
        border: "1px solid #ecd5a8",
        borderRadius: 14, padding: "18px 22px",
        display: "flex", gap: 16, alignItems: "flex-start",
      }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}><Icon.Nfc size={20} /></div>
        <div className="col gap-1">
          <div style={{ fontWeight: 500, fontSize: 14 }}>Votre support NFC reste le même. Votre carte digitale peut changer quand vous voulez.</div>
          <div className="dim" style={{ fontSize: 13 }}>Idéal pour utiliser une carte physique tout en gardant la flexibilité du digital.</div>
        </div>
      </div>

      {/* NFC link block */}
      <div className="card" style={{ padding: 24 }}>
        <div className="col gap-4">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div className="serif" style={{ fontSize: 17 }}>Votre lien NFC</div>
            <span className="chip chip-jade"><span className="chip-dot" />Actif</span>
          </div>
          <div style={{
            background: "var(--surface-2)", border: "1px solid var(--line)",
            borderRadius: 10, padding: "12px 16px",
            fontFamily: "var(--font-mono, monospace)", fontSize: 13,
            color: "var(--ink-2)", wordBreak: "break-all",
          }}>
            {loading ? "Chargement…" : (nfcLink || "—")}
          </div>
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-sm row gap-2" onClick={copyLink} disabled={!nfcLink}>
              <Icon.Copy size={13} /> {copied ? "Copié !" : "Copier le lien"}
            </button>
            <button className="btn btn-sm row gap-2" disabled={!nfcLink} onClick={() => { if (nfcLink) window.open(nfcLink, "_blank"); }}>
              <Icon.ArrowRight size={13} /> Ouvrir le lien
            </button>
            {!showRegenerateConfirm ? (
              <button className="btn btn-ghost btn-sm row gap-2" style={{ marginLeft: "auto", color: "var(--ink-3)", fontSize: 12 }} onClick={() => setShowRegenerateConfirm(true)} disabled={!nfcRow}>
                <Icon.Refresh size={12} /> Régénérer
              </button>
            ) : (
              <div className="row gap-2" style={{ marginLeft: "auto", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--ink-3)" }}>L'ancien lien ne fonctionnera plus.</span>
                <button className="btn btn-sm" style={{ fontSize: 12, background: "#c0392b", color: "white", border: "none" }} onClick={regenerate}>Confirmer</button>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }} onClick={() => setShowRegenerateConfirm(false)}>Annuler</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card selector */}
      <div className="card" style={{ padding: 24 }}>
        <div className="col gap-4">
          <div className="serif" style={{ fontSize: 17 }}>Carte affichée lors du scan NFC</div>
          <div className="col gap-2">
            <CardPicker
              value={selectedCard}
              onChange={setSelectedCard}
              placeholder="Sélectionnez une carte"
              options={cards.map(c => ({ value: c.id, label: c.nom_carte || `Carte ${c.id}` }))}
            />
            <div className="dim" style={{ fontSize: 13 }}>
              Vous pouvez changer cette carte à tout moment sans reprogrammer votre support NFC.
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial */}
      <div className="card" style={{ padding: 24 }}>
        <div className="col gap-4">
          <div className="serif" style={{ fontSize: 17 }}>Comment programmer votre carte NFC ?</div>
          <div className="col gap-3">
            {STEPS.map((step, i) => (
              <div key={i} className="row gap-3" style={{ alignItems: "flex-start" }}>
                <div style={{
                  flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
                  background: "var(--ink)", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 600,
                }}>{i + 1}</div>
                <span style={{ fontSize: 14, paddingTop: 4 }}>{step}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: "var(--surface-2)", borderRadius: 10, padding: "12px 16px",
            fontSize: 13, color: "var(--ink-3)", borderLeft: "3px solid var(--gold)",
          }}>
            La version gratuite de NFC Tools suffit normalement pour écrire une URL sur une puce NFC.
          </div>
          <div className="dim" style={{ fontSize: 13 }}>
            Vous pouvez utiliser n'importe quel support NFC compatible — carte, sticker, badge ou porte-clés.
          </div>
        </div>
      </div>
    </div>
  );
}
window.NFCSupportPage = NFCSupportPage;
