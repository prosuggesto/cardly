/* Cardly Pro — Auth page (signup/login with flip card) */

const { useState: useStateA, useEffect: useEffectA } = React;

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

        {/* Big card */}
        <div className="scene-3d" style={{ perspective: 2200 }}>
          <div
            className="card-3d"
            style={{
              width: "min(640px, 92vw)",
              height: "min(420px, 60vw)",
              transform: flipped || isLogin ? "rotateY(180deg)" : "rotateY(0)",
              animation: "float-soft 7s ease-in-out infinite",
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
                    onClick={() => setRole("admin")}
                  />
                  <RoleButton
                    icon={<Icon.User size={16} />}
                    title="Je suis collaborateur"
                    desc="Je rejoins une équipe existante."
                    onClick={() => setRole("collaborator")}
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
                {isLogin ? (
                  <LoginForm onSubmit={() => navigate("/app")} />
                ) : role === "admin" ? (
                  <AdminForm onSubmit={(code) => setShowSecretModal(code)} onBack={() => { setFlipped(false); setTimeout(() => setRole(null), 600); }} />
                ) : role === "collaborator" ? (
                  <CollabForm onSubmit={() => setShowPendingModal(true)} onBack={() => { setFlipped(false); setTimeout(() => setRole(null), 600); }} />
                ) : null}
              </div>
            </div>
          </div>
        </div>

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
function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 10, fontSize: 13,
      background: "#f6e2dd", border: "1px solid #e3b5aa", color: "#8b2e20",
    }}>{msg}</div>
  );
}
function InfoBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 10, fontSize: 13,
      background: "#fff8eb", border: "1px solid #f0d99c", color: "#7a5c0a",
    }}>{msg}</div>
  );
}

// ---------- Admin signup form ----------
function AdminForm({ onSubmit, onBack }) {
  const [form, setForm] = useStateA({});
  const [loading, setLoading] = useStateA(false);
  const [error, setError] = useStateA(null);
  const [info, setInfo] = useStateA(null);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      // 1. Sign up
      const { data: authData, error: authErr } = await window.CardlyAPI.signUp(form.email, form.pwd);
      if (authErr) throw authErr;

      // 2. If email confirmation required, session will be null
      if (!authData.session) {
        setInfo("Vérifiez votre email pour confirmer l'inscription, puis reconnectez-vous.");
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      // 3. Create entreprise (trigger will create owner membership)
      const { data: ent, error: entErr } = await window.CardlyAPI.createEntreprise(userId, form.entreprise, form.web);
      if (entErr) throw entErr;

      // 4. Update profile with full data (trigger already created the row)
      await window.CardlyAPI.upsertProfile(userId, {
        nom: form.nom, prenom: form.prenom,
        email: form.email, telephone: form.phone,
        nom_entreprise: form.entreprise,
      });

      onSubmit(ent.code_secret);
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="col gap-3">
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
        <Field label="Téléphone" placeholder="07 67 56 92 24" onChange={set("phone")} />
      </FieldRow>
      <FieldRow>
        <Field label="Nom de l'entreprise" placeholder="Immo Costa" onChange={set("entreprise")} required />
        <Field label="Site web" placeholder="immocosta.fr" onChange={set("web")} />
      </FieldRow>
      <Field label="Mot de passe" type="password" placeholder="••••••••" onChange={set("pwd")} required />
      <ErrorBox msg={error} />
      <InfoBox msg={info} />
      <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 6, justifyContent: "center" }}>
        {loading ? <><Spinner size={16} /> Création en cours…</> : <>Créer mon entreprise <Icon.ArrowRight size={14} /></>}
      </button>
    </form>
  );
}

// ---------- Collaborateur signup form ----------
function CollabForm({ onSubmit, onBack }) {
  const [form, setForm] = useStateA({});
  const [loading, setLoading] = useStateA(false);
  const [error, setError] = useStateA(null);
  const [info, setInfo] = useStateA(null);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      // 1. Sign up
      const { data: authData, error: authErr } = await window.CardlyAPI.signUp(form.email, form.pwd);
      if (authErr) throw authErr;

      if (!authData.session) {
        setInfo("Vérifiez votre email pour confirmer l'inscription, puis reconnectez-vous.");
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      // 2. Find entreprise by code
      const { data: ent, error: entErr } = await window.CardlyAPI.getEntrepriseByCode(form.code);
      if (entErr || !ent) throw new Error("Code secret introuvable. Vérifiez auprès de votre administrateur.");

      // 3. Join entreprise (status = pending)
      const { error: joinErr } = await window.CardlyAPI.joinEntreprise(ent.id, userId);
      if (joinErr) throw joinErr;

      // 4. Update profile
      await window.CardlyAPI.upsertProfile(userId, {
        nom: form.nom, prenom: form.prenom,
        email: form.email, telephone: form.phone,
        poste: form.poste,
        nom_entreprise: ent.nom_entreprise,
      });

      onSubmit();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="col gap-3">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div className="col">
          <div className="serif" style={{ fontSize: 22, letterSpacing: "-0.01em" }}>Rejoindre mon entreprise</div>
          <div className="dim" style={{ fontSize: 12 }}>Demandez le code secret à votre administrateur.</div>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>← Retour</button>
      </div>
      <FieldRow>
        <Field label="Prénom" placeholder="Emma" onChange={set("prenom")} required />
        <Field label="Nom" placeholder="Laurent" onChange={set("nom")} required />
      </FieldRow>
      <FieldRow>
        <Field label="Email" type="email" placeholder="emma@entreprise.fr" onChange={set("email")} required />
        <Field label="Téléphone" placeholder="06 ..." onChange={set("phone")} />
      </FieldRow>
      <FieldRow>
        <Field label="Poste" placeholder="Conseillère commerciale" onChange={set("poste")} required />
        <Field label="Code secret entreprise" placeholder="CARDLY-XXXX" onChange={set("code")} required />
      </FieldRow>
      <Field label="Mot de passe" type="password" placeholder="••••••••" onChange={set("pwd")} required />
      <ErrorBox msg={error} />
      <InfoBox msg={info} />
      <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 6, justifyContent: "center" }}>
        {loading ? <><Spinner size={16} /> Envoi…</> : <>Rejoindre mon entreprise <Icon.ArrowRight size={14} /></>}
      </button>
    </form>
  );
}

// ---------- Login form ----------
function LoginForm({ onSubmit }) {
  const [email, setEmail] = useStateA("contact.cardly@gmail.com");
  const [pwd, setPwd] = useStateA("demo1234");
  const [loading, setLoading] = useStateA(false);
  const [error, setError] = useStateA(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: authErr } = await window.CardlyAPI.signIn(email, pwd);
      if (authErr) throw authErr;
      onSubmit();
    } catch (err) {
      setError(err.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="col gap-3" style={{ maxWidth: 380, margin: "0 auto" }}>
      <div className="col" style={{ marginBottom: 6 }}>
        <div className="serif" style={{ fontSize: 26, letterSpacing: "-0.01em" }}>Se connecter</div>
        <div className="dim" style={{ fontSize: 13 }}>Accédez à votre espace Cardly Pro.</div>
      </div>
      <div className="field">
        <label>Email</label>
        <input className="input" type="email" placeholder="vous@entreprise.fr" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label>Mot de passe</label>
        <input className="input" type="password" placeholder="••••••••" value={pwd} onChange={e => setPwd(e.target.value)} required />
      </div>
      <ErrorBox msg={error} />
      <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 6, justifyContent: "center" }}>
        {loading ? <><Spinner size={16} /> Connexion…</> : <>Se connecter <Icon.ArrowRight size={14} /></>}
      </button>
      <div className="dim" style={{ fontSize: 12, textAlign: "center", marginTop: 4 }}>
        Astuce : utilisez les valeurs pré-remplies pour la démo.
      </div>
    </form>
  );
}

window.AuthPage = AuthPage;
