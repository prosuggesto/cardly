/* Cardly Pro — App entry: routing, plan/role/trial state, tweaks */

const { useState: useStateApp, useEffect: useEffectApp } = React;

function parseHash(hash) {
  // hash: "/path?key=val&..."
  const [path, query = ""] = hash.split("?");
  const params = new URLSearchParams(query);
  return { path: path || "/", params };
}

function App() {
  const [hash, navigate] = useHashRoute();
  const { path, params } = parseHash(hash);

  // Tweaks state
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "role": "admin",
    "plan": "team",
    "trialExpired": false
  }/*EDITMODE-END*/;
  const [tweaks, setTweaks] = useStateApp(TWEAK_DEFAULTS);
  const setTweak = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };

  // Rôle et plan réels depuis les données DB (renseignés par LoginForm), sinon tweaks démo
  const role = (path === '/app' && window.CARTALIS_DATA?.profileMe?.role) || tweaks.role;
  const plan = (path === '/app' && window.CARTALIS_DATA?.entreprise?.plan) || tweaks.plan;

  const [tab, setTabRaw] = useStateApp("cards");
  const [customizeId, setCustomizeId] = useStateApp(null);
  const [scanCardId, setScanCardId] = useStateApp(null);
  const setTab = (t) => { setTabRaw(t); if (t !== "customize") setCustomizeId(null); };
  const [tweaksOpen, setTweaksOpen] = useStateApp(false);
  // sessionReady : true une fois que CARTALIS_DATA est hydraté depuis Supabase
  const [sessionReady, setSessionReady] = useStateApp(false);

  useEffectApp(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Garde de session + restauration CARTALIS_DATA après refresh
  useEffectApp(() => {
    if (path !== '/app' || !window.sb || !window.CardlyAPI) return;
    setSessionReady(false);

    (async () => {
      try {
        const { data: { session } } = await window.sb.auth.getSession();
        if (!session) { navigate('/auth?mode=login'); return; }

        const userId = session.user.id;

        // Si les données sont déjà celles du bon user (ex : juste après login), on n'recharge pas
        if (window.CARTALIS_DATA.profileMe.id === userId) { setSessionReady(true); return; }

        // --- Restauration complète depuis Supabase ---
        const { data: profile } = await window.CardlyAPI.getProfile(userId);

        const { data: membership } = await window.CardlyAPI.getMyMembership(userId);
        const entrepriseId = membership?.entreprise_id;

        let entrepriseData = membership?.entreprises || null;
        if (!entrepriseData && entrepriseId) {
          const { data: entFallback } = await window.sb
            .from('entreprises').select('id, nom_entreprise, code_secret, plan, website')
            .eq('id', entrepriseId).single();
          entrepriseData = entFallback;
        }

        // Profil
        Object.assign(window.CARTALIS_DATA.profileMe, {
          id: userId,
          nom:       profile?.nom       || '',
          prenom:    profile?.prenom    || '',
          email:     profile?.email     || '',
          telephone: profile?.telephone || '',
          poste:     profile?.poste     || '',
          site_web:  profile?.site_web  || '',
          instagram: profile?.instagram || '',
          linkedin:  profile?.linkedin  || '',
        });

        // Rôle
        if (membership) {
          const isAdmin = membership.role === 'owner' || membership.role === 'admin';
          window.CARTALIS_DATA.profileMe.role = isAdmin ? 'admin' : 'collaborator';
        }

        // Entreprise
        if (entrepriseData && entrepriseId) {
          Object.assign(window.CARTALIS_DATA.entreprise, {
            id:             entrepriseId,
            nom_entreprise: entrepriseData.nom_entreprise,
            code_secret:    entrepriseData.code_secret,
            plan:           entrepriseData.plan || 'free',
            website:        entrepriseData.website || '',
          });
        }

        // Cartes
        if (entrepriseId) {
          const { data: cartesDB } = await window.CardlyAPI.getMyCartes(userId, entrepriseId);
          window.CARTALIS_DATA.cards = (cartesDB || []).map(c =>
            window.CardlyAPI.mapCarteFromDB(c, profile, entrepriseData)
          );
        }
      } catch (err) {
        console.error('[Cartalis] Session restore failed:', err);
      } finally {
        setSessionReady(true);
      }
    })();
  }, [path]);

  // Page selection
  let page = null;
  if (path === "/" || path === "") {
    page = <LandingPage navigate={navigate} />;
  } else if (path === "/auth") {
    page = <AuthPage navigate={navigate} params={params} />;
  } else if (path === "/card") {
    page = <PublicCardPage navigate={navigate} params={params} />;
  } else if (path === "/app") {
    if (!sessionReady) {
      page = (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--bg)", flexDirection: "column", gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "linear-gradient(135deg, var(--gold-2), var(--gold))",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 20, fontWeight: 700,
          }}>C</div>
          <div className="dim" style={{ fontSize: 14 }}>Chargement de votre espace…</div>
        </div>
      );
    } else page = (
      <AppLayout
        navigate={navigate}
        tab={tab} setTab={setTab}
        role={role} plan={plan}
        trialExpired={tweaks.trialExpired}
        onLogout={async () => { if (window.CardlyAPI) await window.CardlyAPI.signOut(); navigate("/"); }}
        onUpgrade={() => setTab("subscription")}
      >
        {tab === "cards" && <MyCardsPage
          onCustomize={(id) => { setTabRaw("customize"); setCustomizeId(id); }}
          onShareCard={(id) => navigate(`/card?id=${id}`)}
          role={role}
          trialExpired={tweaks.trialExpired}
          onUpgrade={() => setTab("subscription")}
        />}
        {tab === "customize" && (
          customizeId
            ? <CustomizationPage
                cardId={customizeId}
                role={role}
                plan={plan}
                trialExpired={tweaks.trialExpired}
                onUpgrade={() => setTab("subscription")}
                onBack={() => setCustomizeId(null)}
                onValidate={(id) => { setScanCardId(id); setTabRaw("scan"); setCustomizeId(null); }}
              />
            : <CustomizePickerPage
                onPick={(id) => setCustomizeId(id)}
                role={role}
                trialExpired={tweaks.trialExpired}
                onUpgrade={() => setTab("subscription")}
              />
        )}
        {tab === "scan" && <ScanCustomizationPage
          cardId={scanCardId}
          role={role}
          plan={plan}
          trialExpired={tweaks.trialExpired}
          onUpgrade={() => setTab("subscription")}
          onBack={() => { setTabRaw("customize"); setCustomizeId(scanCardId); }}
          onFinish={() => { setTabRaw("cards"); setScanCardId(null); setCustomizeId(null); }}
        />}
        {tab === "dashboard" && <DashboardPage role={role} trialExpired={tweaks.trialExpired} onUpgrade={() => setTab("subscription")} />}
        {tab === "crm" && <CrmPage role={role} />}
        {tab === "secret" && <SecretCodePage role={role} plan={plan} onUpgrade={() => setTab("subscription")} />}
        {tab === "feedback" && <FeedbackPage />}
        {tab === "nfc" && <NFCSupportPage />}
        {tab === "subscription" && <SubscriptionPage plan={plan} onSetPlan={(p) => setTweak("plan", p)} />}
      </AppLayout>
    );
  } else {
    page = <LandingPage navigate={navigate} />;
  }

  return (
    <ToastProvider>
      {page}
      {tweaksOpen && (
        <TweaksPanel
          tweaks={tweaks}
          setTweak={setTweak}
          onClose={() => { setTweaksOpen(false); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); }}
          navigate={navigate}
          path={path}
        />
      )}
    </ToastProvider>
  );
}

function TweaksPanel({ tweaks, setTweak, onClose, navigate, path }) {
  return (
    <div className="card" style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 999,
      width: 280, padding: 18,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      boxShadow: "var(--shadow-3)",
    }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <div className="serif" style={{ fontSize: 17 }}>Tweaks</div>
        <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: 4 }}><Icon.X size={14} /></button>
      </div>
      <div className="col gap-3">
        <div className="col gap-1">
          <div className="dim" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Rôle</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {["admin", "manager", "collaborator"].map(r => (
              <button key={r} onClick={() => setTweak("role", r)} className="btn btn-sm" style={{
                background: tweaks.role === r ? "var(--ink)" : "var(--surface-2)",
                color: tweaks.role === r ? "white" : "var(--ink)",
                border: "1px solid var(--line)",
                justifyContent: "center", height: 32, fontSize: 11, padding: "0 4px",
              }}>{r === "admin" ? "Chef" : r === "manager" ? "Resp." : "Collab."}</button>
            ))}
          </div>
        </div>
        <div className="col gap-1">
          <div className="dim" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Plan</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {["solo", "team", "enterprise"].map(p => (
              <button key={p} onClick={() => setTweak("plan", p)} className="btn btn-sm" style={{
                background: tweaks.plan === p ? "var(--ink)" : "var(--surface-2)",
                color: tweaks.plan === p ? "white" : "var(--ink)",
                border: "1px solid var(--line)",
                justifyContent: "center", height: 32, fontSize: 12, padding: "0 6px",
                textTransform: "capitalize",
              }}>{p}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setTweak("trialExpired", !tweaks.trialExpired)} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 0", fontSize: 13, borderTop: "1px solid var(--line)",
        }}>
          <span>Essai expiré</span>
          <span className={`toggle ${tweaks.trialExpired ? "on" : ""}`}></span>
        </button>
        <div className="col gap-1" style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
          <div className="dim" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Navigation rapide</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <button className="btn btn-sm" style={{ height: 32, fontSize: 12, justifyContent: "center" }} onClick={() => navigate("/")}>Landing</button>
            <button className="btn btn-sm" style={{ height: 32, fontSize: 12, justifyContent: "center" }} onClick={() => navigate("/auth?mode=signup")}>Inscription</button>
            <button className="btn btn-sm" style={{ height: 32, fontSize: 12, justifyContent: "center" }} onClick={() => navigate("/auth?mode=login")}>Connexion</button>
            <button className="btn btn-sm" style={{ height: 32, fontSize: 12, justifyContent: "center" }} onClick={() => navigate("/app")}>App</button>
            <button className="btn btn-sm" style={{ height: 32, fontSize: 12, justifyContent: "center", gridColumn: "1/3" }} onClick={() => navigate("/card?id=card-001")}>Page publique scan</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
