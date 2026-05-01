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
  const allContacts = window.CARTALIS_DATA.crmContacts || [];
  const collabs = window.CARTALIS_DATA.collaborators.filter(c => c.statut === "actif");
  const [filterMembre, setFilterMembre] = useStateD("all");
  const [filterEvent, setFilterEvent] = useStateD("all");
  const [search, setSearch] = useStateD("");

  const canManage = role === "admin" || role === "manager";
  const events = [...new Set(allContacts.map(c => c.event))];

  const filtered = allContacts.filter(c => {
    const matchMembre = filterMembre === "all" || c.membre_id === filterMembre;
    const matchEvent = filterEvent === "all" || c.event === filterEvent;
    const q = search.toLowerCase();
    const matchSearch = !q || [c.nom, c.prenom, c.email, c.entreprise, c.membre].some(f => f && f.toLowerCase().includes(q));
    return matchMembre && matchEvent && matchSearch;
  });

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
        <div className="eyebrow">CRM · Avril 2026</div>
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
        <Metric label="Total contacts" value={String(allContacts.length)} delta={`${filtered.length} affiché${filtered.length > 1 ? "s" : ""}`} trend="neutral" />
        <Metric label="Ce mois" value={String(allContacts.filter(c => c.date.includes("/04/2026")).length)} delta="Avril 2026" trend="up" />
        {canManage && <Metric label="Meilleur membre" value={collabs[0] ? `${collabs[0].prenom} ${collabs[0].nom[0]}.` : "—"} delta={`${collabs[0]?.leads || 0} leads`} trend="neutral" />}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="row" style={{ justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
          <div className="serif" style={{ fontSize: 16 }}>Tous les contacts</div>
          <span className="dim" style={{ fontSize: 12 }}>{filtered.length} entrée{filtered.length > 1 ? "s" : ""}</span>
        </div>
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
                <tr><td colSpan={COLS.length} style={{ padding: "32px 20px", textAlign: "center", color: "var(--ink-4)", fontSize: 13 }}>Aucun contact trouvé.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: "13px 20px", fontWeight: 500 }}>{c.prenom}</td>
                  <td style={{ padding: "13px 20px", fontWeight: 500 }}>{c.nom}</td>
                  <td style={{ padding: "13px 20px" }}>
                    <a href={`mailto:${c.email}`} style={{ color: "var(--ink)", textDecoration: "none", borderBottom: "1px dashed var(--line-2)" }}>{c.email}</a>
                  </td>
                  <td style={{ padding: "13px 20px", color: "var(--ink-3)" }}>{c.tel}</td>
                  <td style={{ padding: "13px 20px", color: "var(--ink-3)" }}>{c.entreprise}</td>
                  {canManage && (
                    <td style={{ padding: "13px 20px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                        <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--surface-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600 }}>
                          {c.membre.split(" ").map(w => w[0]).join("")}
                        </span>
                        {c.membre}
                      </span>
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
      </div>
    </div>
  );
}
window.CrmPage = CrmPage;

// ---------- Animated counter component ----------
function AnimCounter({ target, mounted, duration, suffix }) {
  const [val, setVal] = useStateD(0);
  React.useEffect(() => {
    if (!mounted) { setVal(0); return; }
    const d = duration || 1100;
    let startTs = null;
    let rafId;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / d, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) { rafId = requestAnimationFrame(step); }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [mounted, target, duration]);
  return React.createElement(React.Fragment, null, val + (suffix || ""));
}

// ---------- Dashboard ----------
function DashboardPage({ role, trialExpired, onUpgrade }) {
  const [collabs, setCollabs] = useStateD(window.CARTALIS_DATA.collaborators);
  const [statsCollab, setStatsCollab] = useStateD(null);
  const [mounted, setMounted] = useStateD(false);
  const [hoveredDay, setHoveredDay] = useStateD(null);
  const toast = useToast();
  const canManage = role === "admin" || role === "manager";

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const monthOpts = MONTHS.map((m, i) => ({ value: String(i+1).padStart(2,"0"), label: m }));
  const yearOpts = [{ value: "2025", label: "2025" }, { value: "2026", label: "2026" }];
  const [mDebut, setMDebut] = useStateD("01");
  const [yDebut, setYDebut] = useStateD("2026");
  const [mFin, setMFin] = useStateD("04");
  const [yFin, setYFin] = useStateD("2026");
  const [fMembre, setFMembre] = useStateD("all");
  const [fEvent, setFEvent] = useStateD("all");

  const active = collabs.filter(c => c.statut === "actif").sort((a,b) => b.leads - a.leads);
  const tableMembers = collabs.filter(c => c.statut !== "en_attente");
  const pending = collabs.filter(c => c.statut === "en_attente");

  const accept = (id) => { setCollabs(c => c.map(x => x.id === id ? { ...x, statut: "actif" } : x)); toast.push("Membre accepté"); };
  const refuse = (id) => { setCollabs(c => c.filter(x => x.id !== id)); toast.push("Demande refusée"); };
  const remove = (id) => { setCollabs(c => c.map(x => x.id === id ? { ...x, statut: "inactif", leads: 0 } : x)); toast.push("Accès supprimé"); };
  const toggleRole = (id) => { setCollabs(c => c.map(x => x.id === id ? { ...x, role_membre: x.role_membre === "responsable" ? "collaborateur" : "responsable" } : x)); toast.push("Rôle mis à jour"); };

  // ---- Chart data ----
  const dailyData = [4,3,5,4,7,6,8,5,4,7,9,6,5,8,10,7,6,9,11,8,7,10,12,9,8,11,10,13,12,14];
  const chartW = 580, chartH = 130, pX = 8, pY = 10;
  const maxVal = Math.max(...dailyData);
  const pts = dailyData.map((v, i) => ({
    x: pX + (i / (dailyData.length - 1)) * (chartW - pX * 2),
    y: pY + (1 - v / maxVal) * (chartH - pY * 2),
    val: v, day: i + 1,
  }));
  function buildPath(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i-1], c = pts[i];
      const cp1x = (p.x + c.x) / 2; const cp2x = cp1x;
      d += ` C ${cp1x.toFixed(1)},${p.y.toFixed(1)} ${cp2x.toFixed(1)},${c.y.toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`;
    }
    return d;
  }
  const linePath = buildPath(pts);
  const areaPath = linePath + ` L ${(chartW - pX).toFixed(1)},${chartH} L ${pX},${chartH} Z`;

  // ---- Event donut data ----
  const eventData = [
    { label: "Salon Immobilier", color: "#b8843e", value: 58, pct: 41 },
    { label: "Réseau MEDEF",     color: "#c9a050", value: 47, pct: 33 },
    { label: "Portes ouvertes",  color: "#d4b878", value: 23, pct: 16 },
    { label: "Sans étiquette",   color: "#ddd0ad", value: 14, pct: 10 },
  ];
  const totalEv = eventData.reduce((s,e) => s + e.value, 0);
  const r = 52, dcx = 80, dcy = 80, circ = 2 * Math.PI * r;
  const donutSegs = eventData.map((e, i) => {
    const cumFrac = eventData.slice(0, i).reduce((s, x) => s + x.value, 0) / totalEv;
    const frac = e.value / totalEv;
    return { ...e, dashLen: frac * circ, cumOffset: -(cumFrac * circ), frac };
  });

  // ---- Weekly bars data ----
  const weekTotals = [28, 35, 38, 41];

  // ---- KPI sparkline paths (tiny inline charts) ----
  const kpiSparkData = [
    [88,92,100,108,112,118,142],
    [142,148,155,168,172,185,198],
    [68,71,70,73,72,74,74],
    [3,3,3,3,3,3,3],
  ];
  function sparkPath(vals, w, h) {
    const mx = Math.max(...vals), mn = Math.min(...vals);
    const range = mx - mn || 1;
    const spts = vals.map((v, i) => ({
      x: (i / (vals.length - 1)) * w,
      y: h - ((v - mn) / range) * (h - 4) - 2,
    }));
    return buildPath(spts);
  }

  const FADE = (i, extra = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 520ms ease ${i * 80 + extra}ms, transform 520ms ease ${i * 80 + extra}ms`,
  });

  return (
    <div className="col gap-6">
      {/* Header */}
      <div className="col gap-2">
        <div className="eyebrow">Dashboard · Avril 2026</div>
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
          <FilterSelect value={fMembre} onChange={setFMembre}
            options={[{ value: "all", label: "Tous les membres" }, ...active.map(c => ({ value: c.id, label: `${c.prenom} ${c.nom}` }))]} />
          <FilterSelect value={fEvent} onChange={setFEvent}
            options={[
              { value: "all", label: "Tous les événements" },
              { value: "Salon Immobilier 2026", label: "Salon Immobilier 2026" },
              { value: "Réseau MEDEF", label: "Réseau MEDEF" },
              { value: "Portes ouvertes", label: "Portes ouvertes" },
              { value: "Sans étiquette", label: "Sans étiquette" },
            ]}
          />
          <button className="btn btn-primary btn-sm">Filtrer</button>
        </div>
      </div>

      {/* ═══════ KPI CARDS ═══════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
        {[
          { label: "Leads ce mois",        target: 142, suffix: "",  delta: "+20.3%", good: true,  sp: 0 },
          { label: "Total scans",           target: 198, suffix: "",  delta: "+15.1%", good: true,  sp: 1 },
          { label: "Taux de conversion",    target: 74,  suffix: "%", delta: "+3 pts",  good: true,  sp: 2 },
          { label: "Membres actifs",        target: active.length, suffix: `/${collabs.length}`, delta: pending.length > 0 ? `${pending.length} en attente` : "Équipe au complet", good: pending.length === 0, sp: 3 },
        ].map((kpi, i) => (
          <div key={i} className="card col gap-0" style={{ padding: 20, overflow: "hidden", position: "relative", ...FADE(i) }}>
            {/* Sparkline bg */}
            <svg viewBox={`0 0 90 32`} style={{ position: "absolute", right: 0, bottom: 0, width: 90, height: 32, opacity: 0.18, pointerEvents: "none" }}>
              <path d={sparkPath(kpiSparkData[kpi.sp], 90, 32)} fill="none" stroke="#b8843e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>{kpi.label}</div>
            <div className="serif" style={{ fontSize: 38, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8 }}>
              <AnimCounter target={kpi.target} mounted={mounted} duration={1000 + i * 130} suffix={kpi.suffix} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: kpi.good ? "var(--good,#2d7a4f)" : "var(--ink-3)", fontWeight: 500 }}>
              {kpi.good && <span>↑</span>}{kpi.delta}
            </div>
          </div>
        ))}
      </div>

      {/* ═══════ AREA CHART – Leads par jour ═══════ */}
      <div className="card" style={{ padding: 24, ...FADE(0, 280) }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="serif" style={{ fontSize: 17, marginBottom: 3 }}>Évolution des leads</div>
            <div className="dim" style={{ fontSize: 12 }}>Avril 2026 · 30 jours · tendance haussière</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="serif" style={{ fontSize: 28, letterSpacing: "-0.02em", lineHeight: 1 }}>142</div>
            <div style={{ fontSize: 12, color: "var(--good,#2d7a4f)", fontWeight: 500 }}>↑ +24 vs mars 2026</div>
          </div>
        </div>

        <div style={{
          position: "relative",
          clipPath: mounted ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 1300ms cubic-bezier(0.25,0.1,0.25,1) 350ms",
        }}>
          <svg viewBox={`0 0 ${chartW} ${chartH + 18}`} style={{ width: "100%", height: 155, display: "block", overflow: "visible" }}
            onMouseLeave={() => setHoveredDay(null)}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8843e" stopOpacity="0.22"/>
                <stop offset="85%" stopColor="#b8843e" stopOpacity="0.02"/>
              </linearGradient>
            </defs>
            {/* Y-axis grid */}
            {[0, 0.33, 0.66, 1].map((f, gi) => {
              const gy = pY + (1 - f) * (chartH - pY * 2);
              return <line key={gi} x1={pX} y1={gy} x2={chartW - pX} y2={gy} stroke="var(--line)" strokeWidth="1" opacity="0.7" strokeDasharray="3 5"/>;
            })}
            {/* Area */}
            <path d={areaPath} fill="url(#areaGrad)"/>
            {/* Line */}
            <path d={linePath} fill="none" stroke="#b8843e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Hover zones + dots */}
            {pts.map((p, i) => (
              <g key={i}>
                <rect x={p.x - 10} y={0} width={20} height={chartH + 18} fill="transparent" style={{ cursor: "crosshair" }}
                  onMouseEnter={() => setHoveredDay(i)}/>
                {hoveredDay === i && (
                  <g>
                    <line x1={p.x} y1={pY - 2} x2={p.x} y2={chartH - pY + 2}
                      stroke="#b8843e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
                    <circle cx={p.x} cy={p.y} r={5} fill="white" stroke="#b8843e" strokeWidth="2.5"/>
                    <circle cx={p.x} cy={p.y} r={2.5} fill="#b8843e"/>
                    <rect x={Math.max(4, Math.min(p.x - 28, chartW - 62))} y={p.y - 34} width={56} height={26} rx={7} fill="#1a1815" opacity="0.88"/>
                    <text x={Math.max(4, Math.min(p.x - 28, chartW - 62)) + 28} y={p.y - 17}
                      textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif">
                      {p.val} leads
                    </text>
                    <text x={Math.max(4, Math.min(p.x - 28, chartW - 62)) + 28} y={p.y - 4}
                      textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9.5" fontFamily="system-ui,sans-serif">
                      {p.day} avr
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* X labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingLeft: pX, paddingRight: pX, opacity: mounted ? 1 : 0, transition: "opacity 600ms ease 1400ms" }}>
          {["1 avr","7 avr","14 avr","21 avr","28 avr","30 avr"].map((l,i) => (
            <div key={i} className="dim" style={{ fontSize: 10.5 }}>{l}</div>
          ))}
        </div>
      </div>

      {/* ═══════ ROW: Bar chart + Donut chart ═══════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 16 }}>

        {/* ── Performance membres (horizontal bars + weekly mini bars) ── */}
        <div className="card" style={{ padding: 24, ...FADE(0, 500) }}>
          <div className="serif" style={{ fontSize: 17, marginBottom: 3 }}>Performance membres</div>
          <div className="dim" style={{ fontSize: 12, marginBottom: 22 }}>Leads générés ce mois · classement</div>

          <div className="col gap-5">
            {active.map((c, i) => {
              const pct = (c.leads / (active[0]?.leads || 1)) * 100;
              const barColors = [
                "linear-gradient(90deg,#b8843e,#d4a855)",
                "linear-gradient(90deg,#c9a050,#dbb86a)",
                "linear-gradient(90deg,#d4b878,#e4cb96)",
              ];
              return (
                <div key={c.id}>
                  <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                    <div className="row gap-3" style={{ alignItems: "center" }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                        background: i === 0 ? "linear-gradient(135deg,#b8843e,#d4a855)" : "var(--surface-3)",
                        color: i === 0 ? "white" : "var(--ink-3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700,
                      }}>
                        {i === 0 ? <Icon.Crown size={13}/> : `#${i+1}`}
                      </div>
                      <div className="col" style={{ gap: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{c.prenom} {c.nom}</div>
                        <div className="dim" style={{ fontSize: 11 }}>{c.poste}</div>
                      </div>
                    </div>
                    <div className="row gap-2" style={{ alignItems: "baseline" }}>
                      <span className="serif" style={{ fontSize: 24, letterSpacing: "-0.02em" }}>{c.leads}</span>
                      <span className="dim" style={{ fontSize: 11 }}>leads</span>
                    </div>
                  </div>
                  <div style={{ height: 9, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: mounted ? `${pct}%` : "0%",
                      background: barColors[i] || barColors[2],
                      borderRadius: 999,
                      transition: `width 950ms cubic-bezier(0.34,1.56,0.64,1) ${620 + i * 130}ms`,
                    }}/>
                  </div>
                  <div className="row" style={{ justifyContent: "flex-end", marginTop: 3 }}>
                    <span className="dim" style={{ fontSize: 10 }}>{Math.round(pct)}% du score max</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly progression mini bars */}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
              <div className="dim" style={{ fontSize: 11 }}>Progression hebdomadaire</div>
              <div style={{ fontSize: 11, color: "var(--good,#2d7a4f)", fontWeight: 500 }}>↑ +47% sur 4 sem.</div>
            </div>
            <div className="row gap-3">
              {weekTotals.map((wv, wi) => (
                <div key={wi} className="col" style={{ flex: 1, alignItems: "center", gap: 5 }}>
                  <div style={{ width: "100%", height: 52, background: "var(--surface-2)", borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
                    <div style={{
                      width: "100%",
                      height: mounted ? `${(wv / 41) * 100}%` : "0%",
                      background: wi === 3 ? "linear-gradient(0deg,#b8843e,#d4a855)" : wi === 2 ? "var(--surface-3)" : "var(--surface-3)",
                      transition: `height 750ms cubic-bezier(0.34,1.56,0.64,1) ${900 + wi * 90}ms`,
                      borderRadius: "6px 6px 0 0",
                    }}/>
                  </div>
                  <span className="dim" style={{ fontSize: 10 }}>S{wi+1}</span>
                  <span style={{ fontSize: 12, fontWeight: wi === 3 ? 700 : 400, color: wi === 3 ? "var(--ink)" : "var(--ink-3)" }}>{wv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Donut chart: répartition événements ── */}
        <div className="card" style={{ padding: 24, ...FADE(0, 650) }}>
          <div className="serif" style={{ fontSize: 17, marginBottom: 3 }}>Répartition événements</div>
          <div className="dim" style={{ fontSize: 12, marginBottom: 22 }}>142 leads · Avril 2026</div>

          {/* Donut + legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg viewBox="0 0 160 160" style={{ width: 130, height: 130, transform: "rotate(-90deg)" }}>
                {/* Background ring */}
                <circle cx={dcx} cy={dcy} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={20}/>
                {/* Segments */}
                {donutSegs.map((seg, i) => (
                  <circle key={i}
                    cx={dcx} cy={dcy} r={r}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={20}
                    strokeLinecap="butt"
                    strokeDasharray={`${mounted ? seg.dashLen : 0} ${circ}`}
                    strokeDashoffset={seg.cumOffset}
                    style={{ transition: `stroke-dasharray 900ms cubic-bezier(0.34,1.56,0.64,1) ${750 + i * 110}ms` }}
                  />
                ))}
              </svg>
              {/* Center label */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>142</div>
                <div className="dim" style={{ fontSize: 10 }}>leads</div>
              </div>
            </div>

            {/* Legend */}
            <div className="col gap-3" style={{ flex: 1 }}>
              {eventData.map((e, i) => (
                <div key={i} className="row" style={{ alignItems: "center", gap: 8 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 3, background: e.color, flexShrink: 0 }}/>
                  <div className="col" style={{ flex: 1, gap: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.label}</div>
                    <div className="dim" style={{ fontSize: 11 }}>{e.value} · {e.pct}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini event progress bars */}
          <div className="col gap-2" style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            {eventData.map((e, i) => (
              <div key={i} className="row" style={{ alignItems: "center", gap: 9 }}>
                <div style={{ width: 60, fontSize: 11, color: "var(--ink-3)", textAlign: "right", flexShrink: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {e.label.split(" ")[0]}
                </div>
                <div style={{ flex: 1, height: 6, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: mounted ? `${e.pct}%` : "0%",
                    background: e.color,
                    borderRadius: 999,
                    transition: `width 850ms ease ${850 + i * 100}ms`,
                  }}/>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, width: 28, textAlign: "right" }}>{e.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ PENDING REQUESTS ═══════ */}
      {canManage && pending.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
            <div className="serif" style={{ fontSize: 18 }}>Demandes membres</div>
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
                  <button className="btn btn-sm" onClick={() => refuse(c.id)}><Icon.X size={13}/> Refuser</button>
                  <button className="btn btn-primary btn-sm" onClick={() => accept(c.id)}><Icon.Check size={13}/> Accepter</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ MEMBERS TABLE ═══════ */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="row" style={{ justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
          <div className="serif" style={{ fontSize: 18 }}>Équipe</div>
          <span className="dim" style={{ fontSize: 12 }}>{tableMembers.length} membres</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Membre","Poste","Rôle","Leads","Actions canal","Dernier clic", canManage ? "Actions" : ""].filter(Boolean).map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontWeight: 500, color: "var(--ink-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableMembers.map(c => {
                const isResp = c.role_membre === "responsable";
                return (
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
                      <span className={`pill ${isResp ? "pill-good" : "pill-mute"}`}>
                        {isResp ? <Icon.Crown size={11}/> : <Icon.User size={11}/>}
                        {isResp ? "Responsable" : "Collaborateur"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span className="serif" style={{ fontSize: 20 }}>{c.leads}</span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <button type="button" onClick={() => setStatsCollab(c)} title="Détail par canal"
                        style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink)", borderBottom: "1px dashed var(--ink-4)" }}>
                        <span className="serif" style={{ fontSize: 20 }}>{Math.round(c.leads * 1.4)}</span>
                        <Icon.ChevronRight size={12}/>
                      </button>
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--ink-3)", fontSize: 12 }}>{c.last_click}</td>
                    {canManage && (
                      <td style={{ padding: "14px 20px" }}>
                        {c.statut === "actif" && (
                          <div className="row gap-1">
                            <button className="btn btn-ghost btn-sm" onClick={() => toggleRole(c.id)}
                              title={isResp ? "Rétrograder" : "Promouvoir responsable"}>
                              {isResp ? <Icon.User size={13}/> : <Icon.Crown size={13}/>}
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => remove(c.id)} title="Retirer l'accès">
                              <Icon.Trash size={13}/>
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
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

// ---------- Mon compte ----------
function SecretCodePage({ role, plan, onUpgrade }) {
  const [code, setCode] = useStateD(window.CARTALIS_DATA.entreprise.code_secret);
  const [showRegenConfirm, setShowRegenConfirm] = useStateD(false);
  // manageModal steps: null | "choice" | "cancel-confirm" | "cancel-reason" | "cancel-done"
  const [manageStep, setManageStep] = useStateD(null);
  const [cancelReason, setCancelReason] = useStateD(null);
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
              <button className="btn btn-primary btn-sm" onClick={() => toast.push("Informations mises à jour")}><Icon.Check size={13} /> Enregistrer</button>
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
  const INIT = [
    { from: "cardly", text: "👋 Bonjour " + me.prenom + " ! Une idée pour améliorer Cartalis ? Une fonctionnalité manquante, un bug, ou juste un avis ? Partagez ici — on lit tout." },
  ];
  const [messages, setMessages] = useStateD(INIT);
  const [input, setInput] = useStateD("");
  const [sent, setSent] = useStateD(false);
  const bottomRef = React.useRef(null);

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    setMessages(m => [...m, { from: "user", text: txt }]);
    setInput("");
    setSent(true);
    setTimeout(() => {
      setMessages(m => [...m, { from: "cardly", text: "Merci pour votre retour ! 🙏 On prend bonne note et on revient vers vous si nécessaire." }]);
    }, 800);
  };

  React.useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      {/* Hero bg like auth */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div className="hero-bg" />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520 }}>
        {/* Header text */}
        <div className="col gap-2" style={{ alignItems: "center", textAlign: "center", marginBottom: 32 }}>
          <div className="chip" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            <Icon.Sparkle size={12} /> Vos idées · Cartalis
          </div>
          <h1 className="serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Aidez-nous à<br/>construire mieux.
          </h1>
          <p className="muted" style={{ fontSize: 15, margin: 0 }}>
            Une fonctionnalité manquante, un bug, une suggestion — tout compte.
          </p>
        </div>

        {/* Chat card */}
        <div
          className="card"
          style={{
            borderRadius: 22,
            overflow: "hidden",
            padding: 0,
            background: "linear-gradient(135deg, #fdfbf3 0%, #f5edd9 100%)",
            position: "relative",
            boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
          }}
        >
          {/* Subtle bg image like auth */}
          <img src="assets/card-back.png" alt="" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.12, pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            {/* Card header */}
            <div className="row gap-3" style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.07)", alignItems: "center" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--gold-2), var(--gold))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0,
              }}>C</div>
              <div className="col" style={{ lineHeight: 1.3 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Cartalis</div>
                <div className="dim" style={{ fontSize: 12 }}>Équipe produit · répond sous 48h</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--good, #2d7a4f)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--good, #2d7a4f)", display: "inline-block" }} />
                En ligne
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12, minHeight: 200, maxHeight: 340, overflowY: "auto" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                  {m.from === "cardly" && (
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, var(--gold-2), var(--gold))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "white",
                    }}>C</div>
                  )}
                  <div style={{
                    maxWidth: "78%", padding: "10px 14px",
                    borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: m.from === "user" ? "var(--ink)" : "white",
                    color: m.from === "user" ? "white" : "var(--ink)",
                    fontSize: 13.5, lineHeight: 1.55,
                    boxShadow: m.from === "cardly" ? "0 1px 6px rgba(0,0,0,0.07)" : "none",
                  }}>{m.text}</div>
                  {m.from === "user" && (
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "var(--surface-3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 600, color: "var(--ink)",
                    }}>{me.prenom[0]}{me.nom[0]}</div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}>
              <input
                className="input"
                style={{ flex: 1, fontSize: 13.5, borderRadius: 22, padding: "10px 16px", background: "white", border: "1px solid var(--line)" }}
                placeholder={sent ? "Envoyer un autre message…" : "Tapez votre idée ou suggestion…"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              />
              <button
                className="btn btn-primary"
                style={{ borderRadius: "50%", width: 40, height: 40, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                onClick={send}
                disabled={!input.trim()}
              >
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
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
function PublicCardPage({ navigate, params }) {
  const cardId = params.get("id") || "card-001";
  const inactive = params.get("inactive") === "1";
  const card = window.CARTALIS_DATA.cards.find(c => c.id === cardId) || window.CARTALIS_DATA.cards[0];
  const me = window.CARTALIS_DATA.profileMe;
  const ent = window.CARTALIS_DATA.entreprise;
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

        <div onClick={() => setFlipped(f => !f)} style={{ cursor: "pointer", display: "inline-block" }}>
          <Card3D card={card} width={Math.min(380, window.innerWidth - 60)} float={true} flipped={flipped} />
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
            <button disabled={inactive} className="btn btn-sm" style={{ flex: 1, minWidth: 140, justifyContent: "center" }} onClick={() => setCrmModalOpen(true)}>
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
          Propulsé par <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ color: "var(--ink)", textDecoration: "underline" }}>Cartalis</a> · La carte de visite qui ne finit pas dans une poche.
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
