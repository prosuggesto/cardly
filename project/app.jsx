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

  const [tab, setTabRaw] = useStateApp("cards");
  const [customizeId, setCustomizeId] = useStateApp(null);
  const setTab = (t) => { setTabRaw(t); if (t !== "customize") setCustomizeId(null); };
  const [tweaksOpen, setTweaksOpen] = useStateApp(false);

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

  // Page selection
  let page = null;
  if (path === "/" || path === "") {
    page = <LandingPage navigate={navigate} />;
  } else if (path === "/auth") {
    page = <AuthPage navigate={navigate} params={params} />;
  } else if (path === "/card") {
    page = <PublicCardPage navigate={navigate} params={params} />;
  } else if (path === "/app") {
    page = (
      <AppLayout
        navigate={navigate}
        tab={tab} setTab={setTab}
        role={tweaks.role} plan={tweaks.plan}
        trialExpired={tweaks.trialExpired}
        onLogout={() => navigate("/")}
        onUpgrade={() => setTab("subscription")}
      >
        {tab === "cards" && <MyCardsPage
          onCustomize={(id) => { setTabRaw("customize"); setCustomizeId(id); }}
          onShareCard={(id) => navigate(`/card?id=${id}`)}
          role={tweaks.role}
          trialExpired={tweaks.trialExpired}
          onUpgrade={() => setTab("subscription")}
        />}
        {tab === "customize" && (
          customizeId
            ? <CustomizationPage
                cardId={customizeId}
                role={tweaks.role}
                plan={tweaks.plan}
                trialExpired={tweaks.trialExpired}
                onUpgrade={() => setTab("subscription")}
                onBack={() => setCustomizeId(null)}
              />
            : <CustomizePickerPage
                onPick={(id) => setCustomizeId(id)}
                role={tweaks.role}
                trialExpired={tweaks.trialExpired}
                onUpgrade={() => setTab("subscription")}
              />
        )}
        {tab === "dashboard" && <DashboardPage role={tweaks.role} trialExpired={tweaks.trialExpired} onUpgrade={() => setTab("subscription")} />}
        {tab === "secret" && <SecretCodePage role={tweaks.role} />}
        {tab === "subscription" && <SubscriptionPage plan={tweaks.plan} onSetPlan={(p) => setTweak("plan", p)} />}
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {["admin", "collaborator"].map(r => (
              <button key={r} onClick={() => setTweak("role", r)} className="btn btn-sm" style={{
                background: tweaks.role === r ? "var(--ink)" : "var(--surface-2)",
                color: tweaks.role === r ? "white" : "var(--ink)",
                border: "1px solid var(--line)",
                justifyContent: "center", height: 32, fontSize: 12,
              }}>{r === "admin" ? "Admin" : "Collab."}</button>
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
