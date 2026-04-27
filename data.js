// Cardly Pro — mock data layer (shaped to match future Supabase schema)

window.CARDLY_DATA = (function() {
  const entreprise = {
    id: "ent-001",
    nom_entreprise: "Immo Costa",
    code_secret: "CARDLY-8K4P",
    plan: "team", // 'solo' | 'team' | 'enterprise'
    max_collaborateurs: 10,
    owner_id: "u-001",
    statut: "active",
  };

  const profileMe = {
    id: "u-001",
    nom: "Martin",
    prenom: "Lucas",
    telephone: "07 67 56 92 24",
    email: "contact.cardly@gmail.com",
    poste: "Directeur commercial",
    role: "admin", // 'admin' | 'collaborator'
    site_web: "immocosta.fr",
  };

  const collaborators = [
    { id: "u-002", prenom: "Emma", nom: "Laurent", email: "emma@immocosta.fr", poste: "Conseillère", leads: 42, statut: "actif", last_click: "Il y a 2h" },
    { id: "u-003", prenom: "Hugo", nom: "Bernard", email: "hugo@immocosta.fr", poste: "Commercial", leads: 31, statut: "actif", last_click: "Il y a 5h" },
    { id: "u-004", prenom: "Sofia", nom: "Garcia", email: "sofia@immocosta.fr", poste: "Agent immobilier", leads: 18, statut: "en_attente", last_click: "—" },
    { id: "u-005", prenom: "Nathan", nom: "Morel", email: "nathan@immocosta.fr", poste: "Commercial junior", leads: 9, statut: "actif", last_click: "Hier" },
  ];

  // 6 card design variants (used in landing carousel + Mes cartes)
  const cardDesigns = [
    {
      id: "design-blossom",
      label: "Blossom",
      style: "warm-ivory",
      front: "assets/card-front.png",
      back: "assets/card-back.png",
      ink: "#2a241a",
      tag: "Signature",
    },
    {
      id: "design-noir-or",
      label: "Noir & Or",
      style: "noir-gold",
      front: null, back: null,
      ink: "#f1deb6",
      bg: "linear-gradient(135deg, #18140e 0%, #2a2218 100%)",
      tag: "Premium",
    },
    {
      id: "design-violet",
      label: "Astra",
      style: "violet-future",
      front: null, back: null,
      ink: "#ffffff",
      bg: "linear-gradient(135deg, #6b5ec9 0%, #a892d6 60%, #d4c8ec 100%)",
      tag: "Futuriste",
    },
    {
      id: "design-bleu",
      label: "Méridien",
      style: "blue-corporate",
      front: null, back: null,
      ink: "#ffffff",
      bg: "linear-gradient(135deg, #1d3a5f 0%, #2f5a8a 100%)",
      tag: "Corporate",
    },
    {
      id: "design-lux",
      label: "Marbre",
      style: "luxe-immo",
      front: null, back: null,
      ink: "#2a241a",
      bg: "linear-gradient(135deg, #f5f0e6 0%, #e6dcc8 60%, #d4c5a4 100%)",
      tag: "Immobilier",
    },
    {
      id: "design-clean",
      label: "Atelier",
      style: "clean-white",
      front: null, back: null,
      ink: "#1a1815",
      bg: "linear-gradient(135deg, #ffffff 0%, #f6f3ec 100%)",
      tag: "Minimal",
    },
  ];

  // Current cards owned by current user
  const cards = [
    {
      id: "card-001",
      type: "enterprise",
      nom_carte: "Carte entreprise — Immo Costa",
      design: "design-blossom",
      // displayed fields
      nom_affiche: "Martin",
      prenom_affiche: "Lucas",
      entreprise_affiche: "Immo Costa",
      poste_affiche: "Directeur commercial",
      telephone_affiche: "07 67 56 92 24",
      email_affiche: "contact.cardly@gmail.com",
      site_web: "immocosta.fr",
      // visibility
      afficher_nom: true,
      afficher_prenom: true,
      afficher_entreprise: true,
      afficher_poste: true,
      afficher_telephone: true,
      afficher_email: true,
      afficher_site_web: true,
      // positions (% on back face)
      positions: {
        name:       { x: 70, y: 26 },
        entreprise: { x: 70, y: 36 },
        poste:      { x: 70, y: 46 },
        phone:      { x: 70, y: 60 },
        email:      { x: 70, y: 70 },
        web:        { x: 70, y: 80 },
      },
      is_default: true,
      statut: "active",
    },
    {
      id: "card-002",
      type: "personal",
      nom_carte: "Ma carte minimal",
      design: "design-clean",
      nom_affiche: "Martin",
      prenom_affiche: "Lucas",
      entreprise_affiche: "Immo Costa",
      poste_affiche: "Directeur commercial",
      telephone_affiche: "07 67 56 92 24",
      email_affiche: "lucas@immocosta.fr",
      site_web: "lucasmartin.fr",
      afficher_nom: true,
      afficher_prenom: true,
      afficher_entreprise: false,
      afficher_poste: true,
      afficher_telephone: true,
      afficher_email: true,
      afficher_site_web: true,
      positions: {
        name:       { x: 50, y: 28 },
        entreprise: { x: 50, y: 38 },
        poste:      { x: 50, y: 48 },
        phone:      { x: 50, y: 62 },
        email:      { x: 50, y: 72 },
        web:        { x: 50, y: 82 },
      },
      is_default: false,
      statut: "active",
    },
  ];

  return {
    entreprise, profileMe, collaborators, cardDesigns, cards,
    // helpers
    getDesign: (id) => cardDesigns.find(d => d.id === id) || cardDesigns[0],
    leadsThisMonth: 142,
    leadsLastMonth: 118,
    activeCollabs: 3,
  };
})();
