/* Cardly Pro — Card3D component & shared UI */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Icons (small, hand-crafted SVG) ----------
const Icon = {
  Phone: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
  Mail: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>,
  Globe: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>,
  WhatsApp: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.6 5.444l-.999 3.648 3.888-.791zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>,
  Instagram: (p) => <img src="./assets/instagram.webp" alt="Instagram" style={{ width: (p.size||38) * 1.22, height: (p.size||38) * 1.22, display: "block", objectFit: "contain", flexShrink: 0 }} />,
  Linkedin: (p) => <img src="./assets/linkedin.png" alt="LinkedIn" style={{ width: p.size||38, height: p.size||38, display: "block", objectFit: "contain", flexShrink: 0 }} />,
  Plus: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  Check: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  X: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Lock: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Sparkle: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z"/></svg>,
  ArrowLeft: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  ArrowRight: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  Copy: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Refresh: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5"/></svg>,
  Menu: (p) => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
  Card: (p) => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  Brush: (p) => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l5 5M3 22l4-1 13-13a2.83 2.83 0 00-4-4L3 17v5z"/></svg>,
  Chart: (p) => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18M7 14l3-3 4 4 6-7"/></svg>,
  Key: (p) => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="4"/><path d="M10.85 12.15L19 4M18 5l3 3M15 8l3 3"/></svg>,
  Crown: (p) => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18l2-12 5 5 4-7 4 7 5-5 2 12z"/><path d="M3 22h18"/></svg>,
  Logout: (p) => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  User: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>,
  Trash: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>,
  Star: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill={p.fill||"none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>,
  ChevronDown: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>,
  ChevronRight: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>,
  Upload: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  QR: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM21 14v7M14 21h3"/></svg>,
  Calendar: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  Database: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>,
  Download: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
};
window.Icon = Icon;

// ---------- WebpImg — <picture> avec source WebP + fallback PNG/JPG ----------
// Le navigateur essaie d'abord le .webp (plus léger). Si le .webp n'existe pas
// encore (404) ou si le navigateur ne supporte pas WebP, il utilise le PNG
// automatiquement — zéro perte de qualité, zéro changement de taille de fichier.
function WebpImg({ src, style, loading = "lazy" }) {
  if (!src) return null;
  // Génère l'URL du .webp jumeau (ex: "assets/design-bambou-front.png" → "…front.webp")
  const webpSrc = src.replace(/\.(png|jpe?g)$/i, '.webp');
  return (
    <picture style={{ position: "absolute", inset: 0, display: "block" }}>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt=""
        style={{
          width: "100%", height: "100%",
          objectFit: "cover", display: "block",
          borderRadius: "inherit",
          ...style,
        }}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
}
window.WebpImg = WebpImg;

// ---------- Logo ----------
function Logo({ size = "md" }) {
  const px = size === "sm" ? 14 : size === "lg" ? 22 : 17;
  return (
    <div className="row gap-2" style={{ alignItems: "center" }}>
      <div className="logo-mark" style={{ width: px*1.6, height: px*1.6, fontSize: px*0.95 }}>C</div>
      <div className="serif" style={{ fontSize: px*1.15, letterSpacing: "-0.01em", lineHeight: 1 }}>
        Cardly <span style={{ color: "var(--gold)", fontStyle: "italic" }}>Pro</span>
      </div>
    </div>
  );
}
window.Logo = Logo;

// ---------- Toast system ----------
const ToastCtx = React.createContext({ push: () => {} });
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, icon: opts.icon }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), opts.duration || 2800);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            {t.icon || <Icon.Check size={14} />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
function useToast() { return React.useContext(ToastCtx); }
window.ToastProvider = ToastProvider;
window.useToast = useToast;

// ---------- Card3D ----------
// Renders a 3D business card with front + back, optional drag-editable text fields,
// optional auto-flip, optional float animation.
function Card3D({
  card,
  design,            // optional design override (object). otherwise looked up via card.design
  width = 380,
  flipped = false,
  onFlip,
  float = false,
  editable = false,
  showQR = false,
  onMove,            // (key, {x,y}) => void
  showFront,         // 'auto' (default), 'front', 'back'
  className = "",
  logoUrl,           // if provided, draggable logo overlay (back face)
  frontImageUrl,     // if provided, full-cover image on the front face
  backImageUrl,      // if provided, full-cover image on the back face
  fieldColors,       // { name, poste, phone, email, web } — per-field text colors
  fieldSides,        // { name, entreprise, poste, phone, email, web } — "recto" | "verso"
  fieldSizes,        // per-field font-size multiplier (default 1)
  fieldFonts,        // per-field font family key
  logoSize = 1,      // [legacy] logo size multiplier — used as fallback if no per-side size
  logoSide = "both", // "recto" | "verso" | "both"
  logoSizeRecto,     // recto-side size multiplier
  logoSizeVerso,     // verso-side size multiplier
}) {
  const FONT_FAMILIES = {
    default: undefined,
    display: "var(--font-display), Georgia, 'Times New Roman', serif",
    serif: "Georgia, 'Times New Roman', serif",
    sans: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    mono: "var(--font-mono), 'Courier New', monospace",
    script: "'Brush Script MT', 'Lucida Handwriting', cursive",
  };
  const D = design || (card && window.CARDLY_DATA.getDesign(card.design)) || window.CARDLY_DATA.cardDesigns[0];
  const ratio = 0.63; // typical card aspect
  const height = width * ratio;
  const [internalFlipped, setInternalFlipped] = useState(flipped);
  useEffect(() => setInternalFlipped(flipped), [flipped]);
  // Track loading of BOTH faces — skeleton follows whichever is currently visible.
  // CRITICAL: check img.complete synchronously so cached/preloaded images render
  // INSTANTLY with no skeleton, no fade.
  const frontSrc = frontImageUrl || D.front || null;
  const backSrc  = backImageUrl  || D.back  || null;
  const isCached = (src) => {
    if (!src) return true;
    const img = new Image();
    img.src = src;
    return img.complete && img.naturalWidth > 0;
  };
  const [frontLoaded, setFrontLoaded] = useState(() => isCached(frontSrc));
  const [backLoaded,  setBackLoaded]  = useState(() => isCached(backSrc));
  useEffect(() => {
    if (!frontSrc) { setFrontLoaded(true); return; }
    if (isCached(frontSrc)) { setFrontLoaded(true); return; }
    setFrontLoaded(false);
    const img = new Image();
    img.onload = img.onerror = () => setFrontLoaded(true);
    img.src = frontSrc;
  }, [frontSrc]);
  useEffect(() => {
    if (!backSrc) { setBackLoaded(true); return; }
    if (isCached(backSrc)) { setBackLoaded(true); return; }
    setBackLoaded(false);
    const img = new Image();
    img.onload = img.onerror = () => setBackLoaded(true);
    img.src = backSrc;
  }, [backSrc]);
  const visibleLoaded = isFlipped ? backLoaded : frontLoaded;
  const isFlipped = internalFlipped;

  const dragRefFront = useRef(null);
  const dragRefBack = useRef(null);
  const [dragging, setDragging] = useState(null);

  const draggedRef = useRef(false);
  const handlePointerDown = (key, side = "recto") => (e) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(key);
    draggedRef.current = true;
    // recto fields live in renderFront (dragRefFront); verso fields live in renderBack (dragRefBack)
    const cardEl = side === "recto" ? dragRefFront.current : dragRefBack.current;
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const move = (ev) => {
      const x = ((ev.clientX - rect.left) / rect.width) * 100;
      const y = ((ev.clientY - rect.top) / rect.height) * 100;
      onMove && onMove(key, { x: Math.max(5, Math.min(95, x)), y: Math.max(8, Math.min(92, y)) });
    };
    const up = () => {
      setDragging(null);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      // clear flag on next tick so the click handler skips
      setTimeout(() => { draggedRef.current = false; }, 50);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const positions = (card && card.positions) || {};
  // When no card is provided (e.g. design carousel previews), don't render any text overlays.
  const fields = !card ? [] : [
    { key: "name",  show: card.afficher_nom || card.afficher_prenom,
      text: `${card.afficher_prenom ? card.prenom_affiche : ""} ${card.afficher_nom ? card.nom_affiche : ""}`.trim(),
      style: { fontSize: width * 0.062, fontWeight: 500, letterSpacing: "-0.01em" } },
    { key: "entreprise", show: card.afficher_entreprise,
      text: card.entreprise_affiche || window.CARDLY_DATA.entreprise.nom_entreprise,
      style: { fontSize: width * 0.038, fontWeight: 500, letterSpacing: "0.02em" } },
    { key: "poste", show: card.afficher_poste,
      text: card.poste_affiche,
      style: { fontSize: width * 0.034, color: "var(--gold)", letterSpacing: "0.04em" } },
    { key: "phone", show: card.afficher_telephone,
      text: card.telephone_affiche,
      icon: <Icon.Phone size={width * 0.034} />,
      style: { fontSize: width * 0.032 } },
    { key: "email", show: card.afficher_email,
      text: card.email_affiche,
      icon: <Icon.Mail size={width * 0.034} />,
      style: { fontSize: width * 0.032 } },
    { key: "web", show: card.afficher_site_web,
      text: card.site_web,
      icon: <Icon.Globe size={width * 0.034} />,
      style: { fontSize: width * 0.032 } },
  ];

  const inkColorBack = D.ink || "#2a241a";
  const getSide = (key) => (fieldSides && fieldSides[key]) || "recto";
  const fieldsForSide = (side) => fields.filter(f => f.show && f.text && getSide(f.key) === side);

  const renderField = (f, side) => {
    const pos = positions[f.key] || { x: 50, y: 50 };
    const sizeMul = (fieldSizes && fieldSizes[f.key]) || 1;
    const fontKey = (fieldFonts && fieldFonts[f.key]) || "default";
    const fontFamily = FONT_FAMILIES[fontKey];
    const baseFontSize = f.style.fontSize;
    return (
      <div
        key={f.key}
        className={`card-el ${editable ? "editable" : ""} ${dragging === f.key ? "dragging" : ""}`}
        onPointerDown={handlePointerDown(f.key, side)}
        style={{
          left: `${pos.x}%`, top: `${pos.y}%`,
          ...f.style,
          color: (fieldColors && fieldColors[f.key]) || f.style.color || inkColorBack,
          fontSize: baseFontSize * sizeMul,
          ...(fontFamily ? { fontFamily } : {}),
          display: "inline-flex", alignItems: "center", gap: 6,
        }}
      >
        {f.icon && <span style={{ opacity: 0.7 }}>{f.icon}</span>}
        <span>{f.text}</span>
      </div>
    );
  };

  const renderLogoOverlay = (draggable = false, side = "recto") => {
    if (!logoUrl) return null;
    if (logoSide === "recto" && side !== "recto") return null;
    if (logoSide === "verso" && side !== "verso") return null;
    const posKey = side === "verso" ? "logoVerso" : "logoRecto";
    const lp = positions[posKey] || positions.logo || { x: 18, y: 22 };
    const sideSize = side === "verso" ? logoSizeVerso : logoSizeRecto;
    const ls = width * 0.18 * (sideSize != null ? sideSize : (logoSize || 1));
    return (
      <div
        onPointerDown={draggable ? handlePointerDown(posKey, side) : undefined}
        className={draggable ? `${editable ? "editable" : ""} ${dragging === posKey ? "dragging" : ""}` : undefined}
        style={{
          position: "absolute", left: `${lp.x}%`, top: `${lp.y}%`,
          transform: "translate(-50%, -50%)",
          width: ls, height: ls,
          backgroundImage: `url(${logoUrl})`,
          backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center",
          cursor: draggable && editable ? (dragging === posKey ? "grabbing" : "grab") : "default",
          outline: draggable && editable ? "1px dashed transparent" : "none",
          transition: "outline-color 150ms",
        }}
        onMouseEnter={(e) => { if (draggable && editable) e.currentTarget.style.outlineColor = "rgba(184,138,62,0.6)"; }}
        onMouseLeave={(e) => { if (draggable && editable) e.currentTarget.style.outlineColor = "transparent"; }}
      />
    );
  };

  const renderFront = () => {
    // Non-flipped = RECTO (the face users see first)
    const rectoFields = fieldsForSide("recto");
    return (
      <div ref={dragRefFront} style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit" }}>
        {frontImageUrl ? (
          // Image custom (hero, upload) — chargement immédiat
          <img src={frontImageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} loading="eager" />
        ) : D.front ? (
          // Image de template — lazy + WebP/PNG fallback
          <WebpImg src={D.front} loading="lazy" />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: D.bg || "linear-gradient(135deg,#fff,#f6f3ec)" }}>
            <div style={{
              position: "absolute", bottom: "14%", left: "8%",
              fontFamily: "var(--font-mono)", fontSize: width * 0.025,
              color: D.ink, opacity: 0.7, letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}>{D.tag}</div>
            <div style={{
              position: "absolute", top: "50%", right: "10%",
              width: width * 0.18, height: 1,
              background: "linear-gradient(90deg, transparent, var(--gold))",
            }} />
            <div style={{
              position: "absolute", top: "50%", right: "10%",
              width: width * 0.06, height: width * 0.06,
              borderRadius: "50%", marginTop: -width * 0.03,
              background: "radial-gradient(circle at 30% 30%, var(--gold-2), var(--gold))",
              opacity: 0.5,
            }} />
          </div>
        )}
        {rectoFields.map(f => renderField(f, "recto"))}
        {renderLogoOverlay(editable, "recto")}
      </div>
    );
  };

  const renderBack = () => {
    // Flipped = VERSO (the face users see after flipping)
    const isDarkBg = D.style === "noir-gold" || D.style === "blue-corporate";
    const inkColor = D.ink || "#2a241a";
    const versoFields = fieldsForSide("verso");
    return (
      <div ref={dragRefBack} style={{
        position: "absolute", inset: 0,
        background: D.back ? "transparent" : (D.bg || "linear-gradient(135deg,#fff,#f6f3ec)"),
      }}>
        {backImageUrl && (
          // Image custom (hero, upload) — chargement immédiat
          <img src={backImageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} loading="eager" />
        )}
        {!backImageUrl && D.back && (
          // Image de template — lazy + WebP/PNG fallback
          <WebpImg src={D.back} loading="lazy" />
        )}
        {/* draggable text fields on verso */}
        {versoFields.map(f => renderField(f, "verso"))}
        {/* Logo overlay on verso — draggable */}
        {renderLogoOverlay(editable, "verso")}
        {/* QR — also draggable when editable */}
        {showQR && (() => {
          const qrPos = positions.qr || { x: 88, y: 82 };
          const qrSize = width * 0.16;
          return (
            <div
              onPointerDown={handlePointerDown("qr", "verso")}
              className={`${editable ? "editable" : ""} ${dragging === "qr" ? "dragging" : ""}`}
              style={{
                position: "absolute",
                left: `${qrPos.x}%`, top: `${qrPos.y}%`,
                transform: "translate(-50%, -50%)",
                width: qrSize, height: qrSize,
                background: `linear-gradient(45deg, ${inkColor} 25%, transparent 25%) 0 0/${width*0.018}px ${width*0.018}px,
                             linear-gradient(-45deg, ${inkColor} 25%, transparent 25%) 0 0/${width*0.018}px ${width*0.018}px,
                             linear-gradient(45deg, transparent 75%, ${inkColor} 75%) 0 0/${width*0.018}px ${width*0.018}px,
                             linear-gradient(-45deg, transparent 75%, ${inkColor} 75%) 0 0/${width*0.018}px ${width*0.018}px,
                             ${isDarkBg ? "rgba(255,255,255,0.92)" : "white"}`,
                borderRadius: 6,
                border: `2px solid ${isDarkBg ? "rgba(255,255,255,0.92)" : "white"}`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                cursor: editable ? (dragging === "qr" ? "grabbing" : "grab") : "default",
                outline: editable ? "1px dashed transparent" : "none",
                transition: "outline-color 150ms",
              }}
              onMouseEnter={(e) => { if (editable) e.currentTarget.style.outlineColor = "rgba(184,138,62,0.6)"; }}
              onMouseLeave={(e) => { if (editable) e.currentTarget.style.outlineColor = "transparent"; }}
            />
          );
        })()}
      </div>
    );
  };

  return (
    <div className={`scene-3d ${className}`} style={{ width, height, position: "relative" }}>
      {/* Skeleton shown only until the face the user is actually looking at is loaded */}
      {!visibleLoaded && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 5,
          borderRadius: 16,
          background: "linear-gradient(90deg, rgba(184,138,62,0.07) 25%, rgba(184,138,62,0.18) 50%, rgba(184,138,62,0.07) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}
      <div
        className={`card-floater ${float ? "floating" : ""}`}
        style={{ width, height, opacity: visibleLoaded ? 1 : 0, transition: "opacity 250ms ease" }}
      >
        <div
          className={`card-3d ${isFlipped ? "flipped" : ""} ${float ? "tilted" : ""}`}
          style={{ width, height, cursor: onFlip ? "pointer" : "default" }}
          onClick={() => { if (draggedRef.current) return; if (onFlip) onFlip(); }}
        >
          <div className="card-face">
            {renderFront()}
            <div className="card-overlay" />
            <div className="card-shine" />
          </div>
          <div className="card-face card-face-back">
            {renderBack()}
            <div className="card-overlay" />
            <div className="card-shine" />
          </div>
        </div>
      </div>
    </div>
  );
}
window.Card3D = Card3D;

// ---------- Floating badge (used around hero card) ----------
function FloatingBadge({ children, style, delay = 0 }) {
  return (
    <div className="glass" style={{
      position: "absolute",
      padding: "10px 14px",
      borderRadius: 999,
      fontSize: 13, fontWeight: 500,
      display: "inline-flex", alignItems: "center", gap: 8,
      animation: `float-soft 6s ease-in-out ${delay}s infinite`,
      ...style,
    }}>
      {children}
    </div>
  );
}
window.FloatingBadge = FloatingBadge;

// ---------- Section header ----------
function SectionHeader({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <div className="col gap-3" style={{ textAlign: align, alignItems: align === "center" ? "center" : "flex-start", maxWidth: 720, margin: align === "center" ? "0 auto" : undefined }}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2 className="serif" style={{ fontSize: "clamp(32px, 4.5vw, 52px)", lineHeight: 1.05, margin: 0, letterSpacing: "-0.02em", textWrap: "balance" }}>{title}</h2>
      {subtitle && <p className="muted" style={{ fontSize: 17, margin: 0, maxWidth: 580, textWrap: "pretty" }}>{subtitle}</p>}
    </div>
  );
}
window.SectionHeader = SectionHeader;

// ---------- LockedOverlay ----------
function LockedOverlay({ onUpgrade }) {
  return (
    <div className="locked-overlay">
      <div className="logo-mark" style={{ width: 44, height: 44, fontSize: 20, marginBottom: 14 }}>
        <Icon.Lock size={20} />
      </div>
      <h3 className="serif" style={{ fontSize: 22, margin: "4px 0 8px", letterSpacing: "-0.01em" }}>Essai gratuit terminé</h3>
      <p className="muted" style={{ fontSize: 14, margin: "0 0 16px", maxWidth: 320 }}>
        Choisissez un abonnement pour activer vos cartes et rendre vos QR codes fonctionnels.
      </p>
      <button className="btn btn-primary btn-sm" onClick={onUpgrade}>
        Choisir un abonnement <Icon.ArrowRight size={14} />
      </button>
    </div>
  );
}
window.LockedOverlay = LockedOverlay;

// ---------- Modal ----------
function Modal({ open, onClose, children, title }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="serif" style={{ fontSize: 24, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}
window.Modal = Modal;

// ---------- Hash router ----------
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || "/");
  useEffect(() => {
    const h = () => setHash(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  const navigate = useCallback((to) => {
    window.location.hash = to;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return [hash, navigate];
}
window.useHashRoute = useHashRoute;

Object.assign(window, { Icon, Logo, Card3D, FloatingBadge, SectionHeader, LockedOverlay, Modal, ToastProvider, useToast, useHashRoute });
