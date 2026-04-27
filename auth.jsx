/* Cardly Pro — Auth page (signup/login with flip card) */

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

function AuthPage({ navigate, params }) {
  const mode = params.get("mode") || "signup"; // 'signup' | 'login'
  const [role, setRole] = useStateA(null); // null | 'admin' | 'collaborator'
  const [flipped, setFlipped] = useStateA(false);
  const [showSecretModal, setShowSecretModal] = useStateA(null);
  const [showPendingModal, setShowPendingModal] = useStateA(false);
  const isLogin = mode === "login";

  useEffectA(() => {
    if (role) setTimeout(() => setFlipped(true), 100);
  }, [role]);

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <div className="hero-bg" />
      <div className="container row" style={{ height: 80, justifyContent: "space-between" }}>
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }}><Logo size="md" /></a>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(isLogin ? "/auth?mode=signup" : "/auth?mode=login")}>
          {isLogin ? "Créer un compte" : "J'ai déjà un compte"}
        </button>
      </div>

      <div className="container col" style={{ alignItems: "center", paddingTop: 40, paddingBottom: 80, gap: 32 }}>
        <div className="col gap-3" style={{ alignItems: "center", textAlign: "center", maxWidth: 520 }}>
          <div className="chip">
            {isLogin ? "Connexion" : "Inscription"} · Cardly Pro
          </div>
          <h1 className="serif" style={{ fontSize: "clamp(36px, 5vw, 52px)", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            {isLogin ? "Bon retour parmi nous." : "Créer votre espace Cardly Pro"}
          </h1>
          <p className="muted" style={{ fontSize: 16, margin: 0 }}>
            {isLogin
              ? "Connectez-vous pour retrouver vos cartes et vos statistiques."
              : "Choisissez votre rôle. Votre carte se retournera pour révéler le formulaire."}
          </p>
        </div>

        {/* Login: simple form card. Signup: 3D flip card with role chooser. */}
        {isLogin ? (
          <div
            className="card"
            style={{
              width: "min(480px, 92vw)",
              padding: "36px 36px",
              borderRadius: 22,
              background: "linear-gradient(135deg, #fdfbf3 0%, #f5edd9 100%)",
              position: "relative", overflow: "hidden",
              animation: "fade-up 600ms ease both",
            }}
          >
            <img src="assets/card-back.png" alt="" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.25, pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <LoginForm onSubmit={() => navigate("/app")} />
            </div>
          </div>
        ) : (
          <div className="scene-3d" style={{ perspective: 2200 }}>
            <div style={{ animation: "float-soft 7s ease-in-out infinite" }}>
              <div
                className="card-3d"
                style={{
                  width: "min(640px, 92vw)",
                  height: "min(420px, 60vw)",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
                }}
              >
              {/* FRONT — role chooser */}
              <div className="card-face" style={{ borderRadius: 22, background: "linear-gradient(135deg, #fdfbf3 0%, #f5edd9 100%)" }}>
                <img src="assets/card-back.png" alt="" style={{ opacity: 0.5 }} />
                <div className="card-overlay" />
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  justifyContent: "center", alignItems: "center",
                  padding: "0 32px", gap: 24,
                  background: "rgba(253, 251, 243, 0.5)",
                  backdropFilter: "blur(2px)",
                }}>
                  <div className="logo-mark" style={{ width: 44, height: 44, fontSize: 22 }}>C</div>
                  <div className="serif" style={{ fontSize: "clamp(24px, 3vw, 32px)", textAlign: "center", letterSpacing: "-0.01em" }}>
                    Qui rejoint Cardly Pro&nbsp;?
                  </div>
                  <div className="row gap-3" style={{ flexWrap: "wrap", justifyContent: "center" }}>
                    <RoleButton
                      icon={<Icon.Crown size={16} />}
                      title="Je suis chef / admin"
                      desc="Je crée et je dirige une équipe."
                      onClick={() => { setRole("admin"); setFlipped(true); }}
                    />
                    <RoleButton
                      icon={<Icon.User size={16} />}
                      title="Je suis collaborateur"
                      desc="Je rejoins une équipe existante."
                      onClick={() => { setRole("collaborator"); setFlipped(true); }}
                    />
                  </div>
                </div>
                <div className="card-shine" />
              </div>

              {/* BACK — form */}
              <div className="card-face card-face-back" style={{ borderRadius: 22, background: "linear-gradient(135deg, #fdfbf3 0%, #f5edd9 100%)" }}>
                <img src="assets/card-back.png" alt="" style={{ opacity: 0.35 }} />
                <div style={{
                  position: "absolute", inset: 0,
                  padding: "32px 36px",
                  background: "rgba(253, 251, 243, 0.7)",
                  backdropFilter: "blur(2px)",
                  overflow: "auto",
                }}>
                  {role === "admin" ? (
                    <AdminForm onSubmit={(code) => setShowSecretModal(code)} onBack={() => { setFlipped(false); setTimeout(() => setRole(null), 600); }} />
                  ) : role === "collaborator" ? (
                    <CollabForm onSubmit={() => setShowPendingModal(true)} onBack={() => { setFlipped(false); setTimeout(() => setRole(null), 600); }} />
                  ) : null}
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        <div className="dim" style={{ fontSize: 12 }}>
          {isLogin ? (
            <>Pas encore de compte ? <a href="#/auth?mode=signup" onClick={(e) => {e.preventDefault(); navigate("/auth?mode=signup");}} style={{ color: "var(--ink)", textDecoration: "underline" }}>Créer un compte</a></>
          ) : (
            <>En continuant, vous acceptez nos conditions d'utilisation.</>
          )}
        </div>
      </div>

      <Modal open={!!showSecretModal} onClose={() => { setShowSecretModal(null); navigate("/app"); }} title="Bienvenue chez Cardly Pro">
        <p className="muted" style={{ marginTop: 0 }}>
          Voici votre code secret entreprise. Transmettez-le à vos collaborateurs pour qu'ils puissent rejoindre votre espace.
        </p>
        <div style={{
          background: "linear-gradient(135deg, #fffaf0, #f5edd9)",
          border: "1px solid var(--line)", borderRadius: 14,
          padding: 20, textAlign: "center", margin: "16px 0",
        }}>
          <div className="dim" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Code secret</div>
          <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "0.06em" }}>{showSecretModal}</div>
        </div>
        <div className="row gap-3" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-sm" onClick={() => navigator.clipboard?.writeText(showSecretModal)}><Icon.Copy size={13} /> Copier</button>
          <button className="btn btn-primary btn-sm" onClick={() => { setShowSecretModal(null); navigate("/app"); }}>Aller au tableau de bord <Icon.ArrowRight size={13} /></button>
        </div>
      </Modal>

      <Modal open={showPendingModal} onClose={() => navigate("/app")} title="Demande envoyée">
        <p className="muted" style={{ marginTop: 0 }}>
          Votre demande a été envoyée. Un administrateur doit valider votre accès. Vous recevrez un email dès que ce sera fait.
        </p>
        <div className="row gap-3" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/app")}>Voir mon espace <Icon.ArrowRight size={13} /></button>
        </div>
      </Modal>
    </div>
  );
}

function RoleButton({ icon, title, desc, onClick }) {
  return (
    <button onClick={onClick} className="card" style={{
      padding: "16px 20px", textAlign: "left",
      display: "flex", flexDirection: "column", gap: 6,
      width: 240, transition: "all 180ms",
      background: "rgba(255,255,255,0.85)",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "var(--shadow-2)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <div className="row gap-2" style={{ alignItems: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <div className="serif" style={{ fontSize: 17, letterSpacing: "-0.01em" }}>{title}</div>
      </div>
      <div className="dim" style={{ fontSize: 12 }}>{desc}</div>
    </button>
  );
}

function FieldRow({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>;
}
function Field({ label, ...rest }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="input" {...rest} />
    </div>
  );
}

function AdminForm({ onSubmit, onBack }) {
  const [form, setForm] = useStateA({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit("CARDLY-8K4P"); }} className="col gap-3">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div className="col">
          <div className="serif" style={{ fontSize: 22, letterSpacing: "-0.01em" }}>Créer mon entreprise</div>
          <div className="dim" style={{ fontSize: 12 }}>Vous obtiendrez un code secret pour vos collaborateurs.</div>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>← Retour</button>
      </div>
      <FieldRow>
        <Field label="Prénom" placeholder="Lucas" onChange={set("prenom")} required />
        <Field label="Nom" placeholder="Martin" onChange={set("nom")} required />
      </FieldRow>
      <FieldRow>
        <Field label="Email" type="email" placeholder="vous@entreprise.fr" onChange={set("email")} required />
        <Field label="Téléphone" placeholder="07 67 56 92 24" onChange={set("phone")} required />
      </FieldRow>
      <FieldRow>
        <Field label="Nom de l'entreprise" placeholder="Immo Costa" onChange={set("entreprise")} required />
        <Field label="Site web" placeholder="immocosta.fr" onChange={set("web")} />
      </FieldRow>
      <Field label="Mot de passe" type="password" placeholder="••••••••" onChange={set("pwd")} required />
      <button type="submit" className="btn btn-primary" style={{ marginTop: 6, justifyContent: "center" }}>
        Créer mon entreprise <Icon.ArrowRight size={14} />
      </button>
    </form>
  );
}

function CollabForm({ onSubmit, onBack }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="col gap-3">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div className="col">
          <div className="serif" style={{ fontSize: 22, letterSpacing: "-0.01em" }}>Rejoindre mon entreprise</div>
          <div className="dim" style={{ fontSize: 12 }}>Demandez le code secret à votre administrateur.</div>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>← Retour</button>
      </div>
      <FieldRow>
        <Field label="Prénom" placeholder="Emma" required />
        <Field label="Nom" placeholder="Laurent" required />
      </FieldRow>
      <FieldRow>
        <Field label="Email" type="email" placeholder="emma@entreprise.fr" required />
        <Field label="Téléphone" placeholder="06 ..." required />
      </FieldRow>
      <FieldRow>
        <Field label="Poste" placeholder="Conseillère commerciale" required />
        <Field label="Code secret entreprise" placeholder="CARDLY-XXXX" required />
      </FieldRow>
      <Field label="Mot de passe" type="password" placeholder="••••••••" required />
      <button type="submit" className="btn btn-primary" style={{ marginTop: 6, justifyContent: "center" }}>
        Rejoindre mon entreprise <Icon.ArrowRight size={14} />
      </button>
    </form>
  );
}

function LoginForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="col gap-3" style={{ maxWidth: 380, margin: "0 auto" }}>
      <div className="col" style={{ marginBottom: 6 }}>
        <div className="serif" style={{ fontSize: 26, letterSpacing: "-0.01em" }}>Se connecter</div>
        <div className="dim" style={{ fontSize: 13 }}>Accédez à votre espace Cardly Pro.</div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="btn"
        style={{
          justifyContent: "center", height: 44, gap: 10,
          background: "white", border: "1px solid var(--line)", fontWeight: 500,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continuer avec Google
      </button>

      <div className="row gap-3" style={{ alignItems: "center", margin: "4px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <div className="dim" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>ou</div>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <Field label="Email" type="email" placeholder="vous@entreprise.fr" defaultValue="contact.cardly@gmail.com" required />
      <Field label="Mot de passe" type="password" placeholder="••••••••" defaultValue="demo1234" required />
      <button type="submit" className="btn btn-primary" style={{ marginTop: 6, justifyContent: "center" }}>
        Se connecter <Icon.ArrowRight size={14} />
      </button>
      <div className="dim" style={{ fontSize: 12, textAlign: "center", marginTop: 4 }}>
        Astuce : utilisez les valeurs pré-remplies pour la démo.
      </div>
    </form>
  );
}

window.AuthPage = AuthPage;
