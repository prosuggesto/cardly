/* Cardly Pro — App entry: routing, session, auth guard */

const { useState: useStateApp, useEffect: useEffectApp } = React;

function parseHash(hash) {
  const [path, query = ""] = hash.split("?");
  const params = new URLSearchParams(query);
  return { path: path || "/", params };
}

// ---------- Pending membership screen ----------
function PendingScreen({ entrepriseName, onLogout }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 32 }}>
      <div className="hero-bg" />
      <Logo size="lg" />
      <div className="card" style={{ padding: 40, maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div className="logo-mark" style={{ width: 52, height: 52, fontSize: 22, margin: "0 auto 18px", background: "var(--surface-3)" }}>⏳</div>
        <h2 className="serif" style={{ fontSize: 28, margin: "0 0 10px", letterSpacing: "-0.01em" }}>En attente de validation</h2>
        <p className="muted" style={{ margin: "0 0 20px", fontSize: 15 }}>
          Votre demande pour rejoindre <strong>{entrepriseName || "l'entreprise"}</strong> est en attente.
          Un administrateur doit valider votre accès.
        </p>
        <div className="card" style={{ padding: 14, background: "#fff8eb", borderColor: "#f0d99c", marginBottom: 20, fontSize: 13, color: "#7a5c0a" }}>
          Vous recevrez un email dès que votre compte sera activé.
        </div>
        <button className="btn btn-ghost" onClick={onLogout}><Icon.Logout size={14} /> Se déconnecter</button>
      </div>
    </div>
  );
}

// ---------- No membership screen ----------
function NoMembershipScreen({ onLogout }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 32 }}>
      <div className="hero-bg" />
      <Logo size="lg" />
      <div className="card" style={{ padding: 40, maxWidth: 480, width: "100%", textAlign: "center" }}>
        <h2 className="serif" style={{ fontSize: 28, margin: "0 0 10px", letterSpacing: "-0.01em" }}>Aucune entreprise associée</h2>
        <p className="muted" style={{ margin: "0 0 20px", fontSize: 15 }}>
          Votre compte n'est lié à aucune entreprise. Créez-en une ou rejoignez-en une via le code secret.
        </p>
        <div className="row gap-2" style={{ justifyContent: "center" }}>
          <button className="btn btn-primary btn-sm" onClick={() => { window.location.hash = "/auth?mode=signup"; }}>Créer mon entreprise</button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}><Icon.Logout size={14} /> Se déconnecter</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Full-page loading ----------
function AppLoading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexDirection: "column" }}>
      <Spinner size={44} />
      <div className="dim" style={{ fontSize: 14 }}>Chargement…</div>
    </div>
  );
}

// ---------- Main App ----------
function App() {
  const [hash, navigate] = useHashRoute();
  const { path, params } = parseHash(hash);
  const { session, profile, membership, pendingMembership, loading, role, plan, entreprise } = useCardlySession();

  // Tweaks (dev panel — navigation shortcuts + trial toggle)
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ "trialExpired": false }/*EDITMODE-END*/;
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

  const handleLogout = async () => {
    await window.CardlyAPI.signOut();
    navigate("/");
  };

  // Public pages — never need auth
  const isPublicPath = path === "/" || path === "" || path === "/auth" || path === "/card";
  const needsRedirect = !isPublicPath && !loading && !session;

  // Redirect unauthenticated users away from /app
  useEffectApp(() => {
    if (needsRedirect) navigate("/auth?mode=login");
  }, [needsRedirect]);

  // Show loading spinner only on /app while session resolves
  if (loading && !isPublicPath) return <ToastProvider><AppLoading /></ToastProvider>;

  // Auth redirect in progress
  if (needsRedirect) return <ToastProvider><AppLoading /></ToastProvider>;

  // Pending membership (collab waiting for admin approval)
  if (path === "/app" && session && !membership && pendingMembership) {
    return (
      <ToastProvider>
        <PendingScreen entrepriseName={pendingMembership.entreprises?.nom_entreprise} onLogout={handleLogout} />
      </ToastProvider>
    );
  }

  // Session but no membership at all (edge case: entreprise creation failed?)
  if (path === "/app" && session && !membership && !pendingMembership && !loading) {
    return (
      <ToastProvider>
        <NoMembershipScreen onLogout={handleLogout} />
      </ToastProvider>
    );
  }

  // Page routing
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
        role={role} plan={plan}
        trialExpired={tweaks.trialExpired}
        onLogout={handleLogout}
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
              />
            : <CustomizePickerPage
                onPick={(id) => setCustomizeId(id)}
                role={role}
                trialExpired={tweaks.trialExpired}
                onUpgrade={() => setTab("subscription")}
              />
        )}
        {tab === "dashboard" && <DashboardPage role={role} trialExpired={tweaks.trialExpired} onUpgrade={() => setTab("subscription")} />}
        {tab === "secret" && <SecretCodePage role={role} />}
        {tab === "subscription" && <SubscriptionPage plan={plan} onSetPlan={() => {}} />}
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
      width: 260, padding: 18,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      boxShadow: "var(--shadow-3)",
    }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <div className="serif" style={{ fontSize: 17 }}>Tweaks</div>
        <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: 4 }}><Icon.X size={14} /></button>
      </div>
      <div className="col gap-3">
        <button onClick={() => setTweak("trialExpired", !tweaks.trialExpired)} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 0", fontSize: 13,
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
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Root render — wrap entire app in CardlySessionProvider ----------
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CardlySessionProvider>
    <App />
  </CardlySessionProvider>
);
